(function(W, platformSdk, events) {
    'use strict';

    var utils = require('../util/utils'),
        Constants = require('../../constants.js'),
        cacheProvider = require('../util/cacheProvider'),
        profileModel = require('../models/profileModel'),
        activityModel = require('../models/activityModel'),
        ugcModel = require('../models/ugcModel'),

        UgcController = function(options) {
            this.quoteTemplate = require('raw!../../templates/quoteTemplate.html');
            this.jflTemplate = require('raw!../../templates/jflTemplate.html');
            this.backButtonTemplate = require('raw!../../templates/backButtonPopUp.html');
            this.callInProgress = 0;
        };

    UgcController.prototype.bind = function(App, data) {

        var that = this;
        var imageSelected = 0;

        var parentCache = {
            confirmPopup: document.getElementsByClassName('ugcBackPopupContainer'),
            yesAction: document.getElementsByClassName('dialogPositiveAction'),
            noAction: document.getElementsByClassName('dialogNegativeAction')
        };


        if (data.type == Constants.UGC_TYPE.QUOTE || data.type == Constants.UGC_TYPE.FACT)
            that.bindHandlersQuote(App, data);
        else
            that.bindHandlersJfl(App, data);


        parentCache.yesAction[0].addEventListener('click', function() {
            App.router.back();
        });

        parentCache.noAction[0].addEventListener('click', function() {
            parentCache.confirmPopup[0].classList.add('hideClass');
        });

    };


    UgcController.prototype.bindHandlersQuote = function(App, data) {

        var that = this;

        var DOMcache = {

            quoteName: document.getElementsByClassName('quoteName'),
            userInput: document.getElementsByClassName('userInput'),
            cardNote: document.getElementsByClassName('cardNote'),
            cta: document.getElementsByClassName('cta'),
            quoteAuthor: document.getElementsByClassName('quoteAuthor'),
            quoteChar: document.getElementsByClassName('quoteChar'),
            screenH: window.innerHeight,
            ctaContainer: document.getElementsByClassName('ctaContainer'),
            sendCta: document.getElementsByClassName('sendCta'),
            addPhotoCta: document.getElementsByClassName('addPhotoCta'),
            addPhotoText: document.getElementsByClassName('addPhotoText'),
            card: document.getElementsByClassName('quoteCardContainer'),
            successCard: document.getElementsByClassName('successCard'),
            successCta: document.getElementsByClassName('successCta'),
            contentType: (data.type == Constants.UGC_TYPE.QUOTE) ? 'quote' : 'fact',
            cardOverlay: document.getElementsByClassName('cardOverlay'),
            ugcContainer: document.getElementsByClassName('ugcContainer'),
            ugcWrapper: document.getElementsByClassName('ugcWrapper'),
            addPhotoIllustration: document.getElementsByClassName('addPhotoIllustration'),
            quoteCard: document.getElementsByClassName('quoteCard')


        };




        DOMcache.quoteName[0].addEventListener('keyup', function() {
            DOMcache.ugcContainer[0].scrollTop = DOMcache.ugcContainer[0].scrollHeight;
            DOMcache.userInput[0].innerHTML = this.textContent.length;
            if (this.textContent.length > Constants.MAX_LENGTH_QUOTE) {
                DOMcache.userInput[0].classList.add('inputExceeded');
            } else
                DOMcache.userInput[0].classList.remove('inputExceeded');
            that.validateQuote(DOMcache, 'keyup', data);
        });


        DOMcache.quoteName[0].oninput = function() {
            DOMcache.ugcContainer[0].scrollTop = DOMcache.ugcContainer[0].scrollHeight;
            DOMcache.userInput[0].innerHTML = this.textContent.length;
            if (this.textContent.length > Constants.MAX_LENGTH_QUOTE) {
                DOMcache.userInput[0].classList.add('inputExceeded');
            } else
                DOMcache.userInput[0].classList.remove('inputExceeded');
            that.validateQuote(DOMcache, 'keyup', data);
        };


        DOMcache.quoteAuthor[0].addEventListener('keyup', function() {
            that.validateQuote(DOMcache, 'keyup', data);
        });


        DOMcache.cta[0].addEventListener('click', function() {
            that.validateQuote(DOMcache, 'click', data);
        });


        DOMcache.sendCta[0].addEventListener('click', function() {
            platformSdk.events.publish('update.threeDotLoader', { elem: DOMcache.sendCta[0], show: true, text: 'Uploading' });
            that.sendUgcContent(DOMcache, data, DOMcache.sendCta[0]);
        });

        DOMcache.addPhotoCta[0].addEventListener('click', function() {

            utils.openGallery(DOMcache.card[0], Constants.IMAGE_SIZE_UGC, function(filePath) {

                if (platformSdk.bridgeEnabled)
                    DOMcache.card[0].setAttribute('filePath', filePath);
                DOMcache.card[0].style.boxShadow = '0px 2px 14px rgba(0,0,0,0.4)';
                DOMcache.card[0].style.borderRadius = '4px';
                DOMcache.addPhotoCta[0].classList.add('replacePhotoRight');
                DOMcache.addPhotoIllustration[0].classList.add('hideClass');
                DOMcache.quoteName[0].classList.add('overlayQuoteName');
                DOMcache.quoteAuthor[0].classList.add('overlayQuoteAuthor');
                DOMcache.addPhotoText[0].innerHTML = "REPLACE PHOTO";
                DOMcache.cardOverlay[0].classList.remove('hideClass');
                DOMcache.cardNote.innerHTML = "If any inappropriate content found out, " + DOMcache.contentType + " won’t be published.";
            });
        });


        DOMcache.successCta[0].addEventListener('click', function() {
            App.router.navigateTo('/ugc', data);
        });

        window.addEventListener("resize", function() {

            if (document.querySelectorAll('.ugcContainer').length > 0) {
                if (DOMcache.screenH > window.innerHeight) {
                    DOMcache.cardNote[0].classList.remove('animation_fadein');
                    DOMcache.cardNote[0].classList.add('animation_fadeout');
                    DOMcache.ugcContainer[0].classList.add('overscroll');
                    DOMcache.ugcWrapper[0].classList.add('marB_30');
                    DOMcache.card[0].classList.add('marginBot60');
                    DOMcache.quoteName[0].classList.remove('scrollClsCard');

                } else {
                    DOMcache.cardNote[0].classList.remove('animation_fadeout');
                    DOMcache.cardNote[0].classList.add('animation_fadein');
                    DOMcache.ugcContainer[0].classList.remove('overscroll');
                    DOMcache.ugcWrapper[0].classList.remove('marB_30');
                    DOMcache.card[0].classList.remove('marginBot60');
                    DOMcache.quoteName[0].classList.add('scrollClsCard');

                }
            }
        });
    };

    UgcController.prototype.bindHandlersJfl = function(App, data) {

        var that = this;

        var DOMcache = {
            uploadIcon: document.getElementsByClassName('uploadIcon'),
            jflImage: document.getElementsByClassName('jflImage'),
            title: document.getElementsByClassName('title'),
            jflNote: document.getElementsByClassName('jflNote'),
            replacePhotoCta: document.getElementsByClassName('replacePhotoCta'),
            sendJflCta: document.getElementsByClassName('sendJflCta'),
            jflCtaContainer: document.getElementsByClassName('jflCtaContainer'),
            successCard: document.getElementsByClassName('successCard'),
            successCta: document.getElementsByClassName('successCta'),
            jflContainer: document.getElementsByClassName('jflContainer'),
            uploadJflFtueContainer: document.getElementsByClassName('uploadJflFtueContainer'),
        };


        DOMcache.uploadIcon[0].addEventListener('click', function() {
            utils.openGallery(DOMcache.jflImage[0], Constants.IMAGE_SIZE_UGC, function(filePath) {
                DOMcache.uploadJflFtueContainer[0].classList.add('hideClass');
                if (platformSdk.bridgeEnabled)
                    DOMcache.jflImage[0].setAttribute('filePath', filePath);

                that.chooseFileSuccess(DOMcache);
            });
        });


        DOMcache.replacePhotoCta[0].addEventListener('click', function(filePath) {
            utils.openGallery(DOMcache.jflImage[0], Constants.IMAGE_SIZE_UGC, function(filePath) {

                if (platformSdk.bridgeEnabled)
                    DOMcache.jflImage[0].setAttribute('filePath', filePath);

                that.chooseFileSuccess(DOMcache);
            });
        });

        DOMcache.sendJflCta[0].addEventListener('click', function() {
            that.sendUgcContent(DOMcache, data, DOMcache.sendJflCta[0]);
        });

        DOMcache.successCta[0].addEventListener('click', function() {
            App.router.navigateTo('/ugc', data);
        });



    };


    UgcController.prototype.chooseFileSuccess = function(DOMcache) {


        if (platformSdk.bridgeEnabled) {
            var img = new Image();
            img.src = 'file://' + DOMcache.jflImage[0].getAttribute('filePath');


            img.onload = function() {
                var aspectRatio = img.height / img.width;
                var h1 = 52;
                var h2 = DOMcache.jflNote[0].getBoundingClientRect().height;
                var gap = 10;
                var oldH;
                var newH = oldH = window.innerHeight - (h1 + h2 + gap * 2) - 40;

                var newW = newH / aspectRatio;

                if (newW > (window.innerWidth - gap * 2)) {
                    newW = window.innerWidth - gap * 2;
                    newH = newW * aspectRatio;
                }

                DOMcache.jflImage[0].style.height = newH + 'px';
                DOMcache.jflImage[0].style.width = newW + 'px';
                DOMcache.jflContainer[0].style.paddingTop = (oldH - newH) / 2 + gap + 'px';
                DOMcache.title[0].classList.add('hideClass');
                DOMcache.uploadIcon[0].classList.add('hideClass');
                DOMcache.jflNote[0].innerHTML = "Don’t send any inappropriate image, or it won’t be published.";
                DOMcache.jflImage[0].classList.remove('hideClass');
                DOMcache.jflCtaContainer[0].classList.remove('hideClass');
            };
        } else {

            var aspectRatio = 163 / 115;
            var h1 = 52;
            var h2 = DOMcache.jflNote[0].getBoundingClientRect().height;
            var gap = 10;
            var oldH;
            var newH = oldH = window.innerHeight - (h1 + h2 + gap * 2) - 40;



            var newW = newH / aspectRatio;

            if (newW > (window.innerWidth - gap * 2)) {
                newW = window.innerWidth - gap * 2;
                newH = newW * aspectRatio;
            }



            DOMcache.jflImage[0].style.height = newH + 'px';
            DOMcache.jflImage[0].style.width = newW + 'px';
            DOMcache.jflContainer[0].style.paddingTop = (oldH - newH) / 2 + gap + 'px';
            DOMcache.title[0].classList.add('hideClass');
            DOMcache.uploadIcon[0].classList.add('hideClass');
            DOMcache.jflNote[0].innerHTML = "Don’t send any inappropriate image, or it won’t be published.";
            DOMcache.jflImage[0].classList.remove('hideClass');
            DOMcache.jflCtaContainer[0].classList.remove('hideClass');

        }



    };


    UgcController.prototype.sendUgcContent = function(DOMcache, data, element) {

        var that = this;

        if (this.callInProgress)
            return;

        this.callInProgress = 1;
        element.classList.add('disabled');


        var serverPath;
        if (data.type == Constants.UGC_TYPE.QUOTE) {
            serverPath = appConfig.API_URL + '/ugc/user/type/quotes?message=' + DOMcache.quoteName[0].innerHTML + '&author=' + DOMcache.quoteAuthor[0].innerHTML;
        } else if (data.type == Constants.UGC_TYPE.FACT) {
            serverPath = appConfig.API_URL + '/ugc/user/type/facts?message=' + DOMcache.quoteName[0].innerHTML;
        } else {
            serverPath = appConfig.API_URL + '/ugc/user/type/jfl';
        }


        var imageElement = document.getElementsByClassName('imageElement')[0],
            ugcData, imagePresent;

        if (imageElement.getAttribute('filePath')) {

            ugcData = {
                uploadUrl: serverPath,
                doCompress: true,
                filePath: imageElement.getAttribute('filePath')
            };
            imagePresent = true;

        } else {
            ugcData = {
                uploadUrl: serverPath,
            };
            imagePresent = false;

        }



        ugcModel.postUgcData(ugcData, imagePresent, function(res) {

            if (platformSdk.bridgeEnabled) {
                if (res.stat == 'ok') {
                    if (data.type == Constants.UGC_TYPE.QUOTE || data.type == Constants.UGC_TYPE.FACT) {
                        DOMcache.card[0].classList.add('hideClass');
                        DOMcache.cardNote[0].classList.add('hideClass');
                        DOMcache.ctaContainer[0].classList.add('hideClass');
                        DOMcache.addPhotoCta[0].classList.add('hideClass');


                    } else {
                        DOMcache.jflNote[0].classList.add('hideClass');
                        DOMcache.jflImage[0].classList.add('hideClass');
                        DOMcache.jflCtaContainer[0].classList.add('hideClass');
                        DOMcache.jflContainer[0].classList.add('hideClass');
                    }

                    DOMcache.successCard[0].classList.remove('hideClass');
                } else if (res.stat == 'fail') {
                    events.publish('update.notif.toast', { show: true, heading: 'Error ', details: res.data.reason, notifType: 'notifError' });
                } else if (res.stat == "exception") {
                    events.publish('update.notif.toast', { show: true, heading: 'Bamm', details: 'Sorry. Your image couldn’t be updated. Could you try again with another files, please?', notifType: 'notifNeutral' });
                } else {
                    events.publish('update.notif.toast', { show: true, heading: 'Bamm', details: 'Sorry. Your image couldn’t be updated. Could you try again with another files, please?', notifType: 'notifNeutral' });
                }

            } else {

                if (data.type == Constants.UGC_TYPE.QUOTE || data.type == Constants.UGC_TYPE.FACT) {
                    DOMcache.card[0].classList.add('hideClass');
                    DOMcache.cardNote[0].classList.add('hideClass');
                    DOMcache.ctaContainer[0].classList.add('hideClass');
                    DOMcache.addPhotoCta[0].classList.add('hideClass');


                } else {
                    DOMcache.jflNote[0].classList.add('hideClass');
                    DOMcache.jflImage[0].classList.add('hideClass');
                    DOMcache.jflCtaContainer[0].classList.add('hideClass');
                    DOMcache.jflContainer[0].classList.add('hideClass');
                }

                DOMcache.successCard[0].classList.remove('hideClass');
            }

            that.callInProgress = 0;
            element.classList.remove('disabled');
            if (DOMcache.sendCta[0]) {
                DOMcache.sendCta[0].innerHTML = 'Send';
                DOMcache.sendCta[0].style.opacity = 1;
                //platformSdk.events.publish('update.threeDotLoader', { elem: DOMcache.sendCta[0], show: true, text: 'Send' });
            }

        });
    };


    UgcController.prototype.openGallery = function(size, callback) {

        if (platformSdk.bridgeEnabled) {
            try {
                platformSdk.nativeReq({
                    ctx: self,
                    fn: 'chooseFile',
                    success: function(fileUrl) {

                        fileUrl = decodeURIComponent(fileUrl);
                        fileUrl = JSON.parse(fileUrl);

                        if (!fileUrl.filesize || fileUrl.filesize === 0) {
                            events.publish('update.notif.toast', { show: true, heading: 'Bamm', details: 'Sorry. Your image couldn’t be updated. Could you try again with another files, please?', notifType: 'notifNeutral' });
                            return;
                        }

                        // Check Max Upload Size :: To Be Decided
                        if (fileUrl.filesize > size) {
                            events.publish('update.notif.toast', { show: true, heading: 'Bamm', details: 'Max file upload size is 10 Mb', notifType: 'notifNeutral' });
                            return;
                        }


                        callback();
                    }
                });

            } catch (err) {
                events.publish('update.notif.toast', { show: true, heading: 'Bamm', details: 'Sorry. Your image couldn’t be updated. Could you try again with another files, please?', notifType: 'notifNeutral' });

            }

        }

    };





    UgcController.prototype.validateQuote = function(DOMcache, eventType, data) {

        DOMcache.cta[0].classList.add('disabled');

        if (DOMcache.quoteName[0].textContent.length > Constants.MAX_LENGTH_QUOTE) {

            if (eventType == 'click')
                events.publish('update.notif.toast', { show: true, heading: 'Error!', details: 'Only ' + Constants.MAX_LENGTH_QUOTE + ' characters please!', notifType: 'notifNeutral' });
        } else if (DOMcache.quoteName[0].innerHTML.length === 0 && DOMcache.quoteAuthor[0].innerHTML.length === 0) {

            if (eventType == 'click')
                events.publish('update.notif.toast', { show: true, heading: 'Error!', details: 'Add a Quote & Author both', notifType: 'notifNeutral' });
        } else if (DOMcache.quoteName[0].innerHTML.length === 0 && DOMcache.quoteAuthor[0].innerHTML.length !== 0) {

            if (eventType == 'click') {
                if (data.type == Constants.UGC_TYPE.FACT)
                    events.publish('update.notif.toast', { show: true, heading: 'Error!', details: 'Add a Fact', notifType: 'notifNeutral' });
                else
                    DOMcache.quoteName[0].focus();
            }


        } else if (DOMcache.quoteName[0].innerHTML.length !== 0 && DOMcache.quoteAuthor[0].innerHTML.length === 0) {

            if (eventType == 'click')
                DOMcache.quoteAuthor[0].focus();

        } else {

            DOMcache.cta[0].classList.remove('disabled');
            if (eventType == 'click') {

                window.setTimeout(function() {
                    console.log('Preview Screen');
                    if (data.type == Constants.UGC_TYPE.FACT)
                        DOMcache.cardNote[0].innerHTML = "Add only #Fact related image or your #fact image won’t be published.";
                    else
                        DOMcache.cardNote[0].innerHTML = "Add only quote or author related image or image will change accordingly.";

                    DOMcache.quoteName[0].setAttribute('contentEditable', false);
                    DOMcache.quoteAuthor[0].setAttribute('contentEditable', false);
                    DOMcache.quoteChar[0].classList.add('animation_fadeout');
                    DOMcache.ctaContainer[0].classList.remove('hideClass');
                    DOMcache.addPhotoCta[0].classList.remove('hideClass');
                    DOMcache.cta[0].classList.add('hide');
                    DOMcache.card[0].style.boxShadow = 'none';
                    DOMcache.card[0].style.borderRadius = '4px 4px 0px 0px';
                }, 300);

            }
        }

    };



    UgcController.prototype.render = function(ctr, App, data) {

        var that = this;
        var template;
        that.el = document.createElement('div');
        that.el.className = 'ugcContainer animation_fadein noselect';

        if (data.type == Constants.UGC_TYPE.QUOTE || data.type == Constants.UGC_TYPE.FACT) {

            var isQuote = false;
            if (data.type == Constants.UGC_TYPE.QUOTE) {
                utils.changeBotTitle('QUOTES');
                isQuote = true;
            } else
                utils.changeBotTitle('FACTS');

            template = that.quoteTemplate;
            that.el.innerHTML = Mustache.render(unescape(template), { isQuote: isQuote, length: Constants.MAX_LENGTH_QUOTE });
        } else if (data.type == Constants.UGC_TYPE.JFL) {
            template = that.jflTemplate;
            that.el.innerHTML = Mustache.render(unescape(template));
            utils.changeBotTitle('JUST FOR LAUGH');
        }

        if (platformSdk.bridgeEnabled) {
            utils.changeBarColors('#323A4B', '#3D475B');
        }

        var backButtonTemplate = document.createElement('div');
        backButtonTemplate.classList.add('ugcBackPopupContainer');
        backButtonTemplate.classList.add('centerToScreenContainer');
        backButtonTemplate.classList.add('hideClass');
        backButtonTemplate.innerHTML = Mustache.render(unescape(that.backButtonTemplate));

        ctr.appendChild(that.el);
        ctr.appendChild(backButtonTemplate);
        document.getElementsByClassName('ugcContainer')[0].setAttribute('data-type', data.type);
        events.publish('update.loader', { show: false });
        that.bind(App, data);
    };

    UgcController.prototype.destroy = function() {

    };

    module.exports = UgcController;

})(window, platformSdk, platformSdk.events);