/**
 * @FILE lexer.js
 */
// using define() because there is nothing here we want executed immediately when loaded
define(['util'], function(util) {
    "use strict";

    util.logD("enter lexer.js define(requiring util) SECOND");

    var lexerFunc = function(sourceString) {
    // var lexerFunc = function(sourceString) {
        // Grab the "raw" source code.
        var sourceCode;
        var tokenStream;

        // Trim the leading and trailing spaces.
        util.putMessage("lexer parsing source [" + sourceString + "]");
        sourceCode = util.trim(sourceString);

        // remove all spaces in the middle; remove line breaks too.
        //   note: with this simple approach, we won't be able to report the
        //         actual source position if any errors are found.
        //         Then again, even trim broke that capability.
        sourceCode = sourceCode.replace(/\s/g, "");
        // the above line makes trim 'redundant' but... for a less limited vocabulary,
        // deleting all white space like this would be a bad idea

        tokenStream = sourceCode.split("");
        // TODO: check for any invalid tokens (not in '0123456789-+')
        //       hint: steal some code from parse routine

        return tokenStream;
    };

    util.logD("leave lexer.js define(requiring util)");
    return lexerFunc;
});

