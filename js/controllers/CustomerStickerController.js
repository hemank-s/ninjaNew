(function( W, platformSdk, events ) {
    'use strict';

    var utils = require( '../util/utils' ),
        Constants = require( '../../constants.js' ),
        customImageUploaded = false,
        uploadCustomStickerData = {},
        sessionId = null,

        CustomStickerController = function( options ) {
            this.template = require( 'raw!../../templates/customSticker.html' );
        };

    CustomStickerController.prototype.bind = function( App, data ) {

        var that = this;
        var rewardId = data.rewardId;
        
        customImageUploaded = false;
        uploadCustomStickerData = {};

        // All Custom Sticker Views Defined

        // Main views
        var customStickerUploadScreen = document.getElementsByClassName( 'customStickerUploadScreen' )[0];
        var customStickerFtueWrapper = document.getElementsByClassName( 'customStickerFtueWrapper' )[0];

        // Subsequent Views
        var customStickerSent = document.getElementsByClassName( 'customStickerSent' )[0];
        var customStickerStatusCheck = document.getElementsByClassName( 'customStickerStatusCheck' )[0];
        var customStickerReadyState = document.getElementsByClassName( 'customStickerReadyState' )[0];
        var customStickerRow = document.getElementsByClassName( 'customStickerRow' );

        var customStickerImage = document.getElementsByClassName( 'uploadPhotoContainer' )[0];

        //var profilePicLoader = document.getElementById('profilePicLoader');
        var errorMessage = document.getElementsByClassName( 'errorMessage' )[0];
        var customStickerTextPhrase = document.getElementById( 'customStickerTextPhrase' );
        var failCustomStickerTextPhrase = document.getElementById( 'failCustomStickerTextPhrase' );

        //var textLanguage = document.getElementById('textLanguage');
        var sendButton = document.getElementsByClassName( 'sendButton' )[0];
        var sendStickerAgainButton = document.getElementsByClassName( 'sendStickerAgainButton' )[0];

        // All Custom Sticker Actions

        var uploadPhoto = document.getElementsByClassName( 'uploadPhotoContainer' )[0];
        var customStickerButton = document.getElementsByClassName( 'customStickerButton' )[0];
        var customStickerFaq = document.getElementsByClassName( 'customStickerFaq' )[0];
        var customStickerShareAction = document.getElementsByClassName( 'customStickerShareAction' )[0];
        var customStickerHistory = document.getElementsByClassName( 'customStickerHistory' )[0];

        var showHistoryButton = document.getElementsByClassName( 'showHistoryButton' )[0];
        var uploadParent = document.getElementsByClassName( 'uploadParent' )[0];

        if ( data.rewardDetails.custom_stickers ) {

            that.defineCustomStickerHistory( data.rewardDetails.custom_stickers );
            if ( data.rewardDetails.custom_stickers.length > 0 ) {
                console.log( 'The user is not new to custom Sticker' );
                utils.removeClass( customStickerUploadScreen, 'hideClass' );
            } else {
                console.log( 'First Time user' );
                utils.removeClass( customStickerFtueWrapper, 'hideClass' );
            }
        }

        // Event Definations

        // FAQ URL CLICK EVENT
        customStickerFaq.addEventListener( 'click', function( ev ) {
            utils.openWebView( data.rewardDetails.faqUrl );
        });

        if ( showHistoryButton ) {
            showHistoryButton.addEventListener( 'click', function( ev ) {

                // Hide Upload and Show The History
                utils.removeClass( customStickerHistory, 'hideClass' );
                if ( uploadParent ) {
                    utils.addClass( uploadParent, 'hideClass' );
                } else {
                    utils.addClass( showHistoryButton, 'hideClass' );
                }
            });
        }

        // Show Upload Screen After the First Time
        customStickerButton.addEventListener( 'click', function( ev ) {
            utils.addClass( customStickerFtueWrapper, 'hideClass' );
            utils.removeClass( customStickerUploadScreen, 'hideClass' );
        });

        // Choose Sticker Image From gallery
        if ( customStickerImage ) {
            customStickerImage.addEventListener( 'click', function( ev ) {

                // utils.removeClass(errorMessage, 'hideClass');
                that.chooseStickerImageFromGallery( data );
            });
        }

        // Send the Data to Server
        if ( sendButton ) {
            sendButton.addEventListener( 'click', function( ev ) {
                that.sendCustomStickerDataToServer( rewardId );
            });
        }

        if ( sendStickerAgainButton ) {
            sendStickerAgainButton.addEventListener( 'click', function( ev ) {
                that.resendCustomStickerDataToServer( rewardId );
            });
        }

        customStickerShareAction.addEventListener( 'click', function( ev ) {
            var customStickerId = this.getAttribute( 'data-sid' );
            that.sendCustomStickerToUser( App, rewardId, customStickerId );
        });

        if ( data.rewardDetails.custom_stickers ) {
            that.defineCustomStickerClick( customStickerRow, data.rewardDetails.custom_stickers );

        }

    };

    CustomStickerController.prototype.sendCustomStickerToUser = function( App, rewardId, customStickerId ) {

        console.log( 'Sending the custom sticker to the user via packet' );

        console.log( rewardId );
        console.log( customStickerId );

        var data = {};
        data.rewardId = rewardId;
        data.customStickerId = customStickerId;

        // Reward Details API :: Send Reward Id As well
        App.NinjaService.sendCustomSticker( data, function( res ) {

            // Show Toast if Success
            console.log( res );
            utils.showToast( 'You will receive your sticker via the team hike bot shortly, start sharing.' );

            // Routing to the specific Router
            //App.router.navigateTo(rewardRouter, res.data);
        }, this );

    };

    CustomStickerController.prototype.defineCustomStickerClick = function( customStickerRow, data ) {

        var customStickerUploadScreen = document.getElementsByClassName( 'customStickerUploadScreen' )[0];
        var customStickerFtueWrapper = document.getElementsByClassName( 'customStickerFtueWrapper' )[0];
        var customStickerFailScreen = document.getElementsByClassName( 'customStickerFailScreen' )[0];

        // Subsequent Views
        var customStickerSent = document.getElementsByClassName( 'customStickerSent' )[0];
        var customStickerStatusCheck = document.getElementsByClassName( 'customStickerStatusCheck' )[0];
        var customStickerReadyState = document.getElementsByClassName( 'customStickerReadyState' )[0];
        var customStickerView = document.getElementsByClassName( 'customStickerView' )[0];
        var customStickerHistory = document.getElementsByClassName( 'customStickerHistory' )[0];

        var failReason = document.getElementsByClassName( 'failReason' )[0];

        for ( var i = 0; i < customStickerRow.length; i++ ) {
            customStickerRow[i].addEventListener( 'click', function( event ) {

                var state = this.getAttribute( 'data-status' );
                var sid = this.getAttribute( 'data-id' );
                var url = this.getAttribute( 'data-url' );

                if ( state == 'redeemed' ) {
                    console.log( 'Take To Success Page :: Send Image and ID There Reference' );
                    utils.removeClass( customStickerReadyState, 'hideClass' );
                    utils.addClass( customStickerUploadScreen, 'hideClass' );
                    utils.addClass( customStickerSent, 'hideClass' );
                    utils.addClass( customStickerFtueWrapper, 'hideClass' );
                    utils.addClass( customStickerHistory, 'hideClass' );

                    // Set Id Attribute For Reference Later
                    var customStickerShareAction = document.getElementsByClassName( 'customStickerShareAction' )[0];
                    var att = document.createAttribute( 'data-sid' );
                    att.value = sid;
                    customStickerShareAction.setAttributeNode( att );

                    // Set Background Image Of Sticker Being Set
                    customStickerView.style.backgroundImage = 'url(\'' + url + '\')';

                } else if ( state == 'inprogress' ) {
                    console.log( 'Take to status Check Page :: Send ID' );
                    utils.removeClass( customStickerStatusCheck, 'hideClass' );
                    utils.addClass( customStickerUploadScreen, 'hideClass' );
                    utils.addClass( customStickerSent, 'hideClass' );
                    utils.addClass( customStickerFtueWrapper, 'hideClass' );
                    utils.addClass( customStickerHistory, 'hideClass' );
                } else if ( state == 'failed' ) {

                    if ( sessionId ) {
                        sessionId = null;
                    }

                    utils.addClass( customStickerHistory, 'hideClass' );
                    var sId = this.getAttribute( 'data-id' );
                    var reasonFail = this.getAttribute( 'data-reason' );
                    sessionId = sId;
                    failReason.innerHTML = reasonFail;
                    console.log( 'Session Id is ', sessionId );
                    utils.removeClass( customStickerFailScreen, 'hideClass' );
                } else {
                    utils.showToast( 'some error occured please try again later' );
                }
            });
        }

    };

    // Reset To Default Sticker Image If Some Error Occurs While Selecting the Image :: Or uploading It
    CustomStickerController.prototype.setDefaultCustomStickerImage = function() {

        var uploadPhotoContainer = document.getElementsByClassName( 'uploadPhotoContainer' )[0];
        var uploadPhoto = document.getElementsByClassName( 'uploadPhoto' )[0];

        console.log( 'Setting the default custom sticker image' );
        uploadPhotoContainer.style.backgroundImage = 'none';
        uploadPhoto.style.display = 'block';
    };

    // Show Error State
    CustomStickerController.prototype.showErrorState = function( text ) {
        var errorMessage = document.getElementsByClassName( 'errorMessage' )[0];

        errorMessage.innerHTML = text;
        utils.removeClass( errorMessage, 'hideClass' );
    };

    // Check Full Form Before Sending Custom Sticker Data
    CustomStickerController.prototype.customStickerFormCheck = function() {

        console.log( customStickerTextPhrase.value );
        console.log( customImageUploaded );

        var sendForm = true;

        if ( ! customImageUploaded ) {
            this.showErrorState( 'Please fill all the details' );
            sendForm = false;
        }

        if( customStickerTextPhrase.value === ""){
            this.showErrorState( 'Please fill all the details' );
            sendForm = false;   
        }

        return sendForm;

    };

    CustomStickerController.prototype.customStickerReFormCheck = function() {

        console.log( failCustomStickerTextPhrase.value );
        console.log( customImageUploaded );

        var sendForm = true;

        if ( ! customImageUploaded || ! failCustomStickerTextPhrase ) {
            this.showErrorState( 'Please fill all the details' );
            sendForm = false;
        }

        return sendForm;

    };

    CustomStickerController.prototype.chooseStickerImageFromGallery = function( data ) {

        var that = this;

        // Image Container
        var customStickerImage = document.getElementsByClassName( 'uploadPhotoContainer' )[0];

        try {
            platformSdk.nativeReq({
                ctx: self,
                fn: 'chooseFile',
                success: function( fileUrl ) {

                    fileUrl = decodeURIComponent( fileUrl );
                    fileUrl = JSON.parse( fileUrl );

                    if ( ! fileUrl.filesize || fileUrl.filesize === 0 ) {

                        utils.showToast( 'Sorry. Your image couldn’t be updated. Could you try again with another files, please?' );
                        customImageUploaded = false;
                        that.setDefaultCustomStickerImage();
                        return;
                    }

                    // Check Max Upload Size :: To Be Decided
                    if ( fileUrl.filesize > 10000000 ) {
                        utils.showToast( 'Max file upload size is 10 Mb' );
                        customImageUploaded = false;
                        that.setDefaultCustomStickerImage();
                        return;
                    }

                    uploadCustomStickerData.filePath = fileUrl.filePath;

                    // Show Profile Picture In the Round Tab
                    // Hide the camera Icon
                    var cameraIcon = document.getElementsByClassName( 'uploadPhoto' )[0];
                    cameraIcon.style.display = 'none';

                    // Set the image from gallery as the container image
                    customStickerImage.style.backgroundImage = 'url(\'file://' + fileUrl.filePath + '\')';
                    console.log("setting hemank to true");
                    customImageUploaded = true;
                }
            });

        } catch ( err ) {
            events.publish( 'update.loader', { show: false });
            utils.showToast( 'Sorry. Your image couldn’t be updated. Could you try again with another files, please?' );
            that.setDefaultCustomStickerImage();
            customImageUploaded = false;
        }
    };

    // Send Custom sticker Data To Server
    CustomStickerController.prototype.resendCustomStickerDataToServer = function( rid ) {

        var that = this;
        var serverPath;

        var customStickerUploadScreen = document.getElementsByClassName( 'customStickerUploadScreen' )[0];
        var customStickerSent = document.getElementsByClassName( 'customStickerSent' )[0];
        var customStickerFailScreen = document.getElementsByClassName( 'customStickerFailScreen' )[0];

        var formSend = that.customStickerReFormCheck();

        if ( formSend ) {

            events.publish( 'update.loader', { show: true });

            console.log( 'All data is correct and can be sent to the user' );

            // Remove any error message class if any
            //utils.removeClass(errorMessage, 'hideClass');

            var data = {};
            data.rid = rid;
            data.text_phrase = failCustomStickerTextPhrase.value;
            serverPath = 'http://54.169.82.65:5016/v1/rewards/' + data.rid + '?sid=' + sessionId + '&t=' + data.text_phrase;

            // Add the server path here
            uploadCustomStickerData.uploadUrl = serverPath;
            uploadCustomStickerData.doCompress = true;

            try {
                platformSdk.nativeReq({
                    ctx: self,
                    fn: 'uploadFile',
                    data: platformSdk.utils.validateStringifyJson( uploadCustomStickerData ),
                    success: function( res ) {
                        try {
                            res = JSON.parse( decodeURIComponent( res ) );
                            console.log( res );

                            if ( res.stat == 'ok' ) {

                                //utils.showToast('Your Image has been updated.');
                                sessionId = res.data.sid;

                                // Show Sent Screen Here As below
                                utils.addClass( customStickerUploadScreen, 'hideClass' );
                                utils.addClass( customStickerFailScreen, 'hideClass' );
                                utils.removeClass( customStickerSent, 'hideClass' );
                                events.publish( 'update.loader', { show: false });
                                customImageUploaded = false;
                        

                            } else if(res.stat == 'fail'){
                                events.publish( 'update.loader', { show: false });
                                utils.showToast( res.data.reason );
                                that.setDefaultCustomStickerImage();
                                customImageUploaded = false;
                        
                            } else {
                                events.publish( 'update.loader', { show: false });
                                utils.showToast( 'Sorry. Your image couldn’t be updated. Could you try again with another files, please?' );
                                that.setDefaultCustomStickerImage();
                                customImageUploaded = false;
                        
                            }
                        } catch ( err ) {
                            events.publish( 'update.loader', { show: false });
                            utils.showToast( 'Sorry. Your image couldn’t be updated. Could you try again with another files, please?' );
                            that.setDefaultCustomStickerImage();
                            customImageUploaded = false;
                        
                        }

                        //Hide loader
                        //profilePicLoader.classList.remove('picLoader');
                    }
                });

            } catch ( err ) {
                events.publish( 'update.loader', { show: false });
                utils.showToast( 'Sorry. Your image couldn’t be updated. Could you try again with another files, please?' );
                            
                //profilePicLoader.classList.remove('picLoader');
                that.setDefaultCustomStickerImage();
            }
        } else {
            utils.showToast( 'Some information seems to be incorrect. Please check!' );

        }
    };

    // Send Custom sticker Data To Server
    CustomStickerController.prototype.sendCustomStickerDataToServer = function( rid ) {

        var that = this;
        var serverPath;

        var customStickerUploadScreen = document.getElementsByClassName( 'customStickerUploadScreen' )[0];
        var customStickerSent = document.getElementsByClassName( 'customStickerSent' )[0];
        var customStickerFailScreen = document.getElementsByClassName( 'customStickerFailScreen' )[0];

        var formSend = that.customStickerFormCheck();

        if ( formSend ) {

            events.publish( 'update.loader', { show: true });

            var data = {};
            data.rid = rid;
            data.text_phrase = customStickerTextPhrase.value;
            serverPath = 'http://54.169.82.65:5016/v1/rewards/' + data.rid + '?t=' + data.text_phrase;

            // Add the server path here
            uploadCustomStickerData.uploadUrl = serverPath;
            uploadCustomStickerData.doCompress = true;

            try {
                platformSdk.nativeReq({
                    ctx: self,
                    fn: 'uploadFile',
                    data: platformSdk.utils.validateStringifyJson( uploadCustomStickerData ),
                    success: function( res ) {
                        try {
                            res = JSON.parse( decodeURIComponent( res ) );
                            console.log( res );

                            if ( res.stat == 'ok' ) {

                                //utils.showToast('Your Image has been updated.');
                                sessionId = res.data.sid;

                                // Show Sent Screen Here As below
                                utils.addClass( customStickerUploadScreen, 'hideClass' );
                                utils.addClass( customStickerFailScreen, 'hideClass' );
                                utils.removeClass( customStickerSent, 'hideClass' );
                                events.publish( 'update.loader', { show: false });
                                customImageUploaded = false;

                            } else if(res.stat == 'fail'){
                                events.publish( 'update.loader', { show: false });
                                utils.showToast( res.data.reason );
                                that.setDefaultCustomStickerImage();
                                customImageUploaded = false;
                        
                            } else {
                                events.publish( 'update.loader', { show: false });
                                utils.showToast( 'Sorry. Your image couldn’t be updated. Could you try again with another files, please?' );
                                that.setDefaultCustomStickerImage();
                                customImageUploaded = false;
                        
                            }
                        } catch ( err ) {
                            events.publish( 'update.loader', { show: false });
                            utils.showToast( 'Sorry. Your image couldn’t be updated. Could you try again with another files, please?' );
                            that.setDefaultCustomStickerImage();
                            customImageUploaded = false;
                        
                        }

                        //Hide loader
                        //profilePicLoader.classList.remove('picLoader');
                    }
                });

            } catch ( err ) {
                events.publish( 'update.loader', { show: false });
                utils.showToast( 'Sorry. Your image couldn’t be updated. Could you try again with another files, please?' );            
                //profilePicLoader.classList.remove('picLoader');
                that.setDefaultCustomStickerImage();
            }
        } else {
            utils.showToast( 'Some information seems to be incorrect. Please check!' );

        }
    };

    CustomStickerController.prototype.defineCustomStickerHistory = function( stickers ) {

        // All Custom Sticker History
        var allCustomStickers = document.getElementsByClassName( 'customStickerIcon' );

        console.log( stickers );

        for ( var i = 0; i < stickers.length; i++ ) {
            if ( stickers[i].url ) {
                allCustomStickers[i].style.backgroundImage = 'url(\'' + stickers[i].url + '\')';
            } else {
                console.log( 'Sticker Icon is not present, please try a default icon' );
            }
            if ( stickers[i].ts ) {
                var timestamp = new Date( stickers[i].ts * 1000 );
                stickers[i].ts = timestamp.getDate() + '/' + ( timestamp.getMonth() + 1 ) + '/' + ( timestamp.getYear() + 1900 );
            } else {
                sticker[i].ts = 'Order date is unavailable';
            }

        }

    };

    CustomStickerController.prototype.convertTimeStamp = function( stickers ) {

        for ( var i = 0; i < stickers.length; i++ ) {
            if ( stickers[i].ts ) {
                var timestamp = new Date( stickers[i].ts );
                stickers[i].ts = timestamp.getDate() + '/' + ( timestamp.getMonth() + 1 ) + '/' + ( timestamp.getYear() + 1900 );
            } else {
                sticker[i].ts = 'Order date is unavailable';
            }
        }
    };

    CustomStickerController.prototype.render = function( ctr, App, data ) {

        console.log( data );

        var that = this;
        that.customStickersList = [];
        that.showCustomStickerHistoryButton = false;

        if ( data.rewardDetails.custom_stickers ) {
            that.customStickersList = data.rewardDetails.custom_stickers;
            that.convertTimeStamp( data.rewardDetails.custom_stickers );
        }

        if ( data.rewardDetails.custom_stickers.length > 0 ) {
            that.showCustomStickerHistoryButton = true;
        }

        console.log( that.customStickersList );

        that.el = document.createElement( 'div' );
        that.el.className = 'customStickerContainer centerToScreenContainer animation_fadein noselect';
        that.el.innerHTML = Mustache.render( that.template, {
            customStickersList: that.customStickersList,
            newStickerEligibility: data.rewardDetails.eligible,
            showCustomStickerHistoryButton: that.showCustomStickerHistoryButton
        });
        ctr.appendChild( that.el );
        events.publish( 'update.loader', { show: false });
        that.bind( App, data );
    };

    CustomStickerController.prototype.destroy = function() {

    };

    module.exports = CustomStickerController;

})( window, platformSdk, platformSdk.events );
