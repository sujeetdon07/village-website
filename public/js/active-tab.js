// Active Tab Functionality
document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const linkPath = new URL(link.href).pathname;
    
    // Check if current path matches the link
    if (currentPath === linkPath || 
        (currentPath === '/' && linkPath === '/') ||
        (currentPath.startsWith('/enter-details') && linkPath === '/profile') ||
        (currentPath.startsWith('/admin') && linkPath === '/admin')) {
      link.classList.add('active');
    }
  });
});
