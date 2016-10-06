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
            this.callInProgress = 0;
        };

    UgcController.prototype.bind = function(App, data) {

        var that = this;
        var imageSelected = 0;



        if (data.type == Constants.UGC_TYPE.QUOTE || data.type == Constants.UGC_TYPE.FACT)
            that.bindHandlersQuote(App, data);
        else
            that.bindHandlersJfl(App, data);

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


        };


        var defHeight = parseInt(window.getComputedStyle(DOMcache.quoteName[0]).height);
        DOMcache.quoteName[0].style.minHeight = defHeight + 'px';


        DOMcache.quoteName[0].addEventListener('keyup', function() {
            DOMcache.userInput[0].innerHTML = this.innerHTML.length;
            if (this.innerHTML.length > Constants.MAX_LENGTH_QUOTE) {
                DOMcache.userInput[0].classList.add('inputExceeded');
            } else
                DOMcache.userInput[0].classList.remove('inputExceeded');
            that.validateQuote(DOMcache, 'keyup', data);
        });

        DOMcache.quoteAuthor[0].addEventListener('keyup', function() {
            that.validateQuote(DOMcache, 'keyup', data);
        });


        DOMcache.cta[0].addEventListener('click', function() {
            that.validateQuote(DOMcache, 'click', data);
        });


        DOMcache.sendCta[0].addEventListener('click', function() {
            that.sendUgcContent(DOMcache, data, DOMcache.sendCta[0]);
        });

        DOMcache.addPhotoCta[0].addEventListener('click', function() {

            that.openGallery(DOMcache.card[0], function() {


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

            if (DOMcache.screenH > window.innerHeight) {
                DOMcache.cardNote[0].classList.remove('animation_fadein');
                DOMcache.cardNote[0].classList.add('animation_fadeout');
                DOMcache.ugcContainer[0].classList.add('overscroll');
                DOMcache.ugcWrapper[0].classList.add('marB_30');

            } else {
                DOMcache.cardNote[0].classList.remove('animation_fadeout');
                DOMcache.cardNote[0].classList.add('animation_fadein');
                DOMcache.ugcContainer[0].classList.remove('overscroll');
                DOMcache.ugcWrapper[0].classList.remove('marB_30');

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
        };


        DOMcache.uploadIcon[0].addEventListener('click', function() {
            that.openGallery(DOMcache.jflImage[0], function() {
                that.chooseFileSuccess(DOMcache);
            });
        });


        DOMcache.replacePhotoCta[0].addEventListener('click', function() {
            that.openGallery(DOMcache.jflImage[0], function() {
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
                var newH = oldH = window.innerHeight - (h1 + h2 + gap * 2);



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
        } else {

            var aspectRatio = 163 / 115;
            var h1 = 52;
            var h2 = DOMcache.jflNote[0].getBoundingClientRect().height;
            var gap = 10;
            var oldH;
            var newH = oldH = window.innerHeight - (h1 + h2 + gap * 2);



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
            serverPath = 'http://54.169.82.65:5016/v1/ugc/type/quotes?message=' + DOMcache.quoteName[0].innerHTML + '&author=' + DOMcache.quoteAuthor[0].innerHTML;
        } else if (data.type == Constants.UGC_TYPE.FACT) {
            serverPath = 'http://54.169.82.65:5016/v1/ugc/type/facts?message=' + DOMcache.quoteName[0].innerHTML;
        } else {
            serverPath = 'http://54.169.82.65:5016/v1/ugc/type/jfl';
        }


        var imageElement = document.getElementsByClassName('imageElement')[0],
            ugcData, imagePresent;

        if (imageElement.getAttribute('filePath')) {

            ugcData = {
                uploadUrl: serverPath,
                doCompress: true,
                filePath: imageElement.getAttribute('filePath')
            }
            imagePresent = true;

        } else {
            ugcData = {
                uploadUrl: serverPath,
            }
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
                    utils.showToast(res.data.reason);
                } else if (res.stat == "exception") {
                    utils.showToast('Sorry. Your image couldn’t be updated. Could you try again with another files, please?');
                } else {
                    utils.showToast('Sorry. Your image couldn’t be updated. Could you try again with another files, please?');
                }

            } else {
                DOMcache.card[0].classList.add('hideClass');
                DOMcache.cardNote[0].classList.add('hideClass');
                DOMcache.ctaContainer[0].classList.add('hideClass');
                DOMcache.addPhotoCta[0].classList.add('hideClass');
                DOMcache.successCard[0].classList.remove('hideClass');
            }

            that.callInProgress = 0;
            element.classList.remove('disabled');


        });
    };


    UgcController.prototype.openGallery = function(element, callback) {

        if (platformSdk.bridgeEnabled) {
            try {
                platformSdk.nativeReq({
                    ctx: self,
                    fn: 'chooseFile',
                    success: function(fileUrl) {

                        fileUrl = decodeURIComponent(fileUrl);
                        fileUrl = JSON.parse(fileUrl);

                        if (!fileUrl.filesize || fileUrl.filesize === 0) {

                            utils.showToast('Sorry. Your image couldn’t be updated. Could you try again with another files, please?');
                            return;
                        }

                        // Check Max Upload Size :: To Be Decided
                        if (fileUrl.filesize > 10000000) {
                            utils.showToast('Max file upload size is 10 Mb');
                            return;
                        }

                        element.setAttribute('filePath', fileUrl.filePath);
                        element.style.backgroundImage = 'url(\'file://' + fileUrl.filePath + '\')';
                        callback();
                    }
                });

            } catch (err) {
                utils.showToast('Sorry. Your image couldn’t be updated. Could you try again with another files, please?');
            }

        } else {
            element.classList.add('test');
            callback();

        }

    };





    UgcController.prototype.validateQuote = function(DOMcache, eventType, data) {

        DOMcache.cta[0].classList.add('disabled');

        if (DOMcache.quoteName[0].innerHTML.length > Constants.MAX_LENGTH_QUOTE) {

            if (eventType == 'click')
                utils.showToast('Add only ' + Constants.MAX_LENGTH_QUOTE + ' Characters');

        } else if (DOMcache.quoteName[0].innerHTML.length == 0 && DOMcache.quoteAuthor[0].innerHTML.length == 0) {

            if (eventType == 'click')
                utils.showToast('Add a quote & author');

        } else if (DOMcache.quoteName[0].innerHTML.length == 0 && DOMcache.quoteAuthor[0].innerHTML.length != 0) {

            if (eventType == 'click') {
                if (data.type == Constants.UGC_TYPE.FACT)
                    utils.showToast('Add a Fact');
                else
                    DOMcache.quoteName[0].focus();
            }


        } else if (DOMcache.quoteName[0].innerHTML.length != 0 && DOMcache.quoteAuthor[0].innerHTML.length == 0) {

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
            template = that.quoteTemplate;
            that.el.innerHTML = Mustache.render(unescape(template), { isQuote: (data.type == Constants.UGC_TYPE.QUOTE) ? true : false, length: Constants.MAX_LENGTH_QUOTE });
        } else if (data.type == Constants.UGC_TYPE.JFL) {
            template = that.jflTemplate;
            that.el.innerHTML = Mustache.render(unescape(template));
        }

        ctr.appendChild(that.el);
        events.publish('update.loader', { show: false });
        that.bind(App, data);
    };

    UgcController.prototype.destroy = function() {

    };

    module.exports = UgcController;

})(window, platformSdk, platformSdk.events);