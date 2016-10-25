/*jshint loopfunc: true */

(function(W, events) {
    'use strict';

    var WorkspaceController = require('./controllers/WorkspaceController'),
        HomescreenController = require('./controllers/HomescreenController'),
        ProfilescreenController = require('./controllers/ProfilescreenController'),
        MysteryBoxController = require('./controllers/MysteryBoxController'),
        StickerRewardController = require('./controllers/StickerRewardController'),
        ExclusiveFeatureController = require('./controllers/ExclusiveFeatureController'),
        UgcController = require('./controllers/UgcController'),
        CustomStickerCreateController = require('./controllers/CustomStickerCreateController'),
        CustomStickerHistoryController = require('./controllers/CustomStickerHistoryController'),
        UpgradeController = require('./controllers/upgradeController'),
        CustomStickerStatusController = require('./controllers/CustomStickerStatusController'),
        UserStateController = require('./controllers/UserStateController'),

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

    var toastTime = null;
    var notifToast = document.getElementById('notifToast');


    // Notifications Toast
    var nToastObject = events.subscribe('update.notif.toast', function(params) {

        clearTimeout(toastTime);

        var notifHeading = notifToast.getElementsByClassName('notifHeading')[0];
        var notifDetails = notifToast.getElementsByClassName('notifDetails')[0];

        notifHeading.innerHTML = params.heading;
        notifDetails.innerHTML = params.details;
        notifHeading.classList.add(params.notifType); //notifSuccess //notifNeutral //notifError

        notifToast.classList.add('slideUp');
        notifToast.classList.remove('slideDown');
        notifToast.toggleClass('nToast', params.show);

        toastTime = setTimeout(function() { events.publish('update.notif.toast.remove', { show: false, heading: '', details: '', notifType: 'none' }); }, 3000);
    });

    var nToastObject2 = events.subscribe('update.notif.toast.remove', function(params) {

        clearTimeout(toastTime);

        notifToast.classList.remove('slideUp');
        notifToast.classList.add('slideDown');
        setTimeout(function() {
            notifToast.toggleClass('nToast', params.show);
            var notifHeading = notifToast.getElementsByClassName('notifHeading')[0];
            var notifDetails = notifToast.getElementsByClassName('notifDetails')[0];

            notifHeading.innerHTML = params.heading;
            notifDetails.innerHTML = params.details;
            notifHeading.classList.add(params.notifType); //notifSuccess //notifNeutral //notifError
        }, 3000);
    });

    // Full Screen Loader
    var loader = document.getElementById('loader');
    var loadObject = events.subscribe('update.loader', function(params) {
        var loaderText = document.getElementsByClassName('ninjaLoaderText')[0];
        if (params.text) {
            loaderText.innerHTML = params.text;
        }
        loader.toggleClass('loading', params.show);
    });

    // TO use :- platformSdk.events.publish('update.threeDotLoader', { elem:hemank,show: true, text:'Unwrapping' });

    var threeDotLoadObject = events.subscribe('update.threeDotLoader', function(params) {

        params.elem.innerHTML = params.text;
        params.elem.style.opacity = 0.6;
        params.elem.fontWeight = 400;

        var span1 = document.createElement('span');
        span1.innerHTML = '.';
        var span2 = document.createElement('span');
        span2.innerHTML = '.';
        var span3 = document.createElement('span');
        span3.innerHTML = '.';

        params.elem.appendChild(span1);
        params.elem.appendChild(span2);
        params.elem.appendChild(span3);

        params.elem.toggleClass('threeDotSpan', params.show);

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
        this.exclusiveFeatureController = new ExclusiveFeatureController();
        this.ugcController = new UgcController();
        this.customCreateController = new CustomStickerCreateController();
        this.customHistoryController = new CustomStickerHistoryController();
        this.upgradeController = new UpgradeController();
        this.customStatusController = new CustomStickerStatusController();
        this.userStateController = new UserStateController();

        // Communication Controller
        this.TxService = new TxService();
        this.NinjaService = new NinjaService(this.TxService); //communication layer
    };

    Application.prototype = {

        // Three Dot Menu Overflow Events Subscriptions
        defnineNinjaFeedback: function() {
            var self = this;
            var emojiQuestions = [];
            var textQuestions = [];

            var feedbackData = {
                "feedback": {
                    "launch_screen": "/",
                    "title_emoji": "https://staging.im.hike.in/sticker?catId=excusenglish&stId=007_exe_idk.png&resId=XHDPI&image=True",
                    "mdata": [{
                        "qid": 1,
                        "title_options": [{
                            "aid": 1,
                            "answer_emoji": "https://s-media-cache-ak0.pinimg.com/564x/44/34/f5/4434f5f63b3a0994a4e8412d178a29ac.jpg"
                        }, {
                            "aid": 2,
                            "answer_emoji": "https://4.bp.blogspot.com/-oos28eSe-rE/Vud2j-kTc8I/AAAAAAAACLA/NGV8TBnDLHs221yMlzbn968ppf3zaftJA/s1600/uh-oh-smiley.jpg"
                        }, {
                            "aid": 3,
                            "answer_emoji": "https://s-media-cache-ak0.pinimg.com/236x/0b/8b/f5/0b8bf599defde741aa9228ace6203092.jpg"
                        }, {
                            "aid": 4,
                            "answer_emoji": "https://lh4.ggpht.com/9HID9PrbyXvGJbmViL8TSJJJt9iR_RovFfSlKaNC6Vdy7I710mOB1OXfl2EiSTKeMMbm=w300"
                        }],
                        "title_question": "Did you like Hike ninja ?",
                        "type": "emoji"
                    }, {
                        "qid": 2,
                        "title_question": "What more rewards would you like ?",
                        "type": "text"
                    }]
                }
            };



            var feedbackQuestions = feedbackData.feedback.mdata;
            var html = '';
            var emojiTemplate = require('raw!../templates/emojiQuesTemplate.html');
            var textTemplate = require('raw!../templates/textQuesTemplate.html');
            var quesContainer = document.getElementsByClassName('quesContainer')[0];


            for (var i = 0; i < feedbackQuestions.length; i++) {


                if (feedbackQuestions[i].type == 'emoji')
                    html += Mustache.render(unescape(emojiTemplate), feedbackQuestions[i]);
                else if (feedbackQuestions[i].type == 'text')
                    html += Mustache.render(unescape(textTemplate), feedbackQuestions[i]);
            }

            quesContainer.innerHTML = html;

            var feedbackDomCache = {
                questionEmoji: document.getElementsByClassName('questionEmoji')[0],
                questionText: document.getElementsByClassName('questionText')[0],
                feedbackContainer: document.getElementsByClassName('feedbackContainer')[0],
                emojiFeedback: document.getElementsByClassName('emojiFeedback')[0],
                closeFeedbackEmoji: document.getElementsByClassName('closeFeedbackEmoji')[0],
                closeFeedbackText: document.getElementsByClassName('closeFeedbackText')[0],
                successScreen: document.getElementsByClassName('feedbackSuccess')[0],
                submitNinjaFeedback: document.getElementsByClassName('submitNinjaFeedback')[0],
                emojiContainer: document.getElementsByClassName('emoji-feedback')[0],
            };


            var questionEmojiAnswer = feedbackDomCache.questionEmoji.getElementsByClassName('questionEmojiAnswer');

            for (var j = 0; j < questionEmojiAnswer.length; j++) {
                questionEmojiAnswer[j].addEventListener('click', function() {

                    var url = appConfig.API_URL + '/feedback/' + this.parentNode.parentNode.getAttribute('data-qid');
                    var data = {
                        "feedback": {
                            aid: this.getAttribute('data-aid'),
                            type: "emoji",
                            a_text: ""
                        }
                    }

                    if (platformSdk.bridgeEnabled) {
                        self.NinjaService.submitFeedback(url, data, function(res) {
                            if (res.stat == "ok") {
                                feedbackDomCache.questionEmoji.classList.add('hide');
                                feedbackDomCache.questionText.classList.remove('hide');
                                feedbackDomCache.emojiFeedback.classList.add('hide');
                                cacheProvider.setInCritical('feedbackData', '');
                            } else if (res.stat == 'fail') {
                                events.publish('update.notif.toast', { show: true, heading: 'Bamm', details: res.data.reason, notifType: 'notifNeutral' });
                            } else {
                                events.publish('update.notif.toast', { show: true, heading: 'Bamm', details: "Something went wrong. Please try again", notifType: 'notifNeutral' });
                            }
                        }, self);
                    } else {
                        feedbackDomCache.questionEmoji.classList.add('hide');
                        feedbackDomCache.questionText.classList.remove('hide');
                        feedbackDomCache.emojiFeedback.classList.add('hide');
                    }
                }, false);
            }

            /* Close of first question emoji */
            feedbackDomCache.closeFeedbackEmoji.addEventListener('click', function() {
                feedbackDomCache.questionEmoji.classList.add('hide');
            }, false);


            /* Close of second question text */
            feedbackDomCache.closeFeedbackText.addEventListener('click', function() {
                feedbackDomCache.questionText.classList.add('hide');
                feedbackDomCache.successScreen.classList.remove('hide');
                feedbackDomCache.emojiContainer.classList.remove('right0');
                window.setTimeout(function() {
                    feedbackDomCache.successScreen.classList.add('animation_fadeout');
                }, 1400);
            }, false);


            /* Click on Submit */
            feedbackDomCache.submitNinjaFeedback.addEventListener('click', function() {

                var url = appConfig.API_URL + '/feedback/' + this.parentNode.parentNode.getAttribute('data-qid');
                var data = {
                    "feedback": {
                        aid: "",
                        type: "text",
                        a_text: document.getElementById('follow-up-response').value
                    }
                };

                if (platformSdk.bridgeEnabled) {
                    self.NinjaService.submitFeedback(url, data, function(res) {
                        if (res.stat == "ok") {
                            feedbackDomCache.questionText.classList.add('hide');
                            feedbackDomCache.successScreen.classList.remove('hide');
                            feedbackDomCache.emojiContainer.classList.remove('right0');
                            cacheProvider.setInCritical('feedbackData', '');

                            window.setTimeout(function() {
                                feedbackDomCache.successScreen.classList.add('animation_fadeout');
                            }, 1400);
                        } else if (res.stat == 'fail') {
                            events.publish('update.notif.toast', { show: true, heading: 'Bamm', details: res.data.reason, notifType: 'notifNeutral' });
                        } else {
                            events.publish('update.notif.toast', { show: true, heading: 'Bamm', details: "Something went wrong. Please try again", notifType: 'notifNeutral' });
                        }
                    }, self);
                } else {
                    feedbackDomCache.questionText.classList.add('hide');
                    feedbackDomCache.successScreen.classList.remove('hide');
                    feedbackDomCache.emojiContainer.classList.remove('right0');

                    window.setTimeout(function() {
                        feedbackDomCache.successScreen.classList.add('animation_fadeout');
                    }, 1400);
                }
            }, false);

            /* Click on smiley*/
            feedbackDomCache.emojiFeedback.addEventListener('click', function() {
                feedbackDomCache.emojiContainer.classList.add('right0');
                feedbackDomCache.emojiFeedback.classList.add('hide');
                feedbackDomCache.questionEmoji.classList.remove('hide');
            }, false);
        },

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

                // if ('activeElement' in document) {
                //     document.activeElement.blur();
                // }

                cacheProvider.setInCritical('profileSrc', '');
                if (platformSdk.bridgeEnabled) {
                    utils.changeBarColors('#3C367C', '#494D95');
                }

                id = '' + platformSdk.retrieveId('app.menu.om.block');
                if (platformSdk.appData.block === 'true') {
                    unBlockApp();
                    //that.start();
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

            var loader = document.getElementById('loader');
            var ugcContainer = document.querySelectorAll('.ugcContainer');
            var customHistoryWrapper = document.querySelectorAll('.customHistoryWrapper');
            var batteryStreakInfoContainer = document.querySelectorAll('.batteryStreakInfoContainer');
            var mysteryBoxSpinning = cacheProvider.getFromCritical('mysteryBoxSpinning');

            if (loader.classList.contains('loading')) {
                return;
            } else if (ugcContainer.length > 0) {
                this.ugcBackPressHandler();
            } else if (customHistoryWrapper.length > 0 && customHistoryWrapper[0].getAttribute('data-src') == "create") {
                events.publish('update.loader', { show: true, text: 'Refreshing Rewards!!' });
                utils.restartApp(this, true);
            } else if (mysteryBoxSpinning) {
                events.publish('update.notif.toast', { show: true, heading: 'Bazinga!', details: 'Please wait for the wheel of fortune to complete the spin', notifType: 'notifSuccess' });
                return;
            } else if (batteryStreakInfoContainer.length > 0 && !batteryStreakInfoContainer[0].classList.contains('hideClass')) {
                batteryStreakInfoContainer[0].classList.add('hideClass');
                utils.toggleBackNavigation(true);
                return;
            } else {
                this.router.back();
            }

        },

        ugcBackPressHandler: function() {

            var quoteName = document.querySelectorAll('.quoteName');
            var quoteAuthor = document.querySelectorAll('.quoteAuthor');
            var jflImage = document.querySelectorAll('.jflImage');
            var successCard = document.querySelectorAll('.successCard');
            var ugcType = document.getElementsByClassName('ugcContainer')[0].getAttribute('data-type');
            var that = this;
            var confirmPopup = document.getElementsByClassName('ugcBackPopupContainer');

            if (!quoteName.length && !quoteAuthor.length && !jflImage.length)
                return;

            if (ugcType == Constants.UGC_TYPE.QUOTE) {

                if (((quoteName.length > 0 && quoteName[0].innerHTML.length > 0) ||
                        (quoteAuthor.length > 0 && quoteAuthor[0].innerHTML.length > 0)) && successCard[0].classList.contains('hideClass'))
                    confirmPopup[0].classList.remove('hideClass');
                else
                    that.router.back();

            } else if (ugcType == Constants.UGC_TYPE.FACT) {

                if (quoteName.length > 0 && quoteName[0].innerHTML.length > 0 && successCard[0].classList.contains('hideClass'))
                    confirmPopup[0].classList.remove('hideClass');
                else
                    that.router.back();

            } else {

                if (jflImage[0].getAttribute('filePath') && successCard[0].classList.contains('hideClass'))
                    confirmPopup[0].classList.remove('hideClass');
                else
                    that.router.back();
            }

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

        start: function() {

            var self = this;
            self.$el = $(this.container);

            self.initOverflowMenu();


            self.defnineNinjaFeedback();

            utils.toggleBackNavigation(false);
            document.querySelector('.unblockButton').addEventListener('click', function() {
                unBlockApp();
                //self.start();
            }, false);

            document.querySelector('.goToSettings').addEventListener('click', function() {
                PlatformBridge.openIntent('android.settings.SETTINGS');
            }, false);

            // No Internet Connection Tab
            var noInternet = document.getElementById('nointernet');
            var noInternetObject = events.subscribe('app/offline', function(params) {
                noInternet.toggleClass('no-internet-msg', params.show);
                utils.toggleBackNavigation(false);
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
                // self.container.innerHTML = '';
                self.mysteryBoxController.render(self.container, self, data);
                utils.toggleBackNavigation(true);
            });

            // Sticker Features :: User For Early Access Stickers and Animated Stickers as of now 
            this.router.route('/stickerReward', function(data) {
                self.container.innerHTML = '';
                self.stickerRewardController.render(self.container, self, data);
                utils.toggleBackNavigation(true);
            });

            this.router.route('/exclusiveFeature', function(data) {
                self.container.innerHTML = '';
                self.exclusiveFeatureController.render(self.container, self, data);
                utils.toggleBackNavigation(true);
            });

            this.router.route('/ugc', function(data) {
                self.container.innerHTML = '';
                self.ugcController.render(self.container, self, data);
                utils.toggleBackNavigation(true);
            });

            this.router.route('/customCreate', function(data) {
                self.container.innerHTML = '';
                self.customCreateController.render(self.container, self, data);
                utils.toggleBackNavigation(true);
            });

            this.router.route('/customHistory', function(data) {
                self.container.innerHTML = '';
                self.customHistoryController.render(self.container, self, data);
                utils.toggleBackNavigation(true);
            });

            this.router.route('/upgrade', function(data) {
                self.container.innerHTML = '';
                self.upgradeController.render(self.container, self, data);
                utils.toggleBackNavigation(false);
            });

            this.router.route('/customStatus', function(data) {
                self.container.innerHTML = '';
                self.customStatusController.render(self.container, self, data);
                utils.toggleBackNavigation(true);
            });

            this.router.route('/userState', function(data) {
                self.container.innerHTML = '';
                self.userStateController.render(self.container, self, data);
                utils.toggleBackNavigation(false);
            });

            var subscriptionCompleted = cacheProvider.getFromCritical('subscriptionCompleted');
            var ftueCompleted = cacheProvider.getFromCritical('ftueCompleted');

            if (platformSdk.appData.block === 'true') {
                events.publish('app/block', {
                    show: true
                });
            }

            if (!subscriptionCompleted || !ftueCompleted) {
                self.router.navigateTo('/');
            } else {
                self.NinjaService.getNinjaProfile(function(res) {
                    cacheProvider.setInCritical('userProfileData', res.data);
                    var oldHash = cacheProvider.getFromCritical('oldHash');
                    var newHash = res.data.rewards_hash;
                    utils.hashCheck(oldHash, newHash);
                    if (platformSdk.bridgeEnabled) {
                        if (utils.upgradeRequired(res.data.hike_version, platformSdk.appData.appVersion, false)) {
                            self.router.navigateTo('/upgrade', 'hike');
                        } else if (utils.upgradeRequired(res.data.app_v, platformSdk.appData.mAppVersionCode, true)) {
                            self.router.navigateTo('/upgrade', 'ninja');
                        } else if (res.data.status == 'inactive' || res.data.status == 'locked') {
                            self.router.navigateTo('/userState', res.data);
                        } else {
                            profileModel.updateNinjaData(res.data, self, true);
                        }
                    }
                }, self);
            }
        }
    };

    module.exports = Application;

})(window, platformSdk.events);
