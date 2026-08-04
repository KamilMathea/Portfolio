let currentFeedbackIndex = 0;
let rotatingFeedbackData = [];

/**
 * Creates a copy of the feedback data array to keep the original array unchanged.
 */
function initRotatingData() {
    if (typeof feedbackData !== 'undefined') {
        rotatingFeedbackData = [...feedbackData];
    }
}

/**
 * Renders the rotated feedback cards list.
 */
function renderFeedbackCards() {
    const track = document.getElementById('feedback-track');
    if (!track) return;
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
    if (!dotsContainer) return;
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
        const currentY = window.scrollY;
        activeCard.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        window.scrollTo(0, currentY);
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
    dotsContainer?.addEventListener('click', (event) => {
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

    prevBtn?.addEventListener('click', () => setActiveFeedback('prev'));
    nextBtn?.addEventListener('click', () => setActiveFeedback('next'));
}

/**
 * Bundles feedback section rendering and event initialization.
 */
function initFeedback() {
    if (!document.getElementById('feedback-track')) return;

    initRotatingData();
    renderFeedbackCards();
    renderFeedbackDots();
    initFeedbackDotsEvents();
    initFeedbackNavigationEvents();

    setTimeout(scrollToCenterFeedback, 100);
}