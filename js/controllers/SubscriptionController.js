(function(W, platformSdk, events) {
    'use strict';

    var utils = require('../util/utils'),
        Constants = require('../../constants.js'),
        cacheProvider = require('../util/cacheProvider'),
        profileModel = require('../models/profileModel'),
        activityModel = require('../models/activityModel'),
        
        

        SubscriptionController = function(options) {
            this.template = require('raw!../../templates/subscribe.html');
        };

    SubscriptionController.prototype.bind = function(App, data) {


        var that = this,
            subscribe = document.getElementsByClassName('subscribeBtn')[0],
            unsubscribe = document.getElementsByClassName('unsubscribeBtn')[0],
            callInprogress = false,
            ftueCompleted = cacheProvider.getFromCritical('ftueCompleted');


        subscribe.addEventListener('click', function(event) {

            if (callInprogress)
                return;
            else
                callInprogress = false;

            App.NinjaService.subscribeHandler({}, function(res) {

                if (res.stat === 'ok') {

                    cacheProvider.setInCritical('subscriptionCompleted', true);
                    if (ftueCompleted) {
                        console.log("This is and old user :: Fetching Profile battery and streak for the user");

                        // Check If Block True Or False
                        if (platformSdk.appData.block === 'true') {

                            console.log('User has blocked the Application');
                            events.publish('app/block', {
                                show: true
                            });
                        }

                        App.NinjaService.getNinjaProfile(function(res) {
                            console.log(res.data);

                            if (utils.upgradeRequired(res.data.hike_version, platformSdk.appData.appVersion)) {

                                App.router.navigateTo('/upgrade');

                            } else if (res.data.status == 'inactive' || res.data.status == 'locked') {

                                App.router.navigateTo('/userState', res.data);
                                console.log("User state  is " + res.data.status);

                            } else {

                                // Get Everything From the cache :: Activity data :: Mystery Box Data :: Rewards Data
                                App.router.navigateTo('/');
                                profileModel.updateNinjaData(res.data, App);
                                activityModel.fetchNinjaActivity('lifetime');
                                //mysteryBoxModel.getMysteryBoxDetails(self);
                            }
                        }, that);
                    }
                    // Show FTUE To the User
                    else {
                        // STUB TO REMOVE

                        var data = {};

                        this.ninjaRewardsData = { 'rewards': [], 'rewards_hash': '' };
                        this.ninjaProfileData = { "battery": 0, "rewards_hash": "", "status": "active", "streak": 0, "name": '' };
                        this.ninjaActivityData = { "chatThemes": { "rec": 0, "sent": 0 }, "files": { "rec": 0, "sent": 0 }, "messages": { "rec": 0, "sent": 0 }, "statusUpdates": { "count": 0 }, "stickers": { "rec": 0, "sent": 0 } };

                        // STUB TO REMOVE

                        data.ninjaRewardsCollection = this.ninjaRewardsData;
                        data.ninjaProfileData = this.ninjaProfileData;
                        data.ninjaActivityData = this.ninjaActivityData;

                        App.NinjaService.getNinjaProfile(function(res) {
                            console.log(res.data);

                            if (utils.upgradeRequired(res.data.hike_version, platformSdk.appData.appVersion)) {
                                cacheProvider.setInCritical('ftueCompleted', true);
                                App.router.navigateTo('/upgrade');
                            }
                            else if (res.data.status == 'locked' || res.data.status == 'locked') {
                                cacheProvider.setInCritical('ftueCompleted', false);
                                App.router.navigateTo('/userState', res.data);
                                console.log("User state  is " + res.data.status);

                            } else {
                                // Get Everything From the cache :: Activity data :: Mystery Box Data :: Rewards Data
                                cacheProvider.setInCritical('ftueCompleted', true);
                                App.router.navigateTo('/', data);
                                profileModel.updateNinjaData(res.data, App);
                                activityModel.fetchNinjaActivity('lifetime');
                                //mysteryBoxModel.getMysteryBoxDetails(that);
                            }
                        }, App);
                    }

                } else
                    utils.showToast('Something went wrong while subscribing');


            }, that);

        });

        unsubscribe.addEventListener('click', function(event) {

            if (callInprogress)
                return;
            else
                callInprogress = false;

            App.NinjaService.unsubscribeHandler({}, function(res) {

                if (res.stat === 'ok')
                    PlatformBridge.closeWebView();
                else
                    utils.showToast('Something went wrong while unsubscribing');

            }, that);

        });

    };

    SubscriptionController.prototype.render = function(ctr, App, data) {

        var that = this;
        that.el = document.createElement('div');
        that.el.className = 'ftueController animation_fadein noselect';
        that.el.innerHTML = Mustache.render(unescape(that.template));
        ctr.appendChild(that.el);
        events.publish('update.loader', { show: false });
        that.bind(App, data);
    };

    SubscriptionController.prototype.destroy = function() {

    };

    module.exports = SubscriptionController;

})(window, platformSdk, platformSdk.events);