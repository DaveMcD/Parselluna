/**
 * @FILE SpecHelper.js
 * by default, this file does NOT match pattern used by Karma for inclusion.
 *
 * NOTE: the custom jasmine matching function toBePlaying is retained
 *       from jasmine sample code until we discover a useful
 *       application for such functionality is needed
 */

/* inform jshint not to warn that these jasmine functions are not defined */
/*global describe, it, before, beforeEach, after, afterEach, expect, */
/*global logC, logD */      /* defined in test-main-req.js */
define(
/*    [
    'jasmine'

    // Add Jasmine dependencies here like:
    // 'jasmine-jquery'
],
*/
function (
//    jazzMan
    ) {
    "use strict";
    logD("enter SpecHelper.js define()");

    beforeEach(function() {
        this.addMatchers({
            toBePlaying: function(expectedSong) {
                var player = this.actual;
                return player.currentlyPlayingSong === expectedSong &&
                    player.isPlaying;
            }
        });
    });

//    return jazzMan;
    logD("leave SpecHelper.js define()");
});

