/**
 * Created by hemanksabharwal on 17/05/15.
 */

(function() {
    'use strict';

    var platformSdk = require('../../libs/js/platformSdk_v2.0'),
        utils = require('../util/utils'),
        cacheProvider = require('../util/cacheProvider'),
        rewardsModel = require('../models/rewardsModel'),
        activityModel = require('../models/activityModel'),
        mysteryBoxModel = require('../models/mysteryBoxModel'),
        ugcModel = require('../models/ugcModel'),
        TxService = require('../util/txServices'),
        NinjaService = require('../util/ninjaServices'),

        ProfileModel = function() {
            this.TxService = new TxService();
            this.ninjaService = new NinjaService(this.TxService); //communication layer
        },

        EMPTY_OBJ_READ_ONLY = {};

    ProfileModel.prototype = {

        // Update the Ninja Data In Helper Data and Update the New Values on the Profile Screen

        checkRewardStatus: function(data, App, existingUser) {

            // Adhoc Reward Check here :: If present add in locked rewards in controller before render

            if (data.adhoc_reward && data.adhoc_reward.length > 0) {
                console.log("At least one reward is present");
                console.log(data.adhoc_reward);
                cacheProvider.setInCritical('adhocRewardForUser', data.adhoc_reward);
            } else {
                console.log("No adhoc reward is present");
            }

            var ninjaProfileData = cacheProvider.getFromCritical('userProfileData');
            var fetchRewards = cacheProvider.getFromCritical('fetchRewards');

            if (fetchRewards === true) {
                console.log("Rewards Hash Does not match :: Fetch the New Rewards");
                if (platformSdk.bridgeEnabled) {
                    App.NinjaService.getNinjaRewards(function(res) {
                        console.log("NINJA REWARDS ARE", res.data);
                        rewardsModel.updateNinjaRewards(res.data, App, existingUser);
                    }, this);
                } else {
                    console.log("stub needed");
                }
            } else {
                console.log("The rewards hash matches perfectly :: No need to update the rewards new model");
                if (existingUser) {
                    cacheProvider.setInCritical('showRewardAnimation', false);
                    App.router.navigateTo('/home');
                }
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

        // Updates the Ninja Profile Data and check For Reward Status here

        updateNinjaData: function(data, App, existingUser) {

            var ninjaProfileData = [];
            ninjaProfileData = data;

            activityModel.fetchNinjaActivity('lifetime');
            ugcModel.fetchUgcTypes();
            mysteryBoxModel.getMysteryBoxDetails(App);

            if (platformSdk.platformVersion >= 15) {
                console.log("Platform Verison is latest");

                platformSdk.nativeReq({
                    fn: 'getUserProfile',
                    ctx: this,
                    data: "",
                    success: function(res) {

                        res = JSON.parse(decodeURIComponent(res));

                        ninjaProfileData.name = res.name;
                        ninjaProfileData.dp = res.dp;

                        console.log("NINJA PROFILE DATA IS", ninjaProfileData);

                        cacheProvider.setInCritical('ninjaProfileData', ninjaProfileData);
                        //var helperData = platformSdk.appData.helperData || EMPTY_OBJ_READ_ONLY;

                        // Check the Reward Page and Update Rewards if need be
                        this.checkRewardStatus(data, App, existingUser);
                    }
                });
            } else {
                console.log("Platform Verison is old");
                console.log("NINJA PROFILE DATA IS", ninjaProfileData);

                cacheProvider.setInCritical('ninjaProfileData', ninjaProfileData);
                // Check the Reward Page and Update Rewards if need be
                this.checkRewardStatus(data, App, existingUser);
            }

        },

    };

    module.exports = new ProfileModel();
})();
