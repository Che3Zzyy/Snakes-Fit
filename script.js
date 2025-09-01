document.addEventListener('DOMContentLoaded', () => {
  const gallery = document.querySelector('.gallery-container');
  const slides = gallery.querySelectorAll('img');
  const prevBtn = document.querySelector('.gallery-btn.prev');
  const nextBtn = document.querySelector('.gallery-btn.next');
  const dotsContainer = document.querySelector('.gallery-dots');
  const galleryWrapper = document.querySelector('.gallery-wrapper');
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

  function updateSlider(smooth = true) {
    const slideWidth = galleryWrapper.clientWidth; // use wrapper width
    gallery.style.transition = smooth ? 'transform 0.4s ease' : 'none';
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

  // Touch controls (swipe)
  let startX = 0;
  let currentX = 0;
  let isDragging = false;
  let startTime = 0;

  galleryWrapper.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    currentX = startX;
    isDragging = true;
    startTime = Date.now();
    gallery.style.transition = 'none'; 
  });

  galleryWrapper.addEventListener('touchmove', e => {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
    const deltaX = currentX - startX;
    const slideWidth = galleryWrapper.clientWidth;

    if ((currentIndex === 0 && deltaX > 0) || (currentIndex === slides.length - 1 && deltaX < 0)) {
      gallery.style.transform = `translateX(${-currentIndex * slideWidth + deltaX / 3}px)`; 
    } else {
      gallery.style.transform = `translateX(${-currentIndex * slideWidth + deltaX}px)`;
    }
  });

  galleryWrapper.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    const deltaX = currentX - startX;
    const elapsedTime = Date.now() - startTime;
    const slideWidth = galleryWrapper.clientWidth;

    const swipeSpeed = Math.abs(deltaX / elapsedTime);

    if ((deltaX > 50 || (swipeSpeed > 0.3 && deltaX > 0)) && currentIndex > 0) {
      prevSlide();
    } else if ((deltaX < -50 || (swipeSpeed > 0.3 && deltaX < 0)) && currentIndex < slides.length - 1) {
      nextSlide();
    } else {
      updateSlider();
    }

    resetAutoSlide();
  });

  // Auto-slide every 5s
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

  // Pause on hover
  galleryWrapper.addEventListener('mouseenter', stopAutoSlide);
  galleryWrapper.addEventListener('mouseleave', startAutoSlide);

  // Init
  window.addEventListener('resize', () => updateSlider(false));
  updateSlider(false);
  startAutoSlide();
});
