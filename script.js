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
            currentSection = section.dataset.nav || section.getAttribute("id");
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

        const change = () => applyTheme(next);

        try {
            localStorage.setItem("theme", next);
        } catch (e) {}

        const canVT = typeof document.startViewTransition === "function" &&
            !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (!canVT) { change(); return; }

        // круг «разливается» от кнопки
        const r = themeToggle.getBoundingClientRect();
        const x = r.left + r.width / 2;
        const y = r.top + r.height / 2;
        const radius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );

        const root = document.documentElement;
        root.classList.add("theme-vt");

        const vt = document.startViewTransition(change);

        vt.ready.then(() => {
            root.animate(
                { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
                { duration: 750, easing: "cubic-bezier(0.22, 0.61, 0.36, 1)", pseudoElement: "::view-transition-new(root)" }
            );
        }).catch(() => {});

        vt.finished.finally(() => root.classList.remove("theme-vt"));

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
    "Смотреть код": "View code",
    "Демо-лендинг кофейни: меню с вкладками, отзывы и онлайн-бронирование столика.": "Demo landing page for a coffee shop: tabbed menu, reviews and online table booking.",
    "Демо-лендинг кофейни «Зерно»: меню, отзывы и онлайн-бронь столика. Проект вымышленный, сделан как пример работы.": "A demo landing page for the “Zerno” coffee shop: menu, reviews and online table booking. The project is fictional and made as a sample of my work.",
    "Дизайн и разработка": "Design and development",
    "Открыть демо": "Open demo",
    "Показать, как выглядит современный сайт для небольшого заведения: рассказать о кофейне, представить меню с ценами, собрать отзывы и принимать заявки на бронь столика прямо со страницы.": "To show what a modern website for a small venue looks like: tell the story of the coffee shop, present the menu with prices, collect reviews and take table booking requests right from the page.",
    "Одностраничный сайт на чистых HTML, CSS и JavaScript, без фреймворков. Тёплая тёмная палитра и шрифты Playfair Display и Inter. Меню переключается по вкладкам (кофе, чай и напитки, выпечка и десерты) и строится из данных на JavaScript, поэтому цены легко менять. Блоки плавно появляются при прокрутке, а на телефоне работает меню-бургер.": "A single-page site in plain HTML, CSS and JavaScript, no frameworks. A warm dark palette with Playfair Display and Inter fonts. The menu switches between tabs (coffee, tea and drinks, pastries and desserts) and is built from JavaScript data, so prices are easy to change. Blocks fade in on scroll and a burger menu works on phones.",
    "Готовая демо-страница, которая аккуратно выглядит на телефоне и на компьютере и учитывает настройку «уменьшить движение». Весь сайт лежит в одном файле и не использует сторонних библиотек, только шрифты. Форма брони работает в демо-режиме и ничего не отправляет; для реального заведения её можно подключить к почте или Telegram.": "A finished demo page that looks tidy on phones and desktops and respects the “reduce motion” setting. The whole site is a single file and uses no third-party libraries, only fonts. The booking form works in demo mode and sends nothing; for a real venue it can be connected to email or Telegram.",
    "Меню с тремя вкладками и ценами": "Menu with three tabs and prices",
    "Отзывы гостей": "Guest reviews",
    "Форма брони с проверкой имени и телефона": "Booking form with name and phone validation",
    "Адаптивная вёрстка и мобильное меню": "Responsive layout and a mobile menu",
    "Плавное появление блоков при прокрутке": "Blocks fading in on scroll",
    "Что внутри": "What is inside",
    "Услуги подробно": "Services in detail",
    "Блог": "Blog",
    "Ссылки": "Links",
    "Кейс": "Case study",
    "Подробнее об услугах": "More about services",
    "Визитка": "Business card",
    "Одностраничный сайт о вас или вашем деле.": "A one-page site about you or your business.",
    "Адаптивная вёрстка": "Responsive layout",
    "Форма обратной связи": "Contact form",
    "Базовое SEO и мета-теги": "Basic SEO and meta tags",
    "Публикация в сети": "Publishing online",
    "от … ₽": "from … ₽",
    "Обсудить": "Discuss",
    "Лендинг": "Landing page",
    "Продающая страница с анимациями и аналитикой.": "A selling page with animations and analytics.",
    "Популярный": "Popular",
    "Несколько смысловых блоков": "Several content blocks",
    "Анимации и интерактив": "Animations and interactivity",
    "Подключение формы и аналитики": "Form and analytics integration",
    "Оптимизация скорости": "Speed optimization",
    "Сайт под ключ": "Turnkey website",
    "Многостраничный проект от идеи до запуска.": "A multi-page project from idea to launch.",
    "Дизайн и структура с нуля": "Design and structure from scratch",
    "Несколько страниц и разделов": "Several pages and sections",
    "Домен, хостинг, публикация": "Domain, hosting, publishing",
    "Поддержка после запуска": "Support after launch",
    "Цены": "Pricing",
    "Ориентировочная стоимость. Точную цену называю после короткого обсуждения задачи.": "Approximate prices. I give the exact figure after a short discussion of the task.",
    "Нужно что-то другое: приложение, скрипт или автоматизация? Оценю индивидуально.": "Need something else: an app, a script or automation? I will estimate it individually.",
    "Все услуги подробно": "All services in detail",
    "Стек": "Stack",
    "Использую каждый день": "I use every day",
    "Изучаю и развиваю": "Learning and growing",
    "Мой путь": "My path",
    "С чего всё началось": "How it all started",
    "Здесь будет короткая история: как появился интерес к программированию.": "A short story will go here: how the interest in programming appeared.",
    "Первые проекты": "First projects",
    "Первые сайты, скрипты и программы: что получилось и чему научился.": "First websites, scripts and programs: what came out of them and what I learned.",
    "AI-assisted разработка": "AI-assisted development",
    "Работаю с ИИ как с инструментом: быстрее прототипы, больше готовых проектов.": "I use AI as a tool: faster prototypes and more finished projects.",
    "Сегодня": "Today",
    "Создаю сайты, приложения и автоматизацию, продолжаю учиться и беру новые проекты.": "I build websites, apps and automation, keep learning and take on new projects.",
    "Сколько это стоит?": "How much does it cost?",
    "Цена зависит от задачи: ориентиры есть в разделе «Цены». Точную стоимость называю после короткого обсуждения, до начала работы.": "The price depends on the task: you will find guidelines in the “Pricing” section. I name the exact cost after a short discussion, before work starts.",
    "Как быстро вы сделаете сайт?": "How fast can you build a website?",
    "Сроки зависят от объёма. Небольшие сайты и лендинги делаются быстро, а крупные проекты мы заранее разбиваем на этапы и фиксируем сроки.": "Timelines depend on scope. Small sites and landing pages are quick; larger projects are split into stages up front and the dates are agreed in advance.",
    "Что нужно от меня как от клиента?": "What do you need from me as a client?",
    "Рассказать о задаче и целях, прислать материалы (тексты, логотип, фото, примеры, которые нравятся) и быть на связи для согласований.": "Tell me about the task and goals, send materials (texts, logo, photos, examples you like) and stay in touch for approvals.",
    "Как проходит оплата?": "How does payment work?",
    "Условия обсуждаем заранее. Обычно работа делится на этапы, и оплата привязывается к ним: так спокойнее обеим сторонам.": "We agree on the terms in advance. Usually the work is split into stages and payment is tied to them, which is calmer for both sides.",
    "Что будет после запуска?": "What happens after launch?",
    "Помогаю опубликовать сайт, объясняю, как им пользоваться, и остаюсь на связи: могу исправить ошибки и внести небольшие доработки.": "I help publish the site, explain how to use it and stay in touch: I can fix bugs and make small improvements.",
    "Вы используете ИИ. Это надёжно?": "You use AI. Is that reliable?",
    "ИИ ускоряет работу, но структуру, логику и результат я контролирую сам: проверяю код, исправляю ошибки и отвечаю за итог.": "AI speeds up the work, but I control the structure, logic and result myself: I review the code, fix errors and take responsibility for the outcome.",
    "Вопросы": "FAQ",
    "Остались вопросы? Напишите мне, отвечу лично.": "Still have questions? Write to me, I will answer personally.",
    "Зависит от объёма, обсуждаем до старта": "Depends on scope, agreed before the start",
    "Адаптивный дизайн и вёрстка": "Responsive design and layout",
    "Анимации и интерактивные элементы": "Animations and interactive elements",
    "Форма обратной связи и аналитика": "Contact form and analytics",
    "Базовое SEO и публикация в сети": "Basic SEO and publishing online",
    "Смотреть проекты": "See projects",
    "Что входит": "What is included",
    "Срок": "Timeline",
    "Стоимость": "Price",
    "Разработка на Python, C# и C / C++": "Development in Python, C# and C / C++",
    "Инструменты под вашу конкретную задачу": "Tools built for your specific task",
    "Работа с данными и интеграции": "Data handling and integrations",
    "Инструкция по запуску и использованию": "Setup and usage instructions",
    "Разбор рутинных процессов": "Analysis of routine processes",
    "Скрипты и боты под задачу": "Scripts and bots for the task",
    "ИИ там, где он действительно помогает": "AI where it really helps",
    "Тестирование и помощь после запуска": "Testing and help after launch",
    "Что я делаю, что входит в работу и как выглядит процесс.": "What I do, what the work includes and what the process looks like.",
    "Есть задача? Давайте обсудим.": "Have a task? Let's discuss it.",
    "Расскажите, что нужно сделать, и я отвечу с оценкой сроков и стоимости.": "Tell me what needs to be done and I will reply with an estimate of time and cost.",
    "Написать мне": "Write to me",
    "Цены и пакеты": "Pricing and packages",
    "Роль": "Role",
    "Разработка и дизайн": "Development and design",
    "HTML / CSS · JavaScript": "HTML / CSS · JavaScript",
    "Год": "Year",
    "20XX": "20XX",
    "Ссылка": "Link",
    "Задача": "The task",
    "Здесь будет описание задачи: что нужно было сделать, для кого и зачем.": "The task description will go here: what needed to be done, for whom and why.",
    "Решение": "The solution",
    "Здесь будет рассказ о том, как я подошёл к задаче: структура, дизайн, технологии и сложные места.": "The story of how I approached the task will go here: structure, design, technologies and tricky parts.",
    "Результат": "The result",
    "Здесь появятся итоги: что получилось, цифры и отзывы, ссылки на сайт и код.": "The outcome will go here: what came out of it, figures and feedback, links to the site and the code.",
    "Все проекты": "All projects",
    "Проект в работе. Скоро здесь появится подробный рассказ: задача, решение и результат.": "Work in progress. A detailed story will appear here soon: the task, the solution and the result.",
    "Нужен похожий проект?": "Need a similar project?",
    "Расскажите о задаче, и я предложу решение и оценку сроков.": "Tell me about your task and I will suggest a solution and a time estimate.",
    "Другие проекты": "Other projects",
    "Читать": "Read",
    "Заметка": "Note",
    "Как я работаю с ИИ при разработке сайтов": "How I work with AI when building websites",
    "Короткий разбор того, как ИИ помогает ускорять разработку и где важно оставаться за рулём.": "A short look at how AI speeds up development and where it is important to stay in control.",
    "Разбор": "Breakdown",
    "От идеи до запуска: как я разбиваю задачу": "From idea to launch: how I break a task down",
    "Скоро здесь появится статья.": "An article will appear here soon.",
    "Инструменты": "Tools",
    "Инструменты, которые я использую каждый день": "Tools I use every day",
    "Короткие заметки о работе с ИИ, разработке и находках по пути.": "Short notes about working with AI, development and finds along the way.",
    "Весь блог": "All posts",
    "Черновик": "Draft",
    "Зачем мне ИИ": "Why I use AI",
    "ИИ помогает ускорять разработку: быстрее собирать прототипы, находить решения и работать с кодом. Но он остаётся инструментом, а не заменой понимания.": "AI helps speed up development: build prototypes faster, find solutions and work with code. But it remains a tool, not a substitute for understanding.",
    "Как выглядит мой процесс": "What my process looks like",
    "Формулирую идею и разбиваю её на этапы.": "I formulate the idea and break it into stages.",
    "Прошу ИИ помочь с прототипом или конкретным куском кода.": "I ask AI to help with a prototype or a specific piece of code.",
    "Читаю результат, проверяю и исправляю ошибки.": "I read the result, check it and fix errors.",
    "Адаптирую решение под задачу и довожу до запуска.": "I adapt the solution to the task and bring it to launch.",
    "Что я проверяю сам": "What I check myself",
    "Структуру проекта, логику работы и конечный результат. Для меня важно понимать, как работает решение, а не просто получить готовый код.": "The project structure, the logic and the final result. It matters to me to understand how the solution works, not just to get ready-made code.",
    "Итог": "Summary",
    "Это черновик заметки: скоро здесь появится полная версия с примерами и находками.": "This is a draft note: the full version with examples and findings will appear here soon.",
    "Написать на email": "Write an email",
    "Telegram": "Telegram",
    "Услуги и цены": "Services and pricing",
    "Главная страница": "Home page",
    "Открыт к проектам": "Open to projects",
    "Занят проектом": "Busy with a project",
    "Не на связи": "Away",
    "Обсуждаем задачу, цели и то, что должно получиться в итоге.": "We discuss the task, the goals and what the result should be.",
    "Набрасываю структуру и дизайн, согласуем всё до написания кода.": "I sketch the structure and design, and we agree on everything before any code is written.",
    "Пишу код с помощью ИИ и сам проверяю каждый этап.": "I write the code with the help of AI and check every stage myself.",
    "Тестирую, публикую и остаюсь на связи после запуска.": "I test, publish and stay in touch after the launch.",
    "Фото появится здесь": "Photo coming soon",
    "Проекты": "Projects",
    "Все": "All",
    "Автоматизация": "Automation",
    "Скоро": "Soon",
    "Демо": "Demo",
    "Код": "Code",
    "Лендинг для бизнеса": "Business landing page",
    "AI-ассистент": "AI assistant",
    "Telegram-бот": "Telegram bot",
    "Скрипт автоматизации": "Automation script",
    "Интернет-магазин": "Online store",
    "Приложение на Python": "Python application",
    "Проект в работе. Скоро здесь появится описание, скриншоты и ссылки.": "Work in progress. A description, screenshots and links will appear here soon.",
    "В этой категории пока нет проектов.": "No projects in this category yet.",
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

const SPOTLIGHT_SELECTOR = ".stat, .skill-item, .ai-item, .contact-action, .project-card, .price-card, .faq-item, .stack-tile, .svc-card, .post-card, .link-btn";

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

    document.querySelectorAll(".stat, .ai-item, .contact-action, .project-card").forEach(card => {

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
document.querySelectorAll(".stat, .ai-item, .contact-action, .bento-card, .ai-bottom, .project-card, .price-card, .faq-item, .stack-tile, .svc-card, .post-card, .link-btn").forEach(card => {
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
            box.classList.add("no-photo");
        });
    });
})();


