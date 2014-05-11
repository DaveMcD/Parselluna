/**
 * @FILE SymbolTable_Spec
 * by default, all files in test directory matching *Spec.js will be run by karma
 */

/* inform jshint not to warn that these jasmine functions are not defined */
/*global describe, xdescribe, it, before, beforeEach, after, afterEach, expect, */
/* inform jshint not to warn that my logging shortcut functions are not defined */
/*global logC, logD */
define(['Symbol', 'SymbolTable'], function( Symbol, SymbolTable ) {
    "use strict";
    // logD("enter SymbolTable_Spec.js define()");

    describe("SymbolTable", function () {
        // var sharedBetweenTests = 0;
        // var resetBeforeTests  = 6 * 9;

        beforeEach(function () {
            // still nothing
        });

        xdescribe("(1) nested simple cases", function () {
            beforeEach(function () {
                // nothing to do yet
            });

            it("(1.1) should return ...", function () {
                // TODO Consider whether additional tests are warranted
            });
        }); /* end (1) test suite subset */

		it("(2) Top level should ...", function () {
            var thirdSymbol = new Symbol('sym3', 'kindCC');
            var testSymTab = new SymbolTable();
            testSymTab.addSymbol(new Symbol('sym1', 'kindAA'));
            testSymTab.addSymbol(new Symbol('sym2', 'kindBB'));
            testSymTab.addSymbol(new Symbol('sym4', 'kindDD'));

            testSymTab.addSymbol(thirdSymbol);


            expect(testSymTab.hasSymbol('sym2')).toBe(true);
            expect(testSymTab.hasSymbol('Not_A_Symbol')).toBe(false);
            expect(testSymTab.getSymbolNamed('sym3')).toEqual(thirdSymbol);
		});
		
    }); /* end outermost test suite */

    // logD("leave SymbolTable_Spec.js define()");
});  /* closure for requireJS define() */