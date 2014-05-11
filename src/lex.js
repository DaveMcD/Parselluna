/**
 * @FILE lex.js
 * Created by
 * @AUTHOR David McDonald
 */

define(['util', 'InBuffer', 'Token', 'Symbol'], function (util, InBuffer, Token, Symbol) {
    "use strict";
    // var modGlobal = {}; // is it really a global for this module, and hidden from world?

    /**
     *  Creates a new lex
     *  @constructor
     *  @param      {String} sourceText multi-line string with source code to be parsed
     *  @param      {DFA} dfa contains tables needed to lex input
     *  @param      {SymbolTable} symTable input (containing keywords) and output
     *  @returns    {Array} containing sequence of tokens
     */
    function lex(/** @String*/ /* const */ sourceText,
                 /** @DFA */   /* const */ dfa       ,
                 /** @SymbolTable */       symTable ) { // constructor
    //    var that = this;        // "that" is used to make the object available to the private methods.
        // surprisingly, we do not use this or that anywhere in lex.  I may have over accomplished the info hiding...
        var MAX_ID_LENGTH = 1;
        var inBuf = new InBuffer(sourceText);
        var dfat = dfa.dfat;
        var labels = dfa.labels;
        var symbols = symTable;
        var initialized = false;       // TODO: fix bad design pattern - this only lets us have ONE lex

        var tokens = [];                // TODO: this could be a TokenStream instead of array

        /**
         * @description  read one token from private variable inBuf;
         * @returns      {Token} containing next Token from inBuf
         * NOTE:  any leading white space should have been skipped before calling readOneToken()
         * NOTE:  AND there must still be some remaining input
         */
        function readOneToken() {
            var inChar;
            var consumedChar;
            var kind;
            var lexeme = '';
            var symbolIndex = -1;
            var START_STATE = 0;
            var ERROR_STATE = 1;
            var startPos;
            var curState;
            var nextState;

            function isAccepting() { return ('undefined' !== typeof labels[curState]) ;}

            startPos = inBuf.pos();
            curState = START_STATE;
            inChar = inBuf.peek();
            nextState = dfat[curState][inChar];
            while(nextState && nextState > ERROR_STATE  && inBuf.inputRemaining() /* && tokenIncomplete */ ) {
                curState = nextState;
                lexeme += inChar;
                consumedChar = inBuf.read();  // consume what we have matched so far.
                // if ( isAccepting() ) { /* TODO: save last good state */ }
                inChar = inBuf.peek();  // ??? or peek() ???
                nextState = dfat[curState][inChar];
            }

            if ( ! inBuf.inputRemaining() && nextState  && nextState > ERROR_STATE) {
                // we ran out of input, but nextState may be valid
                curState = nextState;
            }

            var someSymbol;
            if ( isAccepting() ) {
                kind = labels[curState];
                // confirm that lexeme length complies with secret rules.
                if (kind === 'Id') {
                    // check to see if it is actually a keyword
                    if (symbols.isKeyword(lexeme)) {
                        someSymbol = symbols.getSymbolNamed(lexeme);
                        kind = someSymbol.kind;
                    } else {
                        if (lexeme.length > MAX_ID_LENGTH) {
                            kind = 'NONE';
                            alert("Error 101: Invalid identifier " + lexeme + " at " + startPos.toString());
                        } else {
                            /* it is a valid identifier, just add to token below */
                            //
                        }
                    }
                }
                // store lexeme in symbol table IFF Id or Num or Str or ???
                var SYMBOLS = ['Id', 'StringExpr', 'digit'];
                SYMBOLS.forEach( function storeSymbols(symbolKind) {
                    if (kind === symbolKind) {
                        symbolIndex = symbols.addIfAbsent(new Symbol(lexeme, kind));
                    }
                });

            } else {
                // if saved last good state and have one, go back there
                // else
                kind = 'NONE';
                // TODO: convert from alert to lex message
                alert("Error 102: Invalid token [" + inChar + "] at " + startPos.toString());
                // fixed infinite loop when we get this error by adding inBuf.read()
                lexeme += inBuf.read();  // consume the problem character, add to lexeme so we can see what caused the error
            }

            // check for inputRemaining vs tokenCompletion

            // build token for return
            return new Token(kind, lexeme, startPos[0], startPos[1], symbolIndex);
        }

        function init() {
            var inToken;
            inBuf.skipWhiteSpace();
            while (inBuf.inputRemaining()) {
                // just started, or finished prior token
                inToken = readOneToken();
                // add inToken to sequence
                // TODO: call a TokenStream push function instead (after making TokenStream object)
                tokens.push(inToken);
                inBuf.skipWhiteSpace();
            }
            initialized = true;
        }
 
        // TODO: debug code to be removed later (though we might want this function in a toString method)
//        if (false) {
//            var tokenString = "tokenArray is: [\n" + tokens + ']';
//            tokenString = tokenString.replace(/\}\,\{/g, "\}\,\n\{");
//            util.logD(tokenString);
//        }


        /**
         * @description  get next token from sequence
         * @returns      {Token} containing privateValue1
         */     // TODO: move to TokenStream
        var currentTokenIndex = 0;
        this.getNextToken = function () {
            if (! initialized) { init(); }
            if (currentTokenIndex < tokens.length) {
                return tokens[currentTokenIndex++];
            }
        };

        /**
         * @description  get next token from sequence
         * @returns      {Boolean} containing privateValue1
         */     // TODO: move to TokenStream
        this.hasToken = function () {
            if (! initialized) { init(); }
            return (currentTokenIndex < tokens.length);
        };

        init();         // TODO: confirm if this works around the design problem of using modGlobal to track init
    } // end constructor


    /* lex would have been in Global Namespace, but we wrapped in a module/define. */
    /* The stuff we return is our public interface */
    return lex;

}); // closure for RequireJS
