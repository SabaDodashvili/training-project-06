const gallery = document.querySelector('.gallery__body');

if (gallery && !isMobile.any()) {
  const galleryItems = document.querySelector('.gallery__items');
  const speed = gallery.dataset.speed;

  let positionX = 0;
  let coordXprocent = 0;

  function setMouseGalleryStyle() {
    let galleryItemsWidth = galleryItems.offsetWidth;
    const galleryDifferent = galleryItemsWidth - gallery.offsetWidth;
    const distX = Math.floor(coordXprocent - positionX);

    positionX = positionX + distX * speed;
    let position = (galleryDifferent / 200) * positionX;

    galleryItems.style.cssText = `transform: translate3d(${-position}px,0,0);`;

    if (Math.abs(distX) > 0) {
      requestAnimationFrame(setMouseGalleryStyle);
    } else {
      gallery.classList.remove('init');
    }
  }
  gallery.addEventListener('mousemove', function (e) {
    const galleryWidth = gallery.offsetWidth;

    const cordX = e.pageX - galleryWidth / 2;

    coordXprocent = (cordX / galleryWidth) * 200;

    if (!gallery.classList.contains('init')) {
      requestAnimationFrame(setMouseGalleryStyle);
      gallery.classList.add('init');
    }
  });
}
