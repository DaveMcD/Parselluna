/**
 * @FILE lex_Spec
 * by default, all files in test directory matching *Spec.js will be run by karma
 */

/* inform jshint not to warn that these jasmine functions are not defined */
/*global describe, it, before, beforeEach, after, afterEach, expect, */
/* inform jshint not to warn that my logging shortcut functions are not defined */
/*global logC, logD */
define(['lex', 'DFA','Symbol', 'SymbolTable'], function( lex, DFA, Symbol, SymbolTable ) {
    "use strict";
    // logD("enter lex_Spec.js define()");
    var termKind = {
        'print':    'print',    // was: 'PrintStatementKeyword',
        'while':    'while',    // was: 'WhileStatementKeyword',
        'if':       'if',       // was: 'IfStatementKeyword',
        'int':      'type',
        'string':   'type',
        'boolean':  'type',
        'true':     'boolval',
        'false':    'boolval'
    };

    // variables shared throughout test.  ReadOnly after initialization
    // myGrammar = new Grammar("grammarString");
    var commonDFA = new DFA();
    // default DFA no longer understands Id's and StringExpr's
    // manually setup StringExpr
    commonDFA.addDelimitedSequence("StringExpr", '"',
        " abcdefghijklmnopqrstuvwxyz", '"');
    // manually setup Id (filter out keywords from symbol table later)
    //                   (filter out Id's over MAX_ID_LEN later)
    commonDFA.addUnlimitedSequence("Id", "abcdefghijklmnopqrstuvwxyz");

    commonDFA.addTerm('EndProgram', '$');
    commonDFA.addTerm('braceL', '{');
    commonDFA.addTerm('braceR', '}');
    commonDFA.addTerm('parenL', '(');
    commonDFA.addTerm('parenR', ')');
    var commonST = new SymbolTable();
    // commonST.addSymbol( new Symbol('print', termKind['print'] /* , no scopes yet */) );
    commonST.addSymbol( new Symbol('print', 'PrintStatement' /* , no scopes yet */) );
    commonST.addSymbol( new Symbol('while', 'WhileStatement' /* , no scopes yet */) );
    commonST.addSymbol( new Symbol('if', 'IfStatement' /* , no scopes yet */) );
    commonST.addSymbol( new Symbol('int', 'type' /* , no scopes yet */) );
    commonST.addSymbol( new Symbol('string', 'type' /* , no scopes yet */) );
    commonST.addSymbol( new Symbol('boolean', 'type' /* , no scopes yet */) );
    commonST.addSymbol( new Symbol('true', 'boolval' /* , no scopes yet */) );
    commonST.addSymbol( new Symbol('false', 'boolval' /* , no scopes yet */) );
    commonST.markLastKeyword();

    describe("lex", function () {


        var sharedBetweenTests = 0;
        var resetBeforeTests  = 6 * 9;

        beforeEach(function () {
//            this.myLex = new lex(" { a l print } $ ", commonDFA, commonST);
            // this.myLex = new lex(" { a longid print } $ ", commonDFA, commonST);
            //

//            this.newForEach = 'top_level';
//            resetBeforeTests = 42;
//            sharedBetweenTests += 1;
        });

        describe("(1) can parse the terminals added to DFA", function () {
            var nakedDFA = new DFA();
            nakedDFA.addTerm(termKind['print'], 'print'  );
            nakedDFA.addTerm(termKind['if']   , 'if'     );
            nakedDFA.addTerm(termKind['while'], 'while'  );
            nakedDFA.addTerm('boolval'        , 'false'  );
            nakedDFA.addTerm('boolval'        , 'true'   );
            nakedDFA.addTerm('type'           , 'int'    );
            nakedDFA.addTerm('type'           , 'string' );
            nakedDFA.addTerm('type'           , 'boolean');
            var nakedST = new SymbolTable();
            nakedST.markLastKeyword();


            beforeEach(function () {


//                this.freshNestedAnswer = 'nested_answer';
//                sharedBetweenTests += 2;
            });

            describe("(1.1) when they are unpadded", function () {
                it("(1.1.1) should recognize print and kind", function () {
                    var testLexeme = "print";
                    var nakedLex = new lex(testLexeme, nakedDFA, nakedST);
                    var nextToken;
                    var tokenText;
                    nextToken = nakedLex.getNextToken();
                    tokenText = nextToken.lexeme;
                    expect(tokenText).toEqual(testLexeme);
                    var tokenKind = nextToken.kind;
                    expect(tokenKind).toEqual(termKind[testLexeme]);
                    expect(nextToken.row).toEqual(1);
                    expect(nextToken.col).toEqual(1);
                });
                it("(1.1.2) should recognize if and kind", function () {
                    var testLexeme = "if";
                    var nakedLex = new lex(testLexeme, nakedDFA, nakedST);
                    var nextToken;
                    var tokenText;
                    nextToken = nakedLex.getNextToken();
                    tokenText = nextToken.lexeme;
                    expect(tokenText).toEqual(testLexeme);
                    var tokenKind = nextToken.kind;
                    expect(tokenKind).toEqual(termKind[testLexeme]);
                    expect(nextToken.row).toEqual(1);
                    expect(nextToken.col).toEqual(1);
                });
                it("(1.1.3) should recognize while and kind", function () {
                    var testLexeme = "while";
                    var nakedLex = new lex(testLexeme, nakedDFA, nakedST);
                    var nextToken;
                    var tokenText;
                    nextToken = nakedLex.getNextToken();
                    tokenText = nextToken.lexeme;
                    expect(tokenText).toEqual(testLexeme);
                    var tokenKind = nextToken.kind;
                    expect(tokenKind).toEqual(termKind[testLexeme]);
                    expect(nextToken.row).toEqual(1);
                    expect(nextToken.col).toEqual(1);
                });
                it("(1.1.4) should recognize false and kind", function () {
                    var testLexeme = "false";
                    var nakedLex = new lex(testLexeme, nakedDFA, nakedST);
                    var nextToken;
                    var tokenText;
                    nextToken = nakedLex.getNextToken();
                    tokenText = nextToken.lexeme;
                    expect(tokenText).toEqual(testLexeme);
                    var tokenKind = nextToken.kind;
                    expect(tokenKind).toEqual(termKind[testLexeme]);
                    expect(nextToken.row).toEqual(1);
                    expect(nextToken.col).toEqual(1);
                });
                it("(1.1.5) should recognize true and kind", function () {
                    var testLexeme = "true";
                    var nakedLex = new lex(testLexeme, nakedDFA, nakedST);
                    var nextToken;
                    var tokenText;
                    nextToken = nakedLex.getNextToken();
                    tokenText = nextToken.lexeme;
                    expect(tokenText).toEqual(testLexeme);
                    var tokenKind = nextToken.kind;
                    expect(tokenKind).toEqual(termKind[testLexeme]);
                    expect(nextToken.row).toEqual(1);
                    expect(nextToken.col).toEqual(1);
                });
                it("(1.1.6) should recognize int and kind", function () {
                    var testLexeme = "int";
                    var nakedLex = new lex(testLexeme, nakedDFA, nakedST);
                    var nextToken;
                    var tokenText;
                    nextToken = nakedLex.getNextToken();
                    tokenText = nextToken.lexeme;
                    expect(tokenText).toEqual(testLexeme);
                    var tokenKind = nextToken.kind;
                    expect(tokenKind).toEqual(termKind[testLexeme]);
                    expect(nextToken.row).toEqual(1);
                    expect(nextToken.col).toEqual(1);
                });
                it("(1.1.7) should recognize string and kind", function () {
                    var testLexeme = "string";
                    var nakedLex = new lex(testLexeme, nakedDFA, nakedST);
                    var nextToken;
                    var tokenText;
                    nextToken = nakedLex.getNextToken();
                    tokenText = nextToken.lexeme;
                    expect(tokenText).toEqual(testLexeme);
                    var tokenKind = nextToken.kind;
                    expect(tokenKind).toEqual(termKind[testLexeme]);
                    expect(nextToken.row).toEqual(1);
                    expect(nextToken.col).toEqual(1);
                });
                it("(1.1.8) should recognize boolean and kind", function () {
                    var testLexeme = "boolean";
                    var nakedLex = new lex(testLexeme, nakedDFA, nakedST);
                    var nextToken;
                    var tokenText;
                    nextToken = nakedLex.getNextToken();
                    tokenText = nextToken.lexeme;
                    expect(tokenText).toEqual(testLexeme);
                    var tokenKind = nextToken.kind;
                    expect(tokenKind).toEqual(termKind[testLexeme]);
                    expect(nextToken.row).toEqual(1);
                    expect(nextToken.col).toEqual(1);
                });
            }); /* end (1.1) test suite subset */

            describe("(1.2) and when they are have leading and trailing spaces", function () {
                it("(1.2.1) should recognize print and kind", function () {
                    var testSource = " \n  print  ";
                    var testLexeme = testSource.trim();
                    var nakedLex = new lex(testSource, nakedDFA, nakedST);
                    var nextToken;
                    var tokenText;
                    nextToken = nakedLex.getNextToken();
                    tokenText = nextToken.lexeme;
                    expect(tokenText).toEqual(testLexeme);
                    var tokenKind = nextToken.kind;
                    expect(tokenKind).toEqual(termKind[testLexeme]);
                    expect(nextToken.row).toEqual(2);
                    expect(nextToken.col).toEqual(3);
                });
                it("(1.2.2) should recognize if and kind", function () {
                    var testSource = " \n  if  ";
                    var testLexeme = testSource.trim();
                    var nakedLex = new lex(testSource, nakedDFA, nakedST);
                    var nextToken;
                    var tokenText;
                    nextToken = nakedLex.getNextToken();
                    tokenText = nextToken.lexeme;
                    expect(tokenText).toEqual(testLexeme);
                    var tokenKind = nextToken.kind;
                    expect(tokenKind).toEqual(termKind[testLexeme]);
                    expect(nextToken.row).toEqual(2);
                    expect(nextToken.col).toEqual(3);
                });
                it("(1.2.3) should recognize while and kind", function () {
                    var testSource = " \n  while  ";
                    var testLexeme = testSource.trim();
                    var nakedLex = new lex(testSource, nakedDFA, nakedST);
                    var nextToken;
                    var tokenText;
                    nextToken = nakedLex.getNextToken();
                    tokenText = nextToken.lexeme;
                    expect(tokenText).toEqual(testLexeme);
                    var tokenKind = nextToken.kind;
                    expect(tokenKind).toEqual(termKind[testLexeme]);
                    expect(nextToken.row).toEqual(2);
                    expect(nextToken.col).toEqual(3);
                });
                it("(1.2.4) should recognize false and kind", function () {
                    var testSource = " \n  false  ";
                    var testLexeme = testSource.trim();
                    var nakedLex = new lex(testSource, nakedDFA, nakedST);
                    var nextToken;
                    var tokenText;
                    nextToken = nakedLex.getNextToken();
                    tokenText = nextToken.lexeme;
                    expect(tokenText).toEqual(testLexeme);
                    var tokenKind = nextToken.kind;
                    expect(tokenKind).toEqual(termKind[testLexeme]);
                    expect(nextToken.row).toEqual(2);
                    expect(nextToken.col).toEqual(3);
                });
                it("(1.2.5) should recognize true and kind", function () {
                    var testSource = " \n  true  ";
                    var testLexeme = testSource.trim();
                    var nakedLex = new lex(testSource, nakedDFA, nakedST);
                    var nextToken;
                    var tokenText;
                    nextToken = nakedLex.getNextToken();
                    tokenText = nextToken.lexeme;
                    expect(tokenText).toEqual(testLexeme);
                    var tokenKind = nextToken.kind;
                    expect(tokenKind).toEqual(termKind[testLexeme]);
                    expect(nextToken.row).toEqual(2);
                    expect(nextToken.col).toEqual(3);
                });
                it("(1.2.6) should recognize int and kind", function () {
                    var testSource = " \n  int  ";
                    var testLexeme = testSource.trim();
                    var nakedLex = new lex(testSource, nakedDFA, nakedST);
                    var nextToken;
                    var tokenText;
                    nextToken = nakedLex.getNextToken();
                    tokenText = nextToken.lexeme;
                    expect(tokenText).toEqual(testLexeme);
                    var tokenKind = nextToken.kind;
                    expect(tokenKind).toEqual(termKind[testLexeme]);
                    expect(nextToken.row).toEqual(2);
                    expect(nextToken.col).toEqual(3);
                });
                it("(1.2.7) should recognize string and kind", function () {
                    var testSource = " \n  string  ";
                    var testLexeme = testSource.trim();
                    var nakedLex = new lex(testSource, nakedDFA, nakedST);
                    var nextToken;
                    var tokenText;
                    nextToken = nakedLex.getNextToken();
                    tokenText = nextToken.lexeme;
                    expect(tokenText).toEqual(testLexeme);
                    var tokenKind = nextToken.kind;
                    expect(tokenKind).toEqual(termKind[testLexeme]);
                    expect(nextToken.row).toEqual(2);
                    expect(nextToken.col).toEqual(3);
                });
                it("(1.2.8) should recognize boolean and kind", function () {
                    var testSource = " \n  boolean  ";
                    var testLexeme = testSource.trim();
                    var nakedLex = new lex(testSource, nakedDFA, nakedST);
                    var nextToken;
                    var tokenText;
                    nextToken = nakedLex.getNextToken();
                    tokenText = nextToken.lexeme;
                    expect(tokenText).toEqual(testLexeme);
                    var tokenKind = nextToken.kind;
                    expect(tokenKind).toEqual(termKind[testLexeme]);
                    expect(nextToken.row).toEqual(2);
                    expect(nextToken.col).toEqual(3);
                });
            }); /* end (1.1) test suite subset */
        }); /* end (1) test suite subset */

		it("(2) should recognize short sequence of lexemes", function () {
            this.myLex = new lex(" { a l print } $ ", commonDFA, commonST);
            var expectedTokenText1 = '{';
            var expectedTokenText2 = 'a';
            var expectedTokenText3 = 'l';
            // var expectedTokenText3 = 'longid';
            var expectedTokenText4 = 'print';
            var expectedTokenText5 = '}';
            var expectedTokenText6 = '$';
            var nextToken;
            var tokenText;
            nextToken = this.myLex.getNextToken();
            tokenText = nextToken.lexeme;
            expect(tokenText).toEqual(expectedTokenText1);

            nextToken = this.myLex.getNextToken();
            tokenText = nextToken.lexeme;
            expect(tokenText).toEqual(expectedTokenText2);
            nextToken = this.myLex.getNextToken();
            tokenText = nextToken.lexeme;
            expect(tokenText).toEqual(expectedTokenText3);
            var tokenKind = nextToken.kind;
            expect(tokenKind).toEqual('Id');
            // expect(tokenKind).toEqual('NONE');
            nextToken = this.myLex.getNextToken();
            tokenText = nextToken.lexeme;
            expect(tokenText).toEqual(expectedTokenText4);
            nextToken = this.myLex.getNextToken();
            tokenText = nextToken.lexeme;
            expect(tokenText).toEqual(expectedTokenText5);
            nextToken = this.myLex.getNextToken();
            tokenText = nextToken.lexeme;
            expect(tokenText).toEqual(expectedTokenText6);


			// logD("(2) Top Level ");
		});
		
    }); /* end outermost test suite */

    // logD("leave lex_Spec.js define()");
});  /* closure for requireJS define() */