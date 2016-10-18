(function(W, platformSdk, events) {
    'use strict';

    var utils = require('../util/utils'),
        Constants = require('../../constants.js'),
        cacheProvider = require('../util/cacheProvider'),
        mysteryBoxModel = require('../models/mysteryBoxModel'),
        profileModel = require('../models/profileModel'),

        MysteryBoxController = function(options) {
            this.template = require('raw!../../templates/mysteryBoxActiveTemplate.html');

        };

    MysteryBoxController.prototype.bind = function(App, data) {

        var that = this;

        document.addEventListener('click', function(event) {

            if (event.target.classList.contains('mysteryBox_CrossIcon')) {
                console.log("cross clicked");
                App.router.navigateTo('/home', {});
            }
        });

        if (!platformSdk.bridgeEnabled)
            var data = { 'history': [], 'yesterday_winner': { 'name': 'Sandeep' }, 'mstatus': 'active', 'rewards': [{ 'id': 1, 'type': 'mysteryBox_medium', 'title': 'Battery + 1' }, { 'id': 2, 'type': 'mysteryBox_medium', 'title': 'Streak + 1' }, { 'id': 3, 'type': 'mysteryBox_low', 'title': 'Battery + 0' }, { 'id': 4, 'type': 'mysteryBox_low', 'title': 'Streak + 0' }, { 'id': 5, 'type': 'mysteryBox_bumper', 'title': 'Custom sticker' }, { 'id': 6, 'type': 'mysteryBox_low', 'title': 'Battery - 1' }, { 'id': 7, 'type': 'mysteryBox_low', 'title': 'streak - 1' }, { 'id': 8, 'type': 'mysteryBox_low', 'title': 'Better Luck next time' }] };
        mysteryBoxModel.updateMysteryBoxTab(data, App);
    };


    MysteryBoxController.prototype.render = function(ctr, App, data) {

        var that = this;

        utils.changeBotTitle('Lucky Box');
        if (platformSdk.bridgeEnabled) {
            utils.changeBarColors('#3C367C', '#494D95');
        }

        that.el = document.createElement('div');
        that.el.className = 'mysteryBoxContainer animation_fadein noselect';
        that.el.innerHTML = Mustache.render(unescape(that.template));
        ctr.appendChild(that.el);
        events.publish('update.loader', { show: false });
        that.bind(App, data);
    };

    MysteryBoxController.prototype.destroy = function() {

    };

    module.exports = MysteryBoxController;

})(window, platformSdk, platformSdk.events);