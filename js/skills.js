// Renders the Skills & Tools lists on services/index.html from
// js/skills-tools.json into #skillsContainer and #toolsContainer. Each list
// is marked up as a real <ul>/<li> (not bare <div>s) so assistive tech
// announces it as a list, with the icon's alt text carrying the technology
// name.
(function () {
    const skillsContainer = document.getElementById('skillsContainer');
    const toolsContainer = document.getElementById('toolsContainer');
    if (!skillsContainer && !toolsContainer) return;

    const inServicesFolder = window.location.pathname.includes('/services/');
    const basePath = inServicesFolder ? '../' : '';
    const jsonPath = `${basePath}js/skills-tools.json`;

    const renderIconList = (container, items) => {
        if (!container) return;

        if (!Array.isArray(items) || items.length === 0) {
            container.innerHTML = '<li>Nothing to show here yet.</li>';
            return;
        }

        container.innerHTML = items.map(item => `
            <li class="skill-card">
                <div class="glow" style="background: ${item.color};"></div>
                <div class="content">
                    <img src="${basePath}${item.icon}" alt="${item.name}">
                    <p>${item.name}</p>
                </div>
            </li>
        `).join('');
    };

    const showLoading = (container) => {
        if (container) container.innerHTML = '<li>Loading...</li>';
    };

    showLoading(skillsContainer);
    showLoading(toolsContainer);

    fetch(jsonPath)
        .then(response => {
            if (!response.ok) throw new Error(`Failed to load ${jsonPath}`);
            return response.json();
        })
        .then(data => {
            renderIconList(skillsContainer, data && data.languages);
            renderIconList(toolsContainer, data && data.tools);
        })
        .catch(() => {
            const errorMessage = '<li>Skills and tools could not be loaded right now. Please try again shortly.</li>';
            if (skillsContainer) skillsContainer.innerHTML = errorMessage;
            if (toolsContainer) toolsContainer.innerHTML = errorMessage;
        });
})();
