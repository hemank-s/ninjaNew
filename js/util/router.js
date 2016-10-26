(function(W, events) {
    'use strict';

    var cacheProvider = require('./cacheProvider'),
        utils = require('./utils.js');

    var Router = function() {
        this.routes = {};
        this.history = [];
        this.prevData = null;

        this.getCache();
    };

    var _routerCache = {};

    var unload = function() {
        // ToDo: Redundant code
        events.publish('app.store.set', {
            key: '_routerCache',
            value: _routerCache
        });
    };

    // window.onbeforeunload = unload;

    Router.prototype.getCache = function() {
        events.publish('app.store.get', {
            key: '_routerCache',
            ctx: this,
            cb: function(r) {
                if (r.status === 1) {
                    this.history = r.results.history || [];
                }
            }
        });
    };

    Router.prototype.route = function(route, callback) {
        this.routes[route] = callback;
    };

    Router.prototype.navigateTo = function(route, data) {


        if (typeof data === "undefined")
            data = {};

        var historyTop = this.history[this.history.length - 1];

        utils.checkFeedback(route);
        utils.changeThreeDot(route);

        if (historyTop && historyTop.route === route) {
            if (data.subPath !== undefined && (data.subPath === historyTop.data.subPath)) {
                return;
            } else {
                // Navigate to sub path. Don't push into History. Replace top item with this one.
                this.history[this.history.length - 1] = {
                    route: route,
                    data: data
                };
            }
        } else {

            /* Don't store mystery box path in route */

            if (route != "/mysteryBox") {
                this.history.push({
                    route: route,
                    data: data
                });
            }

        }

        this.routes[route](data);

        _routerCache['route'] = route;
        _routerCache['cache'] = data;
        _routerCache['history'] = this.history;

        unload();

    };

    Router.prototype.back = function() {
        var history = this.history,
            historyItem;

        if (history.length !== 1) {
            history.pop();
        }

        historyItem = history[history.length - 1];

        utils.checkFeedback(historyItem.route);
        utils.changeThreeDot(historyItem.route);

        if (historyItem.route == '/' && !historyItem.data) {
            historyItem.data = {
                ninjaRewardsCollection: cacheProvider.getFromCritical('ninjaRewards'),
                ninjaActivityData: cacheProvider.getFromCritical('ninjaStats'),
                ninjaProfileData: cacheProvider.getFromCritical('ninjaProfileData')
            };
        }

        this.routes[historyItem.route](historyItem.data);
    };

    module.exports = Router;
})(window, platformSdk.events);