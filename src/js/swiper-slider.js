let welcomeSlider = new Swiper('.welcome-slider', {
  wrapperClass: 'welcome-slider__wrapper',
  slideClass: 'welcome-slider__slide',
  nested: true,
  spaceBetween: 30,
  parallax: true,
  speed: 1000,
  effect: 'fade',
  fadeEffect: {
    crossFade: true,
  },

  navigation: {
    prevEl: '.welcome-slider__arrow_prev',
    nextEl: '.welcome-slider__arrow_next',
  },

  pagination: {
    el: '.welcome-slider__bullets',
    type: 'bullets',
    clickable: true,
    bulletClass: 'welcome-slider__bullet',
    bulletActiveClass: 'welcome-slider__bullet_active',
  },
});

letBlogSlider = new Swiper('.blog-slider', {
  wrapperClass: 'blog-slider__wrapper',
  slideClass: 'blog-slider__slide',
  nested: true,
  slidesPerView: 2,
  spaceBetween: 60,
  speed: 700,

  navigation: {
    prevEl: '.blog-slider__arrow_prev',
    nextEl: '.blog-slider__arrow_next',
  },

  pagination: {
    el: '.blog-slider__bullets',
    type: 'bullets',
    clickable: true,
    bulletClass: 'blog-slider__bullet',
    bulletActiveClass: 'blog-slider__bullet_active',
  },

  breakpoints: {
    0: { slidesPerView: 1 },
    767: { slidesPerView: 2 },
    992: { slidesPerView: 3 },
  },
});
