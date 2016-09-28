(function(W, platformSdk, events) {
    'use strict';

    var utils = require('../util/utils'),
        Constants = require('../../constants.js'),

        HomescreenController = function(options) {
            this.template = require('raw!../../templates/ninjaHomeScreen.html');
        };

    HomescreenController.prototype.bind = function(App, data) {

        // Unlocked Reward Container
        var unlockedReward = document.getElementsByClassName('unlockedReward')[0];

        // Unlocked Reward Heading
        var unlockedRewardHeading = document.getElementsByClassName('unlockedRewardHeading')[0];
        
        // New Reward Unlock Overlay
        var rewardUnlockAnimation = document.getElementsByClassName('rewardUnlockAnimation')[0];
        var streakValueContainer = document.getElementsByClassName('streakValueContainer')[0];
        var rewardUnlockContainer = document.getElementsByClassName('rewardUnlockContainer')[0];

        if(data.unlockedRewards.length > 0){
            console.log(data.unlockedRewards);
            rewardUnlockAnimation.classList.add('newRewardAnimOpacity');
            streakValueContainer.classList.add('newRewardDayScale');
        }else {
            console.log("No new rewards are present :: Pick first from locked and make a card");
            console.log(data.unlockedRewards);
        }

        streakValueContainer.addEventListener('click', function(event) {
            rewardUnlockAnimation.style.opacity = 1;
            rewardUnlockAnimation.classList.add('newRewardBgRemove');
            rewardUnlockContainer.classList.add('newStreakAnimation');
        });
    };

    HomescreenController.prototype.filterRewards = function(rewards) {

        var filteredRewards = {};
        filteredRewards.unlockedRewards = [];
        filteredRewards.lockedRewards = [];
        filteredRewards.redeemedRewards = [];
        filteredRewards.expiredRewards = [];

        // 0 -> Locked
        // 1-> Unlocked
        // 2 -> Redeemed
        // 3 -> Expired
        
        for (var i = 0; i < rewards.length; i++) {
            if(rewards[i].state === 0){
                filteredRewards.lockedRewards.push(rewards[i]);
            }else if (rewards[i].state === 1){
                filteredRewards.unlockedRewards.push(rewards[i]);
            }else if (rewards[i].state === 2){
                filteredRewards.redeemedRewards.push(rewards[i]); 
            }else if (rewards[i].state === 3){
                filteredRewards.expiredRewards.push(rewards[i]);
            }
        }

        return filteredRewards;

    };

    HomescreenController.prototype.render = function(ctr, App, data) {

        var that = this;
        var rewardsData = {};

        data = {"rewards":[{"desc":"Get the best stickers on hike way before everyone else does. You get these 2 weeks before mere mortals. You're a Ninja!","hicon":"https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/secretStickerShopIllustration.png","icon":"https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/early_access_sticker_icon.png","id":"57b56ec17e401ddfe70a9e8f","state":3,"stitle":"Get all the hike stickers before everyone else.","streak":1,"title":"Early Access Stickers","type":"sticker_reward","value":null},{"icon":"https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/GIFSharingHeader.png","id":"57cfce41733265431b98b317","state":1,"stitle":"Get the exclusive GIF feature.","streak":15,"title":"Exclusive Gif","type":"exclusive_feature","value":null},{"failed_preview_img":"https://staging.im.hike.in/sticker?catId=mumbai&stId=023_mb_badey.png&resId=XHDPI&image=True","icon":"https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/custom_sticker_icon.png","id":"57c554417332654291dc1097","state":1,"stitle":"Have an exclusive sticker made just for you","streak":7,"title":"My Sticker","type":"custom_sticker","value":null},{"desc":"Share animated stickers with your friends and get krazzy","hicon":"https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/animatedStickers.png","icon":"https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/animatedStickers.png","id":"58c563ce7332657fe8d3ca69","state":3,"stitle":"Experience the new animated before anyone else","streak":0,"title":"Animated Stickers","type":"exclusive_feature","value":null}],"rewards_hash":"1474970960"};

        rewardsData = that.filterRewards(data.rewards);
        console.log(rewardsData);

        that.el = document.createElement('div');
        that.el.className = 'homeScreenContainer animation_fadein noselect';
        that.el.innerHTML = Mustache.render(unescape(that.template), {ninjaUnlockedRewards:data.rewards,ninjaLockedRewards:data.rewards});
        ctr.appendChild(that.el);
        events.publish('update.loader', { show: false });
        that.bind(App, rewardsData);
    };

    HomescreenController.prototype.destroy = function() {

    };

    module.exports = HomescreenController;

})(window, platformSdk, platformSdk.events);