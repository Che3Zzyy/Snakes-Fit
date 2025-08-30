document.addEventListener('DOMContentLoaded', () => {
  const gallery = document.querySelector('.gallery-container');
  const slides = gallery.querySelectorAll('img');
  const prevBtn = document.querySelector('.gallery-btn.prev');
  const nextBtn = document.querySelector('.gallery-btn.next');
  const dotsContainer = document.querySelector('.gallery-dots');
  let currentIndex = 0;
  let autoSlideInterval;

  // Create dots dynamically
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      currentIndex = index;
      updateSlider();
      resetAutoSlide();
    });
    dotsContainer.appendChild(dot);
  });
  const dots = dotsContainer.querySelectorAll('button');

  function updateSlider() {
    const slideWidth = gallery.clientWidth;
    gallery.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

    // Update dots
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlider();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlider();
  }

  // Button controls
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoSlide();
    });
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoSlide();
    });
  }

  // Touch controls (mobile swipe)
  let startX = 0;
  gallery.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  });
  gallery.addEventListener('touchend', e => {
    let endX = e.changedTouches[0].clientX;
    if (startX - endX > 50) {
      nextSlide();
      resetAutoSlide();
    } else if (endX - startX > 50) {
      prevSlide();
      resetAutoSlide();
    }
  });

  // Auto-slide every 5 seconds
  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 5000);
  }
  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }
  function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
  }

  // Pause on hover (desktop)
  const galleryWrapper = document.querySelector('.gallery-wrapper');
  galleryWrapper.addEventListener('mouseenter', stopAutoSlide);
  galleryWrapper.addEventListener('mouseleave', startAutoSlide);

  // Init
  window.addEventListener('resize', updateSlider);
  updateSlider();
  startAutoSlide();
});
