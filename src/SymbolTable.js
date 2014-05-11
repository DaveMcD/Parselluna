/**
 * @FILE SymbolTable.js
 * Created by
 * @AUTHOR David McDonald
 */

define(['Symbol'], function (Symbol) {
    "use strict";
  //  var modGlobal = {}; // is it really a global for this module, and hidden from world?

    /**
     *  Creates a new empty SymbolTable
     *  @constructor
     */
    function SymbolTable(/** @String*  arg1, ** @String * arg2 */) { // constructor
        if (!(this instanceof SymbolTable)) {
            alert("SymbolTable constructor says: Please do not forget the 'new' when you call me.");
            return new SymbolTable();
        }

        var that = this;        // "that" is used to make the object available to the private methods.
        this.symbols = [];
        this.lastKeywordIndex = 0;


        /**
         * @description  add Symbol object to table
         * @param {Symbol} newSymbol to be added to table
         * @param {Number} [scopeId] optional scope for search (which may become non-optional)
         * @returns      {Number} containing index of added Symbol
         */
        this.addSymbol = function (/** Symbol */ newSymbol, /** Number= */ scopeId) {
            // TODO: remove scopeID from all alerts, and either use it or remove from parameter list
            if (!(newSymbol instanceof Symbol)) {
                alert("SymbolTable.addSymbol() says: Please pass me a Symbol." + scopeId);
                return -1;
            }

            // TODO: check for existence first
            that.symbols.push(newSymbol);
            return that.getSymbolIndex(newSymbol.name);
        };

        /**
         * @description  add Symbol object to table (if it is not already present)
         * @param {Symbol} newSymbol to be added to table
         * @returns      {Number} containing index of added Symbol
         */
        this.addIfAbsent = function(/** Symbol */ newSymbol) {
            if (!(newSymbol instanceof Symbol)) {
                alert("SymbolTable.addOrReplace() says: Please pass me a Symbol.");
                return -1;
            }
            if ( ! that.hasSymbol(newSymbol.name)) {
                that.addSymbol(newSymbol);
            }
            return that.getSymbolIndex(newSymbol.name);
        };

        this.markLastKeyword = function () {
            that.lastKeywordIndex = that.symbols.length - 1;
        };

        /**
         *  Tests whether symbol table contains needle
         *  @param {String} needleName what to search for
         *  @param {Number} [scopeId] optional scope for search (which may become non-optional)
         *  @returns {Boolean} true if needleName is in symbol table
         */
        this.hasSymbol = function (/** String */ needleName, /** Number */ scopeId) {
            if ('string' !== typeof needleName) { throw new TypeError("SymbolTable.hasSymbol() needs a String "  + scopeId); }
            var foundSymbol = false;

            for (var ii = 0; ii < that.symbols.length; ++ii) {
                if (needleName === that.symbols[ii].name) {
                    foundSymbol = true;
                    break;
                }
            }
            return foundSymbol;
        };

        /**
         *  returns a printable representation of SymbolTable
         *  @returns {String} text representation of SymbolTable
         */
        this.prettyString = function () {
            var symTabString = "";
            var lastTag = " <<==== Last Keyword ====";
            var tag;

            for (var ii = 0; ii < that.symbols.length; ++ii) {
                if (ii == that.lastKeywordIndex) { tag = lastTag; } else { tag = ""; }
                symTabString += '['+ ii + '] ' + that.symbols[ii].prettyString() + tag + "\n";
            }
            return symTabString;
        };

        /**
         *  Tests whether needle has been predefined as keyword
         *  @param {String} needleName what to search for
         *  @returns {Boolean} true if needleName is a keyword
         */
        this.isKeyword = function (/** String */ needleName) {
            if ('string' !== typeof needleName) { throw new TypeError("SymbolTable.hasSymbol() needs a String"); }
            var needleIsKW = false;

            for (var ii = 0; ii <= that.lastKeywordIndex; ++ii) {
                if (needleName === that.symbols[ii].name) {
                    needleIsKW = true;
                    break;
                }
            }
            return needleIsKW;
        };

        /**
         *  get symbol table record for needle
         *  @param {String} needleName what to search for
         *  @param {Number} [scopeId] optional scope for search (which may become non-optional)
         *  @returns {Symbol} if needleName is in symbol table, else empty object (perhaps should return undefined)
         */
        this.getSymbolNamed = function (/** String */ needleName, /** Number */ scopeId) {
            if ('string' !== typeof needleName) { throw new TypeError("SymbolTable.getSymbolNamed() needs a String"  + scopeId); }
            var foundSymbol;
            for (var ii = 0; ii < that.symbols.length; ++ii) {
                if (needleName === that.symbols[ii].name) {
                    foundSymbol = that.symbols[ii];
                    break;
                }
            }
            return foundSymbol;
        };

        /**
         *  get symbol table index for needle
         *  @param {String} needleName what to search for
         *  @param {Number} [scopeId] optional scope for search (which may become non-optional)
         *  @returns {Number} Index if needleName is in symbol table, otherwise -1
         */
        this.getSymbolIndex = function (/** String */ needleName, /** Number */ scopeId) {
            var foundSymbol = -1;
            if ('string' !== typeof needleName) { throw new TypeError("SymbolTable.getSymbolIndex() needs a String"  + scopeId); }
            for (var ii = 0; ii < that.symbols.length; ++ii) {
                if (needleName === that.symbols[ii].name) {
                    foundSymbol = ii;
                    break;
                }
            }
            return foundSymbol;
        };
//
//        /**
//         * @description  get some privateValue
//         * @returns      {String} containing privateValue1
//         */
//        this.get1st = function () {
//            return privateValue1;
//        };
//
//        /**
//         * @description  set some privateValue
//         * @param {String} newArg1 description of param1
//         */
//        this.set1st = function (newArg1) {
//            if ('undefined' !== typeof newArg1) {
//                privateValue1 = newArg1;
//            }
//        };
//
//        /**
//         * @description  set some privateValue (via prototype function)
//         * @returns      {String} containing publicValue2
//         */
//        this.getThat2 = function () {
//            return that.get2nd();
//        };
    } // end constructor

//    /**
//     * @description  a prototype function (one per class, not per object)
//     * @author       David McDonald
//     * @returns      {boolean} True if something
//     */
//    SymbolTable.prototype.isSomething = /* const */ function () {
//        return (true);   // return true if ...
//    };
//
//
//    /**
//     * @description  get some publicValue
//     * @returns      {String} containing publicValue2
//     */
//    SymbolTable.prototype.get2nd = /* const */ function () {
//        return this.publicValue2;
//    };
//
//
//    /**
//     * @description  sets public value
//     * @param {String} newArg2 description of param
//     * @throws       RangeError if peeking past end of input
//     * @example
//     * WARNING: throwme in throws me out.
//     */
//    SymbolTable.prototype.set2nd = function (/** @String */ newArg2) {
//        if (newArg2 === 'throwme') throw new Error("Bad newArg2 [" + newArg2 + "]");
//        this.publicValue2 = newArg2;
//    };
//
//    /* SymbolTable would have been in Global Namespace, but we wrapped in a module/define. */
//    /* The stuff we return is our public interface */
    return SymbolTable;

}); // closure for RequireJS
