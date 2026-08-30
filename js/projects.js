// Renders project cards from js/projects.json across the Home page (first
// 3 capstone projects), the Projects listing page (all capstone projects,
// plus the separate Front-End Craft demos in their own section), and each
// individual case study page (full write-up, matched by the slug in
// body[data-project-slug]). Every render path falls back to a plain
// message instead of breaking if data is missing or the fetch fails.
(function () {
    const detailSlug = document.body.dataset.projectSlug;
    const inProjectsFolder = window.location.pathname.includes('/projects/');
    const basePath = inProjectsFolder ? '../' : '';
    const jsonPath = inProjectsFolder ? '../js/projects.json' : 'js/projects.json';

    const homeContainer = document.getElementById('homeProjectsContainer');
    const businessContainer = document.getElementById('businessProjectsContainer');
    const craftContainer = document.getElementById('frontEndCraftContainer');
    const detailContainer = document.getElementById('projectDetail');

    // Nothing on this page needs project data at all.
    if (!homeContainer && !businessContainer && !craftContainer && !detailContainer) return;

    const tagsHtml = (tools) => (Array.isArray(tools) ? tools : [])
        .map(tool => `<span class="tag">${tool}</span>`).join('');

    // Teaser card used on the Home page and the Projects listing page:
    // image, name, Problem + Result only, tags, and a link to the full case study.
    const teaserCardHtml = (project) => `
        <img src="${basePath}${project.image}" alt="${project.name} screenshot" class="project-image">
        <h3>${project.name}</h3>
        <div class="project-detail">
            <span class="label">Problem</span>
            <p>${project.problem}</p>
        </div>
        <div class="project-detail">
            <span class="label">Result</span>
            <p>${project.result}</p>
        </div>
        <div class="project-tags">${tagsHtml(project.tools)}</div>
        <div class="project-links">
            <a href="${basePath}projects/${project.slug}.html">Read Full Case Study &rarr;</a>
        </div>
    `;

    // Front-End Craft card: image, name, one-line description, tags, and a
    // link to the live demo instead of a case study page.
    const craftCardHtml = (project) => `
        <img src="${basePath}${project.image}" alt="${project.name} preview" class="project-image">
        <h3>${project.name}</h3>
        <p>${project.description}</p>
        <div class="project-tags">${tagsHtml(project.tools)}</div>
        <div class="project-links">
            <a href="${basePath}${project.link}" target="_blank" rel="noopener">View Live Demo &rarr;</a>
        </div>
    `;

    // Full write-up used on an individual case study page: Problem,
    // Solution, and Result together (the page's own <h1> already has the name).
    const detailHtml = (project) => `
        <img src="${basePath}${project.image}" alt="${project.name} screenshot" class="project-image">
        <div class="project-detail">
            <span class="label">Problem</span>
            <p>${project.problem}</p>
        </div>
        <div class="project-detail">
            <span class="label">Solution</span>
            <p>${project.solution}</p>
        </div>
        <div class="project-detail">
            <span class="label">Result</span>
            <p>${project.result}</p>
        </div>
        <div class="project-tags">${tagsHtml(project.tools)}</div>
    `;

    const renderGrid = (container, projects, cardFn, emptyMessage) => {
        if (!container) return;

        if (!Array.isArray(projects) || projects.length === 0) {
            container.innerHTML = `<p>${emptyMessage}</p>`;
            return;
        }

        container.innerHTML = projects.map(project => `
            <div class="card project-card">${cardFn(project)}</div>
        `).join('');
    };

    const showLoading = (container) => {
        if (container) container.innerHTML = '<p>Loading projects...</p>';
    };

    [homeContainer, businessContainer, craftContainer, detailContainer].forEach(showLoading);

    fetch(jsonPath)
        .then(response => {
            if (!response.ok) throw new Error(`Failed to load ${jsonPath}`);
            return response.json();
        })
        .then(data => {
            const capstone = Array.isArray(data && data.capstone) ? data.capstone : [];
            const frontEndCraft = Array.isArray(data && data.frontEndCraft) ? data.frontEndCraft : [];

            renderGrid(homeContainer, capstone.slice(0, 3), teaserCardHtml, 'Featured projects are on their way. Check back soon.');
            renderGrid(businessContainer, capstone, teaserCardHtml, 'Projects are on their way. Check back soon.');
            renderGrid(craftContainer, frontEndCraft, craftCardHtml, 'More front-end demos are on their way.');

            if (detailContainer) {
                const project = capstone.find(p => p.slug === detailSlug);
                detailContainer.innerHTML = project
                    ? detailHtml(project)
                    : '<p>This project could not be found. It may have moved, so please check the Projects page.</p>';
            }
        })
        .catch(() => {
            const errorMessage = '<p>Project details could not be loaded right now. Please try again shortly.</p>';
            [homeContainer, businessContainer, craftContainer, detailContainer].forEach(container => {
                if (container) container.innerHTML = errorMessage;
            });
        });
})();
