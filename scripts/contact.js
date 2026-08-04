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