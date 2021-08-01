let isMobile = {
  Android: function () {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function () {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any: function () {
    return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
  },
};

if (isMobile.any()) {
  body.classList.add('touch');

  let manuArrows = document.querySelectorAll('.manu__arrow');

  if (manuArrows.length > 0) {
    for (let i = 0; i < manuArrows.length; i++) {
      const manuArrow = manuArrows[i];
      manuArrow.addEventListener('click', (e) => {
        manuArrow.parentElement.classList.toggle('active');
      });
    }
  }
} else {
  body.classList.add('mouse');
}
