(function(W, platformSdk, events) {
    'use strict';

    var utils = require('../util/utils'),
        Constants = require('../../constants.js'),
        cacheProvider = require('../util/cacheProvider'),
        mysteryBoxModel = require('../models/mysteryBoxModel'),

        MysteryBoxController = function(options) {
            this.template = require('raw!../../templates/mysteryBox.html');

        };

    MysteryBoxController.prototype.bind = function(App, data) {

        var that = this;

        var DOMcache = {

        };


        mysteryBoxModel.getMysteryBoxDetails(App);


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