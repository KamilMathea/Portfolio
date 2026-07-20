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