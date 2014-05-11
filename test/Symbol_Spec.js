/**
 * @FILE Symbol_Spec
 * by default, all files in test directory matching *Spec.js will be run by karma
 */

/* inform jshint not to warn that these jasmine functions are not defined */
/*global describe, xdescribe, it, before, beforeEach, after, afterEach, expect, */
/* inform jshint not to warn that my logging shortcut functions are not defined */
/*global logC, logD */
define(['Symbol'], function( Symbol ) {
    "use strict";
    // logD("enter Symbol_Spec.js define()");

    describe("Symbol", function () {
//        var sharedBetweenTests = 0;
//        var resetBeforeTests  = 6 * 9;

        beforeEach(function () {
            // Still nothing to do
       });

        xdescribe("(1) nested simple cases", function () {
            beforeEach(function () {
                // Nothing yet
            });

            it("(1.1) should return ...", function () {
                // TODO: Consider whether additional tests are warranted
            });
        }); /* end (1) test suite subset */

		it("(2) Should return values used to initialize", function () {
            var testSymbol = new Symbol('symName', 'symKind');

            expect(testSymbol.getName()).toEqual('symName');
            expect(testSymbol.getKind()).toEqual('symKind');

		});
		
    }); /* end outermost test suite */

    // logD("leave Symbol_Spec.js define()");
});  /* closure for requireJS define() */