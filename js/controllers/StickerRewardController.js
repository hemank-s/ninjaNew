/*jshint loopfunc: true */

(function(W, platformSdk, events) {
    'use strict';

    var utils = require('../util/utils'),
        Constants = require('../../constants.js'),

        StickerRewardController = function(options) {
            this.template = require('raw!../../templates/stickerReward.html');
        };

    StickerRewardController.prototype.bind = function(App, data, router, rewardId) {

        var that = this;

        var DOMcache = {
            stickerRewardAction: document.getElementsByClassName('stickerRewardAction')[0],
            stickerRewardContainer: document.getElementsByClassName('stickerRewardContainer')[0],
            stickerRewardSubtitle: document.getElementsByClassName('stickerRewardSubtitle')[0],
            stickerRewardIllustration: document.getElementsByClassName('stickerRewardIllustration')[0],
            stickerPackIcon: document.getElementsByClassName('stickerPackIcon'),
        };

        that.setStickerRewardHeaderImage(data, DOMcache);

        // FTUE ACTION
        if (DOMcache.stickerRewardAction) {
            DOMcache.stickerRewardAction.addEventListener('click', function(event) {
                DOMcache.stickerRewardSubtitle.classList.remove('hideClass');
                that.showStickerPacksAvailable(App, DOMcache, data, router, rewardId);
            });
        }

    };

    StickerRewardController.prototype.setStickerRewardHeaderImage = function(data, DOMcache) {

        // Add header icon for rewards
        if (data.hicon) {
            DOMcache.stickerRewardIllustration.style.backgroundImage = "url('" + data.hicon + "')";
        } else {
            console.log("Add a default header");
        }

    };

    StickerRewardController.prototype.assignStickerCatImages = function(packs, DOMcache) {

        var stickerCatUrl = appConfig.API_URL + '/stickerpack/';

        for (var i = 0; i < DOMcache.stickerPackIcon.length; i++) {
            var icon = DOMcache.stickerPackIcon[i];
            icon.style.backgroundImage = 'url(\'' + stickerCatUrl + packs[i].catId + '/preview' + '\')';
        }

    };

    StickerRewardController.prototype.assignStickerPreviewImages = function(stickerList, DOMcache, catId) {


        var stickerPreviewUrl = appConfig.API_URL + '/stickerpack/';

        for (var i = 0; i < DOMcache.stickerRow.length; i++) {
            var icon = DOMcache.stickerRow[i].getElementsByClassName('stickerIcon')[0];
            icon.style.backgroundImage = "url('" + appConfig.STICKER_PREFIX + "catId=" + catId + "&stId=" + stickerList[i] + appConfig.STICKER_SUFFIX + "')";
        }
    };

    StickerRewardController.prototype.downloadStickerPack = function(App, DOMcache, catId, rId, stickerDetails, router, cooldown) {

        var that = this;

        if (cooldown) {
            events.publish('update.notif.toast', { show: true, text: 'Under cooldown, please try again later' });
            return;
        }

        DOMcache.stickerActionCancel.classList.add('hideClass');
        DOMcache.stickerActionDownload.innerHTML = 'Downloading';

        var dataToSend = {};

        dataToSend.rid = rId;
        dataToSend.send = { 'catId': catId };

        var stickerJSON = { 'catId': catId, 'categoryName': stickerDetails.name, 'totalStickers': stickerDetails.nos, 'categorySize': stickerDetails.size };
        stickerJSON = JSON.stringify(stickerJSON);

        if (platformSdk.bridgeEnabled) {

            App.NinjaService.getStickerPack(dataToSend, function(res) {
                console.log(res);
                if (res.stat == "ok") {

                    PlatformBridge.downloadStkPack(stickerJSON);
                    events.publish('update.notif.toast', { show: true, text: 'You can view your sticker in the sticker palette. Start Sharing' });

                    var dataToSend = {};
                    dataToSend.rewardId = rId;


                    App.NinjaService.recallRewardDetails(dataToSend, function(res2) {

                        that.template = require('raw!../../templates/stickerPackCooldownTemplate.html');

                        DOMcache.stickerRewardContainer.innerHTML = Mustache.render(that.template, {
                            stickerPacks: res2.data.packs,
                            rewardTitle: 'Select One',
                            sub: 'You can unlock your next sticker pack in ' + res2.data.cooldown + 'seconds',
                            rewardId: rId,
                            cooldown: res2.data.cooldown
                        });

                        that.assignStickerCatImages(res2.data.packs, DOMcache);
                        // Set Sticker Row inside DOM Cache
                        DOMcache.stickerDownloadRow = document.getElementsByClassName('stickerDownloadRow');
                        that.setStickerDownloadLinks(App, DOMcache, res2.data.packs, router, res2.data);
                    }, this);
                } else {
                    events.publish('update.notif.toast', { show: true, text: 'Sticker pack cannot be downloaded right now, please try again after some time!' });
                }
            }, this);
        }

    };

    StickerRewardController.prototype.assignStickerPackActions = function(App, DOMcache, catId, rId, stickerDetails, router, data) {

        var that = this;

        console.log("Assigning cancel and download actions");

        DOMcache.stickerActionCancel = document.getElementsByClassName('stickerActionCancel')[0];
        DOMcache.stickerActionDownload = document.getElementsByClassName('stickerActionDownload')[0];

        DOMcache.stickerActionCancel.addEventListener('click', function(ev) {
            console.log("closing sticker pack view");
            that.showStickerPacksAvailable(App, DOMcache, data, router, rId);
        });

        DOMcache.stickerActionDownload.addEventListener('click', function(ev) {
            console.log("Getting sticker pack for you");
            var cooldown = this.getAttribute('data-cooldown');
            that.downloadStickerPack(App, DOMcache, catId, rId, stickerDetails, router, cooldown);
        });
    };

    StickerRewardController.prototype.setStickerDownloadLinks = function(App, DOMcache, stickerPacks, router, data) {

        var that = this;

        for (var i = 0; i < DOMcache.stickerDownloadRow.length; i++) {
            DOMcache.stickerDownloadRow[i].addEventListener('click', function(ev) {

                var catId = this.getAttribute('data-catId');
                var rewardId = this.getAttribute('data-rewardid');
                var stickerDetails = that.getStickerDetails(catId, stickerPacks);

                that.template = require('raw!../../templates/stickerPackView.html');
                DOMcache.stickerRewardContainer.innerHTML = Mustache.render(that.template, {
                    "name": stickerDetails.name,
                    "nos": stickerDetails.nos,
                    "stickers": stickerDetails.act_stickers,
                    "rewardId": rewardId,
                    "cooldown": data.cooldown
                });

                DOMcache.stickerRow = document.getElementsByClassName('stickerRow');
                that.assignStickerPreviewImages(stickerDetails.act_stickers, DOMcache, catId);
                that.assignStickerPackActions(App, DOMcache, catId, rewardId, stickerDetails, router, data);

            });
        }
    };

    StickerRewardController.prototype.showStickerPacksAvailable = function(App, DOMcache, data, router, rId) {

        var that = this;

        DOMcache.stickerRewardSubtitle.innerHTML = 'You can only redeem one sticker at a time so choose wisely';
        DOMcache.stickerRewardContainer.innerHTML = '';

        that.template = require('raw!../../templates/stickerPackListTemplate.html');
        DOMcache.stickerRewardContainer.innerHTML = Mustache.render(that.template, {
            stickerPacks: data.packs,
            rewardTitle: 'Select One',
            sub: 'You can only redeem one sticker at a time so choose wisely',
            rewardId: rId,
            cooldown: data.cooldown
        });

        that.assignStickerCatImages(data.packs, DOMcache);
        // Set Sticker Row inside DOM Cache
        DOMcache.stickerDownloadRow = document.getElementsByClassName('stickerDownloadRow');
        that.setStickerDownloadLinks(App, DOMcache, data.packs, router, data);

    };

    StickerRewardController.prototype.getStickerDetails = function(catId, stickerPacks) {

        for (var i = 0; i < stickerPacks.length; i++) {
            if (catId == stickerPacks[i].catId) {
                return stickerPacks[i];
            } else {
                console.log("Sticker Pack not found");
            }
        }

    };

    StickerRewardController.prototype.render = function(ctr, App, data) {

        console.log(data);

        var that = this;

        that.el = document.createElement('div');
        that.el.className = 'stickerRewardContainer centerToScreenContainer ftueController animation_fadein noselect';

        // Get colors of the card from the card that has been clicked
        if (platformSdk.bridgeEnabled) {
            utils.changeBarColors('#A944FA', '#5D68CE');
        }

        that.template = require('raw!../../templates/stickerReward.html');
        that.el.innerHTML = Mustache.render(that.template, {
            rewardTitle: data.rewardDetails.title,
            rewardSubtitle: data.rewardDetails.desc,
            stickerPacks: data.rewardDetails.packs,
        });
        ctr.appendChild(that.el);
        events.publish('update.loader', { show: false });
        that.bind(App, data.rewardDetails, data.rewardRouter, data.rewardId);
    };

    StickerRewardController.prototype.destroy = function() {

    };

    module.exports = StickerRewardController;

})(window, platformSdk, platformSdk.events);