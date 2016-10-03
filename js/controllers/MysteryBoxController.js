(function(W, platformSdk, events) {
    'use strict';

    var utils = require('../util/utils'),
        Constants = require('../../constants.js'),
        cacheProvider = require('../util/cacheProvider'),
        mysteryBoxModel = require('../models/mysteryBoxModel'),
        profileModel = require('../models/profileModel'),

        MysteryBoxController = function(options) {
            this.template = require('raw!../../templates/mysteryBoxActiveTemplate.html');

        };

    MysteryBoxController.prototype.bind = function(App, data) {

        var that = this;

        document.addEventListener('click', function(event) {

            if (event.target.classList.contains('mysteryBox_CrossIcon')) {
                console.log("cross clicked");
                App.router.navigateTo('/home', {});
            }
        });

        mysteryBoxModel.updateMysteryBoxTab(data, App);
    };


    MysteryBoxController.prototype.render = function(ctr, App, data) {

        var that = this;
        that.el = document.createElement('div');
        that.el.className = 'mysteryBoxContainer animation_fadein noselect';
        that.el.innerHTML = Mustache.render(unescape(that.template));
        ctr.appendChild(that.el);
        events.publish('update.loader', { show: false });
        that.bind(App, data);
    };

    MysteryBoxController.prototype.destroy = function() {

    };

    module.exports = MysteryBoxController;

})(window, platformSdk, platformSdk.events);