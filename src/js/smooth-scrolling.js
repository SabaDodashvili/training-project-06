const manuLinks = document.querySelectorAll('.manu__link[data-goto]');
if (manuLinks.length > 0) {
  manuLinks.forEach((manuLink) => {
    manuLink.addEventListener('click', onMnauLinkClick);
  });

  function onMnauLinkClick(e) {
    const manuLink = e.target;
    if (manuLink.dataset.goto && document.querySelector(manuLink.dataset.goto)) {
      const gotoEl = document.querySelector(manuLink.dataset.goto);
      const gotoElValue = gotoEl.getBoundingClientRect().top + pageYOffset - document.querySelector('.header__body').offsetHeight;

      if (manuIcon.classList.contains('active')) {
        manuIcon.classList.remove('active');
        manuBody.classList.remove('active');
        body.classList.remove('lock');
      }

      window.scrollTo({
        top: gotoElValue,
        behavior: 'smooth',
      });
      e.preventDefault();
    }
  }
}
