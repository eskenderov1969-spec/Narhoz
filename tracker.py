#!/usr/bin/env python3
"""Трекер расходов: консольное приложение на чистом Python (только стандартная библиотека).

Запуск на компьютере:
    python tracker.py add 450 еда "обед в кафе"
    python tracker.py list
    python tracker.py stats
    python tracker.py budget set еда 15000
    python tracker.py budget
    python tracker.py export расходы.csv

Этот же файл работает в демо на сайте: страница запускает его в браузере
через Pyodide (Python, собранный в WebAssembly).
"""

import argparse
import csv
import io
import json
import shlex
import sys
from collections import defaultdict
from contextlib import redirect_stderr, redirect_stdout
from dataclasses import asdict, dataclass
from datetime import date, datetime
from decimal import Decimal, InvalidOperation
from pathlib import Path

BAR_WIDTH = 24
WARN_AT = 0.8  # предупреждать, когда потрачено 80% лимита


# ---------------------------------------------------------------- данные

@dataclass
class Expense:
    id: int
    day: str          # YYYY-MM-DD
    amount: str       # храним как строку, считаем через Decimal (без ошибок округления)
    category: str
    note: str = ""

    @property
    def value(self) -> Decimal:
        return Decimal(self.amount)


class LedgerError(ValueError):
    """Понятная пользователю ошибка (неверная сумма, нет такой записи и т.д.)."""


def parse_amount(text: str) -> Decimal:
    try:
        value = Decimal(text.replace(",", ".").replace(" ", ""))
    except InvalidOperation:
        raise LedgerError(f"Не понимаю сумму «{text}». Пример: 450 или 99.90")
    if value <= 0:
        raise LedgerError("Сумма должна быть больше нуля.")
    return value.quantize(Decimal("0.01"))


def parse_day(text: str) -> date:
    try:
        return datetime.strptime(text, "%Y-%m-%d").date()
    except ValueError:
        raise LedgerError(f"Дата «{text}» не подходит. Формат: ГГГГ-ММ-ДД, например 2026-10-29")


def money(value: Decimal) -> str:
    """12345.5 -> '12 345,50 ₽' (если копеек нет, показываем целое)."""
    value = Decimal(value)
    whole = value == value.to_integral_value()
    text = f"{value:,.0f}" if whole else f"{value:,.2f}"
    return text.replace(",", " ").replace(".", ",") + " ₽"


def bar(part: Decimal, total: Decimal, width: int = BAR_WIDTH) -> str:
    if total <= 0:
        return "░" * width
    filled = round(width * float(part / total))
    filled = max(0, min(width, filled))
    return "█" * filled + "░" * (width - filled)


