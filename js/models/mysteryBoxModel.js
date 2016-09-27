/**
 * Created by hemanksabharwal on 17/05/15.
 */

(function() {
    'use strict';

    var platformSdk = require( '../../libs/js/platformSdk_v2.0' ),
        utils = require( '../util/utils' ),
        cacheProvider = require( '../util/cacheProvider' ),
        profileModel = require( '../models/profileModel' ),
        rewardsModel = require( '../models/rewardsModel' ),
        TxService = require( '../util/txServices' ),
        NinjaService = require( '../util/ninjaServices' ),

        MysteryBoxModel = function() {
            this.TxService = new TxService();
            this.NinjaService = new NinjaService( this.TxService ); //communication layer
        },

        EMPTY_OBJ_READ_ONLY = {};

    MysteryBoxModel.prototype = {

        getMysteryBoxDetails: function( App ) {

            // Active :: Can Spin The Wheel and Earn Some Gift

            // Inactive :: The Wheel is Not Available as of now

            // Under Cooldown :: The spinning has been done and under cooldown period

            // STUB TO REMOVE

            // var res1 = { 'data': { 'status': 'active', 'rewards': [{ 'id': 1, 'type': 'mysteryBox_medium', 'title': 'Battery + 1' }, { 'id': 2, 'type': 'mysteryBox_medium', 'title': 'Streak + 1' }, { 'id': 3, 'type': 'mysteryBox_low', 'title': 'Battery + 0' }, { 'id': 4, 'type': 'mysteryBox_low', 'title': 'Streak + 0' }, { 'id': 5, 'type': 'mysteryBox_bumper', 'title': 'Custom sticker' }, { 'id': 6, 'type': 'mysteryBox_low', 'title': 'Battery - 1' }, { 'id': 7, 'type': 'mysteryBox_low', 'title': 'streak - 1' }, { 'id': 8, 'type': 'mysteryBox_low', 'title': 'Better Luck next time' }] } };
            // var res2 = { 'data': { 'status': 'inactive', 'rewards': [], 'streakToUnlock': 14 } };
            // var res3 = { 'data': { 'status': 'cooldown', 'rewards': [], 'coolDownTime': 1470916209263 } };

            // this.updateMysteryBoxTab(res1.data, App);

            // STUB TO REMOVE

            App.NinjaService.getMysteryBox(function( res ) {
                console.log( 'MYSTERY BOX DATA IS', res.data );
                this.updateMysteryBoxTab( res.data, App );
            }, this );

        },

        getMysteryBoxRewardDetails: function( data, rId ) {

            for ( var i = 0; i < data.length; i++ ) {
                if ( data[i].id == rId ) {
                    console.log( 'Match found', data[i] );
                    return data[i];
                } else {
                    console.log( 'Reward not found' );
                }
            }
        },

        defineYesterdayWinner: function( data ) {
            var winnerIcon = document.getElementsByClassName( 'winnerIcon' )[0];
            winnerIcon.style.backgroundImage = 'url(\'data:image/png;base64,' + data.dp + '\')';
        },

        defineLuckyBoxRewardIcons: function( data ) {

            var mBoxRewardIcon = document.getElementsByClassName( 'mBoxRewardIcon' );
            
            for ( var i = 0; i < mBoxRewardIcon.length; i++ ) {
                mBoxRewardIcon[i].style.backgroundImage = 'url(\'' + data[i].icon + '\')';
            }
        },

        defineMysteryBoxResultAnimation: function( App, rewardData, cooldownTime ) {

            var that = this;

            var mysteryBoxContainer = document.getElementsByClassName( 'mysteryBoxContainer' )[0]; // Gives Existing List of Rewards in the Template
            //mysteryBoxContainer.innerHTML = '';

            if ( rewardData.value == 'HIGH' ) {
                console.log( 'Bumper Anmation' );
                that.template = require( 'raw!../../templates/mysteryBoxResultAnimation.html' );
                mysteryBoxContainer.innerHTML = Mustache.render( that.template, {
                    mysterBoxReward: rewardData
                });

                var mysteryRewardBumperAction = document.getElementsByClassName( 'mysteryRewardBumperAction' )[0];
                mysteryRewardBumperAction.addEventListener( 'click', function() {

                    var rid = this.getAttribute( 'data-rid' );
                    var rewardType = this.getAttribute( 'data-rewardtype' );

                    var rewardRouter = rewardsModel.getRewardRouter( rewardType );

                    var data = {};
                    data.rewardId = rid;

                    App.NinjaService.getRewardDetails( data, function( res ) {
                        console.log( res.data );
                        App.router.navigateTo( rewardRouter, { 'rewardDetails': res.data, 'rewardId': rid, 'rewardRouter': rewardRouter });
                    }, this );

                });

            } else if ( rewardData.value == 'LOW' ) {
                console.log( 'Low animation :: Figure Out design' );
                that.template = require( 'raw!../../templates/mysteryBoxResultMed.html' );
                mysteryBoxContainer.innerHTML = Mustache.render( that.template, {
                    mysterBoxReward: rewardData
                });

                var mysteryRewardActionLow = document.getElementsByClassName( 'mysteryRewardAction' )[0];
                mysteryRewardActionLow.addEventListener( 'click', function() {
                    that.template = require( 'raw!../../templates/mysteryBoxCooldownTemplate.html' );
                    mysteryBoxContainer.innerHTML = Mustache.render( that.template, {});
                    that.defineCooldown( cooldownTime, App );
                });

                App.NinjaService.getNinjaProfile(function( res ) {
                    console.log( 'REUPDATING THE PROFILE', res.data );
                    profileModel.updateNinjaData( res.data, App );
                }, that );

            } else if ( rewardData.value == 'MED' ) {
                console.log( 'Low animation :: Figure Out Design' );
                that.template = require( 'raw!../../templates/mysteryBoxResultMed.html' );
                mysteryBoxContainer.innerHTML = Mustache.render( that.template, {
                    mysterBoxReward: rewardData
                });

                var mysteryRewardActionMed = document.getElementsByClassName( 'mysteryRewardAction' )[0];
                mysteryRewardActionMed.addEventListener( 'click', function() {
                    that.template = require( 'raw!../../templates/mysteryBoxCooldownTemplate.html' );
                    mysteryBoxContainer.innerHTML = Mustache.render( that.template, {});
                    that.defineCooldown( cooldownTime, App );
                });

                App.NinjaService.getNinjaProfile(function( res ) {
                    console.log( 'REUPDATING THE PROFILE', res.data );
                    profileModel.updateNinjaData( res.data, App );
                }, that );

            }
        },

        mapRewardsToSlice: function( mysteryBoxData ) {
            console.log( mysteryBoxData );

            var slices = document.getElementsByClassName( 'part' );

            for ( var i = 0; i < slices.length; i++ ) {
                slices[i].setAttribute( 'data-reward', mysteryBoxData.rewards[i].id );
            }

            // Set Icons here as well
        },

        getRewardMapping: function( resultId, mysteryBoxData ) {

            var slices = document.getElementsByClassName( 'part' );

            for ( var i = 0; i < slices.length; i++ ) {
                var result = slices[i].getAttribute( 'data-reward' );
                if ( result == resultId ) {
                    var winner = slices[i].getAttribute( 'data-slice' );
                    return winner;
                } else {
                    console.log( 'No reward Found' );
                }
            }
        },

        defineMysteryBoxHistoryAction: function( App, historyData ) {

            var that = this;

            var bumperRow = document.getElementsByClassName( 'bumperRow' );
            var bumperRowIcon = document.getElementsByClassName( 'bumperRowIcon' );

            for ( var i = 0; i < bumperRowIcon.length; i++ ) {
                bumperRowIcon[i].style.backgroundImage = 'url(\'' + historyData[i].icon + '\')';
            }

            for ( var j = 0; j < bumperRow.length; j++ ) {
                bumperRow[j].addEventListener( 'click', function( event ) {

                    var rid = this.getAttribute( 'data-rid' );
                    var url = this.getAttribute( 'data-url' );
                    var rewardType = this.getAttribute( 'data-rewardtype' );

                    var rewardRouter = rewardsModel.getRewardRouter( rewardType );

                    var data = {};
                    data.rewardId = rid;

                    App.NinjaService.getRewardDetails( data, function( res ) {
                        console.log( res.data );
                        App.router.navigateTo( rewardRouter, { 'rewardDetails': res.data, 'rewardId': rid, 'rewardRouter': rewardRouter });
                    }, this );
                });
            }

        },

        defineLuckyBox: function( App, mysteryBoxData ) {

            var that = this;

            var spin = document.getElementById( 'spin' );
            var wheel = document.getElementById( 'wheel' );
            var result = document.getElementById( 'result' );

            var rewardData = null;
            var cooldownTime = null;

            var setText = function( a, b, c ) {
                a.addEventListener( 'transitionend', function() {
                    b.innerText = rewardData.title;
                    that.defineMysteryBoxResultAnimation( App, rewardData, cooldownTime );
                    a.removeEventListener( 'transitionend', setText );
                });
            };

            var deg = 0;
            var rotations = 0;

            spin.addEventListener( 'click', function() {
                rotations++;
                App.NinjaService.getMysteryBoxResult(function( res ) {
                    console.log( res.data );
                    mysteryBoxData.spin_result = res.data.spin_result;

                    // Result of Spin
                    var spinResult = that.getRewardMapping( mysteryBoxData.spin_result.id, mysteryBoxData );
                    console.log( 'WINNER IS', spinResult );
                    rewardData = mysteryBoxData.spin_result;
                    cooldownTime = res.data.cooldown_time;

                    // Define Wheel
                    var stop = spinResult;
                    console.log( 'stop is', stop );
                    var rotationFix = 360 / 16 + 360 / 8 + rotations * 720;
                    deg = 360 / 8 * stop + rotationFix;
                    var rot = 'rotate3d(0,0,1,' + deg + 'deg)';
                    wheel.style.transform = rot;
                    wheel.style.webkitTransform = rot;
                    setText( wheel, result, rewardData );
                }, that );
            });

        },

        defineCooldown: function( spinTimeLeft, App ) {

            var that = this;

            function getTimeRemaining( timeRemaining ) {
                var t = timeRemaining;
                var seconds = Math.floor( ( t / 1000 ) % 60 );
                var minutes = Math.floor( ( t / 1000 / 60 ) % 60 );
                var hours = Math.floor( ( t / ( 1000 * 60 * 60 ) ) % 24 );
                var days = Math.floor( t / ( 1000 * 60 * 60 * 24 ) );
                return {
                    'total': t,
                    'days': days,
                    'hours': hours,
                    'minutes': minutes,
                    'seconds': seconds
                };
            }

            function initializeClock( id, timeRemaining ) {
                var clock = document.getElementById( id );
                var daysSpan = clock.querySelector( '.days' );
                var hoursSpan = clock.querySelector( '.hours' );
                var minutesSpan = clock.querySelector( '.minutes' );
                var secondsSpan = clock.querySelector( '.seconds' );

                function updateClock() {
                    var t = getTimeRemaining( timeRemaining );

                    daysSpan.innerHTML = t.days;
                    hoursSpan.innerHTML = ( '0' + t.hours ).slice( -2 );
                    minutesSpan.innerHTML = ( '0' + t.minutes ).slice( -2 );
                    secondsSpan.innerHTML = ( '0' + t.seconds ).slice( -2 );

                    if ( t.total <= 0 ) {
                        clearInterval( timeinterval );
                        console.log( 'Cooldown has ended' );
                        App.NinjaService.getMysteryBox(function( res ) {
                            console.log( 'MYSTERY BOX DATA IS', res.data );
                            that.updateMysteryBoxTab( res.data, App );
                        }, that );
                    }
                    timeRemaining = timeRemaining - 1000;
                }

                updateClock();
                var timeinterval = setInterval( updateClock, 1000 );
            }

            initializeClock( 'clockdiv', spinTimeLeft * 1000 );
        },

        updateMysteryBoxTab: function( mysteryBoxData, App ) {

            var that = this;

            var mysteryBoxContainer = document.getElementsByClassName( 'mysteryBoxContainer' )[0]; // Gives Existing List of Rewards in the Template
            var showMysteryBoxHistoryButton = false;
            mysteryBoxContainer.innerHTML = '';

            if ( mysteryBoxData.history.length > 0 ) {
                showMysteryBoxHistoryButton = true;
            }

            if ( mysteryBoxData.mstatus == 'inactive' ) {

                // Re Render The Reward Template Only From External HTML
                that.template = require( 'raw!../../templates/mysteryBoxInactiveTemplate.html' );
                mysteryBoxContainer.innerHTML = Mustache.render( that.template, {
                    streakToUnlock: mysteryBoxData.streak_unlock
                });
            } else if ( mysteryBoxData.mstatus == 'active' ) {

                that.template = require( 'raw!../../templates/mysteryBoxActiveTemplate.html' );
                mysteryBoxContainer.innerHTML = Mustache.render( that.template, {
                    previousWinner: mysteryBoxData.yesterday_winner,
                    showMysteryBoxHistoryButton: showMysteryBoxHistoryButton
                });
                that.mapRewardsToSlice( mysteryBoxData );
                that.defineLuckyBox( App, mysteryBoxData );
                that.defineLuckyBoxRewardIcons( mysteryBoxData.rewards );
                that.defineYesterdayWinner( mysteryBoxData.yesterday_winner );

            } else if ( mysteryBoxData.mstatus == 'cooldown' ) {

                console.log( mysteryBoxData );

                that.template = require( 'raw!../../templates/mysteryBoxCooldownTemplate.html' );
                mysteryBoxContainer.innerHTML = Mustache.render( that.template, {
                    showMysteryBoxHistoryButton: showMysteryBoxHistoryButton
                });

                that.defineCooldown( mysteryBoxData.time_left, App );

            } else {
                console.log( 'Add a default state here Later' );
            }

            var mHistoryButton = document.getElementsByClassName( 'mysteryBoxHistory' )[0];

            if ( showMysteryBoxHistoryButton && mHistoryButton ) {
                mHistoryButton.addEventListener( 'click', function() {
                    console.log( 'Opening your Mystery Box History' );

                    that.template = require( 'raw!../../templates/mysteryBoxHistory.html' );
                    mysteryBoxContainer.innerHTML = Mustache.render( that.template, {
                        mysteryBoxHistory: mysteryBoxData.history
                    });

                    that.defineMysteryBoxHistoryAction( App, mysteryBoxData.history );
                });

            }

            var swipeTab = document.getElementsByClassName( 'swipeTab' )[0];

            if ( swipeTab ) {
                console.log( 'Scrolling to top' );
                swipeTab.scrollTop = 0;
            }

        }

    };

    module.exports = new MysteryBoxModel();
})();
