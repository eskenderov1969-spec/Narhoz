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
