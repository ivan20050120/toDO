/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/components/list.js":
/*!***********************************!*\
  !*** ./src/js/components/list.js ***!
  \***********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
const list = () => {
  const input = document.querySelector('.header__input'),
        btn = document.querySelector('.header__btn'),
        items = Array.from(document.querySelectorAll('.main__item')),
        wrapper = document.querySelector('.main__body');
  let storage = [...items];
  let i = 0;

  function createList(data) {
    if (!input.value == '') {
      let item = document.createElement('div');
      item.classList.add('main__item');
      item.dataset.id = i++;
      item.innerHTML = `
                <div class="main__check">
                    <input type="checkbox">
                </div>
                <div class="main__text">${data}</div>
                <div class="main__close _icon-cross"></div>
            `;
      wrapper.appendChild(item);
      input.value = '';
      storage.push(item); //add item

      reCount(); //recount number
    }
  }

  btn.addEventListener('click', function (e) {
    createList(input.value);
  });
  input.addEventListener('keydown', function (e) {
    //Click enter
    if (e.code == 'Enter') {
      createList(input.value);
    }
  }); /////////////Work with items

  const wrap = document.querySelector('.main__body'); //wrapper

  wrap.addEventListener('click', function (e) {
    const target = e.target;

    if (target.closest('.main__item') && !target.closest('.main__close')) {
      //active
      target.closest('.main__item').classList.toggle('_active');
      reCount();
    }

    if (target.closest('.main__close')) {
      //remove
      target.closest('.main__item').remove();
      storage.pop(target.closest('.main__item').dataset.id);
      reCount();
    }
  }); ///////////////////////////////////////////////////////////// Works with filter

  const filter = document.querySelector('.filter-main'); //Wrapper for all tabs

  const tabBtns = document.querySelectorAll('.filter-main__item');

  function removeDis() {
    storage.forEach(item => {
      item.classList.remove('_disable');
    });
    tabBtns.forEach(tab => {
      tab.classList.remove('_active');
    });
  }

  function showActive() {
    storage.forEach(item => {
      if (item.classList.contains('_active')) {
        //active - completed
        item.classList.add('_disable');
      }
    });
  }

  function showCompeted() {
    storage.forEach(item => {
      if (!item.classList.contains('_active')) {
        //active - NOT   completed
        item.classList.add('_disable');
      }
    });
  }

  filter.addEventListener('click', function (e) {
    const target = e.target;

    if (target.closest('.filter-main__item')) {
      removeDis();
      target.classList.add('_active');
    }

    if (target.closest('.filter-main__all')) {
      removeDis();
      target.classList.add('_active');
    }

    if (target.closest('.filter-main__active')) {
      showActive();
    }

    if (target.closest('.filter-main__completed')) {
      showCompeted();
    }
  }); /////////////////////////////////////// Work with  bottom btn (cancel, left)

  const clear = document.querySelector('.main__clear'),
        counter = document.querySelector('.main__counter span');
  clear.addEventListener('click', function (e) {
    storage.forEach(item => {
      if (item.classList.contains('_active')) {
        item.remove();
      }
    });
    reCount();
  });

  function reCount() {
    let active = storage.filter(item => !item.classList.contains('_active'));
    counter.textContent = active.length;
  }

  reCount();
};

/* harmony default export */ __webpack_exports__["default"] = (list);

/***/ }),

