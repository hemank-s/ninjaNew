(function(W, platformSdk, events) {
    'use strict';

    var utils = require('../util/utils'),
        Constants = require('../../constants.js'),
        cacheProvider = require('../util/cacheProvider'),

        CustomStickerCreateController = function(options) {
            this.ftueTemplate = require('raw!../../templates/customStickerFtue.html');
            this.createTemplate = require('raw!../../templates/customStickerCreate.html');
        };

    CustomStickerCreateController.prototype.bind = function(App, data) {

        var that = this;

        var DOMCache = {
            createSticker: document.getElementsByClassName('createSticker'),
            createContainer: document.getElementsByClassName('customCreateContainer'),
            customImage: document.getElementsByClassName('customImage'),
            customText: document.getElementsByClassName('customText'),
            customCta: document.getElementsByClassName('customCta'),
            learnMore: document.getElementsByClassName('learnMore'),
            overlayCta: document.getElementsByClassName('overlayCta'),
            customOverlay: document.getElementsByClassName('customOverlay'),
            userInput: document.getElementsByClassName('userInput'),
            allowedInput: document.getElementsByClassName('allowedInput'),
            screenH: window.innerHeight
        };

        var customFtue = cacheProvider.getFromCritical('customStickerFtue');
        customFtue = true;
        if (customFtue)
            that.bindCreateHandlers(App, data, DOMCache);
        else {
            DOMCache.createSticker[0].addEventListener('click', function() {
                cacheProvider.setInCritical('customStickerFtue', true);
                DOMCache.createContainer[0].innerHTML = Mustache.render(unescape(that.createTemplate), { textLength: Constants.CUSTOM_STICKER_TITLE_LENGTH });
                that.bindCreateHandlers(App, data, DOMCache);
            });
        }
    };


    CustomStickerCreateController.prototype.bindCreateHandlers = function(App, data, DOMCache) {

        var that = this;

        DOMCache.customImage[0].addEventListener('click', function() {
            utils.openGallery(DOMCache.customImage[0], Constants.IMAGE_SIZE_UGC, function() {
                if (platformSdk.bridgeEnabled)
                    DOMCache.customImage[0].setAttribute('filePath', fileUrl.filePath);
                else {
                    DOMCache.customImage[0].setAttribute('filePath', 'blah');
                }
            });
        });

        DOMCache.customText[0].addEventListener('keyup', function() {
            DOMCache.userInput[0].innerHTML = this.value.length;

            if (this.value.length > Constants.CUSTOM_STICKER_TITLE_LENGTH)
                DOMCache.userInput[0].classList.add('inputExceeded')
            else
                DOMCache.userInput[0].classList.remove('inputExceeded');


        });

        DOMCache.customCta[0].addEventListener('click', function() {

            var toastType = 1; // From bottom to up

            if (DOMCache.screenH > window.innerHeight)
                toastType = 0; // andriod toast

            if (!DOMCache.customImage[0].getAttribute('filePath') && DOMCache.customText[0].value.length == 0)
                that.showToast('Please upload image and type title', toastType)
            else if (DOMCache.customImage[0].getAttribute('filePath') && DOMCache.customText[0].value.length == 0)
                that.showToast('Please type title', toastType);
            else if (!DOMCache.customImage[0].getAttribute('filePath') && DOMCache.customText[0].value.length != 0)
                that.showToast('Please upload image', toastType);
            else {

                if (DOMCache.customText[0].value.length > Constants.CUSTOM_STICKER_TITLE_LENGTH)
                    that.showToast('Input characters exceeeded', toastType);
                else
                    App.router.navigateTo('/customStatus', { src: 'create', 'status': Constants.CUSTOM_STICKER_STATUS.PROGRESS });
            }
        });


        DOMCache.learnMore[0].addEventListener('click', function() {
            DOMCache.customOverlay[0].classList.remove('hideClass');
        });

        DOMCache.overlayCta[0].addEventListener('click', function() {
            DOMCache.customOverlay[0].classList.add('hideClass');
        });

    };

    CustomStickerCreateController.prototype.showToast = function(text, type) {
        console.log(text);
    };


    CustomStickerCreateController.prototype.render = function(ctr, App, data) {

        var that = this;
        that.el = document.createElement('div');
        that.el.className = 'customCreateContainer animation_fadein noselect';
        var customFtue = cacheProvider.getFromCritical('customStickerFtue');
        var template;
        customFtue = true;

        if (customFtue)
            template = that.createTemplate;
        else
            template = that.ftueTemplate;


        if (data && data.status == Constants.CUSTOM_STICKER_STATUS.FAILED)
            that.el.innerHTML = Mustache.render(unescape(template), { textLength: Constants.CUSTOM_STICKER_TITLE_LENGTH, isFailedState: true, data: data });
        else
            that.el.innerHTML = Mustache.render(unescape(template), { textLength: Constants.CUSTOM_STICKER_TITLE_LENGTH, isFailedState: false });
        ctr.appendChild(that.el);
        events.publish('update.loader', { show: false });
        that.bind(App, data);
    };

    CustomStickerCreateController.prototype.destroy = function() {

    };

    module.exports = CustomStickerCreateController;

})(window, platformSdk, platformSdk.events);