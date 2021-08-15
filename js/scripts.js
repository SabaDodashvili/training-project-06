const body = document.querySelector('body');
const popupLinks = document.querySelectorAll('.popup-link');
const lockPadding = document.querySelector('.lock-padding');

let unlock = true;

const timeOut = 800;

if (popupLinks.length > 0) {
  for (let i = 0; i < popupLinks.length; i++) {
    const popupLink = popupLinks[i];
    popupLink.addEventListener('click', function (e) {
      const popupName = popupLink.getAttribute('href').replace('#', '');
      const curentPopup = document.getElementById(popupName);
      popupOpen(curentPopup);
      e.preventDefault();
    });
  }
}

const popupCloseIcon = document.querySelectorAll('.close-popup');
if (popupCloseIcon.length > 0) {
  for (let i = 0; i < popupCloseIcon.length; i++) {
    const curentEl = popupCloseIcon[i];
    curentEl.addEventListener('click', function (e) {
      popupClose(curentEl.closest('.popup'));
      e.preventDefault();
    });
  }
}

function popupOpen(curentPopup) {
  if (curentPopup && unlock) {
    const popupActive = document.querySelector('.popup.open');
    if (popupActive) {
      popupClose(popupActive, false);
    } else {
      bodyLock();
    }
    curentPopup.classList.add('open');
    curentPopup.addEventListener('click', function (e) {
      if (!e.target.closest('.popup__content')) {
        popupClose(e.target.closest('.popup'));
      }
    });
  }
}

function popupClose(popupActive, doUnlock = true) {
  if (unlock) {
    popupActive.classList.remove('open');
    if (doUnlock) {
      bodyUnLock();
    }
  }
}

function bodyLock() {
  const lockPaddingValue =
    window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
  if (lockPadding.length > 0) {
    for (let i = 0; i < lockPaddingValue.length; i++) {
      const el = lockPadding[i];
      el.style.paddingRight = lockPaddingValue;
    }
  }
  body.style.paddingRight = lockPaddingValue;
  body.classList.add('lock');

  unlock = false;
  setTimeout(function () {
    unlock = true;
  }, timeOut);
}

function bodyUnLock() {
  setTimeout(function () {
    if (lockPadding.length > 0) {
      for (let i = 0; i < lockPadding.length; i++) {
        const el = lockPadding[i];
        el.style.paddingRight = '0px';
      }
    }
    body.style.paddingRight = '0px';
    body.classList.remove('lock');
  }, timeOut);
}

document.addEventListener('keydown', function (e) {
  if (e.which === 27) {
    const popupActive = document.querySelector('.popup.open');
    popupClose(popupActive);
  }
});
;
// 'use strict';
function DynamicAdapt(type) {
  this.type = type;
}

DynamicAdapt.prototype.init = function () {
  const _this = this;
  // массив объектов
  this.оbjects = [];
  this.daClassname = '_dynamic_adapt_';
  // массив DOM-элементов
  this.nodes = document.querySelectorAll('[data-da]');

  // наполнение оbjects объктами
  for (let i = 0; i < this.nodes.length; i++) {
    const node = this.nodes[i];
    const data = node.dataset.da.trim();
    const dataArray = data.split(',');
    const оbject = {};
    оbject.element = node;
    оbject.parent = node.parentNode;
    оbject.destination = document.querySelector(dataArray[0].trim());
    оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : '767';
    оbject.place = dataArray[2] ? dataArray[2].trim() : 'last';
    оbject.index = this.indexInParent(оbject.parent, оbject.element);
    this.оbjects.push(оbject);
  }

  this.arraySort(this.оbjects);

  // массив уникальных медиа-запросов
  this.mediaQueries = Array.prototype.map.call(
    this.оbjects,
    function (item) {
      return '(' + this.type + '-width: ' + item.breakpoint + 'px),' + item.breakpoint;
    },
    this
  );
  this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
    return Array.prototype.indexOf.call(self, item) === index;
  });

  // навешивание слушателя на медиа-запрос
  // и вызов обработчика при первом запуске
  for (let i = 0; i < this.mediaQueries.length; i++) {
    const media = this.mediaQueries[i];
    const mediaSplit = String.prototype.split.call(media, ',');
    const matchMedia = window.matchMedia(mediaSplit[0]);
    const mediaBreakpoint = mediaSplit[1];

    // массив объектов с подходящим брейкпоинтом
    const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
      return item.breakpoint === mediaBreakpoint;
    });
    matchMedia.addListener(function () {
      _this.mediaHandler(matchMedia, оbjectsFilter);
    });
    this.mediaHandler(matchMedia, оbjectsFilter);
  }
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
  if (matchMedia.matches) {
    for (let i = 0; i < оbjects.length; i++) {
      const оbject = оbjects[i];
      оbject.index = this.indexInParent(оbject.parent, оbject.element);
      this.moveTo(оbject.place, оbject.element, оbject.destination);
    }
  } else {
    for (let i = 0; i < оbjects.length; i++) {
      const оbject = оbjects[i];
      if (оbject.element.classList.contains(this.daClassname)) {
        this.moveBack(оbject.parent, оbject.element, оbject.index);
      }
    }
  }
};

// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
  element.classList.add(this.daClassname);
  if (place === 'last' || place >= destination.children.length) {
    destination.insertAdjacentElement('beforeend', element);
    return;
  }
  if (place === 'first') {
    destination.insertAdjacentElement('afterbegin', element);
    return;
  }
  destination.children[place].insertAdjacentElement('beforebegin', element);
};

// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
  element.classList.remove(this.daClassname);
  if (parent.children[index] !== undefined) {
    parent.children[index].insertAdjacentElement('beforebegin', element);
  } else {
    parent.insertAdjacentElement('beforeend', element);
  }
};

// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
  const array = Array.prototype.slice.call(parent.children);
  return Array.prototype.indexOf.call(array, element);
};

// Функция сортировки массива по breakpoint и place
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
  if (this.type === 'min') {
    Array.prototype.sort.call(arr, function (a, b) {
      if (a.breakpoint === b.breakpoint) {
        if (a.place === b.place) {
          return 0;
        }

        if (a.place === 'first' || b.place === 'last') {
          return -1;
        }

        if (a.place === 'last' || b.place === 'first') {
          return 1;
        }

        return a.place - b.place;
      }

      return a.breakpoint - b.breakpoint;
    });
  } else {
    Array.prototype.sort.call(arr, function (a, b) {
      if (a.breakpoint === b.breakpoint) {
        if (a.place === b.place) {
          return 0;
        }

        if (a.place === 'first' || b.place === 'last') {
          return 1;
        }

        if (a.place === 'last' || b.place === 'first') {
          return -1;
        }

        return b.place - a.place;
      }

      return b.breakpoint - a.breakpoint;
    });
    return;
  }
};

