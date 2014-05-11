/**
 * @FILE Token_Spec.js
 * by default, all files in test directory matching *Spec.js will be run by karma
 */

/* inform jshint not to warn that these jasmine functions are not defined */
/*global describe, xdescribe, it, before, beforeEach, after, afterEach, expect, */
/* inform jshint not to warn that my logging shortcut functions are not defined */
/*global logC, logD */
define(['Token'], function( Token ) {
    "use strict";
    // logD("enter Token_Spec.js define()");

    describe("Token", function () {
//        var sharedBetweenTests = 0;

        beforeEach(function () {
            // this.tokForAll = new Token('first', 'second');
        });

        xdescribe("(1) nested simple cases", function () {
            // TODO: Test that all available params for Token are saved and retrieved
            beforeEach(function () {
            });

            it("(1.1) should return ...", function () {
                expect("one").toBe('one');
            });
        }); /* end (1) test suite subset */

		it("(2) Top level should ...", function () {
            var tok = new Token("name1", 'value2');

			// logD("(2) Top Level ");
			expect(tok.getKind()).toEqual('name1');
			expect(tok.getLexeme()).toEqual('value2');
            tok.setLexeme('newValue2');
			expect(tok.getLexeme()).toEqual('newValue2');

            // console.log("token instance count is:", tok.getModGlobal('instanceCount'));
            // var tok2 = new Token('name2', 'value2');
            // console.log("token instance count is:", tok.getModGlobal('instanceCount'));
		});
		
    }); /* end outermost test suite */

    // logD("leave Token_Spec.js define()");
});  /* closure for requireJS define() */