document.addEventListener('DOMContentLoaded', function() {
  // Initialize projects
  loadProjects();
  
  // Set up search functionality
  const searchInput = document.getElementById('projectSearch');
  if (searchInput) {
    searchInput.addEventListener('input', filterProjects);
  }
});

// Array to store all projects
let allProjects = [];

// Function to load all projects
async function loadProjects() {
  try {
    // Get the current directory path
    const currentPath = window.location.pathname;
    const basePath = currentPath.substring(0, currentPath.lastIndexOf('/'));
    
    // Try to fetch a directory listing
    // Note: This approach works on GitHub Pages and similar static hosts
    // that provide directory listings when no index.html is present
    
    // We'll try to fetch from the current directory
    const response = await fetch('./');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Extract folder links from the directory listing
    const links = doc.querySelectorAll('a');
    const folders = [];
    
    for (const link of links) {
      const href = link.getAttribute('href');
      // Skip parent directory, files, and special paths
      if (href && !href.startsWith('?') && !href.startsWith('../') && 
          href !== '/' && !href.includes('.') && href.endsWith('/')) {
        const folderName = href.replace('/', '');
        folders.push(folderName);
      }
    }
    
    // Load project details for each folder
    const projectPromises = folders.map(folderName => loadProjectDetails(folderName));
    const projects = await Promise.all(projectPromises);
    
    // Filter out projects that are hidden or failed to load
    allProjects = projects.filter(project => project !== null);
    
    // Render all projects
    renderProjects(allProjects);
    updateProjectCount(allProjects.length, allProjects.length);
    
  } catch (error) {
    console.error('Error loading projects:', error);
    // Fallback: You could implement a manual project list here
    // if automatic detection fails
  }
}

// Function to load details for a specific project
async function loadProjectDetails(folderName) {
  try {
    // Check if the project has a HIDDEN file
    const hiddenResponse = await fetch(`./${folderName}/HIDDEN`);
    if (hiddenResponse.ok) {
      // Project is hidden, skip it
      return null;
    }
    
    // Try to load the project title from index.html
    const indexResponse = await fetch(`./${folderName}/index.html`);
    
    if (!indexResponse.ok) {
      throw new Error(`Failed to load index.html for ${folderName}`);
    }
    
    const html = await indexResponse.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Try to get the project title from a meta tag with name="project-title"
    let projectTitle = '';
    const titleMeta = doc.querySelector('meta[name="project-title"]');
    
    if (titleMeta) {
      projectTitle = titleMeta.getAttribute('content');
    } else {
      // Fallback: use the folder name as title
      projectTitle = formatFolderName(folderName);
    }
    
    // Check if cover image exists
    const coverImageUrl = `./${folderName}/cover.png`;
    
    return {
      folder: folderName,
      title: projectTitle,
      coverImage: coverImageUrl
    };
    
  } catch (error) {
    console.error(`Error loading project ${folderName}:`, error);
    return null;
  }
}

// Function to format folder name into a display title
function formatFolderName(folderName) {
  return folderName
    .split(/(?=[A-Z])|[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Function to render projects to the page
function renderProjects(projects) {
  const container = document.getElementById('projectsContainer');
  
  if (!container) {
    console.error('Projects container not found');
    return;
  }
  
  // Clear existing content
  container.innerHTML = '';
  
  if (projects.length === 0) {
    container.innerHTML = '<p class="no-projects">No projects found</p>';
    return;
  }
  
  // Create project cards
  projects.forEach(project => {
    const projectCard = document.createElement('a');
    projectCard.href = project.folder;
    projectCard.className = 'card-top';
    
    projectCard.innerHTML = `
      <div class="card-top__image" style="background-image: url('${project.coverImage}');"></div>
      <div class="card-top__overlay"></div>
      <div class="card-top__text">
        <h3>${project.title}</h3>
      </div>
      <div class="card-top__icon">
        <span>⧉</span>
      </div>
    `;
    
    container.appendChild(projectCard);
  });
}

// Function to filter projects based on search input
function filterProjects() {
  const searchInput = document.getElementById('projectSearch');
  const searchTerm = searchInput.value.toLowerCase().trim();
  
  if (searchTerm === '') {
    // Show all projects if search is empty
    renderProjects(allProjects);
    updateProjectCount(allProjects.length, allProjects.length);
    return;
  }
  
  // Filter projects by title
  const filteredProjects = allProjects.filter(project => 
    project.title.toLowerCase().includes(searchTerm)
  );
  
  // Render filtered projects
  renderProjects(filteredProjects);
  updateProjectCount(filteredProjects.length, allProjects.length);
}

// Function to update the project count display
function updateProjectCount(displayedCount, totalCount) {
  const countElement = document.querySelector('.project-count');
  const countNumberElement = document.querySelector('.count-number');
  
  if (!countElement || !countNumberElement) return;
  
  if (displayedCount === totalCount) {
    countElement.textContent = 'Showing all ';
    countNumberElement.textContent = totalCount;
    countElement.appendChild(countNumberElement);
    countElement.appendChild(document.createTextNode(' projects'));
  } else {
    countElement.textContent = 'Found ';
    countNumberElement.textContent = displayedCount;
    countElement.appendChild(countNumberElement);
    countElement.appendChild(document.createTextNode(` of ${totalCount} projects`));
  }
}
