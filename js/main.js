// ---------------------------------------------------------------------------
// Skip link: a browser navigating to a `#main` URL fragment doesn't reliably
// move keyboard focus there just because it's the scroll target (Safari in
// particular won't, even with tabindex="-1" on the element). Focusing it
// explicitly makes sure the next Tab press continues from inside the page
// content instead of back at the top of the document.
// ---------------------------------------------------------------------------
const skipLink = document.querySelector('.skip-link');
const mainContent = document.getElementById('main');

if (skipLink && mainContent) {
    skipLink.addEventListener('click', () => {
        mainContent.focus();
    });
}

// ---------------------------------------------------------------------------
// Header height sync: the mobile header (see .site-header mobile CSS) is a
// stack of rows (logo, phone CTA, menu toggle bar), so its real height
// doesn't reduce to one clean constant the way the desktop header's single
// row does. Measuring it live and publishing it as --header-height keeps
// every page's banner padding, hero padding, and scroll-padding-top correct
// automatically on any screen size, instead of relying on a hand-maintained
// pixel value that silently drifts the next time header content changes
// (which is exactly what caused an earlier version of this header to hide
// page H1s underneath it).
//
// Only re-measures on viewport resize, not via a ResizeObserver on the
// header itself: the header's own height also grows when the mobile menu
// opens (nav#mainNav expanding below the toggle bar), and that's a
// temporary overlay state that page padding should NOT react to.
// ---------------------------------------------------------------------------
const siteHeader = document.getElementById('siteHeader');

if (siteHeader) {
    const syncHeaderHeight = () => {
        document.documentElement.style.setProperty('--header-height', `${siteHeader.offsetHeight}px`);
    };

    syncHeaderHeight();
    window.addEventListener('resize', syncHeaderHeight);

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(syncHeaderHeight);
    }
}

// ---------------------------------------------------------------------------
// Shared chrome: mobile nav, scroll-to-top, reveal-on-scroll. The header's
// background is a fixed, permanent style (see .site-header in style.scss);
// it no longer toggles on scroll, so there's nothing to wire up for it here.
// ---------------------------------------------------------------------------
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mainNav = document.getElementById('mainNav');
const scrollToTopBtn = document.getElementById('scrollToTopBtn');

if (mobileMenuBtn && mainNav) {
    const menuLabel = mobileMenuBtn.querySelector('.mobile-menu-btn__label');

    const setMenuOpen = (isOpen) => {
        mainNav.classList.toggle('active', isOpen);
        mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
        mobileMenuBtn.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
        // if (menuLabel) menuLabel.textContent = isOpen ? 'Close' : 'Menu';
    };

    const closeMobileMenu = () => setMenuOpen(false);

    mobileMenuBtn.addEventListener('click', () => {
        setMenuOpen(!mainNav.classList.contains('active'));
    });

    mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Escape closes the menu from anywhere in the header (not just while
    // focus is inside the nav itself, since focus stays on the toggle
    // button right after it's clicked), then returns focus to the toggle
    // so keyboard users land back where they started.
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mainNav.classList.contains('active')) {
            closeMobileMenu();
            mobileMenuBtn.focus();
        }
    });
}

// Read scrollY in the scroll listener (layout is already settled for that
// frame there), batch the class writes into the next animation frame, and
// only touch the DOM when a value actually flips. This avoids forcing a
// reflow on every scroll tick for pages with a lot of content below the fold.
let scrollTicking = false;
let latestScrollY = 0;
let topBtnIsVisible = null;

function applyScrollState() {
    scrollTicking = false;

    const showTopBtn = latestScrollY > 300;

    if (scrollToTopBtn && showTopBtn !== topBtnIsVisible) {
        topBtnIsVisible = showTopBtn;
        scrollToTopBtn.classList.toggle('is-visible', showTopBtn);
    }
}

window.addEventListener('scroll', () => {
    latestScrollY = window.scrollY;

    if (!scrollTicking) {
        scrollTicking = true;
        window.requestAnimationFrame(applyScrollState);
    }
}, { passive: true });

// Initial pass on the first frame rather than synchronously at parse time.
window.requestAnimationFrame(() => {
    latestScrollY = window.scrollY;
    applyScrollState();
});

if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Exposed as window.observeReveal so js/services.js can opt an element into
// this same scroll-reveal behavior after injecting it (the injected content
// arrives once its data fetch resolves, after this initial pass has run).
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });

const observeReveal = (target) => revealObserver.observe(target);
document.querySelectorAll('.reveal').forEach(observeReveal);
window.observeReveal = observeReveal;

// ---------------------------------------------------------------------------
// Hero canvas grid effect (home page only)
// ---------------------------------------------------------------------------
const heroCanvas = document.getElementById('webCanvas');

