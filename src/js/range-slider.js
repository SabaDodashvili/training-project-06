const priceSlider = document.querySelector('.price-filter__slider');
if (priceSlider) {
  noUiSlider.create(priceSlider, {
    start: [0, 20000],
    connect: true,
    tooltips: [wNumb({ decimals: 0 }), wNumb({ decimals: 0 })],
    range: {
      min: [0],
      max: [50000],
    },
  });
  const priceStart = document.querySelector('.price-start');
  const pricEnd = document.querySelector('.price-end');

  priceStart.addEventListener('change', seyPriceValues);
  pricEnd.addEventListener('change', seyPriceValues);

  function seyPriceValues() {
    let priceStartValue;
    let priceEndValue;
    if (priceStart.value != '') {
      priceStartValue = priceStart.value;
    }
    if (pricEnd.value != '') {
      priceEndValue = pricEnd.value;
    }
    priceSlider.noUiSlider.set([priceStartValue, priceEndValue]);
  }
}
