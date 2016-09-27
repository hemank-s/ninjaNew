(function(W, platformSdk, events) {
    'use strict';

    var utils = require('../util/utils'),
        Constants = require('../../constants.js'),

        WorkspaceController = function(options) {
            this.template = require('raw!../../templates/workspace.html');
        };

    WorkspaceController.prototype.bind = function(App, data) {

        var cta = document.getElementsByClassName('subscribeCta')[0];
        var subscribeScreen = document.getElementsByClassName('subscribeScreen')[0];
        var ftueScreen = document.getElementsByClassName('ftueScreen')[0];

        cta.addEventListener('click', function() {
            subscribeScreen.classList.add('hide');
            ftueScreen.classList.remove('hide');

        });


    };

    WorkspaceController.prototype.render = function(ctr, App, data) {

        var that = this;
        that.el = document.createElement('div');
        that.el.className = 'workspaceContainer animation_fadein noselect';
        that.el.innerHTML = Mustache.render(unescape(that.template), { stateData: data });
        ctr.appendChild(that.el);
        events.publish('update.loader', { show: false });
        that.bind(App, data);
    };

    WorkspaceController.prototype.destroy = function() {

    };

    module.exports = WorkspaceController;

})(window, platformSdk, platformSdk.events);