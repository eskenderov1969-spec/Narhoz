/* =====================================================
   RESET
===================================================== */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
}

body {
    font-family: Arial, Helvetica, sans-serif;
    background: #0a0a0a;
    color: #f5f5f5;
    line-height: 1.6;
    overflow-x: hidden;
}

a {
    color: inherit;
    text-decoration: none;
}

button,
input,
textarea {
    font: inherit;
}

/* =====================================================
   VARIABLES
===================================================== */

:root {
    --bg: #0a0a0a;
    --bg-light: #111111;
    --white: #f5f5f5;
    --gray: #999999;
    --dark-gray: #1d1d1d;
    --red: #e53935;
    --border: rgba(255, 255, 255, 0.1);
    --container: 1200px;
}

/* =====================================================
   COMMON
===================================================== */

.container {
    width: min(var(--container), calc(100% - 80px));
    margin: 0 auto;
}

.section {
    padding: 140px 0;
}

.section-heading {
    margin-bottom: 80px;
}

.section-number {
    color: var(--gray);
    font-size: 12px;
    letter-spacing: 3px;
    margin-bottom: 25px;
}

.section-heading h2,
.contact-info h2 {
    font-size: clamp(48px, 7vw, 90px);
    line-height: 0.95;
    font-weight: 700;
    letter-spacing: -4px;
}

.section-heading h2 span,
.contact-info h2 span {
    color: var(--gray);
}

/* =====================================================
   HEADER
===================================================== */

.header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    padding: 25px 0;
    transition: 0.4s ease;
}

.header.scrolled {
    background: rgba(10, 10, 10, 0.9);
    backdrop-filter: blur(15px);
    padding: 17px 0;
    border-bottom: 1px solid var(--border);
}

.header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.logo {
    font-size: 18px;
    font-weight: 800;
    letter-spacing: 2px;
}

.logo span {
    color: var(--red);
}

.nav {
    display: flex;
    align-items: center;
    gap: 35px;
}

.nav-link {
    position: relative;
    color: #aaa;
    font-size: 13px;
    transition: 0.3s;
}

.nav-link:hover,
.nav-link.active {
    color: white;
}

.nav-link::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -8px;
    width: 0;
    height: 1px;
    background: var(--red);
    transition: 0.3s;
}

.nav-link:hover::after,
.nav-link.active::after {
    width: 100%;
}

.menu-button {
    display: none;
    border: 0;
    background: transparent;
    cursor: pointer;
}

.menu-button span {
    display: block;
    width: 25px;
    height: 2px;
    background: white;
    margin: 5px;
}

/* =====================================================
   HERO
===================================================== */

.hero {
    min-height: 100vh;
    position: relative;
    display: flex;
    align-items: center;
    overflow: hidden;
}

.hero-background {
    position: absolute;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    right: -250px;
    top: 50%;
    transform: translateY(-50%);
    background: radial-gradient(
    circle,
    rgba(229, 57, 53, 0.15),
    transparent 65%
    );
    filter: blur(20px);
}

.hero-container {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    align-items: center;
    gap: 50px;
}

.hero-small {
    font-size: 12px;
    letter-spacing: 5px;
    color: var(--gray);
    margin-bottom: 25px;
}

.hero h1 {
    font-size: clamp(65px, 11vw, 150px);
    line-height: 0.85;
    letter-spacing: -8px;
    margin-bottom: 35px;
}

.hero h1 span {
    color: var(--red);
}

.hero h2 {
    max-width: 650px;
    font-size: clamp(28px, 4vw, 50px);
    line-height: 1.05;
    letter-spacing: -2px;
    margin-bottom: 25px;
}

.hero h2 span {
    color: var(--gray);
}

.hero-description {
    max-width: 550px;
    color: var(--gray);
    font-size: 16px;
    margin-bottom: 40px;
}

.hero-buttons {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
}

.button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 25px;
    min-height: 52px;
    padding: 0 28px;
    border: 1px solid transparent;
    cursor: pointer;
    transition: 0.3s;
    font-size: 13px;
    font-weight: 600;
}

