/**
 * @FILE lexer_Spec.js
 * by default, all files in test directory matching *Spec.js will be run by karma
 */

/* inform jshint not to warn that these jasmine functions are not defined */
/*global describe, it, before, beforeEach, after, afterEach, expect, */
/*global logC, logD */
define([
    // all specs should require the SpecHelper
    // with jasmine setup and plugins
    'SpecHelper' ,

    // spec dependencies
    'lexer'
],
function(
    JazzMan,        // do NOT refer to this guy, he will be undefined.
    lexer) {
    "use strict";
    logD("enter lexer_Spec.js define()");

    describe("lexer", function () {
        var expected;

//        beforeEach(function () {
//            expected = "answer";
//        });
//        afterEach(function () {
//            delete expected;
//        });

        describe("simple cases", function () {
            beforeEach(function () {
                expected = 'answer';
            });

            it("should return empty array for empty string", function () {
                var emptySequence = [];
                var tokenSequence = lexer('');
                expect(tokenSequence).toEqual(emptySequence);
            });

            it("should handle non-padded one plus two", function () {
                var expectedTokens = ['1','+','2'];
                var tokenSequence = lexer('1+2');
                logC("Testing 1+2");
                expect(tokenSequence).toEqual(expectedTokens);
            });

            it("should handle padded two minus one", function () {
                var expectedTokens = ['2','-','1'];
                var tokenSequence = lexer(' 2\n -  \n 1 ');
                expect(tokenSequence).toEqual(expectedTokens);
            });

        });
    }); /* end outermost test suite */

    logD("leave lexer_Spec.js define()");
});  /* closure for requireJS define() */