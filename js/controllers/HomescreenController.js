/*jshint loopfunc: true */

(function(W, platformSdk, events) {
    'use strict';

    var utils = require('../util/utils'),
        Constants = require('../../constants.js'),
        cacheProvider = require('../util/cacheProvider'),
        activityModel = require('../models/activityModel'),
        rewardsModel = require('../models/rewardsModel'),
        ugcModel = require('../models/activityModel'),

        HomescreenController = function(options) {
            this.template = require('raw!../../templates/ninjaHomeScreen.html');
        };

    HomescreenController.prototype.newRewardUnlockAnimation = function(DOMcache) {
        // Run Basic Reward Animation
        DOMcache.rewardUnlockAnimation.classList.add('newRewardAnimOpacity');
        DOMcache.streakValueContainer.classList.add('newRewardDayScale');
    };

    HomescreenController.prototype.createBatteryUi = function(DOMcache, profileData) {

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
    };

    HomescreenController.prototype.bind = function(App, data, showNewRewardAnimation) {

        var that = this;

        var mysteryBoxData = cacheProvider.getFromCritical('ninjaMysteryBoxData');
        var profileData = cacheProvider.getFromCritical('ninjaProfileData');

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
            ninjaDp: document.getElementsByClassName('ninjaDp')[0],
            mysteryBoxAvailable: document.getElementsByClassName('mysteryBoxAvailable')[0],
            streakStatus: document.getElementsByClassName('streakStatus')[0],
            batteryCriticalAnimation: document.getElementsByClassName('batteryCriticalAnimation')[0],
        };

        // Show Hide Mystery Box Based on data
        that.checkMysteryBoxStatus(mysteryBoxData, DOMcache, App);
        that.checkBatteryStatus(profileData, DOMcache);

        if (showNewRewardAnimation) {
            that.newRewardUnlockAnimation(DOMcache);
        } else {
            DOMcache.unlockedRewardHeading.innerHTML = 'Next Gift';
            DOMcache.unlockedReward.classList.remove('hideClass');
            DOMcache.unlockedRewardListContainer.classList.add('unlockedRewardListUl');
            DOMcache.rewardUnlockAnimation.classList.add('hideClass');
            that.setLockedRewardsH();
        }

        DOMcache.streakContainer.addEventListener('click', function(event) {
            DOMcache.batteryStreakInfoContainer.classList.remove('hideClass');
            utils.toggleBackNavigation(true);
            that.createBatteryUi(DOMcache, profileData);
        });

        DOMcache.ninjaDp.addEventListener('click', function(event) {
            App.router.navigateTo('/profile', { rewardsData: data });
        });

        DOMcache.informationAction.addEventListener('click', function(event) {
            DOMcache.batteryStreakInfoContainer.classList.add('hideClass');
        });

        DOMcache.streakValueContainer.addEventListener('click', function(event) {
            DOMcache.rewardUnlockAnimation.style.opacity = 1;
            DOMcache.rewardUnlockAnimation.classList.add('newRewardBgRemove');
            DOMcache.rewardUnlockContainer.classList.add('newStreakAnimation');
            DOMcache.lockedRewards.classList.add('moveLockedRewardsAnimation');
            that.setLockedRewardsH();
            DOMcache.unlockedRewardListContainer.classList.add('unlockedRewardListUl');
        });

        DOMcache.lockedRewards.addEventListener('webkitAnimationEnd', function() {
            DOMcache.unlockedReward.classList.remove('hideClass');
            DOMcache.lockedRewards.classList.remove('moveLockedRewardsAnimation');
            DOMcache.rewardUnlockAnimation.classList.add('hideClass');
            DOMcache.lockedRewards.style.height = 'auto';
            that.setLockedRewardsH();
            cacheProvider.setInCritical('showRewardAnimation', false);

        });

        DOMcache.lockedRewards.addEventListener('animationend', function() {
            DOMcache.unlockedReward.classList.remove('hideClass');
            DOMcache.lockedRewards.classList.remove('moveLockedRewardsAnimation');
            DOMcache.rewardUnlockAnimation.classList.add('hideClass');
            DOMcache.lockedRewards.style.height = 'auto';
            that.setLockedRewardsH();
            cacheProvider.setInCritical('showRewardAnimation', false);

        });


        // Reward Links :: Unlocked Rewards
        if (DOMcache.unlockedRewardListItem.length) {
            rewardsModel.updateNinjaRewardsLinks(App, DOMcache, profileData);
        }

        // Rewards Link :: Locked Rewards
        if (DOMcache.lockedRewardListItem.length) {
            for (var j = 0; j < DOMcache.lockedRewardListItem.length; j++) {
                DOMcache.lockedRewardListItem[j].addEventListener('click', function(event) {
                    events.publish('update.notif.toast', { show: true, heading: 'Getting greedy?', details: 'The reward is currently locked. Please unlock it by being a Ninja for more days.', notifType: 'notifNeutral' });
                });
            }
        } else {
            console.log("Empty illustrations here");
        }

        that.updateIcons(DOMcache, data);
    };


    HomescreenController.prototype.setLockedRewardsH = function() {


        var showRewardAnimation = cacheProvider.getFromCritical('showRewardAnimation');

        if (!showRewardAnimation) {
            document.getElementsByClassName('lockedRewards')[0].style.height = "auto";

        } else {
            var tl = document.getElementsByClassName('dummyDiv')[0];
            var el = document.getElementsByClassName('ninjaRewards')[0];
            var rect = el.getBoundingClientRect();
            tl.style.height = window.innerHeight - rect.bottom + 'px';
        }


    };


    HomescreenController.prototype.checkMysteryBoxStatus = function(mysteryBoxData, DOMcache, App) {

        if (platformSdk.bridgeEnabled) {

            if (mysteryBoxData && mysteryBoxData.mstatus == 'active') {
                console.log("enabling mystery box for you");

                var spinNowColor = ['#F5A623', '#F8E71C', '#DF75FD', '#448BF7', '#1DA8E8', '#9ED62C', '#FF7154'];
                var spinNowText = document.getElementsByClassName('mysteryBoxToastAction')[0];

                setInterval(function() {
                    var setColor = spinNowColor[Math.floor(Math.random() * spinNowColor.length)];
                    spinNowText.style.color = setColor;
                }, 1000);

                DOMcache.lockedRewards.classList.add('mBoxPadding');
                DOMcache.mysteryBoxAvailable.classList.remove('hideClass');
                DOMcache.mysteryBoxAvailable.classList.add('slideUp');
                console.log(DOMcache.mysteryBoxAvailable.getElementsByClassName('mysteryBoxToastIconBig')[0]);
                console.log(DOMcache.mysteryBoxAvailable.getElementsByClassName('mysteryBoxToastIconSmall')[0]);

                DOMcache.mysteryBoxAvailable.getElementsByClassName('mysteryBoxToastIconBig')[0].classList.add('spinMysteryBoxBig');
                DOMcache.mysteryBoxAvailable.getElementsByClassName('mysteryBoxToastIconSmall')[0].classList.add('spinMysteryBoxSmall');

                DOMcache.mysteryBoxAvailable.addEventListener('click', function(event) {
                    App.router.navigateTo('/mysteryBox', mysteryBoxData);
                });
            } else {
                DOMcache.mysteryBoxAvailable.classList.add('hideClass');
                DOMcache.lockedRewards.classList.remove('mBoxPadding');
            }
        }
    };

    HomescreenController.prototype.checkBatteryStatus = function(pdata, DOMcache, App) {

        console.log(pdata);

        var that = this;

        //Check if first ever battery lost has occured or not 

        var batteryLostFtueDone = cacheProvider.getFromCritical('batteryLostFtueDone');
        console.log(batteryLostFtueDone);

        if (!platformSdk.bridgeEnabled) {
            batteryLostFtueDone = true;
            pdata = { "maxBattery": 7, "battery": 6, "hike_version": "4.2.2.2", "rewards_hash": "1474970960", "status": "active", "streak": 10 };
        }

        if (typeof batteryLostFtueDone === 'undefined' || batteryLostFtueDone === false) {
            if (pdata.battery < pdata.maxBattery) {
                console.log("user has lost a battery for the first time");
                var batteryLost = pdata.maxBattery - pdata.battery;
                cacheProvider.setInCritical('batteryLostFtueDone', true);
                DOMcache.batteryCriticalAnimation.classList.remove('hideClass');
                DOMcache.batteryDangerIcon = document.getElementsByClassName('batteryDangerIcon')[0];
                DOMcache.batteryDangerAction = document.getElementsByClassName('batteryDangerAction')[0];

                setTimeout(function() {
                    DOMcache.batteryDangerIcon.classList.add('batteryAnimationActive');
                }, 500);

                DOMcache.batteryCriticalAnimation.getElementsByClassName('batteryDangerHeading')[0].innerHTML = 'Ninja Lives Lost: ' + batteryLost;
                DOMcache.batteryCriticalAnimation.getElementsByClassName('batteryDangerDescription')[0].innerHTML = 'You have just lost your Ninja Life as you did not use Hike enough in the last' + batteryLost + 'days';

                DOMcache.batteryCritical_crossIcon = document.getElementsByClassName('batteryCritical_crossIcon')[0];

                DOMcache.batteryCritical_crossIcon.addEventListener('click', function(event) {
                    DOMcache.batteryCriticalAnimation.classList.add('hideClass');
                });

                DOMcache.batteryDangerAction.addEventListener('click', function(event) {
                    DOMcache.batteryCriticalAnimation.classList.add('hideClass');
                    that.createBatteryUi(DOMcache, pdata);
                    DOMcache.batteryStreakInfoContainer.classList.remove('hideClass');
                });
            }
        }

        if (pdata.battery < pdata.maxBattery / 2) {
            console.log("Show indication always");
            DOMcache.streakStatus.innerHTML = pdata.battery + ' ' + 'days left';
            DOMcache.streakStatus.classList.add('streakDanger');
        } else {
            console.log("Show status as healthy");
            DOMcache.streakStatus.innerHTML = 'Healthy';
            DOMcache.streakStatus.classList.add('streakHealthy');
        }

    };

    // Filter Rewards Based on category of reward
    HomescreenController.prototype.filterRewards = function(rewards) {

        var filteredRewards = {};
        var adhocReward = cacheProvider.getFromCritical('adhocRewardForUser');

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

        // Adds The adhoc Reward Here
        if (adhocReward) {
            for (var j = 0; j < adhocReward.length; j++) {
                adhocReward[j].adhoc = true;
                filteredRewards.unlockedRewards.push(adhocReward[j]);
            }
        }

        return filteredRewards;
    };

    HomescreenController.prototype.updateIcons = function(DOMcache, data) {

        console.log("Updating the icons for rewards");

        // UGC ICONS
        for (var i = 0; i < data.unlockedRewards.length; i++) {
            if (data.unlockedRewards[i].icon) {
                DOMcache.unlockedRewardListItem[i].getElementsByClassName('unlockedRewardIcon')[0].style.backgroundImage = "url('" + data.unlockedRewards[i].icon + "')";
            } else {
                console.log("Set a default icon for ugc");
            }
        }

        // REWARD ICONS
        for (var j = 0; j < data.lockedRewards.length; j++) {
            console.log("Updating the icons for locked rewards");
            if (data.lockedRewards[j].icon) {
                DOMcache.lockedRewardListItem[j].getElementsByClassName('rewardIcon')[0].style.backgroundImage = "url('" + data.lockedRewards[j].icon + "')";
            } else {
                console.log("Set a default icon for rewards");
            }
        }
    };

    HomescreenController.prototype.render = function(ctr, App, data) {

        var that = this;
        var rewardsData = {};
        var showNewRewardAnimation = cacheProvider.getFromCritical('showRewardAnimation');

        // Get Data From Cache Always :: Cache updated in all cases before rendering data
        var profile_data = cacheProvider.getFromCritical('userProfileData');
        var rewards_data = cacheProvider.getFromCritical('ninjaRewards');
        var oldNinjaCompareRewards = cacheProvider.getFromCritical('oldNinjaCompareRewards');

        if (platformSdk.bridgeEnabled) {
            if (utils.upgradeRequired(profile_data.hike_version, platformSdk.appData.appVersion, false)) {
                App.router.navigateTo('/upgrade', 'hike');
            } else if (utils.upgradeRequired(profile_data.app_v, platformSdk.appData.mAppVersionCode, true)) {
                App.router.navigateTo('/upgrade', 'ninja');
            } else if (profile_data.status == 'inactive' || profile_data.status == 'locked') {
                App.router.navigateTo('/userState', profile_data.data);
            } else {
                rewardsData = that.filterRewards(rewards_data.rewards);
            }
        }

        // Stub 
        if (!platformSdk.bridgeEnabled) {
            data = { "rewards": [{ "desc": "Get the best stickers on hike way before everyone else does. You get these 2 weeks before mere mortals. You're a Ninja!", "hicon": "https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/secretStickerShopIllustration.png", "icon": "https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/early_access_sticker_icon.png", "id": "57b56ec17e401ddfe70a9e8f", "state": 1, "stitle": "Get all the hike stickers before everyone else.", "streak": 1, "title": "Early Access Stickers", "type": "sticker_reward", "value": null }, { "icon": "https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/GIFSharingHeader.png", "id": "57cfce41733265431b98b317", "state": 1, "stitle": "Get the exclusive GIF feature.", "streak": 15, "title": "Exclusive Gif", "type": "exclusive_feature", "value": null }, { "failed_preview_img": "https://staging.im.hike.in/sticker?catId=mumbai&stId=023_mb_badey.png&resId=XHDPI&image=True", "icon": "https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/custom_sticker_icon.png", "id": "57c554417332654291dc1097", "state": 0, "stitle": "Have an exclusive sticker made just for you", "streak": 7, "title": "My Sticker", "type": "custom_sticker", "value": null }, { "desc": "Share animated stickers with your friends and get krazzy", "hicon": "https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/animatedStickers.png", "icon": "https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/animatedStickers.png", "id": "58c563ce7332657fe8d3ca69", "state": 3, "stitle": "Experience the new animated before anyone else", "streak": 0, "title": "Animated Stickers", "type": "exclusive_feature", "value": null }, { "desc": "Share animated stickers with your friends and get krazzy", "hicon": "https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/animatedStickers.png", "icon": "https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/animatedStickers.png", "id": "58c563ce7332657fe8d3ca69", "state": 3, "stitle": "Experience the new animated before anyone else", "streak": 0, "title": "Animated Stickers", "type": "exclusive_feature", "value": null }, { "desc": "Share animated stickers with your friends and get krazzy", "hicon": "https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/animatedStickers.png", "icon": "https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/animatedStickers.png", "id": "58c563ce7332657fe8d3ca69", "state": 3, "stitle": "Experience the new animated before anyone else", "streak": 0, "title": "Animated Stickers", "type": "exclusive_feature", "value": null }, { "desc": "Share animated stickers with your friends and get krazzy", "hicon": "https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/animatedStickers.png", "icon": "https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/animatedStickers.png", "id": "58c563ce7332657fe8d3ca69", "state": 0, "stitle": "Experience the new animated before anyone else", "streak": 0, "title": "Animated Stickers", "type": "exclusive_feature", "value": null }, { "desc": "Share animated stickers with your friends and get krazzy", "hicon": "https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/animatedStickers.png", "icon": "https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/nixy/animatedStickers.png", "id": "58c563ce7332657fe8d3ca69", "state": 0, "stitle": "Experience the new animated before anyone else", "streak": 0, "title": "Animated Stickers", "type": "exclusive_feature", "value": null }], "rewards_hash": "1474970960" };
            profile_data = { "battery": 7, "hike_version": "4.2.2.2", "rewards_hash": "1474970960", "status": "active", "streak": 10 };
            rewardsData = that.filterRewards(data.rewards);
        }


        // For No Unlocked Rewards :: Show First locked reward
        if (rewardsData.unlockedRewards.length === 0) {
            rewardsData.unlockedRewards.push(rewardsData.lockedRewards[0]);
            rewardsData.lockedRewards.shift();
        }

        utils.changeBotTitle('Hike Ninja');
        if (platformSdk.bridgeEnabled) {
            utils.changeBarColors('#3C367C', '#494D95');
        }
        console.log("rewards before rendering are", rewardsData);

        that.el = document.createElement('div');
        that.el.className = 'homeScreenParentContainer animation_fadein noselect';
        that.el.innerHTML = Mustache.render(unescape(that.template), { ninjaProfile: profile_data, ninjaUnlockedRewards: rewardsData.unlockedRewards, ninjaLockedRewards: rewardsData.lockedRewards });
        ctr.appendChild(that.el);
        events.publish('update.loader', { show: false });
        that.bind(App, rewardsData, showNewRewardAnimation);
    };

    HomescreenController.prototype.destroy = function() {

    };

    module.exports = HomescreenController;

})(window, platformSdk, platformSdk.events);
