async function getProducts(showMoreBtn) {
  if (!showMoreBtn.classList.contains('hold')) {
    showMoreBtn.classList.add('hold');
    const file = 'json/products.json';
    let response = await fetch(file, {
      method: 'GET',
    });
    if (response.ok) {
      let result = await response.json();
      loadProducts(result);
      showMoreBtn.classList.remove('hold');
      showMoreBtn.remove();
    } else {
      alert('error');
    }
  }
}
function loadProducts(data) {
  const productItems = document.querySelector('.products__items');
  data.products.forEach((item) => {
    const productId = item.id;
    const productUrl = item.url;
    const productImageWebp = item.imageWebp;
    const productImageJpg = item.imageJpg;
    const productTitle = item.title;
    const productDescr = item.descr;
    const productPrice = item.price;
    const productOldPrice = item.priceOld;
    const productShareUrl = item.shareUrl;
    const productLikeUrl = item.likeUrl;
    const productLabels = item.labels;

    let productTemplateItemWrapperStart = `<div class="products__item-wrapper">`;
    let productTemplateItemWrapperEnd = `</div>`;

    let productTemplateItemStart = `<div class="products__item product-item" data-pid="${productId}">`;
    let productTemplateItemEnd = `</div>`;

    let productTemplateLabels = '';
    if (productLabels) {
      let productTemplateLabelsStart = `<div class="product-item__labels">`;
      let productTemplateLabelsEnd = `</div>`;
      let productTemplateLabelsContent = '';

      productLabels.forEach((labelItem) => {
        productTemplateLabelsContent += `<div class="product-item__label product-item__label_${labelItem.type}">${labelItem.value}</div>`;
      });

      productTemplateLabels += productTemplateLabelsStart;
      productTemplateLabels += productTemplateLabelsContent;
      productTemplateLabels += productTemplateLabelsEnd;
    }

    let productTemplateImageWrapperStart = `<div class="product-item__image-wrapper">`;
    let productTemplateImageWrapperEnd = `</div>`;

    let productTemplateImage = `
		<a class="product-item__image" href="${productUrl}">
    <picture><source srcset="images/products/${productImageWebp}" type="image/webp"><img src="images/products/${productImageJpg}" alt="${productTitle}"></picture>
    </a>
	`;

    let productTemplateActions = `<ul class="product-item__actions product-actions-list">
<li class="product-actions-list__item">
  <a class="product-actions-list__icone popup-link" href="#signin">
		<svg><use xlink:href="images/icons/icons.svg#heart"></use></svg>
	</a>
</li>
<li class="product-actions-list__item">
<a class="product-actions-list__icone product-actions-list__icone_add" href="#">
<svg><use xlink:href="images/icons/icons.svg#add-basket"></use></svg>
</a>
</li>
<li class="product-actions-list__item">
	<a class="product-actions-list__icone" href="${productShareUrl}">
		<svg><use xlink:href="images/icons/icons.svg#share"></use></svg>
	</a>
</li>
</ul>`;

    let productTemplateImageWrapper = '';

    productTemplateImageWrapper += productTemplateImageWrapperStart;
    productTemplateImageWrapper += productTemplateImage;
    productTemplateImageWrapper += productTemplateActions;
    productTemplateImageWrapper += productTemplateImageWrapperEnd;

    let productTemplateText = `
    <div class="product-item__text">
      <h3 class="product-item__title">${productTitle}</h3>
      <div class="product-item__descr">${productDescr}</div>
    </div>
	`;

    let productTemplatePrices = '';
    let productTemplatePricesStart = `<div class="product-item__prices">`;
    let productTemplatePricesCurrent = `<div class="product-item__price">${productPrice}</div>`;
    let productTemplatePricesOld = `<div class="product-item__price product-item__old-price">${productOldPrice}</div>`;
    let productTemplatePricesEnd = `</div>`;

    productTemplatePrices = productTemplatePricesStart;
    productTemplatePrices += productTemplatePricesCurrent;
    if (productOldPrice) {
      productTemplatePrices += productTemplatePricesOld;
    }
    productTemplatePrices += productTemplatePricesEnd;

    let productTemplateItem = '';
    productTemplateItem += productTemplateItemStart;
    productTemplateItem += productTemplateLabels;
    productTemplateItem += productTemplateImageWrapper;
    productTemplateItem += productTemplateText;
    productTemplateItem += productTemplatePrices;
    productTemplateItem += productTemplateItemEnd;

    let productTemplateItemWrapper = '';
    productTemplateItemWrapper += productTemplateItemWrapperStart;
    productTemplateItemWrapper += productTemplateItem;
    productTemplateItemWrapper += productTemplateItemWrapperEnd;

    productItems.insertAdjacentHTML('beforeend', productTemplateItemWrapper);
  });
}
