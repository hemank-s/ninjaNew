(function(W, platformSdk, events) {
    'use strict';

    var utils = require('../util/utils'),
        Constants = require('../../constants.js'),

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


        DOMcache.cta.addEventListener('click', function() {

            if (this.getAttribute('data-screen') == "subscribe") {

                DOMcache.screenCls.classList.remove('subscribeScreen');
                DOMcache.screenCls.classList.add('ftueScreen');

                DOMcache.title.classList.add('animation_fadeout');
                DOMcache.subtitle.remove();
                DOMcache.title.innerHTML = "What do you get?"

                DOMcache.content.innerHTML = Mustache.render(unescape(that.ftueTemplate));
                DOMcache.bottomSection.classList.remove('slideFromBottomCls');
                DOMcache.bottomSection.classList.add('slideFromBottomCls2');

                //


                DOMcache.centerIcon.classList.remove('scaleZeroToOneAnim');
                DOMcache.centerIcon.classList.add('animation_fadeout');
                DOMcache.info.classList.add('animation_fadeout');
                DOMcache.cta.classList.add('animation_fadeout');

            } else {

                //Perform ftue action
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