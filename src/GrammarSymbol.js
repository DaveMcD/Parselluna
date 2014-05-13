/**
 * @FILE GrammarSymbol
 * Created by
 * @AUTHOR David McDonald
 */

define([], function () {
    "use strict";
//    var modGlobal = {};     // global for this module, hidden from outside enclosure

    /**
     *  Creates a new GrammarSymbol
     *  @constructor
     *  @param {String} newName name of GrammarSymbol (Block, Expr, braceL, braceR, etc)
     *  @param {String} [newText] text of GrammarSymbol (Block, Expr, {     , }, etc)
     */
    function GrammarSymbol(/** @String*/ newName, /** @String= */ newText) { // constructor
        if (!(this instanceof GrammarSymbol)) {
            alert("Warning 60: GrammarSymbol constructor says: Please do not forget the 'new' when you call me.");
            return new GrammarSymbol(newName, newText);
        }
    //    var that = this;        // "that" is used to make the object available to the private methods.
        if ('undefined' === typeof newName) { throw(new TypeError("GrammarSymbol requires newName")); }
        this.name = newName;
        this.text = newText || this.name;

    } // end constructor

    /**
     * @description  function returning decorated string for printing this NonTerminal
     * @returns      {String} (Decorated) text string representing this NonTerminal
     */
    GrammarSymbol.prototype.prettyString = function() {
        // TODO: determine whether we should return name, text or both. add jsdoc for params
        // TODO: determine if this method should be called prettyString or prettyObjectString

        return "" + this.name + ".GS";
    };

//    GrammarSymbol.prototype = {
//        /**
//         * @description  a prototype function (one copy per class, not per object)
//         * @returns      {boolean} True if something
//         */
//        isSomething: /* const */ function () {return (true);   },
//        sayHello:    /* const */ function () { alert("Howdy from Grammar.sayHello()"); }
//    };

    return GrammarSymbol;     // return GrammarSymbol constructor to RequireJS

}); // closure for RequireJS define()
