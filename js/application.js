(function(W, events) {
    'use strict';

    var WorkspaceController = require('./controllers/WorkspaceController'),
        HomescreenController = require('./controllers/HomescreenController'),
        ProfilescreenController = require('./controllers/ProfilescreenController'),
        MysteryBoxController = require('./controllers/MysteryBoxController'),
        StickerRewardController = require('./controllers/StickerRewardController'),

        Router = require('./util/router'),
        utils = require('./util/utils'),
        profileModel = require('./models/profileModel'),
        rewardsModel = require('./models/rewardsModel'),
        activityModel = require('./models/activityModel'),
        mysteryBoxModel = require('./models/mysteryBoxModel'),
        cacheProvider = require('./util/cacheProvider'),
        expHandlerAB = require('./util/expHandlerAB'),
        TxService = require('./util/txServices'),
        NinjaService = require('./util/ninjaServices'),
        Constants = require('../constants.js');

    // Notifications Toast
    var toastTime = null;

    var notifToast = document.getElementById('notifToast');
    var nToastObject = events.subscribe('update.notif.toast', function(params) {
        clearTimeout(toastTime);
        notifToast.innerHTML = params.text;
        if (params.show) {
            notifToast.classList.add('slideUp');
        } else {
            notifToast.classList.remove('slideUp');
        }
        notifToast.toggleClass('nToast', params.show);
        toastTime = setTimeout(function() { events.publish('update.notif.toast', { show: false, text: '' }); }, 2000);
    });

    // Full Screen Loader
    var loader = document.getElementById('loader');
    var loadObject = events.subscribe('update.loader', function(params) {
        loader.toggleClass('loading', params.show);
    });

    // Tap State Events :: Touch Start And Touch End

    document.addEventListener('touchstart', function(evt) {
        evt = evt || window.event;
        var target = evt.target;
        if (target.classList.contains('buttonTapWhite')) {
            target.classList.add('tapStateWhite');
        } else if (target.classList.contains('buttonTapRed')) {
            target.classList.add('tapStateRed');
        } else if (target.classList.contains('buttonTapOffer')) {
            target.classList.add('tapStateOffer');
        } else {
            return;
        }
    }, false);

    document.addEventListener('touchend', function(evt) {
        evt = evt || window.event;
        var target = evt.target;
        if (target.classList.contains('buttonTapWhite')) {
            target.classList.remove('tapStateWhite');
        } else if (target.classList.contains('buttonTapRed')) {
            target.classList.remove('tapStateRed');
        } else if (target.classList.contains('buttonTapOffer')) {
            target.classList.remove('tapStateOffer');
        } else {
            return;
        }
    }, false);

    // Block Connection Tab
    var isBlock = document.getElementById('blockScreen');
    var isBlockObject = events.subscribe('app/block', function(params) {
        isBlock.toggleClass('block-msg', params.show);
    });

    var unBlockApp = function() {
        var self = this;
        var id = '' + platformSdk.retrieveId('app.menu.om.block');

        platformSdk.appData.block = 'false';
        if (platformSdk.bridgeEnabled) platformSdk.unblockChatThread();
        platformSdk.events.publish('app.state.block.hide');
        platformSdk.updateOverflowMenu(id, {
            'title': 'Block'
        });

        //utils.toggleBackNavigation( false );
        events.publish('update.loader', {
            show: false
        });
        events.publish('app/block', {
            show: false
        });
    };

    var Application = function(options) {
        this.container = options.container;
        this.routeIntent = options.route;

        // Router Controller
        this.router = new Router();
        // Profile Controller
        this.workspaceController = new WorkspaceController();
        this.homescreenController = new HomescreenController();
        this.profilescreenController = new ProfilescreenController();
        this.mysteryBoxController = new MysteryBoxController();
        this.stickerRewardController = new StickerRewardController();
        // Communication Controller
        this.TxService = new TxService();
        this.NinjaService = new NinjaService(this.TxService); //communication layer
    };

    Application.prototype = {

        // Three Dot Menu Overflow Events Subscriptions
        OverflowEvents: function() {

            var that = this;

            // Notifications ON/OFF
            platformSdk.events.subscribe('app.menu.om.mute', function(id) {
                id = '' + platformSdk.retrieveId('app.menu.om.mute');

                if (platformSdk.appData.mute == 'true') {
                    platformSdk.appData.mute = 'false';
                    platformSdk.muteChatThread();
                    platformSdk.updateOverflowMenu(id, {
                        'is_checked': 'true'
                    });
                } else {
                    platformSdk.appData.mute = 'true';
                    platformSdk.muteChatThread();
                    platformSdk.updateOverflowMenu(id, {
                        'is_checked': 'false'
                    });
                }
            });

            // Block Event From The Three Dot
            platformSdk.events.subscribe('app.menu.om.block', function(id) {
                id = '' + platformSdk.retrieveId('app.menu.om.block');
                if (platformSdk.appData.block === 'true') {
                    unBlockApp();
                    that.start();
                } else {
                    platformSdk.appData.block = 'true';
                    platformSdk.blockChatThread();
                    platformSdk.events.publish('app.state.block.show');
                    platformSdk.updateOverflowMenu(id, {
                        'title': 'Unblock'
                    });
                    utils.toggleBackNavigation(false);
                    events.publish('app/block', {
                        show: true
                    });
                    events.publish('app/offline', {
                        show: false
                    });

                }
            });

            //Help
            platformSdk.events.subscribe('app.menu.om.help', function(id) {
                that.checkAndDownloadBot('+hikecs+', Constants.INVOKE_MODE_THREE_DOT);
            });
        },


        // To download a bot
        downloadBot: function(botname) {

            var obj = {
                "apps": [{
                    "name": botname
                }]
            };

            var data = {
                url: appConfig.INSTALL_URL,
                params: obj
            };

            data = JSON.stringify(data);

            platformSdk.nativeReq({
                fn: 'doPostRequest',
                ctx: this,
                data: data,
                success: function(res) {
                    console.log(res);
                }
            });

        },


        // Check if a bot exists
        // invokeMode  - 1    ->  App start -> Just download bot (dont open) if bot doesnot exist
        //             - 2    ->  Three dot click
        //                             - If bot exist, open it.
        //                             - If bot doesnt exist, just keep checking (but no download)                 

        checkAndDownloadBot: function(botname, invokeMode) {

            console.log("checking bot", botname, invokeMode);

            var that = this;

            platformSdk.nativeReq({
                fn: 'isBotExist',
                ctx: this,
                data: botname,
                success: function(response) {
                    //app start
                    console.log(Constants);
                    if (invokeMode == Constants.INVOKE_MODE_APP_START) {
                        if (response == "false") {
                            console.log("Downloading CS microapp for the first time");
                            that.downloadBot(botname.replace(/\+/g, ''));
                        }
                    } else if (invokeMode == Constants.INVOKE_MODE_THREE_DOT) {
                        if (response == 'false') {
                            console.log("Downloading again");
                            that.checkAndDownloadBot(botname, invokeMode);
                        } else {
                            console.log("cs microapp found");
                            that.openExistingBot(botname);
                        }
                    }
                }
            });
        },



        openExistingBot: function(botname) {

            var jsonobj = {
                'screen': 'microapp',
                'msisdn': botname,
                'isBot': true,
                'extra_data': Constants.CS_HELP_JSON
            };
            console.log("Opening CS microapp");
            PlatformBridge.openActivity(JSON.stringify(jsonobj));
        },


        // Setting Up The Three Dot Menu
        initOverflowMenu: function() {

            var that = this;

            var omList = [{
                    'title': 'Notifications',
                    'en': 'true',
                    'eventName': 'app.menu.om.mute',
                    'is_checked': platformSdk.appData.mute === 'true' ? 'false' : 'true'
                },

                {
                    'title': platformSdk.appData.block === 'true' ? 'Unblock' : 'Block',
                    'en': 'true',
                    'eventName': 'app.menu.om.block'
                },

                {
                    'title': 'Help',
                    'en': 'true',
                    'eventName': 'app.menu.om.help'

                }
            ];


            that.OverflowEvents();
            platformSdk.setOverflowMenu(omList);
            that.checkAndDownloadBot('+hikecs+', Constants.INVOKE_MODE_APP_START);

        },

        // If card Data Comes From Any Forwarded Card that calls Open Non Messaging Bot Here
        getIntentData: function(data) {
            var that = this;
            //console.log(data);
            data = decodeURIComponent(data);
            data = JSON.parse(data);

        },

        backPressTrigger: function() {

            var batteryStreakInfoContainer = document.getElementsByClassName('batteryStreakInfoContainer')[0];

            if (!batteryStreakInfoContainer.classList.contains('hideClass'))
                batteryStreakInfoContainer.classList.add('hideClass');
            else
                this.router.back();
        },

        goToNinjaProfilePage: function() {
            var that = this;
            var data = {};

            data.ninjaRewardsCollection = cacheProvider.getFromCritical('ninjaRewards');
            data.ninjaProfileData = cacheProvider.getFromCritical('ninjaProfileData');
            data.ninjaActivityData = cacheProvider.getFromCritical('ninjaStats');

            that.router.navigateTo('/', data);
        },

        getRoute: function() {
            var that = this;

            // ToDo: Remvove this if block from here?
            if (this.routeIntent !== undefined) {

            } else {
                events.publish('app.store.get', {
                    key: '_routerCache',
                    ctx: this,
                    cb: function(r) {
                        if (r.status === 1 && platformSdk.bridgeEnabled) {
                            try {
                                that.router.navigateTo(r.results.route, r.results.cache);
                            } catch (e) {
                                that.router.navigateTo('/');
                            }
                        } else {
                            that.router.navigateTo('/');
                        }
                    }
                });
            }
        },

        calculateBatteryChange: function() {

        },

        start: function() {

            var self = this;
            self.$el = $(this.container);

            self.initOverflowMenu();

            utils.toggleBackNavigation(false);
            document.querySelector('.unblockButton').addEventListener('click', function() {
                unBlockApp();
                self.start();
            }, false);

            // No Internet Connection Tab
            var noInternet = document.getElementById('nointernet');
            var noInternetObject = events.subscribe('app/offline', function(params) {
                noInternet.toggleClass('no-internet-msg', params.show);

            });

            platformSdk.events.subscribe('onBackPressed', function() {
                self.backPressTrigger();
            });

            platformSdk.events.subscribe('onUpPressed', function() {
                self.backPressTrigger();
            });

            // Ninja ftue
            this.router.route('/', function(data) {
                self.container.innerHTML = '';
                self.workspaceController.render(self.container, self, data);
                utils.toggleBackNavigation(false);
            });

            // Ninja Home screen
            this.router.route('/home', function(data) {
                self.container.innerHTML = '';
                self.homescreenController.render(self.container, self, data);
                utils.toggleBackNavigation(false);
            });

            // Ninja Home screen
            this.router.route('/profile', function(data) {
                self.container.innerHTML = '';
                self.profilescreenController.render(self.container, self, data);
                utils.toggleBackNavigation(true);
            });
            // Ninja Home screen
            this.router.route('/mysteryBox', function(data) {
                self.container.innerHTML = '';
                self.mysteryBoxController.render(self.container, self, data);
                utils.toggleBackNavigation(true);
            });

            // Sticker Features :: User For Early Access Stickers and Animated Stickers as of now 
            this.router.route('/stickerReward', function(data) {
                self.container.innerHTML = '';
                self.stickerRewardController.render(self.container, self, data);
                utils.toggleBackNavigation(true);
            });


            var subscriptionCompleted = cacheProvider.getFromCritical('subscriptionCompleted');
            var ftueCompleted = cacheProvider.getFromCritical('ftueCompleted');

            if (!subscriptionCompleted || !ftueCompleted) {
                self.router.navigateTo('/home');
            } else {
                self.NinjaService.getNinjaProfile(function(res) {
                    cacheProvider.setInCritical('userProfileData', res.data);
                    var oldHash = cacheProvider.getFromCritical('oldHash');
                    var newHash = res.data.rewards_hash;
                    utils.hashCheck(oldHash, newHash);
                    if (res.data.status != 'inactive' && res.data.status != 'locked') {
                        profileModel.updateNinjaData(res.data, self, true);
                    }
                }, self);
            }
        }
    };

    module.exports = Application;

})(window, platformSdk.events);
