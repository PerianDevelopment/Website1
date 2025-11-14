// ===== HTML INCLUDES (Header & Footer Loader) =====
function loadHTML(selector, file, callback) {
  fetch(file)
    .then(response => {
      if (!response.ok) throw new Error(`Failed to load ${file}`);
      return response.text();
    })
    .then(data => {
      document.querySelector(selector).innerHTML = data;
      if (callback) callback();
    })
    .catch(error => console.error(error));
}

document.addEventListener("DOMContentLoaded", function() {
  const pathParts = window.location.pathname.split('/');
  const repoName = pathParts[1] ? `/${pathParts[1]}/` : '/';

  loadHTML("header.site-header", `${repoName}header.html`, initNavHighlight);
  loadHTML("footer.site-footer", `${repoName}footer.html`);
});
