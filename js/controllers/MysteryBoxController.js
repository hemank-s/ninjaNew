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
        var DOMcache = {
            crossIcon: document.getElementsByClassName('mysteryBox_CrossIcon')[0],
        };

        DOMcache.crossIcon.addEventListener('click', function(event) {
            console.log("cross clicked");
            App.router.navigateTo('/home', {});
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
