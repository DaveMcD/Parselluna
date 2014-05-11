/**
 * @FILE PullParser
 * Created by
 * @AUTHOR David McDonald
 */

define(['Grammar', 'lex'], function (Grammar, lex) {
    "use strict";
    // var modGlobal = {};     // global for this module, hidden from outside enclosure

    /**
     *  Creates a new PullParser
     *  @constructor
     *  @param {Grammar} grammarToUse pre-processed grammar to use for parsing
     */
    function PullParser(/** @Grammar*/ grammarToUse /** @String  arg2 */) { // constructor
        if (!(this instanceof PullParser)) {
            alert("Warning 60: PullParser constructor says: Please do not forget the 'new' when you call me.");
            return new PullParser(grammarToUse);
        }
      //  var that = this;        // "that" is used to make the object available to the private methods.
        this.gram = grammarToUse;
    //    var privateValue1 = arg1 || "default1";
    //    this.publicValue2 = arg2 || "default2";

//        /**
//         * @description  get some privateValue
//         * @returns      {String} containing privateValue1
//         */
//        this.getPrivateValue1 = function () {
//            return privateValue1;
//        };
//
//        /**
//         * @description  set some privateValue
//         * @param {String} newArg1 description of param1
//         */
//        this.setPrivateValue1 = function (newArg1) {
//            if ('undefined' !== typeof newArg1) {
//                privateValue1 = newArg1;
//            }
//        };

//        /**
//         * @description  set some privateValue (via prototype function)
//         * @returns      {String} containing publicValue2
//         */
//        this.getThatPublicValue2 = /* const */ function () {
//            return that.getPublicValue2();
//        };

    } // end constructor

//    /**
//     * @description  a prototype function (one copy per class, not per object)
//     * @returns      {boolean} True if something
//     */
//    PullParser.prototype.isSomething = /* const */ function () {
//        return (true);   // return true if ...
//    };
//
//
//    /**
//     * @description  get publicValue2
//     * @returns      {String} containing publicValue2
//     */
//    PullParser.prototype.getPublicValue2 = /* const */ function () {
//        return this.publicValue2;
//    };


    /**
     * @description  starts lex with sourceCode, parses resulting TokenStream using
     *               the grammar specified to our constructor
     * @param {String} sourceCode text to be parsed (and later compiled)
     * @param {Object} parseMessages used to pass back any messages from parsing
     * @throws       Error if called with invalid argument
     * @example
     * WARNING: throwme in throws me out.
     */
    PullParser.prototype.parseSource = function (/** @String */ sourceCode, /** @Object */ parseMessages) {
        // parse
        var tokenProvider = new lex(sourceCode, this.gram.getLexerDFA(), this.gram.getSymbolTable());
        var tokenListString = '';
        var token;
        while (tokenProvider.hasToken()) {
            token = tokenProvider.getNextToken();
            tokenListString += token.toString() + '\n';
        }

        if ('undefined' !== typeof parseMessages) { parseMessages['text'] += tokenListString; }
        return tokenListString;
    };

    return PullParser;     // return PullParser constructor to RequireJS

}); // closure for RequireJS define()
