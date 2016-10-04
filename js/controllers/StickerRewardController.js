(function(W, platformSdk, events) {
    'use strict';

    var utils = require('../util/utils'),
        Constants = require('../../constants.js'),

        StickerRewardController = function(options) {
            this.template = require('raw!../../templates/stickerReward.html');
        };

    StickerRewardController.prototype.bind = function(App, data) {

        var that = this;

        var DOMcache = {
            stickerBg: document.getElementsByClassName('stickerRewardContainer')[0],
            stickerRewardAction: document.getElementsByClassName('stickerRewardAction')[0],
            stickerRewardContainer: document.getElementsByClassName('stickerRewardContainer')[0],
            stickerRewardTitle: document.getElementsByClassName('stickerRewardTitle')[0],
            stickerRewardSubtitle: document.getElementsByClassName('stickerRewardSubtitle')[0],
            stickerRewardIllustration: document.getElementsByClassName('stickerRewardIllustration')[0],
            stickerPackIcon: document.getElementsByClassName('stickerPackIcon'),
        };

        // Add header icon for rewards
        if (data.hicon) {
            DOMcache.stickerRewardIllustration.style.backgroundImage = "url('" + data.hicon + "')";
        } else {
            console.log("Add a default header");
        }

        DOMcache.stickerRewardAction.addEventListener('click', function(event) {
            console.log("Get Sticker Action Clicked");
            DOMcache.stickerRewardSubtitle.classList.remove('hideClass');
            that.showStickerPacksAvailable(App, DOMcache, data);
        });

    };

    StickerRewardController.prototype.assignStickerCatImages = function(packs, DOMcache) {

        var stickerCatUrl = 'http://54.169.82.65:5016/v1/stickerpack/';

        for (var i = 0; i < DOMcache.stickerPackIcon.length; i++) {
            var icon = DOMcache.stickerPackIcon[i];
            icon.style.backgroundImage = 'url(\'' + stickerCatUrl + packs[i].catId + '/preview' + '\')';
        }

    };

    StickerRewardController.prototype.showStickerPacksAvailable = function(App, DOMcache, data) {

        var that = this;

        DOMcache.stickerRewardSubtitle.innerHTML = 'You can only redeem one sticker at a time so choose wisely';
        DOMcache.stickerRewardContainer.innerHTML = '';

        that.template = require('raw!../../templates/stickerPackListTemplate.html');
        DOMcache.stickerRewardContainer.innerHTML = Mustache.render(that.template, {
            stickerPacks: data.packs,
            rewardTitle: 'Select One',
            sub: 'You can only redeem one sticker at a time so choose wisely',
        });

        that.assignStickerCatImages(data.packs, DOMcache);
    };

    StickerRewardController.prototype.render = function(ctr, App, data) {

        console.log(data);

        var that = this;
        that.el = document.createElement('div');
        that.el.className = 'stickerRewardContainer centerToScreenContainer ftueController animation_fadein noselect';

        if (platformSdk.bridgeEnabled) {
            utils.changeBarColors('#A944FA', '#5D68CE');
        }

        that.el.innerHTML = Mustache.render(that.template, {
            rewardTitle: data.rewardDetails.title,
            rewardSubtitle: data.rewardDetails.desc,
            stickerPacks: data.rewardDetails.packs,
        });
        ctr.appendChild(that.el);
        events.publish('update.loader', { show: false });
        that.bind(App, data.rewardDetails);
    };

    StickerRewardController.prototype.destroy = function() {

    };

    module.exports = StickerRewardController;

})(window, platformSdk, platformSdk.events);
