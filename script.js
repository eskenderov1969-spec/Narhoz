/* =====================================================
   PORTFOLIO JAVASCRIPT
===================================================== */


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
                    entry.target.classList.add("visible");
                    revealObserver.unobserve(entry.target);
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


/* ACTIVE NAVIGATION */

const sections = document.querySelectorAll("section[id]");

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

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === `#${currentSection}`) {
            link.classList.add("active");
        }

    });

});


/* CURRENT YEAR */

const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


/* PARALLAX HERO */

const heroVisual = document.querySelector(".hero-visual");

if (heroVisual) {

    window.addEventListener("mousemove", (event) => {

        const x = (window.innerWidth / 2 - event.clientX) / 50;
        const y = (window.innerHeight / 2 - event.clientY) / 50;

        heroVisual.style.transform = `translate(${x}px, ${y}px)`;

    });

}


/* THEME TOGGLE */

const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {

    themeToggle.addEventListener("click", () => {

        const root = document.documentElement;
        const next =
            root.getAttribute("data-theme") === "light" ? "dark" : "light";

        root.setAttribute("data-theme", next);

        try {
            localStorage.setItem("theme", next);
        } catch (e) {}

    });

}


/* =====================================================
   LANGUAGE (RU / EN)
===================================================== */

const I18N = {
    "Главная": "Home",
    "Обо мне": "About",
    "Услуги": "Services",
    "Контакты": "Contact",
    "Создаю цифровые проекты": "I build digital projects",
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
        "Choose a convenient way to get in touch. I'd be glad to discuss your project, answer questions or simply get acquainted."
};

const I18N_ATTRS = [
    { sel: "#menuButton", attr: "aria-label", ru: "Открыть меню", en: "Open menu" },
    { sel: "#themeToggle", attr: "aria-label", ru: "Переключить тему", en: "Toggle theme" },
    { sel: "#langToggle", attr: "aria-label", ru: "Сменить язык", en: "Switch language" },
    { sel: ".about-photo img", attr: "alt", ru: "Рабочее место разработчика", en: "Developer's workspace" },
    {
        sel: 'meta[name="description"]', attr: "content",
        ru: "ESKENDEROV — персональный сайт разработчика. AI-assisted development, веб-разработка, программирование и создание цифровых решений с использованием искусственного интеллекта.",
        en: "ESKENDEROV — personal website of a developer. AI-assisted development, web development, programming and digital solutions built with artificial intelligence."
    }
];

const i18nNodes = [];

(function collectTextNodes() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
        if (["SCRIPT", "STYLE"].includes(node.parentNode.nodeName)) continue;
        const key = node.nodeValue.replace(/\s+/g, " ").trim();
        if (I18N[key]) {
            i18nNodes.push({
                node: node,
                ru: node.nodeValue,
                key: key,
                lead: node.nodeValue.match(/^\s*/)[0],
                trail: node.nodeValue.match(/\s*$/)[0]
            });
        }
    }
})();

const langToggle = document.getElementById("langToggle");

function setLanguage(lang) {

    i18nNodes.forEach(item => {
        item.node.nodeValue =
            lang === "en" ? item.lead + I18N[item.key] + item.trail : item.ru;
    });

    I18N_ATTRS.forEach(item => {
        const el = document.querySelector(item.sel);
        if (el) el.setAttribute(item.attr, lang === "en" ? item.en : item.ru);
    });

    document.documentElement.lang = lang;

    if (langToggle) {
        langToggle.textContent = lang === "en" ? "RU" : "EN";
    }

    try {
        localStorage.setItem("lang", lang);
    } catch (e) {}
}

if (langToggle) {

    langToggle.addEventListener("click", () => {
        setLanguage(document.documentElement.lang === "en" ? "ru" : "en");
    });

    let savedLang = "ru";
    try {
        savedLang = localStorage.getItem("lang") || "ru";
    } catch (e) {}

    if (savedLang === "en") {
        setLanguage("en");
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
