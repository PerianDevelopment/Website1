let allProjects = [];

document.addEventListener('DOMContentLoaded', async () => {
    await loadProjects();
    setupSearch();
});

async function loadProjects() {
    try {
        const response = await fetch('./projects.json');
        const data = await response.json();
        
        // Filter out hidden projects and add cover image path
        allProjects = data.projects
            .filter(project => !project.hidden)
            .map(project => ({
                ...project,
                coverImage: `./${project.folder}/cover.png`
            }));
        
        renderProjects(allProjects);
        updateProjectCount(allProjects.length, allProjects.length);
    } catch (error) {
        console.error('Failed to load projects:', error);
        document.getElementById('projectsContainer').innerHTML = 
            '<p class="no-projects">Failed to load projects</p>';
    }
}

function renderProjects(projects) {
    const container = document.getElementById('projectsContainer');
    
    if (projects.length === 0) {
        container.innerHTML = `
			<div class="no-projects">
				<h3>No Results Found</h3>
				<p>Try adjusting your search terms or browse all projects.</p>
			</div>
			`;
        return;
    }
    
    container.innerHTML = projects.map(project => `
        <a href="${project.folder}" class="card-top">
            <div class="card-top__image" style="background-image: url('${project.coverImage}');"></div>
            <div class="card-top__overlay"></div>
            <div class="card-top__text">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
            </div>
            <div class="card-top__icon">
                <span>⧉</span>
            </div>
        </a>
    `).join('');
}

function setupSearch() {
    const searchInput = document.getElementById('projectSearch');
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();
        
        if (term === '') {
            renderProjects(allProjects);
            updateProjectCount(allProjects.length, allProjects.length);
            return;
        }
        
        const filtered = allProjects.filter(project => 
            project.title.toLowerCase().includes(term) ||
            project.description.toLowerCase().includes(term)
        );
        
        renderProjects(filtered);
        updateProjectCount(filtered.length, allProjects.length);
    });
}

function updateProjectCount(displayed, total) {
    const countElement = document.querySelector('.project-count');
    const numberElement = document.querySelector('.count-number');
    
    if (displayed === total) {
        countElement.innerHTML = `Showing all <span class="count-number">${total}</span> projects`;
    } else {
        countElement.innerHTML = `Found <span class="count-number">${displayed}</span> of <span class="count-number">${total}</span> projects`;
    }
}
