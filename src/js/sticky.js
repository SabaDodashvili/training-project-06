// window.onscroll = function () {
//   checkMarginToTop();
// };

// var nav = document.querySelector('.navigation');

// var sticky = nav.offsetTop;

// function checkMarginToTop() {
//   if (window.pageYOffset > sticky) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// }

// HEADER

const header = document.querySelector('.header');

const callback = function (entries, observer) {
  if (entries[0].isIntersecting) {
    header.classList.remove('scroll');
  } else {
    header.classList.add('scroll');
  }
};

const headerObsorver = new IntersectionObserver(callback);

headerObsorver.observe(header);
