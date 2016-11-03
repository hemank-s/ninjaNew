/**
 * Created by hemanksabharwal on 17/05/15.
 */

(function() {
    'use strict';

    var platformSdk = require('../../libs/js/platformSdk_v2.0'),
        utils = require('../util/utils'),
        cacheProvider = require('../util/cacheProvider'),
        TxService = require('../util/txServices'),
        NinjaService = require('../util/ninjaServices'),

        ActivityModel = function() {
            this.TxService = new TxService();
            this.NinjaService = new NinjaService(this.TxService); //communication layer
        },

        EMPTY_OBJ_READ_ONLY = {};

    ActivityModel.prototype = {

        int2String: function(num) {
            var suffix = ['', 'K', 'M', 'B', 'T', 'Q'];
            var ans = num;
            var ind = 0;
            while (ans > 1000) {
                ans = ans / 1000;
                ind += 1;
            }
            ans = Math.floor(ans * 10) / 10;
            ans = ans + suffix[ind];
            return ans;
        },

        // getNumberAbrr: function(value) {
        //     var newValue = value;
        //     if (value >= 1000) {
        //         var suffixes = ['', 'K', 'M', 'B', 'T'];
        //         var suffixNum = Math.floor(('' + value).length / 3);
        //         var shortValue = '';
        //         var shortNum;
        //         for (var precision = 2; precision >= 1; precision--) {
        //             shortValue = parseFloat((suffixNum !== 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(precision));
        //             var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '');
        //             if (dotLessShortValue.length <= 2) {
        //                 break;
        //             }
        //         }
        //         if (shortValue % 1 !== 0) shortNum = shortValue.toFixed(1);
        //         newValue = shortValue + suffixes[suffixNum];
        //     }
        //     return newValue;
        // },

        formatActivityData: function(activityData) {

            var that = this;
            for (var key in activityData) {

                if (typeof activityData[key].sent != 'undefined')
                    activityData[key].sent = that.int2String(activityData[key].sent);

                if (typeof activityData[key].rec != 'undefined')
                    activityData[key].rec = that.int2String(activityData[key].rec);

                if (typeof activityData[key].count != 'undefined')
                    activityData[key].count = that.int2String(activityData[key].count);

            }
        },

        fetchNinjaActivity: function(timeperiod) {
            console.log('Fetching the ninja activity for the lifetime');

            // Not used as of now for :: Check Weather for 30 days or 7 days needed :: Product Call
            var data = { 'duration': timeperiod };

            // Timeperiod can be of three type :: Lifetime/ Last month / Last week :: decide the activity value string/integer

            if (platformSdk.bridgeEnabled) {
                this.NinjaService.getNinjaActivity(function(res) {
                    console.log(res.data);
                    // Set In Critical cache for quick fetch
                    this.updateNinjaActivityTab(res.data);
                }, this);
            }
        },

        updateNinjaActivityTab: function(activityData) {
            console.log('Updating the activity Three tab in Ninja');
            this.formatActivityData(activityData);
            cacheProvider.setInCritical('ninjaStats', activityData);
        }

    };

    module.exports = new ActivityModel();
})();
