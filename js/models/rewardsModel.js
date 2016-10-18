/*jshint loopfunc: true */

/**
 * Created by hemanksabharwal on 17/05/15.
 */

(function() {
    'use strict';

    var platformSdk = require('../../libs/js/platformSdk_v2.0'),
        utils = require('../util/utils'),
        cacheProvider = require('../util/cacheProvider'),
        Constants = require('../../constants.js'),

        RewardsModel = function() {},

        EMPTY_OBJ_READ_ONLY = {};

    RewardsModel.prototype = {

        // Get Reward Router Associated To Type Of Reward
        getRewardRouter: function(rewardType, src, data) {
            if (rewardType == 'sticker_reward') {
                return '/stickerReward';
            } else if (rewardType == 'exclusive_feature') {
                return '/exclusiveFeature';
            } else if (rewardType == 'user_generated_content') {
                return '/ugc';
            } else if (rewardType == 'custom_sticker') {

                if (src == "create")
                    return "/customCreate";
                else if (typeof data === "undefined")
                    return "/customCreate";
                else if (data.custom_stickers.length > 0)
                    return "/customHistory";
                else if (data.eligible === true)
                    return "/customCreate";
            }
        },

        updateNinjaRewardsIcons: function(dat) {
            var that = this;

            var allRewards = document.getElementsByClassName('rewardRow');

            if (allRewards.length) {
                console.log(allRewards);
                for (var i = 0; i < allRewards.length; i++) {
                    var icon = allRewards[i].getElementsByClassName('rewardIcon')[0];
                    icon.style.backgroundImage = 'url(\'' + data[i].icon + '\')';
                }
            }
        },

        mapColorToReward: function(color, rid) {

            var c = utils.rgba2hex(color);

            var rewardColorMapping = cacheProvider.getFromCritical('rewardColorMapping');
            if (!rewardColorMapping) {
                rewardColorMapping = {};
                rewardColorMapping[rid] = c;
            } else {
                rewardColorMapping[rid] = c;
            }

            cacheProvider.setInCritical('rewardColorMapping', rewardColorMapping);

        },

        // Update the ninja Click Events For rewards
        updateNinjaRewardsLinks: function(App, DOMcache, profileData) {

            var that = this;

            var openRewards = DOMcache.unlockedRewardListItem;

            if (openRewards.length) {
                for (var i = 0; i < openRewards.length; i++) {
                    openRewards[i].addEventListener('click', function(event) {
                        var cardButton = this.getElementsByClassName('unlockedRewardAction')[0];
                        platformSdk.events.publish('update.threeDotLoader', { elem: cardButton, show: true, text: 'Unwrapping' });

                        // Get Reward related information
                        var rewardState = this.getAttribute('data-state');
                        var rewardType = this.getAttribute('data-rewardtype');
                        var rewardRouter = that.getRewardRouter(rewardType, 'create');
                        var rewardId = this.getAttribute('data-rewardId');
                        var isRewardAdhoc = this.getAttribute('data-adhoc');

                        if (isRewardAdhoc) {
                            cacheProvider.setInCritical('adhocRewardForUser', null);
                        }

                        var cardColor = window.getComputedStyle(this).backgroundColor;
                        that.mapColorToReward(cardColor, rewardId);

                        if (rewardState == Constants.REWARD_STATE.LOCKED) {
                            DOMcache.batteryStreakInfoContainer.classList.remove('hideClass');
                            var batteryIconContainer = document.getElementsByClassName('batteryIconContainer')[0];
                            batteryIconContainer.innerHTML = "";

                            if (!platformSdk.bridgeEnabled) {
                                profileData = { "battery": 2, "maxBattery": 7, "hike_version": "4.2.2.2", "rewards_hash": "1474970960", "status": "active", "streak": 10 };
                            }

                            for (var i = 1; i <= profileData.battery; i++) {
                                var iDiv = document.createElement('div');
                                iDiv.className = 'batteryIconFilled';
                                batteryIconContainer.appendChild(iDiv);
                            }

                            for (var j = 1; j <= (profileData.maxBattery - profileData.battery); j++) {
                                var jDiv = document.createElement('div');
                                jDiv.className = 'batteryIconEmpty';
                                batteryIconContainer.appendChild(jDiv);
                            }
                            return;
                        }

                        var data = {};
                        data.rewardId = rewardId;

                        if (platformSdk.bridgeEnabled) {
                            App.NinjaService.getRewardDetails(data, function(res) {
                                console.log(res.data);
                                App.router.navigateTo(rewardRouter, { "rewardDetails": res.data, "rewardId": rewardId, "rewardRouter": rewardRouter, "cardColor": cardColor });
                            }, this);
                        } else {
                            var res = {
                                "hicon": "",
                                "title": "Early Access Stickers",
                                "cooldown": 146,
                                "desc": "Get all the hike sticker 2 weeks before everyone else does. Enjoy the benefit to the fullest.",
                                "packs": [{
                                    "catId": "bengalibabu",
                                    "copyright": "Copyright \u00a92016 Hike Limited",
                                    "desc": "Check out these funny Bong Babu stickers!",
                                    "name": "Bong Babu",
                                    "new": 1,
                                    "nos": 30,
                                    "size": 864090,
                                    "status": "downloaded",
                                    "act_stickers": [
                                        "030_benbabu_humkiptenahihai.png",
                                        "029_benbabu_matlab.png",
                                        "028_benbabu_bahutburahua.png",
                                        "027_benbabu_sobshottihai.png",
                                        "026_benbabu_kisikobolnamat.png"
                                    ]
                                }, {
                                    "catId": "bengalibabu",
                                    "copyright": "Copyright \u00a92016 Hike Limited",
                                    "desc": "Check out these funny Bong Babu stickers!",
                                    "name": "Bong Babu",
                                    "new": 1,
                                    "nos": 30,
                                    "size": 864090,
                                    "status": "downloaded",
                                    "act_stickers": [
                                        "030_benbabu_humkiptenahihai.png",
                                        "029_benbabu_matlab.png",
                                        "028_benbabu_bahutburahua.png",
                                        "027_benbabu_sobshottihai.png",
                                        "026_benbabu_kisikobolnamat.png"
                                    ]
                                }]

                            };
                            App.router.navigateTo(rewardRouter, { "rewardDetails": res, "rewardId": rewardId, "rewardRouter": rewardRouter, "cardColor": cardColor });
                        }
                    });
                }
            }
        },


        rewardsCompare: function(oldR, newR) {

            var oldRewards = oldR.rewards;
            var newRewards = newR.rewards;
            var temp, setAnim = false;

            for (var key in newRewards) {

                if (newRewards[key].state == Constants.REWARD_STATE.UNLOCKED) {

                    temp = oldRewards.filter(function(obj) {
                        return obj.id === newRewards[key].id && obj.state == Constants.REWARD_STATE.UNLOCKED;
                    })[0];

                    if (typeof temp === 'undefined') {
                        setAnim = true;
                        break;
                    }
                }
            }

            console.log("SET ANIM IS", setAnim);
            cacheProvider.setInCritical('showRewardAnimation', setAnim);

        },

        // Update Ninja Rewards HTML
        updateNinjaRewards: function(rewardsData, App, existingUser) {

            var that = this;

            console.log('Updating the Ninja Rewards Old By New Ninja Rewards');
            console.log(rewardsData);

            cacheProvider.setInCritical('ninjaRewards', rewardsData);

            var oldRewards = cacheProvider.getFromCritical('oldNinjaRewards');

            if (typeof oldRewards == "undefined") {
                cacheProvider.setInCritical('showRewardAnimation', true);
            } else {
                that.rewardsCompare(oldRewards, rewardsData);
            }
            cacheProvider.setInCritical('oldNinjaRewards', rewardsData);

            // var adhocReward = cacheProvider.getFromCritical('adhocRewardForUser');

            // if (adhocReward) {
            //     for (var i = 0; i < adhocReward.length; i++) {
            //         adhocReward[i].adhoc = true;
            //         rewardsData.rewards.push(adhocReward[i]);
            //     }
            // }

            //cacheProvider.setInCritical('adhocRewardForUser', adhocReward);

            if (existingUser) {
                App.router.navigateTo('/home');
            }
        }

    };

    module.exports = new RewardsModel();
})();
