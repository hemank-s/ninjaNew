(function(W, platformSdk, events) {
    'use strict';

    var utils = require('../util/utils'),
        Constants = require('../../constants.js'),

        HomescreenController = function(options) {
            //this.template = require('raw!../../templates/userState.html');
        };

    HomescreenController.prototype.bind = function(App, data) {



    };

    HomescreenController.prototype.render = function(ctr, App, data) {

        var that = this;
        that.el = document.createElement('div');
        that.el.className = 'ftueController animation_fadein noselect';
        that.el.innerHTML = Mustache.render(unescape(that.template), { stateData: data });
        ctr.appendChild(that.el);
        events.publish('update.loader', { show: false });
        that.bind(App, data);
    };

    HomescreenController.prototype.destroy = function() {

    };

    module.exports = HomescreenController;

})(window, platformSdk, platformSdk.events);