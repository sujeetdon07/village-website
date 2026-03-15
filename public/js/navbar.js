document.addEventListener('DOMContentLoaded', () => {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburgerBtn.contains(e.target) && !navMenu.contains(e.target)) {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }

  // Logout Confirmation Modal Logic
  const logoutLink = document.getElementById('logout-link');
  const logoutModal = document.getElementById('logoutModal');
  const cancelLogout = document.getElementById('cancelLogout');

  if (logoutLink && logoutModal && cancelLogout) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent immediate logout
      logoutModal.style.display = 'flex';
      
      // Close mobile menu if open
      if (hamburgerBtn && navMenu) {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });

    cancelLogout.addEventListener('click', () => {
      logoutModal.style.display = 'none';
    });

    // Close modal if clicking overlay
    logoutModal.addEventListener('click', (e) => {
      if (e.target === logoutModal) {
        logoutModal.style.display = 'none';
      }
    });
  }
});
