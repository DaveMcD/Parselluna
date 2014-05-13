/**
 * @FILE Production_Spec
 *   NOTE: with standard configuration, all files in test directory matching *Spec.js will be run by karma
 * Created by
 *   @AUTHOR David McDonald
 */

/* inform jshint not to warn that these jasmine functions are not defined */
/*global describe, it, xdescribe, xit, before, beforeEach, after, afterEach, expect, */
/* inform jshint not to warn that my logging shortcut functions are not defined */
/*global logC, logD */
define(['Production'], function (Production) {
    "use strict";
    // logD("enter Production_Spec.js define()");

    describe("Production", function () {   // outermost test suite
        beforeEach(function () {
            this.newForEachCalculated = 'top_level';
        });

        describe("(1) nested simple cases", function () {
            beforeEach(function () {
                this.freshNestedAnswer = 'nested_answer';
            });

            it("(1.1) should return ...", function () {
                var expected_result = 'nested_answer';
                // logD("(1.1)Testing nested_answer");
                expect(this.freshNestedAnswer).toEqual(expected_result);
            });
        });
        /* end (1) test suite subset */

        it("(2) Top level should ...", function () {
            var expected = 'top_level';
            // logD("(2) Top Level ");
            expect(this.newForEachCalculated).toEqual(expected);
        });

    });
    /* end outermost test suite */

    // logD("leave Production_Spec.js define()");
});
/* closure for RequireJS define() */