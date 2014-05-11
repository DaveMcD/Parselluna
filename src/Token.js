/**
 * @FILE Token.js
 * Created by
 * @AUTHOR David McDonald
 */

define([], function() {
    "use strict";
    var modTokenGlobal = {instanceCount: 0};
    /**
     *  Creates a new Token
     *  @constructor
     *  @param {String} kind corresponding label from BNF
     *  @param {String} lexeme from source code
     *  @param {Number} [row] in source code
     *  @param {Number} [col] in source code
     *  @param {Number} [symbolIndex]
     */
    function Token(/** @String*/ kind, /** @String */ lexeme,
                   /** @Number=*/ row, /** @Number= */ col,
                    /** @Number= */ symbolIndex) { // constructor
        if (!(this instanceof Token)) {
            alert("Token constructor says: Please do not forget the 'new' when you call me.");
            return new Token(kind, lexeme, row, col, symbolIndex);
        }

        var that = this;        // "that" is used to make the object available to the private methods.
        modTokenGlobal.instanceCount += 1;
        this.kind = kind;
        this.lexeme = lexeme;
        this.row = row || 0;
        this.col = col || 0;
        this.symTabIndex = symbolIndex || -1;
        // TODO: consider whether we should keep reference to symbol table.

        /**
         * @description  get some privateValue
         * @returns      {String} containing privateValue1
         */
        this.getKind = function() {
            return that.kind;
        };

        this.toString = function() {
            var stringOut = '';
            stringOut += '{ k:' + that.kind;
            // v for value, vs l for lexeme, as l is hard to distinguish from number 1
            stringOut += ', v:' + that.lexeme;
            stringOut += ', r:' + that.row;
            stringOut += ', c:' + that.col;
            stringOut += ', i:' + that.symTabIndex;
            stringOut += ' }';
            return stringOut;
        };

    } // end constructor


    /**
     * @description  get text value from source code (lexeme) for this token
     * @returns      {String} containing publicValue2
     */
    Token.prototype.getLexeme = /* const */ function() {
        return this.lexeme;
    };


    /**
     * @description  sets public value
     * @param {String} newLexeme description of param
     * @throws       RangeError if peeking past end of input
     * @example
     * WARNING: throwme in throws me out.
     */
    Token.prototype.setLexeme      =  function(/** @String */ newLexeme) {
        this.lexeme = newLexeme;
    };


    /**
     * @description  get some semi-secret? value
     * @returns      whatever was stashed in modDFAGlobal
     */
    Token.prototype.getModGlobal = /* const */ function (tag) {
        return modTokenGlobal[tag];
    };

    // return { Token: Token };  // Failed to return an object from constructor ???
    return Token;

}); // closure for RequireJS
