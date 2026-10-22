/* =====================================================
   PORTFOLIO JAVASCRIPT
===================================================== */


/* =====================================================
   INTRO: заставка и общие флаги
===================================================== */

const prefersReduced =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const hoverCapable =
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* Функции, которые нужно вызвать при смене языка */
const langHooks = [];

/* Колбэки, которые ждут окончания заставки */
const introQueue = [];
let introFinished = false;

function onIntroDone(callback) {
    if (introFinished) {
        callback();
    } else {
        introQueue.push(callback);
    }
}

function finishIntro() {

    if (introFinished) return;
    introFinished = true;

    const loader = document.getElementById("loader");

    document.documentElement.classList.remove("is-loading");

    try {
        sessionStorage.setItem("loaded", "1");
    } catch (e) {}

    if (loader) {
        loader.classList.add("done");
        setTimeout(() => loader.remove(), 1200);
    }

    introQueue.splice(0).forEach(callback => callback());
}

(function startIntro() {

    const loader = document.getElementById("loader");

    /* Заставки нет (уже показывали в этой сессии / «уменьшить движение») */
    if (!loader || document.documentElement.classList.contains("no-loader")) {
        if (loader) loader.remove();
        finishIntro();
        return;
    }

    document.documentElement.classList.add("is-loading");

    const startedAt = performance.now();
    const MIN_TIME = 1400;

    const finishWhenReady = () => {
        const wait = Math.max(0, MIN_TIME - (performance.now() - startedAt));
        setTimeout(finishIntro, wait);
    };

    if (document.readyState === "complete") {
        finishWhenReady();
    } else {
        window.addEventListener("load", finishWhenReady, { once: true });
    }

    /* Страховка: заставка никогда не должна зависнуть */
    setTimeout(finishIntro, 4000);

})();


/* HEADER */

const header = document.getElementById("header");

if (header) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });
}


/* MOBILE MENU */

const menuButton = document.getElementById("menuButton");
const nav = document.getElementById("nav");
const navLinks = document.querySelectorAll(".nav-link");

if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
        nav.classList.toggle("open");
    });
}

navLinks.forEach(link => {
    link.addEventListener("click", () => {
        if (nav) {
            nav.classList.remove("open");
        }
    });
});


/* SCROLL ANIMATIONS */

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    revealObserver.unobserve(target);
                    /* Пока идёт заставка, блоки не показываем */
                    onIntroDone(() => target.classList.add("visible"));
                }
            });
        },
        { threshold: 0.15 }
    );

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

} else {

    revealElements.forEach(element => {
        element.classList.add("visible");
    });

}


/* ACTIVE NAVIGATION + «таблетка» под активным пунктом */

const sections = document.querySelectorAll("section[id]");
const navPill = document.getElementById("navPill");

let pillPlaced = false;

function movePill() {

    if (!navPill || !nav) return;

    const active = nav.querySelector(".nav-link.active");

    /* В мобильном меню таблетки нет */
    if (!active || window.matchMedia("(max-width: 900px)").matches) {
        navPill.style.opacity = "0";
        return;
    }

    /* Первый раз ставим без скольжения из угла */
    if (!pillPlaced) navPill.style.transition = "none";

    navPill.style.width = active.offsetWidth + "px";
    navPill.style.height = active.offsetHeight + "px";
    navPill.style.transform =
        "translate(" + active.offsetLeft + "px, " + active.offsetTop + "px)";
    navPill.style.opacity = "1";

    if (!pillPlaced) {
        pillPlaced = true;
        void navPill.offsetWidth;          // применить без анимации
        navPill.style.transition = "";
    }
}

let lastSection = "";

