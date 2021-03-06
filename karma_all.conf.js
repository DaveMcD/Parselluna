/* Karma configuration
 * @FILE karma_all_conf.js
 *      Default name for this file is karma.conf.js
 *      If you are happy to only be able to run ALL tests,
 *      rather than various groups (or suites) of tests,
 *      and prefer NOT to have to tell karma which config file to use,
 *      you may want to rename to use the default name.
 */

/*globals module, */
module.exports = function(config) {
    "use strict";
    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: '',

        // frameworks to use
        frameworks: ['requirejs', 'jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'test/test-main-req.js',

            {pattern: 'vendor/**/*.js', included: false},
            {pattern: 'src/**/*.js', included: false},
            {pattern: 'test/**/*Spec.js', included: false},
            {pattern: 'test/**/SpecHelper.js', included: false}
        ],

        // list of files to exclude
        exclude: [
            'src/main-req.js'
        ],

        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['progress'],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['Chrome'],
        // you may need to manually capture browsers one time by loading
        // http://localhost:9876/ in each desired browser
        // browsers: ['Chrome', 'Firefox', 'Opera', 'IE'],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};
