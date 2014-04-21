/**
 * @FILE test-main-req.js
 * Created by
 * @AUTHOR David McDonald
 * on 4/11/2014.
 * derived from https://github.com/kjbekkelund/karma-requirejs
 */
// var logD = console.log.bind(console);
var logD = function(){};                    // to silence console logging
var logC = console.log.bind(console);       // to restore console logging
//  logC = function(){};                    // to silence console logging

/*globals requirejs */
var tests = [];
for (var file in window.__karma__.files) {
    //noinspection JSUnfilteredForInLoop
    if (/Grammar_Spec\.js$/.test(file)) {
        //noinspection JSUnfilteredForInLoop
        tests.push(file);
    }
}
// logD("tests array contains: |", tests, "|");

// call the requirejs.config() method, passing an object with config fields
requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base/src',

    paths: {
        'util': 'lib/util',
        'jquery': '../vendor/jquery-2.1.0',
        'jquery-ui': '../vendor/jquery-ui-1.10.4',
        'ecotree': '../vendor/ECOTree_post15',
        //    'underscore': '../vendor/underscore-1.6.0' ,
        'jasmine': '../test/vendor/jasmine-2.0.0/jasmine',
        'SpecHelper': '../test/SpecHelper'
    },

    shim: {
        'ecotree': {
            deps: ['jquery', 'jquery-ui'],
            exports: '$'
        }
    },

    // underscore >= 1.6.0 has native support for requireJS
//    shim: {
//        'underscore': {
//            exports: '_'
//        }
//    },

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});