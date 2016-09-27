(function( W, platformSdk, events ) {
    'use strict';

    var utils = require( '../util/utils' ),
        Constants = require( '../../constants.js' ),

        FaqDetailsController = function( options ) {
            this.template = require( 'raw!../../templates/faqRewards.html' );
        };

    FaqDetailsController.prototype.bind = function( App, data ) {

        var ftue = this;      
    };

    FaqDetailsController.prototype.render = function( ctr, App, data ) {

        var that = this;
        that.el = document.createElement( 'div' );
        that.el.className = 'ftueController animation_fadein noselect';
        that.el.innerHTML = Mustache.render( unescape( that.template ) );
        ctr.appendChild( that.el );
        events.publish( 'update.loader', { show: false });
        that.bind( App, data );
    };

    FaqDetailsController.prototype.destroy = function() {

    };

    module.exports = FaqDetailsController;

})( window, platformSdk, platformSdk.events );