/***/ "./src/js/libs/dynamicAdaptive.js":
/*!****************************************!*\
  !*** ./src/js/libs/dynamicAdaptive.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
const dynamicAdaptive = () => {
  // Dynamic Adapt v.1
  // HTML data-da="where(uniq class name),when(breakpoint),position(digi)"
  // e.x. data-da=".item,992,2"
  // Andrikanych Yevhen 2020
  // https://www.youtube.com/c/freelancerlifestyle
  "use strict";

  function DynamicAdapt(type) {
    this.type = type;
  }

  DynamicAdapt.prototype.init = function () {
    const _this = this; // массив объектов


    this.оbjects = [];
    this.daClassname = "_dynamic_adapt_"; // массив DOM-элементов

    this.nodes = document.querySelectorAll("[data-da]"); // наполнение оbjects объктами

    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      const data = node.dataset.da.trim();
      const dataArray = data.split(",");
      const оbject = {};
      оbject.element = node;
      оbject.parent = node.parentNode;
      оbject.destination = document.querySelector(dataArray[0].trim());
      оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
      оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
      оbject.index = this.indexInParent(оbject.parent, оbject.element);
      this.оbjects.push(оbject);
    }

    this.arraySort(this.оbjects); // массив уникальных медиа-запросов

    this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
      return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
    }, this);
    this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
      return Array.prototype.indexOf.call(self, item) === index;
    }); // навешивание слушателя на медиа-запрос
    // и вызов обработчика при первом запуске

    for (let i = 0; i < this.mediaQueries.length; i++) {
      const media = this.mediaQueries[i];
      const mediaSplit = String.prototype.split.call(media, ',');
      const matchMedia = window.matchMedia(mediaSplit[0]);
      const mediaBreakpoint = mediaSplit[1]; // массив объектов с подходящим брейкпоинтом

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
  }; // Функция перемещения


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
  }; // Функция возврата


  DynamicAdapt.prototype.moveBack = function (parent, element, index) {
    element.classList.remove(this.daClassname);

    if (parent.children[index] !== undefined) {
      parent.children[index].insertAdjacentElement('beforebegin', element);
    } else {
      parent.insertAdjacentElement('beforeend', element);
    }
  }; // Функция получения индекса внутри родителя


  DynamicAdapt.prototype.indexInParent = function (parent, element) {
    const array = Array.prototype.slice.call(parent.children);
    return Array.prototype.indexOf.call(array, element);
  }; // Функция сортировки массива по breakpoint и place 
  // по возрастанию для this.type = min
  // по убыванию для this.type = max


  DynamicAdapt.prototype.arraySort = function (arr) {
    if (this.type === "min") {
      Array.prototype.sort.call(arr, function (a, b) {
        if (a.breakpoint === b.breakpoint) {
          if (a.place === b.place) {
            return 0;
          }

          if (a.place === "first" || b.place === "last") {
            return -1;
          }

          if (a.place === "last" || b.place === "first") {
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

          if (a.place === "first" || b.place === "last") {
            return 1;
          }

          if (a.place === "last" || b.place === "first") {
            return -1;
          }

          return b.place - a.place;
        }

        return b.breakpoint - a.breakpoint;
      });
      return;
    }
  };

  const da = new DynamicAdapt("max");
  da.init();
};

/* harmony default export */ __webpack_exports__["default"] = (dynamicAdaptive);

/***/ }),