const da = new DynamicAdapt('max');
da.init();
;
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
;
var VanillaTilt = (function () {
  'use strict';

  /**
   * Created by Sergiu Șandor (micku7zu) on 1/27/2017.
   * Original idea: https://github.com/gijsroge/tilt.js
   * MIT License.
   * Version 1.7.0
   */

  class VanillaTilt {
    constructor(element, settings = {}) {
      if (!(element instanceof Node)) {
        throw "Can't initialize VanillaTilt because " + element + ' is not a Node.';
      }

      this.width = null;
      this.height = null;
      this.clientWidth = null;
      this.clientHeight = null;
      this.left = null;
      this.top = null;

      // for Gyroscope sampling
      this.gammazero = null;
      this.betazero = null;
      this.lastgammazero = null;
      this.lastbetazero = null;

      this.transitionTimeout = null;
      this.updateCall = null;
      this.event = null;

      this.updateBind = this.update.bind(this);
      this.resetBind = this.reset.bind(this);

      this.element = element;
      this.settings = this.extendSettings(settings);

      this.reverse = this.settings.reverse ? -1 : 1;
      this.glare = VanillaTilt.isSettingTrue(this.settings.glare);
      this.glarePrerender = VanillaTilt.isSettingTrue(this.settings['glare-prerender']);
      this.fullPageListening = VanillaTilt.isSettingTrue(this.settings['full-page-listening']);
      this.gyroscope = VanillaTilt.isSettingTrue(this.settings.gyroscope);
      this.gyroscopeSamples = this.settings.gyroscopeSamples;

      this.elementListener = this.getElementListener();

      if (this.glare) {
        this.prepareGlare();
      }

      if (this.fullPageListening) {
        this.updateClientSize();
      }

      this.addEventListeners();
      this.updateInitialPosition();
    }

    static isSettingTrue(setting) {
      return setting === '' || setting === true || setting === 1;
    }

    /**
     * Method returns element what will be listen mouse events
     * @return {Node}
     */
    getElementListener() {
      if (this.fullPageListening) {
        return window.document;
      }

      if (typeof this.settings['mouse-event-element'] === 'string') {
        const mouseEventElement = document.querySelector(this.settings['mouse-event-element']);

        if (mouseEventElement) {
          return mouseEventElement;
        }
      }

      if (this.settings['mouse-event-element'] instanceof Node) {
        return this.settings['mouse-event-element'];
      }

      return this.element;
    }

    /**
     * Method set listen methods for this.elementListener
     * @return {Node}
     */
    addEventListeners() {
      this.onMouseEnterBind = this.onMouseEnter.bind(this);
      this.onMouseMoveBind = this.onMouseMove.bind(this);
      this.onMouseLeaveBind = this.onMouseLeave.bind(this);
      this.onWindowResizeBind = this.onWindowResize.bind(this);
      this.onDeviceOrientationBind = this.onDeviceOrientation.bind(this);

      this.elementListener.addEventListener('mouseenter', this.onMouseEnterBind);
      this.elementListener.addEventListener('mouseleave', this.onMouseLeaveBind);
      this.elementListener.addEventListener('mousemove', this.onMouseMoveBind);

      if (this.glare || this.fullPageListening) {
        window.addEventListener('resize', this.onWindowResizeBind);
      }

      if (this.gyroscope) {
        window.addEventListener('deviceorientation', this.onDeviceOrientationBind);
      }
    }

    /**
     * Method remove event listeners from current this.elementListener
     */
    removeEventListeners() {
      this.elementListener.removeEventListener('mouseenter', this.onMouseEnterBind);
      this.elementListener.removeEventListener('mouseleave', this.onMouseLeaveBind);
      this.elementListener.removeEventListener('mousemove', this.onMouseMoveBind);

      if (this.gyroscope) {
        window.removeEventListener('deviceorientation', this.onDeviceOrientationBind);
      }

      if (this.glare || this.fullPageListening) {
        window.removeEventListener('resize', this.onWindowResizeBind);
      }
    }

    destroy() {
      clearTimeout(this.transitionTimeout);
      if (this.updateCall !== null) {
        cancelAnimationFrame(this.updateCall);
      }

      this.reset();

      this.removeEventListeners();
      this.element.vanillaTilt = null;
      delete this.element.vanillaTilt;

      this.element = null;
    }

    onDeviceOrientation(event) {
      if (event.gamma === null || event.beta === null) {
        return;
      }

      this.updateElementPosition();

      if (this.gyroscopeSamples > 0) {
        this.lastgammazero = this.gammazero;
        this.lastbetazero = this.betazero;

        if (this.gammazero === null) {
          this.gammazero = event.gamma;
          this.betazero = event.beta;
        } else {
          this.gammazero = (event.gamma + this.lastgammazero) / 2;
          this.betazero = (event.beta + this.lastbetazero) / 2;
        }

        this.gyroscopeSamples -= 1;
      }

      const totalAngleX = this.settings.gyroscopeMaxAngleX - this.settings.gyroscopeMinAngleX;
      const totalAngleY = this.settings.gyroscopeMaxAngleY - this.settings.gyroscopeMinAngleY;

      const degreesPerPixelX = totalAngleX / this.width;
      const degreesPerPixelY = totalAngleY / this.height;

      const angleX = event.gamma - (this.settings.gyroscopeMinAngleX + this.gammazero);
      const angleY = event.beta - (this.settings.gyroscopeMinAngleY + this.betazero);

      const posX = angleX / degreesPerPixelX;
      const posY = angleY / degreesPerPixelY;

      if (this.updateCall !== null) {
        cancelAnimationFrame(this.updateCall);
      }

      this.event = {
        clientX: posX + this.left,
        clientY: posY + this.top,
      };

      this.updateCall = requestAnimationFrame(this.updateBind);
    }

    onMouseEnter() {
      this.updateElementPosition();
      this.element.style.willChange = 'transform';
      this.setTransition();
    }

    onMouseMove(event) {
      if (this.updateCall !== null) {
        cancelAnimationFrame(this.updateCall);
      }

      this.event = event;
      this.updateCall = requestAnimationFrame(this.updateBind);
    }

    onMouseLeave() {
      this.setTransition();

      if (this.settings.reset) {
        requestAnimationFrame(this.resetBind);
      }
    }

    reset() {
      this.event = {
        clientX: this.left + this.width / 2,
        clientY: this.top + this.height / 2,
      };

      if (this.element && this.element.style) {
        this.element.style.transform = `perspective(${this.settings.perspective}px) ` + `rotateX(0deg) ` + `rotateY(0deg) ` + `scale3d(1, 1, 1)`;
      }

      this.resetGlare();
    }

    resetGlare() {
      if (this.glare) {
        this.glareElement.style.transform = 'rotate(180deg) translate(-50%, -50%)';
        this.glareElement.style.opacity = '0';
      }
    }

    updateInitialPosition() {
      if (this.settings.startX === 0 && this.settings.startY === 0) {
        return;
      }

      this.onMouseEnter();

      if (this.fullPageListening) {
        this.event = {
          clientX: ((this.settings.startX + this.settings.max) / (2 * this.settings.max)) * this.clientWidth,
          clientY: ((this.settings.startY + this.settings.max) / (2 * this.settings.max)) * this.clientHeight,
        };
      } else {
        this.event = {
          clientX: this.left + ((this.settings.startX + this.settings.max) / (2 * this.settings.max)) * this.width,
          clientY: this.top + ((this.settings.startY + this.settings.max) / (2 * this.settings.max)) * this.height,
        };
      }

      let backupScale = this.settings.scale;
      this.settings.scale = 1;
      this.update();
      this.settings.scale = backupScale;
      this.resetGlare();
    }

    getValues() {
      let x, y;

      if (this.fullPageListening) {
        x = this.event.clientX / this.clientWidth;
        y = this.event.clientY / this.clientHeight;
      } else {
        x = (this.event.clientX - this.left) / this.width;
        y = (this.event.clientY - this.top) / this.height;
      }

      x = Math.min(Math.max(x, 0), 1);
      y = Math.min(Math.max(y, 0), 1);

      let tiltX = (this.reverse * (this.settings.max - x * this.settings.max * 2)).toFixed(2);
      let tiltY = (this.reverse * (y * this.settings.max * 2 - this.settings.max)).toFixed(2);
      let angle = Math.atan2(this.event.clientX - (this.left + this.width / 2), -(this.event.clientY - (this.top + this.height / 2))) * (180 / Math.PI);

      return {
        tiltX: tiltX,
        tiltY: tiltY,
        percentageX: x * 100,
        percentageY: y * 100,
        angle: angle,
      };
    }

    updateElementPosition() {
      let rect = this.element.getBoundingClientRect();

      this.width = this.element.offsetWidth;
      this.height = this.element.offsetHeight;
      this.left = rect.left;
      this.top = rect.top;
    }

    update() {
      let values = this.getValues();

      this.element.style.transform =
        'perspective(' +
        this.settings.perspective +
        'px) ' +
        'rotateX(' +
        (this.settings.axis === 'x' ? 0 : values.tiltY) +
        'deg) ' +
        'rotateY(' +
        (this.settings.axis === 'y' ? 0 : values.tiltX) +
        'deg) ' +
        'scale3d(' +
        this.settings.scale +
        ', ' +
        this.settings.scale +
        ', ' +
        this.settings.scale +
        ')';

      if (this.glare) {
        this.glareElement.style.transform = `rotate(${values.angle}deg) translate(-50%, -50%)`;
        this.glareElement.style.opacity = `${(values.percentageY * this.settings['max-glare']) / 100}`;
      }

      this.element.dispatchEvent(
        new CustomEvent('tiltChange', {
          detail: values,
        })
      );

      this.updateCall = null;
    }

    /**
     * Appends the glare element (if glarePrerender equals false)
     * and sets the default style
     */
    prepareGlare() {
      // If option pre-render is enabled we assume all html/css is present for an optimal glare effect.
      if (!this.glarePrerender) {
        // Create glare element
        const jsTiltGlare = document.createElement('div');
        jsTiltGlare.classList.add('js-tilt-glare');

        const jsTiltGlareInner = document.createElement('div');
        jsTiltGlareInner.classList.add('js-tilt-glare-inner');

        jsTiltGlare.appendChild(jsTiltGlareInner);
        this.element.appendChild(jsTiltGlare);
      }

      this.glareElementWrapper = this.element.querySelector('.js-tilt-glare');
      this.glareElement = this.element.querySelector('.js-tilt-glare-inner');

      if (this.glarePrerender) {
        return;
      }

      Object.assign(this.glareElementWrapper.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        'pointer-events': 'none',
      });

      Object.assign(this.glareElement.style, {
        position: 'absolute',
        top: '50%',
        left: '50%',
        'pointer-events': 'none',
        'background-image': `linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)`,
        width: `${this.element.offsetWidth * 2}px`,
        height: `${this.element.offsetWidth * 2}px`,
        transform: 'rotate(180deg) translate(-50%, -50%)',
        'transform-origin': '0% 0%',
        opacity: '0',
      });
    }

    updateGlareSize() {
      if (this.glare) {
        Object.assign(this.glareElement.style, {
          width: `${this.element.offsetWidth * 2}`,
          height: `${this.element.offsetWidth * 2}`,
        });
      }
    }

    updateClientSize() {
      this.clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

      this.clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    }

    onWindowResize() {
      this.updateGlareSize();
      this.updateClientSize();
    }

    setTransition() {
      clearTimeout(this.transitionTimeout);
      this.element.style.transition = this.settings.speed + 'ms ' + this.settings.easing;
      if (this.glare) this.glareElement.style.transition = `opacity ${this.settings.speed}ms ${this.settings.easing}`;

      this.transitionTimeout = setTimeout(() => {
        this.element.style.transition = '';
        if (this.glare) {
          this.glareElement.style.transition = '';
        }
      }, this.settings.speed);
    }

    /**
     * Method return patched settings of instance
     * @param {boolean} settings.reverse - reverse the tilt direction
     * @param {number} settings.max - max tilt rotation (degrees)
     * @param {startX} settings.startX - the starting tilt on the X axis, in degrees. Default: 0
     * @param {startY} settings.startY - the starting tilt on the Y axis, in degrees. Default: 0
     * @param {number} settings.perspective - Transform perspective, the lower the more extreme the tilt gets
     * @param {string} settings.easing - Easing on enter/exit
     * @param {number} settings.scale - 2 = 200%, 1.5 = 150%, etc..
     * @param {number} settings.speed - Speed of the enter/exit transition
     * @param {boolean} settings.transition - Set a transition on enter/exit
     * @param {string|null} settings.axis - What axis should be disabled. Can be X or Y
     * @param {boolean} settings.glare - What axis should be disabled. Can be X or Y
     * @param {number} settings.max-glare - the maximum "glare" opacity (1 = 100%, 0.5 = 50%)
     * @param {boolean} settings.glare-prerender - false = VanillaTilt creates the glare elements for you, otherwise
     * @param {boolean} settings.full-page-listening - If true, parallax effect will listen to mouse move events on the whole document, not only the selected element
     * @param {string|object} settings.mouse-event-element - String selector or link to HTML-element what will be listen mouse events
     * @param {boolean} settings.reset - false = If the tilt effect has to be reset on exit
     * @param {gyroscope} settings.gyroscope - Enable tilting by deviceorientation events
     * @param {gyroscopeSensitivity} settings.gyroscopeSensitivity - Between 0 and 1 - The angle at which max tilt position is reached. 1 = 90deg, 0.5 = 45deg, etc..
     * @param {gyroscopeSamples} settings.gyroscopeSamples - How many gyroscope moves to decide the starting position.
     */
    extendSettings(settings) {
      let defaultSettings = {
        reverse: false,
        max: 15,
        startX: 0,
        startY: 0,
        perspective: 1000,
        easing: 'cubic-bezier(.03,.98,.52,.99)',
        scale: 1,
        speed: 300,
        transition: true,
        axis: null,
        glare: false,
        'max-glare': 1,
        'glare-prerender': false,
        'full-page-listening': false,
        'mouse-event-element': null,
        reset: true,
        gyroscope: true,
        gyroscopeMinAngleX: -45,
        gyroscopeMaxAngleX: 45,
        gyroscopeMinAngleY: -45,
        gyroscopeMaxAngleY: 45,
        gyroscopeSamples: 10,
      };

      let newSettings = {};
      for (var property in defaultSettings) {
        if (property in settings) {
          newSettings[property] = settings[property];
        } else if (this.element.hasAttribute('data-tilt-' + property)) {
          let attribute = this.element.getAttribute('data-tilt-' + property);
          try {
            newSettings[property] = JSON.parse(attribute);
          } catch (e) {
            newSettings[property] = attribute;
          }
        } else {
          newSettings[property] = defaultSettings[property];
        }
      }

      return newSettings;
    }

    static init(elements, settings) {
      if (elements instanceof Node) {
        elements = [elements];
      }

      if (elements instanceof NodeList) {
        elements = [].slice.call(elements);
      }

      if (!(elements instanceof Array)) {
        return;
      }

      elements.forEach((element) => {
        if (!('vanillaTilt' in element)) {
          element.vanillaTilt = new VanillaTilt(element, settings);
        }
      });
    }
  }

  if (typeof document !== 'undefined') {
    /* expose the class to window */
    window.VanillaTilt = VanillaTilt;

    /**
     * Auto load
     */
    VanillaTilt.init(document.querySelectorAll('[data-tilt]'));
  }

  return VanillaTilt;
})();
;
const manuIcon = document.querySelector('.manu-icon');
const manuBody = document.querySelector('.manu__body');

