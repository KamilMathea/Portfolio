let currentLang = localStorage.getItem('selectedLanguage') || 'en';

/**
 * Updates text content for all elements with data-translate attributes.
 */
function translateTextElements() {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[currentLang]?.[key]) {
            element.innerHTML = translations[currentLang][key];
        }
    });
}

/**
 * Updates target attributes for elements with data-translate-attr.
 */
function translateAttributeElements() {
    const elements = document.querySelectorAll('[data-translate-attr]');
    elements.forEach(element => {
        const [attr, key] = element.getAttribute('data-translate-attr').split(':');
        if (translations[currentLang]?.[key]) {
            element.setAttribute(attr, translations[currentLang][key]);
        }
    });
}

/**
 * Updates active styling classes on EN/DE toggle spans.
 */
function updateLanguageButtonUI() {
    const langEn = document.getElementById('lang-en');
    const langDe = document.getElementById('lang-de');
    if (langEn && langDe) {
        langEn.classList.toggle('active', currentLang === 'en');
        langDe.classList.toggle('active', currentLang === 'de');
    }
}

/**
 * Toggles language between 'en' and 'de', saves state and updates UI.
 * Called directly via onclick="toggleLanguage()" in HTML.
 */
function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'de' : 'en';
    localStorage.setItem('selectedLanguage', currentLang);
    translateTextElements();
    translateAttributeElements();
    updateLanguageButtonUI();

    if (typeof onLanguageChange === 'function') {
        onLanguageChange();
    }
}

/**
 * Applies active language settings on initial page load.
 */
function initLanguage() {
    translateTextElements();
    translateAttributeElements();
    updateLanguageButtonUI();
}

document.addEventListener('DOMContentLoaded', initLanguage);

/**
 * Handles logo click logic on the main page.
 */
function handleLogoClick(event) {
    if (window.scrollY > 0) {
        event.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

/**
 * Sets up smooth scroll-to-top for logos when clicked on the index page.
 */
function initLogoClickBehavior() {
    const logos = document.querySelectorAll('.logo');
    const path = window.location.pathname;
    const isMainPage = path.endsWith('index.html') || path.endsWith('/') || path === '';

    if (!isMainPage) return;

    for (let i = 0; i < logos.length; i++) {
        logos[i].addEventListener('click', handleLogoClick);
    }
}