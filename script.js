const dialog = document.getElementById('project-dialog');
const closeBtn = document.getElementById('close-modal');
const nextBtn = document.getElementById('next-modal');
const projectButtons = document.querySelectorAll('.project-dialog-btn');

let currentProjectIndex = 0;
let currentFeedbackIndex = 0;
let rotatingFeedbackData = [];

/**
 * Aufgabe: Erstellt die Liste der Tech-Icons mithilfe des Templates 
 * und fügt sie in das DOM ein.
 */
function renderTechIcons(techArray) {
    const techContainer = document.getElementById('modal-tech');
    techContainer.innerHTML = '';

    for (let i = 0; i < techArray.length; i++) {
        const tech = techArray[i];
        techContainer.innerHTML += createTechIconTemplate(tech);
    }
}

/**
 * Aufgabe: Schreibt die Texte, Bilder und Links des Projekts in die HTML-Felder.
 */
function renderModalContent(project) {
    document.getElementById('modal-number').textContent = project.number;
    document.getElementById('modal-title').textContent = project.title;
    document.getElementById('modal-description').textContent = project.description;

    const imgElement = document.getElementById('modal-image');
    imgElement.src = project.image;
    imgElement.alt = `Screendesign der Anwendung ${project.title}`;

    document.getElementById('modal-github').href = project.github;
    document.getElementById('modal-live').href = project.live;
}

/**
 * Aufgabe: Steuert den Ablauf beim Öffnen (Daten holen, rendern, anzeigen).
 */
function openProjectModal(index) {
    currentProjectIndex = index;
    const project = projectsData[index];

    renderModalContent(project);
    renderTechIcons(project.tech);

    dialog.showModal();
}

/**
 * Aufgabe: Berechnet das nächste Projekt und öffnet es.
 */
function showNextProject() {
    let nextIndex = currentProjectIndex + 1;
    if (nextIndex >= projectsData.length) {
        nextIndex = 0;
    }
    openProjectModal(nextIndex);
}

/**
 * Aufgabe: Zeigt das entsprechende Vorschaubild beim Hovern an.
 */
function showHoverPreview(index) {
    const previewImg = document.getElementById('project-preview-img');
    const project = projectsData[index];

    if (project && project.image) {
        previewImg.src = project.image;
        previewImg.alt = `preview for ${project.title}`;
        previewImg.classList.remove('preview-hidden');
        previewImg.classList.add('preview-visible');
    }
}

/**
 * Aufgabe: Versteckt das Vorschaubild, wenn das Hovern endet.
 */
function hideHoverPreview() {
    const previewImg = document.getElementById('project-preview-img');
    previewImg.classList.remove('preview-visible');
    previewImg.classList.add('preview-hidden');
}

/**
 * Aufgabe: Richtet alle Hover-Ereignisse für die Vorschau-Bilder ein.
 */
function initHoverPreview() {
    projectButtons.forEach((btn, index) => {
        btn.addEventListener('mouseenter', () => showHoverPreview(index));
        btn.addEventListener('mouseleave', hideHoverPreview);
    });
}

/**
 * Aufgabe: Richtet alle Klick-Ereignisse (Event Listener) ein.
 */
function initProjectModal() {
    projectButtons.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            openProjectModal(index);
        });
    });

    closeBtn.addEventListener('click', () => {
        dialog.close();
    });

    dialog.addEventListener('click', (event) => {
        if (event.target === dialog) {
            dialog.close();
        }
    });

    nextBtn.addEventListener('click', showNextProject);
}

/**
 * Aufgabe: Erstellt eine Kopie des Daten-Arrays, damit das Haupt-Array unverändert bleibt.
 */
function initRotatingData() {
    rotatingFeedbackData = [...feedbackData];
}

/**
 * Aufgabe: Rendert die rotierte Feedback-Liste. 
 * Index 0 ist Links, Index 1 ist Aktiv (Mitte), Index 2 ist Rechts.
 */
