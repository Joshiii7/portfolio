const scrollToTopBtn = document.getElementById('scrollToTopBtn');

const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.content-wrapper').forEach(wrapper => {
    observer.observe(wrapper);
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            const nav = document.getElementById('mainNav');
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
            }
        }
    });
});

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mainNav = document.getElementById('mainNav');

mobileMenuBtn.addEventListener('click', () => {
    mainNav.classList.toggle('active');
});

// Parallax scroll effect
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const sections = document.querySelectorAll('section');
            
            sections.forEach((section, index) => {
                const rect = section.getBoundingClientRect();
                const offset = rect.top + window.pageYOffset;
                const progress = (scrolled - offset + window.innerHeight) / (window.innerHeight + rect.height);
                
                if (progress > 0 && progress < 1) {
                    const wrapper = section.querySelector('.content-wrapper');
                    if (wrapper) {
                        const translateY = (1 - progress) * 50;
                        wrapper.style.transform = `translateY(${translateY}px) scale(${0.95 + (progress * 0.05)})`;
                    }
                }
            });
            
            ticking = false;
        });
        ticking = true;
    }
});

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.style.display = 'flex';
    } else {
        scrollToTopBtn.style.display = 'none';
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});