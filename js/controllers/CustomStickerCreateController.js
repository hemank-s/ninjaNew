(function(W, platformSdk, events) {
    'use strict';

    var utils = require('../util/utils'),
        Constants = require('../../constants.js'),
        cacheProvider = require('../util/cacheProvider'),
        profileModel = require('../models/profileModel'),
        activityModel = require('../models/activityModel'),

        CustomStickerCreateController = function(options) {
            this.ftueTemplate = require('raw!../../templates/customerStickerFtue.html');
            this.createTemplate = require('raw!../../templates/customerStickerCreate.html');
           
        };

    CustomStickerCreateController.prototype.bind = function(App, data) {


        var that = this;

        var DOMCahe ={

            createSticker:document.getElementsByClassName('createSticker'),
            createContainer:document.getElementsByClassName('customCreateContainer');
        }

        DOMCahe.createSticker.addEventListener('click',function(){
            cacheProvider.setInCritical('customStickerFtue',true);
            DOMCahe.createContainer.innerHTML = Mustache.render(unescape(that.createTemplate));
        });

    };
    

    CustomStickerCreateController.prototype.render = function(ctr, App, data) {

        var that = this;
        that.el = document.createElement('div');
        that.el.className = 'customCreateContainer animation_fadein noselect';
        var customFtue = cacheProvider.getFromCritical('customStickerFtue');
        var template;
        if(customFtue)
            template = that.createTemplate;
        else
            template = that.ftueTemplate;    

        that.el.innerHTML = Mustache.render(unescape(that.template));
        ctr.appendChild(that.el);
        events.publish('update.loader', { show: false });
        that.bind(App, data);
    };

    CustomStickerCreateController.prototype.destroy = function() {

    };

    module.exports = CustomStickerCreateController;

})(window, platformSdk, platformSdk.events);