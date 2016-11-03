/**
 * Created by hemanksabharwal on 17/05/15.
 */

(function() {
    'use strict';

    var platformSdk = require('../../libs/js/platformSdk_v2.0'),
        utils = require('../util/utils'),
        cacheProvider = require('../util/cacheProvider'),
        rewardsModel = require('../models/rewardsModel'),
        TxService = require('../util/txServices'),
        NinjaService = require('../util/ninjaServices'),

        MysteryBoxModel = function() {
            this.TxService = new TxService();
            this.NinjaService = new NinjaService(this.TxService); //communication layer
        },

        EMPTY_OBJ_READ_ONLY = {};

    MysteryBoxModel.prototype = {

        getMysteryBoxDetails: function(App) {

            var res = null;

            if (platformSdk.bridgeEnabled) {
                App.NinjaService.getMysteryBox(function(res) {
                    console.log('MYSTERY BOX DATA IS', res.data);
                    cacheProvider.setInCritical('ninjaMysteryBoxData', res.data);
                }, this);
            } else {
                res = { 'data': { 'history': [], 'status': 'active', 'rewards': [{ 'id': 1, 'type': 'mysteryBox_medium', 'title': 'Battery + 1' }, { 'id': 2, 'type': 'mysteryBox_medium', 'title': 'Streak + 1' }, { 'id': 3, 'type': 'mysteryBox_low', 'title': 'Battery + 0' }, { 'id': 4, 'type': 'mysteryBox_low', 'title': 'Streak + 0' }, { 'id': 5, 'type': 'mysteryBox_bumper', 'title': 'Custom sticker' }, { 'id': 6, 'type': 'mysteryBox_low', 'title': 'Battery - 1' }, { 'id': 7, 'type': 'mysteryBox_low', 'title': 'streak - 1' }, { 'id': 8, 'type': 'mysteryBox_low', 'title': 'Better Luck next time' }] } };
            }
        },

        getMysteryBoxRewardDetails: function(data, rId) {

            for (var i = 0; i < data.length; i++) {
                if (data[i].id == rId) {
                    console.log('Match found', data[i]);
                    return data[i];
                } else {
                    console.log('Reward not found');
                }
            }
        },

        defineYesterdayWinner: function(data) {
            var winnerIcon = document.getElementsByClassName('winnerIcon')[0];
            winnerIcon.style.backgroundImage = 'url(\'data:image/png;base64,' + data.dp + '\')';
        },

        defineLuckyBoxRewardIcons: function(data) {

            var mBoxRewardIcon = document.getElementsByClassName('mBoxRewardIcon');

            for (var i = 0; i < mBoxRewardIcon.length; i++) {
                mBoxRewardIcon[i].style.backgroundImage = 'url(\'' + data[i].icon + '\')';
            }
        },

        defineMysteryBoxResultAnimation: function(App, rewardData, mysteryBoxData) {

            var that = this;
            var mysteryBoxContainer = document.getElementsByClassName('mysteryBoxContainer')[0]; // Gives Existing List of Rewards in the Template

            if (rewardData.value == 'HIGH' || rewardData.value == 'MED') {

                console.log('Some reward recieved');

                that.template = require('raw!../../templates/mysteryBoxResultAnimation.html');
                mysteryBoxContainer.innerHTML = Mustache.render(that.template, {
                    mysterBoxReward: rewardData
                });

                var mysteryBoxIcon = document.getElementsByClassName('mysteryBoxIcon')[0];
                mysteryBoxIcon.addEventListener('click', function() {

                    document.getElementsByClassName('mysteryBoxScr_title')[0].classList.add('animation_fadeout');
                    document.getElementsByClassName('mysteryBoxScr_subtitle')[0].classList.add('animation_fadeout');

                    that.template = require('raw!../../templates/mysteryBoxCongrats.html');
                    mysteryBoxContainer.innerHTML = Mustache.render(that.template, {
                        mysterBoxReward: rewardData,
                        congratsText: rewardData.stitle
                    });

                    var congratsIcon = document.getElementsByClassName('mysteryBoxCongratsIcon')[0];

                    if (!platformSdk.bridgeEnabled)
                        rewardData.icon = "http://memecrunch.com/meme/13RGH/fudu/image.png";



                    congratsIcon.style.backgroundImage = "url('" + rewardData.icon + "')";
                    window.setTimeout(function() {
                        congratsIcon.classList.add('congratsIconAnimCls');
                    }, 700);


                    var congratsBtn = document.getElementsByClassName('congratsBtn')[0];
                    congratsBtn.addEventListener('click', function() {

                        var logDataToSend = {
                            'c': 'luckybox_gift_yes'
                        };

                        App.NinjaService.logData(logDataToSend);

                        if (rewardData.value == 'HIGH') {

                            var tid = this.getAttribute('data-tid');
                            var rewardType = this.getAttribute('data-rewardtype');
                            var rewardRouter = rewardsModel.getRewardRouter(rewardType, 'create');

                            var data = {};
                            data.rewardId = tid;

                            platformSdk.events.publish('update.loader', { show: true, text: 'Taking you to Reward' });

                            App.NinjaService.getRewardDetails(data, function(res) {
                                console.log(res.data);
                                App.router.navigateTo(rewardRouter, { 'rewardId': tid });
                            }, this);
                        } else {

                            var profileModelM = require('../models/profileModel');

                            platformSdk.events.publish('update.loader', { show: true, text: 'Taking you to Reward' });

                            App.NinjaService.getNinjaProfile(function(res) {
                                console.log('REUPDATING THE PROFILE', res.data);
                                cacheProvider.setInCritical('userProfileData', res.data);
                                var oldHash = cacheProvider.getFromCritical('oldHash');

                                if (res.data.feedback)
                                    cacheProvider.setInCritical('feedbackData', res.data.feedback);

                                var newHash = res.data.rewards_hash;
                                utils.hashCheck(oldHash, newHash);
                                if (res.data.status != 'inactive' && res.data.status != 'locked') {
                                    profileModelM.updateNinjaData(res.data, App, true);
                                }
                            }, that);
                        }
                    });
                });

            } else {

                that.template = require('raw!../../templates/mysteryBoxRetry.html');
                mysteryBoxContainer.innerHTML = Mustache.render(that.template, {
                    mysterBoxReward: rewardData,
                    previousWinner: mysteryBoxData.yesterday_winner
                });

                var ctaWinner = document.getElementsByClassName('ctaWinner')[0];
                var previousWinnerRow = document.getElementsByClassName('previousWinnerRow')[0];
                var mysteryBoxScr_title = document.getElementsByClassName('mysteryBoxScr_title')[0];
                var mysteryBoxScr_subtitle = document.getElementsByClassName('mysteryBoxScr_subtitle')[0];
                var mOverlay = document.getElementsByClassName('mOverlay')[0];

                var winnerIcon = document.getElementsByClassName('winnerIcon')[0];
                winnerIcon.style.backgroundImage = 'url(\'data:image/png;base64,' + mysteryBoxData.yesterday_winner.dp + '\')';

                ctaWinner.addEventListener('click', function() {

                    var logDataToSend = {
                        'c': 'luckybox_winner',
                        'o': 'success',
                        'fa': mysteryBoxData.yesterday_winner
                    };

                    App.NinjaService.logData(logDataToSend);

                    mOverlay.classList.remove('hideClass');
                    previousWinnerRow.classList.remove('slideDownCtaWinnerRowCls');
                    previousWinnerRow.classList.add('slideUpCtaWinnerRowCls');

                });

                mOverlay.addEventListener('click', function() {

                    mOverlay.classList.add('hideClass');
                    previousWinnerRow.classList.remove('slideUpCtaWinnerRowCls');
                    previousWinnerRow.classList.add('slideDownCtaWinnerRowCls');

                });




            }
        },

        mapRewardsToSlice: function(mysteryBoxData) {
            console.log(mysteryBoxData);
            var slices = document.getElementsByClassName('part');

            for (var i = 0; i < slices.length; i++) {
                slices[i].setAttribute('data-reward', mysteryBoxData.rewards[i].id);
            }
        },

        removeMysteryBoxToast: function() {

            if (platformSdk.bridgeEnabled) {
                var mBoxCacheData = cacheProvider.getFromCritical('ninjaMysteryBoxData');
                mBoxCacheData.mstatus = '';
                cacheProvider.setInCritical('ninjaMysteryBoxData', mBoxCacheData);
            } else {

            }

        },

        getRewardMapping: function(resultId, mysteryBoxData) {

            var slices = document.getElementsByClassName('part');

            for (var i = 0; i < slices.length; i++) {
                var result = slices[i].getAttribute('data-reward');
                if (result == resultId) {
                    var winner = slices[i].getAttribute('data-slice');
                    return winner;
                } else {
                    console.log('No reward Found');
                }
            }
        },

        defineLuckyBox: function(App, mysteryBoxData) {

            var that = this;

            var spin = document.getElementById('spin');
            var wheel = document.getElementById('wheel');

            wheel.addEventListener('transitionend', function() {
                var mysteryBoxSpinning = false;
                cacheProvider.setInCritical('mysteryBoxSpinning', mysteryBoxSpinning);

            });

            wheel.addEventListener('webkitTransitionend', function() {
                var mysteryBoxSpinning = false;
                cacheProvider.setInCritical('mysteryBoxSpinning', mysteryBoxSpinning);

            });

            var rewardData = null;
            var cooldownTime = null;

            var setText = function(a, c) {
                a.addEventListener('transitionend', function() {
                    that.defineMysteryBoxResultAnimation(App, rewardData, mysteryBoxData);
                    that.removeMysteryBoxToast();
                    a.removeEventListener('transitionend', setText);
                });
            };

            var deg = 0;
            var rotations = 0;

            spin.addEventListener('click', function() {

                var mysteryBoxSpinning = true;
                cacheProvider.setInCritical('mysteryBoxSpinning', mysteryBoxSpinning);
                utils.toggleBackNavigation(true);

                rotations++;
                if (platformSdk.bridgeEnabled) {
                    App.NinjaService.getMysteryBoxResult(function(res) {

                        var logDataToSend = {
                            'c': 'luckybox_spin_wheel',
                            'o': 'gift_received',
                            'fa': res.data.spin_result
                        };

                        App.NinjaService.logData(logDataToSend);

                        utils.toggleBackNavigation(true);
                        console.log(res.data);
                        mysteryBoxData.spin_result = res.data.spin_result;

                        // Result of Spin
                        var spinResult = that.getRewardMapping(mysteryBoxData.spin_result.id, mysteryBoxData);
                        console.log('WINNER IS', spinResult);
                        rewardData = mysteryBoxData.spin_result;

                        // Define Wheel
                        var stop = spinResult;
                        console.log('stop is', stop);
                        //var rotationFix = 360 / 16 + 360 / 8 + rotations * 720;
                        var rotationFix = 360 * 6;
                        deg = 360 / 8 * stop + rotationFix + 360 / 16;
                        var rot = 'rotate3d(0,0,1,' + deg + 'deg)';

                        wheel.style.transform = rot;
                        wheel.style.webkitTransform = rot;
                        setText(wheel, rewardData);
                    }, that);
                } else {
                    var stop = 4;
                    rewardData = {};
                    rewardData.value = 'LOW';
                    rewardData.title = 'My Sticker';
                    rewardData.stitle = 'Subtitle blah blah Subtitle blah blah Subtitle blah blah Subtitle blah blah Subtitle blah blah';
                    console.log('stop is', stop);
                    var rotationFix = 360 * 8;

                    deg = 360 / 8 * stop + rotationFix + 360 / 16;
                    var rot = 'rotate3d(0,0,1,' + deg + 'deg)';
                    wheel.style.transform = rot;
                    wheel.style.webkitTransform = rot;
                    setText(wheel, rewardData);
                }


            });

        },

        updateMysteryBoxTab: function(mysteryBoxData, App) {

            var that = this;

            var mysteryBoxContainer = document.getElementsByClassName('mysteryBoxContainer')[0]; // Gives Existing List of Rewards in the Template
            mysteryBoxContainer.innerHTML = '';

            if (mysteryBoxData.mstatus == 'active') {
                that.template = require('raw!../../templates/mysteryBoxActiveTemplate.html');
                mysteryBoxContainer.innerHTML = Mustache.render(that.template, {});
                that.mapRewardsToSlice(mysteryBoxData);
                that.defineLuckyBox(App, mysteryBoxData);
                that.defineLuckyBoxRewardIcons(mysteryBoxData.rewards);
            } else {
                console.log('Add a default state here Later');
            }
        }

    };

    module.exports = new MysteryBoxModel();
})();
