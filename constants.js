(function() {
    'use strict';

    module.exports = {
        DEV_ENV: 'dev',
        STAGING_ENV: 'staging',
        PROD_ENV: 'prod',

        ConnectionTypes: {
            NO_NETWORK: '-1',
            UNKNOWN: '0',
            WIFI: '1',
            TWO_G: '2',
            THREE_G: '3',
            FOUR_G: '4'
        },

        Events: {
            NAVIGATE_APP: 'app.navigate',
            TOGGLE_BLOCK: 'app.menu.om.block',
            RESET_APP: 'app.reset'
        },

        // Levels 0- Bronze; 1-Silver; Gold-2

        REWARD_STATE: {
            LOCKED: 0,
            UNLOCKED: 1,
            INPROGRESS: 2,
            REDEEMED: 3,
            FAILED: 4,
            EXPIRED: 5
        },

        CS_HELP_JSON: {
            'appName': 'Friends',
            'title': 'Everything you need to know about friends',
            'data': [{
                'text': 'Details',
                'type': 'weburl',
                'icon': 'faq',
                'url': 'http://support.hike.in/forums/23106287-Friends-concept',
                'active': true
            }, {
                'text': 'Give feedback',
                'type': 'feature',
                'icon': 'issue',
                'subCat': [],
                'active': true,
                'label': 'Friends feedback',
                'theme': 'HomeScreen5.0'
            }]
        },

        INVOKE_MODE_APP_START: 1,
        INVOKE_MODE_THREE_DOT: 2,
        MAX_LENGTH_QUOTE: 250,

        IMAGE_SIZE_UGC: 1000000,
        CUSTOM_STICKER_TITLE_LENGTH: 32,

        CUSTOM_STICKER_STATUS: {
            FAILED: 'failed',
            PROGRESS: 'inprogress',
            DONE: 'redeemed'

        },


        UGC_TYPE: {
            JFL: 'jfl',
            QUOTE: 'quotes',
            FACT: 'facts'
        }


    };

})();