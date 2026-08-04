/**
 * Closes the mobile navigation menu and restores background scrolling.
 */
function closeMobileMenu() {
    document.getElementById('burger-btn')?.classList.remove('is-active');
    document.getElementById('nav-menu')?.classList.remove('nav-active');
    document.getElementById('nav-overlay')?.classList.remove('is-active');
    document.body.classList.remove('no-scroll');
}

/**
 * Toggles the open/closed state of the mobile navigation menu.
 */
function toggleMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    const isOpening = !navMenu?.classList.contains('nav-active');

    if (!isOpening) return closeMobileMenu();

    document.getElementById('burger-btn')?.classList.add('is-active');
    navMenu?.classList.add('nav-active');
    document.getElementById('nav-overlay')?.classList.add('is-active');
    document.body.classList.add('no-scroll');
}

/**
 * Initializes the mobile navigation event listeners.
 */
function initBurgerMenu() {
    const burgerBtn = document.getElementById('burger-btn');
    const overlay = document.getElementById('nav-overlay');
    const links = document.querySelectorAll('#nav-menu a');

    burgerBtn?.addEventListener('click', toggleMobileMenu);
    overlay?.addEventListener('click', closeMobileMenu);
    links.forEach(link => link.addEventListener('click', closeMobileMenu));
}

document.addEventListener('DOMContentLoaded', initBurgerMenu);