if (heroCanvas) {
    const ctx = heroCanvas.getContext('2d');
    const boxSize = 35;
    const maxTrail = 20;
    let cols = 0;
    let rows = 0;
    let trail = [];

    function resizeCanvas() {
        const rect = heroCanvas.parentElement.getBoundingClientRect();
        heroCanvas.width = rect.width;
        heroCanvas.height = rect.height;
        cols = Math.ceil(heroCanvas.width / boxSize);
        rows = Math.ceil(heroCanvas.height / boxSize);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    window.addEventListener('mousemove', (e) => {
        const rect = heroCanvas.getBoundingClientRect();
        trail.unshift({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            time: Date.now()
        });
        if (trail.length > maxTrail) trail.pop();
    });

    function animate() {
        ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                ctx.strokeStyle = 'rgba(132, 161, 255, 0.05)';
                ctx.lineWidth = 1;
                ctx.strokeRect(c * boxSize, r * boxSize, boxSize, boxSize);
            }
        }

        trail.forEach((point) => {
            const age = (Date.now() - point.time) / 600;
            const opacity = Math.max(0, 1 - age);

            if (opacity > 0) {
                const col = Math.floor(point.x / boxSize);
                const row = Math.floor(point.y / boxSize);

                ctx.strokeStyle = `rgba(0, 102, 255, ${opacity})`;
                ctx.shadowBlur = 15 * opacity;
                ctx.shadowColor = 'rgba(0, 68, 255, 0.6)';
                ctx.lineWidth = 2;
                ctx.strokeRect(col * boxSize, row * boxSize, boxSize, boxSize);
                ctx.shadowBlur = 0;
            }
        });

        trail = trail.filter(p => Date.now() - p.time < 800);
        requestAnimationFrame(animate);
    }

    animate();
}

// ---------------------------------------------------------------------------
// Contact form validation (Home and Contact pages share the same form
// markup and ids, so this one block wires up whichever copy is present).
// Validates on blur (first time a field is left) and then live on every
// input/change after that, so a mistake gets corrected without waiting for
// another blur, but nothing is flagged before the visitor has touched it.
// ---------------------------------------------------------------------------
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    const nameField = document.getElementById('contactName');
    const emailField = document.getElementById('contactEmail');
    const projectTypeField = document.getElementById('contactProjectType');
    const messageField = document.getElementById('contactMessage');
    const formStatus = document.getElementById('formStatus');

    const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    // Each validator returns an error message, or '' when the field is valid.
    const validators = {
        contactName: (field) => {
            const value = field.value.trim();
            if (!value) return 'Please enter your name.';
            if (value.length < 2) return 'Name should be at least 2 characters.';
            if (value.length > 100) return 'Name should be under 100 characters.';
            return '';
        },
        contactEmail: (field) => {
            const value = field.value.trim();
            if (!value) return 'Please enter your email address.';
            if (!isValidEmail(value)) return 'Please enter a valid email address.';
            return '';
        },
        contactProjectType: (field) => {
            if (!field.value) return 'Please choose a project type.';
            return '';
        },
        contactMessage: (field) => {
            const value = field.value.trim();
            if (!value) return 'Please tell me a bit about your project.';
            if (value.length < 10) return 'Please add a few more details (at least 10 characters).';
            if (value.length > 2000) return 'Message should be under 2000 characters.';
            return '';
        }
    };

    const showError = (field, message) => {
        const errorEl = document.getElementById(`${field.id}Error`);
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.toggle('is-visible', Boolean(message));
        }
        field.setAttribute('aria-invalid', message ? 'true' : 'false');
        field.classList.toggle('is-invalid', Boolean(message));
        field.classList.toggle('is-valid', !message && field.dataset.touched === 'true');
    };

    const validateField = (field) => {
        const validator = validators[field.id];
        if (!validator) return true;
        const message = validator(field);
        showError(field, message);
        return !message;
    };

    const fields = [nameField, emailField, projectTypeField, messageField].filter(Boolean);

    fields.forEach((field) => {
        field.dataset.touched = 'false';

        field.addEventListener('blur', () => {
            field.dataset.touched = 'true';
            validateField(field);
        });

        const liveEvent = field.tagName === 'SELECT' ? 'change' : 'input';
        field.addEventListener(liveEvent, () => {
            if (field.dataset.touched === 'true') {
                validateField(field);
            }
        });
    });

    contactForm.addEventListener('submit', (e) => {
        let firstInvalidField = null;

        fields.forEach((field) => {
            field.dataset.touched = 'true';
            if (!validateField(field) && !firstInvalidField) {
                firstInvalidField = field;
            }
        });

        if (firstInvalidField) {
            e.preventDefault();
            if (formStatus) {
                formStatus.textContent = 'Please fix the highlighted fields before sending.';
                formStatus.classList.add('is-visible', 'is-error');
                formStatus.classList.remove('is-success');
            }
            firstInvalidField.focus();
            return;
        }

        // Form submits via mailto: (see contact.html). The browser hands off
        // to the user's email client, so there is no async success state to show.
    });
}