.button-primary {
    background: white;
    color: black;
}

.button-primary:hover {
    background: var(--red);
    color: white;
    transform: translateY(-3px);
}

.button-secondary {
    border-color: var(--border);
}

.button-secondary:hover {
    background: white;
    color: black;
}

/* HERO VISUAL */

.hero-visual {
    position: relative;
    height: 500px;
}

.circle {
    position: absolute;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.12);
}

.circle-large {
    width: 430px;
    height: 430px;
    top: 20px;
    left: 20px;
    animation: rotate 20s linear infinite;
}

.circle-small {
    width: 250px;
    height: 250px;
    top: 110px;
    left: 110px;
    border-color: rgba(229, 57, 53, 0.4);
    animation: rotateReverse 12s linear infinite;
}

.hero-card {
    position: absolute;
    width: 240px;
    height: 280px;
    top: 110px;
    left: 105px;
    padding: 25px;
    background: rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(15px);
    border: 1px solid var(--border);
    transform: rotate(-8deg);
    transition: 0.5s;
}

.hero-card:hover {
    transform: rotate(0deg) scale(1.03);
}

.hero-card-number {
    color: var(--red);
    font-size: 13px;
}

.hero-card-line {
    height: 1px;
    width: 100%;
    background: var(--border);
    margin: 80px 0 20px;
}

.hero-card p {
    font-size: 12px;
    letter-spacing: 2px;
    line-height: 1.8;
}

.scroll-down {
    position: absolute;
    left: 40px;
    bottom: 35px;
    display: flex;
    align-items: center;
    gap: 15px;
    color: var(--gray);
    font-size: 10px;
    letter-spacing: 3px;
}

.scroll-line {
    width: 60px;
    height: 1px;
    background: var(--gray);
}

/* =====================================================
   ABOUT
===================================================== */

.about {
    background: #0d0d0d;
}

.about-intro {
    font-size: 25px !important;
    line-height: 1.4;
    color: white !important;
    margin-bottom: 30px;
}

/* =====================================================
   FOOTER
===================================================== */

.footer {
    border-top: 1px solid var(--border);
    padding: 30px 0;
}

.footer-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.footer p {
    color: var(--gray);
    font-size: 11px;
}

.back-top {
    width: 40px;
    height: 40px;
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.3s;
}

.back-top:hover {
    background: white;
    color: black;
}

/* =====================================================
   ANIMATIONS
===================================================== */

.reveal {
    opacity: 0;
    transform: translateY(40px);
    transition:
    opacity 0.8s ease,
    transform 0.8s ease;
}

.reveal.visible {
    opacity: 1;
    transform: translateY(0);
}

@keyframes rotate {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
}

@keyframes rotateReverse {
    from { transform: rotate(360deg); }
    to   { transform: rotate(0deg); }
}

/* =====================================================
   RESPONSIVE (общие)
===================================================== */

@media (max-width: 900px) {

    .container {
        width: min(var(--container), calc(100% - 40px));
    }

    .nav {
        position: fixed;
        top: 0;
        right: -100%;
        width: 280px;
        height: 100vh;
        background: #111;
        flex-direction: column;
        justify-content: center;
        gap: 30px;
        transition: 0.4s;
        border-left: 1px solid var(--border);
    }

    .nav.open {
        right: 0;
    }

    .menu-button {
        display: block;
        position: relative;
        z-index: 1001;
    }

    .hero-container {
        grid-template-columns: 1fr;
    }

    .hero-visual {
        display: none;
    }

    .contact-grid {
        grid-template-columns: 1fr;
        gap: 70px;
    }

}

@media (max-width: 600px) {

    .section {
        padding: 90px 0;
    }

    .section-heading {
        margin-bottom: 50px;
    }

    .section-heading h2,
.contact-info h2 {
        letter-spacing: -2px;
    }

    .hero h1 {
        font-size: 55px;
        letter-spacing: -4px;
    }

    .hero h2 {
        font-size: 30px;
    }

    .hero-description {
        font-size: 14px;
    }

    .scroll-down {
        left: 20px;
    }

    .footer-container {
        flex-direction: column;
        gap: 20px;
    }

}

