// Gallery image interactions
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const closeBtn = document.querySelector('.modal-close');
  const galleryImages = document.querySelectorAll('.gallery-image');

  // Open image in fullscreen when clicked
  galleryImages.forEach(img => {
    img.addEventListener('click', function() {
      modal.style.display = 'flex';
      modalImg.src = this.getAttribute('data-src');
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
  });

  // Close modal when clicking X button
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    });
  }

  // Close modal when clicking outside the image
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });
});
