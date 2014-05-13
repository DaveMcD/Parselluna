/**
 * @FILE TerminalPattern_Spec
 *   NOTE: with standard configuration, all files in test directory matching *Spec.js will be run by karma
 * Created by
 *   @AUTHOR David McDonald
 */

/* inform jshint not to warn that these jasmine functions are not defined */
/*global describe, it, xdescribe, xit, before, beforeEach, after, afterEach, expect, */
/* inform jshint not to warn that my logging shortcut functions are not defined */
/*global logC, logD */
define(['GrammarSymbol', 'NonTerminal', 'TerminalPattern'], function (GrammarSymbol, NonTerminal, TerminalPattern) {
    "use strict";
    // logD("enter TerminalPattern_Spec.js define()");

    describe("TerminalPattern", function () {   // outermost test suite
        beforeEach(function () {
        //    this.newForEachCalculated = 'top_level';
        });

        describe("(1) nested simple cases", function () {
            beforeEach(function () {
                //    this.freshNestedAnswer = 'nested_answer';
            });

            it("(1.1) should return ...", function () {
                var myTermPat = new TerminalPattern('aName', 'theText');
                // logD("(1.1)Testing nested_answer");
                expect(myTermPat instanceof Object).toBe(true);
                expect(myTermPat instanceof GrammarSymbol).toBe(true);
                expect(myTermPat instanceof NonTerminal).toBe(true);
                expect(myTermPat instanceof TerminalPattern).toBe(true);
                expect(function(){ myTermPat.parseIt('ts', 'ct');} ).not.toThrow();
                expect(myTermPat.name).toEqual('aName');
                expect(myTermPat.text).toEqual('theText');
            });
        });
        /* end (1) test suite subset */

//        it("(2) Top level should ...", function () {
//            var expected = 'top_level';
//            // logD("(2) Top Level ");
//            expect(this.newForEachCalculated).toEqual(expected);
//        });

    });
    /* end outermost test suite */

    // logD("leave TerminalPattern_Spec.js define()");
});
/* closure for RequireJS define() */