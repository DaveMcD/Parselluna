/**
 * @FILE util_Spec.js
 * by default, all files in test directory matching *Spec.js will be run by karma
 */

/* inform jshint not to warn that these jasmine functions are not defined */
/*global describe, it, before, beforeEach, after, afterEach, expect, */
/*global logC, logD */
define(['util'], function(util) {
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

        // case sensitive, Caps before lowerCase
        describe("indexFL", function () {
            var indexFL = util.indexFL;
            beforeEach(function () {

                rotated = "AZ7nm";
            });

            it("should return empty object if input is empty", function () {
                var emptyList = [];
                var emptyListAnswer = {};
                expect(indexFL(emptyList)).toEqual(emptyListAnswer);
            });

            it("should give obvious answer for one member list", function () {
                var oneItemList = ['LonelyString'];
                var oneItemAnswer = { 'L': [0, 0] };
                expect(indexFL(oneItemList)).toEqual(oneItemAnswer);
            });

            it("should throw Error if input is not sorted", function () {
                var unsortedList = ['Whiskey', 'Tango', 'Foxtrot'];
                expect(util.indexFL.bind(null, unsortedList)).toThrow("non-sorted (or with duplicates) array passed to util.indexFL");
            });

            it("should throw Error if input contains duplicates", function () {
                var dupesList = ['Hotel', 'Sierra', 'Sierra', 'Whiskey'];
                expect(util.indexFL.bind(null, dupesList)).toThrow("non-sorted (or with duplicates) array passed to util.indexFL");
            });

            describe("and do some useful things with two or more in order", function () {
                var stringList = ['Alpha', 'Apple', 'Baker', 'Bravo', 'Charlie', 'Zebra', 'apple', 'zebra', 'zephyr'];
                var indexAZ = indexFL(stringList);

                it("for example, get the first, middle and last entries correct", function () {
                    var firstAndLast_A = [0, 1];
                    var firstAndLast_C = [4, 4];
                    var firstAndLast_z = [7, 8];
                    expect(indexAZ['A']).toEqual(firstAndLast_A);
                    expect(indexAZ['C']).toEqual(firstAndLast_C);
                    expect(indexAZ['z']).toEqual(firstAndLast_z);
                });

                it("and absent initials should be undefined", function () {
                    var firstAndLast_A = [0, 1];
                    var firstAndLast_C = [4, 4];
                    var firstAndLast_z = [7, 8];
                    expect(indexAZ['D']).toBeUndefined();
                    expect(indexAZ['y']).toBeUndefined();
                });

            });
        });
    });

    logD("leave util_Spec.js define()");
});  /* closure for requireJS define() */