// elements
const skillsContainer = document.getElementById('skillsContainer');
const toolsContainer = document.getElementById('toolsContainer');
const experienceContainer = document.getElementById('experienceContainer');
const projectsContainer = document.getElementById("projectsContainer");
const toggleExperienceBtn = document.getElementById('toggleExperience');
const toggleProjectsBtn = document.getElementById('toggleProjects');

// data
const technologies = [
    // Frontend
    { name: 'HTML5', icon: 'assets/svg/html-svgrepo-com.svg', color: '#E34F26' },
    { name: 'CSS', icon: 'assets/svg/css-3-svgrepo-com2.svg', color: '#8315b6ff' },
    { name: 'SCSS', icon: 'assets/svg/scss-svgrepo-com.svg', color: '#CC6699' },
    { name: 'JavaScript', icon: 'assets/svg/js-svgrepo-com.svg', color: '#F7DF1E' },
    { name: 'jQuery', icon: 'assets/svg/jquery-svgrepo-com.svg', color: '#0769AD' },
    { name: 'Tailwind CSS', icon: 'assets/svg/tailwind-svgrepo-com.svg', color: '#38BDF8' },
    { name: 'Bootstrap 5', icon: 'assets/svg/bootstrap-svgrepo-com.svg', color: '#7952B3' },
    { name: 'Angular', icon: 'assets/images/tech_stack_logos/gradient-icon---large.gif', color: '#DD0031' },
    { name: 'React', icon: 'assets/svg/react-svgrepo-com.svg', color: '#61DAFB' },
    { name: 'Vue.js', icon: 'assets/svg/vue-9-logo-svgrepo-com.svg', color: '#42B883' },
    { name: 'Next.js', icon: 'assets/svg/nextjs-svgrepo-com.svg', color: '#ffffff' },
    { name: 'Node.js', icon: 'assets/svg/nodejs-icon-svgrepo-com.svg', color: '#339933' },
    { name: 'Vite', icon: 'assets/svg/vite-svgrepo-com.svg', color: '#646CFF' },

    // Backend
    { name: 'PHP', icon: 'assets/svg/php-svgrepo-com.svg', color: '#777BB4' },
    { name: 'Laravel', icon: 'assets/svg/laravel-svgrepo-com.svg', color: '#FF2D20' },
    { name: 'Django', icon: 'assets/svg/djangoproject-svgrepo-com.svg', color: '#06b874ff' },
    { name: 'WordPress', icon: 'assets/svg/wordpress-svgrepo-com.svg', color: '#f4f7f6ff' },

    // Languages
    { name: 'Python', icon: 'assets/svg/python-svgrepo-com.svg', color: '#3776AB' },
    { name: 'TypeScript', icon: 'assets/svg/typescript-official-svgrepo-com.svg', color: '#3178C6' },
    { name: 'Java', icon: 'assets/svg/java-svgrepo-com.svg', color: '#007396' },

    // Databases
    { name: 'MySQL', icon: 'assets/svg/mysql-svgrepo-com.svg', color: '#4479A1' },
    { name: 'Sqlite3', icon: 'assets/svg/sqlite-svgrepo-com.svg', color: '#0c71a0ff' },
    { name: 'Firebase', icon: 'assets/svg/firebase-svgrepo-com.svg', color: '#FFCA28' },
];

const tools = [
    { name: 'Git', icon: 'assets/svg/git-svgrepo-com.svg', color: '#F05032' },
    { name: 'VS Code', icon: 'assets/svg/vscode-svgrepo-com.svg', color: '#007ACC' },
    { name: 'MySQL Workbench', icon: 'assets/svg/mysql-svgrepo-com.svg', color: '#4479A1' },
    { name: 'Figma', icon: 'assets/svg/figma-svgrepo-com.svg', color: '#F24E1E' }, 
    { name: 'Photoshop', icon: 'assets/svg/adobe-photoshop-svgrepo-com.svg', color: '#31A8FF' },
    { name: 'Illustrator', icon: 'assets/svg/adobe-illustrator-svgrepo-com.svg', color: '#FF9A00' },
    { name: 'Adobe XD', icon: 'assets/svg/adobe-xd-svgrepo-com.svg', color: '#FF61F6' },
    { name: 'Indesign', icon: 'assets/svg/indesign-cc-logo-svgrepo-com.svg', color: '#FF3366' },  
];

