(function(W) {
    'use strict';

    require('zepto.js');
    W.Mustache = require('mustache.js');

    var platformSdk = require('./libs/js/platformSdk_v2.0');
    var utils = require('./js/util/utils');

    W.notifDataReceived = function(res) {
        console.log('Some notif data recieved');
    };

    platformSdk.ready(function() {
        var environment = null;

        if (platformSdk.bridgeEnabled) {
            environment = platformSdk.appData.helperData.env;
        } else {
            environment = document.body.getAttribute('data-env');
        }

        var config = require('./config')(environment);
        var Constants = require('./constants');

        W.appConfig = config;

        var Application = require('./js/application');

        if (platformSdk.appData === undefined) {
            platformSdk.appData = {};
            platformSdk.appData.helperData = {};


            // save all helperData to localStorage
            platformSdk.events.subscribe('app.noHelperData', function(res) {
                platformSdk.events.publish('app.store.set', {
                    key: '_helperData',
                    value: res
                });
            });

            platformSdk.events.publish('app.store.get', {
                key: '_helperData',
                ctx: this,
                cb: function(res) {
                    if (res.status === 1) {
                        platformSdk.appData.helperData = res.results;
                    }
                }
            });

        }

        if (platformSdk.bridgeEnabled)
            platformSdk.bridge.setDebuggableEnabled(true);
        //if (platformSdk.bridgeEnabled) platformSdk.bridge.setDebuggableEnabled(environment === Constants.PROD_ENV || environment === Constants.DEV_ENV);

        if ((platformSdk.appData && platformSdk.appData.platformUid === undefined) || (platformSdk.appData && platformSdk.appData.platformUid === "")) platformSdk.appData.platformUid = 'VhzmGOSwNYkM6JHE';
        if ((platformSdk.appData && platformSdk.appData.platformToken === undefined) || (platformSdk.appData && platformSdk.appData.platformToken === "")) platformSdk.appData.platformToken = 'mACoHN4G0DI=';

        try {
            platformSdk.appData.helperData = JSON.parse(platformSdk.appData.helperData);
        } catch (e) {
            // platformSdk.helperData = platformSdk.appData.helperData;
        }

        var application = new Application({
            container: document.getElementById("container"),
            route: platformSdk.link && platformSdk.link.route // ToDo: Where is this link being set from
        });

        application.start();

        //window.onResume = application.resumeHikeNinja.bind(application);
        window.intentData = application.getIntentData.bind(application);
    });

})(window);
