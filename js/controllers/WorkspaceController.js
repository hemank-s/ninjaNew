(function(W, platformSdk, events) {
    'use strict';

    var utils = require('../util/utils'),
        Constants = require('../../constants.js'),
        cacheProvider = require('../util/cacheProvider'),
        profileModel = require('../models/profileModel'),
        activityModel = require('../models/activityModel'),

        WorkspaceController = function(options) {
            this.template = require('raw!../../templates/workspace.html');
            this.ftueTemplate = require('raw!../../templates/ftueTemplate.html');
        };

    WorkspaceController.prototype.bind = function(App, data) {

        var that = this;

        var DOMcache = {

            cta: document.getElementsByClassName('cta')[0],
            centerIcon: document.getElementsByClassName('centreIcon')[0],
            info: document.getElementsByClassName('info')[0],
            title: document.getElementsByClassName('title')[0],
            subtitle: document.getElementsByClassName('subtitle')[0],
            screenCls: document.getElementsByClassName('screenCls')[0],
            content: document.getElementsByClassName('content')[0],
            bottomSection: document.getElementsByClassName('bottomSection')[0]
        };


        document.addEventListener('click', function(evt) {

            var target = evt.target;

            if (target.classList.contains('cta')) {

                if (target.getAttribute('data-screen') == "subscribe") {

                    DOMcache.screenCls.classList.remove('subscribeScreen');
                    DOMcache.screenCls.classList.add('ftueScreen');
                    DOMcache.title.classList.add('titleAnimFtueCls');
                    DOMcache.title.classList.add('animation_fadeout');
                    DOMcache.subtitle.remove();
                    DOMcache.title.innerHTML = "What do you get?";
                    DOMcache.content.innerHTML = Mustache.render(unescape(that.ftueTemplate));
                    DOMcache.bottomSection.classList.remove('slideFromBottomCls');
                    DOMcache.bottomSection.classList.add('slideFromBottomCls2');
                    DOMcache.centerIcon.classList.remove('scaleZeroToOneAnim');
                    DOMcache.centerIcon.classList.add('animation_fadeout');
                    DOMcache.info.classList.add('animation_fadeout');
                    DOMcache.cta.classList.add('animation_fadeout');


                    /* App.NinjaService.subscribeHandler({}, function(res) {

                        if (res.stat === 'ok') {

                            cacheProvider.setInCritical('subscriptionCompleted', true);

                             Animation For the FTUE Screen 
                            DOMcache.screenCls.classList.remove('subscribeScreen');
                            DOMcache.screenCls.classList.add('ftueScreen');
                            DOMcache.title.classList.add('titleAnimFtueCls');
                            DOMcache.title.classList.add('animation_fadeout');
                            DOMcache.subtitle.remove();
                            DOMcache.title.innerHTML = "What do you get?";
                            DOMcache.content.innerHTML = Mustache.render(unescape(that.ftueTemplate));
                            DOMcache.bottomSection.classList.remove('slideFromBottomCls');
                            DOMcache.bottomSection.classList.add('slideFromBottomCls2');
                            DOMcache.centerIcon.classList.remove('scaleZeroToOneAnim');
                            DOMcache.centerIcon.classList.add('animation_fadeout');
                            DOMcache.info.classList.add('animation_fadeout');
                            DOMcache.cta.classList.add('animation_fadeout');


                            //Fetch Profile Data in Background 
                            App.NinjaService.getNinjaProfile(function(res) {
                               console.log(res.data);
                                cacheProvider.setInCritical('userProfileData', res.data);
                                if (res.data.status != 'inactive' && res.data.status != 'locked') {
                                    profileModel.updateNinjaData(res.data, App);
                                    activityModel.fetchNinjaActivity('lifetime');
                                }

                            }, that);


                        } else
                            utils.showToast('Something went wrong while subscribing');

                    }, that);

                      */

                } else {

                    /* Animation FTUE screen dismiss */
                    DOMcache.title.classList.remove('animation_fadeout');
                    DOMcache.title.classList.remove('titleAnimFtueCls');
                    DOMcache.title.classList.add('fadeOutTranslateCls');
                    DOMcache.content.classList.add('fadeOutTranslateCls2');
                    DOMcache.bottomSection.classList.remove('slideFromBottomCls2');
                    DOMcache.bottomSection.classList.add('animation_fadeout');
                    cacheProvider.setInCritical('ftueCompleted', true);
                    App.router.navigateTo('/home');
                }

            } else if (target.classList.contains('crossIcon')) {

                App.NinjaService.unsubscribeHandler({}, function(res) {
                    if (res.stat === 'ok')
                        PlatformBridge.closeWebView();
                    else
                        utils.showToast('Something went wrong while unsubscribing');
                }, that);
            }
        });
    };

    WorkspaceController.prototype.render = function(ctr, App, data) {

        var that = this;
        that.el = document.createElement('div');
        that.el.className = 'workspaceContainer animation_fadein noselect';
        that.el.innerHTML = Mustache.render(unescape(that.template));
        ctr.appendChild(that.el);
        events.publish('update.loader', { show: false });
        that.bind(App, data);
    };

    WorkspaceController.prototype.destroy = function() {

    };

    module.exports = WorkspaceController;

})(window, platformSdk, platformSdk.events);