window.addEventListener("scroll", () => {

    let currentSection = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 200;
        const sectionHeight = section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight
        ) {
            currentSection = section.getAttribute("id");
        }

    });

    /* Между секциями (например, на ленте) оставляем прежнюю подсветку */
    if (!currentSection || currentSection === lastSection) return;
    lastSection = currentSection;

    navLinks.forEach(link => {
        link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${currentSection}`
        );
    });

    movePill();

}, { passive: true });

window.addEventListener("resize", movePill);
window.addEventListener("load", movePill);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(movePill);
langHooks.push(movePill);
movePill();


/* CURRENT YEAR */

const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


/* PARALLAX HERO (окно кода и карточки смещаются через --px / --py) */

const heroVisual = document.getElementById("heroVisual");

if (heroVisual && hoverCapable && !prefersReduced) {

    let parallaxFrame = null;
    let parallaxX = 0;
    let parallaxY = 0;

    window.addEventListener("pointermove", (event) => {

        parallaxX = (event.clientX / window.innerWidth - 0.5) * 40;
        parallaxY = (event.clientY / window.innerHeight - 0.5) * 40;

        if (!parallaxFrame) {
            parallaxFrame = requestAnimationFrame(() => {
                heroVisual.style.setProperty("--px", parallaxX.toFixed(1));
                heroVisual.style.setProperty("--py", parallaxY.toFixed(1));
                parallaxFrame = null;
            });
        }

    }, { passive: true });

}


/* THEME TOGGLE */

const themeToggle = document.getElementById("themeToggle");

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#fbf8f7" : "#141416");
}

function hasSavedTheme() {
    try {
        const t = localStorage.getItem("theme");
        return t === "light" || t === "dark";
    } catch (e) {
        return false;
    }
}

if (themeToggle) {

    themeToggle.addEventListener("click", () => {

        const next =
            document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";

        applyTheme(next);

        try {
            localStorage.setItem("theme", next);
        } catch (e) {}

    });

}

/* Пока пользователь сам не выбирал тему — следуем за системной */
if (window.matchMedia) {

    const systemTheme = window.matchMedia("(prefers-color-scheme: light)");

    const onSystemThemeChange = (event) => {
        if (!hasSavedTheme()) applyTheme(event.matches ? "light" : "dark");
    };

    if (systemTheme.addEventListener) {
        systemTheme.addEventListener("change", onSystemThemeChange);
    } else if (systemTheme.addListener) {
        systemTheme.addListener(onSystemThemeChange);   // старые Safari
    }
}


/* =====================================================
   LANGUAGE (RU / EN)
===================================================== */

const I18N = {
    "Перейти к содержимому": "Skip to content",
    "Главная": "Home",
    "Обо мне": "About",
    "Услуги": "Services",
    "Контакты": "Contact",
    "Создаю": "I build",
    "с помощью ИИ.": "with AI.",
    "Разработка веб-сайтов, приложений и цифровых решений с использованием искусственного интеллекта, программирования и современных технологий.":
        "Development of websites, applications and digital solutions using artificial intelligence, programming and modern technologies.",
    "Связаться": "Get in touch",
    "Технологий в работе": "Technologies",
    "Направлений": "Areas of work",
    "Способа связи": "Ways to reach me",
    "Эскендеров": "Eskenderov",
    "Я занимаюсь созданием и реализацией цифровых проектов с использованием современных технологий и искусственного интеллекта. Мне интересно превращать идеи в готовые веб-сайты, приложения и цифровые решения.":
        "I create and deliver digital projects using modern technologies and artificial intelligence. I enjoy turning ideas into finished websites, applications and digital solutions.",
    "ИИ помогает мне ускорять разработку, находить решения, работать с кодом, создавать интерфейсы и автоматизировать задачи. При этом я самостоятельно контролирую структуру проекта, его логику и конечный результат.":
        "AI helps me speed up development, find solutions, work with code, build interfaces and automate tasks. At the same time, I stay in control of the project's structure, logic and final result.",
    "Что я создаю": "What I create",
    "Создание проектов с использованием ИИ": "Building projects with the help of AI",
    "Современные сайты и интерактивные интерфейсы": "Modern websites and interactive interfaces",
    "C, C++, Python, C# и разработка алгоритмов": "C, C++, Python, C# and algorithm development",
    "Структура, дизайн и удобство интерфейсов": "Structure, design and usability of interfaces",
    "Автоматизация задач с помощью современных инструментов": "Task automation with modern tools",
    "Как я работаю": "How I work",
    "Я начинаю с идеи и разбиваю задачу на отдельные этапы. Использую ИИ как инструмент, который помогает быстрее создавать прототипы, работать с кодом и находить оптимальные варианты реализации.":
        "I start with an idea and break the task into stages. I use AI as a tool that helps me build prototypes faster, work with code and find the best way to implement things.",
    "После этого самостоятельно проверяю результат, исправляю ошибки и адаптирую проект под конкретную задачу. Для меня важно понимать принцип работы созданного решения, а не просто получить готовый код.":
        "After that I check the result myself, fix errors and adapt the project to the specific task. It matters to me to understand how the solution works, not just to get ready-made code.",
    "Мои цели": "My goals",
    "Моя цель — развиваться в современной разработке и создавать полноценные цифровые продукты с использованием искусственного интеллекта.":
        "My goal is to grow in modern development and to create complete digital products using artificial intelligence.",
    "Я хочу работать над более сложными проектами, развивать навыки программирования, веб-разработки и AI-assisted development, а также создавать собственные цифровые продукты.":
        "I want to work on more complex projects, improve my programming, web development and AI-assisted development skills, and build my own digital products.",
    "Использую": "I use",
    "Создаю цифровые решения": "I create digital solutions",
    "Использую искусственный интеллект как инструмент для разработки сайтов, приложений и других цифровых решений.":
        "I use artificial intelligence as a tool for developing websites, applications and other digital solutions.",
    "ИИ помогает ускорять разработку, находить решения, работать с кодом и создавать прототипы. При этом я самостоятельно контролирую структуру, логику и конечный результат проекта.":
        "AI helps speed up development, find solutions, work with code and create prototypes. At the same time, I stay in control of the structure, logic and final result of the project.",
    "Использование ИИ для работы с кодом, поиска решений, создания прототипов и ускорения разработки.":
        "Using AI to work with code, find solutions, create prototypes and speed up development.",
    "Создание современных сайтов, адаптивных интерфейсов и цифровых продуктов.":
        "Creating modern websites, responsive interfaces and digital products.",
    "Автоматизация задач и создание решений, которые позволяют работать быстрее и эффективнее.":
        "Automating tasks and building solutions that let you work faster and more efficiently.",
    "САЙТЫ И ЛЕНДИНГИ": "WEBSITES & LANDING PAGES",
    "Современные адаптивные сайты: от визитки до полноценной страницы проекта.":
        "Modern responsive websites: from a simple business card to a full project page.",
    "ПРИЛОЖЕНИЯ И СКРИПТЫ": "APPS & SCRIPTS",
    "Разработка программ и инструментов под вашу задачу с использованием ИИ.":
        "Development of programs and tools for your task using AI.",
    "АВТОМАТИЗАЦИЯ": "AUTOMATION",
    "Автоматизация рутинных процессов, чтобы вы тратили время на главное.":
        "Automation of routine processes so you can spend your time on what matters.",
    "Готовы обсудить": "Ready to discuss",
    "идею?": "your idea?",
    "Выберите удобный способ связи. Буду рад обсудить ваш проект, ответить на вопросы или просто познакомиться.":
        "Choose a convenient way to get in touch. I'd be glad to discuss your project, answer questions or simply get acquainted.",
    "Скопировать email": "Copy email",
    "Или напишите прямо здесь": "Or write right here",
    "Имя": "Name",
    "Сообщение": "Message",
    "Отправить": "Send"
};

const I18N_ATTRS = [
    { sel: "#menuButton", attr: "aria-label", ru: "Открыть меню", en: "Open menu" },
    { sel: "#themeToggle", attr: "aria-label", ru: "Переключить тему", en: "Toggle theme" },
    { sel: "#langToggle", attr: "aria-label", ru: "Сменить язык", en: "Switch language" },
    { sel: ".about-photo img", attr: "alt", ru: "Рабочее место разработчика", en: "Developer's workspace" },
    { sel: "#copyEmail", attr: "aria-label", ru: "Скопировать email в буфер обмена", en: "Copy email to clipboard" },
    { sel: "#cfName", attr: "placeholder", ru: "Как к вам обращаться", en: "How should I address you" },
    { sel: "#cfMessage", attr: "placeholder", ru: "Расскажите о вашей идее", en: "Tell me about your idea" },
    {
        sel: 'meta[name="description"]', attr: "content",
        ru: "ESKENDEROV — персональный сайт разработчика. AI-assisted development, веб-разработка, программирование и создание цифровых решений с использованием искусственного интеллекта.",
        en: "ESKENDEROV — personal website of a developer. AI-assisted development, web development, programming and digital solutions built with artificial intelligence."
    }
];

/* Заголовки, которые появляются по словам */
const WORD_ROOTS = ".section-heading h2, .about-intro h3, .ai-intro h3, .contact-cta h3";

/* Собирает слова внутри wrapper: каждое слово — отдельный элемент для анимации */
function buildWords(wrapper, text, lead, trail, offset) {

    const words = text.trim().split(/\s+/);

    wrapper.textContent = "";

    if (lead) wrapper.appendChild(document.createTextNode(lead));

    words.forEach((word, i) => {
        const el = document.createElement("i");
        el.className = "word";
        el.style.setProperty("--i", offset + i);
        el.textContent = word;
        wrapper.appendChild(el);

        if (i < words.length - 1) {
            wrapper.appendChild(document.createTextNode(" "));
        }
    });

    if (trail) wrapper.appendChild(document.createTextNode(trail));

    return words.length;
}

const i18nNodes = [];

(function collectTextNodes() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const wordNodes = [];
    const offsets = new Map();
    let node;
    while ((node = walker.nextNode())) {
        if (["SCRIPT", "STYLE"].includes(node.parentNode.nodeName)) continue;
        const key = node.nodeValue.replace(/\s+/g, " ").trim();
        let item = null;

        if (I18N[key]) {
            item = {
                node: node,
                ru: node.nodeValue,
                key: key,
                lead: node.nodeValue.match(/^\s*/)[0],
                trail: node.nodeValue.match(/\s*$/)[0]
            };
            i18nNodes.push(item);
        }

        const root = node.parentNode.closest(WORD_ROOTS);

        if (root && /\p{L}/u.test(node.nodeValue)) {
            wordNodes.push({ node: node, item: item, root: root });
        }
    }

    /* Разбиваем на слова после обхода, чтобы не ломать TreeWalker */
    wordNodes.forEach(entry => {

        const wrapper = document.createElement("i");
        wrapper.className = "split";

        const raw = entry.node.nodeValue;
        const offset = offsets.get(entry.root) || 0;

        const count = buildWords(
            wrapper,
            raw.replace(/\s+/g, " "),
            raw.match(/^\s*/)[0],
            raw.match(/\s*$/)[0],
            offset
        );

        offsets.set(entry.root, offset + count);
        entry.node.parentNode.replaceChild(wrapper, entry.node);

        if (entry.item) {
            entry.item.wrapper = wrapper;
            entry.item.offset = offset;
        }
    });
})();

const langToggle = document.getElementById("langToggle");

/* Русский — для ru и близких языков региона, для остальных — английский */
const RU_LANGS = ["ru", "be", "uk", "kk"];

function detectBrowserLang() {
    const list = (navigator.languages && navigator.languages.length)
        ? navigator.languages
        : [navigator.language || "ru"];

    const first = String(list[0] || "ru").toLowerCase().split("-")[0];

    return RU_LANGS.includes(first) ? "ru" : "en";
}

/* persist = false для автоопределения: выбор сохраняем только после клика */
function setLanguage(lang, persist = true) {

    i18nNodes.forEach(item => {

        if (item.wrapper) {
            buildWords(
                item.wrapper,
                lang === "en" ? I18N[item.key] : item.key,
                item.lead,
                item.trail,
                item.offset
            );
        } else {
            item.node.nodeValue =
                lang === "en" ? item.lead + I18N[item.key] + item.trail : item.ru;
        }

    });

    I18N_ATTRS.forEach(item => {
        const el = document.querySelector(item.sel);
        if (el) el.setAttribute(item.attr, lang === "en" ? item.en : item.ru);
    });

    document.documentElement.lang = lang;

    if (langToggle) {
        langToggle.textContent = lang === "en" ? "RU" : "EN";
    }

    langHooks.forEach(hook => hook(lang));

    if (persist) {
        try {
            localStorage.setItem("lang", lang);
        } catch (e) {}
    }
}

if (langToggle) {

    langToggle.addEventListener("click", () => {
        setLanguage(document.documentElement.lang === "en" ? "ru" : "en");
    });

    let savedLang = null;
    try {
        savedLang = localStorage.getItem("lang");
    } catch (e) {}

    if (savedLang !== "ru" && savedLang !== "en") {
        savedLang = null;
    }

    const startLang = savedLang || detectBrowserLang();

    if (startLang === "en") {
        setLanguage("en", false);
    }
}


/* =====================================================
   ANIMATED COUNTERS
===================================================== */

const reducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const counters = document.querySelectorAll("[data-count]");

function runCounter(el) {

    const target = Number(el.dataset.count);

    if (reducedMotion) {
        el.textContent = target;
        return;
    }

    const duration = 1400;
    const start = performance.now();

    function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased);
        if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
}

if ("IntersectionObserver" in window) {

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                runCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });

    counters.forEach(el => counterObserver.observe(el));

} else {

    counters.forEach(el => { el.textContent = el.dataset.count; });

}


/* =====================================================
   TYPING EFFECT (заголовок в hero)
===================================================== */

const typedEl = document.getElementById("typedWord");

/* Слова, которые печатаются после «Создаю» / «I build» */
const TYPED_WORDS = {
    ru: ["сайты", "приложения", "скрипты", "автоматизацию"],
    en: ["websites", "apps", "scripts", "automation"]
};

let typedIndex = 0;
let typedChars = 0;
let typedDeleting = false;
let typedTimer = null;

function currentLang() {
    return document.documentElement.lang === "en" ? "en" : "ru";
}

function typedStep() {

    const words = TYPED_WORDS[currentLang()];
    const word = words[typedIndex % words.length];
    let delay;

    if (!typedDeleting) {

        typedChars++;
        typedEl.textContent = word.slice(0, typedChars);

        if (typedChars >= word.length) {
            typedDeleting = true;
            delay = 1800;       // пауза, когда слово напечатано
        } else {
            delay = 90;         // скорость печати
        }

    } else {

        typedChars--;
        typedEl.textContent = word.slice(0, typedChars);

        if (typedChars <= 0) {
            typedDeleting = false;
            typedIndex++;
            delay = 350;
        } else {
            delay = 45;         // скорость стирания
        }

    }

    typedTimer = setTimeout(typedStep, delay);
}

function typedRestart() {
    clearTimeout(typedTimer);
    typedChars = 0;
    typedDeleting = false;
    typedEl.textContent = "";
    typedTimer = setTimeout(typedStep, 400);
}

function typedShowStatic() {
    typedEl.textContent = TYPED_WORDS[currentLang()][0];
}

if (typedEl) {

    if (reducedMotion) {

        typedShowStatic();
        if (langToggle) langToggle.addEventListener("click", typedShowStatic);

    } else {

        typedEl.textContent = "";
        onIntroDone(() => {
            typedTimer = setTimeout(typedStep, 500);
        });
        if (langToggle) langToggle.addEventListener("click", typedRestart);

    }

}


/* =====================================================
   SPOTLIGHT (подсветка карточек под курсором)
===================================================== */

const SPOTLIGHT_SELECTOR = ".stat, .skill-item, .ai-item, .contact-action";

if (window.matchMedia("(hover: hover)").matches) {

    document.querySelectorAll(SPOTLIGHT_SELECTOR).forEach(card => {

        card.classList.add("spotlight");

        card.addEventListener("pointermove", (event) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty("--mx", (event.clientX - rect.left) + "px");
            card.style.setProperty("--my", (event.clientY - rect.top) + "px");
        });

    });

}


/* =====================================================
   SCROLL PROGRESS (полоска прогресса прокрутки)
===================================================== */

const progressBar = document.getElementById("scrollProgress");
let progressFrame = null;

function updateProgress() {

    progressFrame = null;

    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;

    if (progressBar) progressBar.style.transform = `scaleX(${progress})`;
}

function requestProgress() {
    if (!progressFrame) progressFrame = requestAnimationFrame(updateProgress);
}

window.addEventListener("scroll", requestProgress, { passive: true });
window.addEventListener("resize", requestProgress);
updateProgress();


/* =====================================================
   CODE WINDOW (код в hero печатается сам)
===================================================== */

/* [класс подсветки, текст] — каждая строка кода */
const CODE_LINES = [
    [["c", "# idea → result"]],
    [["k", "from "], ["", "ai "], ["k", "import "], ["f", "assist"]],
    [],
    [["k", "def "], ["f", "build"], ["", "(idea):"]],
    [["", "    code = "], ["f", "assist"], ["", "(idea)"]],
    [["", "    tests = "], ["f", "check"], ["", "(code)"]],
    [["", "    "], ["k", "return "], ["f", "review"], ["", "(code)"]],
    [],
    [["", "site = "], ["f", "build"], ["", "("], ["s", "\"your idea\""], ["", ")"]],
    [["c", "# ✓ ready"]]
];

const codeTyped = document.getElementById("codeTyped");
const codeBody = document.getElementById("codeBody");

if (codeTyped) {

    /* Плоский список символов с классом подсветки */
    const codeChars = [];

    CODE_LINES.forEach((line, index) => {
        line.forEach(([cls, text]) => {
            for (const ch of text) codeChars.push({ ch: ch, cls: cls });
        });
        if (index < CODE_LINES.length - 1) codeChars.push({ ch: "\n", cls: "" });
    });

    const escapeHtml = (ch) =>
        ch === "&" ? "&amp;" : ch === "<" ? "&lt;" : ch === ">" ? "&gt;" : ch;

    function renderCode(count) {

        let html = "";
        let currentClass = null;
        let buffer = "";

        const flush = () => {
            if (!buffer) return;
            html += currentClass
                ? `<span class="t-${currentClass}">${buffer}</span>`
                : buffer;
            buffer = "";
        };

        for (let i = 0; i < count; i++) {
            const item = codeChars[i];
            if (item.cls !== currentClass) {
                flush();
                currentClass = item.cls;
            }
            buffer += escapeHtml(item.ch);
        }

        flush();
        codeTyped.innerHTML = html;
    }

    let codeCount = 0;

    function codeStep() {

        codeCount++;
        renderCode(codeCount);

        if (codeCount >= codeChars.length) {

            /* Пауза, затем плавно стираем и печатаем заново */
            setTimeout(() => {
                if (codeBody) codeBody.classList.add("fading");
                setTimeout(() => {
                    codeCount = 0;
                    renderCode(0);
                    if (codeBody) codeBody.classList.remove("fading");
                    setTimeout(codeStep, 500);
                }, 450);
            }, 6500);

            return;
        }

        const ch = codeChars[codeCount - 1].ch;
        const delay = ch === "\n" ? 280 : 20 + Math.random() * 34;

        setTimeout(codeStep, delay);
    }

    if (prefersReduced) {
        renderCode(codeChars.length);
    } else {
        onIntroDone(() => setTimeout(codeStep, 500));
    }
}


/* =====================================================
   CURSOR GLOW (мягкое свечение за курсором)
===================================================== */

const cursorGlow = document.getElementById("cursorGlow");

if (cursorGlow && hoverCapable && !prefersReduced) {

    let glowFrame = null;
    let glowX = 0;
    let glowY = 0;

    window.addEventListener("pointermove", (event) => {

        glowX = event.clientX;
        glowY = event.clientY;
        cursorGlow.classList.add("on");

        if (!glowFrame) {
            glowFrame = requestAnimationFrame(() => {
                cursorGlow.style.transform =
                    `translate3d(${glowX}px, ${glowY}px, 0)`;
                glowFrame = null;
            });
        }

    }, { passive: true });

    document.documentElement.addEventListener("mouseleave", () => {
        cursorGlow.classList.remove("on");
    });
}


/* =====================================================
   MAGNETIC BUTTONS (кнопки слегка тянутся к курсору)
===================================================== */

const magnets = (hoverCapable && !prefersReduced)
    ? Array.from(document.querySelectorAll(".button, .copy-btn"))
    : [];

if (magnets.length) {

    const MAGNET_RANGE = 70;     // с какого расстояния кнопка «замечает» курсор
    const MAGNET_PULL = 0.3;     // насколько сильно тянется
    const MAGNET_MAX = 12;       // максимум смещения, px

    const state = new Map();
    magnets.forEach(el => state.set(el, { x: 0, y: 0 }));

    let magnetFrame = null;
    let pointerX = -9999;
    let pointerY = -9999;

    const clamp = (value) => Math.max(-MAGNET_MAX, Math.min(MAGNET_MAX, value));

    function updateMagnets() {

        magnetFrame = null;

        magnets.forEach(el => {

            const rect = el.getBoundingClientRect();
            const current = state.get(el);

            /* Далеко за экраном — не считаем */
            if (rect.bottom < -MAGNET_RANGE || rect.top > window.innerHeight + MAGNET_RANGE) {
                return;
            }

            /* Центр кнопки без учёта текущего смещения */
            const centerX = rect.left + rect.width / 2 - current.x;
            const centerY = rect.top + rect.height / 2 - current.y;

            const dx = pointerX - centerX;
            const dy = pointerY - centerY;

            const outsideX = Math.max(Math.abs(dx) - rect.width / 2, 0);
            const outsideY = Math.max(Math.abs(dy) - rect.height / 2, 0);
            const near = Math.hypot(outsideX, outsideY) < MAGNET_RANGE;

            const x = near ? clamp(dx * MAGNET_PULL) : 0;
            const y = near ? clamp(dy * MAGNET_PULL) : 0;

            if (x !== current.x || y !== current.y) {
                current.x = x;
                current.y = y;
                el.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
            }
        });
    }

    window.addEventListener("pointermove", (event) => {
        pointerX = event.clientX;
        pointerY = event.clientY;
        if (!magnetFrame) magnetFrame = requestAnimationFrame(updateMagnets);
    }, { passive: true });

    document.documentElement.addEventListener("mouseleave", () => {
        pointerX = -9999;
        pointerY = -9999;
        updateMagnets();
    });
}


/* =====================================================
   3D TILT (лёгкий наклон карточек)
===================================================== */

if (hoverCapable && !prefersReduced) {

    document.querySelectorAll(".stat, .ai-item, .contact-action").forEach(card => {

        card.classList.add("tilt");

        const maxAngle = card.classList.contains("ai-item") ? 3 : 7;

        let tiltFrame = null;
        let lastEvent = null;

        card.addEventListener("pointermove", (event) => {

            lastEvent = event;

            if (tiltFrame) return;

            tiltFrame = requestAnimationFrame(() => {

                tiltFrame = null;

                const rect = card.getBoundingClientRect();
                const px = (lastEvent.clientX - rect.left) / rect.width - 0.5;
                const py = (lastEvent.clientY - rect.top) / rect.height - 0.5;

                card.style.setProperty("--ry", (px * 2 * maxAngle).toFixed(2) + "deg");
                card.style.setProperty("--rx", (-py * 2 * maxAngle).toFixed(2) + "deg");
            });
        });

        card.addEventListener("pointerleave", () => {
            card.style.setProperty("--rx", "0deg");
            card.style.setProperty("--ry", "0deg");
        });
    });
}


/* =====================================================
   TOAST + COPY EMAIL
===================================================== */

const UI_TEXT = {
    copied:   { ru: "Email скопирован",                       en: "Email copied" },
    copyFail: { ru: "Не удалось скопировать. Адрес: ",        en: "Couldn't copy. Address: " },
    sending:  { ru: "Отправляю…",                             en: "Sending…" },
    sent:     { ru: "Спасибо! Сообщение отправлено.",         en: "Thanks! Your message was sent." },
    failed:   { ru: "Не получилось отправить. Напишите на email или в Telegram.",
                en: "Couldn't send. Please email me or use Telegram." },
    mailto:   { ru: "Открываю почтовую программу…",           en: "Opening your email app…" },
    subject:  { ru: "Сообщение с сайта",                      en: "Message from your website" }
};

function ui(key) {
    return UI_TEXT[key][currentLang()];
}

const toastEl = document.getElementById("toast");
let toastTimer = null;

if (toastEl) {
    toastEl.innerHTML =
        '<svg class="ico" aria-hidden="true"><use href="#i-check"></use></svg><span></span>';
}

function showToast(text, kind) {

    if (!toastEl) return;

    toastEl.querySelector("span").textContent = text;
    toastEl.classList.toggle("error", kind === "error");
    toastEl.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2800);
}

async function copyText(text) {

    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (e) {}

    /* Запасной вариант для старых браузеров и http */
    try {
        const area = document.createElement("textarea");
        area.value = text;
        area.setAttribute("readonly", "");
        area.style.cssText = "position:fixed;top:0;left:0;opacity:0";
        document.body.appendChild(area);
        area.select();
        const ok = document.execCommand("copy");
        area.remove();
        return ok;
    } catch (e) {
        return false;
    }
}

const copyButton = document.getElementById("copyEmail");

if (copyButton) {

    let copiedTimer = null;

    copyButton.addEventListener("click", async () => {

        const email = copyButton.dataset.copy;
        const ok = await copyText(email);

        if (ok) {
            copyButton.classList.add("copied");
            showToast(ui("copied"));
            clearTimeout(copiedTimer);
            copiedTimer = setTimeout(() => copyButton.classList.remove("copied"), 2000);
        } else {
            showToast(ui("copyFail") + email, "error");
        }
    });
}


/* =====================================================
   CONTACT FORM
===================================================== */

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

let formStatusKey = "";
let formStatusKind = "";

function setFormStatus(key, kind) {

    formStatusKey = key;
    formStatusKind = kind || "";

    if (!formStatus) return;

    formStatus.textContent = key ? ui(key) : "";
    formStatus.className = "form-status" + (kind ? " " + kind : "");
}

/* При смене языка обновляем и текст статуса */
langHooks.push(() => {
    if (formStatusKey) setFormStatus(formStatusKey, formStatusKind);
});

if (contactForm) {

    contactForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        /* Скрытое поле-ловушка для ботов */
        if (contactForm.elements._gotcha && contactForm.elements._gotcha.value) return;

        const data = new FormData(contactForm);
        const name = String(data.get("name") || "").trim();
        const email = String(data.get("email") || "").trim();
        const message = String(data.get("message") || "").trim();

        const endpoint = (contactForm.dataset.endpoint || "").trim();
        const toEmail = contactForm.dataset.email;

        /* Без сервиса форм открываем письмо в почтовой программе */
        if (!endpoint) {

            const subject = encodeURIComponent(ui("subject") + " — " + name);
            const body = encodeURIComponent(message + "\n\n— " + name + " (" + email + ")");

            setFormStatus("mailto", "ok");
            window.location.href = `mailto:${toEmail}?subject=${subject}&body=${body}`;
            return;
        }

        const submit = contactForm.querySelector(".form-submit");

        if (submit) submit.classList.add("loading");
        setFormStatus("sending");

        try {

            const response = await fetch(endpoint, {
                method: "POST",
                body: data,
                headers: { Accept: "application/json" }
            });

            if (!response.ok) throw new Error("HTTP " + response.status);

            contactForm.reset();
            setFormStatus("sent", "ok");
            showToast(ui("sent"));

        } catch (error) {

            setFormStatus("failed", "error");

        } finally {

            if (submit) submit.classList.remove("loading");
        }
    });
}


/* =====================================================
   V4: бегущая рамка, фоновые слова, blur-up фото
===================================================== */

/* --- Бегущая рамка: добавляем .edge во все карточки --- */
document.querySelectorAll(".stat, .ai-item, .contact-action, .bento-card, .ai-bottom").forEach(card => {
    if (card.querySelector(":scope > .edge")) return;
    if (getComputedStyle(card).position === "static") card.style.position = "relative";
    const edge = document.createElement("i");
    edge.className = "edge";
    edge.setAttribute("aria-hidden", "true");
    card.appendChild(edge);
});

/* --- Фоновые слова: смещение при прокрутке --- */
(function bgWords() {
    const words = Array.from(document.querySelectorAll(".bg-word"));
    if (!words.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;

    function update() {
        ticking = false;
        const vh = window.innerHeight;
        words.forEach(word => {
            const sec = word.parentElement.getBoundingClientRect();
            if (sec.bottom < -200 || sec.top > vh + 200) return;
            // -1 .. 1: секция проходит экран
            const p = ((sec.top + sec.height / 2) - vh / 2) / (vh / 2 + sec.height / 2);
            const dir = Number(word.dataset.dir || 1);
            word.style.setProperty("--bwx", (p * -140 * dir).toFixed(1) + "px");
        });
    }

    function onScroll() {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
})();

/* --- Фото: скелетон, пока грузится, затем размытое появление --- */
(function photoBlurUp() {
    document.querySelectorAll(".about-photo").forEach(box => {
        const img = box.querySelector("img");
        if (!img || (img.complete && img.naturalWidth > 0)) return;

        box.classList.add("img-loading");

        const done = () => {
            box.classList.remove("img-loading");
            box.classList.add("img-ready");
        };
        img.addEventListener("load", done, { once: true });
        // первая ошибка (нет WebP) — inline onerror подставит JPG, ждём его;
        // если и JPG не загрузился — просто убираем скелетон
        let allowed = box.querySelector("source") ? 1 : 0;
        img.addEventListener("error", () => {
            if (allowed > 0) { allowed--; return; }
            box.classList.remove("img-loading");
        });
    });
})();
