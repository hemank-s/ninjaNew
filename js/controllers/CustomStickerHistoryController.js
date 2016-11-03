(function(W, platformSdk, events) {
    'use strict';

    var utils = require('../util/utils'),
        Constants = require('../../constants.js'),
        cacheProvider = require('../util/cacheProvider'),
        profileModel = require('../models/profileModel'),
        activityModel = require('../models/activityModel'),

        CustomStickerHistoryController = function(options) {
            this.template = require('raw!../../templates/customStickerHistory.html');

        };

    CustomStickerHistoryController.prototype.bind = function(App, data) {

        var that = this;

        var DOMCache = {
            createSticker: document.getElementsByClassName('createCustomSticker_history'),
            stickerHistoryRow: document.getElementsByClassName('stickerHistoryRow')
        };

        if (DOMCache.createSticker.length > 0)
            DOMCache.createSticker[0].addEventListener('click', function() {
                App.router.navigateTo('/customCreate', { rewardId: data.rewardId });
            });

        for (var i = 0; i < DOMCache.stickerHistoryRow.length; i++)
            DOMCache.stickerHistoryRow[i].addEventListener('click', that.bindHandlerStickerRow(App, data));

        var logDataToSend = {
            'c': 'cust_sticker_history',
            'o': data.rewardDetails.custom_stickers
        };
        App.NinjaService.logData(logDataToSend);


    };


    CustomStickerHistoryController.prototype.bindHandlerStickerRow = function(App, data) {
        return function() {

            var dataToSend = {
                status: this.getAttribute('data-status'),
                url: this.getAttribute('data-url'),
                reason: this.getAttribute('data-reason'),
                phrase: this.getAttribute('data-phrase'),
                sid: this.getAttribute('data-sid'),
                phraseLength: this.getAttribute('data-phrase').length,
                rewardId: data.rewardId
            };

            var logDataToSend = {
                'c': 'cust_sticker_click',
                'o': dataToSend.status
            };
            App.NinjaService.logData(logDataToSend);

            if (dataToSend.status === Constants.CUSTOM_STICKER_STATUS.FAILED)
                App.router.navigateTo('/customCreate', dataToSend);
            else {
                dataToSend.src = "history";
                App.router.navigateTo('/customStatus', dataToSend);
            }

        };
    };

    CustomStickerHistoryController.prototype.render = function(ctr, App, data) {

        var that = this;
        that.el = document.createElement('div');
        that.el.className = 'customHistoryContainer animation_fadein noselect';

        that.el.innerHTML = Mustache.render(unescape(that.template), data);
        ctr.appendChild(that.el);
        events.publish('update.loader', { show: false });
        that.bind(App, data);
    };

    CustomStickerHistoryController.prototype.destroy = function() {

    };

    module.exports = CustomStickerHistoryController;

})(window, platformSdk, platformSdk.events);
