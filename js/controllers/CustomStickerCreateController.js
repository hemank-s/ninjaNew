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
            utils.openGallery(DOMCache.customImage[0], Constants.IMAGE_SIZE_UGC, function(filePath) {
                if (platformSdk.bridgeEnabled)
                    DOMCache.customImage[0].setAttribute('filePath', filePath);
                else {
                    DOMCache.customImage[0].setAttribute('filePath', 'blah');
                }
            });
        });

        DOMCache.customText[0].addEventListener('keyup', function() {
            DOMCache.userInput[0].innerHTML = this.value.length;

            if (this.value.length > Constants.CUSTOM_STICKER_TITLE_LENGTH)
                DOMCache.userInput[0].classList.add('inputExceeded');
            else
                DOMCache.userInput[0].classList.remove('inputExceeded');
        });



        DOMCache.customCta[0].addEventListener('click', function() {

            var toastType = 1; // From bottom to up

            if (DOMCache.screenH > window.innerHeight)
                toastType = 0; // andriod toast

            if (DOMCache.customImage[0].getAttribute('filePath') && DOMCache.customText[0].value.length > 0 && DOMCache.customText[0].value.length < Constants.CUSTOM_STICKER_TITLE_LENGTH) {
                that.postCustomSticker(App, data, DOMCache, 2, toastType);
            } else if (DOMCache.customImage[0].getAttribute('uploadUrl') && DOMCache.customText[0].value.length > 0 && DOMCache.customText[0].value.length < Constants.CUSTOM_STICKER_TITLE_LENGTH) {
                that.postCustomSticker(App, data, DOMCache, 1, toastType);
            } else {
                // Show Error Messages

                if (DOMCache.customText[0].value.length > Constants.CUSTOM_STICKER_TITLE_LENGTH) {
                    that.showToast('Input limit inputExceeded', toastType);
                } else if (DOMCache.customText[0].value.length === 0) {
                    that.showToast('Please type Title', toastType);
                } else {
                    that.showToast('Please upload image', toastType);
                }
            }

        });


        DOMCache.learnMore[0].addEventListener('click', function() {
            DOMCache.customOverlay[0].classList.remove('hideClass');
        });

        DOMCache.overlayCta[0].addEventListener('click', function() {
            DOMCache.customOverlay[0].classList.add('hideClass');
        });

    };

    CustomStickerCreateController.prototype.postCustomSticker = function(App, data, DOMCache, flowType, toastType) {

        var that = this;

        if (platformSdk.bridgeEnabled) {
            var serverPath;

            if (data.status == Constants.CUSTOM_STICKER_STATUS.FAILED)
                serverPath = appConfig.API_URL + '/rewards/' + data.rewardId + '?sid=' + data.sid + '&t=' + DOMCache.customText[0].value;
            else
                serverPath = appConfig.API_URL + '/rewards/' + data.rewardId + '?t=' + DOMCache.customText[0].value;

            events.publish('update.loader', { show: true });

            if (flowType == 1) {

                //Without Image
                App.NinjaService.postUgcContent(serverPath, function(res) {

                    if (res.stat == "ok") {
                        App.router.navigateTo('/customStatus', { src: 'create', 'status': Constants.CUSTOM_STICKER_STATUS.PROGRESS });
                    } else if (res.stat == 'fail') {
                        that.showToast(res.data.reason, toastType);

                    } else {
                        that.showToast('Sorry. Your image couldn’t be updated. Could you try again with another files, please?', toastType);
                    }

                }, App);



            } else {
                var customStickerData = {
                    uploadUrl: serverPath,
                    doCompress: true,
                    filePath: DOMCache.customImage[0].getAttribute('filePath')
                };

                try {
                    platformSdk.nativeReq({
                        ctx: self,
                        fn: 'uploadFile',
                        data: platformSdk.utils.validateStringifyJson(customStickerData),
                        success: function(res) {
                            try {
                                res = JSON.parse(decodeURIComponent(res));
                                console.log(res);
                                events.publish('update.loader', { show: false });

                                if (res.stat == 'ok') {
                                    App.router.navigateTo('/customStatus', { src: 'create', 'status': Constants.CUSTOM_STICKER_STATUS.PROGRESS });

                                } else if (res.stat == 'fail') {
                                    that.showToast(res.data.reason, toastType);

                                } else {
                                    that.showToast('Sorry. Your image couldn’t be updated. Could you try again with another files, please?', toastType);
                                }
                            } catch (err) {
                                events.publish('update.loader', { show: false });
                                that.showToast('Sorry. Your image couldn’t be updated. Could you try again with another files, please?', toastType);
                            }
                        }
                    });

                } catch (err) {
                    events.publish('update.loader', { show: false });
                    that.showToast('Sorry. Your image couldn’t be updated. Could you try again with another files, please?', toastType);
                }
            }

        } else {

            console.log('Server Call');
            App.router.navigateTo('/customStatus', { src: 'create', 'status': Constants.CUSTOM_STICKER_STATUS.PROGRESS });
        }

    };


    CustomStickerCreateController.prototype.showToast = function(text, type) {

        if (type == 1)
            events.publish('update.notif.toast', { show: true, heading: 'Bamm', details: text, notifType: 'notifNeutral' });
        else
            utils.showToast('text');

        console.log(text);
    };


    CustomStickerCreateController.prototype.render = function(ctr, App, data) {

        var that = this;
        that.el = document.createElement('div');
        that.el.className = 'customCreateContainer animation_fadein noselect';
        var customFtue = cacheProvider.getFromCritical('customStickerFtue');
        var template;

        data.textLength = Constants.CUSTOM_STICKER_TITLE_LENGTH;
        data.isFailedState = false;

        if (customFtue)
            template = that.createTemplate;
        else
            template = that.ftueTemplate;


        if (data && data.status == Constants.CUSTOM_STICKER_STATUS.FAILED) {
            data.isFailedState = true;
            that.el.innerHTML = Mustache.render(unescape(template), data);
        } else
            that.el.innerHTML = Mustache.render(unescape(template), data);

        ctr.appendChild(that.el);
        events.publish('update.loader', { show: false });
        that.bind(App, data);
    };

    CustomStickerCreateController.prototype.destroy = function() {

    };

    module.exports = CustomStickerCreateController;

})(window, platformSdk, platformSdk.events);
