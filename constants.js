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
            "appName": "Hike Ninja",
            "title": "Share your feedback about Hike Ninja",
            "data": [{
                "text": "Suggest Something New",
                "type": "Feature",
                "icon": "feature",
                "subCat": [{
                    "text": "Suggest a new reward",
                    "subCat": []
                }, {
                    "text": "Improve an existing reward",
                    "subCat": [{
                        "text": "Early Access Stickers"
                    }, {
                        "text": "Custom Sticker"
                    }, {
                        "text": "GIF Sharing"
                    }, {
                        "text": "Animated stickers"
                    }, {
                        "text": "Mystery Box"
                    }]
                }]
            }, {
                "text": "Report an Issue",
                "type": "Bug",
                "icon": "issue",
                "subCat": [{
                    "text": "Ninja App",
                    "subCat": [{
                        "text": "I’m getting a blank screen after clicking \"Hike Ninja\""
                    }, {
                        "text": "Click not responsive"
                    }, {
                        "text": "Taking too much time to load the next screen"
                    }, {
                        "text": "Not able to access the Ninja App"
                    }, {
                        "text": "Find the Ninja App too complex."
                    }]
                }, {
                    "text": "Notifications",
                    "subCat": [{
                        "text": "I'm getting too many notifications simultaneously"
                    }, {
                        "text": "I'm not getting any notifications related to Ninja"
                    }, {
                        "text": "How to turn off notifications related to Ninja"
                    }, {
                        "text": "I clicked on the notification but nothing happened"
                    }]
                }, {
                    "text": "Profile related issues",
                    "subCat": [{
                        "text": "Not able to access the rewards I've unlocked"
                    }, {
                        "text": "My Ninja days aren't increasing"
                    }, {
                        "text": "Not able to see the next rewards to be unlocked"
                    }, {
                        "text": "My Ninja health isn't improving"
                    }, {
                        "text": "My stats are not changing"
                    }]
                }, {
                    "text": "Issues with rewards",
                    "subCat": [{
                        "text": "Early access stickers",
                        "subCat": [{
                            "text": "Not able to find the sticker pack I just downloaded."
                        }, {
                            "text": "My friend also has the same sticker pack I downloaded from Ninja       App."
                        }, {
                            "text": "Not able to download early access sticker packs"
                        }]
                    }, {
                        "text": "GIF sharing",
                        "subCat": [{
                            "text": "Not able to access GIFs"
                        }, {
                            "text": "Not able to send GIFs "
                        }, {
                            "text": "My friend is not able to view the GIFs I send "
                        }]
                    }, {
                        "text": "Custom Sticker",
                        "subCat": [{
                            "text": "Image not getting uploaded"
                        }, {
                            "text": "Uploaded image getting failed "
                        }, {
                            "text": "Didn't receive the custom sticker"
                        }, {
                            "text": "Not able to send custom sticker to friends"
                        }, {
                            "text": "Not able to set custom sticker as my DP"
                        }]
                    }, {
                        "text": "Animated Stickers",
                        "subCat": [{
                            "text": "Can't access animated sticker pack I just downloaded "
                        }, {
                            "text": "My friend also has the same animated sticker pack I downloaded from   Ninja App."
                        }]
                    }, {
                        "text": "Mystery Box",
                        "subCat": [{
                            "text": "Not able to access mystery box"
                        }, {
                            "text": "I never win anything from mystery box"
                        }, {
                            "text": "Not able to unlock the gift I won from mystery box"
                        }]
                    }, {
                        "text": "FAQs",
                        "type": "Faqs",
                        "icon": "faq",
                        "subCat": [{
                            "text": "How did I become a Ninja on Hike and not my friends?",
                            "subCat": [{
                                "text": "You're one of the top users and have been chosen to be a part of Hike Ninja. You have unlocked some really cool stuff which is exclusively for you."
                            }]
                        }, {
                            "text": "What is Ninja days?",
                            "subCat": [{
                                "text": "This is how long you've been a Hike Ninja for.The higher the Ninja Days,the cooler stuff you unlock."
                            }]
                        }, {
                            "text": "Will my friends get a notification that I've become a Hike Ninja?",
                            "subCat": [{
                                "text": "No, your friends will not be notified that you've become a Hike Ninja."
                            }]
                        }, {
                            "text": "Will my friends get a notification that I've won a reward?",
                            "subCat": [{
                                "text": "No, your friends will not be notified that you've won a reward."
                            }]
                        }, {
                            "text": "Will I remain a Ninja forever?",
                            "subCat": [{
                                "text": "You can remain a Ninja till your Ninja state is healthy. When your Ninja state becomes critical, you would have to keep increasing your activity on Hike to remain a Ninja."
                            }]
                        }, {
                            "text": "How do I invite my friends to become a Ninja on Hike?",
                            "subCat": [{
                                "text": "Ninja is an exclusive community of our top users, you can't invite your friends to become a part of it. They'll be chosen to be a part of Hike Ninja once they are highly active on Hike."
                            }]
                        }, {
                            "text": "Why has my Ninja state changed from Healthy to Critical?",
                            "subCat": [{
                                "text": "Ninja state depends on your previous day's activity, it will change to critical if your previous day's activity was low."
                            }]
                        }, {
                            "text": "How do I unlock more rewards?",
                            "subCat": [{
                                "text": "Keep using hike to increase the count of your Ninja days to unlock more awesome rewards."
                            }]
                        }, {
                            "text": "Why do I need to update the App for accessing more rewards?",
                            "subCat": [{
                                "text": "The new features you get as rewards will be supported on new app versions. For unlocking and accessing those rewards, you need to be on the latest version of Hike."
                            }]
                        }, {
                            "text": "What will happen if I lose my Ninja title?",
                            "subCat": [{
                                "text": "You will not have the access to all the awesome rewards which you could have unlocked if you would have remained a Ninja."
                            }, {
                                "text": "How do I become a Ninja again?",
                                "subCat": [{
                                    "text": "Keep increasing your activity on Hike to be a part of Hike Ninja again."
                                }, {
                                    "text": "Will I lose my count of Ninja days if I lose my Ninja title?",
                                    "subCat": [{
                                        "text": "Your count of Ninja days might decrease to zero if you lose your Ninja title. "
                                    }]
                                }]
                            }]
                        }]
                    }]
                }]
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
