const dialog = document.getElementById('project-dialog');
const closeBtn = document.getElementById('close-modal');
const nextBtn = document.getElementById('next-modal');
const projectButtons = document.querySelectorAll('.project-dialog-btn');

let currentProjectIndex = 0;
let currentFeedbackIndex = 0;
let rotatingFeedbackData = [];

/**
 * Called automatically by script.js when language button is clicked.
 */
function onLanguageChange() {
    renderFeedbackCards();
    if (dialog && dialog.open) {
        openProjectModal(currentProjectIndex);
    }
}

/**
 * Renders the tech icons list into the DOM using the template.
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
    currentProjectIndex = index;
    const project = projectsData[index];

    renderModalContent(project);
    renderTechIcons(project.tech);

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

    if (project && project.image) {
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
    previewImg.classList.remove('preview-visible');
    previewImg.classList.add('preview-hidden');
}

/**
 * Sets up all hover events for the preview images.
 */
function initHoverPreview() {
    projectButtons.forEach((btn, index) => {
        btn.addEventListener('mouseenter', () => showHoverPreview(index));
        btn.addEventListener('mouseleave', hideHoverPreview);
    });
}

/**
 * Sets up all click events for the project modal.
 */
function initProjectModal() {
    projectButtons.forEach((btn, index) => {
        btn.addEventListener('click', () => openProjectModal(index));
    });

    closeBtn.addEventListener('click', () => dialog.close());

    dialog.addEventListener('click', (event) => {
        if (event.target === dialog) dialog.close();
    });

    nextBtn.addEventListener('click', showNextProject);
}

/**
 * Creates a copy of the feedback data array to keep the original array unchanged.
 */
function initRotatingData() {
    rotatingFeedbackData = [...feedbackData];
}

/**
 * Renders the rotated feedback cards list.
 */
function renderFeedbackCards() {
    const track = document.getElementById('feedback-track');
    track.innerHTML = '';

    for (let i = 0; i < rotatingFeedbackData.length; i++) {
        const item = rotatingFeedbackData[i];
        const realIndex = feedbackData.indexOf(item);
        const isActive = i === 1;

        track.innerHTML += createFeedbackCardTemplate(item, i, realIndex, isActive, currentLang);
    }
}

/**
 * Builds indicator dots based on total feedback entries.
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
 * Updates active class states on indicator dots.
 */
function updateFeedbackDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentFeedbackIndex);
    });
}

/**
 * Scrolls smoothly to center the active feedback card.
 */
