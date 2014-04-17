/**
 * @FILE util_Spec.js
 * by default, all files in test directory matching *Spec.js will be run by karma
 */

/* inform jshint not to warn that these jasmine functions are not defined */
/*global describe, it, before, beforeEach, after, afterEach, expect, */
/*global logC, logD */
define([
    // all specs should require the SpecHelper
    // with jasmine setup and plugins
    'SpecHelper',

    // spec dependencies
    'util'
],
function(
    JazzMan,        // do NOT refer to this guy, he will be undefined.
    util) {
    "use strict";

    logD("enter util_Spec.js define()");
    logD("  Note that none of the logC calls in the tests themselves");
    logD("    will run until AFTER we leave.");

    describe("Utilities", function () {
        var trimmed;
        var rotated;

//        beforeEach(function () {
//            trimmed = "ab de";
//        });

        describe("trim should be able to remove", function () {
            beforeEach(function () {
                trimmed = "ab de";
            });

            it("leading spaces", function () {
                expect(util.trim("  ab de")).toEqual(trimmed);
            });

            it("and trailing spaces", function () {
                expect(util.trim("ab de  ")).toEqual(trimmed);
            });

            it("and both leading and trailing spaces", function () {
                logC('...Testing "  ab de  "');
                expect(util.trim("  ab de  ")).toEqual(trimmed);
            });

            it("without changing a non-padded string", function () {
                expect(util.trim("ab de")).toEqual(trimmed);
            });
        });


        describe("rot13 function", function () {
            beforeEach(function () {
                rotated = "AZ7nm";
            });

            it("should rotate letters by 13", function () {
                logD("if using the karma test runner and JetBrains IDE");
                logD("console output will be associated with the test case.");
                logC('...Testing "NM7aZ"');
                expect(util.rot13("NM7az")).toEqual(rotated);
            });

            it("and leave other characters unchanged", function () {
                expect(util.rot13("123*()")).toEqual("123*()");
            });
        });
    });

    logD("leave util_Spec.js define()");
});  /* closure for requireJS define() */