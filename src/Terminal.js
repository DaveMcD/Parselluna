/**
 * @FILE Terminal
 * Created by
 * @AUTHOR David McDonald
 */

define(['GrammarSymbol'], function (GrammarSymbol) {
    "use strict";
    var modGlobal = {};     // global for this module, hidden from outside enclosure

    /**
     *  Creates a new Terminal
     *  @constructor
     *  @param {String} newName name of GrammarSymbol (Block, Expr, braceL, braceR, etc)
     *  @param {String} [newText] text of GrammarSymbol (Block, Expr, {     , }, etc)
     */
    function Terminal(/** @String*/ newName, /** @String= */ newText) { // constructor
        // TODO: Consider whether Terminals always have same name and text.  If so, eliminate newText param
        // TODO: update jsdoc param descriptions with Terminal in mind vs GrammarSymbol
        if (!(this instanceof Terminal)) {
            alert("Warning 60: Terminal constructor says: Please do not forget the 'new' when you call me.");
            return new Terminal(newName, newText);
        }
        // var that = this;        // "that" is used to make the object available to the private methods.

        // Call the super constructor
        GrammarSymbol.call( this, newName, newText );

        return( this );
    } // end constructor

    // Terminal inherits from GrammarSymbol
    Terminal.prototype = Object.create( GrammarSymbol.prototype );

    /**
     * @description  a prototype function (one copy per class, not per object)
     * @returns      {boolean} True if parse was successful
     */
    Terminal.prototype.parseIt = function(tokenStream, concreteTree) {
        // TODO: implement parseIT, add jsdoc for params
        //  alert("Terminal.parseIt says I got tokenStream" + tokenStream + "cT" + concreteTree);
        return true;
    };

    /**
     * @description  function returning decorated string for printing this Terminal
     * @returns      {String} (Decorated) text string representing this Terminal
     */
    Terminal.prototype.prettyString = function() {
        // TODO: determine whether we should return name, text or both. add jsdoc for params
        // TODO: determine if this method should be called prettyString or prettyObjectString
        return "" + this.name + ".T";
    };


    return Terminal;     // return Terminal constructor to RequireJS

}); // closure for RequireJS define()
