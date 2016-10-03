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
        }


    };

    module.exports = new UgcModel();
})();
