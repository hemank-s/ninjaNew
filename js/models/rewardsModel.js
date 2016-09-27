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

        updateNinjaRewardsIcons: function(data){
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
        updateNinjaRewardsLinks: function(App) {

            var that = this;

            var allRewards = document.getElementsByClassName('rewardRow');

            if (allRewards.length) {
                console.log(allRewards);
                for (var i = 0; i < allRewards.length; i++) {
                    allRewards[i].addEventListener('click', function(event) {

                        // Get Reward related information
                        var rewardState = this.getAttribute('data-state');

                        if (rewardState == Constants.REWARD_STATE.LOCKED) {
                            that.showRewardStateToast(rewardState);
                            return;
                        } else if (rewardState == Constants.REWARD_STATE.DISABLED) {
                            that.showRewardStateToast(rewardState);
                            return;
                        }

                        var rewardType = this.getAttribute('data-rewardtype');
                        var rewardRouter = that.getRewardRouter(rewardType);
                        var rewardId = this.getAttribute('data-rewardId');

                        var data = {};
                        data.rewardId = rewardId;

                        // STUB TO REMOVE 

                        // var GifRes = {'desc':"Now express your feelings with animated GIFs",'hicon':"https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/GIFSharingHeader.png",'title': 'Animated GIF'};
                        // App.router.navigateTo(rewardRouter,{ "rewardDetails": GifRes , "rewardId" :rewardId, "rewardRouter":rewardRouter} );

                        // STUB TO REMOVE

                        // Reward Details API :: Send Reward Id As well
                        App.NinjaService.getRewardDetails(data, function(res) {
                            console.log(res.data);
                             App.router.navigateTo(rewardRouter,{ "rewardDetails": res.data , "rewardId" :rewardId, "rewardRouter":rewardRouter} );
                        }, this);
                    });
                }
            }
        },

        // Update Ninja Rewards HTML
        updateNinjaRewards: function(rewardsData, App) {

            console.log('Updating the Ninja Rewards Old By New Ninja Rewards');
            console.log(rewardsData);

            // update helper data with new rewards

            cacheProvider.setInCritical('ninjaRewards', rewardsData);
            console.log("helper data is", platformSdk.appData.helperData);

            var ninjaRewardsListOld = document.getElementsByClassName('rewardsContainer')[0]; // Gives Existing List of Rewards in the Template
            ninjaRewardsListOld.innerHTML = '';

            // Re Render The Reward Template Only From External HTML
            this.template = require('raw!../../templates/newRewardTemplate.html');

            // To remove later for adhoc

            var adhocReward = cacheProvider.getFromCritical('adhocRewardForUser');

            if(adhocReward){
                for(var i = 0; i<adhocReward.length; i++){
                    rewardsData.rewards.push(adhocReward[i]);
                    //adhocReward.splice(i,1);
                }
            }
            
            cacheProvider.setInCritical('adhocRewardForUser',adhocReward);

            ninjaRewardsListOld.innerHTML = Mustache.render(this.template, {
                ninjaRewardsCollection: (typeof rewardsData === 'undefined'? {} : rewardsData.rewards),
                lockedGreyout : cacheProvider.getFromCritical('lockedGreyout')
            });

            this.updateNinjaRewardsLinks(App);
            this.updateNinjaRewardsIcons(rewardsData.rewards);
        }

    };

    module.exports = new RewardsModel();
})();