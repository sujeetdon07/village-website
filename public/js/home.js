document.addEventListener("DOMContentLoaded", () => {
  const sliderContainer = document.querySelector(".slider-container");
  if (!sliderContainer) return;

  // Duplicate all slides for seamless infinite scroll
  sliderContainer.innerHTML += sliderContainer.innerHTML;

  let scrollAmount = 0;

  function scrollSlider() {
    scrollAmount += 1; // px per frame (speed)
    if (scrollAmount >= sliderContainer.scrollWidth / 2) {
      // reset scroll to start but visually seamless
      scrollAmount = 0;
    }
    sliderContainer.style.transform = `translateX(-${scrollAmount}px)`;
    requestAnimationFrame(scrollSlider);
  }

  // Set container styles
  sliderContainer.style.display = "flex";
  sliderContainer.style.gap = "20px";
  sliderContainer.style.willChange = "transform";

  scrollSlider();
});
