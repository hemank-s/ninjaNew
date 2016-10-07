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

        UgcModel = function() {
            this.TxService = new TxService();
            this.NinjaService = new NinjaService(this.TxService); //communication layer
        },

        EMPTY_OBJ_READ_ONLY = {};

    UgcModel.prototype = {

        // Add String Compare Functions Here
        fetchUgcTypes: function() {
            console.log("Fetching ugc data");
            if (platformSdk.bridgeEnabled) {
                this.NinjaService.getUgcTypes(function(res) {
                    console.log(res);
                    this.updateUgcData(res.data.content);
                }, this);
            }
        },

        updateUgcData: function(content) {
            console.log('Updating the activity Three tab in Ninja');
            cacheProvider.setInCritical('ninjaUgc', content);
        },

        postUgcData: function(data, imagePresent, callback) {

            if (platformSdk.bridgeEnabled) {

                console.log('Post request with data');
                console.log(data);

                if (imagePresent) {
                    try {
                        platformSdk.nativeReq({
                            ctx: self,
                            fn: 'uploadFile',
                            data: platformSdk.utils.validateStringifyJson(data),
                            success: function(res) {
                                try {
                                    res = JSON.parse(decodeURIComponent(res));
                                    console.log(res);
                                    callback(res);
                                } catch (err) {
                                    utils.showToast('Sorry. Your data could not be send. Try again , please ?');
                                }
                            }
                        });
                    } catch (err) {
                        var res = { stat: 'exception' };
                        callback(res);
                    }

                } else {

                    this.NinjaService.postUgcContent(data.uploadUrl, function(res) {
                        callback(res);
                    }, this);
                }

            } else {
                console.log('Ugc Data Posted');
                callback();
            }

        }


    };

    module.exports = new UgcModel();
})();