/* =====================================================
   CONTACT DETAILS (базовые стили)
===================================================== */

.contact-details {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-top: 45px;
    max-width: 500px;
}

.contact-item {
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 18px 20px;
    border: 1px solid var(--border);
    background: rgba(255, 255, 255, 0.02);
    transition: 0.35s ease;
}

.contact-item:hover {
    border-color: rgba(229, 57, 53, 0.5);
    background: rgba(229, 57, 53, 0.04);
    transform: translateX(6px);
}

.contact-item-content {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.contact-item-content span,
.contact-location span {
    color: var(--gray);
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
}

.contact-item-content a {
    font-size: 15px;
    color: white;
    transition: 0.3s ease;
}

.contact-item-content a:hover {
    color: var(--red);
}

.contact-location {
    margin-top: 25px;
    padding: 22px 20px 0;
    border-top: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
}

@media (max-width: 600px) {

    .contact-details {
        margin-top: 35px;
    }

    .contact-item {
        padding: 16px;
    }

    .contact-location {
        padding-top: 20px;
    }

}

.contact-location {
    margin-top: 25px;
    padding-top: 25px;
    border-top: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.location-label {
    font-size: 12px;
    color: var(--gray);
    text-transform: uppercase;
    letter-spacing: 3px;
}

.location-value {
    font-family: "Helvetica Neue", Arial, sans-serif;
    font-size: 20px;
    font-weight: 300;
    letter-spacing: 5px;
    color: var(--white);
    text-transform: uppercase;
}

/* =========================
   ABOUT — NEW DESIGN
========================= */

.about-main {
    display: grid;
    grid-template-columns: 0.85fr 1.15fr;
    gap: 80px;
    align-items: start;
}

.about-photo {
    position: relative;
    overflow: hidden;
    background: var(--bg-light);
}

.about-photo::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 70px;
    height: 3px;
    background: var(--red);
    z-index: 2;
}

.about-photo img {
    display: block;
    width: 100%;
    height: 720px;
    object-fit: cover;
    filter: brightness(0.85);
    transition: transform 0.6s ease, filter 0.6s ease;
}

.about-photo:hover img {
    transform: scale(1.03);
    filter: brightness(1);
}

.about-role {
    margin-bottom: 14px;
    color: var(--gray);
    font-size: 12px;
    letter-spacing: 4px;
    text-transform: uppercase;
}

.about-intro h3 {
    margin: 0 0 30px;
    font-size: 46px;
    font-weight: 400;
    line-height: 1.1;
    letter-spacing: -1px;
}

.about-intro h3 span {
    color: var(--red);
}

.about-intro p:not(.about-role) {
    max-width: 700px;
    margin-bottom: 20px;
    color: var(--gray);
    font-size: 15px;
    line-height: 1.9;
}

.about-columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 50px;
    margin-top: 45px;
    padding-top: 35px;
    border-top: 1px solid var(--border);
}

.about-block-title {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 25px;
    color: var(--white);
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 3px;
    text-transform: uppercase;
}

.about-block-title span {
    display: block;
    width: 30px;
    height: 2px;
    background: var(--red);
}

