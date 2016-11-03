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
            if (this.getAttribute('data-src') === 'create') {
                events.publish('update.loader', { show: true, text: 'Refreshing Rewards!!' });
                utils.restartApp(App, true);
            } else if (this.getAttribute('data-src') === 'history')

                if (this.getAttribute('data-status') === Constants.CUSTOM_STICKER_STATUS.PROGRESS)
                    App.router.back();
                else {
                    //Server Call & open hike chat bot
                    var dataToSend = {};
                    dataToSend.rewardId = data.rewardId;
                    dataToSend.customStickerId = data.sid;

                    // Reward Details API :: Send Reward Id As well
                    App.NinjaService.sendCustomSticker(dataToSend, function(res) {

                        var logDataToSend = {
                            'c': 'cust_sticker_send_now',
                            'o': 'sent'
                        };
                        App.NinjaService.logData(logDataToSend);


                        if (res.stat == "ok") {
                            events.publish('update.notif.toast', { show: true, heading: 'Yaay', details: "We will send you your sticker shortly. Usually takes around an hour! Thanks.", notifType: 'notifNeutral' });

                        } else if (res.stat == 'fail') {
                            events.publish('update.notif.toast', { show: true, heading: 'Error!', details: res.data.reason, notifType: 'notifNeutral' });
                        } else {
                            events.publish('update.notif.toast', { show: true, heading: 'Error!', details: res.data.reason, notifType: 'notifNeutral' });
                        }
                    }, this);
                }
        });

    };


    CustomStickerStatusController.prototype.render = function(ctr, App, data) {

        var that = this;
        that.el = document.createElement('div');
        that.el.className = 'customStatusContainer animation_fadein noselect';

        if (data.status == Constants.CUSTOM_STICKER_STATUS.PROGRESS) {
            data.title = "Creating Your Sticker";
            data.subtitle = "Our artists are working overtime to get your sticker ready on time.";
            data.ctaText = "Cool";

        } else if (data.status == Constants.CUSTOM_STICKER_STATUS.DONE) {

            data.title = "Your Sticker is ready!";
            data.subtitle = "Your sticker is ready. Tap here to recieve it now.";
            data.ctaText = "SEND NOW";
            data.isSend = true;
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
