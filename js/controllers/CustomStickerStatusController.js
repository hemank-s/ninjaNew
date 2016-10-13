(function(W, platformSdk, events) {
    'use strict';

    var utils = require('../util/utils'),
        Constants = require('../../constants.js'),
        cacheProvider = require('../util/cacheProvider'),
        profileModel = require('../models/profileModel'),
        activityModel = require('../models/activityModel'),

        CustomStickerStatusController = function(options) {
            this.template = require('raw!../../templates/customStickerStatus.html');

        };

    CustomStickerStatusController.prototype.bind = function(App, data) {

        var that = this;

        var DOMCahe = {
            customStatusCta: document.getElementsByClassName('customStatusCta'),
        };

        var elem = document.querySelectorAll("div[data-status='" + Constants.CUSTOM_STICKER_STATUS.DONE + "']");

        for (var i = 0; i < elem.length; i++) {
            var url = elem[i].getAttribute('data-url');
            elem[i].style.backgroundImage = "url('" + url + "')";
        }


        DOMCahe.customStatusCta[0].addEventListener('click', function() {
            if (this.getAttribute('data-src') === 'create')
                App.router.navigateTo('/home');
            else if (this.getAttribute('data-src') === 'history')

                if (this.getAttribute('data-status') === Constants.CUSTOM_STICKER_STATUS.PROGRESS)
                    App.router.back();
                else {
                    //Server Call & open hike chat bot
                    if (platformSdk.bridgeEnabled) {

                        var chatData = {
                            "screen": "chatthread",
                            "msisdn": "+hike+",
                            "isbot": true
                        };

                        try {
                            PlatformBridge.openActivity(JSON.stringify(chatData));
                        } catch (e) {
                            console.log("Open Activity Not Working");
                            utils.showToast('Something went wrong. Try again in sometime please :)');
                        }

                    } else {
                        console.log('Server Call')
                    }
                }

        });

    };


    CustomStickerStatusController.prototype.render = function(ctr, App, data) {

        var that = this;
        that.el = document.createElement('div');
        that.el.className = 'customStatusContainer animation_fadein noselect';

        if (data.status == Constants.CUSTOM_STICKER_STATUS.PROGRESS) {
            data.title = "CUSTOM Sticker IN PROGRESS";
            data.subtitle = "Your custom sticker is in progress. Please wait";
            data.ctaText = "COOL";

        } else if (data.status == Constants.CUSTOM_STICKER_STATUS.DONE) {

            data.title = "TADA";
            data.subtitle = "Your custom sticker is ready it will be sent to you by hike team ";
            data.ctaText = "SEND NOW";
        }

        that.el.innerHTML = Mustache.render(unescape(that.template), data);
        ctr.appendChild(that.el);
        events.publish('update.loader', { show: false });
        that.bind(App, data);
    };

    CustomStickerStatusController.prototype.destroy = function() {

    };

    module.exports = CustomStickerStatusController;

})(window, platformSdk, platformSdk.events);