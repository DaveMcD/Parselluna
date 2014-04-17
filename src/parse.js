/**
 * @FILE parse.js
 */
// using define() because there is nothing here we want executed immediately when loaded
define(['util'], function(util) {
"use strict";
    util.logD("enter parse.js define(requiring util) THIRD");

    var EOF = "$";  // ??? temporary hack to resolve EOF
    var tokenIndex;
    var errorCount;
    var tokens;
    var currentToken;

// this code refactored out of fromHtml.js
    //noinspection UnnecessaryLocalVariableJS
    var parseFunc = function(tokenStream) {
        // re-join tokens, to avoid need to modify parseX() functions,
        // which were designed for string input, rather than an array
        // of 1 character strings. (if empty string not specified to join()
        // the tokens string will have commas separating the array members.)
        tokenIndex = 0;
        errorCount = 0;
        tokens = tokenStream.join("");

        util.putMessage("Parsing [" + tokens + "]");
        // Grab the next token.
        currentToken = getNextToken();
        // A valid parse derives the G(oal) production, so begin there.
        parseG();
        // Report the results.
        util.putMessage("Parsing found " + errorCount + " error(s).");
    };

    function parseG() {
        // A G(oal) production can only be an E(expression), so parse the E production.
        parseE();
    }

    function parseE() {
        var gotExpected;
        // All E productions begin with a digit, so make sure that we have one.
        // if we do not get digit, keep consuming tokens until we do.
        // Probably not the best general strategy, but for a language with just
        // 2 kinds of tokens, I expect that errors reported will be more meaningful
        // note: forget to check for EOF ==> might loop forever
        do {
            gotExpected = checkAndConsumeToken("digit");
        } while ((!gotExpected ) && (currentToken !== EOF));

        // Look ahead 1 char (which is now in currentToken because checkAndConsumeToken
        // consumes another one) and see which E production to follow.
        if (currentToken !== EOF) {
            // We're not done, we we expect to have an op.
            checkAndConsumeToken("op");
            parseE();
        }
        else {
            // There is nothing else in the token stream,
            // and that's cool since E --> digit is valid.
            util.putMessage("EOF reached");
        }
    }

    function checkAndConsumeToken(expectedKind) {
        var gotExpected = false;
        // Validate that we have the expected token kind and eat the next token.
        switch (expectedKind) {
            case "digit":
                util.putMessage("Expecting a digit");
                if (currentToken === "0" || currentToken === "1" || currentToken === "2" ||
                    currentToken === "3" || currentToken === "4" || currentToken === "5" ||
                    currentToken === "6" || currentToken === "7" || currentToken === "8" ||
                    currentToken === "9") {
                    gotExpected = true;
                    util.putMessage("Got a digit!");
                }
                else {
                    errorCount++;
                    util.putMessage("NOT a digit.  Error at position " + tokenIndex + ".");
                }
                break;
            case "op":
                util.putMessage("Expecting an operator");
                if (currentToken === "+" || currentToken === "-") {
                    gotExpected = true;
                    util.putMessage("Got an operator!");
                }
                else {
                    errorCount++;
                    util.putMessage("NOT an operator.  Error at position " + tokenIndex + ".");
                }
                break;
            default:
                util.putMessage("Parse Error: Invalid Token Type at position " + tokenIndex + ".");
                break;
        }
        // Consume another token, having just checked this one, because that
        // will allow the code to see what's coming next... a sort of "look-ahead".
        currentToken = getNextToken();
        return gotExpected;
    }

    function getNextToken() {
        var thisToken = EOF;    // Let's assume that we're at the EOF.
        if (tokenIndex < tokens.length) {
            // If we're not at EOF, then return the next token in the stream and advance the index.
            thisToken = tokens[tokenIndex];
            util.putMessage("Current token:" + thisToken);
            tokenIndex++;
        }
        return thisToken;
    }
    return parseFunc;
});