class Ledger:
    """Журнал расходов. Хранит записи в памяти и умеет читать/писать JSON."""

    def __init__(self, path=None):
        self.path = Path(path) if path else None
        self.expenses = []
        self.budgets = {}      # категория -> месячный лимит (строка)
        if self.path and self.path.exists():
            self.load(self.path.read_text(encoding="utf-8"))

    # --- сохранение
    def dumps(self) -> str:
        data = {"expenses": [asdict(e) for e in self.expenses], "budgets": self.budgets}
        return json.dumps(data, ensure_ascii=False, indent=2)

    def load(self, text: str) -> None:
        data = json.loads(text)
        self.expenses = [Expense(**item) for item in data.get("expenses", [])]
        self.budgets = dict(data.get("budgets", {}))

    def save(self) -> None:
        if self.path:
            self.path.write_text(self.dumps(), encoding="utf-8")

    # --- операции
    def add(self, amount: str, category: str, note: str = "", day=None) -> Expense:
        value = parse_amount(amount)
        category = category.strip().lower()
        if not category:
            raise LedgerError("Укажите категорию, например: еда, транспорт, дом.")
        when = parse_day(day) if day else date.today()
        new_id = max((e.id for e in self.expenses), default=0) + 1
        expense = Expense(new_id, when.isoformat(), str(value), category, note.strip())
        self.expenses.append(expense)
        self.save()
        return expense

    def remove(self, expense_id: int) -> Expense:
        for index, expense in enumerate(self.expenses):
            if expense.id == expense_id:
                removed = self.expenses.pop(index)
                self.save()
                return removed
        raise LedgerError(f"Записи №{expense_id} нет.")

    def select(self, month=None, category=None):
        items = self.expenses
        if month:
            items = [e for e in items if e.day.startswith(month)]
        if category:
            items = [e for e in items if e.category == category.lower()]
        return sorted(items, key=lambda e: (e.day, e.id))

    def set_budget(self, category: str, amount: str) -> Decimal:
        value = parse_amount(amount)
        self.budgets[category.strip().lower()] = str(value)
        self.save()
        return value

    def totals_by_category(self, items):
        totals = defaultdict(Decimal)
        for item in items:
            totals[item.category] += item.value
        return dict(sorted(totals.items(), key=lambda pair: pair[1], reverse=True))

    def totals_by_month(self, items):
        totals = defaultdict(Decimal)
        for item in items:
            totals[item.day[:7]] += item.value
        return dict(sorted(totals.items()))

    def to_csv(self) -> str:
        buffer = io.StringIO()
        writer = csv.writer(buffer)
        writer.writerow(["id", "дата", "сумма", "категория", "заметка"])
        for e in self.select():
            writer.writerow([e.id, e.day, e.amount, e.category, e.note])
        return buffer.getvalue()


# ---------------------------------------------------------------- вывод

def render_list(items) -> str:
    if not items:
        return "Записей нет. Добавьте первую: add 450 еда \"обед\""
    lines = [f"{'№':>3}  {'Дата':<10}  {'Сумма':>12}  {'Категория':<12}  Заметка", "-" * 60]
    for e in items:
        lines.append(f"{e.id:>3}  {e.day:<10}  {money(e.value):>12}  {e.category:<12}  {e.note}")
    lines.append("-" * 60)
    lines.append(f"Всего: {len(items)} шт. на {money(sum((e.value for e in items), Decimal(0)))}")
    return "\n".join(lines)


def render_stats(ledger: Ledger, month=None) -> str:
    items = ledger.select(month=month)
    if not items:
        return "Пока нечего считать: записей нет."
    total = sum((e.value for e in items), Decimal(0))
    days = {e.day for e in items}
    first, last = parse_day(min(days)), parse_day(max(days))
    span = (last - first).days + 1
    title = f"Статистика за {month}" if month else "Статистика за всё время"
    out = [title, "=" * len(title), f"Потрачено:        {money(total)}",
           f"Записей:          {len(items)}",
           f"В среднем в день: {money(total / span)}  (за {span} дн.)", "", "По категориям:"]
    width = max(len(name) for name in ledger.totals_by_category(items))
    for name, value in ledger.totals_by_category(items).items():
        share = value / total * 100
        out.append(f"  {name:<{width}}  {bar(value, total)}  {money(value):>12}  {share:>3.0f}%")
    months = ledger.totals_by_month(items)
    if len(months) > 1:
        out += ["", "По месяцам:"]
        biggest = max(months.values())
        for key, value in months.items():
            out.append(f"  {key}  {bar(value, biggest)}  {money(value):>12}")
    top = sorted(items, key=lambda e: e.value, reverse=True)[:3]
    out += ["", "Три самые крупные траты:"]
    for e in top:
        out.append(f"  {money(e.value):>12}  {e.category:<12} {e.note or '—'}  ({e.day})")
    return "\n".join(out)