function scrollToCenterFeedback() {
    const activeCard = document.getElementById('feedback-card-1');
    if (activeCard) {
        activeCard.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
}

/**
 * Rotates feedback data array elements left or right.
 */
function setActiveFeedback(direction) {
    if (direction === 'next') {
        const first = rotatingFeedbackData.shift();
        rotatingFeedbackData.push(first);
        currentFeedbackIndex = (currentFeedbackIndex + 1) % feedbackData.length;
    } else if (direction === 'prev') {
        const last = rotatingFeedbackData.pop();
        rotatingFeedbackData.unshift(last);
        currentFeedbackIndex = (currentFeedbackIndex - 1 + feedbackData.length) % feedbackData.length;
    }

    renderFeedbackCards();
    updateFeedbackDots();
    scrollToCenterFeedback();
}

/**
 * Rotates data until selected dot item is placed in the center position.
 */
function goToFeedbackByDot(targetRealIndex) {
    currentFeedbackIndex = targetRealIndex;
    const targetItem = feedbackData[targetRealIndex];

    while (rotatingFeedbackData[1] !== targetItem) {
        const first = rotatingFeedbackData.shift();
        rotatingFeedbackData.push(first);
    }

    renderFeedbackCards();
    updateFeedbackDots();
    scrollToCenterFeedback();
}

/**
 * Sets up click events for indicator dots.
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
 * Sets up click events for feedback navigation arrows.
 */
function initFeedbackNavigationEvents() {
    const prevBtn = document.getElementById('prev-feedback-btn');
    const nextBtn = document.getElementById('next-feedback-btn');

    prevBtn.addEventListener('click', () => setActiveFeedback('prev'));
    nextBtn.addEventListener('click', () => setActiveFeedback('next'));
}

/**
 * Bundles feedback section rendering and event initialization.
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
 * Validates email format against standard pattern.
 */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Returns specific error message by form element ID and active language.
 */
function getContactErrorText(fieldId) {
    const errorMessages = {
        en: {
            name: "Oops! it seems your name is missing",
            email: "Hoppla! your email is required",
            message: "What do you need to develop?"
        },
        de: {
            name: "Oops! Dein Name fehlt noch",
            email: "Hoppla! Deine E-Mail wird benötigt",
            message: "Was kann ich für dich entwickeln?"
        }
    };
    const activeSet = errorMessages[currentLang] || errorMessages.en;
    return activeSet[fieldId] || (currentLang === 'de' ? "Dieses Feld ist erforderlich" : "This field is required");
}

/**
 * Validates input on blur and shows error placeholder if invalid.
 */
function validateInputOnBlur(input, isValid) {
    if (!isValid) {
        input.value = '';
        input.placeholder = getContactErrorText(input.id);
        input.classList.add('input-error');
    } else {
        input.classList.remove('input-error');
    }
}

/**
 * Checks if all contact form inputs and consent are valid.
 */
function isFormFullyValid(nameInput, emailInput, messageInput, privacyCheckbox) {
    const isNameValid = nameInput.value.trim() !== '';
    const isEmailValid = isValidEmail(emailInput.value.trim());
    const isMessageValid = messageInput.value.trim() !== '';
    return isNameValid && isEmailValid && isMessageValid && privacyCheckbox.checked;
}

/**
 * Toggles visibility of privacy policy error message.
 */
function togglePrivacyError(isAccepted) {
    const errorSpan = document.getElementById('privacy-error');
    if (errorSpan) {
        const errorText = currentLang === 'de' 
            ? 'Bitte akzeptiere die Datenschutzerklärung.' 
            : 'Please accept the privacy policy.';
        errorSpan.textContent = isAccepted ? '' : errorText;
    }
}

/**
 * Sets blur, focus, and input event listeners on form fields.
 */
function setupInputEvents(input, validationFn, updateSubmitBtnFn) {
    input.addEventListener('blur', () => {
        validateInputOnBlur(input, validationFn(input.value.trim()));
        updateSubmitBtnFn();
    });

    input.addEventListener('focus', () => {
        const key = `contact_placeholder_${input.id}`;
        input.placeholder = translations[currentLang]?.[key] || input.placeholder;
        input.classList.remove('input-error');
    });

    input.addEventListener('input', updateSubmitBtnFn);
}

/**
 * Handles form submit behavior, triggers input validations and checks privacy.
 */
function handleFormSubmit(event, elements) {
    event.preventDefault();
    validateInputOnBlur(elements.name, elements.name.value.trim() !== '');
    validateInputOnBlur(elements.email, isValidEmail(elements.email.value.trim()));
    validateInputOnBlur(elements.message, elements.message.value.trim() !== '');
    togglePrivacyError(elements.privacy.checked);
}

/**
 * Toggles active class on submit button based on form validity.
 */
function updateSubmitButtonState(submitBtn, isValid) {
    submitBtn.classList.toggle('btn-active', isValid);
}

/**
 * Attaches event listeners to form fields and submit handler.
 */
function attachFormEvents(elements, checkFormFn) {
    setupInputEvents(elements.name, val => val !== '', checkFormFn);
    setupInputEvents(elements.email, isValidEmail, checkFormFn);
    setupInputEvents(elements.message, val => val !== '', checkFormFn);
    
    elements.privacy.addEventListener('change', () => {
        togglePrivacyError(elements.privacy.checked);
        checkFormFn();
    });
    
    elements.form.addEventListener('submit', (e) => handleFormSubmit(e, elements));
}

/**
 * Initializes contact form elements and logic.
 */
function initContactForm() {
    const elements = {
        form: document.querySelector('#contact form'),
        name: document.getElementById('name'),
        email: document.getElementById('email'),
        message: document.getElementById('message'),
        privacy: document.getElementById('privacy'),
        submitBtn: document.getElementById('submit-btn')
    };

    if (!elements.submitBtn) return;

    const checkForm = () => {
        const isValid = isFormFullyValid(elements.name, elements.email, elements.message, elements.privacy);
        updateSubmitButtonState(elements.submitBtn, isValid);
    };

    attachFormEvents(elements, checkForm);
}

/**
 * Main application entry point for index.html.
 */
function initMain() {
    initProjectModal();
    initHoverPreview();
    initFeedback();
    initContactForm();
}

document.addEventListener('DOMContentLoaded', initMain);