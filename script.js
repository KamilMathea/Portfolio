const dialog = document.getElementById('project-dialog');
const closeBtn = document.getElementById('close-modal');
const nextBtn = document.getElementById('next-modal');
const projectButtons = document.querySelectorAll('.project-dialog-btn');

let currentProjectIndex = 0;

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
 * Haupt-Startpunkt der Anwendung.
 */
function init() {
    initProjectModal();
    initHoverPreview();
}

init();