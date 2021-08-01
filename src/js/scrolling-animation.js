const animElements = document.querySelectorAll('.anim-element');

if (animElements.length > 0) {
  window.addEventListener('scroll', animOnScroll);
  function animOnScroll(params) {
    for (let i = 0; i < animElements.length; i++) {
      const animElement = animElements[i];
      const animElementHeight = animElement.offsetHeight;
      const animElementOffset = offset(animElement).top;
      const animStart = 4;

      let animElementPoint = window.innerHeight - animElementHeight / animStart;
      if (animElementHeight > window.innerHeight) {
        animElementPoint = window.innerHeight - window.innerHeight / animStart;
      }

      if (pageYOffset > animElementOffset - animElementPoint && pageYOffset < animElementOffset + animElementHeight) {
        animElement.classList.add('anim');
      } else {
        if (!animElement.classList.contains('anim-no-hide')) {
          animElement.classList.remove('anim');
        }
      }
    }
  }
  function offset(el) {
    const rect = el.getBoundingClientRect(),
      scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
  }
  animOnScroll();
  setTimeout(() => {
    animOnScroll();
  }, 300);
}
