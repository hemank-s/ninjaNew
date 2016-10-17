(function(W, platformSdk, events) {
    'use strict';

    var utils = require('../util/utils'),
        Constants = require('../../constants.js'),
        cacheProvider = require('../util/cacheProvider'),

        UserStateController = function(options) {
            this.template = require('raw!../../templates/userState.html');
        };

    UserStateController.prototype.bind = function(App, data) {

        var cta = document.getElementsByClassName('stateCta')[0];

        if (cta) {
            cta.addEventListener('click', function(event) {
                console.log("Opening URL");
                platformSdk.bridge.openFullPage(cta.getAttribute('data-title'), cta.getAttribute('data-link'));
            });
        }

    };

    UserStateController.prototype.render = function(ctr, App, data) {

        var that = this;
        if (platformSdk.bridgeEnabled) {
            utils.changeBarColors('#3C367C', '#494D95');
        }
        that.el = document.createElement('div');
        that.el.className = 'userStateContainer centerToScreenContainer animation_fadein noselect';
        that.el.innerHTML = Mustache.render(unescape(that.template), data);
        ctr.appendChild(that.el);
        events.publish('update.loader', { show: false });
        that.bind(App, data);
    };

    UserStateController.prototype.destroy = function() {

    };

    module.exports = UserStateController;

})(window, platformSdk, platformSdk.events);
