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

        var DOMCahe = {

            createSticker: document.getElementsByClassName('createSticker'),
            createContainer: document.getElementsByClassName('customCreateContainer'),
            customImage: document.getElementsByClassName('customImage'),
            customText: document.getElementsByClassName('customText'),
            customCta: document.getElementsByClassName('customCta'),
            learnMore: document.getElementsByClassName('learnMore'),
            overlayCta: document.getElementsByClassName('overlayCta'),
            customOverlay: document.getElementsByClassName('customOverlay'),


        }


        DOMCahe.createSticker[0].addEventListener('click', function() {
            cacheProvider.setInCritical('customStickerFtue', true);
            DOMCahe.createContainer[0].innerHTML = Mustache.render(unescape(that.createTemplate));
        });

        DOMCahe.customImage[0].addEventListener('click', function() {

            utils.openGallery(DOMcache.customImage[0], Constants.IMAGE_SIZE_UGC, function() {

                if (platformSdk.bridgeEnabled)
                    DOMcache.customImage[0].setAttribute('filePath', fileUrl.filePath);
            });


        });

        DOMCahe.customText[0].addEventListener('keyup', function() {
            cacheProvider.setInCritical('customStickerFtue', true);
            DOMCahe.createContainer[0].innerHTML = Mustache.render(unescape(that.createTemplate));
        });

        DOMCahe.customCta[0].addEventListener('click', function() {
            cacheProvider.setInCritical('customStickerFtue', true);
            DOMCahe.createContainer[0].innerHTML = Mustache.render(unescape(that.createTemplate));
        });

        DOMCahe.learnMore[0].addEventListener('click', function() {
            cacheProvider.setInCritical('customStickerFtue', true);
            DOMCahe.createContainer[0].innerHTML = Mustache.render(unescape(that.createTemplate));
        });
        DOMCahe.overlayCta[0].addEventListener('click', function() {
            cacheProvider.setInCritical('customStickerFtue', true);
            DOMCahe.createContainer[0].innerHTML = Mustache.render(unescape(that.createTemplate));
        });


    };


    CustomStickerCreateController.prototype.render = function(ctr, App, data) {

        var that = this;
        that.el = document.createElement('div');
        that.el.className = 'customCreateContainer animation_fadein noselect';
        var customFtue = cacheProvider.getFromCritical('customStickerFtue');
        var template;
        if (customFtue)
            template = that.createTemplate;
        else
            template = that.ftueTemplate;

        that.el.innerHTML = Mustache.render(unescape(template));
        ctr.appendChild(that.el);
        events.publish('update.loader', { show: false });
        that.bind(App, data);
    };

    CustomStickerCreateController.prototype.destroy = function() {

    };

    module.exports = CustomStickerCreateController;

})(window, platformSdk, platformSdk.events);