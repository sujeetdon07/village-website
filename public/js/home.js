document.addEventListener("DOMContentLoaded", () => {
  // ---------------- Slider Infinite Scroll (Right to Left) ----------------
  const sliderContainer = document.querySelector(".slider-container");
  if (sliderContainer) {
    const slides = Array.from(sliderContainer.children);
    
    // Only duplicate if there are slides
    if (slides.length > 0) {
      // Duplicate all slides for seamless infinite scroll
      slides.forEach(slide => {
        const clone = slide.cloneNode(true);
        sliderContainer.appendChild(clone);
      });
      
      // Set container styles immediately
      sliderContainer.style.display = "flex";
      sliderContainer.style.gap = "20px";
      sliderContainer.style.willChange = "transform";
      
      // Function to initialize scroll
      function initScroll() {
        const singleSetWidth = sliderContainer.scrollWidth / 2;
        let scrollAmount = 0;
        let animationId;
        
        function scrollSlider() {
          scrollAmount += 0.8; // Slightly smoother speed
          if (scrollAmount >= singleSetWidth) {
            scrollAmount = 0;
          }
          sliderContainer.style.transform = `translateX(-${scrollAmount}px)`;
          animationId = requestAnimationFrame(scrollSlider);
        }
        
        // Pause on hover
        sliderContainer.addEventListener("mouseenter", () => cancelAnimationFrame(animationId));
        sliderContainer.addEventListener("mouseleave", () => animationId = requestAnimationFrame(scrollSlider));
        
        scrollSlider();
      }

      // Ensure images are loaded before calculating width
      const firstImage = sliderContainer.querySelector("img");
      if (firstImage && !firstImage.complete) {
        firstImage.addEventListener("load", initScroll);
      } else {
        initScroll();
      }
    }
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
