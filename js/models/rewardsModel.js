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
                                "title": "GIF Sharing",
                                "desc": "Another way of expressing inside chats.",
                                "sanctioned": false
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

            // var oldNinjaCompareRewards = cacheProvider.getFromCritical('oldNinjaCompareRewards');

            // if(typeof oldNinjaCompareRewards === 'undefined'){
            //     cacheProvider.setInCritical('oldNinjaCompareRewards', rewardsData);                 
            // }

            if (existingUser) {
                App.router.navigateTo('/home');
            }
        }

    };

    module.exports = new RewardsModel();
})();