const experiences = [
    {
        id: 1,
        position: 'Gold Medalist',
        event: 'Provincial Skills Competition 2023',
        duration: 'November 2023',
        skillArea: 'Web Technologies',
        description: 'Won 1st place in the Provincial Skills Competition, advancing to the Regional level.',
    },
    {
        id: 2,
        position: 'Gold Medalist',
        event: 'Regional Skills Competition 2023',
        duration: 'December 2023',
        skillArea: 'Web Technologies',
        description: 'Secured the gold medal in the Regional Skills Competition, earning a spot in the National Skills Competition.',
    },
    {
        id: 3,
        position: 'Silver Medalist',
        event: 'Philippine National Skills Competition 2024',
        duration: 'August 2024',
        skillArea: 'Web Technologies',
        description: 'Represented the CARAGA Region in the National Skills Competition and won the silver medal. Earned a spot in the ASEAN Skills Competition 2025, advancing to the international level.',
    },
    {
        id: 4,
        position: 'Competitor',
        event: 'Training Camp for ASEAN Skills Competition',
        duration: 'June 2 – August 20, 2025',
        skillArea: 'Web Technologies',
        description: 'Undergone intensive training and preparation for the ASEAN Skills Competition 2025.',
    },
    {
        id: 5,
        position: '9th Placer',
        event: 'ASEAN Skills Competition 2025',
        duration: 'August 26 – August 28, 2025',
        skillArea: 'Web Technologies',
        description: 'Represented the Philippines in the ASEAN Skills Competition 2025, placing 9th out of 14 competitors across Southeast Asia.',
    },
    {
        id: 6,
        position: 'NC III Web Development Passer',
        event: 'TESDA National Certificate III',
        duration: 'March 2025',
        skillArea: 'Web Development',
        description: 'Successfully passed the TESDA NC III Web Development assessment, proving competency in industry-level skills.',
    },
    {
        id: 7,
        position: 'Front-end Developer',
        event: 'Himugso Tech',
        duration: 'September 2025 – Present',
        skillArea: 'Startup & Software Development',
        description: 'Contributing to the development of modern web applications, focusing on creating responsive, user-friendly interfaces and collaborating with the team to deliver high-quality solutions.',
    },
    {
        id: 8,
        position: 'Part-Time Instructor',
        event: 'Andres Soriano Colleges of Bislig',
        duration: 'September 2025 – Present',
        skillArea: 'Web Development Education',
        description: 'Teaching web development part-time, mentoring students in modern web technologies and best practices.',
    },
    {
        id: 9,
        position: 'Junior Web Developer',
        event: 'REK Marketing & Design',
        duration: 'January 2026 – Present',
        skillArea: 'Web Development & SEO',
        description: 'Working as a junior web developer, contributing to website development, SEO-focused implementations, and maintaining modern, responsive web solutions for clients.',
    },
];

const applicationProjects = [
    {
        name: "Bislig City BPLS",
        description: "A web-based Business Permit and Licensing System designed for Bislig City to streamline business registration, permit processing, and status tracking with an intuitive administrative dashboard and reporting features.",
        tags: ["Angular", "Tailwind", "Laravel", "MySQL", "Chart.js", "API Integration"],
        image: "assets/images/project_images/bislig_city_bpls.png"
    },
    {
        name: "Bislig City Car Rental",
        description: "An online car rental management system for Bislig City that handles vehicle listings, booking requests, rental scheduling, and administrative monitoring.",
        tags: ["Angular", "Tailwind", "Laravel", "MySQL", "Chart.js", "API Integration"],
        image: "assets/images/project_images/bislig_city_car_rental.png"
    },
    {
        name: "ASCB Attendance & Payroll System",
        description: "A comprehensive attendance and payroll system that automates employee time tracking, salary computation, and payroll reporting.",
        tags: ["Angular", "Tailwind", "Laravel", "MySQL", "Chart.js", "API Integration"],
        image: "assets/images/project_images/ascb_attendance_and_payroll_system.png"
    },
    {
        name: "SH Merchantile Inventory System",
        description: "An inventory management system for monitoring stocks, managing sales and purchases, and generating real-time reports.",
        tags: ["PHP", "CSS", "JavaScript", "MySQL", "Chart.js"],
        image: "assets/images/project_images/sh_merchantile_inventory_system.png"
    },
    {
        name: "MIS Grading System",
        description: "An academic grading system for efficient grade encoding and student performance tracking.",
        tags: ["Laravel", "Bootstrap 5", "Vite", "MySQL", "Chart.js"],
        image: "assets/images/project_images/mis_grading_system.png"
    },
    {
        name: "Orlando Majestic Rides",
        description: "A luxury transportation website showcasing chauffeur-driven services and seamless booking.",
        tags: ["HTML", "CSS", "Responsive"],
        image: "assets/images/project_images/orlando_majestic_homepage.png"
    }
];

