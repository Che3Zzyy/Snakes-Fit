document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelector('.gallery-container');
  const slides = slider.querySelectorAll('img');
  let currentIndex = 0;

  // Function to update slide position
  function updateSlider() {
    const slideWidth = slider.clientWidth;
    slides.forEach((img, index) => {
      img.style.transform = `translateX(${(index - currentIndex) * slideWidth}px)`;
    });
  }

  // Initialize positions
  updateSlider();
  window.addEventListener('resize', updateSlider);

  // Touch support
  let startX = 0;
  let endX = 0;

  slider.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  });

  slider.addEventListener('touchend', e => {
    endX = e.changedTouches[0].clientX;
    if (startX - endX > 50) {
      // swipe left
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlider();
    } else if (endX - startX > 50) {
      // swipe right
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateSlider();
    }
  });
});
