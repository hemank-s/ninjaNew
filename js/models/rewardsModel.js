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
        getRewardRouter: function(rewardType) {
            if (rewardType == 'sticker_reward') {
                return '/stickerReward';
            } else if (rewardType == 'exclusive_feature') {
                return '/exclusiveFeature';
            } else if (rewardType == 'user_generated_content') {
                return '/ugc';
            } else if (rewardType == 'custom_sticker') {
                return '/customSticker';
            }
        },

        showRewardStateToast: function(state) {
            if (state == Constants.REWARD_STATE.UNLOCKED) {
                console.log("The state is currently unlocked :: Can open the reward");
            } else if (state == Constants.REWARD_STATE.LOCKED) {
                utils.showToast('The reward is currently under locked state. Try again once you unlock it at a higher streak');
            } else if (state == Constants.REWARD_STATE.REDEEMED) {
                console.log("Reward already redeemed once or more.");
            } else if (state == Constants.REWARD_STATE.DISABLED) {
                utils.showToast('The reward is in disabled state, sorry for the inconvienience');
            }
        },

        updateNinjaRewardsIcons: function(data) {
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

        // Update the ninja Click Events For rewards
        updateNinjaRewardsLinks: function(App, DOMcache) {

            var that = this;

            var openRewards = DOMcache.unlockedRewardListItem;

            if (openRewards.length) {
                for (var i = 0; i < openRewards.length; i++) {
                    openRewards[i].addEventListener('click', function(event) {

                        // Get Reward related information
                        var rewardState = this.getAttribute('data-state');
                        var rewardType = this.getAttribute('data-rewardtype');
                        var rewardRouter = that.getRewardRouter(rewardType);
                        var rewardId = this.getAttribute('data-rewardId');

                        var data = {};
                        data.rewardId = rewardId;

                        if (platformSdk.bridgeEnabled) {
                            App.NinjaService.getRewardDetails(data, function(res) {
                                console.log(res.data);
                                App.router.navigateTo(rewardRouter, { "rewardDetails": res.data, "rewardId": rewardId, "rewardRouter": rewardRouter });
                            }, this);
                        } else {
                            var res = {
                                "hicon": "",
                                "title": "Early Access Stickers",
                                "desc": "Get all the hike stickers before anyone else on hike. Ninja mode on!",
                                "cooldown": 123,
                                "packs": [{
                                    "catId": "bengalibabu",
                                    "copyright": "Copyright \u00a92016 Hike Limited",
                                    "desc": "Check out these funny Bong Babu stickers!",
                                    "name": "Bong Babu",
                                    "new": 1,
                                    "nos": 30,
                                    "size": 864090,
                                    "status": "notdownloaded",
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
                                    "status": "notdownloaded",
                                    "act_stickers": [
                                        "030_benbabu_humkiptenahihai.png",
                                        "029_benbabu_matlab.png",
                                        "028_benbabu_bahutburahua.png",
                                        "027_benbabu_sobshottihai.png",
                                        "026_benbabu_kisikobolnamat.png"
                                    ]
                                }]

                            };
                            App.router.navigateTo(rewardRouter, { "rewardDetails": res, "rewardId": rewardId, "rewardRouter": rewardRouter });
                        }
                    });
                }
            }
        },

        // Update Ninja Rewards HTML
        updateNinjaRewards: function(rewardsData, App, existingUser) {

            console.log('Updating the Ninja Rewards Old By New Ninja Rewards');
            console.log(rewardsData);

            cacheProvider.setInCritical('ninjaRewards', rewardsData);

            var adhocReward = cacheProvider.getFromCritical('adhocRewardForUser');

            if (adhocReward) {
                for (var i = 0; i < adhocReward.length; i++) {
                    rewardsData.rewards.push(adhocReward[i]);
                }
            }

            cacheProvider.setInCritical('adhocRewardForUser', adhocReward);

            // A/B Testing Wrap for Locked Greyed out rewards

            // ninjaRewardsListOld.innerHTML = Mustache.render(this.template, {
            //     ninjaRewardsCollection: (typeof rewardsData === 'undefined' ? {} : rewardsData.rewards),
            //     lockedGreyout: cacheProvider.getFromCritical('lockedGreyout')
            // });

            if (existingUser) {
                App.router.navigateTo('/home');
            }

            // this.updateNinjaRewardsLinks(App);
            // this.updateNinjaRewardsIcons(rewardsData.rewards);
        }

    };

    module.exports = new RewardsModel();
})();