/***/ "./src/js/libs/slider.js":
/*!*******************************!*\
  !*** ./src/js/libs/slider.js ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
const slider = () => {
  //BildSlider
  let sliders = document.querySelectorAll('._swiper');

  if (sliders) {
    for (let index = 0; index < sliders.length; index++) {
      let slider = sliders[index];

      if (!slider.classList.contains('swiper-bild')) {
        let slider_items = slider.children;

        if (slider_items) {
          for (let index = 0; index < slider_items.length; index++) {
            let el = slider_items[index];
            el.classList.add('swiper-slide');
          }
        }

        let slider_content = slider.innerHTML;
        let slider_wrapper = document.createElement('div');
        slider_wrapper.classList.add('swiper-wrapper');
        slider_wrapper.innerHTML = slider_content;
        slider.innerHTML = '';
        slider.appendChild(slider_wrapper);
        slider.classList.add('swiper-bild');

        if (slider.classList.contains('_swiper_scroll')) {
          let sliderScroll = document.createElement('div');
          sliderScroll.classList.add('swiper-scrollbar');
          slider.appendChild(sliderScroll);
        }
      }

      if (slider.classList.contains('_gallery')) {//slider.data('lightGallery').destroy(true);
      }
    }

    sliders_bild_callback();
  }

  function sliders_bild_callback(params) {}

  let sliderScrollItems = document.querySelectorAll('._swiper_scroll');

  if (sliderScrollItems.length > 0) {
    for (let index = 0; index < sliderScrollItems.length; index++) {
      const sliderScrollItem = sliderScrollItems[index];
      const sliderScrollBar = sliderScrollItem.querySelector('.swiper-scrollbar');
      const sliderScroll = new Swiper(sliderScrollItem, {
        observer: true,
        observeParents: true,
        direction: 'vertical',
        slidesPerView: 'auto',
        freeMode: true,
        scrollbar: {
          el: sliderScrollBar,
          draggable: true,
          snapOnRelease: false
        },
        mousewheel: {
          releaseOnEdges: true
        }
      });
      sliderScroll.scrollbar.updateSize();
    }
  }

  function sliders_bild_callback(params) {} // let slider_about = new Swiper('.about__slider', {
  //     /*
  //     effect: 'fade',
  //     autoplay: {
  //         delay: 3000,
  //         disableOnInteraction: false,
  //     },
  //     */
  //     observer: true,
  //     observeParents: true,
  //     slidesPerView: 1,
  //     spaceBetween: 0,
  //     autoHeight: true,
  //     speed: 800,
  //     //touchRatio: 0,
  //     //simulateTouch: false,
  //     //loop: true,
  //     //preloadImages: false,
  //     //lazy: true,
  //     // Dotts
  //     //pagination: {
  //     //	el: '.slider-quality__pagging',
  //     //	clickable: true,
  //     //},
  //     // Arrows
  //     navigation: {
  //         nextEl: '.about__more .more__item_next',
  //         prevEl: '.about__more .more__item_prev',
  //     },
  //     /*
  //     breakpoints: {
  //         320: {
  //             slidesPerView: 1,
  //             spaceBetween: 0,
  //             autoHeight: true,
  //         },
  //         768: {
  //             slidesPerView: 2,
  //             spaceBetween: 20,
  //         },
  //         992: {
  //             slidesPerView: 3,
  //             spaceBetween: 20,
  //         },
  //         1268: {
  //             slidesPerView: 4,
  //             spaceBetween: 30,
  //         },
  //     },
  //     */
  //     on: {
  //         lazyImageReady: function () {
  //             ibg();
  //         },
  //     }
  //     // And if we need scrollbar
  //     //scrollbar: {
  //     //	el: '.swiper-scrollbar',
  //     //},
  // });


  if (document.querySelector('.programs__body')) {
    new Swiper('.programs__body', {
      observer: true,
      observeParents: true,
      slidesPerView: 3,
      spaceBetween: 30,
      speed: 800,
      loop: true,
      watchOverflow: true,
      // Arrows
      navigation: {
        nextEl: '.programs .programs__arrow_next',
        prevEl: '.programs .programs__arrow_prev'
      },
      breakpoints: {
        //when window width is >= 320px //More
        260: {
          slidesPerView: 1,
          spaceBetween: 10
        },
        320: {
          slidesPerView: 1.1,
          spaceBetween: 15
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 20
        },
        992: {
          slidesPerView: 3,
          spaceBetween: 30
        }
      }
    });
  }
};

/* harmony default export */ __webpack_exports__["default"] = (slider);

/***/ }),

