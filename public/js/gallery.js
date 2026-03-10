// Advanced Gallery with zoom, navigation, and touch support
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const closeBtn = document.querySelector('.modal-close');
  const galleryImages = document.querySelectorAll('.gallery-image');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const zoomInBtn = document.getElementById('zoomInBtn');
  const zoomOutBtn = document.getElementById('zoomOutBtn');
  const resetZoomBtn = document.getElementById('resetZoomBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const imageCounter = document.getElementById('imageCounter');
  
  let currentIndex = 0;
  let currentZoom = 1;
  let images = Array.from(galleryImages);
  
  // Touch support variables
  let touchStartX = 0;
  let touchEndX = 0;
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let translateX = 0;
  let translateY = 0;

  // Open image in modal
  function openModal(index) {
    currentIndex = index;
    currentZoom = 1;
    modal.style.display = 'flex';
    modalImg.src = images[currentIndex].getAttribute('data-src');
    modalImg.style.transform = `scale(${currentZoom}) translate(0, 0)`;
    translateX = 0;
    translateY = 0;
    updateCounter();
    document.body.style.overflow = 'hidden';
  }

  // Close modal
  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    currentZoom = 1;
    translateX = 0;
    translateY = 0;
  }

  // Update image counter
  function updateCounter() {
    imageCounter.textContent = `${currentIndex + 1} / ${images.length}`;
  }

  // Navigate to previous image
  function showPrevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    modalImg.src = images[currentIndex].getAttribute('data-src');
    currentZoom = 1;
    translateX = 0;
    translateY = 0;
    modalImg.style.transform = `scale(${currentZoom}) translate(0, 0)`;
    updateCounter();
  }

  // Navigate to next image
  function showNextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    modalImg.src = images[currentIndex].getAttribute('data-src');
    currentZoom = 1;
    translateX = 0;
    translateY = 0;
    modalImg.style.transform = `scale(${currentZoom}) translate(0, 0)`;
    updateCounter();
  }

  // Zoom in
  function zoomIn() {
    if (currentZoom < 3) {
      currentZoom += 0.25;
      modalImg.style.transform = `scale(${currentZoom}) translate(${translateX}px, ${translateY}px)`;
    }
  }

  // Zoom out
  function zoomOut() {
    if (currentZoom > 0.5) {
      currentZoom -= 0.25;
      modalImg.style.transform = `scale(${currentZoom}) translate(${translateX}px, ${translateY}px)`;
    }
  }

  // Reset zoom
  function resetZoom() {
    currentZoom = 1;
    translateX = 0;
    translateY = 0;
    modalImg.style.transform = `scale(${currentZoom}) translate(0, 0)`;
  }

  // Download image
  function downloadImage() {
    const link = document.createElement('a');
    link.href = modalImg.src;
    link.download = `gallery-image-${currentIndex + 1}.jpg`;
    link.click();
  }

  // Event listeners for gallery images
  galleryImages.forEach((img, index) => {
    img.addEventListener('click', () => openModal(index));
  });

  // Close button
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Navigation buttons
  if (prevBtn) prevBtn.addEventListener('click', showPrevImage);
  if (nextBtn) nextBtn.addEventListener('click', showNextImage);

  // Zoom controls
  if (zoomInBtn) zoomInBtn.addEventListener('click', zoomIn);
  if (zoomOutBtn) zoomOutBtn.addEventListener('click', zoomOut);
  if (resetZoomBtn) resetZoomBtn.addEventListener('click', resetZoom);
  if (downloadBtn) downloadBtn.addEventListener('click', downloadImage);

  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (modal.style.display === 'flex') {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') showPrevImage();
      if (e.key === 'ArrowRight') showNextImage();
      if (e.key === '+' || e.key === '=') zoomIn();
      if (e.key === '-') zoomOut();
      if (e.key === '0') resetZoom();
    }
  });

  // Touch swipe support for mobile
  modal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, false);

  modal.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, false);

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      showNextImage(); // Swipe left
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      showPrevImage(); // Swipe right
    }
  }

  // Drag to pan when zoomed
  modalImg.addEventListener('mousedown', (e) => {
    if (currentZoom > 1) {
      isDragging = true;
      startX = e.clientX - translateX;
      startY = e.clientY - translateY;
      modalImg.style.cursor = 'grabbing';
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      translateX = e.clientX - startX;
      translateY = e.clientY - startY;
      modalImg.style.transform = `scale(${currentZoom}) translate(${translateX / currentZoom}px, ${translateY / currentZoom}px)`;
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    modalImg.style.cursor = currentZoom > 1 ? 'grab' : 'default';
  });

  // Touch drag support
  modalImg.addEventListener('touchstart', (e) => {
    if (currentZoom > 1 && e.touches.length === 1) {
      isDragging = true;
      startX = e.touches[0].clientX - translateX;
      startY = e.touches[0].clientY - translateY;
    }
  });

  modalImg.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches.length === 1) {
      e.preventDefault();
      translateX = e.touches[0].clientX - startX;
      translateY = e.touches[0].clientY - startY;
      modalImg.style.transform = `scale(${currentZoom}) translate(${translateX / currentZoom}px, ${translateY / currentZoom}px)`;
    }
  });

  modalImg.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Mouse wheel zoom
  modalImg.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  });
});
