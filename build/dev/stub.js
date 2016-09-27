/**
 * Created by anuraggrover on 05/08/15.
 */

(function (W) {
    'use strict';

    var noop = function () {

    };

    W.PlatformBridge = {

        stub: true,
        onLoadFinished: noop,
        setDebuggableEnabled: noop,
        replaceOverflowMenu: noop,
        updateOverflowMenu: noop,
        allowBackPress: noop,
        allowUpPress: noop,
        getFromCache: function (callbackId, key) {
            if (key === 'isOptInDone') {
                W.callbackFromNative(callbackId, false);
            } else if (key === 'isRegionSelected') {
                W.callbackFromNative(callbackId, false);
            } else {
                W.callbackFromNative(callbackId, false);
            }
        },

        // doGetRequest: function (callbackId, params) {
        //     var baseResponse = {
        //             status_code: 200,
        //             status: 'success'
        //         },
        //         responseJSON;

        //     if (params.indexOf('defaultRegion') !== -1) {
        //         baseResponse.response = JSON.stringify({
        //             id: regions[0].id

        //         });
        //     } else if (params.indexOf('regions') !== -1) {
        //         responseJSON = {
        //             regions: regions
        //         };

        //         W.setTimeout(function () {
        //             baseResponse.response = JSON.stringify(responseJSON);
        //             W.callbackFromNative(callbackId, encodeURIComponent(JSON.stringify(baseResponse)));
        //         }, 3000);

        //         return;
        //     } else if (params.indexOf('issue/') !== -1) {
        //         responseJSON = {"coupon_details": {"code": "HIKEGB", "coupon_type": "static", "flavor": "Online"}};
        //     } else if (params.indexOf('offers') !== -1) {
        //         responseJSON = fullCoupons;
        //     } else if (params.indexOf('bootstrap') !== -1) {
        //         responseJSON = bootstrapResponse;
        //     }

        //     baseResponse.response = JSON.stringify(responseJSON);
        //     W.callbackFromNative(callbackId, encodeURIComponent(JSON.stringify(baseResponse)));
        // },

        // doPostRequest: function (callbackId, data) {
        //     var baseResponse = {
        //         status_code: 200,
        //         status: 'success'
        //     };

        //     data = JSON.parse(data);

        //     if (data.url.indexOf('issue') !== -1) {
        //         baseResponse.response = JSON.stringify({
        //             "coupon": {
        //                 "code": "HIKE20",
        //                 "coupon_type": "static",
        //                 "kind": "online",
        //                 "base_url": null
        //             }
        //         });
        //     }

        //     W.callbackFromNative(callbackId, encodeURIComponent(JSON.stringify(baseResponse)));
        // },

        putInCache: noop,
        checkConnection: function (callbackId) {
            W.callbackFromNative(callbackId, 1);
        },
        logAnalytics: noop,
        logFromJS: noop,
        updateHelperData: noop
    };

})(window);

                // //Check in info is saved in cache, If not fetch from back end
                // if ( ! platformSdk.appData.helperData.profileInfo ) {

                //     this.ninjaServices.getProfile(function( res ) {
                //         console.log( res );
                //         if ( res.stat == 'ok' ) {
                //             console.log( 'getHikeStats success' );

                //             //Save the data in Helper data/Cache
                //             platformSdk.appData.helperData.profileInfo = true;

                //             firstDate = new Date( res.reg_time );
                //             diffDays = Math.round( Math.abs( ( firstDate.getTime() - secondDate.getTime() ) / ( oneDay ) ) );
                //             res.age = diffDays;

                //             if ( res.gender === '' || typeof res.gender === 'undefined' )
                //                 res.gender = 'neutral';
                //             APIData.profileData = res;
                //             PlatformBridge.putInCache( 'profileData', JSON.stringify( res ) );
                //             platformSdk.updateHelperData( platformSdk.appData.helperData );
                //         } else {
                //             platformSdk.ui.showToast( 'Hmm. Something went wrong. Not to worry, try again in a little bit :)' );
                //         }

                //     });

                // } else {

                //     //Profile information is present in cache
                //     platformSdk.nativeReq({
                //         fn: 'getFromCache',
                //         ctx: this,
                //         data: 'profileData',
                //         success: function( response ) {
                //             if ( response === '' )
                //                 PlatformBridge.showToast( 'Unable to fetch profile information.' );

                //             // SANDEEP RUN THE API HERE IF CACHE GET DATA FAIL
                //             else {
                //                 response = decodeURIComponent( response );
                //                 try {
                //                     var response = JSON.parse( response );
                //                     firstDate = new Date( response.reg_time );
                //                     diffDays = Math.round( Math.abs( ( firstDate.getTime() - secondDate.getTime() ) / ( oneDay ) ) );
                //                     response.age = diffDays;

                //                     APIData.profileData = response;
                //                 } catch ( e ) {
                //                     var response = {};
                //                 }
                //             }

                //         }
                //     });
                // }