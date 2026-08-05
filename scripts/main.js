/**
 * Initializes Animate On Scroll (AOS) library with custom settings.
 */
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 120
        });
    }
}

/**
 * Called automatically by script.js when language button is clicked.
 */
function onLanguageChange() {
    document.documentElement.lang = currentLang;
    
    renderFeedbackCards();

    const dialog = document.getElementById('project-dialog');
    if (dialog && dialog.open) {
        openProjectModal(currentProjectIndex);
    }
}

/**
 * Ensures smooth scrolling to the hash section after full page load.
 */
function handleInitialHashScroll() {
    if (!window.location.hash) return;

    setTimeout(() => {
        const targetElement = document.querySelector(window.location.hash);
        targetElement?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
}

window.addEventListener('load', handleInitialHashScroll);

/**
 * Main application entry point for index.html.
 */
function initMain() {
    initProjectModal();
    initHoverPreview();
    initFeedback();
    initContactForm();
    initLogoClickBehavior();
    initAOS();
}

document.addEventListener('DOMContentLoaded', initMain);