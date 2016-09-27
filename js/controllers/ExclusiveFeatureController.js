(function(W, platformSdk, events) {
    'use strict';

    var utils = require('../util/utils'),
        Constants = require('../../constants.js'),

        ExclusiveFeatureController = function(options) {
            this.template = require('raw!../../templates/exclusiveFeature.html');
        };

    ExclusiveFeatureController.prototype.bind = function(App, data) {

        var ftue = this;

        var headerIcon = document.getElementsByClassName('featureImage')[0];
        var featureEnableButton = document.getElementsByClassName('featureEnableButton')[0];
        var featureRetryButton = document.getElementsByClassName('featureRetryButton')[0];
        var featureProgress = document.getElementsByClassName('featureProgress')[0];
        var progressBar = document.getElementsByClassName('progressBar')[0];

        if (data.rewardDetails.hicon) {
            headerIcon.style.backgroundImage = 'url(\'' + data.rewardDetails.hicon + '\')';
        } else {
            console.log("Set a default header Icon");
        }

        if(data.rewardDetails.sanctioned){
            console.log("Reward has been redeemed");
            featureEnableButton.classList.add('hideClass');
            featureRetryButton.classList.remove('hideClass');
        }else{
            console.log("Reward has not been redeemed");
        }

        // Check the reward status here and set button enable or retry once redeemed or unlocked

        // FAQ URL CLICK EVENT
        featureEnableButton.addEventListener('click', function(ev) {
            console.log("Enabling The Exclusive Feature For You");

            var dataToSend = {};
            dataToSend.rid = data.rewardId;
            dataToSend.enable  = true;

            // Reward Details API :: Send Reward Id As well
            App.NinjaService.getExclusiveFeature(dataToSend, function(res) {

                // Show Toast if Success
                console.log(res);
                utils.showToast('The feature will be enabled shortly.');

                featureRetryButton.classList.remove('hideClass');
                featureEnableButton.classList.add('hideClass');

                // Routing to the specific Router
                //App.router.navigateTo(rewardRouter, res.data);
            }, this);
        });

        featureRetryButton.addEventListener('click', function(ev) {
            console.log("Enabling The Exclusive Feature For You");

            var dataToSend = {};
            dataToSend.rid = data.rewardId;
            dataToSend.enable  = true;

            // Reward Details API :: Send Reward Id As well
            App.NinjaService.getExclusiveFeature(dataToSend, function(res) {

                // Show Toast if Success
                console.log(res);
                utils.showToast('We have sent you the feature once again!');

            }, this);
        });



    };
    ExclusiveFeatureController.prototype.render = function(ctr, App, data) {

        console.log(data);

        var that = this;
        that.el = document.createElement('div');
        that.el.className = 'exclusiveFeatureContainer animation_fadein noselect';

        that.el.innerHTML = Mustache.render(that.template, {
            featureText: data.rewardDetails.desc
        });

        ctr.appendChild(that.el);
        events.publish('update.loader', { show: false });
        that.bind(App, data);
    };

    ExclusiveFeatureController.prototype.destroy = function() {

    };

    module.exports = ExclusiveFeatureController;

})(window, platformSdk, platformSdk.events);
