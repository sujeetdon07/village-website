document.addEventListener("DOMContentLoaded", () => {
  // ---------------- Slider Infinite Scroll ----------------
  const sliderContainer = document.querySelector(".slider-container");
  if (sliderContainer) {
    // Duplicate all slides for seamless infinite scroll
    sliderContainer.innerHTML += sliderContainer.innerHTML;

    let scrollAmount = 0;

    function scrollSlider() {
      scrollAmount += 1; // px per frame (speed)
      if (scrollAmount >= sliderContainer.scrollWidth / 2) {
        scrollAmount = 0; // reset scroll
      }
      sliderContainer.style.transform = `translateX(-${scrollAmount}px)`;
      requestAnimationFrame(scrollSlider);
    }

    // Set container styles
    sliderContainer.style.display = "flex";
    sliderContainer.style.gap = "20px";
    sliderContainer.style.willChange = "transform";

    scrollSlider();
  }

  // ---------------- Modal Functionality ----------------
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  const closeBtn = document.querySelector(".close-modal");
  const prevBtn = document.querySelector(".prev-image");
  const nextBtn = document.querySelector(".next-image");

  const images = Array.from(document.querySelectorAll(".clickable-image"));
  let currentIndex = 0;

  function openModal(index) {
    currentIndex = index;
    modal.style.display = "flex";
    modalImg.src = images[currentIndex].dataset.full;
    document.body.style.overflow = "hidden"; // prevent background scroll
  }

  function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = "auto"; // restore scroll
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    modalImg.src = images[currentIndex].dataset.full;
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    modalImg.src = images[currentIndex].dataset.full;
  }

  // Attach click events to images
  images.forEach((img, index) => {
    img.addEventListener("click", () => openModal(index));
  });

  // ---------------- QR Code and Developer Photo Modal ----------------
  const qrImg = document.querySelector(".clickable-qr");
  const devPhoto = document.querySelector(".clickable-dev-photo");

  if (qrImg) {
    qrImg.addEventListener("click", () => {
      modal.style.display = "flex";
      modalImg.src = qrImg.src;
      document.body.style.overflow = "hidden";
    });
  }

  if (devPhoto) {
    devPhoto.addEventListener("click", () => {
      modal.style.display = "flex";
      modalImg.src = devPhoto.src;
      document.body.style.overflow = "hidden";
    });
  }

  // Close modal events
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Navigation buttons
  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showPrev();
  });
  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showNext();
  });

  // Optional: keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (modal.style.display === "flex") {
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "Escape") closeModal();
    }
  });
});
