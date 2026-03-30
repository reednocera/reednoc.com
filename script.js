document.addEventListener('DOMContentLoaded', () => {

    /* --- Intersection Observer for Scroll Animations --- */

    // Select elements to animate
    const cards = document.querySelectorAll('.concept-card');
    const authorSection = document.querySelector('.author-card');

    // Observer options
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of element is visible
    };

    // Observer callback
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the animation class
                entry.target.classList.add('animate-fade-up');

                // For the hero cards, let's stagger the drop
                if (entry.target.classList.contains('concept-card')) {
                    // find index to stagger
                    const index = Array.from(cards).indexOf(entry.target);
                    if (index > -1) {
                        entry.target.style.animationDelay = `${index * 0.15}s`;
                    }
                }

                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    };

    // Create the observer
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Initial state: hide elements before they scroll into view
    cards.forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });

    if (authorSection) {
        authorSection.style.opacity = '0';
        observer.observe(authorSection);
    }

    /* --- Smooth Scrolling for anchor links (if any are added later) --- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    /* --- Sticky Mobile CTA Logic --- */
    const heroButton = document.getElementById('buy-button');
    const stickyCTA = document.getElementById('mobileStickyCTA');

    if (heroButton && stickyCTA) {
        // Create an observer just for the hero button
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // If the hero button is not visible (scrolled past), show the sticky CTA
                if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
                    stickyCTA.classList.add('visible');
                } else {
                    // Hide it otherwise
                    stickyCTA.classList.remove('visible');
                }
            });
        }, {
            root: null,
            threshold: 0, // Trigger as soon as it totally leaves the viewport
            rootMargin: '-80px 0px 0px 0px' // small buffer
        });

        heroObserver.observe(heroButton);
    }

    /* --- Dayton Delivery Popup Logic --- */
    const daytonPopup = document.getElementById('daytonPopup');
    const closeDaytonPopup = document.getElementById('closeDaytonPopup');

    if (daytonPopup && !sessionStorage.getItem('daytonPopupDismissed')) {
        setTimeout(() => {
            daytonPopup.classList.add('show');
        }, 1200);
    }

    if (closeDaytonPopup) {
        closeDaytonPopup.addEventListener('click', () => {
            daytonPopup.classList.remove('show');
            sessionStorage.setItem('daytonPopupDismissed', 'true');
        });
    }

});
