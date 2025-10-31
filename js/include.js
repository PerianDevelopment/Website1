// ===== HTML INCLUDES (Header & Footer Loader) =====
function loadHTML(selector, file) {
  fetch(file)
    .then(response => {
      if (!response.ok) throw new Error(`Failed to load ${file}`);
      return response.text();
    })
    .then(data => {
      document.querySelector(selector).innerHTML = data;
    })
    .catch(error => console.error(error));
}

document.addEventListener("DOMContentLoaded", function() {
  loadHTML("header.site-header", "Website1/header.html");
  loadHTML("footer.site-footer", "Website1/footer.html");
});
