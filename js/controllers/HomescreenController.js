/*jshint loopfunc: true */

(function(W, platformSdk, events) {
    'use strict';

    var utils = require('../util/utils'),
        Constants = require('../../constants.js'),
        cacheProvider = require('../util/cacheProvider'),
        activityModel = require('../models/activityModel'),
        ugcModel = require('../models/activityModel'),

        HomescreenController = function(options) {
            this.template = require('raw!../../templates/ninjaHomeScreen.html');
        };

    HomescreenController.prototype.newRewardUnlockAnimation = function(DOMcache) {
        // Run Basic Reward Animation
        DOMcache.rewardUnlockAnimation.classList.add('newRewardAnimOpacity');
        DOMcache.streakValueContainer.classList.add('newRewardDayScale');
    };

    HomescreenController.prototype.bind = function(App, data, showNewRewardAnimation) {

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
            unlockedRewardListItem: document.getElementsByClassName('unlockedRewardListItem'),
            lockedRewardListItem: document.getElementsByClassName('lockedRewardListItem'),
            ninjaDp: document.getElementsByClassName('ninjaDp')[0]
        };
        if(showNewRewardAnimation){
            that.newRewardUnlockAnimation(DOMcache);    
        }else{
            DOMcache.unlockedRewardHeading.innerHTML = 'Next Gift';
            DOMcache.unlockedReward.classList.remove('hideClass');
            DOMcache.unlockedRewardListContainer.classList.add('unlockedRewardListUl');
            DOMcache.rewardUnlockAnimation.classList.add('hideClass');
        }
        
        DOMcache.streakContainer.addEventListener('click', function(event) {
            //DOMcache.unlockedRewardListContainer.classList.remove('unlockedRewardListUl');
            DOMcache.batteryStreakInfoContainer.classList.remove('hideClass');
        });

        DOMcache.ninjaDp.addEventListener('click', function(event) {
            App.router.navigateTo('/profile', { rewardsData: data });
        });

        DOMcache.batteryStreakInfoContainer.addEventListener('click', function(event) {
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
            DOMcache.rewardUnlockAnimation.classList.add('hideClass');
        });

        DOMcache.lockedRewards.addEventListener('animationend', function() {
            DOMcache.unlockedReward.classList.remove('hideClass');
            DOMcache.lockedRewards.classList.remove('moveLockedRewardsAnimation');
            DOMcache.rewardUnlockAnimation.classList.add('hideClass');
        });

        // Reward Links :: Unlocked Rewards
        if (DOMcache.unlockedRewardListItem.length) {
            for (var i = 0; i < DOMcache.unlockedRewardListItem.length; i++) {
                DOMcache.unlockedRewardListItem[i].addEventListener('click', function(event) {
                    events.publish('update.notif.toast', { show: true, text: 'Unlocked reward has been clicked' });
                    console.log("unlocked reward clicked");
                });
            }
        }

        // Rewards Link :: Locked Rewards
        if (DOMcache.lockedRewardListItem.length) {
            for (var j = 0; j < DOMcache.lockedRewardListItem.length; j++) {
                DOMcache.lockedRewardListItem[j].addEventListener('click', function(event) {
                    events.publish('update.notif.toast', { show: true, text: 'Locked reward has been clicked' });
                });
            }
        } else {
            console.log("Empty illustrations here");
        }

        updateIcons(DOMcache,data);

    };

    // Filter Rewards Based on category of reward
    HomescreenController.prototype.filterRewards = function(rewards) {

        var filteredRewards = {};

        filteredRewards.unlockedRewards = [];
        filteredRewards.lockedRewards = [];
        filteredRewards.redeemedRewards = [];
        filteredRewards.expiredRewards = [];

        for (var i = 0; i < rewards.length; i++) {
            if (rewards[i].state === Constants.REWARD_STATE.LOCKED) {
                filteredRewards.lockedRewards.push(rewards[i]);
            } else if (rewards[i].state === Constants.REWARD_STATE.UNLOCKED) {
                filteredRewards.unlockedRewards.push(rewards[i]);
            } else if (rewards[i].state === Constants.REWARD_STATE.REDEEMED) {
                filteredRewards.redeemedRewards.push(rewards[i]);
            } else if (rewards[i].state === Constants.REWARD_STATE.FAILED) {
                filteredRewards.failedRewards.push(rewards[i]);
            } else if (rewards[i].state === Constants.REWARD_STATE.EXPIRED) {
                filteredRewards.expiredRewards.push(rewards[i]);
            }
        }
        return filteredRewards;
    };

    HomescreenController.prototype.updateIcons = function(DOMcache, data) {

        // UGC ICONS
        for(var i= 0;i<data.unlockedRewards.length;i++){
            if(data.ugc[i].icon){
                DOMcache.unlockedRewardListItem[i].getElementsByClassName('unlockedRewardIcon')[0].style.backgroundImage = "url('" + data.unlockedRewards[i].icon + "')";
            }else{
                console.log("Set a default icon for ugc");
            }
        }

        // REWARD ICONS
        for(var j=0;j<data.lockedRewards.length.length;j++){
            if(data.ugc[i].icon){
                DOMcache.lockedRewardListItem[i].getElementsByClassName('rewardIcon')[0].style.backgroundImage = "url('" + data.lockedRewards[i].icon + "')";
            }else{
                console.log("Set a default icon for rewards");
            }
        }
    };

    HomescreenController.prototype.render = function(ctr, App, data) {

        var that = this;
        var rewardsData = {};
        var showNewRewardAnimation = true;

        // Get Data From Cache Always :: Cache updated in all cases before rendering data
        var profile_data = cacheProvider.getFromCritical('userProfileData');
        var rewards_data = cacheProvider.getFromCritical('ninjaRewards');

        if (platformSdk.bridgeEnabled) {
            if (utils.upgradeRequired(profile_data.hike_version, platformSdk.appData.appVersion)) {
                // App.router.navigateTo('/upgrade');
            } else if (profile_data.status == 'inactive' || profile_data.status == 'locked') {
                // App.router.navigateTo('/userState', profile_data.data);
            } else {
                rewardsData = that.filterRewards(rewards_data.rewards);
            }
        }
        // Stub 
        if (!platformSdk.bridgeEnabled) {
            data = {"rewards":[{"desc":"Get the best stickers on hike way before everyone else does. You get these 2 weeks before mere mortals. You're a Ninja!","hicon":"https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/secretStickerShopIllustration.png","icon":"https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/early_access_sticker_icon.png","id":"57b56ec17e401ddfe70a9e8f","state":1,"stitle":"Get all the hike stickers before everyone else.","streak":1,"title":"Early Access Stickers","type":"sticker_reward","value":null},{"icon":"https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/GIFSharingHeader.png","id":"57cfce41733265431b98b317","state":0,"stitle":"Get the exclusive GIF feature.","streak":15,"title":"Exclusive Gif","type":"exclusive_feature","value":null},{"failed_preview_img":"https://staging.im.hike.in/sticker?catId=mumbai&stId=023_mb_badey.png&resId=XHDPI&image=True","icon":"https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/custom_sticker_icon.png","id":"57c554417332654291dc1097","state":0,"stitle":"Have an exclusive sticker made just for you","streak":7,"title":"My Sticker","type":"custom_sticker","value":null},{"desc":"Share animated stickers with your friends and get krazzy","hicon":"https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/animatedStickers.png","icon":"https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/animatedStickers.png","id":"58c563ce7332657fe8d3ca69","state":3,"stitle":"Experience the new animated before anyone else","streak":0,"title":"Animated Stickers","type":"exclusive_feature","value":null},{"desc":"Share animated stickers with your friends and get krazzy","hicon":"https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/animatedStickers.png","icon":"https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/animatedStickers.png","id":"58c563ce7332657fe8d3ca69","state":3,"stitle":"Experience the new animated before anyone else","streak":0,"title":"Animated Stickers","type":"exclusive_feature","value":null},{"desc":"Share animated stickers with your friends and get krazzy","hicon":"https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/animatedStickers.png","icon":"https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/animatedStickers.png","id":"58c563ce7332657fe8d3ca69","state":3,"stitle":"Experience the new animated before anyone else","streak":0,"title":"Animated Stickers","type":"exclusive_feature","value":null},{"desc":"Share animated stickers with your friends and get krazzy","hicon":"https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/animatedStickers.png","icon":"https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/animatedStickers.png","id":"58c563ce7332657fe8d3ca69","state":0,"stitle":"Experience the new animated before anyone else","streak":0,"title":"Animated Stickers","type":"exclusive_feature","value":null},{"desc":"Share animated stickers with your friends and get krazzy","hicon":"https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/animatedStickers.png","icon":"https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/animatedStickers.png","id":"58c563ce7332657fe8d3ca69","state":0,"stitle":"Experience the new animated before anyone else","streak":0,"title":"Animated Stickers","type":"exclusive_feature","value":null}],"rewards_hash":"1474970960"};
            profile_data = { "battery": 7, "hike_version": "4.2.2.2", "rewards_hash": "1474970960", "status": "active", "streak": 10 };
            rewardsData = that.filterRewards(data.rewards);
        }

        // For No Unlocked Rewards :: Show First locked reward
        if (rewardsData.unlockedRewards.length === 0) {
            showNewRewardAnimation = false;
            rewardsData.unlockedRewards.push(rewardsData.lockedRewards[0]);
        }

        that.el = document.createElement('div');
        that.el.className = 'homeScreenContainer animation_fadein noselect';
        that.el.innerHTML = Mustache.render(unescape(that.template), { ninjaProfile: profile_data, ninjaUnlockedRewards: rewardsData.unlockedRewards, ninjaLockedRewards: rewardsData.lockedRewards });
        ctr.appendChild(that.el);
        events.publish('update.loader', { show: false });
        that.bind(App, rewardsData , showNewRewardAnimation);
    };

    HomescreenController.prototype.destroy = function() {

    };

    module.exports = HomescreenController;

})(window, platformSdk, platformSdk.events);
