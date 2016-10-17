(function(W, platformSdk, events) {
    'use strict';

    var utils = require('../util/utils'),
        Constants = require('../../constants.js'),
        cacheProvider = require('../util/cacheProvider'),

        UpgradeController = function(options) {
            this.template = require('raw!../../templates/upgrade.html');
        };

    UpgradeController.prototype.bind = function(App, data) {

        var upgradeAction = document.getElementsByClassName('upgradeAction')[0];

        upgradeAction.addEventListener('click', function(event) {

            var jsonobj = {
                'screen': 'openappstore',
                'url': 'com.bsb.hike'
            };
            PlatformBridge.openActivity(JSON.stringify(jsonobj));
        });

    };

    UpgradeController.prototype.render = function(ctr, App, data) {

        var that = this;
        if (platformSdk.bridgeEnabled) {
            utils.changeBarColors('#3C367C', '#494D95');
        }
        that.el = document.createElement('div');
        that.el.className = 'upgradeContainer centerToScreenContainer animation_fadein noselect';
        that.el.innerHTML = Mustache.render(unescape(that.template));
        ctr.appendChild(that.el);
        events.publish('update.loader', { show: false });
        that.bind(App, data);
    };

    UpgradeController.prototype.destroy = function() {

    };

    module.exports = UpgradeController;

})(window, platformSdk, platformSdk.events);
