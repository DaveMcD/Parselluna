/**
 * @FILE main-req.js
 *
 * Entry point invoked by require.js, from script tag on web page
 * Typical examples for require.js will name this file main.js
 *
 * require.js will build dependency tree and ensure all requirements have been loaded before
 * execution continues (a somewhat fuzzy definition, but the general idea).
 * 
 * For this app, webPageInterface is the only thing we are loading directly.
 * Other modules will be loaded because webPageInterface defines a dependency.
 */

// var logD = console.log.bind(console);       // to toggle 'debug' console logging...
var logD = function(){};                    // swap comment/uncomment with previous line
var logC = console.log.bind(console);       // to restore console logging
//  logC = function(){};                    // to silence console logging


// removing the comma after paths: breaks require.config!!!
//noinspection JSLastCommaInObjectLiteral
require.config({
    paths: {
        // specify a path to util(.js)
        // if we move the util.js file to a different directory,
        //    we only need to change that path here, rather than in source code
        //    for every module that depends on util
        // NOTE: a require/define dependency of ['lib/util'] will fail when we have it here
        'util':         'lib/util' ,
        'domReady':     '../vendor/domReady' ,
        'jquery':       '../vendor/jquery-2.1.0' ,
        'jquery-ui':    '../vendor/jquery-ui-1.10.4' ,
        'ecotree':      '../vendor/ECOTree-1.5-icb-3'
        //    , 'underscore': '../vendor/underscore-1.6.0'
        // so, if util.js is moved to path lib/secret, dependent modules can still
        // find it if we do this instead:
        // util: 'lib/secret/util'
        // underscore >= 1.6.0 has native support for requireJS
    },

    shim: {

        'ecotree': {
            deps: ['jquery', 'jquery-ui'],
            exports: '$'
        }
//        'underscore': {
//            exports: '_'
//        }
    },

});

// webPageInterface is playing the role often associated with 'app' in
// RequireJS examples.
require(["webPageInterface"], function (webPageInterface) {
    "use strict";
    logD("in main-req.js, we require webPageInterface (but still run before anything in webPageInterface) ZEROTH");

    // logC("a" + "b" + "c", "def", {a:1, b:2, c:3});
    // if ('undefined' === typeof webPageInterface) { logD("wPI undefined"); }
    // else { logD("wPI defined"); }

    // webPageInterface is still undefined, so we cannot call its init() function.
    // probably because webPageInterface does not return itself.
    // it isn't clear exactly _what_ webPageInterface would return anyway
    // - perhaps an enclosing anonymous function?
    // In any case, things still seem to work OK without calling init,
    // - probably because the last thing webPageInterface does is call init()
    // It is in the webPageInterface.init() file that we assign actions to buttons.
    //// webPageInterface.init();
});