/***/ "./src/js/libs/spoller.js":
/*!********************************!*\
  !*** ./src/js/libs/spoller.js ***!
  \********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
const spoller = () => {
  //=================

  /*
  Для родителя слойлеров пишем атрибут data-spollers
  Для заголовков слойлеров пишем атрибут data-spoller
  Если нужно включать\выключать работу спойлеров на разных размерах экранов
  пишем параметры ширины и типа брейкпоинта.
  Например: 
  data-spollers="992,max" - спойлеры будут работать только на экранах меньше или равно 992px
  data-spollers="768,min" - спойлеры будут работать только на экранах больше или равно 768px
  
  Если нужно что бы в блоке открывался болько один слойлер добавляем атрибут data-one-spoller
  */
  // SPOLLERS
  const spollersArray = document.querySelectorAll('[data-spollers]');

  if (spollersArray.length > 0) {
    // Получение обычных слойлеров
    const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
      return !item.dataset.spollers.split(",")[0];
    }); // Инициализация обычных слойлеров

    if (spollersRegular.length > 0) {
      initSpollers(spollersRegular);
    } // Получение слойлеров с медиа запросами


    const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
      return item.dataset.spollers.split(",")[0];
    }); // Инициализация слойлеров с медиа запросами

    if (spollersMedia.length > 0) {
      const breakpointsArray = [];
      spollersMedia.forEach(item => {
        const params = item.dataset.spollers;
        const breakpoint = {};
        const paramsArray = params.split(",");
        breakpoint.value = paramsArray[0];
        breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
        breakpoint.item = item;
        breakpointsArray.push(breakpoint);
      }); // Получаем уникальные брейкпоинты

      let mediaQueries = breakpointsArray.map(function (item) {
        return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
      });
      mediaQueries = mediaQueries.filter(function (item, index, self) {
        return self.indexOf(item) === index;
      }); // Работаем с каждым брейкпоинтом

      mediaQueries.forEach(breakpoint => {
        const paramsArray = breakpoint.split(",");
        const mediaBreakpoint = paramsArray[1];
        const mediaType = paramsArray[2];
        const matchMedia = window.matchMedia(paramsArray[0]); // Объекты с нужными условиями

        const spollersArray = breakpointsArray.filter(function (item) {
          if (item.value === mediaBreakpoint && item.type === mediaType) {
            return true;
          }
        }); // Событие

        matchMedia.addListener(function () {
          initSpollers(spollersArray, matchMedia);
        });
        initSpollers(spollersArray, matchMedia);
      });
    } // Инициализация


    function initSpollers(spollersArray) {
      let matchMedia = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      spollersArray.forEach(spollersBlock => {
        spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;

        if (matchMedia.matches || !matchMedia) {
          spollersBlock.classList.add('_init');
          initSpollerBody(spollersBlock);
          spollersBlock.addEventListener("click", setSpollerAction);
        } else {
          spollersBlock.classList.remove('_init');
          initSpollerBody(spollersBlock, false);
          spollersBlock.removeEventListener("click", setSpollerAction);
        }
      });
    } // Работа с контентом


    function initSpollerBody(spollersBlock) {
      let hideSpollerBody = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');

      if (spollerTitles.length > 0) {
        spollerTitles.forEach(spollerTitle => {
          if (hideSpollerBody) {
            spollerTitle.removeAttribute('tabindex');

            if (!spollerTitle.classList.contains('_active')) {
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

      if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
        const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
        const spollersBlock = spollerTitle.closest('[data-spollers]');
        const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;

        if (!spollersBlock.querySelectorAll('._slide').length) {
          if (oneSpoller && !spollerTitle.classList.contains('_active')) {
            hideSpollersBody(spollersBlock);
          }

          spollerTitle.classList.toggle('_active');

          _slideToggle(spollerTitle.nextElementSibling, 500);
        }

        e.preventDefault();
      }
    }

    function hideSpollersBody(spollersBlock) {
      const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');

      if (spollerActiveTitle) {
        spollerActiveTitle.classList.remove('_active');

        _slideUp(spollerActiveTitle.nextElementSibling, 500);
      }
    }
  } //=================
  //SlideToggle


  let _slideUp = function (target) {
    let duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;

    if (!target.classList.contains('_slide')) {
      target.classList.add('_slide');
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
        target.classList.remove('_slide');
      }, duration);
    }
  };

  let _slideDown = function (target) {
    let duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;

    if (!target.classList.contains('_slide')) {
      target.classList.add('_slide');

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
      target.style.transitionProperty = "height, margin, padding";
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
        target.classList.remove('_slide');
      }, duration);
    }
  };

  let _slideToggle = function (target) {
    let duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;

    if (target.hidden) {
      return _slideDown(target, duration);
    } else {
      return _slideUp(target, duration);
    }
  };
};

