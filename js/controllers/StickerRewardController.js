(function(W, platformSdk, events) {
    'use strict';

    var utils = require('../util/utils'),
        Constants = require('../../constants.js'),

        StickerRewardController = function(options) {
            this.template = require('raw!../../templates/stickerReward.html');
        };

    StickerRewardController.prototype.bind = function(App, data) {

        var that = this;

        console.log(data);

        if (data.rewardDetails.cooldown) {
            var stickerRewardList = document.getElementsByClassName('stickerRewardList')[0];

            console.log("Removing THE",stickerRewardList);
            stickerRewardList.innerHTML = '';

            that.template = require('raw!../../templates/stickerShopCooldown.html');
            stickerRewardList.innerHTML = Mustache.render(this.template, {});

            console.log("DATAAA IS", data.rewardDetails);

            that.defineCooldown(App,data.rewardDetails.cooldown,data.rewardId,data.rewardRouter);
       
        }

        // Sticker packs data here
        var stickerPacks = data.rewardDetails.packs;
        var stickerDownloadRow = document.getElementsByClassName('stickerDownloadRow');
        var stickerRewardHeaderImage = document.getElementsByClassName('stickerRewardHeaderImage')[0];
        stickerRewardHeaderImage.style.backgroundImage = 'url(\'' + data.rewardDetails.hicon + '\')';

        that.assignStickerCatImages(stickerPacks, stickerDownloadRow);

        for (var i = 0; i < stickerDownloadRow.length; i++) {
            stickerDownloadRow[i].addEventListener('click', function(ev) {

                var stickerState = this.getAttribute('data-status');
                var catId = this.getAttribute('data-catId');
                var rewardId = this.getAttribute('data-rewardid');
                var stickerDetails = that.getStickerDetails(catId, stickerPacks);

                App.router.navigateTo('/stickerPackView', { "stickerDetails": stickerDetails, "rewardId": rewardId, "rewardRouter": data.rewardRouter });                

                // if (stickerState == '1') {
                //     utils.showToast('You have already downloaded this sticker pack');
                // } else {
                //     console.log('Fetching sticker pack');
                //     // Going to Sticker Pack View
                //     App.router.navigateTo('/stickerPackView', { "stickerDetails": stickerDetails, "rewardId": rewardId, "rewardRouter": data.rewardRouter });
                // }
            });
        }

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


    StickerRewardController.prototype.assignStickerCatImages = function(packs, rows) {

        var stickerCatUrl = 'http://54.169.82.65:5016/v1/stickerpack/';

        for (var i = 0; i < rows.length; i++) {
            var icon = rows[i].getElementsByClassName('stickerPackIcon')[0];
            console.log(icon);
            icon.style.backgroundImage = 'url(\'' + stickerCatUrl + packs[i].catId + '/preview' + '\')';

        }

    };

    StickerRewardController.prototype.defineCooldown = function(App, timeleft,rId, rewardRouter) {

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

                    daysSpan.innerHTML = t.days;
                    hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
                    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
                    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

                    if (t.total <= 0) {
                        clearInterval(timeinterval);
                        console.log("Getting available rewards");

                        var dataSend = {};
                        dataSend.rewardId = rId;

                        App.NinjaService.getRewardDetails(dataSend, function(res) {
                            console.log(res.data);
                             App.router.navigateTo(rewardRouter,{ "rewardDetails": res.data , "rewardId" :rId, "rewardRouter":rewardRouter} );
                        });
                    }
                    timeRemaining = timeRemaining - 1000;
                }

                updateClock();
                var timeinterval = setInterval(updateClock, 1000);
            }

            // var d = new Date(timeleft*1000); // The 0 there is the key, which sets the date to the epoch

            // var deadline = d;
            initializeClock('clockdiv', timeleft * 1000);

    };



    StickerRewardController.prototype.render = function(ctr, App, data) {

        console.log("COOLDOWN is", data);

        var that = this;
        that.el = document.createElement('div');
        that.el.className = 'stickerRewardContainer ftueController animation_fadein noselect';

        that.template = require('raw!../../templates/stickerReward.html');

        that.el.innerHTML = Mustache.render(that.template, {
            stickerPacks: data.rewardDetails.packs,
            title: data.rewardDetails.title,
            stitle: data.rewardDetails.desc,
            rewardId: data.rewardId
        });

        //data = data.rewardDetails;

        ctr.appendChild(that.el);
        events.publish('update.loader', { show: false });
        that.bind(App, data);
    };

    StickerRewardController.prototype.destroy = function() {

    };

    module.exports = StickerRewardController;

})(window, platformSdk, platformSdk.events);
