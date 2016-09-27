/**
 * Created by hemanksabharwal on 17/05/15.
 */

(function () {
    'use strict';

    var platformSdk = require('../../libs/js/platformSdk_v2.0'),
        utils = require('./utils'),

        CacheProvider = function () {},

        EMPTY_OBJ_READ_ONLY = {};

    CacheProvider.prototype = {
        // Get From Cache Hike Android
        get: function (options) {
            return platformSdk.nativeReq({
                ctx: options.ctx,
                success: options.success,
                fn: 'getFromCache',
                data: options.key
            });    
        },

        // Cache Set 
        set: function (key, val) {
            platformSdk.bridge.putInCache(key, (val));    
        },

        // Critical Cache is Microapp - Helper Data
        getFromCritical: function (key) {
            var helperData = platformSdk.appData.helperData || EMPTY_OBJ_READ_ONLY;

            return helperData[key];
        },

        // Sets in helper data which does not get erased upon clearing app data.
        setInCritical: function (key, value) {
            var helperData = platformSdk.appData.helperData || {};

            helperData[key] = value;
            platformSdk.updateHelperData(helperData);
        },

    };

    module.exports = new CacheProvider();
})();