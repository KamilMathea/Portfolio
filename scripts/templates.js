/**
 * Erzeugt das HTML für ein einzelnes Technologie-Icon.
 * @param {Object} tech - Das einzelne Technologie-Objekt aus dem Array
 * @returns {string} Ein HTML-Textbaustein
 */
function createTechIconTemplate(tech) {
    return `
        <div class="tech-icon-item">
            <img src="${tech.icon}" alt="${tech.name} Logo" width="20" height="20">
            <span>${tech.name}</span>
        </div>
    `;
}

/**
 * Aufgabe: Liefert das HTML-Template für eine Feedback-Karte in der Schleife.
 */
function createFeedbackCardTemplate(feedback, virtualIndex, realIndex, isActive) {
    const activeClass = isActive ? 'active' : '';
    return `
        <li class="feedback-card ${activeClass}" id="feedback-card-${virtualIndex}" data-real-index="${realIndex}">
            <p>"${feedback.text}"</p>
            <div class="feedback-person">
                <div class="white-separator"></div>
                <p>${feedback.author} - ${feedback.role}</p>
            </div>
        </li>
    `;
}

/**
 * Aufgabe: Liefert das HTML-Template für einen Indikator-Punkt.
 */
function createFeedbackDotTemplate(realIndex, isActive) {
    const activeClass = isActive ? 'active' : '';
    return `
        <span class="dot ${activeClass}" data-index="${realIndex}"></span>
    `;
}