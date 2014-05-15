/**
 * @FILE Grammar_Spec
 * by default, all files in test directory matching *Spec.js will be run by karma
 */

/* inform jshint not to warn that these jasmine functions are not defined */
/*global describe, it, xdescribe, xit, before, beforeEach, after, afterEach, expect, */
/* inform jshint not to warn that my logging shortcut functions are not defined */
/*global logC, logD */
define(['Grammar'], function( Grammar ) {
    "use strict";
    // ε	&epsilon;	&#949;	&#x3B5;	Lowercase Epsilon  Unicode U+03BF
    // var EPSILON_CODE = 949;
    // var EPSILON_CHAR = String.fromCharCode(EPSILON_CODE);

    // logD("enter Grammar_Spec.js define()");

    describe("Grammar", function () {

        describe("(1) has individual features that work", function () {
            // TODO:  figure out WHY test case results still appear when test specs are commented out.
            it("(1.1) Empty input throws appropriate error", function () {
                expect(function(){ new Grammar(); }).toThrow(
                    "Error 30: Grammar constructor says: non-empty bnfString is required");
                expect(function(){ new Grammar(""); }).toThrow(
                    "Error 30: Grammar constructor says: non-empty bnfString is required");
            });

            it("(1.2) Malformed input throws appropriate error", function () {
                expect(function(){ new Grammar("JunkBNF"); }).toThrow(
                    "Error 51: BNF.init says: Invalid Grammar syntax. [JunkBNF] on line 1");
            });

            // NOTE: Currently, nested describes result in double execution of test cases
            //       (or, at least, double reporting of test cases)
            //       For failing cases, often the first 'set' of cases reports 'passed'
            //       while second set of cases shows the failures.
            describe("(1.3) Minimal complete grammars recognized ...", function () {
                var expectedPrettyOutput = "Goal::==\n    [$]\n";

                it("(1.3.1) When there are no spaces", function () {
                    var testGrammar = new Grammar("Goal::==$");
                    var bnf_Object = testGrammar.doNotUseThis_getGrammarBNF();
                    var prettyOutput = bnf_Object.prettyString();
                //    var prettyOutput = testGrammar.getBNF().prettyString();
                    expect( prettyOutput ).toBe( expectedPrettyOutput );
                });

                it("(1.3.2) When there are spaces everywhere", function () {
                    var testGrammar = new Grammar("  Goal  ::==  $  ");
                    var bnf_Object = testGrammar.doNotUseThis_getGrammarBNF();
                    var prettyOutput = bnf_Object.prettyString();
                //    var prettyOutput = testGrammar.bnf.getBNF().prettyString();
                    expect( prettyOutput ).toBe( expectedPrettyOutput );
                });

                it("(1.3.3) When there are leading and trailing spaces", function () {
                    var testGrammar = new Grammar(" Goal::==$ ");
                    var bnf_Object = testGrammar.doNotUseThis_getGrammarBNF();
                    var prettyOutput = bnf_Object.prettyString();
                //   var prettyOutput = testGrammar.bnf.prettyString();
                    expect( prettyOutput ).toBe( expectedPrettyOutput );
                });

                it("(1.3.4) When there are spaces around ::== only", function () {
                    var testGrammar = new Grammar("Goal ::== $");
                    var bnf_Object = testGrammar.doNotUseThis_getGrammarBNF();
                    var prettyOutput = bnf_Object.prettyString();
//    var prettyOutput = testGrammar.bnf.prettyString();
                    expect( prettyOutput ).toBe( expectedPrettyOutput );
                });

            }); /* end 1.3 */

            describe("(1.4) Epsilon is recognized ...", function () {
                // var expectedPrettyOutput = "EmptyGoal::==\n    []\n";
                var expectedPrettyOutput = "EmptyGoal::==\n    [ε]\n";

                it("(1.4.1) as UTF-8 code 949", function () {
                    var testGrammar = new Grammar("EmptyGoal ::== ε ");
                    var bnf_Object = testGrammar.doNotUseThis_getGrammarBNF();
                    var prettyOutput = bnf_Object.prettyString();
                //    var prettyOutput = testGrammar.prettyString();
                    expect( prettyOutput ).toBe( expectedPrettyOutput );
                });

                it("(1.4.2) or as empty space", function () {
                    var testGrammar = new Grammar("  EmptyGoal  ::==   ");
                    var bnf_Object = testGrammar.doNotUseThis_getGrammarBNF();
                    var prettyOutput = bnf_Object.prettyString();
                //    var prettyOutput = testGrammar.prettyString();
                    expect( prettyOutput ).toBe( expectedPrettyOutput );
                });

                it("(1.4.3) or as zero length text on RHS", function () {
                    var testGrammar = new Grammar("  EmptyGoal  ::==");
                    var bnf_Object = testGrammar.doNotUseThis_getGrammarBNF();
                    var prettyOutput = bnf_Object.prettyString();
                //    var prettyOutput = testGrammar.prettyString();
                    expect( prettyOutput ).toBe( expectedPrettyOutput );
                });
            }); /* end 1.4 */

            describe("(1.5) Pipes designate alternate productions ...", function () {
                var expectedPrettyOutput = "A_or_B_Goal::==\n    [A]\n    [B]\n";

                it("(1.5.1) without spaces", function () {
                    var testGrammar = new Grammar("A_or_B_Goal::==A|B");
                    var bnf_Object = testGrammar.doNotUseThis_getGrammarBNF();
                    var prettyOutput = bnf_Object.prettyString();
                //    var prettyOutput = testGrammar.prettyString();
                    expect( prettyOutput ).toBe( expectedPrettyOutput );
                });

                it("(1.5.2) with spaces everywhere", function () {
                    var testGrammar = new Grammar(" A_or_B_Goal ::== A | B ");
                    var bnf_Object = testGrammar.doNotUseThis_getGrammarBNF();
                    var prettyOutput = bnf_Object.prettyString();
                //    var prettyOutput = testGrammar.prettyString();
                    expect( prettyOutput ).toBe( expectedPrettyOutput );
                });

                it("(1.5.3) with some spaces", function () {
                    var testGrammar = new Grammar("A_or_B_Goal ::== A| B");
                    var bnf_Object = testGrammar.doNotUseThis_getGrammarBNF();
                    var prettyOutput = bnf_Object.prettyString();
                //    var prettyOutput = testGrammar.prettyString();
                    expect( prettyOutput ).toBe( expectedPrettyOutput );
                });
            }); /* end 1.5 */

            describe("(1.6) Empty heads also designate alternate productions ...", function () {
                var expectedPrettyOutput = "A_or_B_Goal::==\n    [A]\n    [B]\n";

                it("(1.6.1) without spaces", function () {
                    var testGrammar = new Grammar("A_or_B_Goal::==A\n::==B");
                    var bnf_Object = testGrammar.doNotUseThis_getGrammarBNF();
                    var prettyOutput = bnf_Object.prettyString();
                //    var prettyOutput = testGrammar.prettyString();
                    expect( prettyOutput ).toBe( expectedPrettyOutput );
                });

                it("(1.6.2) with spaces everywhere", function () {
                    var testGrammar = new Grammar(" A_or_B_Goal ::== A \n ::== B ");
                    var bnf_Object = testGrammar.doNotUseThis_getGrammarBNF();
                    var prettyOutput = bnf_Object.prettyString();
                //    var prettyOutput = testGrammar.prettyString();
                    expect( prettyOutput ).toBe( expectedPrettyOutput );
                });

                it("(1.6.3) with some spaces", function () {
                    var testGrammar = new Grammar("A_or_B_Goal::==A \n ::==B");
                    var bnf_Object = testGrammar.doNotUseThis_getGrammarBNF();
                    var prettyOutput = bnf_Object.prettyString();
                //    var prettyOutput = testGrammar.prettyString();
                    expect( prettyOutput ).toBe( expectedPrettyOutput );
                });
            }); /* end 1.6 */

            describe("(1.7) Pipes and empty heads designate alternate productions when mixed ...", function () {
                var expectedPrettyOutput = "A_or_B_or_C_or_D_Goal::==\n    [A]\n    [B]\n    [C]\n    [D]\n";

                it("(1.7.1) without spaces (and extra \\n)", function () {
                    var testGrammar = new Grammar("A_or_B_or_C_or_D_Goal::==A|B\n::==C|D\n");
                    var bnf_Object = testGrammar.doNotUseThis_getGrammarBNF();
                    var prettyOutput = bnf_Object.prettyString();
                //    var prettyOutput = testGrammar.prettyString();
                    expect( prettyOutput ).toBe( expectedPrettyOutput );
                });

                it("(1.7.2) with spaces everywhere", function () {
                    var testGrammar = new Grammar(" A_or_B_or_C_or_D_Goal ::== A | B \n ::== C | D ");
                    var bnf_Object = testGrammar.doNotUseThis_getGrammarBNF();
                    var prettyOutput = bnf_Object.prettyString();
                //    var prettyOutput = testGrammar.prettyString();
                    expect( prettyOutput ).toBe( expectedPrettyOutput );
                });

                it("(1.7.3) with some spaces", function () {
                    var testGrammar = new Grammar("A_or_B_or_C_or_D_Goal ::== A| B\n::==C |D");
                    var bnf_Object = testGrammar.doNotUseThis_getGrammarBNF();
                    var prettyOutput = bnf_Object.prettyString();
                //    var prettyOutput = testGrammar.prettyString();
                    expect( prettyOutput ).toBe( expectedPrettyOutput );
                });
            }); /* end 1.7 */

            xit("(1.8) Pipes indicate choices", function () {
                var testGrammar = new Grammar("Goal ::== a|b");
                var prettyOutput = testGrammar.prettyString();
            }); /* end 1.8 */


        }); /* end 1 */

        describe("(2) For simple grammar", function () {

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

                this.bnf = new Grammar(this.inputText);
            });

            afterEach(function () {
                delete this.inputText;
                delete this.bnf;
            });

//            it("(2.1) reads BNF and prettyString at least starts with correct stuff", function () {
//                var bnfAsString = this.bnf.prettyGrammarString();
//                expect(bnfAsString).toMatch(this.prettyStartsWith);
//            });

            it("(2.2) generates correct list of terminals", function () {
                var expectedTerminals = {
                    1 : '#', 2 : '#', 3 : '#', $ : '#', '{' : '#', '}' : '#',
                    printKW : '#', '(' : '#', ')' : '#', '"' : '#',
                    ' '  : '#', a : '#', b : '#', c : '#' };
                var terminalsObj = this.bnf.getTerminals();
                expect(terminalsObj).toEqual(expectedTerminals);
            });

            it("(2.3) generates correct sorted list of terminalChars", function () {
                var expectedTerminalCharList = {
                    1 : '#', 2 : '#', 3 : '#', $ : '#', '{' : '#', '}' : '#',
                    p : '#', r : '#', i : '#', n : '#', t : '#', K : '#', W : '#',
                    '(' : '#', ')' : '#', '"' : '#', ' ' : '#', a : '#', b : '#', c : '#' };
                var terminalCharListObj = this.bnf.getTerminalCharList();
                expect(terminalCharListObj).toEqual(expectedTerminalCharList);
            });

            it("(2.4) generates correct list of keywords", function () {
                var expectedKeywords = { printKW : '#' };
//                var goalIndex = this.bnf.getGoalIndex();
                var keywordsObj = this.bnf.getKeywords();

                expect(keywordsObj).toEqual(expectedKeywords);
            });


            // TODO: this.bnf.bnf is symptom of the need to refactor.
            it("(2.5) tracks the original Goal correctly", function () {
                var expectedGoalName = "ProgramNT";
                var returnedGoalIndex = this.bnf.getGoalIndex();

                var returnedGoalText = this.bnf.bnf[returnedGoalIndex].headName;
                expect(returnedGoalText).toEqual(expectedGoalName);
            });

        }); /* end simple test suite (Grammar) */

        // TODO: need to sort expected answer
        describe("(3) For realistic grammar", function () {

            beforeEach(function () {
                this.inputText = 	"Program ::==   Block $ \n" +
                    "  Block ::== { StatementList }   \n" +
                    "StatementList ::== Statement StatementList  \n" +
                    "   ::==  ε \n" +
                    "Statement ::== StringExpr \n" +
                    "	::== PrintStatement | VarDecl\n" +
                //    "	::== VarDecl \n" +
                    "	::== Block \n" +
                    "PrintStatement ::== print ( Expr )\n" +
                    "Expr ::== StringExpr\n" +
                    "StringExpr ::== \" space digit \" \n" +
                    "VarDecl ::== type Id \n" +
                    "type ::== int | string | boolean \n" +
                    "space ::== ' '\n" +
                    " digit ::== 1...2 | 3 \n";
                /* same order as input */
                this.pretty =
                    "Program::==\n" +
                    "    [Block#$]\n" +
                    "Block::==\n" +
                    "    [{#StatementList#}]\n" +
                    "StatementList::==\n" +
                    "    [Statement#StatementList]\n" +
                    "    [ε]\n" +
                    "Statement::==\n" +
                    "    [StringExpr]\n" +
                    "    [PrintStatement]\n" +
                    "    [VarDecl]\n" +
                    "    [Block]\n" +
                    "PrintStatement::==\n" +
                    "    [print#(#Expr#)]\n" +
                    "Expr::==\n" +
                    "    [StringExpr]\n" +
                    "StringExpr::==\n" +
                    "    [\"#space#digit#\"]\n" +
                    "VarDecl::==\n" +
                    "    [type#Id]\n" +
                    "type::==\n" +
                    "    [int]\n" +
                    "    [string]\n" +
                    "    [boolean]\n" +
                    "space::==\n" +
                    "    [ ]\n" +
                    "digit::==\n" +
                    "    [1]\n" +
                    "    [2]\n" +
                    "    [3]\n" ;

                /* output is sorted by headName */
                this.prettySorted =
                    "Block::==\n" +
                    "    [{#StatementList#}]\n" +
                    "Expr::==\n" +
                    "    [StringExpr]\n" +
                    "PrintStatement::==\n" +
                    "    [print#(#Expr#)]\n" +
                    "Program::==\n" +
                    "    [Block#$]\n" +
                    "Statement::==\n" +
                    "    [StringExpr]\n" +
                    "    [PrintStatement]\n" +
                    "    [VarDecl]\n" +
                    "    [Block]\n" +
                    "StatementList::==\n" +
                    "    [Statement#StatementList]\n" +
                    "    [ε]\n" +
                    "StringExpr::==\n" +
                    "    [\"#space#digit#\"]\n" +
                    "VarDecl::==\n" +
                    "    [type#Id]\n" +
                    "digit::==\n" +
                    "    [1]\n" +
                    "    [2]\n" +
                    "    [3]\n" +
                    "space::==\n" +
                    "    [ ]\n" +
                    "type::==\n" +
                    "    [int]\n" +
                    "    [string]\n" +
                    "    [boolean]\n" ;

                // TODO: rename this.bnf to this.realGrammar
                this.bnf = new Grammar(this.inputText);
            });

            afterEach(function () {
                delete this.inputText;
                delete this.bnf;
            });

            /* 3.1 fails now that bnf is always sorted */
            xit("(3.1) Can read its input and make it pretty", function () {
                // var myGoal = this.bnf[0];
                var bnfAsString = this.bnf.prettyString();
                expect(bnfAsString).toBe(this.pretty);
            });

//            it("(3.2) Can read its input, sort and make it pretty", function () {
//                // var myGoal = this.bnf[0];
//                var bnfAsString = this.bnf.prettyGrammarString();
//                expect(bnfAsString).toBe(this.prettySorted);
//            });

            it("(3.2) provides list of GrammarSymbols matching name and where they live (via method and via member)", function () {
                var matchingGramSyms;
                var prodSetName = "StringExpr";

                // matchingGramSyms = this.bnf.getRightSideGrammarSymbolsNamed('StatementList');
                matchingGramSyms = this.bnf.getRightSideGrammarSymbolsNamed('Block');
                // logD("For", 'Block', "Got GramSyms", matchingGramSyms);
                expect(matchingGramSyms[0].getParentProduction().getParentProductionSet().head.name).toEqual('Program');
                expect(matchingGramSyms[1].getParentProduction().getParentProductionSet().head.name).toEqual('Statement');
                expect(matchingGramSyms[0].parentProductionSet.head.name).toEqual('Program');
                expect(matchingGramSyms[1].parentProductionSet.head.name).toEqual('Statement');

                // NOTE: we need to expect a newline character at the very end of prettyString
                var expectedPrettyProdSet = "StringExpr::==\n    [\"#spaceTERM#digitTERM#charTERM#\"]\n";

//                var returnedProdSet = this.bnf.getProductionSetNamed(prodSetName);
//                expect(returnedProdSet.prettyString()).toBe(expectedPrettyProdSet);
//
//                // via index lookup of BNF
//                var returnedIndex = this.bnf.indexOfProductionSetNamed(prodSetName);
//                var indexedProdSet = this.bnf.getBNF()[returnedIndex];
//                expect(indexedProdSet.prettyString()).toEqual(expectedPrettyProdSet);
            });

        }); /* end realistic test suite (Grammar) */

        xdescribe("(4) perform well searching itself", function () {
            var stupidDeepBnf;

            beforeEach(function () {
                // var c1, c2;
                var stupidDeepGrammar = "Goal ::== ";
//                var firstChars  = 'zyxw'.split("");       // just 4 chars, for faster, smaller test
//                var secondChars = 'abcd'.split("");       // just 4 chars, for faster, smaller test
                var thirdChars  = 'c'.split("");         // just 1 char, for faster, smaller test
                var firstChars  = 'zyxwvutsrqpomnlkjihgfedcbaZYXWVUTSRQPOMNLKJIHGFEDCBA'.split("");
                var secondChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split("");
//                var thirdChars  = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split("");
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
                stupidDeepBnf = new Grammar(stupidDeepGrammar);
            });

            it("(4.1)to see if a string can be found on left side (head)", function () {
                  expect(stupidDeepBnf.hasMemberHead('zbc')).toBe(true);
                  expect(stupidDeepBnf.hasMemberHead('ZZtop')).toBe(false);
            });

        });

        describe("(5) properly identifies all nullable NonTerminals", function () {
            var inputText =
                "Goal      ::==   DeriveNull_In_3 $ \n" +
                "DeriveNull_In_3 ::== Takes2 Takes1  \n" +
                    "	   ::== NeverNull \n" +
                "Takes2    ::== Takes0 Takes1  \n" +
                    "	   ::== VarDecl \n" +
                "Takes1    ::== NeverNull \n" +
                    "	   ::== Takes0 \n" +
                "Takes0    ::== NeverNull\n" +
                    "      ::==  ε \n" +
                "NeverNull ::== print ( digit )\n" +
                "VarDecl   ::== type Id \n" +
                "type      ::== int | string | boolean \n" +
                "Id        ::== A...C \n" +
                "digit     ::== 1...2 | 3 \n";

            var nullTestGram = new Grammar(inputText);

            var bnfObj = nullTestGram.doNotUseThis_getGrammarBNF();
            var prodToTest;

//            prodToTest = bnfObj.getProductionSetNamed('Takes0');
//            expect(prodToTest.symbolDerivesEmpty).toBe(true);
//            prodToTest = bnfObj.getProductionSetNamed('NeverNull');
//            expect(prodToTest.symbolDerivesEmpty).toBe(false);

            // no longer needed here - called during constructor.
            // nullTestGram.markNullableProductionSets();

            prodToTest = bnfObj.getProductionSetNamed('Goal');
            expect(prodToTest.symbolDerivesEmpty).toBe(false);
            prodToTest = bnfObj.getProductionSetNamed('NeverNull');
            expect(prodToTest.symbolDerivesEmpty).toBe(false);
            prodToTest = bnfObj.getProductionSetNamed('VarDecl');
            expect(prodToTest.symbolDerivesEmpty).toBe(false);
            prodToTest = bnfObj.getProductionSetNamed('type');
            expect(prodToTest.symbolDerivesEmpty).toBe(false);
            prodToTest = bnfObj.getProductionSetNamed('Id');
            expect(prodToTest.symbolDerivesEmpty).toBe(false);
            prodToTest = bnfObj.getProductionSetNamed('digit');
            expect(prodToTest.symbolDerivesEmpty).toBe(false);

            prodToTest = bnfObj.getProductionSetNamed('Takes0');
            expect(prodToTest.symbolDerivesEmpty).toBe(true);
            prodToTest = bnfObj.getProductionSetNamed('Takes1');
            expect(prodToTest.symbolDerivesEmpty).toBe(true);
            prodToTest = bnfObj.getProductionSetNamed('Takes2');
            expect(prodToTest.symbolDerivesEmpty).toBe(true);
            prodToTest = bnfObj.getProductionSetNamed('DeriveNull_In_3');
            expect(prodToTest.symbolDerivesEmpty).toBe(true);

            prodToTest = bnfObj.getProductionSetNamed('NotInGrammar');
            expect(prodToTest).toBeUndefined();

            // beforeEach(function () {
            // });

//            it("(5.1) to see if a string can be found on left side (head)", function () {
//
//                 //  expect(stupidDeepBnf.hasMemberHead('zbc')).toBe(true);
//                 //  expect(stupidDeepBnf.hasMemberHead('ZZtop')).toBe(false);
//            });

        });

    }); /* end outermost test suite (Grammar) */

    // logD("leave Grammar_Spec.js define()");
});  /* closure for requireJS define() */