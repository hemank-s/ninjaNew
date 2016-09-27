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

        ProfileModel = function() {
            this.TxService = new TxService();
            this.ninjaService = new NinjaService(this.TxService); //communication layer
        },

        EMPTY_OBJ_READ_ONLY = {};

    ProfileModel.prototype = {

        // Update the Ninja Data In Helper Data and Update the New Values on the Profile Screen

        checkRewardStatus: function(rewardHash, App) {

            var ninjaProfileData = cacheProvider.getFromCritical('ninjaProfileData');
            //var oldRewardsHash = ninjaProfileData.rewards_hash;
            var compareHash = null;


            // STUB TO REMOVE

            var oldRewardsHash = 'be96dc8c0a876b08c8076b03acdee0db4';

            // STUB TO REMOVE


            if (oldRewardsHash) {
                compareHash = utils.twoStringCompare(oldRewardsHash, rewardHash);
            } else {
                console.log("No Old rewards Hash exist :: Call Rewards Anyway and store the rewards hash");
            }

            if (compareHash !== 0) {
                console.log("Rewards Hash Does not match :: Fetch the New Rewards");

                // Store New Rewards Hash In Helper Data

                //ninjaProfileData.rewards_hash = rewardHash;
                //cacheProvider.setInCritical('ninjaProfileData', ninjaProfileData);

                // STUB TO REMOVE

                // var newRewardData = [{"title":"Early Access Stickers","stitle":"Get all the hike stickers before everyone else","icon":"https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/3rd-sticker.png","state":"unlocked","id":1,"streak":0,"type":"sticker_reward"},{"title":"Express GIF","stitle":"Express yourself with GIFs, like no one else can","icon":"https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/3rd-sticker.png","state":"locked","id":3,"streak":35,"type":"exclusive_feature"},{"title":"Submit Content","stitle":"Submit hike content and get recognition","icon":"https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/3rd-sticker.png","state":"locked","id":5,"streak":60,"type":"user_generated_content"},{"title":"My Sticker","stitle":"Have an exclusive sticker made just for you","icon":"https://s3-ap-southeast-1.amazonaws.com/hike-giscassets/3rd-sticker.png","state":"unlocked","id":6,"streak":0,"type":"custom_sticker"}];
                // rewardsModel.updateNinjaRewards(newRewardData,App);

                // STUB TO REMOVE

                App.NinjaService.getNinjaRewards(function(res) {
                    console.log("NINJA REWARDS ARE", res.data);
                    rewardsModel.updateNinjaRewards(res.data, App);
                }, this);


            } else {
                console.log("The rewards hash matches perfectly :: No need to update the rewards new model");
            }
        },

        // Add String Compare Functions Here
        checkNinjaState: function(status) {
            if (status == 'active') {
                return 'active';
            } else if (status == 'blocked') {
                return 'blocked';
            } else if (status == 'lapsed') {
                return 'lapsed';
            }
        },


        // Check and Update Adhoc reward
        checkAndUpdateAdhocReward: function(res) {
            console.log(res);
            if(res.adhoc_reward && res.adhoc_reward.length > 0){
                console.log("At least one reward is present");
                console.log(res.adhoc_reward);
                cacheProvider.setInCritical('adhocRewardForUser', res.adhoc_reward);
            }else{
                console.log("No adhoc reward is present");
            }
        },

        // Updates the Ninja Profile Data and check For Reward Status here

        updateNinjaData: function(data, App) {

            // Check the Reward Page and Update Rewards if need be
            this.checkRewardStatus(data.rewards_hash, App);
            this.checkAndUpdateAdhocReward(data,App);

            var ninjaProfileData = [];
            ninjaProfileData = data;

            if(platformSdk.platformVersion >= 15){
                console.log("Platform Verison is latest");

                platformSdk.nativeReq({
                fn: 'getUserProfile',
                ctx: this,
                data: "",
                success: function(res) {

                    res = JSON.parse(decodeURIComponent(res));
                    
                    ninjaProfileData.name = res.name;
                    ninjaProfileData.dp = res.fp;

                    console.log("NINJA PROFILE DATA IS", ninjaProfileData);

                    // UI Definition 
                    var streakValue = document.getElementsByClassName('ninjaStreakValue')[0];
                    var batteryValue = document.getElementsByClassName('ninjaBatteryValue')[0];
                    var ninjaName = document.getElementsByClassName('ninjaName')[0];
                    var ninjaIcon = document.getElementsByClassName('ninjaProfileIcon')[0];

                    if(ninjaProfileData.streak){
                        streakValue.innerHTML = ninjaProfileData.streak;    
                    }else{
                        streakValue.innerHTML = 0;
                    }

                    if(ninjaProfileData.battery){
                        batteryValue.innerHTML = ninjaProfileData.battery;    
                    }else{
                        batteryValue.innerHTML = 0;
                    }
                    
                    ninjaName.innerHTML = ninjaProfileData.name;

                    // For Dp Refer the Android Client DP Path
                    if (ninjaProfileData.dp) {
                        ninjaIcon.style.backgroundImage = "url('file:///" + ninjaProfileData.dp + "')";
                    } else {
                        console.log("Set a default dp");
                    }
                    cacheProvider.setInCritical('ninjaProfileData', ninjaProfileData);
                    //var helperData = platformSdk.appData.helperData || EMPTY_OBJ_READ_ONLY;

                }
            });
            }else{
                    console.log("Platform Verison is old");
                    console.log("NINJA PROFILE DATA IS", ninjaProfileData);

                    // UI Definition 
                    var streakValue = document.getElementsByClassName('ninjaStreakValue')[0];
                    var batteryValue = document.getElementsByClassName('ninjaBatteryValue')[0];
                    var ninjaName = document.getElementsByClassName('ninjaName')[0];
                    var ninjaIcon = document.getElementsByClassName('ninjaProfileIcon')[0];

                    if(ninjaProfileData.streak){
                        streakValue.innerHTML = ninjaProfileData.streak;    
                    }else{
                        streakValue.innerHTML = 0;
                    }

                    if(ninjaProfileData.battery){
                        batteryValue.innerHTML = ninjaProfileData.battery;    
                    }else{
                        batteryValue.innerHTML = 0;
                    }
                    
                    ninjaName.innerHTML = ninjaProfileData.name;

                    // For Dp Refer the Android Client DP Path
                    if (ninjaProfileData.dp) {
                        ninjaIcon.style.backgroundImage = "url('file:///" + ninjaProfileData.dp + "')";
                    } else {
                        console.log("Set a default dp");
                    }
                    cacheProvider.setInCritical('ninjaProfileData', ninjaProfileData);
                    //var helperData = platformSdk.appData.helperData || EMPTY_OBJ_READ_ONLY;

            }
            
        },

    };

    module.exports = new ProfileModel();
})();