/* =====================================================
   ПРОЕКТЫ: фильтр по категориям
===================================================== */
(function projectFilters() {
    const chips = document.querySelectorAll(".filter-chip");
    const cards = document.querySelectorAll(".project-card");
    const empty = document.getElementById("projectEmpty");
    if (!chips.length) return;

    chips.forEach(chip => {
        chip.addEventListener("click", () => {
            const f = chip.dataset.filter;
            chips.forEach(c => {
                const on = c === chip;
                c.classList.toggle("active", on);
                c.setAttribute("aria-pressed", on ? "true" : "false");
            });
            let shown = 0;
            cards.forEach(card => {
                const ok = f === "all" || card.dataset.tags.split(" ").includes(f);
                card.hidden = !ok;
                if (ok) {
                    shown++;
                    card.classList.remove("pop");
                    void card.offsetWidth;
                    card.classList.add("pop");
                }
            });
            if (empty) empty.hidden = shown > 0;
        });
    });
})();


/* =====================================================
   V6: линия процесса и заглушка фото
===================================================== */

/* --- Процесс и «Мой путь»: линия прорисовывается по мере скролла --- */
(function processLines() {
    const lists = Array.from(document.querySelectorAll(".process-list"));
    if (!lists.length) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ticking = false;

    function update() {
        ticking = false;
        const vh = window.innerHeight;
        const reach = vh * 0.62;
        lists.forEach(list => {
            const rect = list.getBoundingClientRect();
            if (rect.bottom < -50 || rect.top > vh + 50) {
                if (!reduce && rect.top > vh + 50) list.style.setProperty("--p", "0");
            }
            const p = reduce ? 1 : Math.min(1, Math.max(0, (reach - rect.top) / rect.height));
            list.style.setProperty("--p", p.toFixed(4));
            list.querySelectorAll(".process-step").forEach(step => {
                const dot = step.querySelector(".process-dot").getBoundingClientRect();
                step.classList.toggle("on", reduce || dot.top + dot.height / 2 < reach);
            });
        });
    }

    function onScroll() {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
})();


/* =====================================================
   СТАТУС: метка «Открыт к проектам» + местное время
   (статус меняется вручную: data-status="open | busy | away" в index.html)
===================================================== */
(function liveStatus() {
    const badges = document.querySelectorAll(".status");
    if (!badges.length) return;

    function render() {
        const now = new Date();
        badges.forEach(b => {
            const t = b.querySelector(".status-time");
            if (!t) return;
            let text;
            try {
                text = new Intl.DateTimeFormat("ru-RU", {
                    hour: "2-digit", minute: "2-digit", hour12: false,
                    timeZone: b.dataset.tz || undefined
                }).format(now);
            } catch (e) {
                text = now.toTimeString().slice(0, 5);
            }
            t.textContent = text;
            if (b.dataset.tzLabel) {
                const tz = document.createElement("span");
                tz.className = "status-tz";
                tz.textContent = " " + b.dataset.tzLabel;
                t.appendChild(tz);
            }
        });
    }

    // подсказка для компактной метки в шапке
    badges.forEach(b => {
        const txt = b.querySelector(".status-text");
        if (txt && b.classList.contains("status-header")) b.title = txt.textContent.trim();
    });

    render();
    // обновляем в начале каждой минуты
    setTimeout(function tick() {
        render();
        setInterval(render, 60000);
    }, (60 - new Date().getSeconds()) * 1000);
})();


/* =====================================================
   ПРОСМОТР КОДА: ссылки с data-code открывают окно с исходником
   (без перехода на GitHub; href остаётся запасным вариантом)
===================================================== */
(function codeViewer() {

    const TXT = {
        ru: { title: "Исходный код", copy: "Копировать", copied: "Код скопирован", close: "Закрыть",
              loading: "Загружаю код…", error: "Не удалось загрузить код.", gh: "Открыть на GitHub",
              demo: "Открыть демо", lines: "строк" },
        en: { title: "Source code", copy: "Copy", copied: "Code copied", close: "Close",
              loading: "Loading code…", error: "Could not load the code.", gh: "Open on GitHub",
              demo: "Open demo", lines: "lines" }
    };
    const L = () => TXT[currentLang()];

    let modal = null, body = null, lastFocus = null;
    const cache = {};
    let current = { path: "", src: "", gh: "" };

    function esc(s) {
        return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    /* Лёгкая подсветка: комментарии, строки, теги, ключевые слова */
    function highlight(src) {
        const re = /(&lt;!--[\s\S]*?--&gt;|\/\*[\s\S]*?\*\/|(?:^|[^:"'\w])\/\/[^\n]*)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`)|(&lt;\/?[a-zA-Z][\w-]*)|(\b(?:const|let|var|function|return|if|else|for|while|new|this|true|false|null|typeof|forEach)\b)/gm;

        const wrap = (cls, text) =>
            text.split("\n").map(p => p ? `<span class="${cls}">${p}</span>` : p).join("\n");

        return esc(src).replace(re, (m, com, str, tag, kw) => {
            if (com) {
                /* для «// …» захватывается один символ перед ним — не красим его */
                const lead = com.match(/^(?:[^\/&])/);
                if (lead && !com.startsWith("&lt;!--") && !com.startsWith("/*") && !com.startsWith("//")) {
                    return lead[0] + wrap("tk-c", com.slice(1));
                }
                return wrap("tk-c", com);
            }
            if (str) return wrap("tk-s", str);
            if (tag) return wrap("tk-t", tag);
            return wrap("tk-k", kw);
        });
    }

    function toLines(html) {
        return html.split("\n")
            .map(l => `<span class="cl">${l === "" ? "&#8203;" : l}</span>`)
            .join("");
    }

    function build() {
        modal = document.createElement("div");
        modal.className = "code-modal";
        modal.hidden = true;
        modal.setAttribute("role", "dialog");
        modal.setAttribute("aria-modal", "true");
        modal.setAttribute("aria-labelledby", "codeModalTitle");
        modal.innerHTML = `
            <div class="code-modal-backdrop" data-close></div>
            <div class="code-modal-box">
                <div class="code-modal-head">
                    <span class="cm-dots" aria-hidden="true"><i></i><i></i><i></i></span>
                    <span class="cm-title" id="codeModalTitle"></span>
                    <span class="cm-meta"></span>
                    <span class="cm-actions">
                        <button type="button" class="cm-btn" data-copy></button>
                        <a class="cm-btn" data-demo target="_blank" rel="noopener"></a>
                        <button type="button" class="cm-btn cm-close" data-close aria-label="Close">×</button>
                    </span>
                </div>
                <pre class="code-modal-body" tabindex="0"><code></code></pre>
            </div>`;
        document.body.appendChild(modal);
        body = modal.querySelector("code");

        modal.addEventListener("click", (e) => {
            if (e.target.closest("[data-close]")) close();
            else if (e.target.closest("[data-copy]")) copy();
        });

        document.addEventListener("keydown", (e) => {
            if (modal.hidden) return;
            if (e.key === "Escape") { close(); return; }
            if (e.key === "Tab") {
                const f = Array.from(modal.querySelectorAll("button, a[href], pre"))
                    .filter(el => !el.hidden && el.offsetParent !== null);
                if (!f.length) return;
                const first = f[0], last = f[f.length - 1];
                if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
                else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
            }
        });
    }

    function labels() {
        const t = L();
        modal.querySelector("[data-copy]").textContent = t.copy;
        modal.querySelector("[data-close]").setAttribute("aria-label", t.close);
        const demo = modal.querySelector("[data-demo]");
        demo.textContent = t.demo + " ↗";
        demo.href = current.path;
        modal.querySelector(".code-modal-box").setAttribute("aria-label", t.title);
    }

    function copy() {
        const done = () => showToast(L().copied);
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(current.src).then(done).catch(fallback);
        } else fallback();
        function fallback() {
            const ta = document.createElement("textarea");
            ta.value = current.src;
            ta.style.position = "fixed";
            ta.style.opacity = "0";
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand("copy"); done(); } catch (e) {}
            ta.remove();
        }
    }

    function close() {
        modal.hidden = true;
        document.documentElement.classList.remove("modal-open");
        if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    async function open(path, gh) {
        if (!modal) build();
        lastFocus = document.activeElement;
        current = { path, src: cache[path] || "", gh };
        labels();
        modal.querySelector(".cm-title").textContent = path;
        modal.querySelector(".cm-meta").textContent = "";
        body.innerHTML = `<span class="cm-note">${L().loading}</span>`;
        modal.hidden = false;
        document.documentElement.classList.add("modal-open");
        modal.querySelector("[data-close].cm-close").focus();

        try {
            if (!cache[path]) {
                const res = await fetch(path, { cache: "no-cache" });
                if (!res.ok) throw new Error(res.status);
                cache[path] = await res.text();
            }
            current.src = cache[path];
            body.innerHTML = toLines(highlight(cache[path]));
            modal.querySelector(".cm-meta").textContent =
                cache[path].split("\n").length + " " + L().lines;
            modal.querySelector(".code-modal-body").scrollTop = 0;
        } catch (err) {
            body.innerHTML = `<span class="cm-note">${L().error} <a href="${gh}" target="_blank" rel="noopener">${L().gh} ↗</a></span>`;
        }
    }

    document.addEventListener("click", (e) => {
        const a = e.target.closest("a[data-code]");
        if (!a || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        open(a.dataset.code, a.href);
    });
})();
