/**
 * @FILE BNF_Spec
 *   NOTE: with standard configuration, all files in test directory matching *Spec.js will be run by karma
 * Created by
 *   @AUTHOR David McDonald
 */

/* inform jshint not to warn that these jasmine functions are not defined */
/*global describe, it, xdescribe, xit, before, beforeEach, after, afterEach, expect, */
/* inform jshint not to warn that my logging shortcut functions are not defined */
/*global logC, logD */
define(['BNF'], function (BNF) {
    "use strict";
    // logD("enter BNF_Spec.js define()");

    // ε	&epsilon;	&#949;	&#x3B5;	Lowercase Epsilon  Unicode U+03BF
    // var EPSILON_CODE = 949;
    // var EPSILON_CHAR = String.fromCharCode(EPSILON_CODE);

    // logD("enter Grammar_Spec.js define()");

    describe("Grammar", function () {

        describe("(1) has individual features that work", function () {
            it("(1.1) Empty input throws appropriate error", function () {
                expect(function(){ new BNF(); }).toThrow(
                    "Error 30: BNF constructor says: non-empty bnfString is required");
                expect(function(){ new BNF(""); }).toThrow(
                    "Error 30: BNF constructor says: non-empty bnfString is required");
            });

            it("(1.2) Malformed input throws appropriate error", function () {
                var testBNF = new BNF("JunkBNF");
                expect(function(){ testBNF.init(); }).toThrow(
                    "Error 51: BNF.init says: Invalid Grammar syntax. [JunkBNF] on line 1");
                // NOTE: spaces on bad syntax line are included in the error message thrown.
                testBNF = new BNF("Goal::== terminalPattern \n JunkBNF ");
                expect(function(){ testBNF.init(); }).toThrow(
                    "Error 51: BNF.init says: Invalid Grammar syntax. [ JunkBNF ] on line 2");
            });

            describe("(1.3) Minimal complete grammars recognized ...", function () {
                var expectedPrettyOutput = "Goal::==\n    [$]\n";

                it("(1.3.1) When there are no spaces", function () {
                    var testGrammar = new BNF("Goal::==$");
                    var prettyOutput = testGrammar.prettyString();
                    expect( prettyOutput ).toBe( expectedPrettyOutput );
                });

                it("(1.3.2) When there are spaces everywhere", function () {
                    var testGrammar = new BNF("  Goal  ::==  $  ");
                    var prettyOutput = testGrammar.prettyString();
                    expect( prettyOutput ).toBe( expectedPrettyOutput );
                });

                it("(1.3.3) When there are leading and trailing spaces", function () {
                    var testGrammar = new BNF(" Goal::==$ ");
                    var prettyOutput = testGrammar.prettyString();
                    expect( prettyOutput ).toBe( expectedPrettyOutput );
                });

                it("(1.3.4) When there are spaces around ::== only", function () {
                    var testGrammar = new BNF("Goal ::== $");
                    var prettyOutput = testGrammar.prettyString();
                    expect( prettyOutput ).toBe( expectedPrettyOutput );
                });

            }); /* end 1.3 */

            describe("(1.4) Epsilon is recognized ...", function () {
                // var expectedPrettyOutput = "EmptyGoal::==\n    []\n";
                var expectedPrettyOutput = "EmptyGoal::==\n    [ε]\n";

                it("(1.4.1) as UTF-8 code 949", function () {
                    var testGrammar = new BNF("EmptyGoal ::== ε ");
                    var prettyOutput = testGrammar.prettyString();
                    expect( prettyOutput ).toBe( expectedPrettyOutput );
                });

                it("(1.4.2) or as empty space", function () {
                    var testGrammar = new BNF("  EmptyGoal  ::==   ");
                    var prettyOutput = testGrammar.prettyString();
                    expect( prettyOutput ).toBe( expectedPrettyOutput );
                });

                it("(1.4.3) or as zero length text on RHS", function () {
                    var testGrammar = new BNF("  EmptyGoal  ::==");
                    var prettyOutput = testGrammar.prettyString();
                    expect( prettyOutput ).toBe( expectedPrettyOutput );
                });
            }); /* end 1.4 */

            describe("(1.5) Pipes designate alternate productions ...", function () {
                var expectedPrettyOutput = "A_or_B_Goal::==\n    [A]\n    [B]\n";

                it("(1.5.1) without spaces", function () {
                    var testGrammar = new BNF("A_or_B_Goal::==A|B");
                    var prettyOutput = testGrammar.prettyString();
                    expect( prettyOutput ).toBe( expectedPrettyOutput );
                });

                it("(1.5.2) with spaces everywhere", function () {
                    var testGrammar = new BNF(" A_or_B_Goal ::== A | B ");
                    var prettyOutput = testGrammar.prettyString();
                    expect( prettyOutput ).toBe( expectedPrettyOutput );
                });

                it("(1.5.3) with some spaces", function () {
                    var testGrammar = new BNF("A_or_B_Goal ::== A| B");
                    var prettyOutput = testGrammar.prettyString();
                    expect( prettyOutput ).toBe( expectedPrettyOutput );
                });
            }); /* end 1.5 */

            describe("(1.6) Empty heads also designate alternate productions ...", function () {
                var expectedPrettyOutput = "A_or_B_Goal::==\n    [A]\n    [B]\n";

                it("(1.6.1) without spaces", function () {
                    var testGrammar = new BNF("A_or_B_Goal::==A\n::==B");
                    var prettyOutput = testGrammar.prettyString();
                    expect( prettyOutput ).toBe( expectedPrettyOutput );
                });

                it("(1.6.2) with spaces everywhere", function () {
                    var testGrammar = new BNF(" A_or_B_Goal ::== A \n ::== B ");
                    var prettyOutput = testGrammar.prettyString();
                    expect( prettyOutput ).toBe( expectedPrettyOutput );
                });

                it("(1.6.3) with some spaces", function () {
                    var testGrammar = new BNF("A_or_B_Goal::==A \n ::==B");
                    var prettyOutput = testGrammar.prettyString();
                    expect( prettyOutput ).toBe( expectedPrettyOutput );
                });
            }); /* end 1.6 */

            describe("(1.7) Pipes and empty heads designate alternate productions when mixed ...", function () {
                var expectedPrettyOutput = "A_or_B_or_C_or_D_Goal::==\n    [A]\n    [B]\n    [C]\n    [D]\n";

                it("(1.7.1) without spaces (and extra \\n)", function () {
                    var testGrammar = new BNF("A_or_B_or_C_or_D_Goal::==A|B\n::==C|D\n");
                    var prettyOutput = testGrammar.prettyString();
                    expect( prettyOutput ).toBe( expectedPrettyOutput );
                });

                it("(1.7.2) with spaces everywhere", function () {
                    var testGrammar = new BNF(" A_or_B_or_C_or_D_Goal ::== A | B \n ::== C | D ");
                    var prettyOutput = testGrammar.prettyString();
                    expect( prettyOutput ).toBe( expectedPrettyOutput );
                });

                it("(1.7.3) with some spaces", function () {
                    var testGrammar = new BNF("A_or_B_or_C_or_D_Goal ::== A| B\n::==C |D");
                    var prettyOutput = testGrammar.prettyString();
                    expect( prettyOutput ).toBe( expectedPrettyOutput );
                });
            }); /* end 1.7 */

            xit("(1.8) Pipes indicate choices", function () {
                var testGrammar = new BNF("Goal ::== a|b");
               //  var prettyOutput = testGrammar.prettyString();
            }); /* end 1.8 */


        });

        describe("(2) For tagged grammar", function () {

            beforeEach(function () {
                this.inputText = 	"ProgramNT   ::==   BlockNT $ \n" +
                "  BlockNT ::== { StatementListNT }   \n" +
                "StatementListNT ::== StatementNT StatementListNT   \n" +
                "   ::== \n" +
                "StatementNT ::== StringExprNT \n" +
                "	::== PrintStatementNT \n" +
                "PrintStatementNT ::== printKW ( ExprNT )\n" +
                "ExprNT ::== StringExprNT\n" +
                "StringExprNT ::== \" spaceTERM digitTERM charTERM \" \n" +
                "spaceTERM ::== ' '\n" +
                "  digitTERM ::==1| 2 | 3\n" +
                "charTERM ::== a| b | c \n";

                // If we only keep the sorted BNF, it is harder to specify the expected result.
                // TODO: should at least do something  to compare with Goal
                this.prettyStartsWith =
                    "^BlockNT::==\n";
                // "^ProgramNT::==\n";

                this.bnf = new BNF(this.inputText);
            });

            afterEach(function () {
                delete this.inputText;
                delete this.bnf;
            });

            it("(2.1) reads BNF and prettyString at least starts with correct stuff", function () {
                var bnfAsString = this.bnf.prettyString();
                expect(bnfAsString).toMatch(this.prettyStartsWith);
            });



            // TODO: this.bnf.getBNF is symptom of the need to refactor.
            it("(2.2) tracks the original Goal correctly", function () {
                var expectedGoalName = "ProgramNT";

                var returnedGoalName = this.bnf.getBNF_GoalName();
                expect(returnedGoalName).toEqual(expectedGoalName);

                var returnedGoalIndex = this.bnf.getBNF_Goal_Index();
                var indexedGoalName = this.bnf.getBNF()[returnedGoalIndex].headName;
                expect(indexedGoalName).toEqual(expectedGoalName);
            });

            it("(2.3) stores and returns a specified ProgramSet correctly", function () {
                var prodSetName = "StringExprNT";
                // NOTE: we need to expect a newline character at the very end of prettyString
                var expectedPrettyProdSet = "StringExprNT::==\n    [\"#spaceTERM#digitTERM#charTERM#\"]\n";

                var returnedProdSet = this.bnf.getProductionSetNamed(prodSetName);
                expect(returnedProdSet.prettyString()).toBe(expectedPrettyProdSet);

                // via index lookup of BNF
                var returnedIndex = this.bnf.indexOfProductionSetNamed(prodSetName);
                var indexedProdSet = this.bnf.getBNF()[returnedIndex];
                expect(indexedProdSet.prettyString()).toEqual(expectedPrettyProdSet);
            });


        }); /* end simple test suite (Grammar) */
        describe("(4) perform well searching itself", function () {
            var stupidDeepBnf;

            beforeEach(function () {
                // var c1, c2;
                var stupidDeepGrammar = "Goal ::== ";
//                var firstChars  = 'zyxw'.split("");       // just 4 chars, for faster, smaller test
                var secondChars = 'abcd'.split("");       // just 4 chars, for faster, smaller test
                var thirdChars  = 'c'.split("");         // just 1 char, for faster, smaller test
                var firstChars  = 'zyxwvutsrqpomnlkjihgfedcbaZYXWVUTSRQPOMNLKJIHGFEDCBA'.split("");
//                var secondChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split("");
//                var thirdChars  = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split("");
//                var thirdChars  = 'c0123456789'.split("");         // 11 chars, for 'medium sized' test
                // extraStupidDeepGrammar with 52x more productions increases constructor time 200x from 15 to 3000 ms

                thirdChars.every( function(eloo, indoo) {
                    secondChars.every( function(elo, indo) {
                        firstChars.every( function(eli, indi) {
                            stupidDeepGrammar += eli + elo + eloo + "\n" + eli + elo + eloo + "::== ";
                            if (indi < indo && indo < indoo) { /* stop warnings that these are not used */ }
                            return true;
                        });
                        return true;
                    });
                    return true;
                });
                stupidDeepGrammar += "$";
                stupidDeepBnf = new BNF(stupidDeepGrammar);
            });

            it("(4.1)to see if a string can be found on left side (head)", function () {
                expect(stupidDeepBnf.hasProdSetNamed('zbc')).toBe(true);
                expect(stupidDeepBnf.hasProdSetNamed('ZZtop')).toBe(false);
            });

        });

    });
    /* end outermost test suite */

    // logD("leave BNF_Spec.js define()");
});
/* closure for RequireJS define() */