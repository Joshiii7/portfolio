// elements
const scrollToTopBtn = document.getElementById('scrollToTopBtn');
const canvas = document.getElementById('webCanvas');
const ctx = canvas.getContext('2d');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mainNav = document.getElementById('mainNav');

const header = document.querySelector('header');
const aboutSection = document.getElementById('about');

// variables
const visibleWrappers = new Set();
let cols = 0;
let rows = 0;
const boxSize = 35;
let trail = [];
const maxTrail = 20;

let ticking = false;
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

// functions
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            visibleWrappers.add(entry.target);
        } else {
            visibleWrappers.delete(entry.target);
        }
    });

    header.classList.toggle('is-transparent', visibleWrappers.size > 0);
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

mobileMenuBtn.addEventListener('click', () => {
    mainNav.classList.toggle('active');
});

// event listener
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

function resizeCanvas() {
    const hero = document.getElementById('hero');
    const rect = hero.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;

    cols = Math.ceil(canvas.width / boxSize);
    rows = Math.ceil(canvas.height / boxSize);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();

    trail.unshift({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        time: Date.now()
    });

    if (trail.length > maxTrail) trail.pop();
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            ctx.strokeStyle = 'rgba(132, 161, 255, 0.05)';
            ctx.lineWidth = 1;
            ctx.strokeRect(
                c * boxSize,
                r * boxSize,
                boxSize,
                boxSize
            );
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

            ctx.strokeRect(
                col * boxSize,
                row * boxSize,
                boxSize,
                boxSize
            );

            ctx.shadowBlur = 0;
        }
    });

    trail = trail.filter(p => Date.now() - p.time < 800);

    requestAnimationFrame(animate);
}

animate();