(function(W, platformSdk, events) {
    'use strict';

    var utils = require('../util/utils'),
        Constants = require('../../constants.js'),
        cacheProvider = require('../util/cacheProvider'),

        ExclusiveFeatureController = function(options) {
            this.template = require('raw!../../templates/exclusiveFeature.html');

        };

    ExclusiveFeatureController.prototype.bind = function(App, res) {

        var that = this;
        var data = res.rewardDetails;

        var DOMcache = {
            exclusiveFeatureIllustration: document.getElementsByClassName('exclusiveFeatureIllustration')[0],
            exclusiveFeatureAction: document.getElementsByClassName('exclusiveFeatureAction')[0],
            exclusiveFeatureRetry: document.getElementsByClassName('exclusiveFeatureRetry')[0],
            exclusiveFeatureContainer: document.getElementsByClassName('exclusiveFeatureContainer')[0],
        };

        that.setExclusiveFeatureHeader(data, DOMcache);

        if (data.sanctioned) {
            that.template = require('raw!../../templates/exclusiveFeatureDetails.html');
            that.el.innerHTML = Mustache.render(unescape(that.template), { rewardTitle: data.title + ' ' + 'activated', rewardSubtitle: data.desc });
            DOMcache.exclusiveFeatureRetry = document.getElementsByClassName('exclusiveFeatureRetry')[0];
            if (DOMcache.exclusiveFeatureRetry) {
                console.log("RETRY DEFINED");
                DOMcache.exclusiveFeatureRetry.addEventListener('click', function(event) {
                    that.enableExclusiveFeature(App, DOMcache, res, true, false);
                });
            }
        }

        // FTUE ACTION
        if (DOMcache.exclusiveFeatureAction) {
            DOMcache.exclusiveFeatureAction.addEventListener('click', function(event) {
                that.enableExclusiveFeature(App, DOMcache, res, false, true);
            });
        }



    };

    ExclusiveFeatureController.prototype.enableExclusiveFeature = function(App, DOMcache, res2, retry, firstTime) {

        var that = this;

        console.log("Enabling GIF feature for you");

        var dataToSend = {};
        dataToSend.rid = res2.rewardId;
        dataToSend.userAppVersion = platformSdk.appData.appVersion;
        dataToSend.enable = true;

        if (platformSdk.bridgeEnabled) {
            App.NinjaService.getExclusiveFeature(dataToSend, function(res) {
                console.log(res);
                if (res.stat == "ok") {
                    if (retry) {
                        events.publish('update.notif.toast', { show: true, heading: 'Yey!', details: 'The feature has been reactivated as per your request.', notifType: 'notifSuccess' });
                    } else {
                        that.template = require('raw!../../templates/exclusiveFeatureDetails.html');
                        DOMcache.exclusiveFeatureContainer.innerHTML = Mustache.render(that.template, {
                            rewardTitle: res2.rewardDetails.title + ' ' + 'Activated',
                            rewardSubtitle: res2.rewardDetails.desc
                        });

                        that.setExclusiveFeatureImage(res2.rewardDetails, DOMcache);

                        if (firstTime) {
                            DOMcache.exclusiveFeatureRetry = document.getElementsByClassName('exclusiveFeatureRetry')[0];
                            DOMcache.exclusiveFeatureRetry.classList.add('hideClass');
                        }

                        DOMcache.exclusiveFeatureDetailSubtitle = document.getElementsByClassName('exclusiveFeatureDetailSubtitle')[0];

                        DOMcache.exclusiveFeatureDetailSubtitle.classList.remove('hideClass');
                        DOMcache.exclusiveFeatureDetailSubtitle.innerHTML = res2.rewardDetails.desc;
                    }
                }
            }, this);
        } else {
            that.template = require('raw!../../templates/exclusiveFeatureDetails.html');
            DOMcache.exclusiveFeatureContainer.innerHTML = Mustache.render(that.template, {
                rewardTitle: res2.rewardDetails.title + ' ' + 'Activated',
                rewardSubtitle: res2.rewardDetails.desc
            });

            that.setExclusiveFeatureImage(res2.rewardDetails, DOMcache);

            if (firstTime) {
                DOMcache.exclusiveFeatureRetry = document.getElementsByClassName('exclusiveFeatureRetry')[0];
                DOMcache.exclusiveFeatureRetry.classList.add('hideClass');
            }

            DOMcache.exclusiveFeatureDetailSubtitle = document.getElementsByClassName('exclusiveFeatureDetailSubtitle')[0];

            DOMcache.exclusiveFeatureDetailSubtitle.classList.remove('hideClass');
            DOMcache.exclusiveFeatureDetailSubtitle.innerHTML = res2.rewardDetails.desc;
        }

    };

    ExclusiveFeatureController.prototype.setExclusiveFeatureHeader = function(data, DOMcache) {

        // Add header icon for rewards
        if (data.hicon) {
            DOMcache.exclusiveFeatureIllustration.style.backgroundImage = "url('" + data.hicon + "')";
        } else {
            console.log("Add a default header");
        }
    };

    ExclusiveFeatureController.prototype.setExclusiveFeatureImage = function(data, DOMcache) {

        DOMcache.exclusiveFeatureImage = document.getElementsByClassName('exclusiveFeatureImage')[0];

        // Add header icon for rewards
        if (data.fimage) {
            DOMcache.exclusiveFeatureImage.style.backgroundImage = "url('" + data.fimage + "')";
        } else {
            console.log("Add a default header");
        }
    };

    ExclusiveFeatureController.prototype.setPageStyle = function(color, rid) {
        var that = this;
        var hexcolor = null;

        if (!color) {
            var rewardColorMapping = cacheProvider.getFromCritical('rewardColorMapping');
            hexcolor = rewardColorMapping[rid];
        } else {
            hexcolor = utils.rgba2hex(color);
        }

        var exclusiveFeatureContainer = document.getElementsByClassName('exclusiveFeatureContainer')[0];

        utils.changeBarColors(hexcolor, hexcolor);
        exclusiveFeatureContainer.style.backgroundColor = hexcolor;
    };

    ExclusiveFeatureController.prototype.render = function(ctr, App, data) {

        var that = this;
        that.el = document.createElement('div');
        that.el.className = 'exclusiveFeatureContainer centerToScreenContainer animation_fadein noselect';

        console.log("exclusive feature data is ", data);

        utils.changeBotTitle(data.rewardDetails.title);
        that.el.innerHTML = Mustache.render(unescape(that.template), { rewardTitle: data.rewardDetails.title, rewardSubtitle: data.rewardDetails.desc });
        ctr.appendChild(that.el);
        utils.changeBotTitle(data.rewardDetails.title);
        that.setPageStyle(data.cardColor, data.rewardId);
        events.publish('update.loader', { show: false });
        that.bind(App, data);
    };

    ExclusiveFeatureController.prototype.destroy = function() {

    };

    module.exports = ExclusiveFeatureController;

})(window, platformSdk, platformSdk.events);
