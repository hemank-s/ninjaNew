(function(W, platformSdk, events) {
    'use strict';

    var cacheProvider = require('./cacheProvider.js');

    HTMLElement.prototype.toggleClass = function(classToken, flag) {
        var element = this;

        if (flag !== undefined) {
            if (flag) {
                element.classList.add(classToken);
            } else {
                element.classList.remove(classToken);
            }
        } else {
            element.classList.toggle(classToken);
        }
    };

    var ConnTypes = require('../../constants').ConnectionTypes,
        _extend = function(toObj, fromObj) {
            for (var key in fromObj) {
                if (fromObj.hasOwnProperty(key) && toObj[key] === undefined) {
                    toObj[key] = fromObj[key];
                }
            }
        },
        imageOptimizationConnTypes = [ConnTypes.NO_NETWORK, ConnTypes.UNKNOWN, ConnTypes.TWO_G],
        noop = function() {

        },
        memoizationCache = {},
        basePrefix = 'id_',
        idCounter = 1;

    module.exports = {
        isFunction: function(fn) {
            return typeof fn === 'function';
        },

        extend: function(toObj, fromObj) {
            _extend(toObj.prototype, fromObj.prototype);
            _extend(toObj, fromObj);

            return toObj;
        },

        serializeParams: function(params) {
            var serializedParams = [];

            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    serializedParams.push(key + '=' + params[key]);
                }
            }

            return serializedParams.join('&');
        },

        empty: function(element) {
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }

            return element;
        },

        getUniqueId: function(prefix) {
            return (prefix || basePrefix) + idCounter++;
        },

        simpleClone: function(obj) {
            return JSON.parse(JSON.stringify(obj));
        },

        loadImage: function(params) {
            var imageEl = document.createElement('img');

            imageEl.src = params.src;

            imageEl.onload = function() {
                params.success(imageEl, params.src);
            };

            imageEl.onError = function() {
                params.error(imageEl);
            };
        },

        toOptimizeForImages: function(connectionType) {
            if (memoizationCache[connectionType] === undefined) {
                memoizationCache[connectionType] = imageOptimizationConnTypes.indexOf(connectionType) !== -1;
            }

            return memoizationCache[connectionType];
        },

        getNodeIndex: function(elem) {
            var index = 0;

            while (elem == elem.previousElementSibling) {
                index++;
            }

            return index;
        },

        twoStringCompare: function(str1, str2) {
            var n = null;
            n = str1.localeCompare(str2);
            return n;
        },

        createCustomEvent: function(eventName) {
            var customEvent;

            if (W.CustomEvent) {
                customEvent = new CustomEvent(eventName, {
                    bubbles: true
                });
            } else {
                customEvent = document.createEvent('Event');
                customEvent.initEvent(eventName, true, false);
            }

            return customEvent;

        },

        // Toggle Back Navigation Set For Allowing Back and Up Press Inside The Application

        toggleBackNavigation: function(enable) {

            enable = enable ? 'true' : 'false';

            if (platformSdk.bridgeEnabled) {
                platformSdk.bridge.allowBackPress(enable);
                // Allow up press in only available since Platform Version 5
                platformSdk.bridge.allowUpPress && platformSdk.bridge.allowUpPress(enable);
            }
        },

        hasClass: function(el, className) {
            if (el.classList)
                return el.classList.contains(className);
            else
                return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
        },

        addClass: function(el, className) {
            if (el.classList)
                el.classList.add(className);
            else if (!hasClass(el, className)) el.className += ' ' + className;
        },

        removeClass: function(el, className) {
            if (el.classList)
                el.classList.remove(className);
            else if (hasClass(el, className)) {
                var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
                el.className = el.className.replace(reg, ' ');
            }
        },

        openWebView: function(url) {
            if (platformSdk.bridgeEnabled) {
                platformSdk.bridge.openFullPage('FAQ', url);
            } else {
                console.log("Opening Web page to specified url");
            }
        },

        // Show Toast in Android or console
        showToast: function(toast) {
            if (platformSdk.bridgeEnabled) {
                platformSdk.ui.showToast(toast);
            } else {
                console.log(toast);
            }
        },

        rgba2hex: function(rgb) {

            rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
            return (rgb && rgb.length === 4) ? "#" +
                ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
                ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
                ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';

        },

        microAppUpgradeRequired: function(minVersion, appVersion) {

            minVersion = minVersion.toString();
            appVersion = appVersion.toString();

            minVersion = minVersion.match(/\d/g);
            appVersion = appVersion.match(/\d/g);

            var minVersionLength = minVersion.length;
            var appVersionLength = appVersion.length;

            var maxLength = minVersionLength > appVersionLength ? minVersionLength : appVersionLength;

            var appVer_part, minVer_part;

            for (var i = 0; i < maxLength; i++) {

                minVer_part = parseInt(minVersion[i], 10) || 0;
                appVer_part = parseInt(appVersion[i], 10) || 0;

                if (minVer_part == appVer_part) {
                    continue;
                } else if (appVer_part > minVer_part) {
                    return false;
                } else {
                    return true;
                }

            }
        },

        upgradeRequired: function(minVersion, appVersion) {

            minVersion = minVersion.match(/\d/g);
            appVersion = appVersion.match(/\d/g);

            var minVersionLength = minVersion.length;
            var appVersionLength = appVersion.length;

            var maxLength = minVersionLength > appVersionLength ? minVersionLength : appVersionLength;

            var appVer_part, minVer_part;

            for (var i = 0; i < maxLength; i++) {

                minVer_part = parseInt(minVersion[i], 10) || 0;
                appVer_part = parseInt(appVersion[i], 10) || 0;

                if (minVer_part == appVer_part) {
                    continue;
                } else if (appVer_part > minVer_part) {
                    return false;
                } else {
                    return true;
                }

            }

        },

        changeBotTitle: function(title) {
            if (platformSdk.bridgeEnabled) {
                try {
                    PlatformBridge.changeBotTitle(title);
                } catch (e) {
                    console.log('Error in changing bot title');
                }
            }
        },

        // Sets action bar and status bar color
        changeBarColors: function(scolor, acolor) {
            if (platformSdk.bridgeEnabled) {
                PlatformBridge.setStatusBarColor(scolor);
                PlatformBridge.setActionBarColor(acolor);
            }
        },

        hashCheck: function(oldHash, newHash) {

            var that = this;
            if (oldHash && newHash) {
                var compareHash = that.twoStringCompare(oldHash, newHash);
                if (compareHash != 0) {
                    cacheProvider.setInCritical('fetchRewards', true);
                    cacheProvider.setInCritical('oldHash', newHash);
                } else
                    cacheProvider.setInCritical('fetchRewards', false);

            } else {
                cacheProvider.setInCritical('fetchRewards', true);
                cacheProvider.setInCritical('oldHash', newHash);

            }
        },

        restartApp: function(App, existingUser) {

            var that = this;
            var profileModel = require('../models/profileModel');

            App.NinjaService.getNinjaProfile(function(res) {

                cacheProvider.setInCritical('userProfileData', res.data);
                var oldHash = cacheProvider.getFromCritical('oldHash');
                var newHash = res.data.rewards_hash;
                that.hashCheck(oldHash, newHash);
                if (res.data.status != 'inactive' && res.data.status != 'locked') {
                    profileModel.updateNinjaData(res.data, App, existingUser);
                }
            }, App);

        },

        debounce: function(func, wait, immediate) {
            var timeout;
            return function() {
                var context = this,
                    args = arguments;
                var later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        },

        openGallery: function(element, size, callback) {
            size = 100000000;
            if (platformSdk.bridgeEnabled) {
                try {
                    platformSdk.nativeReq({
                        ctx: self,
                        fn: 'chooseFile',
                        success: function(fileUrl) {

                            fileUrl = decodeURIComponent(fileUrl);
                            fileUrl = JSON.parse(fileUrl);

                            if (!fileUrl.filesize || fileUrl.filesize === 0) {
                                events.publish('update.notif.toast', { show: true, heading: 'Bamm', details: 'Sorry. Your image couldn’t be updated. Could you try again with another files, please?', notifType: 'notifNeutral' });
                                return;
                            }

                            // Check Max Upload Size :: To Be Decided
                            if (fileUrl.filesize > size) {
                                events.publish('update.notif.toast', { show: true, heading: 'Bamm', details: 'Max file upload size is 10 Mb', notifType: 'notifNeutral' });
                                return;
                            }
                            element.style.backgroundImage = 'url(\'file://' + fileUrl.filePath + '\')';
                            callback(fileUrl.filePath);
                        }
                    });

                } catch (err) {
                    events.publish('update.notif.toast', { show: true, heading: 'Bamm', details: 'Sorry. Your image couldn’t be updated. Could you try again with another files, please?', notifType: 'notifNeutral' });
                }

            } else {
                element.classList.add('test');
                callback();

            }
        }
    };

})(window, platformSdk, platformSdk.events);