def render_budgets(ledger: Ledger, month: str) -> str:
    if not ledger.budgets:
        return "Лимитов нет. Задайте: budget set еда 15000"
    spent = ledger.totals_by_category(ledger.select(month=month))
    out = [f"Бюджеты на {month}", "=" * 20]
    for name, limit_text in sorted(ledger.budgets.items()):
        limit = Decimal(limit_text)
        used = spent.get(name, Decimal(0))
        ratio = float(used / limit)
        mark = "  ПРЕВЫШЕН!" if ratio > 1 else "  близко к лимиту" if ratio >= WARN_AT else ""
        out.append(f"  {name:<12} {bar(min(used, limit), limit)}  {ratio * 100:>3.0f}%  "
                   f"{money(used)} из {money(limit)}{mark}")
    return "\n".join(out)


def demo_data(ledger: Ledger) -> int:
    """Заполняет журнал примерами за последние два месяца (для демо)."""
    today = date.today()
    this_month = today.replace(day=1)
    last_month = (this_month.replace(day=1) - (date.resolution)).replace(day=1)
    samples = [
        (last_month, 3, "34500", "дом", "аренда части квартиры"), (last_month, 5, "1280", "еда", "продукты"),
        (last_month, 9, "540", "транспорт", "проездной"), (last_month, 14, "2300", "развлечения", "кино и ужин"),
        (last_month, 21, "1760", "еда", "продукты на неделю"), (last_month, 26, "890", "здоровье", "аптека"),
        (this_month, 2, "34500", "дом", "аренда части квартиры"), (this_month, 3, "1450", "еда", "продукты"),
        (this_month, 4, "450", "еда", "обед в кафе"), (this_month, 6, "620", "транспорт", "такси"),
        (this_month, 8, "3200", "развлечения", "концерт"), (this_month, 10, "1980", "еда", "продукты на неделю"),
        (this_month, 12, "2790", "одежда", "кроссовки"), (this_month, 15, "380", "еда", "кофе и выпечка"),
    ]
    added = 0
    for base, day_number, amount, category, note in samples:
        when = base.replace(day=day_number)
        if when <= today:
            ledger.add(amount, category, note, when.isoformat())
            added += 1
    for category, limit in (("еда", "15000"), ("развлечения", "5000"), ("транспорт", "3000")):
        ledger.set_budget(category, limit)
    return added


# ---------------------------------------------------------------- команды

class _Parser(argparse.ArgumentParser):
    def error(self, message):      # не завершаем программу, а возвращаем понятный текст
        if "invalid choice" in message:
            text = "Неизвестная команда."
        elif "required" in message or "expected" in message:
            text = "Не хватает параметров."
        else:
            text = "Не получилось разобрать команду."
        raise LedgerError(f"{text} Список команд: help")


def build_parser() -> argparse.ArgumentParser:
    parser = _Parser(prog="tracker", description="Трекер расходов", add_help=False)
    sub = parser.add_subparsers(dest="command")

    p = sub.add_parser("add", add_help=False)
    p.add_argument("amount")
    p.add_argument("category")
    p.add_argument("note", nargs="*")
    p.add_argument("--date", dest="day")

    p = sub.add_parser("list", add_help=False)
    p.add_argument("--month")
    p.add_argument("--category")

    p = sub.add_parser("delete", add_help=False)
    p.add_argument("id", type=int)

    p = sub.add_parser("stats", add_help=False)
    p.add_argument("--month")

    p = sub.add_parser("budget", add_help=False)
    p.add_argument("action", nargs="?", choices=["set"])
    p.add_argument("category", nargs="?")
    p.add_argument("amount", nargs="?")

    p = sub.add_parser("export", add_help=False)
    p.add_argument("file", nargs="?")

    sub.add_parser("demo", add_help=False)
    sub.add_parser("help", add_help=False)
    return parser


HELP = """Команды:
  add СУММА КАТЕГОРИЯ [заметка] [--date ГГГГ-ММ-ДД]   добавить расход
  list [--month ГГГГ-ММ] [--category КАТЕГОРИЯ]       показать записи
  delete НОМЕР                                        удалить запись
  stats [--month ГГГГ-ММ]                             статистика с диаграммами
  budget set КАТЕГОРИЯ СУММА                          задать месячный лимит
  budget                                              состояние лимитов
  export [файл.csv]                                   выгрузить в CSV
  demo                                                заполнить примерами
  help                                                эта справка"""


