// ===== HEADER SHRINK ON SCROLL =====
window.addEventListener('scroll', () => {
  const header = document.querySelector('.site-header');
  if (header) {
    header.classList.toggle('shrink', window.scrollY > 50);
  }
});

// ===== REVEAL ANIMATION =====
document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});

// ===== SMART ACTIVE NAV LINK =====
function initNavHighlight() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.site-nav a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    const cleanHref = href.replace(/\/+$/, '');
    const cleanPath = currentPath.replace(/\/+$/, '');

    if (cleanPath === cleanHref || cleanPath.startsWith(cleanHref)) {
      link.classList.add('active');
    }
  });
}