if (manuIcon) {
  manuIcon.addEventListener('click', (e) => {
    manuIcon.classList.toggle('active');
    manuBody.classList.toggle('active');
    body.classList.toggle('lock');
  });
}
;
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
;
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
;
function testWebP(callback) {
  var webP = new Image();
  webP.onload = webP.onerror = function () {
    callback(webP.height == 2);
  };
  webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
}

testWebP(function (support) {
  if (support == true) {
    document.querySelector('body').classList.add('webp');
  } else {
    document.querySelector('body').classList.add('no-webp');
  }
});
;
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
;
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
;
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
	<a class="product-actions-list__icone" href="${productLikeUrl}">
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
;
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
;
!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var n=t();for(var o in n)("object"==typeof exports?exports:e)[o]=n[o]}}(window,(function(){return function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";n.r(t);var o,r="fslightbox-",i="".concat(r,"styles"),s="".concat(r,"cursor-grabbing"),a="".concat(r,"full-dimension"),c="".concat(r,"flex-centered"),l="".concat(r,"open"),u="".concat(r,"transform-transition"),d="".concat(r,"absoluted"),p="".concat(r,"slide-btn"),f="".concat(p,"-container"),h="".concat(r,"fade-in"),m="".concat(r,"fade-out"),g=h+"-strong",v=m+"-strong",b="".concat(r,"opacity-"),x="".concat(b,"1"),y="".concat(r,"source");function S(e){return(S="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}"object"===("undefined"==typeof document?"undefined":S(document))&&((o=document.createElement("style")).className=i,o.appendChild(document.createTextNode(".fslightbox-absoluted{position:absolute;top:0;left:0}.fslightbox-fade-in{animation:fslightbox-fade-in .3s cubic-bezier(0,0,.7,1)}.fslightbox-fade-out{animation:fslightbox-fade-out .3s ease}.fslightbox-fade-in-strong{animation:fslightbox-fade-in-strong .3s cubic-bezier(0,0,.7,1)}.fslightbox-fade-out-strong{animation:fslightbox-fade-out-strong .3s ease}@keyframes fslightbox-fade-in{from{opacity:.65}to{opacity:1}}@keyframes fslightbox-fade-out{from{opacity:.35}to{opacity:0}}@keyframes fslightbox-fade-in-strong{from{opacity:.3}to{opacity:1}}@keyframes fslightbox-fade-out-strong{from{opacity:1}to{opacity:0}}.fslightbox-cursor-grabbing{cursor:grabbing}.fslightbox-full-dimension{width:100%;height:100%}.fslightbox-open{overflow:hidden;height:100%}.fslightbox-flex-centered{display:flex;justify-content:center;align-items:center}.fslightbox-opacity-0{opacity:0!important}.fslightbox-opacity-1{opacity:1!important}.fslightbox-scrollbarfix{padding-right:17px}.fslightbox-transform-transition{transition:transform .3s}.fslightbox-container{font-family:Arial,sans-serif;position:fixed;top:0;left:0;background:linear-gradient(rgba(30,30,30,.9),#000 1810%);touch-action:pinch-zoom;z-index:1000000000;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent}.fslightbox-container *{box-sizing:border-box}.fslightbox-svg-path{transition:fill .15s ease;fill:#ddd}.fslightbox-nav{height:45px;width:100%;position:absolute;top:0;left:0}.fslightbox-slide-number-container{display:flex;justify-content:center;align-items:center;position:relative;height:100%;font-size:15px;color:#d7d7d7;z-index:0;max-width:55px;text-align:left}.fslightbox-slide-number-container .fslightbox-flex-centered{height:100%}.fslightbox-slash{display:block;margin:0 5px;width:1px;height:12px;transform:rotate(15deg);background:#fff}.fslightbox-toolbar{position:absolute;z-index:3;right:0;top:0;height:100%;display:flex;background:rgba(35,35,35,.65)}.fslightbox-toolbar-button{height:100%;width:45px;cursor:pointer}.fslightbox-toolbar-button:hover .fslightbox-svg-path{fill:#fff}.fslightbox-slide-btn-container{display:flex;align-items:center;padding:12px 12px 12px 6px;position:absolute;top:50%;cursor:pointer;z-index:3;transform:translateY(-50%)}@media (min-width:476px){.fslightbox-slide-btn-container{padding:22px 22px 22px 6px}}@media (min-width:768px){.fslightbox-slide-btn-container{padding:30px 30px 30px 6px}}.fslightbox-slide-btn-container:hover .fslightbox-svg-path{fill:#f1f1f1}.fslightbox-slide-btn{padding:9px;font-size:26px;background:rgba(35,35,35,.65)}@media (min-width:768px){.fslightbox-slide-btn{padding:10px}}@media (min-width:1600px){.fslightbox-slide-btn{padding:11px}}.fslightbox-slide-btn-container-previous{left:0}@media (max-width:475.99px){.fslightbox-slide-btn-container-previous{padding-left:3px}}.fslightbox-slide-btn-container-next{right:0;padding-left:12px;padding-right:3px}@media (min-width:476px){.fslightbox-slide-btn-container-next{padding-left:22px}}@media (min-width:768px){.fslightbox-slide-btn-container-next{padding-left:30px}}@media (min-width:476px){.fslightbox-slide-btn-container-next{padding-right:6px}}.fslightbox-down-event-detector{position:absolute;z-index:1}.fslightbox-slide-swiping-hoverer{z-index:4}.fslightbox-invalid-file-wrapper{font-size:22px;color:#eaebeb;margin:auto}.fslightbox-video{object-fit:cover}.fslightbox-youtube-iframe{border:0}.fslightbox-loader{display:block;margin:auto;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:67px;height:67px}.fslightbox-loader div{box-sizing:border-box;display:block;position:absolute;width:54px;height:54px;margin:6px;border:5px solid;border-color:#999 transparent transparent transparent;border-radius:50%;animation:fslightbox-loader 1.2s cubic-bezier(.5,0,.5,1) infinite}.fslightbox-loader div:nth-child(1){animation-delay:-.45s}.fslightbox-loader div:nth-child(2){animation-delay:-.3s}.fslightbox-loader div:nth-child(3){animation-delay:-.15s}@keyframes fslightbox-loader{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}.fslightbox-source{position:relative;z-index:2;opacity:0}")),document.head.appendChild(o));function w(e){var t,n=e.props,o=0,r={};this.getSourceTypeFromLocalStorageByUrl=function(e){return t[e]?t[e]:i(e)},this.handleReceivedSourceTypeForUrl=function(e,n){!1===r[n]&&(o--,"invalid"!==e?r[n]=e:delete r[n],0===o&&(!function(e,t){for(var n in t)e[n]=t[n]}(t,r),localStorage.setItem("fslightbox-types",JSON.stringify(t))))};var i=function(e){o++,r[e]=!1};n.disableLocalStorage?(this.getSourceTypeFromLocalStorageByUrl=function(){},this.handleReceivedSourceTypeForUrl=function(){}):(t=JSON.parse(localStorage.getItem("fslightbox-types")))||(t={},this.getSourceTypeFromLocalStorageByUrl=i)}function L(e,t,n,o){var r=e.data,i=e.elements.sources,s=n/o,a=0;this.adjustSize=function(){if((a=r.maxSourceWidth/s)<r.maxSourceHeight)return n<r.maxSourceWidth&&(a=o),c();a=o>r.maxSourceHeight?r.maxSourceHeight:o,c()};var c=function(){i[t].style.width=a*s+"px",i[t].style.height=a+"px"}}function C(e,t){var n=this,o=e.collections.sourceSizers,r=e.elements,i=r.sourceAnimationWrappers,s=r.sourceMainWrappers,a=r.sources,c=e.resolve;function l(e,n){o[t]=c(L,[t,e,n]),o[t].adjustSize()}this.runActions=function(e,o){a[t].classList.add(x),i[t].classList.add(g),s[t].removeChild(s[t].firstChild),l(e,o),n.runActions=l}}function F(e,t){var n,o=this,r=e.elements.sources,i=e.props,s=(0,e.resolve)(C,[t]);this.handleImageLoad=function(e){var t=e.target,n=t.naturalWidth,o=t.naturalHeight;s.runActions(n,o)},this.handleVideoLoad=function(e){var t=e.target,o=t.videoWidth,r=t.videoHeight;n=!0,s.runActions(o,r)},this.handleNotMetaDatedVideoLoad=function(){n||o.handleYoutubeLoad()},this.handleYoutubeLoad=function(){var e=1920,t=1080;i.maxYoutubeDimensions&&(e=i.maxYoutubeDimensions.width,t=i.maxYoutubeDimensions.height),s.runActions(e,t)},this.handleCustomLoad=function(){setTimeout((function(){var e=r[t];s.runActions(e.offsetWidth,e.offsetHeight)}))}}function A(e,t,n){var o=e.elements.sources,r=e.props.customClasses,i=r[t]?r[t]:"";o[t].className=n+" "+i}function I(e,t){var n=e.elements.sources,o=e.props.customAttributes;for(var r in o[t])n[t].setAttribute(r,o[t][r])}function T(e,t){var n=e.collections.sourceLoadHandlers,o=e.elements,r=o.sources,i=o.sourceAnimationWrappers,s=e.props.sources;r[t]=document.createElement("img"),A(e,t,y),r[t].src=s[t],r[t].onload=n[t].handleImageLoad,I(e,t),i[t].appendChild(r[t])}function E(e,t){var n=e.collections.sourceLoadHandlers,o=e.elements,r=o.sources,i=o.sourceAnimationWrappers,s=e.props,a=s.sources,c=s.videosPosters;r[t]=document.createElement("video"),A(e,t,y),r[t].src=a[t],r[t].onloadedmetadata=function(e){n[t].handleVideoLoad(e)},r[t].controls=!0,I(e,t),c[t]&&(r[t].poster=c[t]);var l=document.createElement("source");l.src=a[t],r[t].appendChild(l),setTimeout(n[t].handleNotMetaDatedVideoLoad,3e3),i[t].appendChild(r[t])}function N(e,t){var n=e.collections.sourceLoadHandlers,o=e.elements,i=o.sources,s=o.sourceAnimationWrappers,a=e.props.sources;i[t]=document.createElement("iframe"),A(e,t,"".concat(y," ").concat(r,"youtube-iframe")),i[t].src="https://www.youtube.com/embed/".concat(a[t].match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/)[2],"?enablejsapi=1"),i[t].allowFullscreen=!0,I(e,t),s[t].appendChild(i[t]),n[t].handleYoutubeLoad()}function W(e,t){var n=e.collections.sourceLoadHandlers,o=e.elements,r=o.sources,i=o.sourceAnimationWrappers,s=e.props.sources;r[t]=s[t],A(e,t,"".concat(r[t].className," ").concat(y)),i[t].appendChild(r[t]),n[t].handleCustomLoad()}function z(e,t){var n=e.elements,o=n.sources,i=n.sourceAnimationWrappers,s=n.sourceMainWrappers;e.props.sources;o[t]=document.createElement("div"),o[t].className="".concat(r,"invalid-file-wrapper ").concat(c),o[t].innerHTML="Invalid source",i[t].classList.add(g),i[t].appendChild(o[t]),s[t].removeChild(s[t].firstChild)}function M(e){var t=e.collections,n=t.sourceLoadHandlers,o=t.sourcesRenderFunctions,r=e.core.sourceDisplayFacade,i=e.resolve;this.runActionsForSourceTypeAndIndex=function(t,s){var a;switch("invalid"!==t&&(n[s]=i(F,[s])),t){case"image":a=T;break;case"video":a=E;break;case"youtube":a=N;break;case"custom":a=W;break;default:a=z}o[s]=function(){return a(e,s)},r.displaySourcesWhichShouldBeDisplayed()}}function P(){var e,t,n,o={isUrlYoutubeOne:function(e){var t=document.createElement("a");return t.href=e,"www.youtube.com"===t.hostname},getTypeFromResponseContentType:function(e){return e.slice(0,e.indexOf("/"))}};function r(){if(4!==n.readyState){if(2===n.readyState){var e;switch(o.getTypeFromResponseContentType(n.getResponseHeader("content-type"))){case"image":e="image";break;case"video":e="video";break;default:e="invalid"}n.onreadystatechange=null,n.abort(),t(e)}}else t("invalid")}this.setUrlToCheck=function(t){e=t},this.getSourceType=function(i){if(o.isUrlYoutubeOne(e))return i("youtube");t=i,(n=new XMLHttpRequest).onreadystatechange=r,n.open("GET",e,!0),n.send()}}function H(e,t,n){var o=e.props,r=o.types,i=o.type,s=o.sources,a=e.resolve;this.getTypeSetByClientForIndex=function(e){var t;return r&&r[e]?t=r[e]:i&&(t=i),t},this.retrieveTypeWithXhrForIndex=function(e){var o=a(P);o.setUrlToCheck(s[e]),o.getSourceType((function(o){t.handleReceivedSourceTypeForUrl(o,s[e]),n.runActionsForSourceTypeAndIndex(o,e)}))}}function k(e,t){var n=e.componentsServices.hideSourceLoaderIfNotYetCollection,o=e.elements,r=o.sourceWrappersContainer,i=o.sourceMainWrappers;i[t]=document.createElement("div"),i[t].className="".concat(d," ").concat(a," ").concat(c),i[t].innerHTML='<div class="fslightbox-loader"><div></div><div></div><div></div><div></div></div>';var s=i[t].firstChild;n[t]=function(){i[t].contains(s)&&i[t].removeChild(s)},r.appendChild(i[t]),function(e,t){var n=e.elements,o=n.sourceMainWrappers,r=n.sourceAnimationWrappers;r[t]=document.createElement("div"),o[t].appendChild(r[t])}(e,t)}function O(e,t,n,o){var i=document.createElementNS("http://www.w3.org/2000/svg","svg");i.setAttributeNS(null,"width",t),i.setAttributeNS(null,"height",t),i.setAttributeNS(null,"viewBox",n);var s=document.createElementNS("http://www.w3.org/2000/svg","path");return s.setAttributeNS(null,"class","".concat(r,"svg-path")),s.setAttributeNS(null,"d",o),i.appendChild(s),e.appendChild(i),i}function R(e,t){var n=document.createElement("div");return n.className="".concat(r,"toolbar-button ").concat(c),n.title=t,e.appendChild(n),n}function D(e,t){var n=document.createElement("div");n.className="".concat(r,"toolbar"),t.appendChild(n),function(e,t){var n=e.componentsServices,o=e.core.fullscreenToggler,r=e.data,i="M4.5 11H3v4h4v-1.5H4.5V11zM3 7h1.5V4.5H7V3H3v4zm10.5 6.5H11V15h4v-4h-1.5v2.5zM11 3v1.5h2.5V7H15V3h-4z",s=R(t);s.title="Enter fullscreen";var a=O(s,"20px","0 0 18 18",i);n.enterFullscreen=function(){r.isFullscreenOpen=!0,s.title="Exit fullscreen",a.setAttributeNS(null,"width","24px"),a.setAttributeNS(null,"height","24px"),a.setAttributeNS(null,"viewBox","0 0 950 1024"),a.firstChild.setAttributeNS(null,"d","M682 342h128v84h-212v-212h84v128zM598 810v-212h212v84h-128v128h-84zM342 342v-128h84v212h-212v-84h128zM214 682v-84h212v212h-84v-128h-128z")},n.exitFullscreen=function(){r.isFullscreenOpen=!1,s.title="Enter fullscreen",a.setAttributeNS(null,"width","20px"),a.setAttributeNS(null,"height","20px"),a.setAttributeNS(null,"viewBox","0 0 18 18"),a.firstChild.setAttributeNS(null,"d",i)},s.onclick=function(){r.isFullscreenOpen?o.exitFullscreen():o.enterFullscreen()}}(e,n),function(e,t){var n=R(t,"Close");n.onclick=e.core.lightboxCloser.closeLightbox,O(n,"20px","0 0 24 24","M 4.7070312 3.2929688 L 3.2929688 4.7070312 L 10.585938 12 L 3.2929688 19.292969 L 4.7070312 20.707031 L 12 13.414062 L 19.292969 20.707031 L 20.707031 19.292969 L 13.414062 12 L 20.707031 4.7070312 L 19.292969 3.2929688 L 12 10.585938 L 4.7070312 3.2929688 z")}(e,n)}function j(e){var t=e.props.sources,n=e.elements.container,o=document.createElement("div");o.className="".concat(r,"nav"),n.appendChild(o),D(e,o),t.length>1&&function(e,t){var n=e.componentsServices,o=e.props.sources,i=(e.stageIndexes,document.createElement("div"));i.className="".concat(r,"slide-number-container");var s=document.createElement("div");s.className=c;var a=document.createElement("span");n.setSlideNumber=function(e){return a.innerHTML=e};var l=document.createElement("span");l.className="".concat(r,"slash");var u=document.createElement("div");u.innerHTML=o.length,i.appendChild(s),s.appendChild(a),s.appendChild(l),s.appendChild(u),t.appendChild(i),setTimeout((function(){s.offsetWidth>55&&(i.style.justifyContent="flex-start")}))}(e,o)}function X(e,t){var n=this,o=e.elements.sourceMainWrappers,r=e.props,i=0;this.byValue=function(e){return i=e,n},this.negative=function(){s(-a())},this.zero=function(){s(0)},this.positive=function(){s(a())};var s=function(e){o[t].style.transform="translateX(".concat(e+i,"px)"),i=0},a=function(){return(1+r.slideDistance)*innerWidth}}function B(e,t,n,o){var r=e.elements.container,i=n.charAt(0).toUpperCase()+n.slice(1),s=document.createElement("div");s.className="".concat(f," ").concat(f,"-").concat(n),s.title="".concat(i," slide"),s.onclick=t,function(e,t){var n=document.createElement("div");n.className="".concat(p," ").concat(c),O(n,"20px","0 0 20 20",t),e.appendChild(n)}(s,o),r.appendChild(s)}function U(e,t){var n=e.classList;n.contains(t)&&n.remove(t)}function V(e){var t=this,n=e.core,o=n.eventsDispatcher,r=n.fullscreenToggler,i=n.globalEventsController,s=n.scrollbarRecompensor,a=e.data,c=e.elements,u=e.props,d=e.sourcePointerProps;this.isLightboxFadingOut=!1,this.runActions=function(){t.isLightboxFadingOut=!0,c.container.classList.add(v),i.removeListeners(),u.exitFullscreenOnClose&&a.isFullscreenOpen&&r.exitFullscreen(),setTimeout((function(){t.isLightboxFadingOut=!1,d.isPointering=!1,c.container.classList.remove(v),document.documentElement.classList.remove(l),s.removeRecompense(),document.body.removeChild(c.container),o.dispatch("onClose")}),270)}}function Y(e){var t,n,o,r=e.collections.sourceMainWrappersTransformers,i=e.componentsServices,s=e.core,a=s.classFacade,c=s.slideIndexChanger,l=s.sourceDisplayFacade,d=s.stageManager,p=e.elements.sourceAnimationWrappers,f=e.stageIndexes,v=(t=function(){a.removeFromEachElementClassIfContains("sourceAnimationWrappers",m)},n=300,o=[],function(){o.push(!0),setTimeout((function(){o.pop(),o.length||t()}),n)});c.changeTo=function(e){f.current=e,d.updateStageIndexes(),i.setSlideNumber(e+1),l.displaySourcesWhichShouldBeDisplayed()},c.jumpTo=function(e){var t=f.current;c.changeTo(e),a.removeFromEachElementClassIfContains("sourceMainWrappers",u),U(p[t],g),U(p[t],h),p[t].classList.add(m),U(p[e],g),U(p[e],m),p[e].classList.add(h),v(),r[e].zero(),setTimeout((function(){t!==f.current&&r[t].negative()}),270)}}function _(e){var t=e.core,n=t.lightboxCloser,o=t.fullscreenToggler,r=t.slideChangeFacade;this.listener=function(e){switch(e.key){case"Escape":n.closeLightbox();break;case"ArrowLeft":r.changeToPrevious();break;case"ArrowRight":r.changeToNext();break;case"F11":e.preventDefault(),o.enterFullscreen()}}}function q(e){var t=e.collections.sourceMainWrappersTransformers,n=e.elements,o=e.sourcePointerProps,r=e.stageIndexes;function i(e,n){t[e].byValue(o.swipedX)[n]()}this.runActionsForEvent=function(e){var t,a,c;n.container.contains(n.slideSwipingHoverer)||n.container.appendChild(n.slideSwipingHoverer),t=n.container,a=s,(c=t.classList).contains(a)||c.add(a),o.swipedX=e.screenX-o.downScreenX,i(r.current,"zero"),void 0!==r.previous&&o.swipedX>0?i(r.previous,"negative"):void 0!==r.next&&o.swipedX<0&&i(r.next,"positive")}}function J(e){var t=e.props.sources,n=e.resolve,o=e.sourcePointerProps,r=n(q);1===t.length?this.listener=function(){o.swipedX=1}:this.listener=function(e){o.isPointering&&r.runActionsForEvent(e)}}function G(e){var t=e.collections.sourceMainWrappersTransformers,n=e.core.slideIndexChanger,o=e.elements.sourceMainWrappers,r=e.stageIndexes;this.runPositiveSwipedXActions=function(){void 0===r.previous||(i("positive"),n.changeTo(r.previous)),i("zero")},this.runNegativeSwipedXActions=function(){void 0===r.next||(i("negative"),n.changeTo(r.next)),i("zero")};var i=function(e){o[r.current].classList.add(u),t[r.current][e]()}}function $(e,t){e.contains(t)&&e.removeChild(t)}function K(e){var t=e.core.lightboxCloser,n=e.elements,o=e.resolve,r=e.sourcePointerProps,i=o(G);this.runNoSwipeActions=function(){$(n.container,n.slideSwipingHoverer),r.isSourceDownEventTarget||t.closeLightbox(),r.isPointering=!1},this.runActions=function(){r.swipedX>0?i.runPositiveSwipedXActions():i.runNegativeSwipedXActions(),$(n.container,n.slideSwipingHoverer),n.container.classList.remove(s),r.isPointering=!1}}function Q(e){var t=e.resolve,n=e.sourcePointerProps,o=t(K);this.listener=function(){n.isPointering&&(n.swipedX?o.runActions():o.runNoSwipeActions())}}function Z(e){var t,n,o;n=(t=e).core.classFacade,o=t.elements,n.removeFromEachElementClassIfContains=function(e,t){for(var n=0;n<o[e].length;n++)U(o[e][n],t)},function(e){var t=e.core.eventsDispatcher,n=e.props;t.dispatch=function(e){n[e]&&n[e]()}}(e),function(e){var t=e.componentsServices,n=e.core.fullscreenToggler;n.enterFullscreen=function(){t.enterFullscreen();var e=document.documentElement;e.requestFullscreen?e.requestFullscreen():e.mozRequestFullScreen?e.mozRequestFullScreen():e.webkitRequestFullscreen?e.webkitRequestFullscreen():e.msRequestFullscreen&&e.msRequestFullscreen()},n.exitFullscreen=function(){t.exitFullscreen(),document.exitFullscreen?document.exitFullscreen():document.mozCancelFullScreen?document.mozCancelFullScreen():document.webkitExitFullscreen?document.webkitExitFullscreen():document.msExitFullscreen&&document.msExitFullscreen()}}(e),function(e){var t=e.core,n=t.globalEventsController,o=t.windowResizeActioner,r=e.resolve,i=r(_),s=r(J),a=r(Q);n.attachListeners=function(){document.addEventListener("pointermove",s.listener),document.addEventListener("pointerup",a.listener),addEventListener("resize",o.runActions),document.addEventListener("keydown",i.listener)},n.removeListeners=function(){document.removeEventListener("pointermove",s.listener),document.removeEventListener("pointerup",a.listener),removeEventListener("resize",o.runActions),document.removeEventListener("keydown",i.listener)}}(e),function(e){var t=e.core.lightboxCloser,n=(0,e.resolve)(V);t.closeLightbox=function(){n.isLightboxFadingOut||n.runActions()}}(e),ne(e),function(e){var t=e.data,n=e.core.scrollbarRecompensor;function o(){document.body.offsetHeight>innerHeight&&(document.body.style.marginRight=t.scrollbarWidth+"px")}n.addRecompense=function(){"complete"===document.readyState?o():addEventListener("load",(function(){o(),n.addRecompense=o}))},n.removeRecompense=function(){document.body.style.removeProperty("margin-right")}}(e),function(e){var t=e.core,n=t.slideChangeFacade,o=t.slideIndexChanger,r=t.stageManager;e.props.sources.length>1?(n.changeToPrevious=function(){o.jumpTo(r.getPreviousSlideIndex())},n.changeToNext=function(){o.jumpTo(r.getNextSlideIndex())}):(n.changeToPrevious=function(){},n.changeToNext=function(){})}(e),Y(e),function(e){var t=e.core,n=t.classFacade,o=t.sourcesPointerDown,r=e.elements.sources,i=e.sourcePointerProps,s=e.stageIndexes;o.listener=function(e){"VIDEO"!==e.target.tagName&&e.preventDefault(),i.isPointering=!0,i.downScreenX=e.screenX,i.swipedX=0;var t=r[s.current];t&&t.contains(e.target)?i.isSourceDownEventTarget=!0:i.isSourceDownEventTarget=!1,n.removeFromEachElementClassIfContains("sourceMainWrappers",u)}}(e),function(e){var t=e.collections.sourcesRenderFunctions,n=e.core.sourceDisplayFacade,o=e.props,r=e.stageIndexes;function i(e){t[e]&&(t[e](),delete t[e])}n.displaySourcesWhichShouldBeDisplayed=function(){if(o.loadOnlyCurrentSource)i(r.current);else for(var e in r)i(r[e])}}(e),function(e){var t=e.stageIndexes,n=e.core.stageManager,o=e.props.sources.length-1;n.getPreviousSlideIndex=function(){return 0===t.current?o:t.current-1},n.getNextSlideIndex=function(){return t.current===o?0:t.current+1},n.updateStageIndexes=0===o?function(){}:1===o?function(){0===t.current?(t.next=1,delete t.previous):(t.previous=0,delete t.next)}:function(){t.previous=n.getPreviousSlideIndex(),t.next=n.getNextSlideIndex()},n.isSourceInStage=o<=2?function(){return!0}:function(e){var n=t.current;if(0===n&&e===o||n===o&&0===e)return!0;var r=n-e;return-1===r||0===r||1===r}}(e),function(e){var t=e.collections,n=t.sourceMainWrappersTransformers,o=t.sourceSizers,r=e.core.windowResizeActioner,i=e.data,s=e.elements.sourceMainWrappers,a=e.props,c=e.stageIndexes;r.runActions=function(){innerWidth<992?i.maxSourceWidth=innerWidth:i.maxSourceWidth=.9*innerWidth,i.maxSourceHeight=.9*innerHeight;for(var e=0;e<a.sources.length;e++)U(s[e],u),e!==c.current&&n[e].negative(),o[e]&&o[e].adjustSize()}}(e)}function ee(e){var t=e.props.disableLocalStorage;if(!t){var n=localStorage.getItem("fslightbox-scrollbar-width");if(n)return n}var o=function(){var e=document.createElement("div"),t=e.style;return t.visibility="hidden",t.width="100px",t.msOverflowStyle="scrollbar",t.overflow="scroll",e}(),r=function(){var e=document.createElement("div");return e.style.width="100%",e}();document.body.appendChild(o);var i=o.offsetWidth;o.appendChild(r);var s=r.offsetWidth;document.body.removeChild(o);var a=i-s;return t||localStorage.setItem("fslightbox-scrollbar-width",a.toString()),a}function te(e){var t=e.core.eventsDispatcher,n=e.data,o=e.elements,i=e.props.sources;n.isInitialized=!0,n.scrollbarWidth=ee(e),function(e){for(var t=e.collections.sourceMainWrappersTransformers,n=e.props.sources,o=e.resolve,r=0;r<n.length;r++)t[r]=o(X,[r])}(e),Z(e),o.container=document.createElement("div"),o.container.className="".concat(r,"container ").concat(a," ").concat(g),function(e){var t=e.elements;t.slideSwipingHoverer=document.createElement("div"),t.slideSwipingHoverer.className="".concat(r,"slide-swiping-hoverer ").concat(a," ").concat(d)}(e),j(e),function(e){var t=e.core.sourcesPointerDown,n=e.elements,o=e.props.sources,r=document.createElement("div");r.className="".concat(d," ").concat(a),n.container.appendChild(r),r.addEventListener("pointerdown",t.listener),n.sourceWrappersContainer=r;for(var i=0;i<o.length;i++)k(e,i)}(e),i.length>1&&function(e){var t=e.core.slideChangeFacade;B(e,t.changeToPrevious,"previous","M18.271,9.212H3.615l4.184-4.184c0.306-0.306,0.306-0.801,0-1.107c-0.306-0.306-0.801-0.306-1.107,0L1.21,9.403C1.194,9.417,1.174,9.421,1.158,9.437c-0.181,0.181-0.242,0.425-0.209,0.66c0.005,0.038,0.012,0.071,0.022,0.109c0.028,0.098,0.075,0.188,0.142,0.271c0.021,0.026,0.021,0.061,0.045,0.085c0.015,0.016,0.034,0.02,0.05,0.033l5.484,5.483c0.306,0.307,0.801,0.307,1.107,0c0.306-0.305,0.306-0.801,0-1.105l-4.184-4.185h14.656c0.436,0,0.788-0.353,0.788-0.788S18.707,9.212,18.271,9.212z"),B(e,t.changeToNext,"next","M1.729,9.212h14.656l-4.184-4.184c-0.307-0.306-0.307-0.801,0-1.107c0.305-0.306,0.801-0.306,1.106,0l5.481,5.482c0.018,0.014,0.037,0.019,0.053,0.034c0.181,0.181,0.242,0.425,0.209,0.66c-0.004,0.038-0.012,0.071-0.021,0.109c-0.028,0.098-0.075,0.188-0.143,0.271c-0.021,0.026-0.021,0.061-0.045,0.085c-0.015,0.016-0.034,0.02-0.051,0.033l-5.483,5.483c-0.306,0.307-0.802,0.307-1.106,0c-0.307-0.305-0.307-0.801,0-1.105l4.184-4.185H1.729c-0.436,0-0.788-0.353-0.788-0.788S1.293,9.212,1.729,9.212z")}(e),function(e){for(var t=e.props.sources,n=e.resolve,o=n(w),r=n(M),i=n(H,[o,r]),s=0;s<t.length;s++)if("string"==typeof t[s]){var a=i.getTypeSetByClientForIndex(s);if(a)r.runActionsForSourceTypeAndIndex(a,s);else{var c=o.getSourceTypeFromLocalStorageByUrl(t[s]);c?r.runActionsForSourceTypeAndIndex(c,s):i.retrieveTypeWithXhrForIndex(s)}}else r.runActionsForSourceTypeAndIndex("custom",s)}(e),t.dispatch("onInit")}function ne(e){var t=e.collections.sourceMainWrappersTransformers,n=e.componentsServices,o=e.core,r=o.eventsDispatcher,i=o.lightboxOpener,s=o.globalEventsController,a=o.scrollbarRecompensor,c=o.sourceDisplayFacade,u=o.stageManager,d=o.windowResizeActioner,p=e.data,f=e.elements,h=e.stageIndexes;i.open=function(){var o=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;h.current=o,p.isInitialized?r.dispatch("onShow"):te(e),u.updateStageIndexes(),c.displaySourcesWhichShouldBeDisplayed(),n.setSlideNumber(o+1),document.body.appendChild(f.container),document.documentElement.classList.add(l),a.addRecompense(),s.attachListeners(),d.runActions(),t[h.current].zero(),r.dispatch("onOpen")}}function oe(e,t,n){return(oe=re()?Reflect.construct:function(e,t,n){var o=[null];o.push.apply(o,t);var r=new(Function.bind.apply(e,o));return n&&ie(r,n.prototype),r}).apply(null,arguments)}function re(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}function ie(e,t){return(ie=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function se(e){return function(e){if(Array.isArray(e))return ae(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||function(e,t){if(!e)return;if("string"==typeof e)return ae(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return ae(e,t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function ae(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,o=new Array(t);n<t;n++)o[n]=e[n];return o}function ce(){for(var e=document.getElementsByTagName("a"),t=function(t){if(!e[t].hasAttribute("data-fslightbox"))return"continue";var n=e[t].getAttribute("data-fslightbox"),o=e[t].getAttribute("href");fsLightboxInstances[n]||(fsLightboxInstances[n]=new FsLightbox);var r=null;r="#"===o.charAt(0)?document.getElementById(o.substring(1)):o,fsLightboxInstances[n].props.sources.push(r),fsLightboxInstances[n].elements.a.push(e[t]);var i=fsLightboxInstances[n].props.sources.length-1;e[t].onclick=function(e){e.preventDefault(),fsLightboxInstances[n].open(i)},d("types","data-type"),d("videosPosters","data-video-poster"),d("customClasses","data-class"),d("customClasses","data-custom-class");for(var s=["href","data-fslightbox","data-type","data-video-poster","data-class","data-custom-class"],a=e[t].attributes,c=fsLightboxInstances[n].props.customAttributes,l=0;l<a.length;l++)if(-1===s.indexOf(a[l].name)&&"data-"===a[l].name.substr(0,5)){c[i]||(c[i]={});var u=a[l].name.substr(5);c[i][u]=a[l].value}function d(o,r){e[t].hasAttribute(r)&&(fsLightboxInstances[n].props[o][i]=e[t].getAttribute(r))}},n=0;n<e.length;n++)t(n);var o=Object.keys(fsLightboxInstances);window.fsLightbox=fsLightboxInstances[o[o.length-1]]}window.FsLightbox=function(){var e=this;this.props={sources:[],customAttributes:[],customClasses:[],types:[],videosPosters:[],slideDistance:.3},this.data={isInitialized:!1,isFullscreenOpen:!1,maxSourceWidth:0,maxSourceHeight:0,scrollbarWidth:0},this.sourcePointerProps={downScreenX:null,isPointering:!1,isSourceDownEventTarget:!1,swipedX:0},this.stageIndexes={},this.elements={a:[],container:null,slideSwipingHoverer:null,sourceWrappersContainer:null,sources:[],sourceMainWrappers:[],sourceAnimationWrappers:[]},this.componentsServices={enterFullscreen:null,exitFullscreen:null,hideSourceLoaderIfNotYetCollection:[],setSlideNumber:function(){}},this.resolve=function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[];return n.unshift(e),oe(t,se(n))},this.collections={sourceMainWrappersTransformers:[],sourceLoadHandlers:[],sourcesRenderFunctions:[],sourceSizers:[]},this.core={classFacade:{},eventsDispatcher:{},fullscreenToggler:{},globalEventsController:{},lightboxCloser:{},lightboxOpener:{},lightboxUpdater:{},scrollbarRecompensor:{},slideChangeFacade:{},slideIndexChanger:{},sourcesPointerDown:{},sourceDisplayFacade:{},stageManager:{},windowResizeActioner:{}},ne(this),this.open=function(t){return e.core.lightboxOpener.open(t)},this.close=function(){return e.core.lightboxCloser.closeLightbox()}},window.fsLightboxInstances={},ce(),window.refreshFsLightbox=function(){for(var e in fsLightboxInstances){var t=fsLightboxInstances[e].props;fsLightboxInstances[e]=new FsLightbox,fsLightboxInstances[e].props=t,fsLightboxInstances[e].props.sources=[],fsLightboxInstances[e].elements.a=[]}ce()}}])}));;
const spollersArray = document.querySelectorAll('[data-spollers]');
if (spollersArray.length > 0) {
  const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
    return !item.dataset.spollers.split(',')[0];
  });

  if (spollersRegular.length > 0) {
    initSpollers(spollersRegular);
  }

  const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
    return item.dataset.spollers.split(',')[0];
  });

  if (spollersMedia.length > 0) {
    const breakpointsArray = [];
    spollersMedia.forEach((item) => {
      const params = item.dataset.spollers;
      const breakpoints = {};
      const paramsArray = params.split(',');
      breakpoints.value = paramsArray[0];
      breakpoints.type = paramsArray[1] ? paramsArray[1].trim() : 'max';
      breakpoints.item = item;
      breakpointsArray.push(breakpoints);
    });

    let mediaQueries = breakpointsArray.map(function (item) {
      return '(' + item.type + '-width: ' + item.value + 'px),' + item.value + ',' + item.type;
    });

    mediaQueries = mediaQueries.filter(function (item, index, self) {
      return self.indexOf(item) === index;
    });

    mediaQueries.forEach((breakpoints) => {
      const paramsArray = breakpoints.split(',');
      const mediaBreakpoints = paramsArray[1];
      const mediaType = paramsArray[2];
      const matchMedia = window.matchMedia(paramsArray[0]);

      const spollersArray = breakpointsArray.filter(function (item) {
        if (item.value === mediaBreakpoints && item.type === mediaType) {
          return true;
        }
      });

      matchMedia.addListener(function () {
        initSpollers(spollersArray, matchMedia);
      });
      initSpollers(spollersArray, matchMedia);
    });
  }
  function initSpollers(spollersArray, matchMedia = false) {
    spollersArray.forEach((spollersBlock) => {
      spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
      if (matchMedia.matches || !matchMedia) {
        spollersBlock.classList.add('init');
        initSpollerBody(spollersBlock);
        spollersBlock.addEventListener('click', setSpollerAction);
      } else {
        spollersBlock.classList.remove('init');
        initSpollerBody(spollersBlock, false);
        spollersBlock.removeEventListener('click', setSpollerAction);
      }
    });
  }

  function initSpollerBody(spollersBlock, hideSpollerBody = true) {
    const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
    if (spollerTitles.length > 0) {
      spollerTitles.forEach((spollerTitle) => {
        if (hideSpollerBody) {
          spollerTitle.removeAttribute('tabindex');
          if (!spollerTitle.classList.contains('active')) {
            spollerTitle.nextElementSibling.hidden = true;
          }
        } else {
          spollerTitle.setAttribute('tabindex', '-1');
          spollerTitle.nextElementSibling.hidden = false;
        }
      });
    }
  }

  function setSpollerAction(e) {
    const el = e.target;
    if (el.hasAttribute('data-spoller') || el.classList('[data-spoller]')) {
      const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
      const spollersBlock = spollerTitle.closest('[data-spollers]');
      const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
      if (!spollersBlock.querySelectorAll('.slide').length) {
        if (oneSpoller && !spollerTitle.classList.contains('active')) {
          hideSpollerBody(spollersBlock);
        }
        spollerTitle.classList.toggle('active');
        _slideToggle(spollerTitle.nextElementSibling, 500);
      }
      e.preventDefault();
    }
  }

  function hideSpollerBody(spollersBlock) {
    const spollerActiveTitle = spollersBlock.querySelector('[data-spoller].active');
    if (spollerActiveTitle) {
      spollerActiveTitle.classList.remove('active');
      _slideUp(spollerActiveTitle.nextElementSibling, 500);
    }
  }
}

let _slideUp = (target, duration = 500) => {
  if (!target.classList.contains('_slide')) {
    target.classList.add('slide');
    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = duration + 'ms';
    target.style.height = target.offsetHeight + 'px';
    target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout(() => {
      target.hidden = true;
      target.style.removeProperty('height');
      target.style.removeProperty('padding-top');
      target.style.removeProperty('padding-bottom');
      target.style.removeProperty('margin-top');
      target.style.removeProperty('margin-bottom');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
      target.classList.remove('slide');
    }, duration);
  }
};

let _slideDown = (target, duration = 500) => {
  if (!target.classList.contains('_slide')) {
    target.classList.add('slide');
    if (target.hidden) {
      target.hidden = false;
    }
    let height = target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = duration + 'ms';
    target.style.height = height + 'px';
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');
    window.setTimeout(() => {
      target.style.removeProperty('height');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
      target.classList.remove('slide');
    }, duration);
  }
};

let _slideToggle = (target, duration = 500) => {
  if (target.hidden) {
    return _slideDown(target, duration);
  } else {
    return _slideUp(target, duration);
  }
};
;

VanillaTilt.init(document.querySelectorAll(".vanilla"), {
	max: 10,
	speed: 400,
	glare:true,
	'max-glare':0.4
});
