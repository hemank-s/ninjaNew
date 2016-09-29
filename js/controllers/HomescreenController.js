(function(W, platformSdk, events) {
    'use strict';

    var utils = require('../util/utils'),
        Constants = require('../../constants.js'),
        cacheProvider = require('../util/cacheProvider'),

        HomescreenController = function(options) {
            this.template = require('raw!../../templates/ninjaHomeScreen.html');
        };

    HomescreenController.prototype.newRewardUnlockAnimation = function(DOMcache) {
        // Run Basic Reward Animation
        DOMcache.rewardUnlockAnimation.classList.add('newRewardAnimOpacity');
        DOMcache.streakValueContainer.classList.add('newRewardDayScale');

    };

    HomescreenController.prototype.bind = function(App, data) {

        var that = this;

        var DOMcache = {
            unlockedReward: document.getElementsByClassName('unlockedReward')[0],
            lockedRewards: document.getElementsByClassName('lockedRewards')[0],
            unlockedRewardListContainer: document.getElementsByClassName('unlockedRewardListContainer')[0],
            unlockedRewardHeading: document.getElementsByClassName('unlockedRewardHeading')[0],
            rewardUnlockAnimation: document.getElementsByClassName('rewardUnlockAnimation')[0],
            streakValueContainer: document.getElementsByClassName('streakValueContainer')[0],
            rewardUnlockContainer: document.getElementsByClassName('rewardUnlockContainer')[0],
            streakContainer: document.getElementsByClassName('streakContainer')[0],
            batteryStreakInfoContainer: document.getElementsByClassName('batteryStreakInfoContainer')[0],
            informationAction: document.getElementsByClassName('informationAction')[0],
        };

        that.newRewardUnlockAnimation(DOMcache);

        DOMcache.streakContainer.addEventListener('click', function(event) {
            DOMcache.unlockedRewardListContainer.classList.remove('unlockedRewardListUl');
            DOMcache.batteryStreakInfoContainer.classList.remove('hideClass');
        });

        DOMcache.informationAction.addEventListener('click', function(event) {
            DOMcache.batteryStreakInfoContainer.classList.add('hideClass');
        });

        DOMcache.streakValueContainer.addEventListener('click', function(event) {
            DOMcache.rewardUnlockAnimation.style.opacity = 1;
            DOMcache.rewardUnlockAnimation.classList.add('newRewardBgRemove');
            DOMcache.rewardUnlockContainer.classList.add('newStreakAnimation');
            DOMcache.lockedRewards.classList.add('moveLockedRewardsAnimation');
            DOMcache.unlockedRewardListContainer.classList.add('unlockedRewardListUl');
        });

        DOMcache.lockedRewards.addEventListener('webkitAnimationEnd', function() {
            DOMcache.unlockedReward.classList.remove('hideClass');
            DOMcache.lockedRewards.classList.remove('moveLockedRewardsAnimation');

        });

        DOMcache.lockedRewards.addEventListener('animationend', function() {
            DOMcache.unlockedReward.classList.remove('hideClass');
            DOMcache.lockedRewards.classList.remove('moveLockedRewardsAnimation');
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
        // 3 -> Failed
        // 4 -> Expired

        for (var i = 0; i < rewards.length; i++) {
            console.log(typeof(rewards[i].state));
            console.log(Constants.REWARD_STATE);
            if (rewards[i].state === Constants.REWARD_STATE.LOCKED) {
                filteredRewards.lockedRewards.push(rewards[i]);
            } else if (rewards[i].state === Constants.REWARD_STATE.UNLOCKED) {
                filteredRewards.unlockedRewards.push(rewards[i]);
            } else if (rewards[i].state === Constants.REWARD_STATE.INPROGRESS) {
                filteredRewards.redeemedRewards.push(rewards[i]);
            } else if (rewards[i].state === Constants.REWARD_STATE.FAILED) {
                filteredRewards.failedRewards.push(rewards[i]);
            } else if (rewards[i].state === Constants.REWARD_STATE.EXPIRED) {
                filteredRewards.expiredRewards.push(rewards[i]);
            }
        }

        return filteredRewards;

    };

    HomescreenController.prototype.render = function(ctr, App, data) {

        var that = this;
        var rewardsData = {};


        var profile_data = cacheProvider.getFromCritical('userProfileData');
        var rewards_data = cacheProvider.getFromCritical('ninjaRewards');

        // if (utils.upgradeRequired(profile_data.data.hike_version, platformSdk.appData.appVersion)) {
        //     App.router.navigateTo('/upgrade');
        // } else if (profile_data.data.status == 'inactive' || profile_data.data.status == 'locked') {
        //     App.router.navigateTo('/userState', profile_data.data);
        // } else {
        //     rewardsData = that.filterRewards(rewards_data.rewards);
        // }

        data = { "rewards": [{ "desc": "Get the best stickers on hike way before everyone else does. You get these 2 weeks before mere mortals. You're a Ninja!", "hicon": "https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/secretStickerShopIllustration.png", "icon": "https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/early_access_sticker_icon.png", "id": "57b56ec17e401ddfe70a9e8f", "state": 0, "stitle": "Get all the hike stickers before everyone else.", "streak": 1, "title": "Early Access Stickers", "type": "sticker_reward", "value": null }, { "icon": "https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/GIFSharingHeader.png", "id": "57cfce41733265431b98b317", "state": 1, "stitle": "Get the exclusive GIF feature.", "streak": 15, "title": "Exclusive Gif", "type": "exclusive_feature", "value": null }, { "failed_preview_img": "https://staging.im.hike.in/sticker?catId=mumbai&stId=023_mb_badey.png&resId=XHDPI&image=True", "icon": "https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/custom_sticker_icon.png", "id": "57c554417332654291dc1097", "state": 0, "stitle": "Have an exclusive sticker made just for you", "streak": 7, "title": "My Sticker", "type": "custom_sticker", "value": null }, { "desc": "Share animated stickers with your friends and get krazzy", "hicon": "https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/animatedStickers.png", "icon": "https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/animatedStickers.png", "id": "58c563ce7332657fe8d3ca69", "state": 1, "stitle": "Experience the new animated before anyone else", "streak": 0, "title": "Animated Stickers", "type": "exclusive_feature", "value": null }, { "desc": "Share animated stickers with your friends and get krazzy", "hicon": "https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/animatedStickers.png", "icon": "https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/animatedStickers.png", "id": "58c563ce7332657fe8d3ca69", "state": 1, "stitle": "Experience the new animated before anyone else", "streak": 0, "title": "Animated Stickers", "type": "exclusive_feature", "value": null }, { "desc": "Share animated stickers with your friends and get krazzy", "hicon": "https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/animatedStickers.png", "icon": "https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/animatedStickers.png", "id": "58c563ce7332657fe8d3ca69", "state": 1, "stitle": "Experience the new animated before anyone else", "streak": 0, "title": "Animated Stickers", "type": "exclusive_feature", "value": null }, { "desc": "Share animated stickers with your friends and get krazzy", "hicon": "https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/animatedStickers.png", "icon": "https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/animatedStickers.png", "id": "58c563ce7332657fe8d3ca69", "state": 1, "stitle": "Experience the new animated before anyone else", "streak": 0, "title": "Animated Stickers", "type": "exclusive_feature", "value": null }, { "desc": "Share animated stickers with your friends and get krazzy", "hicon": "https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/animatedStickers.png", "icon": "https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/animatedStickers.png", "id": "58c563ce7332657fe8d3ca69", "state": 1, "stitle": "Experience the new animated before anyone else", "streak": 0, "title": "Animated Stickers", "type": "exclusive_feature", "value": null }], "rewards_hash": "1474970960" };
        if (!platformSdk.bridgeEnabled) {
            profile_data = { "battery": 7, "hike_version": "4.2.2.2", "rewards_hash": "1474970960", "status": "active", "streak": 10 };
        }

        rewardsData = that.filterRewards(data.rewards);
        console.log(rewardsData);

        if (rewardsData.unlockedRewards.length === 0) {
            rewardsData.unlockedRewards.push(rewardsData.lockedRewards[0]);
        }

        that.el = document.createElement('div');
        that.el.className = 'homeScreenContainer animation_fadein noselect';
        that.el.innerHTML = Mustache.render(unescape(that.template), { ninjaProfile: profile_data, ninjaUnlockedRewards: rewardsData.unlockedRewards, ninjaLockedRewards: rewardsData.lockedRewards });
        ctr.appendChild(that.el);
        events.publish('update.loader', { show: false });
        that.bind(App, rewardsData);
    };

    HomescreenController.prototype.destroy = function() {

    };

    module.exports = HomescreenController;

})(window, platformSdk, platformSdk.events);
