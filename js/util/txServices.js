(function(W, platformSdk, events) {
    'use strict';

    var utils = require('./utils.js');
    var checkTimeout = null;

    var Constants = require('../../constants.js');

    var TxService = function() {},
        checkConnection = function(fn, ctx) {

            // For Devices, else case to run on Chrome's onLine method

            if (platformSdk.bridgeEnabled) {
                platformSdk.nativeReq({
                    fn: 'checkConnection',
                    ctx: this,
                    data: "",
                    success: function(response) {
                        if (typeof fn === "function") {
                            fn.call(ctx, response);
                        }
                    }
                });
            } else {
                if (navigator.onLine) {
                    if (typeof fn === "function") fn.call(ctx, navigator.onLine);
                } else {
                    if (typeof fn === "function") fn.call(ctx, -1);
                }
            }
        };

    TxService.prototype = {
        communicate: function(params, fn, x) {
            var that = this,
                requestUrl = params.url,

                successCb = function(res) {
                    console.log("Success", res);

                    var response;

                    platformSdk.events.publish('app/offline', { show: false });

                    try {
                        res = JSON.parse(decodeURIComponent(res));
                        if (platformSdk.bridgeEnabled)
                            res = JSON.parse(res.response);
                    } catch (e) {
                        return false;
                    }

                    if (res) {
                        if (res.stat == "ok") {
                            console.log(res);
                            fn.call(x, res);
                        } else {
                            console.log(res);
                            if (res.stat == 'fail') {
                                events.publish('update.loader', { show: false });
                                console.log(res.data.reason);
                                platformSdk.ui.showToast(res.data.reason);
                            }
                        }
                    } else {
                        if (platformSdk.bridgeEnabled) {
                            // Switch Off Loader and Show Toast
                            events.publish('update.loader', { show: false });
                            platformSdk.ui.showToast("Hmm. Something went wrong. Not to worry, try again in a little bit :)");
                        } else {
                            console.log("Hmm. Something went wrong. Not to worry, try again in a little bit :)");
                        }
                    }
                };

            // For Every API Call start the Loader Once The Api Hits Communicate

            if (params.loader) {
                platformSdk.events.publish('update.loader', { show: false });
            }

            checkConnection(function(connType) {
                if (connType === Constants.ConnectionTypes.NO_NETWORK) {
                    // Show no internet screen.
                    platformSdk.events.publish('app/offline', {
                        show: true
                    });

                    return;
                }

                platformSdk.events.publish('app/offline', {
                    show: false
                });
                if (platformSdk.bridgeEnabled) {
                    if (params.type === 'GET') {
                        console.log('calling service GET', requestUrl);

                        platformSdk.nativeReq({
                            fn: 'doGetRequest',
                            ctx: params.ctx || that,
                            data: requestUrl,
                            success: successCb
                        });
                    } else if (params.type === 'POST') {
                        var data = {};
                        data.url = params.url;

                        if (params.data) {
                            data.params = params.data;
                        } else {
                            data.params = {};
                        }

                        console.log('calling service POST', data);
                        data = JSON.stringify(data);

                        platformSdk.nativeReq({
                            fn: 'doPostRequest',
                            ctx: params.ctx || this,
                            data: data,
                            success: successCb
                        });
                    }
                } else {
                    platformSdk.ajax({
                        type: params.type,
                        url: requestUrl,
                        timeout: 30000,
                        data: params.data !== undefined ? JSON.stringify(params.data) : null,
                        headers: params.headers,
                        success: successCb
                    });
                }



            });
        }
    };

    module.exports = TxService;

})(window, platformSdk, platformSdk.events);