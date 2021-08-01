window.onload = function () {
  document.addEventListener('click', documentActions);
  function documentActions(e) {
    const targetElement = e.target;

    if (targetElement.classList.contains('products__more-btn')) {
      getProducts(targetElement);
      e.preventDefault();
    }

    if (targetElement.classList.contains('product-actions-list__icone_add') || targetElement.closest('.product-actions-list__icone_add')) {
      const productId = targetElement.closest('.product-item').dataset.pid;
      addToCart(targetElement, productId);
      e.preventDefault();
    }

    if (targetElement.classList.contains('header-cart__icon') || targetElement.closest('.header-cart__icon')) {
      if (document.querySelector('.cart-list').children.length > 0) {
        document.querySelector('.header-cart').classList.toggle('active');
      }
      e.preventDefault();
    } else if (!targetElement.closest('.header') && !targetElement.classList.contains('.header-cart__icon')) {
      document.querySelector('.header-cart').classList.remove('active');
    }

    if (targetElement.classList.contains('cart-list__delete')) {
      const productId = targetElement.closest('.cart-list__item').dataset.cartPid;
      updateCart(targetElement, productId, false);
      e.preventDefault();
    }

    if (targetElement.classList.contains('search-form__icon_one') || targetElement.closest('.search-form__icon_one')) {
      targetElement.closest('.search-form').classList.toggle('active');
    } else if (!targetElement.closest('.search-form') && document.querySelector('.search-form').classList.contains('active')) {
      document.querySelector('.search-form').classList.remove('active');
    }
  }
};

function addToCart(basketIcon, productId) {
  if (!basketIcon.classList.contains('hold')) {
    basketIcon.classList.add('hold');
    basketIcon.classList.add('fly');

    const cart = document.querySelector('.header-cart__icon');
    const product = document.querySelector(`[data-pid="${productId}"]`);
    const productImage = product.querySelector('.product-item__image-wrapper');

    const productImageFly = productImage.cloneNode(true);

    const productImageFlyWidth = productImage.offsetWidth;
    const productImageFlyHeight = productImage.offsetHeight;
    const productImageFlyTop = productImage.getBoundingClientRect().top;
    const productImageFlyLeft = productImage.getBoundingClientRect().left;

    productImageFly.setAttribute('class', 'flyImage');
    productImageFly.style.cssText = `left: ${productImageFlyLeft}px;
		top: ${productImageFlyTop}px;
		width: ${productImageFlyWidth}px;
		height: ${productImageFlyHeight}px`;

    document.body.append(productImageFly);

    const cartFlyLeft = cart.getBoundingClientRect().left;
    const cartFlyTop = cart.getBoundingClientRect().top;

    productImageFly.style.cssText = `left:${cartFlyLeft}px;
		top:${cartFlyTop}px;
		width:0px;
		height:0px;
		opacity:0`;

    productImageFly.addEventListener('transitionend', () => {
      if (basketIcon.classList.contains('fly')) {
        productImageFly.remove();
        updateCart(basketIcon, productId);
        basketIcon.classList.remove('fly');
      }
    });
  }
}

function updateCart(basketIcon, productId, productAdd = true) {
  const cart = document.querySelector('.header-cart');
  const cartIcon = cart.querySelector('.header-cart__icon');
  const cartQuantity = cartIcon.querySelector('span');
  const cartProduct = document.querySelector(`[data-cart-pid="${productId}"]`);
  const cartList = document.querySelector('.cart-list');

  if (productAdd) {
    if (cartQuantity) {
      cartQuantity.innerHTML = ++cartQuantity.innerHTML;
    } else {
      cartIcon.insertAdjacentHTML('beforeend', '<span>1</span>');
    }

    if (!cartProduct) {
      const product = document.querySelector(`[data-pid="${productId}"]`);
      const cartProductImage = product.querySelector('.product-item__image').innerHTML;
      const cartProductTitle = product.querySelector('.product-item__title').innerHTML;
      const cartProductContent = `
			<a class="cart-list__image" href="">${cartProductImage}</a>
			<div class="cart-list__body">
              <a class="cart-list__title" href="">${cartProductTitle}</a>
							<div class="cart-list__quantity">Quantity: <span>1</span></div>
							<a class="cart-list__delete" href="">Delete</a>
      </div>
			`;
      cartList.insertAdjacentHTML(
        'beforeend',
        `<li 
			class="cart-list__item" data-cart-pid="${productId}">${cartProductContent}</li>`
      );
    } else {
      const cartProductQuantity = cartProduct.querySelector('.cart-list__quantity span');
      cartProductQuantity.innerHTML = ++cartProductQuantity.innerHTML;
    }

    basketIcon.classList.remove('hold');
  } else {
    const cartProductQuantity = cartProduct.querySelector('.cart-list__quantity span');
    cartProductQuantity.innerHTML = --cartProductQuantity.innerHTML;

    if (!parseInt(cartProductQuantity.innerHTML)) {
      cartProduct.remove();
    }

    const cartQuantityValue = --cartQuantity.innerHTML;

    if (cartQuantityValue) {
      cartQuantity.innerHTML = cartQuantityValue;
    } else {
      cartQuantity.remove();
      cart.classList.remove('active');
    }
  }
}
