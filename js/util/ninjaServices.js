(function(W, platformSdk, events) {
    'use strict';

    var utils = require('./utils.js');
    var cacheProvider = require('./cacheProvider.js');
    var Constants = require('../../constants');
    var checkTimeout = null;

    var ninjaService = function(service) {
        this.ninjaService = service;
    };

    var URL = {
        api_location: appConfig.API_URL
    };

    ninjaService.prototype = {

        // Subscribe Call For Engine / Game
        subscribeHandler: function(data, fn, x) {
            console.log(data);
            var params = {
                'url': URL.api_location + '/subscribe?random=' + Math.round(Math.random() * 999999999),
                'type': 'POST',
                'data': data
            };
            if (typeof fn === "function") return this.ninjaService.communicate(params, fn, x);
            else this.ninjaService.communicate(params);
        },

        // Subscribe Call For Engine / Game
        unsubscribeHandler: function(data, fn, x) {
            console.log(data);
            var params = {
                'url': URL.api_location + '/unsubscribe?random=' + Math.round(Math.random() * 999999999),
                'type': 'POST',
                'data': data
            };
            if (typeof fn === "function") return this.ninjaService.communicate(params, fn, x);
            else this.ninjaService.communicate(params);
        },

        getNewNinjaPacket: function(fn, x) {
            var params = {
                'url': URL.api_location + '/updateapp?random=' + Math.round(Math.random() * 999999999),
                'type': 'POST'
            };
            if (typeof fn === "function") return this.ninjaService.communicate(params, fn, x);
            else this.ninjaService.communicate(params);
        },

        // Profile Service For Ninja 
        getNinjaProfile: function(fn, x) {

            var dpRequired = true;
            var params = {};

            if (platformSdk.appVersion >= 15) {
                dpRequired = false;
            }

            if (dpRequired === true) {
                console.log("DP IS REQUIRED IN CALL");
                params = {
                    'url': URL.api_location + '/profile?dp=' + dpRequired + '&random=' + Math.round(Math.random() * 999999999),
                    'type': 'GET'
                };
            } else {
                params = {
                    'url': URL.api_location + '/profile?random=' + Math.round(Math.random() * 999999999),
                    'type': 'GET'
                };
            }

            if (typeof fn === "function") return this.ninjaService.communicate(params, fn, x);
            else this.ninjaService.communicate(params);
        },

        // Get complete Ninja List of Rewards That can be earned By Work
        getNinjaRewards: function(fn, x) {
            var params = {
                'url': URL.api_location + '/rewards?random=' + Math.round(Math.random() * 999999999),
                'type': 'GET'
            };
            if (typeof fn === "function") return this.ninjaService.communicate(params, fn, x);
            else this.ninjaService.communicate(params);
        },

        // Get Ninja Acitivty/Stats for Lifetime :: 30 days :: 7 days 
        getNinjaActivity: function(fn, x) {
            var params = {
                'url': URL.api_location + '/stats?random=' + Math.round(Math.random() * 999999999),
                'type': 'GET'
            };
            if (typeof fn === "function") return this.ninjaService.communicate(params, fn, x);
            else this.ninjaService.communicate(params);
        },

        // Get Speicifc Reward Details For The Reward Router
        getRewardDetails: function(data, fn, x) {
            console.log(data);
            var params = {
                'url': URL.api_location + '/rewards/' + data.rewardId + '?random=' + Math.round(Math.random() * 999999999),
                'type': 'GET'
            };
            if (typeof fn === "function") return this.ninjaService.communicate(params, fn, x);
            else this.ninjaService.communicate(params);
        },

        recallRewardDetails: function(data, fn, x) {
            var params = {
                'url': URL.api_location + '/rewards/' + data.rewardId + '?random=' + Math.round(Math.random() * 999999999),
                'type': 'GET'
            };
            if (typeof fn === "function") return this.ninjaService.communicate(params, fn, x);
            else this.ninjaService.communicate(params);
        },

        uploadCustomStickerData: function(data, fn, x) {
            console.log(data);
            var params = {
                'url': URL.api_location + '/rewards/' + data.rid + '?random=' + Math.round(Math.random() * 999999999),
                'type': 'POST',
                'data': data.send
            };
            if (typeof fn === "function") return this.ninjaService.communicate(params, fn, x);
            else this.ninjaService.communicate(params);
        },

        sendCustomSticker: function(data, fn, x) {
            var params = {
                'url': URL.api_location + '/custom_sticker/tid/' + data.rewardId + '/sid/' + data.customStickerId + '?random=' + Math.round(Math.random() * 999999999),
                'type': 'GET'
            };
            if (typeof fn === "function") return this.ninjaService.communicate(params, fn, x);
            else this.ninjaService.communicate(params);
        },

        getMysteryBox: function(fn, x) {
            var params = {
                'url': URL.api_location + '/mysterybox' + '?random=' + Math.round(Math.random() * 999999999),
                'type': 'GET'
            };
            if (typeof fn === "function") return this.ninjaService.communicate(params, fn, x);
            else this.ninjaService.communicate(params);
        },

        getMysteryBoxResult: function(fn, x) {
            var params = {
                'url': URL.api_location + '/mysterybox' + '?random=' + Math.round(Math.random() * 999999999),
                'type': 'POST'
            };
            if (typeof fn === "function") return this.ninjaService.communicate(params, fn, x);
            else this.ninjaService.communicate(params);
        },

        getStickerPack: function(data, fn, x) {
            console.log("Getting Sticker Pack For the User");
            var params = {
                'url': URL.api_location + '/rewards/' + data.rid + '?random=' + Math.round(Math.random() * 999999999),
                'type': 'POST',
                'data': data.send
            };
            if (typeof fn === "function") return this.ninjaService.communicate(params, fn, x);
            else this.ninjaService.communicate(params);

        },

        getExclusiveFeature: function(data, fn, x) {
            console.log("Getting Exclusive feature for you");
            var params = {
                'url': URL.api_location + '/rewards/' + data.rid + '?random=' + Math.round(Math.random() * 999999999),
                'type': 'POST',
                'data': { 'enable': data.enable }
            };
            if (typeof fn === "function") return this.ninjaService.communicate(params, fn, x);
            else this.ninjaService.communicate(params);

        },

        getUgcTypes: function(fn, x) {
            var params = {
                'url': URL.api_location + '/ugc?random=' + Math.round(Math.random() * 999999999),
                'type': 'GET'
            };
            if (typeof fn === "function") return this.ninjaService.communicate(params, fn, x);
            else this.ninjaService.communicate(params);
        },

        postUgcContent: function(url, fn, x) {
            var params = {
                'url': url + '&random=' + Math.round(Math.random() * 999999999),
                'type': 'POST',
                'data': {}
            };
            if (typeof fn === "function") return this.ninjaService.communicate(params, fn, x);
            else this.ninjaService.communicate(params);

        },


        postCustomSticker: function(url, fn, x) {
            var params = {
                'url': url + '&random=' + Math.round(Math.random() * 999999999),
                'type': 'POST',
                'data': {}
            };
            if (typeof fn === "function") return this.ninjaService.communicate(params, fn, x);
            else this.ninjaService.communicate(params);

        },

        submitFeedback: function(url, data, fn, x) {
            var params = {
                'url': url + '?random=' + Math.round(Math.random() * 999999999),
                'type': 'POST',
                'data': data
            };
            if (typeof fn === "function") return this.ninjaService.communicate(params, fn, x);
            else this.ninjaService.communicate(params);

        },

        logData: function(data) {

            data.k = "act_exp";
            data.p = "hike_ninja";
            data.uk = "hike_ninja";
            data.c = (data.fa == null || typeof data.c == 'undefined') ? null : data.c;
            data.o = (data.fa == null || typeof data.o == 'undefined') ? null : data.o;
            data.fa = (data.fa == null || typeof data.fa == 'undefined') ? null : data.fa;
            data.g = (data.g == null || typeof data.g == 'undefined') ? null : data.g;
            data.s = (data.s == null || typeof data.s == 'undefined') ? null : data.s;
            data.f = (data.f == null || typeof data.f == 'undefined') ? null : data.f;
            data.b = (data.ra == null || typeof data.b == 'undefined') ? null : data.b;


            if (platformSdk.bridgeEnabled)
                platformSdk.utils.logAnalytics("true", "click", data);
            else
                console.log(data);

        }



        // Rewards Service For Ninja 

        // Activity Service For Ninja
    };

    module.exports = ninjaService;

})(window, platformSdk, platformSdk.events);