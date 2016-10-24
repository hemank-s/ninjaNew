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
        var upgradeSubtitle = document.getElementsByClassName('upgradeSubtitle')[0];

        if (data == 'hike') {
            upgradeSubtitle.innerHTML = 'You hike app is out of date. Please upgrade your app to the latest verison to continue being ninja!';
            upgradeAction.addEventListener('click', function(event) {

                var jsonobj = {
                    'screen': 'openappstore',
                    'url': 'com.bsb.hike'
                };
                PlatformBridge.openActivity(JSON.stringify(jsonobj));

            });

        } else if (data == 'ninja') {
            upgradeSubtitle.innerHTML = 'Your ninja app is out of date -  we have improved the ninja app and added some cool things for your. Click to upgrade now.';
            upgradeAction.addEventListener('click', function(event) {
                if (platformSdk.bridgeEnabled) {
                    App.NinjaService.getNewNinjaPacket(function(res) {
                        if (res.stat == "ok") {
                            events.publish('update.notif.toast', { show: true, heading: 'Awesome!', details: 'You will shortly be getting the new ninja app!', notifType: 'notifSuccess' });
                            PlatformBridge.closeWebView();
                        }
                    }, this);
                } else {
                    events.publish('update.notif.toast', { show: true, heading: 'Awesome!', details: 'You will shortly be getting the new ninja app. Press back!', notifType: 'notifSuccess' });
                }

            });
        }
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
