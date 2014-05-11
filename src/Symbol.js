/**
 * @FILE Symbol.js
 * Created by
 * @AUTHOR David McDonald
 */

define([], function () {
    "use strict";
  //  var modGlobal = {}; // is it really a global for this module, and hidden from world?

    /**
     *  Creates a new Symbol
     *  @constructor
     *  @param {String} name keywordText | idText | numText | typeText??? | tempLabel | opText??? | boolText
     *  @param {String} kind Keyword | Id | digit | StringExpr | type (VarDec ???) | tempNum | tempStr | boolval
     *  @param {Number} [scopeId] scope within which this symbol is valid
     */
    function Symbol(/** @String*/ name, /** @String */ kind, /** Number= */ scopeId) { // constructor
        // TODO: remove scopeID from all alerts, and either use it or remove from parameter list
        if (!(this instanceof Symbol)) {
            alert("Symbol constructor says: Please do not forget the 'new' when you call me." + scopeId);
            return new Symbol(name, kind, scopeId);
        }

        var that = this;        // "that" is used to make the object available to the private methods.
        this.name = name;
        this.kind = kind;
      // comment for now...
      //  this.scopeId = scopeId;

        /**
         * @description  get symbol name
         * @returns      {String} containing symbol name
         */
        this.getName = function () {
            return that.name;
        };

        /**
         * @description  get printable symbol
         * @returns      {String} containing representation of symbol table entry
         */
        this.prettyString = function () {
            return "{n:" + that.name + ", k:" + that.kind + "}" ;
        };

    } // end Symbol constructor


    /**
     * @description  gets symbol kind (Id, digit, keyword, etc)
     * @returns      {String} containing symbol kind
     */
    Symbol.prototype.getKind = /* const */ function () {
        return this.kind;
    };


    /* Symbol would have been in Global Namespace, but we wrapped in a module/define. */
    /* The stuff we return is our public interface */
    return Symbol;

}); // closure for RequireJS
