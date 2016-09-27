(function(W, platformSdk, events) {
    'use strict';

    var utils = require('../util/utils'),
        Constants = require('../../constants.js'),

        StateController = function(options) {
            this.template = require('raw!../../templates/userState.html');
        };

    StateController.prototype.bind = function(App, data) {

        var cta = document.getElementsByClassName('stateCta')[0];

        cta.addEventListener('click', function(event) {
            platformSdk.bridge.openFullPage(cta.getAttribute('data-title'), cta.getAttribute('data-link'));
        });


    };

    StateController.prototype.render = function(ctr, App, data) {

        var that = this;
        that.el = document.createElement('div');
        that.el.className = 'ftueController animation_fadein noselect';
        that.el.innerHTML = Mustache.render(unescape(that.template), { stateData: data });
        ctr.appendChild(that.el);
        events.publish('update.loader', { show: false });
        that.bind(App, data);
    };

    StateController.prototype.destroy = function() {

    };

    module.exports = StateController;

})(window, platformSdk, platformSdk.events);