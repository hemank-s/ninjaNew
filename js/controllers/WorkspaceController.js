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
            subscribeCta: document.getElementsByClassName('subscribeCta')[0],
            centerIcon: document.getElementsByClassName('centreIcon')[0],
            info: document.getElementsByClassName('info')[0],
            title: document.getElementsByClassName('title_subscribe')[0],
            screenCls: document.getElementsByClassName('screenCls')[0],
            content: document.getElementsByClassName('content')[0],
            bottomSection: document.getElementsByClassName('bottomSection')[0],
        };


        DOMcache.bottomSection.addEventListener('webkitAnimationEnd', function() {
            that.animHandlerFtue(DOMcache);

        });

        DOMcache.bottomSection.addEventListener('animationend', function() {
            that.animHandlerFtue(DOMcache);
        });


        document.addEventListener('click', function(evt) {

            var target = evt.target;


            if (target.classList.contains('workspaceCta')) {

                if (target.getAttribute('data-screen') == "subscribe") {


                    if (platformSdk.bridgeEnabled) {
                        App.NinjaService.subscribeHandler({}, function(res) {

                            if (res.stat === 'ok') {

                                cacheProvider.setInCritical('subscriptionCompleted', true);

                                that.subscribeScreenAnimation(DOMcache, App, that.ftueTemplate);

                                //Fetch Profile Data in Background 
                                App.NinjaService.getNinjaProfile(function(res) {
                                    console.log(res.data);
                                    cacheProvider.setInCritical('userProfileData', res.data);

                                    var oldHash = cacheProvider.getFromCritical('oldHash');
                                    var newHash = res.data.rewards_hash;
                                    utils.hashCheck(oldHash, newHash);

                                    if (res.data.status != 'inactive' && res.data.status != 'locked') {
                                        profileModel.updateNinjaData(res.data, App, false);
                                    }

                                }, that);
                            } else
                                events.publish('update.notif.toast', { show: true, heading: 'Bamm', details: 'Something went wrong while subscribing', notifType: 'notifNeutral' });
                        }, that);

                    } else {
                        that.subscribeScreenAnimation(DOMcache, App, that.ftueTemplate);
                    }

                } else {
                    /* Animation FTUE screen dismiss */
                    that.ftueScreenDismissAnimation(DOMcache, App);
                }

            }
        });
    };


    WorkspaceController.prototype.animHandlerFtue = function(DOMcache) {

        var marginTop, elem1, elem2, ftue = false;
        if (document.getElementsByClassName('screenCls')[0].classList.contains('subscribeScreen')) {
            elem1 = DOMcache.info;
            elem2 = DOMcache.subscribeCta;

        } else {
            elem1 = document.getElementsByClassName('infoRow')[2];
            elem2 = document.getElementsByClassName('ftueCta')[0];
            ftue = true;
        }

        if (!ftue)
            var time = 0;
        else
            var time = 600;

        setTimeout(function() {
            marginTop = (window.innerHeight - elem1.offsetTop - elem1.offsetHeight - elem2.offsetHeight) / 2;
            elem2.style.marginTop = marginTop + 'px';
            elem2.style.opacity = "1";

        }, time);

    };

    WorkspaceController.prototype.subscribeScreenAnimation = function(DOMcache, App, template) {

        DOMcache.centerIcon.classList.remove('scaleZeroToOneAnim');
        //DOMcache.centerIcon.style.opacity = 0;
        DOMcache.centerIcon.style.height = "0px";
        DOMcache.screenCls.classList.remove('subscribeScreen');
        DOMcache.screenCls.classList.add('ftueScreen');
        DOMcache.title.classList.add('titleAnimFtueCls');
        DOMcache.title.classList.add('animation_fadeout');
        DOMcache.title.innerHTML = "What do you get?";
        DOMcache.content.innerHTML = Mustache.render(unescape(template));
        DOMcache.bottomSection.classList.remove('slideFromBottomCls');
        //DOMcache.bottomSection.classList.add('slideFromBottomCls2');
        DOMcache.info.classList.add('animation_fadeout');
        DOMcache.subscribeCta.classList.add('animation_fadeout');

    };

    WorkspaceController.prototype.ftueScreenDismissAnimation = function(DOMcache, App) {
        DOMcache.title.classList.remove('animation_fadeout');
        DOMcache.title.classList.remove('titleAnimFtueCls');
        DOMcache.title.classList.add('fadeOutTranslateCls');
        DOMcache.content.classList.add('fadeOutTranslateCls2');
        DOMcache.bottomSection.classList.remove('slideFromBottomCls2');
        DOMcache.bottomSection.classList.add('animation_fadeout');
        cacheProvider.setInCritical('ftueCompleted', true);
        window.setTimeout(function() {
            App.router.navigateTo('/home');
        }, 300);

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
