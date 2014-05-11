/**
 * @FILE DFA_Spec.js
 * by default, all files in test directory matching *Spec.js will be run by karma
 */

/* inform jshint not to warn that these jasmine functions are not defined */
/*global describe, it, before, beforeEach, after, afterEach, expect, */
/* inform jshint not to warn that my logging shortcut functions are not defined */
/*global logC, logD */
define(['DFA', 'util'], function( DFA, util ) {
    "use strict";
    // logD("enter DFA_Spec.js define()");

    describe("DFA", function () {

        beforeEach(function () {
            this.testDFA = new DFA();
            // manually setup StringExpr
            this.testDFA.addDelimitedSequence("StringExpr", '"',
                " abcdefghijklmnopqrstuvwxyz", '"');
            // manually setup Id (filter out keywords from symbol table later)
            //                   (filter out Id's over MAX_ID_LEN later)
            this.testDFA.addUnlimitedSequence("Id", "abcdefghijklmnopqrstuvwxyz");

        });

        describe("(1) should let us add a Terminal to DFA", function () {
        //    var commonDFA = new DFA();

            beforeEach(function () {
                this.testDFA.addTerm('EndProgram', '$');
            });

            it("(1.1) find it in appropriate place", function () {
                var nextState = this.testDFA.nextState(0, '$');
                expect(nextState).toEqual(5);
                expect(this.testDFA.acceptedLabel(nextState)).toEqual('EndProgram');

                var breakState = this.testDFA.nextState(0, '#');
                expect(breakState).toEqual(-1);
                // TODO: test that we get undefined back for an intermediate state
//                this.testDFA.addTerm('{', 'braceL');
//            });

//            it("(1.2) and find it in appropriate place", function () {
             //   var nextState;
//                var nextNextState;
                this.testDFA.addTerm('braceL', '{');
                this.testDFA.addTerm('braceR', '}');
                nextState = this.testDFA.nextState(0, '}');
                expect(this.testDFA.acceptedLabel(nextState)).toEqual('braceR');
                nextState = this.testDFA.nextState(0, '{');
                expect(this.testDFA.acceptedLabel(nextState)).toEqual('braceL');

                //this.testDFA.addTerm('if', 'IF');

                // nextState = this.testDFA.nextState(0, '}');
                // expect(this.testDFA.acceptedLabel(nextState)).toEqual('braceR');
                var testTerm = 'nowisthetime';

                // for (var ii = 0; ii < testTerm.length; ++ii)
                var ii = 0;
                // note that this fails for empty string - should check length first
                nextState = this.testDFA.nextState(0, testTerm.charAt(ii++));
                while(nextState > 0 && ii < testTerm.length) {
                    var curState = nextState;
                    nextState = this.testDFA.nextState(curState, testTerm.charAt(ii++));
                }
                if (ii === testTerm.length && nextState  && nextState > 1) {
                    // we ran out of input, but nextState may be valid
                    curState = nextState;
                }
                var acceptance;
                acceptance = this.testDFA.acceptedLabel(curState);
                expect(acceptance).toBeDefined();
                expect(acceptance).toEqual('Id');


                testTerm = '"now is the time"';
                // for (var ii = 0; ii < testTerm.length; ++ii)
                ii = 0;
                curState =  this.testDFA.START_STATE;
                nextState = this.testDFA.nextState(curState, testTerm.charAt(ii++));
                while(nextState > 1 && ii < testTerm.length) {
                    curState = nextState;
                    nextState = this.testDFA.nextState(curState, testTerm.charAt(ii++));
                }
                if (ii === testTerm.length && nextState  && nextState > 1) {
                    // we ran out of input, but nextState may be valid
                    curState = nextState;
                }
                acceptance = this.testDFA.acceptedLabel(curState);
                expect(acceptance).toBeDefined();
                expect(acceptance).toEqual("StringExpr");
                util.logD("in (1.2) this.testDFA.dfat is:", this.testDFA.dfat.toString());
                util.logD("in (1.2) this.testDFA is:", this.testDFA.prettyString());
            });
        }); /* end (1) test suite subset */

		it("(2) Debug print of DFA ...", function () {
            var nakedDFA = new DFA();
            nakedDFA.addTerm('PrintStatementKeyword', 'print'  );
            nakedDFA.addTerm('IfStatementKeyword'   , 'if'     );
            nakedDFA.addTerm('WhileStatementKeyword', 'while'  );
            nakedDFA.addTerm('boolval'              , 'false'  );
            nakedDFA.addTerm('boolval'              , 'true'   );
            nakedDFA.addTerm('type'                 , 'int'    );
            nakedDFA.addTerm('type'                 , 'string' );
            nakedDFA.addTerm('type'                 , 'boolean');

            util.logD("nakedDFA is:", nakedDFA.prettyString());
		});
		
		it("(3) Debug print of dfat ...", function () {
            var dfatReference = this.testDFA.getModGlobal('dfat');
            util.logD("dfatReference is:", dfatReference.toString());
		});

    }); /* end outermost test suite */

    // logD("leave DFA_Spec.js define()");
});  /* closure for requireJS define() */