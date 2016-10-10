/*jshint loopfunc: true */

(function(W, platformSdk, events) {
    'use strict';

    var utils = require('../util/utils'),
        Constants = require('../../constants.js'),
        cacheProvider = require('../util/cacheProvider'),
        rewardsModel = require('../models/rewardsModel'),
        
        ProfilescreenController = function(options) {
            this.template = require('raw!../../templates/ninjaProfileScreen.html');
        };


    ProfilescreenController.prototype.bind = function(App, data, mBoxHistory) {

        var DOMcache = {
            unlockedReward: document.getElementsByClassName('unlockedReward')[0],
            ugcTypeRow: document.getElementsByClassName('ugcTypeRow'),
            redeemedRewardRow: document.getElementsByClassName('redeemedRewardRow'),
            mysteryRedeemedRewardRow: document.getElementsByClassName('mysteryRedeemedRewardRow')
        };

        //Swipe
        function Swipe( t,n ) {'use strict';function e() {h = E.children,w = Array( h.length ),m = t.getBoundingClientRect().width || t.offsetWidth,E.style.width = h.length * m + 'px';for ( var n = h.length; n--; ) {var e = h[n];e.style.width = m + 'px',e.setAttribute( 'data-index', n ),f.transitions && ( e.style.left = n * -m + 'px',a( n, b > n ? -m : n > b ? m : 0, 0 ) )}f.transitions || ( E.style.left = b * -m + 'px' ),t.style.visibility = 'visible'}function i() {b ? r( b - 1 ) : n.continuous && r( h.length - 1 )}function o() {h.length - 1 > b ? r( b + 1 ) : n.continuous && r( 0 )}function r( t,e ) {if ( b != t ) {if ( f.transitions ) {for ( var i = Math.abs( b - t ) - 1,o = Math.abs( b - t ) / ( b - t ); i--; )a( ( t > b ? t : b ) - i - 1, m * o, 0 );a( b, m * o, e || T ),a( t, 0, e || T )}else d( b * -m, t * -m, e || T );b = t,v( n.callback && n.callback( b, h[b] ) )}}function a( t,n,e ) {s( t, n, e ),w[t] = n}function s( t,n,e ) {var i = h[t],o = i && i.style;o && ( o.webkitTransitionDuration = o.MozTransitionDuration = o.msTransitionDuration = o.OTransitionDuration = o.transitionDuration = e + 'ms',o.webkitTransform = 'translate(' + n + 'px,0)' + 'translateZ(0)',o.msTransform = o.MozTransform = o.OTransform = 'translateX(' + n + 'px)' )}function d( t,e,i ) {if ( ! i )return E.style.left = e + 'px',void 0;var o = +new Date,r = setInterval(function() {var a = +new Date - o;return a > i ? ( E.style.left = e + 'px',y && c(),n.transitionEnd && n.transitionEnd.call( event, b, h[b] ),clearInterval( r ),void 0 ) : ( E.style.left = ( e - t ) * ( Math.floor( 100 * ( a / i ) ) / 100 ) + t + 'px',void 0 )}, 4 )}function c() {p = setTimeout( o, y )}function u() {y = 0,clearTimeout( p )}var l = function() {},v = function( t ) {setTimeout( t || l, 0 )},f = { addEventListener:!! window.addEventListener,touch:'ontouchstart'in window || window.DocumentTouch && document instanceof DocumentTouch,transitions:function( t ) {var n = ['transformProperty','WebkitTransform','MozTransform','OTransform','msTransform'];for ( var e in n )if ( void 0 !== t.style[n[e]] )return ! 0;return ! 1}( document.createElement( 'swipe' ) ) };if ( t ) {var h,w,m,E = t.children[0];n = n || {};var p,x,b = parseInt( n.startSlide, 10 ) || 0,T = n.speed || 300,y = n.auto || 0,L = {},g = {},k = { handleEvent:function( t ) {switch ( t.type ){case'touchstart':this.start( t );break;case'touchmove':this.move( t );break;case'touchend':v( this.end( t ) );break;case'webkitTransitionEnd':case'msTransitionEnd':case'oTransitionEnd':case'otransitionend':case'transitionend':v( this.transitionEnd( t ) );break;case'resize':v( e.call() )}n.stopPropagation && t.stopPropagation()},start:function( t ) {var n = t.touches[0];L = { x:n.pageX,y:n.pageY,time:+new Date },x = void 0,g = {},E.addEventListener( 'touchmove', this, ! 1 ),E.addEventListener( 'touchend', this, ! 1 )},move:function( t ) {if ( ! ( t.touches.length > 1 || t.scale && 1 !== t.scale ) ) {n.disableScroll && t.preventDefault();var e = t.touches[0];g = { x:e.pageX - L.x,y:e.pageY - L.y },x === void 0 && ( x = !! ( x || Math.abs( g.x ) < Math.abs( g.y ) ) ),x || ( t.preventDefault(),u(),g.x = g.x / ( ! b && g.x > 0 || b == h.length - 1 && 0 > g.x ? Math.abs( g.x ) / m + 1 : 1 ),s( b - 1, g.x + w[b - 1], 0 ),s( b, g.x + w[b], 0 ),s( b + 1, g.x + w[b + 1], 0 ) )}},end:function() {var t = +new Date - L.time,e = 250 > Number( t ) && Math.abs( g.x ) > 20 || Math.abs( g.x ) > m / 2,i = ! b && g.x > 0 || b == h.length - 1 && 0 > g.x,o = 0 > g.x;x || ( e && ! i ? ( o ? ( a( b - 1, -m, 0 ),a( b, w[b] - m, T ),a( b + 1, w[b + 1] - m, T ),b += 1 ) : ( a( b + 1, m, 0 ),a( b, w[b] + m, T ),a( b - 1, w[b - 1] + m, T ),b += -1 ),n.callback && n.callback( b, h[b] ) ) : ( a( b - 1, -m, T ),a( b, 0, T ),a( b + 1, m, T ) ) ),E.removeEventListener( 'touchmove', k, ! 1 ),E.removeEventListener( 'touchend', k, ! 1 )},transitionEnd:function( t ) {parseInt( t.target.getAttribute( 'data-index' ), 10 ) == b && ( y && c(),n.transitionEnd && n.transitionEnd.call( t, b, h[b] ) )} };return e(),y && c(),f.addEventListener ? ( f.touch && E.addEventListener( 'touchstart', k, ! 1 ),f.transitions && ( E.addEventListener( 'webkitTransitionEnd', k, ! 1 ),E.addEventListener( 'msTransitionEnd', k, ! 1 ),E.addEventListener( 'oTransitionEnd', k, ! 1 ),E.addEventListener( 'otransitionend', k, ! 1 ),E.addEventListener( 'transitionend', k, ! 1 ) ),window.addEventListener( 'resize', k, ! 1 ) ) : window.onresize = function() {e()},{ setup:function() {e()},slide:function( t,n ) {r( t, n )},prev:function() {u(),i()},next:function() {u(),o()},getPos:function() {return b},kill:function() {u(),E.style.width = 'auto',E.style.left = 0;for ( var t = h.length; t--; ) {var n = h[t];n.style.width = '100%',n.style.left = 0,f.transitions && s( t, 0, 0 )}f.addEventListener ? ( E.removeEventListener( 'touchstart', k, ! 1 ),E.removeEventListener( 'webkitTransitionEnd', k, ! 1 ),E.removeEventListener( 'msTransitionEnd', k, ! 1 ),E.removeEventListener( 'oTransitionEnd', k, ! 1 ),E.removeEventListener( 'otransitionend', k, ! 1 ),E.removeEventListener( 'transitionend', k, ! 1 ),window.removeEventListener( 'resize', k, ! 1 ) ) : window.onresize = null} }}}( window.jQuery || window.Zepto ) && function( t ) {t.fn.Swipe = function( n ) {return this.each(function() {t( this ).data( 'Swipe', new Swipe( t( this )[0],n ) )})}}( window.jQuery || window.Zepto );

        var workspace = this;
        var containers = document.getElementsByClassName('tab-data');
        var bullets = document.getElementsByClassName('comp__tab');
        var emptyBorder = document.getElementsByClassName('emptyBorder');
        var profileSrc = cacheProvider.getFromCritical('profileSrc');

        function defineNinjaHomeScreenTabs() {

            containers[0].style.height = window.innerHeight + 'px';
            containers[1].style.height = window.innerHeight + 'px';
            containers[2].style.height = window.innerHeight + 'px';

            window.slider =
                new Swipe(document.getElementById('sliderTabs'), {
                    continuous: false,
                    disableScroll: false,
                    stopPropagation: false,
                    callback: function(pos) {

                        var i = bullets.length;
                        while (i--) {
                            bullets[i].className = ' comp__tab';
                        }
                        bullets[pos].className = 'comp__tab selected';
                        emptyBorder[0].style.marginLeft = 33.33*pos+13.5+"%";
                        document.getElementById("sliderTabs").style.height = containers[pos].offsetHeight + "px";

                    }

                });

            document.getElementById("sliderTabs").style.height = containers[0].offsetHeight + "px";

            bullets[0].className = 'comp__tab selected';
            bullets[2].className = 'comp__tab ';
            bullets[1].className = 'comp__tab ';
            
            if (bullets.length) {
                console.log(bullets);
                for (var i = 0; i < bullets.length; i++) {
                    bullets[i].addEventListener("click", function(event) {
                        event.preventDefault();
                        var parent = this.parentNode;
                        var index = Array.prototype.indexOf.call(parent.children, this);
                        slider.slide(index);
                    });
                }
            }

            if(profileSrc && profileSrc == 'ugc'){
                bullets[2].click();
            }
        }
        var elem = document.getElementsByClassName('rewardRow')
        for (var i = 0; i < elem.length; i++) {
            var H = window.getComputedStyle(elem[i]).height;
            elem[i].querySelector('.redeemedRewardIcon').style.height = H;
            if (elem[i].querySelector('.rewardStreakWrapper'))
                elem[i].querySelector('.rewardStreakWrapper').style.lineHeight = H;
        }

        defineNinjaHomeScreenTabs();
        this.updateIcons(DOMcache, data, mBoxHistory)
        this.updateLinks(DOMcache, data, App);
    };

    ProfilescreenController.prototype.updateIcons = function (DOMcache,data, mBoxHistory){
        
        // UGC ICONS

        console.log(data);
        if(data.ugcList){
            for(var i= 0;i<data.ugcList.length;i++){
            if(data.ugcList[i].icon){
                DOMcache.ugcTypeRow[i].getElementsByClassName('ugcTypeIcon')[0].style.backgroundImage = "url('" + data.ugcList[i].icon + "')";
            }else{
                console.log("Set a default icon for ugc");
            }
        }    
        }
        
        // REWARD ICONS
        if(data.rewardsData.redeemedRewards){
            for(var j=0;j<data.rewardsData.redeemedRewards.length;j++){
                if(data.rewardsData.redeemedRewards[j].icon){
                    DOMcache.redeemedRewardRow[j].getElementsByClassName('redeemedRewardIcon')[0].style.backgroundImage = "url('" + data.rewardsData.redeemedRewards[j].icon + "')";
                }else{
                    console.log("Set a default icon for rewards");
                }
            }    
        }

        // Mboxhostory icon

        if(mBoxHistory){
            for(var z=0;z<mBoxHistory.length;z++){
                if(mBoxHistory[z].icon){
                    DOMcache.mysteryRedeemedRewardRow[z].getElementsByClassName('redeemedRewardIcon')[0].style.backgroundImage = "url('" + mBoxHistory[z].icon + "')";
                }else{
                    console.log("Set a default icon for rewards");
                }
            }
        }
        
    };

    ProfilescreenController.prototype.updateLinks = function (DOMcache,data, App){
        
        // UGC LINKS
            if (DOMcache.ugcTypeRow.length) {
                for (var i = 0; i < DOMcache.ugcTypeRow.length; i++) {
                    DOMcache.ugcTypeRow[i].addEventListener('click', function(event) {

                        // Get Reward related information
                        var ugcType = this.getAttribute('data-type');
                        cacheProvider.setInCritical('profileSrc', 'ugc');
                        App.router.navigateTo('/ugc', { type: ugcType });
                    });
                }
            }
        // REWARD LINKS
            if (DOMcache.redeemedRewardRow.length) {
                for (var i = 0; i < DOMcache.redeemedRewardRow.length; i++) {
                    DOMcache.redeemedRewardRow[i].addEventListener('click', function(event) {

                        // Get Reward related information
                        var rewardState = this.getAttribute('data-state');
                        var rewardType = this.getAttribute('data-rewardtype');
                        var rewardRouter = rewardsModel.getRewardRouter(rewardType);
                        var rewardId = this.getAttribute('data-rewardId');

                        var data = {};
                        data.rewardId = rewardId;

                        if (platformSdk.bridgeEnabled) {
                            App.NinjaService.getRewardDetails(data, function(res) {
                                console.log(res.data);
                                App.router.navigateTo(rewardRouter, { "rewardDetails": res.data, "rewardId": rewardId, "rewardRouter": rewardRouter });
                            }, this);
                        } else {
                            var res = {
                                "hicon": "",
                                "title": "GIF Sharing",
                                "desc": "Another way of expressing inside chats.",
                                "sanctioned": false
                            };
                            App.router.navigateTo(rewardRouter, { "rewardDetails": res, "rewardId": rewardId, "rewardRouter": rewardRouter });
                        }
                    });
                }
            }
        };

    ProfilescreenController.prototype.render = function(ctr, App, data) {

        var that = this;

        var ninjaStats = cacheProvider.getFromCritical('ninjaStats');
        var ninjaUgc = cacheProvider.getFromCritical('ninjaUgc');
        var ninjaMysteryBoxData = cacheProvider.getFromCritical('ninjaMysteryBoxData');
        var boxHistory = [];
        
        data.ugcList = ninjaUgc;
        console.log("reward data recieved is ", data);

        if(ninjaMysteryBoxData && ninjaMysteryBoxData.history.length > 0){
            boxHistory = ninjaMysteryBoxData.history;
        }

        if(!platformSdk.bridgeEnabled){
            ninjaStats = {  'chatThemes': { 'rec': 10, 'sent': 10 }, 'files': { 'rec': 155, 'sent': 139 }, 'messages': { 'rec': 1203, 'sent': 187 }, 'statusUpdates': { 'count': 10 }, 'stickers': { 'rec': 133, 'sent': 17 } } ;
            ninjaUgc = {"stat":"ok","data":{"content":[{"type":"jfl","title":"Just for Laugh","stitle":"Submit funny new memes and get recognized","icon":"s3 url here"},{"type":"quotes","title":"Daily quotes","stitle":"Submit famous quotes and get recognized","icon":"s3 url here"},{"type":"facts","title":"Facts","stitle":"Submit fun and new facts and get recognized","icon":"s3 url here"}]}};
            ninjaUgc = ninjaUgc.data.content;
        }   

        utils.changeBotTitle('Profile');
        
        that.el = document.createElement('div');
        that.el.className = 'profileScreenContainer animation_fadein noselect';
        that.el.innerHTML = Mustache.render(unescape(that.template), {ninjaMysteryBoxRewards: boxHistory,ninjaRedeemedRewards: data.rewardsData.redeemedRewards, ninjaActivityData:ninjaStats, ninjaUgcData:ninjaUgc});
        ctr.appendChild(that.el);
        events.publish('update.loader', { show: false });
        that.bind(App, data, boxHistory);
    };

    ProfilescreenController.prototype.destroy = function() {

    };

    module.exports = ProfilescreenController;

})(window, platformSdk, platformSdk.events);
