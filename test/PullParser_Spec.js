/**
 * @FILE PullParser_Spec
 *   NOTE: with standard configuration, all files in test directory matching *Spec.js will be run by karma
 * Created by
 *   @AUTHOR David McDonald
 */

/* inform jshint not to warn that these jasmine functions are not defined */
/*global describe, it, xdescribe, xit, before, beforeEach, after, afterEach, expect, */
/* inform jshint not to warn that my logging shortcut functions are not defined */
/*global logC, logD */
define(['PullParser', 'webPageTestInputs', 'Grammar', 'util'],
    function (PullParser, webPageTestInputs, Grammar, util) {
    "use strict";
    // logD("enter PullParser_Spec.js define()");
    var webTests = new webPageTestInputs();     // only need one copy of this static data

    describe("PullParser", function () {   // outermost test suite
        beforeEach(function () {
            this.newForEachCalculated = 'top_level';
        });

        describe("(1) The incrementally more complete grammar", function () {
            // get grammar from webPageTestInputs.js
            var grammarSource_Print1 = webTests.getGrammarTestCase('Print 1 or 2');
            var print1_Grammar = new Grammar(grammarSource_Print1);
            var parser = new PullParser(print1_Grammar);

            beforeEach(function () {
              //  this.freshNestedAnswer = 'nested_answer';
            });

            it("(1.1) Can parse the only two allowed programs", function () {
                // verify starting condition
                expect(grammarSource_Print1).toMatch("Program ::== Block ");
                expect(Object.keys( print1_Grammar.getKeywords()            ) ).toEqual(['print']);
                expect(Object.keys( print1_Grammar.getNonTerminalList()     ) ).toEqual(['Block', 'Expr', 'PrintStatement', 'Program', 'Statement' ]);
                expect(Object.keys( print1_Grammar.getTerminals()           ) ).toEqual(['1', '2', '{', '}', 'print', '(', ')', '$' ]);
                expect(Object.keys( print1_Grammar.getTerminalPatternList() ) ).toEqual(['digit' ]);

                var programSource_Print1 = webTests.getCompileTestCase('Print 1');
                expect(programSource_Print1).toMatch(/\{ print\( 1 \) } \$\n/);

                var parseMsg = { 'text': ''};   // passing a string did not allow param to be used for output.
                var parseOutString = parser.parseSource(programSource_Print1, parseMsg);
                util.logD("parserSource output: \n" + parseOutString);
                util.logD("parserMsg output: \n" + parseMsg['text']);
                expect(parseMsg['text']).toEqual(
                    "{ k:{, v:{, r:1, c:1, i:-1 }\n" +
                    "{ k:print, v:print, r:1, c:3, i:-1 }\n" +
                    "{ k:(, v:(, r:1, c:8, i:-1 }\n" +
                    "{ k:digit, v:1, r:1, c:10, i:1 }\n" +
                    "{ k:), v:), r:1, c:12, i:-1 }\n" +
                    "{ k:}, v:}, r:1, c:14, i:-1 }\n" +
                    "{ k:$, v:$, r:1, c:16, i:-1 }\n"    );

//                var expectedPrettyCST = "left arm";
//                var expectedParseResult = "Success!!";
//                expect(parser.getCST.prettyString()).toEqual(expectedPrettyCST);
//                expect(parser.getParseResult()).toEqual(expectedParseResult);
//                // logD("(1.1)Testing nested_answer");
//                expect(this.freshNestedAnswer).toEqual(expected_result);
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

    // logD("leave PullParser_Spec.js define()");
});
/* closure for RequireJS define() */