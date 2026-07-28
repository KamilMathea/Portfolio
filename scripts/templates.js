/**
 * Creates HTML for a single technology icon.
 * @param {Object} tech - Technology object containing name and icon path
 * @returns {string} HTML string representing the tech item
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
 * Creates HTML for a single feedback card.
 * @param {Object} feedback - Feedback object containing text, author, and role
 * @param {number} virtualIndex - Index used for virtual carousel positioning
 * @param {number} realIndex - Original index of the feedback item
 * @param {boolean} isActive - Active state flag
 * @param {string} [lang='en'] - Selected language key ('en' or 'de')
 * @returns {string} HTML string for the feedback list item
 */
function createFeedbackCardTemplate(feedback, virtualIndex, realIndex, isActive, lang = 'en') {
    const activeClass = isActive ? 'active' : '';
    const text = feedback.text[lang] || feedback.text.en;
    const role = feedback.role[lang] || feedback.role.en;

    return `
        <li class="feedback-card ${activeClass}" id="feedback-card-${virtualIndex}" data-real-index="${realIndex}">
            <p>"${text}"</p>
            <div class="feedback-person">
                <div class="white-separator"></div>
                <p>${feedback.author} - ${role}</p>
            </div>
        </li>
    `;
}

/**
 * Creates HTML for a feedback carousel dot indicator.
 * @param {number} realIndex - Index of the corresponding feedback item
 * @param {boolean} isActive - Active state flag
 * @returns {string} HTML string for the indicator dot
 */
function createFeedbackDotTemplate(realIndex, isActive) {
    const activeClass = isActive ? 'active' : '';
    return `
        <span class="dot ${activeClass}" data-index="${realIndex}"></span>
    `;
}