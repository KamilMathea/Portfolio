let currentProjectIndex = 0;

/**
 * Renders the tech icons list into the DOM using the template.
 */
function renderTechIcons(techArray) {
    const techContainer = document.getElementById('modal-tech');
    if (!techContainer) return;
    techContainer.innerHTML = '';

    for (let i = 0; i < techArray.length; i++) {
        const tech = techArray[i];
        techContainer.innerHTML += createTechIconTemplate(tech);
    }
}

/**
 * Writes the project texts, images, and links into the HTML fields.
 */
function renderModalContent(project) {
    document.getElementById('modal-number').textContent = project.number;
    document.getElementById('modal-title').textContent = project.title;
    document.getElementById('modal-description').textContent = project.description[currentLang] || project.description.en;

    const imgElement = document.getElementById('modal-image');
    imgElement.src = project.image;
    imgElement.alt = `Screendesign ${project.title}`;

    document.getElementById('modal-github').href = project.github;
    document.getElementById('modal-live').href = project.live;
}

/**
 * Controls the flow when opening the modal (fetching data, rendering, displaying).
 */
function openProjectModal(index) {
    const dialog = document.getElementById('project-dialog');
    if (!dialog) return;

    currentProjectIndex = index;
    const project = projectsData[index];

    renderModalContent(project);
    renderTechIcons(project.tech);

    document.body.classList.add('no-scroll');
    dialog.showModal();
}

/**
 * Calculates the next project and opens it.
 */
function showNextProject() {
    let nextIndex = (currentProjectIndex + 1) % projectsData.length;
    openProjectModal(nextIndex);
}

/**
 * Displays the preview image on hover.
 */
function showHoverPreview(index) {
    const previewImg = document.getElementById('project-preview-img');
    const project = projectsData[index];

    if (project && project.image && previewImg) {
        previewImg.src = project.image;
        previewImg.alt = `preview for ${project.title}`;
        previewImg.classList.remove('preview-hidden');
        previewImg.classList.add('preview-visible');
    }
}

/**
 * Hides the preview image when hovering ends.
 */
function hideHoverPreview() {
    const previewImg = document.getElementById('project-preview-img');
    if (previewImg) {
        previewImg.classList.remove('preview-visible');
        previewImg.classList.add('preview-hidden');
    }
}

/**
 * Sets up all hover events for the preview images.
 */
function initHoverPreview() {
    const projectButtons = document.querySelectorAll('.project-dialog-btn');
    projectButtons.forEach((btn, index) => {
        btn.addEventListener('mouseenter', () => showHoverPreview(index));
        btn.addEventListener('mouseleave', hideHoverPreview);
    });
}

/**
 * Sets up all click events for the project modal.
 */
function initProjectModal() {
    const dialog = document.getElementById('project-dialog');
    const closeBtn = document.getElementById('close-modal');
    const nextBtn = document.getElementById('next-modal');
    const projectButtons = document.querySelectorAll('.project-dialog-btn');

    if (!dialog) return;

    projectButtons.forEach((btn, index) => {
        btn.addEventListener('click', () => openProjectModal(index));
    });

    closeBtn?.addEventListener('click', () => {
        document.body.classList.remove('no-scroll');
        dialog.close();
    });

    dialog.addEventListener('click', (event) => {
        if (event.target === dialog) {
            document.body.classList.remove('no-scroll');
            dialog.close();
        }
    });

    nextBtn?.addEventListener('click', showNextProject);
}