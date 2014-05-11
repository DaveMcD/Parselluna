/**
 * @FILE NonTerminal_Spec
 *   NOTE: with standard configuration, all files in test directory matching *Spec.js will be run by karma
 * Created by
 *   @AUTHOR David McDonald
 */

/* inform jshint not to warn that these jasmine functions are not defined */
/*global describe, it, xdescribe, xit, before, beforeEach, after, afterEach, expect, */
/* inform jshint not to warn that my logging shortcut functions are not defined */
/*global logC, logD */
define(['NonTerminal', 'GrammarSymbol'], function (NonTerminal, GrammarSymbol) {
    // only need GrammarSymbol for instanceof test
    "use strict";
    // logD("enter NonTerminal_Spec.js define()");

    describe("NonTerminal", function () {   // outermost test suite
        beforeEach(function () {
            this.newForEachCalculated = 'top_level';
        });

        describe("(1) nested simple cases", function () {
            beforeEach(function () {
            //    this.freshNestedAnswer = 'nested_answer';
            });

            it("(1.1) should return ...", function () {
                var myNonTerm = new NonTerminal('aName', 'theText');
                // logD("(1.1)Testing nested_answer");
                expect(myNonTerm instanceof Object). toBe(true);
                expect(myNonTerm instanceof GrammarSymbol). toBe(true);
                expect(myNonTerm instanceof NonTerminal). toBe(true);
                expect(function(){ myNonTerm.parseIt('ts', 'ct');} ).not.toThrow();
                expect(myNonTerm.name).toEqual('aName');
                expect(myNonTerm.text).toEqual('theText');
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

    // logD("leave NonTerminal_Spec.js define()");
});
/* closure for RequireJS define() */