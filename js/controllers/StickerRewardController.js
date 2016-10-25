/*jshint loopfunc: true */

(function(W, platformSdk, events) {
    'use strict';

    var utils = require('../util/utils'),
        Constants = require('../../constants.js'),
        cacheProvider = require('../util/cacheProvider'),

        StickerRewardController = function(options) {
            this.template = require('raw!../../templates/stickerReward.html');
        };

    StickerRewardController.prototype.bind = function(App, data, router, rewardId) {

        var that = this;
        var ftue = null;

        var DOMcache = {
            stickerRewardAction: document.getElementsByClassName('stickerRewardAction')[0],
            stickerRewardContainer: document.getElementsByClassName('stickerRewardContainer')[0],
            stickerRewardSubtitle: document.getElementsByClassName('stickerRewardSubtitle')[0],
            stickerRewardIllustration: document.getElementsByClassName('stickerRewardIllustration')[0],
            stickerPackIcon: document.getElementsByClassName('stickerPackIcon'),
            stickerRewardWrapper: document.getElementsByClassName('stickerRewardWrapper')[0],
        };

        var rewardFtueMapping = cacheProvider.getFromCritical('rewardFtueMapping');

        if (rewardFtueMapping) {
            ftue = rewardFtueMapping[rewardId];
        } else {
            ftue = false;
        }

        if (ftue) {
            DOMcache.stickerRewardSubtitle.classList.remove('hideClass');
            that.showStickerPacksAvailable(App, DOMcache, data, router, rewardId, ftue);
        } else {
            that.setStickerRewardHeaderImage(data, DOMcache);
            // FTUE ACTION
            if (DOMcache.stickerRewardAction) {
                DOMcache.stickerRewardAction.addEventListener('click', function(event) {
                    DOMcache.stickerRewardSubtitle.classList.remove('hideClass');
                    that.showStickerPacksAvailable(App, DOMcache, data, router, rewardId, ftue);
                    that.mapRewardFtue(rewardId);
                });
            }
        }
    };

    StickerRewardController.prototype.mapRewardFtue = function(rid) {
        var rewardFtueMapping = cacheProvider.getFromCritical('rewardFtueMapping');

        if (!rewardFtueMapping) {
            rewardFtueMapping = {};
            rewardFtueMapping[rid] = true;
        } else {
            rewardFtueMapping[rid] = true;
        }

        cacheProvider.setInCritical('rewardFtueMapping', rewardFtueMapping);
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
            DOMcache.stickerActionCancel = document.getElementsByClassName('stickerActionCancel')[0];
            DOMcache.stickerActionDownload = document.getElementsByClassName('stickerActionDownload')[0];
            DOMcache.stickerActionCancel.classList.remove('hideClass');
            DOMcache.stickerActionDownload.innerHTML = "Download";
            DOMcache.stickerActionDownload.style.opacity = 1;
            DOMcache.stickerActionDownload.fontWeight = 500;

            events.publish('update.notif.toast', { show: true, heading: 'Take a break?', details: 'This pack will only be available after some time. See you again later.', notifType: 'notifNeutral' });
            return;
        }

        var dataToSend = {};

        dataToSend.rid = rId;
        dataToSend.send = { 'catId': catId };

        var stickerJSON = { 'catId': catId, 'categoryName': stickerDetails.name, 'totalStickers': stickerDetails.nos, 'categorySize': stickerDetails.size };
        stickerJSON = JSON.stringify(stickerJSON);

        if (platformSdk.bridgeEnabled) {

            App.NinjaService.getStickerPack(dataToSend, function(res) {
                if (res.stat == "ok") {

                    PlatformBridge.downloadStkPack(stickerJSON);
                    var dataToSend = {};
                    dataToSend.rewardId = rId;

                    App.NinjaService.recallRewardDetails(dataToSend, function(res2) {
                        events.publish('update.notif.toast', { show: true, heading: 'Awesome Choice!', details: 'Go back and start chatting. You can see this pack in the Stickers section in your chat now!', notifType: 'notifSuccess' });
                        that.template = require('raw!../../templates/stickerPackListTemplate.html');

                        DOMcache.stickerRewardContainer.innerHTML = Mustache.render(that.template, {
                            stickerPacks: res2.data.packs,
                            rewardTitle: 'Select One',
                            sub: 'You can only unlock your next sticker pack after the cooldown.',
                            rewardId: rId,
                            cooldown: res2.data.cooldown
                        });

                        that.defineCooldown(App, res2.data.cooldown, rId, router, DOMcache);
                        that.assignStickerCatImages(res2.data.packs, DOMcache);
                        // Set Sticker Row inside DOM Cache
                        DOMcache.stickerDownloadRow = document.getElementsByClassName('stickerDownloadRow');
                        that.setStickerDownloadLinks(App, DOMcache, res2.data.packs, router, res2.data);
                    }, this);
                } else {
                    events.publish('update.notif.toast', { show: true, heading: 'Sorry!', details: 'This sticker pack cannot be downloaded right now, please try again after some time!', notifType: 'notifError' });
                }
            }, this);
        }

    };

    StickerRewardController.prototype.assignStickerPackActions = function(App, DOMcache, catId, rId, stickerDetails, router, data, ftue) {

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
            DOMcache.stickerActionCancel.classList.add('hideClass');
            platformSdk.events.publish('update.threeDotLoader', { elem: DOMcache.stickerActionDownload, show: true, text: 'Downloading' });
            var cooldown = this.getAttribute('data-cooldown');
            utils.restartApp(App, false);
            that.downloadStickerPack(App, DOMcache, catId, rId, stickerDetails, router, cooldown);
        });
    };

    StickerRewardController.prototype.defineCooldown = function(App, timeleft, rId, rewardRouter, DOMcache) {

        var that = this;

        function getTimeRemaining(timeRemaining) {
            var t = timeRemaining;
            var seconds = Math.floor((t / 1000) % 60);
            var minutes = Math.floor((t / 1000 / 60) % 60);
            var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
            var days = Math.floor(t / (1000 * 60 * 60 * 24));
            return {
                'total': t,
                'days': days,
                'hours': hours,
                'minutes': minutes,
                'seconds': seconds
            };
        }

        function initializeClock(id, timeRemaining) {
            var clock = document.getElementById(id);
            var daysSpan = clock.querySelector('.days');
            var hoursSpan = clock.querySelector('.hours');
            var minutesSpan = clock.querySelector('.minutes');
            var secondsSpan = clock.querySelector('.seconds');

            function updateClock() {
                var t = getTimeRemaining(timeRemaining);

                if (t.days > 0) {
                    daysSpan.innerHTML = t.days;
                    clock.querySelector('.clockTextDays').classList.remove('hideClass');
                }
                if (t.hours > 0) {
                    hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
                    clock.querySelector('.clockTextHours').classList.remove('hideClass');
                }
                if (t.minutes > 0) {
                    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
                    clock.querySelector('.clockTextMins').classList.remove('hideClass');
                }
                if (t.seconds > 0) {
                    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);
                    clock.querySelector('.clockTextSecs').classList.remove('hideClass');
                }

                if (t.total <= 0) {
                    clearInterval(timeinterval);
                    console.log("Getting available rewards");

                    var dataToSend = {};
                    dataToSend.rewardId = rId;

                    App.NinjaService.recallRewardDetails(dataToSend, function(res2) {

                        that.template = require('raw!../../templates/stickerPackListTemplate.html');

                        DOMcache.stickerRewardContainer.innerHTML = Mustache.render(that.template, {
                            stickerPacks: res2.data.packs,
                            rewardTitle: 'Select One',
                            sub: 'You can only redeem one sticker pack at a time so choose wisely',
                            rewardId: rId,
                            cooldown: res2.data.cooldown
                        });

                        that.assignStickerCatImages(res2.data.packs, DOMcache);
                        // Set Sticker Row inside DOM Cache
                        DOMcache.stickerDownloadRow = document.getElementsByClassName('stickerDownloadRow');
                        that.setStickerDownloadLinks(App, DOMcache, res2.data.packs, rewardRouter, res2.data);
                    }, this);
                }
                timeRemaining = timeRemaining - 1000;
            }

            updateClock();
            var timeinterval = setInterval(updateClock, 1000);
        }

        initializeClock('clockdiv', timeleft * 1000);

    };

    StickerRewardController.prototype.setStickerDownloadLinks = function(App, DOMcache, stickerPacks, router, data, ftue) {

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
                that.assignStickerPackActions(App, DOMcache, catId, rewardId, stickerDetails, router, data, ftue);

            });
        }
    };

    StickerRewardController.prototype.showStickerPacksAvailable = function(App, DOMcache, data, router, rId, ftue) {

        var that = this;

        DOMcache.stickerRewardContainer.innerHTML = '';

        that.template = require('raw!../../templates/stickerPackListTemplate.html');
        DOMcache.stickerRewardContainer.innerHTML = Mustache.render(that.template, {
            stickerPacks: data.packs,
            rewardTitle: 'Select One',
            sub: 'You can only redeem one sticker pack at a time so choose wisely',
            rewardId: rId,
            cooldown: data.cooldown
        });

        if (data.cooldown) {
            that.defineCooldown(App, data.cooldown, rId, router, DOMcache);
        }

        that.assignStickerCatImages(data.packs, DOMcache);
        // Set Sticker Row inside DOM Cache
        DOMcache.stickerDownloadRow = document.getElementsByClassName('stickerDownloadRow');
        that.setStickerDownloadLinks(App, DOMcache, data.packs, router, data, ftue);

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

    StickerRewardController.prototype.setPageStyle = function(color, rid) {
        var that = this;
        var hexcolor = null;

        if (!color) {
            var rewardColorMapping = cacheProvider.getFromCritical('rewardColorMapping');
            if (rewardColorMapping && rewardColorMapping[rid]) {
                hexcolor = rewardColorMapping[rid];
            } else {
                hexcolor = '#3D475B';
            }
        } else {
            hexcolor = utils.rgba2hex(color);
        }

        var StickerRewardContainer = document.getElementsByClassName('stickerRewardContainer')[0];

        utils.changeBarColors(hexcolor, hexcolor);
        StickerRewardContainer.style.backgroundColor = hexcolor;
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
        utils.changeBotTitle(data.rewardDetails.title);
        that.setPageStyle(data.cardColor, data.rewardId);
        events.publish('update.loader', { show: false });
        that.bind(App, data.rewardDetails, data.rewardRouter, data.rewardId, data.ftue);
    };

    StickerRewardController.prototype.destroy = function() {

    };

    module.exports = StickerRewardController;

})(window, platformSdk, platformSdk.events);