// ---------------------------------------------------------------------------
// FAQ accordion (Home, Contact, and service detail pages). Real <button>
// triggers, so Enter/Space activation and keyboard focus come for free from
// native button semantics; no manual keydown handling needed. Exclusive:
// opening one item closes whichever other item is open, including the one
// open by default.
//
// Exposed as window.initAccordion so js/services.js can wire up an
// accordion it injects after this initial pass has already run (the fetch
// that builds it resolves after page load, so it isn't present yet when the
// querySelectorAll below runs).
// ---------------------------------------------------------------------------
function initAccordion(accordion) {
    const items = Array.from(accordion.querySelectorAll('.accordion-item'));

    // Bootstrap's .collapse animates the real pixel height rather than a
    // fixed cap, so both directions transition the actual distance the
    // content needs to travel. Height can't be transitioned to/from `auto`
    // directly, so: expand from 0 to a measured pixel value, then swap to
    // `auto` once the transition ends (keeps it reflow-safe); collapse by
    // pinning the current rendered height as a pixel value first (forcing a
    // reflow so the browser registers it), then dropping it to 0.
    //
    // Clicking a second item before the first item's collapse (or a prior
    // expand) has finished interrupts that CSS transition, which never fires
    // its own transitionend, so a stale listener from it would otherwise
    // still be sitting on the panel and can fire off the *next* transition
    // instead, snapping the wrong item open again right after it closes.
    // Tracking the pending listener per panel and clearing it before
    // starting a new transition (either direction) prevents that.
    const clearPendingHeightListener = (panel) => {
        if (panel._pendingHeightListener) {
            panel.removeEventListener('transitionend', panel._pendingHeightListener);
            panel._pendingHeightListener = null;
        }
    };

    const expand = (panel) => {
        clearPendingHeightListener(panel);
        panel.style.height = `${panel.scrollHeight}px`;
        const onEnd = (e) => {
            if (e.propertyName !== 'height') return;
            panel.style.height = 'auto';
            panel.removeEventListener('transitionend', onEnd);
            panel._pendingHeightListener = null;
        };
        panel._pendingHeightListener = onEnd;
        panel.addEventListener('transitionend', onEnd);
    };

    const collapse = (panel) => {
        clearPendingHeightListener(panel);
        panel.style.height = `${panel.scrollHeight}px`;
        void panel.offsetHeight;
        panel.style.height = '0px';
    };

    const setOpen = (item, isOpen) => {
        const trigger = item.querySelector('.accordion-trigger');
        const panel = item.querySelector('.accordion-panel');
        trigger.setAttribute('aria-expanded', String(isOpen));
        panel.setAttribute('aria-hidden', String(!isOpen));
        panel.classList.toggle('is-open', isOpen);
        if (isOpen) {
            expand(panel);
        } else {
            collapse(panel);
        }
    };

    items.forEach((item) => {
        const trigger = item.querySelector('.accordion-trigger');
        trigger.addEventListener('click', () => {
            const wasOpen = trigger.getAttribute('aria-expanded') === 'true';
            const openItem = items.find((otherItem) => otherItem !== item
                && otherItem.querySelector('.accordion-trigger').getAttribute('aria-expanded') === 'true');
            if (openItem) setOpen(openItem, false);
            setOpen(item, !wasOpen);
        });
    });
}

document.querySelectorAll('.accordion').forEach(initAccordion);
window.initAccordion = initAccordion;

// ---------------------------------------------------------------------------
// Pricing page: monthly/annual billing toggle for the maintenance-plan
// cards. Each card carries its own pre-computed data-monthly/data-annual
// pesos figures (annual is not simply monthly x12, it already bakes in the
// discount), so the toggle only ever swaps which one is displayed.
// ---------------------------------------------------------------------------
const billingToggle = document.querySelector('.billing-toggle');

if (billingToggle) {
    const toggleButtons = Array.from(billingToggle.querySelectorAll('.billing-toggle__btn'));
    const planCards = document.querySelectorAll('[data-monthly]');

    const applyBilling = (cycle) => {
        toggleButtons.forEach((btn) => {
            const isActive = btn.dataset.cycle === cycle;
            btn.classList.toggle('is-active', isActive);
            btn.setAttribute('aria-pressed', String(isActive));
        });

        planCards.forEach((card) => {
            const amountEl = card.querySelector('.pricing-card__amount');
            const periodEl = card.querySelector('.pricing-card__period');
            if (!amountEl || !periodEl) return;
            const pesos = cycle === 'annual' ? card.dataset.annual : card.dataset.monthly;
            amountEl.textContent = Number(pesos).toLocaleString('en-PH');
            periodEl.textContent = cycle === 'annual' ? '/year' : '/month';
        });
    };

    toggleButtons.forEach((btn) => {
        btn.addEventListener('click', () => applyBilling(btn.dataset.cycle));
    });
}

// ---------------------------------------------------------------------------
// Footer copyright year (every page)
// ---------------------------------------------------------------------------
const currentYearEl = document.getElementById('currentYear');
if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
}
