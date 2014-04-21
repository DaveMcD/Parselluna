/**
 * @FILE Grammar_Spec
 * by default, all files in test directory matching *Spec.js will be run by karma
 */

/* inform jshint not to warn that these jasmine functions are not defined */
/*global describe, it, before, beforeEach, after, afterEach, expect, */
/* inform jshint not to warn that my logging shortcut functions are not defined */
/*global logC, logD */
define(['Grammar'], function( Grammar ) {
    "use strict";
    // logD("enter Grammar_Spec.js define()");

    describe("Grammar", function () {
        describe("(1) For simple grammar", function () {

            beforeEach(function () {
                this.input = 	"ProgramNT   ::==   BlockNT $ \n" +
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

                this.pretty =
                    "ProgramNT::==\n" +
                    "    [BlockNT#$]\n" +
                    "Block::==\n" +
                    "    [{#StatementList#}]\n" +
                    "StatementList::==\n" +
                    "    [Statement#StatementList]\n" +
                    "    []\n" +
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

                this.bnf = new Grammar(this.input);
            });

            afterEach(function () {
                delete this.input;
                delete this.bnf;
            });

            it("(1.1) reads BNF and prettyString at least starts with correct stuff", function () {
                var bnfAsString = this.bnf.prettyString();
                expect(bnfAsString).toMatch("^ProgramNT::==");
            });

            it("(1.2) generates correct list of terminals", function () {
                var expectedTerminals = {
                    1 : '#', 2 : '#', 3 : '#', $ : '#', '{' : '#', '}' : '#',
                    printKW : '#', '(' : '#', ')' : '#', '"' : '#',
                    ' '  : '#', a : '#', b : '#', c : '#' };
                var terminalsObj = this.bnf.getTerminals();
                expect(terminalsObj).toEqual(expectedTerminals);
            });

            it("(1.3) generates correct list of terminaChars", function () {
                var expectedTerminalCharList = {
                    1 : '#', 2 : '#', 3 : '#', $ : '#', '{' : '#', '}' : '#',
                    p : '#', r : '#', i : '#', n : '#', t : '#', K : '#', W : '#',
                    '(' : '#', ')' : '#', '"' : '#', ' ' : '#', a : '#', b : '#', c : '#' };
                var terminalCharListObj = this.bnf.getTerminalCharList();
                expect(terminalCharListObj).toEqual(expectedTerminalCharList);
            });

            it("(1.4) generates correct list of keywords", function () {
                var expectedKeywords = { printKW : '#' };
                var keywordsObj = this.bnf.getKeywords();
                expect(keywordsObj).toEqual(expectedKeywords);
            });

        }); /* end simple test suite (Grammar) */

        describe("(2) For realistic grammar", function () {

            beforeEach(function () {
                this.input = 	"Program ::==   Block $ \n" +
                    "  Block ::== { StatementList }   \n" +
                    "StatementList ::== Statement StatementList   \n" +
                    "   ::== \n" +
                    "Statement ::== StringExpr \n" +
                    "	::== PrintStatement \n" +
                    "	::== VarDecl \n" +
                    "	::== Block \n" +
                    "PrintStatement ::== print ( Expr )\n" +
                    "Expr ::== StringExpr\n" +
                    "StringExpr ::== \" space digit \" \n" +
                    "VarDecl ::== type Id \n" +
                    "type ::== int | string | boolean \n" +
                    "space ::== ' '\n" +
                    " digit ::== 1| 2 | 3\n";

                this.pretty =
                    "Program::==\n" +
                    "    [Block#$]\n" +
                    "Block::==\n" +
                    "    [{#StatementList#}]\n" +
                    "StatementList::==\n" +
                    "    [Statement#StatementList]\n" +
                    "    []\n" +
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

                this.bnf = new Grammar(this.input);
            });

            afterEach(function () {
                delete this.input;
                delete this.bnf;
            });

            it("(2.1) Can read its input and make it pretty", function () {
                var myGoal = this.bnf[0];
                var bnfAsString = this.bnf.prettyString();
                expect(bnfAsString).toBe(this.pretty);
            });
        }); /* end realistic test suite (Grammar) */

        describe("(3) perform well searching itself", function () {
            var stupidDeepBnf;

            beforeEach(function () {
                var c1, c2;
                var stupidDeepGrammar = "Goal ::== ";
                var firstChars  = 'zyxw'.split("");
                var secondChars = 'abcd'.split("");
//                var firstChars  = 'zyxwvutsrqpomnlkjihgfedcbaZYXWVUTSRQPOMNLKJIHGFEDCBA'.split("");
//                var secondChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split("");
                // var thirdChars  = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split("");
                // extraStupidDeepGrammar with 52x more productions increases constructor time from 12 to 650 ms
                var thirdChars  = 'c'.split("");

                // 'abcdefghijklmnopqrstuvwxyz'.split.every( function(el, ind) {} );
                thirdChars.every( function(eloo, indoo) {
                    secondChars.every( function(elo, indo) {
                       firstChars.every( function(eli, indi) {
                          stupidDeepGrammar += eli + elo + eloo + "\n" + eli + elo + eloo + "::== ";
                           return true;
                       });
                        return true;
                    });
                    return true;
                });
                stupidDeepGrammar += "$";
                stupidDeepBnf = new Grammar(stupidDeepGrammar);
            });

            it("(3.1)to see if a string can be found on left side (head)", function () {
                  expect(stupidDeepBnf.hasMemberHead('zbc')).toBe(true);
                  expect(stupidDeepBnf.hasMemberHead('ZZtop')).toBe(false);
            });

        });

    }); /* end outermost test suite (Grammar) */

    // logD("leave Grammar_Spec.js define()");
});  /* closure for requireJS define() */