.skill-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.skill-item {
    padding-bottom: 14px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.skill-item strong {
    display: block;
    margin-bottom: 5px;
    color: var(--white);
    font-size: 14px;
    font-weight: 400;
}

.skill-item small {
    color: #666;
    font-size: 11px;
    letter-spacing: 0.5px;
}

.about-block > p,
.about-goal p {
    margin-bottom: 15px;
    color: var(--gray);
    font-size: 14px;
    line-height: 1.8;
}

.about-goal {
    margin-top: 45px;
    padding-top: 35px;
    border-top: 1px solid var(--border);
}

.about-learning {
    margin-top: 40px;
    padding-top: 30px;
    border-top: 1px solid var(--border);
}

.learning-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.learning-tags span {
    padding: 9px 14px;
    border: 1px solid var(--border);
    border-radius: 2px;
    color: var(--gray);
    font-size: 11px;
    letter-spacing: 1px;
    transition: 0.3s ease;
}

.learning-tags span:hover {
    color: var(--white);
    border-color: var(--red);
}

@media (max-width: 900px) {

    .about-main {
        grid-template-columns: 1fr;
        gap: 45px;
    }

    .about-photo img {
        height: 500px;
    }

    .about-columns {
        grid-template-columns: 1fr;
        gap: 40px;
    }

    .about-intro h3 {
        font-size: 38px;
    }

}

@media (max-width: 600px) {

    .about-photo img {
        height: 400px;
    }

    .about-intro h3 {
        font-size: 32px;
    }

    .about-intro p:not(.about-role) {
        font-size: 14px;
    }

}

/* =====================================================
   AI DEVELOPMENT
===================================================== */

.ai-development {
    background: #0a0a0a;
}

.ai-main {
    display: grid;
    grid-template-columns: 0.85fr 1.15fr;
    gap: 80px;
    margin-top: 70px;
}

.ai-intro {
    max-width: 520px;
}

.ai-role {
    margin-bottom: 14px;
    color: var(--gray);
    font-size: 12px;
    letter-spacing: 4px;
    text-transform: uppercase;
}

.ai-intro h3 {
    margin: 0 0 30px;
    font-size: 46px;
    font-weight: 400;
    line-height: 1.1;
    letter-spacing: -1px;
}

.ai-intro h3 span {
    color: var(--red);
}

.ai-intro p:not(.ai-role) {
    max-width: 650px;
    margin-bottom: 20px;
    color: var(--gray);
    font-size: 15px;
    line-height: 1.9;
}

.ai-list {
    border-top: 1px solid var(--border);
}

.ai-item {
    display: grid;
    grid-template-columns: 50px 1fr;
    gap: 25px;
    padding: 30px 0;
    border-bottom: 1px solid var(--border);
}

.ai-number {
    padding-top: 3px;
    color: var(--red);
    font-size: 11px;
    letter-spacing: 2px;
}

.ai-item-content h3 {
    margin: 0 0 12px;
    color: var(--white);
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 2px;
}

.ai-item-content p {
    max-width: 550px;
    margin: 0;
    color: var(--gray);
    font-size: 13px;
    line-height: 1.8;
}

.ai-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 40px;
    margin-top: 70px;
    padding-top: 30px;
    border-top: 1px solid var(--border);
    color: var(--gray);
    font-size: 11px;
    letter-spacing: 3px;
}

.ai-flow {
    display: flex;
    align-items: center;
    gap: 18px;
}

.ai-flow i {
    color: #555;
    font-style: normal;
}

.ai-flow strong {
    color: var(--white);
    font-weight: 400;
}

@media (max-width: 900px) {

    .ai-main {
        grid-template-columns: 1fr;
        gap: 60px;
    }

    .ai-intro {
        max-width: 700px;
    }

    .ai-bottom {
        align-items: flex-start;
        flex-direction: column;
        gap: 25px;
    }

}

@media (max-width: 600px) {

    .ai-main {
        margin-top: 50px;
    }

    .ai-intro h3 {
        font-size: 32px;
    }

    .ai-intro p:not(.ai-role) {
        font-size: 14px;
    }

    .ai-item {
        grid-template-columns: 40px 1fr;
        gap: 15px;
        padding: 25px 0;
    }

    .ai-item-content h3 {
        font-size: 13px;
        line-height: 1.5;
    }

    .ai-flow {
        flex-wrap: wrap;
        gap: 12px;
        line-height: 1.8;
    }

}

/* =====================================================
   CONTACT
===================================================== */

.contact {
    background: #0d0d0d;
}

