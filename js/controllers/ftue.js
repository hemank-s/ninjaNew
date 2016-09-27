(function( W, platformSdk, events ) {
    'use strict';

    var utils = require( '../util/utils' ),
        Constants = require( '../../constants.js' ),

        FtueController = function( options ) {
            this.template = require( 'raw!../../templates/ftue.html' );
        };

    FtueController.prototype.bind = function( App, data ) {

        var ftue = this;      
    };

    FtueController.prototype.render = function( ctr, App, data ) {

        var that = this;
        that.el = document.createElement( 'div' );
        that.el.className = 'ftueController animation_fadein noselect';
        that.el.innerHTML = Mustache.render( unescape( that.template ) );
        ctr.appendChild( that.el );
        events.publish( 'update.loader', { show: false });
        that.bind( App, data );
    };

    FtueController.prototype.destroy = function() {

    };

    module.exports = FtueController;

})( window, platformSdk, platformSdk.events );