function renderFeedbackCards() {
    const track = document.getElementById('feedback-track');
    track.innerHTML = '';

    for (let i = 0; i < rotatingFeedbackData.length; i++) {
        const item = rotatingFeedbackData[i];
        const realIndex = feedbackData.indexOf(item);
        const isActive = i === 1;

        track.innerHTML += createFeedbackCardTemplate(item, i, realIndex, isActive);
    }
}

/**
 * Aufgabe: Baut genau so viele Indikator-Punkte auf, wie es echte Feedbacks gibt.
 */
function renderFeedbackDots() {
    const dotsContainer = document.getElementById('dots-container');
    dotsContainer.innerHTML = '';

    for (let i = 0; i < feedbackData.length; i++) {
        const isActive = i === currentFeedbackIndex;
        dotsContainer.innerHTML += createFeedbackDotTemplate(i, isActive);
    }
}

/**
 * Aufgabe: Aktualisiert die Active-Klassen der Punkte.
 */
function updateFeedbackDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentFeedbackIndex);
    });
}

/**
 * Aufgabe: Scrollt sanft auf das mittlere Element (Index 1).
 */
function scrollToCenterFeedback() {
    const activeCard = document.getElementById('feedback-card-1');
    if (activeCard) {
        activeCard.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
}

/**
 * Aufgabe: Rotiert die Daten im Array nach links oder rechts.
 */
function setActiveFeedback(direction) {
    if (direction === 'next') {
        // Erstes Element entfernen und hinten anfügen
        const first = rotatingFeedbackData.shift();
        rotatingFeedbackData.push(first);
        currentFeedbackIndex = (currentFeedbackIndex + 1) % feedbackData.length;
    } else if (direction === 'prev') {
        // Letztes Element entfernen und vorne anfügen
        const last = rotatingFeedbackData.pop();
        rotatingFeedbackData.unshift(last);
        currentFeedbackIndex = (currentFeedbackIndex - 1 + feedbackData.length) % feedbackData.length;
    }

    renderFeedbackCards();
    updateFeedbackDots();
    scrollToCenterFeedback();
}

/**
 * Aufgabe: Rotiert die Daten so lange, bis der geklickte Dot im Zentrum (Position 1) liegt.
 */
function goToFeedbackByDot(targetRealIndex) {
    currentFeedbackIndex = targetRealIndex;
    const targetItem = feedbackData[targetRealIndex];

    // Rotiere das Array so lange, bis targetItem an Position 1 (Mitte) steht
    while (rotatingFeedbackData[1] !== targetItem) {
        const first = rotatingFeedbackData.shift();
        rotatingFeedbackData.push(first);
    }

    renderFeedbackCards();
    updateFeedbackDots();
    scrollToCenterFeedback();
}

/**
 * Aufgabe: Richtet die Klick-Events auf den Indikator-Punkten ein.
 */
function initFeedbackDotsEvents() {
    const dotsContainer = document.getElementById('dots-container');
    dotsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('dot')) {
            const index = parseInt(event.target.getAttribute('data-index'));
            goToFeedbackByDot(index);
        }
    });
}

/**
 * Aufgabe: Richtet die Klick-Events für die Navigations-Pfeile ein.
 */
function initFeedbackNavigationEvents() {
    const prevBtn = document.getElementById('prev-feedback-btn');
    const nextBtn = document.getElementById('next-feedback-btn');

    prevBtn.addEventListener('click', () => setActiveFeedback('prev'));
    nextBtn.addEventListener('click', () => setActiveFeedback('next'));
}

/**
 * Aufgabe: Bündelt das Rendering und die Initialisierung der Feedback-Sektion.
 */
function initFeedback() {
    initRotatingData();
    renderFeedbackCards();
    renderFeedbackDots();
    initFeedbackDotsEvents();
    initFeedbackNavigationEvents();

    setTimeout(scrollToCenterFeedback, 100);
}

/**
 * Haupt-Startpunkt der Anwendung.
 */
function init() {
    initProjectModal();
    initHoverPreview();
    initFeedback();
}

init();