.contact-grid {
    display: grid;
    grid-template-columns: 0.9fr 1.1fr;
    gap: 120px;
    align-items: start;
}

.contact-info {
    max-width: 560px;
}

.contact-info h2 {
    margin: 25px 0 30px;
    font-size: 64px;
    font-weight: 400;
    line-height: 1.05;
    letter-spacing: -2px;
}

.contact-info h2 span {
    color: var(--red);
}

.contact-description {
    max-width: 500px;
    margin-bottom: 50px;
    color: var(--gray);
    font-size: 15px;
    line-height: 1.8;
}

.contact-details {
    border-top: 1px solid var(--border);
}

.contact-item {
    padding: 24px 0;
    border-bottom: 1px solid var(--border);
}

.contact-item-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 30px;
}

.contact-item-content span,
.location-label {
    color: var(--gray);
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
}

.contact-item-content a {
    color: var(--white);
    font-size: 14px;
    text-decoration: none;
    transition: color 0.3s ease;
}

.contact-item-content a:hover {
    color: var(--red);
}

.contact-location {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 0;
}

.location-value {
    color: var(--white);
    font-size: 14px;
}

.contact-cta {
    padding-top: 90px;
    max-width: 620px;
}

.contact-cta-label {
    margin-bottom: 20px;
    color: var(--gray);
    font-size: 11px;
    letter-spacing: 4px;
    text-transform: uppercase;
}

.contact-cta h3 {
    margin: 0 0 25px;
    color: var(--white);
    font-size: 46px;
    font-weight: 400;
    line-height: 1.1;
    letter-spacing: -1px;
}

.contact-cta h3 span {
    color: var(--red);
}

.contact-cta > p:not(.contact-cta-label) {
    max-width: 500px;
    margin-bottom: 45px;
    color: var(--gray);
    font-size: 14px;
    line-height: 1.9;
}

.contact-actions {
    border-top: 1px solid var(--border);
}

.contact-action {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 22px 0;
    border-bottom: 1px solid var(--border);
    color: var(--white);
    text-decoration: none;
    transition:
    padding-left 0.3s ease,
    color 0.3s ease;
}

.contact-action span {
    font-size: 14px;
    letter-spacing: 1px;
}

.contact-action strong {
    color: var(--red);
    font-size: 20px;
    font-weight: 400;
    transition: transform 0.3s ease;
}

.contact-action:hover {
    padding-left: 12px;
    color: var(--red);
}

.contact-action:hover strong {
    transform: translateX(6px);
}

/* =====================================================
   CONTACT RESPONSIVE
===================================================== */

@media (max-width: 900px) {

    .contact-grid {
        grid-template-columns: 1fr;
        gap: 70px;
    }

    .contact-cta {
        padding-top: 0;
        max-width: 700px;
    }

}

@media (max-width: 600px) {

    .contact-info h2 {
        font-size: 44px;
        letter-spacing: -1px;
    }

    .contact-description {
        margin-bottom: 40px;
        font-size: 14px;
    }

    .contact-item {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 155px;
        padding: 30px;
        border-bottom: 1px solid var(--border);
    }

    .contact-item-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 18px;
        width: 100%;
        text-align: center;
    }

    .contact-item-content span {
        display: block;
        width: 100%;
        color: var(--gray);
        font-size: 11px;
        letter-spacing: 3px;
        text-transform: uppercase;
        text-align: center;
    }

    .contact-item-content a {
        display: block;
        width: 100%;
        color: var(--white);
        font-size: 15px;
        font-weight: 400;
        text-decoration: none;
        text-align: center;
        transition: color 0.3s ease;
    }

    .contact-item-content a:hover {
        color: var(--red);
    }

    .contact-location {
        align-items: flex-start;
        flex-direction: column;
        gap: 10px;
    }

    .contact-cta h3 {
        font-size: 34px;
    }

    .contact-cta > p:not(.contact-cta-label) {
        font-size: 14px;
    }

    .contact-action {
        padding: 20px 0;
    }

}
