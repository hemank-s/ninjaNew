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
    };


    CustomStickerHistoryController.prototype.animHandlerFtue = function(DOMcache) {
    };

    

    CustomStickerHistoryController.prototype.render = function(ctr, App, data) {

        var that = this;
        that.el = document.createElement('div');
        //that.el.className = 'workspaceContainer animation_fadein noselect';

        //that.el.innerHTML = Mustache.render(unescape(that.template));
        //ctr.appendChild(that.el);
        events.publish('update.loader', { show: false });
        that.bind(App, data);
    };

    CustomStickerHistoryController.prototype.destroy = function() {

    };

    module.exports = CustomStickerHistoryController;

})(window, platformSdk, platformSdk.events);