/* harmony default export */ __webpack_exports__["default"] = (spoller);

/***/ }),

/***/ "./src/js/modules/burger.js":
/*!**********************************!*\
  !*** ./src/js/modules/burger.js ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
const burger = () => {// const btn = document.querySelector('.icon-menu'),
  // links = document.querySelectorAll('[data-goto]'),
  // menu = document.querySelector('.menu__body');
  // if(links.length > 0){
  //         links.forEach(item => {
  //             item.addEventListener('click',function(e){
  //                 btn.classList.remove('_active');
  //                 menu.classList.remove('_active');
  //                 document.body.classList.remove('_lock')
  //             })
  //         });
  // }
  // btn.addEventListener('click',function(e){
  //     btn.classList.toggle('_active');
  //     menu.classList.toggle('_active');
  //     document.body.classList.toggle('_lock');
  // })
};

/* harmony default export */ __webpack_exports__["default"] = (burger);

/***/ }),

/***/ "./src/js/modules/themeSwitcher.js":
/*!*****************************************!*\
  !*** ./src/js/modules/themeSwitcher.js ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
const themeSwitcher = () => {
  const switcher = document.querySelector('.header__logo');
  const body = document.querySelector('body');
  switcher.addEventListener('click', function (e) {
    body.classList.toggle('theme-light');
  });
};

/* harmony default export */ __webpack_exports__["default"] = (themeSwitcher);

/***/ }),

/***/ "./src/js/services/default.js":
/*!************************************!*\
  !*** ./src/js/services/default.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
const def = () => {
  var ua = window.navigator.userAgent;
  var isMobile = {
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
    }
  };

  function isIE() {
    ua = navigator.userAgent;
    var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
    return is_ie;
  }

  if (isIE()) {
    document.querySelector('html').classList.add('ie');
  }

  if (isMobile.any()) {
    document.querySelector('html').classList.add('_touch');
  }

  function testWebP(callback) {
    var webP = new Image();

    webP.onload = webP.onerror = function () {
      callback(webP.height == 2);
    };

    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
  }

  testWebP(function (support) {
    if (support == true) {
      document.querySelector('body').classList.add('webp');
    } else {
      document.querySelector('body').classList.add('no-webp');
    }
  });
};

/* harmony default export */ __webpack_exports__["default"] = (def);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!************************!*\
  !*** ./src/js/main.js ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _libs_spoller__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./libs/spoller */ "./src/js/libs/spoller.js");
/* harmony import */ var _libs_slider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./libs/slider */ "./src/js/libs/slider.js");
/* harmony import */ var _libs_dynamicAdaptive__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./libs/dynamicAdaptive */ "./src/js/libs/dynamicAdaptive.js");
/* harmony import */ var _services_default__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./services/default */ "./src/js/services/default.js");
/* harmony import */ var _components_list__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/list */ "./src/js/components/list.js");
/* harmony import */ var _modules_burger__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modules/burger */ "./src/js/modules/burger.js");
/* harmony import */ var _modules_themeSwitcher__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modules/themeSwitcher */ "./src/js/modules/themeSwitcher.js");






 // import getResource from './services/request'

window.onload = function () {
  (0,_components_list__WEBPACK_IMPORTED_MODULE_4__["default"])();
  (0,_services_default__WEBPACK_IMPORTED_MODULE_3__["default"])();
  (0,_modules_burger__WEBPACK_IMPORTED_MODULE_5__["default"])(); // spoller();
  // slider();

  (0,_libs_dynamicAdaptive__WEBPACK_IMPORTED_MODULE_2__["default"])();
  (0,_modules_themeSwitcher__WEBPACK_IMPORTED_MODULE_6__["default"])();
};
}();
/******/ })()
;
//# sourceMappingURL=script.js.map