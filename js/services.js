// Renders service cards from js/services.json into #servicesContainer (used
// on both the Home page and the Services landing page), and the full,
// multi-section write-up for a single service into #serviceDetail on its
// own dedicated page (matched by the slug in body[data-service-slug],
// mirroring js/projects.js). The write-up's "Related Work" section cross
// references js/projects.json by slug, so detail pages fetch both files.
// Every render path falls back to a plain message instead of breaking if
// data is missing or a fetch fails.
(function () {
    const detailSlug = document.body.dataset.serviceSlug;
    const inServicesFolder = window.location.pathname.includes('/services/');
    const basePath = inServicesFolder ? '../' : '';
    const jsonPath = inServicesFolder ? '../js/services.json' : 'js/services.json';
    const projectsJsonPath = inServicesFolder ? '../js/projects.json' : 'js/projects.json';

    const container = document.getElementById('servicesContainer');
    const detailContainer = document.getElementById('serviceDetail');

    if (!container && !detailContainer) return;

    const ICONS = {
        dashboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect></svg>`,
        browser: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><circle cx="6.5" cy="6.5" r="0.4" fill="currentColor" stroke="none"></circle><circle cx="9" cy="6.5" r="0.4" fill="currentColor" stroke="none"></circle></svg>`,
        code: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="8 6 3 12 8 18"></polyline><polyline points="16 6 21 12 16 18"></polyline></svg>`,
        checklist: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"></rect><polyline points="8 11 10 13 14 9"></polyline><line x1="8" y1="17" x2="16" y2="17"></line></svg>`,
        layers: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 22 8.5 12 15 2 8.5 12 2"></polygon><polyline points="2 14.5 12 21 22 14.5"></polyline></svg>`,
        smartphone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>`,
        layout: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>`,
        zap: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
        wrench: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z"></path></svg>`,
        target: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>`,
        shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>`,
        report: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>`,
        mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>`
    };

    const cardHtml = (service) => `
        <div class="card-icon" aria-hidden="true">${ICONS[service.icon] || ''}</div>
        <h3>${service.title}</h3>
        <p>${service.summary}</p>
        <a href="${basePath}services/${service.id}.html" class="btn btn-outline btn-sm mt-3">Learn More</a>
    `;

    const includeCardHtml = (item) => `
        <div class="card value-item">
            <div class="card-icon" aria-hidden="true">${ICONS[item.icon] || ''}</div>
            <h3>${item.title}</h3>
            <p>${item.text}</p>
        </div>
    `;

    const relatedProjectCardHtml = (project) => `
        <div class="card project-card">
            <img src="${basePath}${project.image}" alt="${project.name} screenshot" class="project-image">
            <h3>${project.name}</h3>
            <div class="project-detail">
                <span class="label">Result</span>
                <p>${project.result}</p>
            </div>
            <div class="project-tags">${(project.tools || []).map(tool => `<span class="tag">${tool}</span>`).join('')}</div>
            <div class="project-links">
                <a href="${basePath}projects/${project.slug}.html">Read Full Case Study &rarr;</a>
            </div>
        </div>
    `;

    // "Related Work" only renders when the service names real case studies
    // (currently just Custom Software) rather than showing an empty section
    // for services with no matching project on the Projects page.
    const relatedWorkSection = (service, projectsBySlug) => {
        const projects = (service.relatedProjects || [])
            .map(slug => projectsBySlug[slug])
            .filter(Boolean);

        if (!projects.length) return '';

        return `
        <section class="section-py reveal">
            <div class="container">
                <span class="eyebrow">Related Work</span>
                <h2 class="section-title">Systems I've <span class="heading-accent">Built</span></h2>
                <p class="section-intro">Real case studies close to the kind of system described above.</p>
                <div class="grid grid-3">
                    ${projects.map(relatedProjectCardHtml).join('')}
                </div>
            </div>
        </section>`;
    };

    // The first FAQ item renders pre-expanded (matching every static
    // accordion elsewhere on the site: Home, Contact, Pricing, Services),
    // so a visitor sees an answered question immediately instead of a
    // fully collapsed list on first paint.
    const faqItemHtml = (faq, index, slug) => {
        const isOpen = index === 0;
        return `
        <div class="accordion-item">
            <h3>
                <button type="button" class="accordion-trigger" id="svcFaqQ-${slug}-${index}" aria-expanded="${isOpen}" aria-controls="svcFaqP-${slug}-${index}">
                    <span>${faq.q}</span>
                    <span class="accordion-icon" aria-hidden="true"></span>
                </button>
            </h3>
            <div class="accordion-panel${isOpen ? ' is-open' : ''}" id="svcFaqP-${slug}-${index}" role="region" aria-labelledby="svcFaqQ-${slug}-${index}" aria-hidden="${!isOpen}">
                <p>${faq.a}</p>
            </div>
        </div>
    `;
    };

    const faqSection = (service) => {
        const faqs = service.faqs || [];
        if (!faqs.length) return '';

        return `
        <section class="section-py bg-secondary reveal">
            <div class="container">
                <span class="eyebrow text-center">Common Questions</span>
                <h2 class="section-title">Questions <span class="heading-accent">Answered</span></h2>
                <div class="accordion" id="svcFaq-${service.id}">
                    ${faqs.map((faq, index) => faqItemHtml(faq, index, service.id)).join('')}
                </div>
            </div>
        </section>`;
    };

    const detailHtml = (service, projectsBySlug) => `
        <section class="section-py reveal">
            <div class="container">
                <div class="grid grid-2 service-overview">
                    <div class="service-overview__copy">
                        <span class="eyebrow">Overview</span>
                        <h2 class="tech-subheading">What This Service Is</h2>
                        <p>${service.detail}</p>
                    </div>
                    <div class="service-overview__image">
                        <img class="service-illustration" src="${basePath}assets/images/services/service-${service.id}.svg" alt="" aria-hidden="true">
                    </div>
                </div>
            </div>
        </section>

        <section class="section-py bg-secondary reveal">
            <div class="container">
                <span class="eyebrow text-center">What's Included</span>
                <h2 class="section-title">What's <span class="heading-accent">Included</span></h2>
                <div class="grid grid-4">
                    ${(service.includes || []).map(includeCardHtml).join('')}
                </div>
            </div>
        </section>

        ${relatedWorkSection(service, projectsBySlug)}

        <section class="section-py reveal">
            <div class="container">
                <div class="grid grid-2 service-split">
                    <div>
                        <span class="eyebrow">This Can Help You</span>
                        <h2 class="tech-subheading">Likely Outcomes</h2>
                        <ul class="service-outcomes">
                            ${(service.outcomes || []).map(outcome => `<li>${outcome}</li>`).join('')}
                        </ul>
                    </div>
                    <div>
                        <span class="eyebrow">Who It's For</span>
                        <h2 class="tech-subheading">Best Suited For</h2>
                        <div class="tag-list">
                            ${(service.audience || []).map(item => `<span class="tag">${item}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </section>

        ${faqSection(service)}
    `;

    // Wires up scroll-reveal and accordion behavior for markup injected
    // after main.js's own page-load pass already ran (see main.js).
    const activateInjected = (root) => {
        root.querySelectorAll('.reveal').forEach(el => window.observeReveal && window.observeReveal(el));
        root.querySelectorAll('.accordion').forEach(el => window.initAccordion && window.initAccordion(el));
    };

    if (container) {
        container.innerHTML = '<p>Loading services...</p>';

        fetch(jsonPath)
            .then(response => {
                if (!response.ok) throw new Error(`Failed to load ${jsonPath}`);
                return response.json();
            })
            .then(services => {
                const list = Array.isArray(services) ? services : [];

                container.innerHTML = list.length
                    ? list.map(service => `<div class="card service-card">${cardHtml(service)}</div>`).join('')
                    : '<p>Services are on their way. Check back soon.</p>';
            })
            .catch(() => {
                container.innerHTML = '<p>Service details could not be loaded right now. Please try again shortly.</p>';
            });
    }

    if (detailContainer) {
        detailContainer.innerHTML = '<section class="section-py"><div class="container"><p>Loading service details...</p></div></section>';

        Promise.all([
            fetch(jsonPath).then(response => {
                if (!response.ok) throw new Error(`Failed to load ${jsonPath}`);
                return response.json();
            }),
            fetch(projectsJsonPath).then(response => {
                if (!response.ok) throw new Error(`Failed to load ${projectsJsonPath}`);
                return response.json();
            })
        ])
            .then(([services, projectsData]) => {
                const list = Array.isArray(services) ? services : [];
                const capstone = Array.isArray(projectsData && projectsData.capstone) ? projectsData.capstone : [];
                const projectsBySlug = {};
                capstone.forEach(project => { projectsBySlug[project.slug] = project; });

                const service = list.find(s => s.id === detailSlug);
                detailContainer.innerHTML = service
                    ? detailHtml(service, projectsBySlug)
                    : '<section class="section-py"><div class="container"><p>This service could not be found. It may have moved, so please check the Services page.</p></div></section>';

                activateInjected(detailContainer);
            })
            .catch(() => {
                detailContainer.innerHTML = '<section class="section-py"><div class="container"><p>Service details could not be loaded right now. Please try again shortly.</p></div></section>';
            });
    }
})();