def pull_option(argv, name):
    """Вынимает «--имя значение» (или «--имя=значение») из любого места списка.

    Нужно, чтобы дату можно было писать и до заметки, и после неё: argparse в
    разных версиях Python по-разному разбирает такие смешанные команды.
    """
    argv = list(argv)
    for index, item in enumerate(argv):
        if item == name:
            if index + 1 >= len(argv):
                raise LedgerError(f"После {name} нужно значение.")
            value = argv[index + 1]
            return value, argv[:index] + argv[index + 2:]
        if item.startswith(name + "="):
            return item.split("=", 1)[1], argv[:index] + argv[index + 1:]
    return None, argv


def execute(ledger: Ledger, argv) -> str:
    """Выполняет одну команду и возвращает текст ответа. Ошибки возвращает как текст."""
    if not argv:
        return HELP
    try:
        day = None
        if argv[0] == "add":
            day, argv = pull_option(argv, "--date")
        args = build_parser().parse_args(argv)
        if day:
            args.day = day
        current_month = date.today().strftime("%Y-%m")

        if args.command in (None, "help"):
            return HELP
        if args.command == "add":
            e = ledger.add(args.amount, args.category, " ".join(args.note), args.day)
            reply = f"Добавлено №{e.id}: {money(e.value)}, {e.category}, {e.day}"
            limit = ledger.budgets.get(e.category)
            if limit:
                used = ledger.totals_by_category(ledger.select(month=e.day[:7])).get(e.category, Decimal(0))
                if used > Decimal(limit):
                    reply += f"\nВнимание: лимит «{e.category}» превышен ({money(used)} из {money(Decimal(limit))})."
                elif used >= Decimal(limit) * Decimal(str(WARN_AT)):
                    reply += f"\nВнимание: по «{e.category}» потрачено {money(used)} из {money(Decimal(limit))}."
            return reply
        if args.command == "list":
            return render_list(ledger.select(month=args.month, category=args.category))
        if args.command == "delete":
            e = ledger.remove(args.id)
            return f"Удалено №{e.id}: {money(e.value)}, {e.category}"
        if args.command == "stats":
            return render_stats(ledger, args.month)
        if args.command == "budget":
            if args.action == "set":
                if not (args.category and args.amount):
                    raise LedgerError("Формат: budget set КАТЕГОРИЯ СУММА")
                value = ledger.set_budget(args.category, args.amount)
                return f"Лимит «{args.category.lower()}»: {money(value)} в месяц"
            return render_budgets(ledger, current_month)
        if args.command == "export":
            text = ledger.to_csv()
            if args.file:
                Path(args.file).write_text(text, encoding="utf-8")
                return f"Сохранено в {args.file}"
            return text.rstrip()
        if args.command == "demo":
            return f"Добавлено примеров: {demo_data(ledger)}. Попробуйте: stats"
    except LedgerError as error:
        return f"Ошибка: {error}"
    except SystemExit:
        return "Не получилось разобрать команду. Подсказка: help"
    return HELP


def run_line(ledger: Ledger, line: str) -> str:
    """Для демо в браузере: принимает строку как в терминале и возвращает ответ."""
    try:
        argv = shlex.split(line)
    except ValueError:
        return "Ошибка: незакрытая кавычка."
    buffer = io.StringIO()
    with redirect_stdout(buffer), redirect_stderr(buffer):
        result = execute(ledger, argv)
    return (buffer.getvalue() + result).rstrip()


def main(argv=None) -> int:
    ledger = Ledger(Path.home() / ".tracker.json")
    print(execute(ledger, list(sys.argv[1:] if argv is None else argv)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