const jsProjects = [
    {
        name: "Weather Dashboard",
        description: "Weather visualization app with location-based forecasts and charts.",
        tags: ["React", "API Integration", "Chart.js"],
        image: "images/weather.png"
    },
    {
        name: "Todo List App",
        description: "Interactive todo list with local storage, filters, and drag-and-drop ordering.",
        tags: ["JavaScript", "LocalStorage", "DOM"],
        image: "images/todolist.png"
    }
];

const miniCssProjects = [
    {
        name: "Cube Rotation",
        description: "Cube rotation animation using HTML and CSS only.",
        tags: ["HTML", "CSS", "Animation"],
        image: "assets/images/project_images/cube_rotation.png"
    },
    {
        name: "Drip Effect",
        description: "Drip animation created using pure HTML and CSS.",
        tags: ["HTML", "CSS", "Animation"],
        image: "assets/images/project_images/drip_effect.png"
    },
    {
        name: "Animated Traffic Light",
        description: "Traffic light animation built entirely with CSS.",
        tags: ["HTML", "CSS", "Animation"],
        image: "assets/images/project_images/animated_traffic_light.png"
    },
    {
        name: "Loading Animation",
        description: "Smooth loading animation using CSS only.",
        tags: ["HTML", "CSS", "Animation"],
        image: "assets/images/project_images/loading_animation.png"
    }
];


const renderSkills = () => {
    skillsContainer.innerHTML = technologies
        .map(skill => `
            <div class="skill-card"> 
                <div class="glow" style="background: ${skill.color};"></div> 
                <div class="content"> 
                    <img src="${skill.icon}" alt="${skill.name}" /> 
                    <p>${skill.name}</p> 
                </div> 
            </div> 
        `).join(''); 
}

const renderTools = () => {
    toolsContainer.innerHTML = tools 
        .map(tool => `
            <div class="skill-card"> 
                <div class="glow" style="background: ${tool.color};"></div> 
                <div class="content"> 
                    <img src="${tool.icon}" alt="${tool.name}" /> 
                    <p>${tool.name}</p> 
                </div>
            </div> 
        `).join('');
}

// EXPERIENCE LOGIC
let experienceExpanded = false;

const getInitialExperienceCount = () => {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
}

let experienceVisibleCount = getInitialExperienceCount();

const renderExperiences = () => {
    const visibleExperiences = experienceExpanded
        ? experiences
        : experiences.slice(0, experienceVisibleCount);

    experienceContainer.innerHTML = visibleExperiences.map(exp => `
        <div class="timeline-item">
            <h3>${exp.event}</h3>
            <div class="position">${exp.position}</div>
            <div class="area">${exp.skillArea}</div>
            <div class="date">${exp.duration}</div>
            <p>${exp.description}</p>
        </div>
    `).join('');

    toggleExperienceBtn.textContent = experienceExpanded
        ? 'Show less'
        : 'Show more';

    toggleExperienceBtn.style.display =
        experiences.length <= experienceVisibleCount ? 'none' : 'inline-block';
}

// PROJECTS LOGIC
const renderProjectSection = (projects, containerId) => {
    const container = document.getElementById(containerId);

    container.innerHTML = projects.map(p => `
        <div class="project-card">
            <img src="${p.image}" alt="${p.name}" class="project-image">
            <h3>${p.name}</h3>
            <p>${p.description}</p>
            <div class="project-tags">
                ${p.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}
            </div>
        </div>
    `).join("");
};

// INIT
document.addEventListener('DOMContentLoaded', () => {
    renderSkills();
    renderTools();
    renderExperiences();
    
    renderProjectSection(applicationProjects, "applicationProjectsContainer");
    renderProjectSection(jsProjects, "jsProjectsContainer");
    renderProjectSection(miniCssProjects, "miniCssProjectsContainer");

});

window.addEventListener('resize', () => {
    if (!experienceExpanded) {
        experienceVisibleCount = getInitialExperienceCount();
        renderExperiences();
    }
});

// BUTTON EVENTS
toggleExperienceBtn.addEventListener('click', () => {
    experienceExpanded = !experienceExpanded;
    renderExperiences();
});

// toggleProjectsBtn.addEventListener('click', () => {
//     projectsExpanded = !projectsExpanded;
//     renderProjects();
// });
