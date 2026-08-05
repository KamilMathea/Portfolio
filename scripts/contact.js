/**
 * Validates email format against standard pattern.
 */
function isValidEmail(email) {
    return /^[^\s@]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/.test(email);
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
 * Validates input on blur and shows error placeholder if invalid and field was touched/not empty.
 */
function validateInputOnBlur(input, isValid) {
    if (!isValid && input.dataset.touched === 'true') {
        input.value = '';
        input.placeholder = getContactErrorText(input.id);
        input.classList.add('input-error');
    } else if (isValid) {
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
    input.addEventListener('focus', () => {
        const key = `contact_placeholder_${input.id}`;
        input.placeholder = translations[currentLang]?.[key] || input.placeholder;
        input.classList.remove('input-error');
    });

    input.addEventListener('blur', () => {
        validateInputOnBlur(input, validationFn(input.value.trim()));
        updateSubmitBtnFn();
    });

    input.addEventListener('input', () => {
        input.dataset.touched = 'true';
        updateSubmitBtnFn();
    });
}

/**
 * Toggles disabled state on submit button.
 */
function toggleButtonState(submitBtn, isDisabled) {
    if (submitBtn) {
        submitBtn.disabled = isDisabled;
    }
}

/**
 * Sends contact form payload to the PHP backend.
 */
async function sendContactMail(payload) {
    const response = await fetch('send_mail.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    return response.ok;
}

/**
 * Displays temporary translated feedback message and re-enables submit button.
 */
function showContactFeedback(submitBtn) {
    const feedbackEl = document.getElementById('contact-feedback');
    if (!feedbackEl) return;
    translateTextElements();
    feedbackEl.classList.remove('d-none', 'fade-out');

    setTimeout(() => {
        feedbackEl.classList.add('fade-out');
        setTimeout(() => {
            feedbackEl.classList.add('d-none');
            toggleButtonState(submitBtn, false);
        }, 300);
    }, 4000);
}

/**
 * Validates input on blur and shows error placeholder if invalid and field was touched/edited.
 */
function validateInputOnBlur(input, isValid) {
    if (!isValid && input.dataset.touched === 'true') {
        input.value = '';
        input.placeholder = getContactErrorText(input.id);
        input.classList.add('input-error');
    } else if (isValid) {
        input.classList.remove('input-error');
    }
}

/**
 * Triggers validation placeholders for all form inputs on submit attempt.
 */
function validateAllFields(elements) {
    const fields = [elements.name, elements.email, elements.message];
    for (let i = 0; i < fields.length; i++) {
        fields[i].dataset.touched = 'true';
    }

    validateInputOnBlur(elements.name, elements.name.value.trim() !== '');
    validateInputOnBlur(elements.email, isValidEmail(elements.email.value.trim()));
    validateInputOnBlur(elements.message, elements.message.value.trim() !== '');
    togglePrivacyError(elements.privacy.checked);
}

/**
 * Handles form submit, validates input and triggers mail dispatch.
 */
async function handleFormSubmit(event, elements) {
    event.preventDefault();
    toggleButtonState(elements.submitBtn, true);
    if (!isFormFullyValid(elements.name, elements.email, elements.message, elements.privacy)) {
        validateAllFields(elements);
        toggleButtonState(elements.submitBtn, false);
        return;
    }
    const isSent = await sendContactMail({
        name: elements.name.value.trim(),
        email: elements.email.value.trim(),
        message: elements.message.value.trim()
    });
    if (isSent) {
        elements.form.reset();
        updateSubmitButtonState(elements.submitBtn, false);
        showContactFeedback(elements.submitBtn);
    } else {
        toggleButtonState(elements.submitBtn, false);
    }
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