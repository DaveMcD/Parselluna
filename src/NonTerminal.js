/**
 * @FILE NonTerminal
 * Created by
 * @AUTHOR David McDonald
 */

define(['GrammarSymbol'], function (GrammarSymbol) {
    "use strict";
    // var modGlobal = {};     // global for this module, hidden from outside enclosure

    /**
     *  Creates a new NonTerminal
     *  @constructor
     *  @param {String} newName name of GrammarSymbol (Block, Expr, braceL, braceR, etc)
     *  @param {String} [newText] text of GrammarSymbol (Block, Expr, {     , }, etc)
     */
    function NonTerminal(/** @String*/ newName, /** @String= */ newText) { // constructor
        // TODO: Consider whether NonTerminals always have same name and text.  If so, eliminate newText param
        // TODO: update jsdoc param descriptions with NonTerminal in mind vs GrammarSymbol
        if (!(this instanceof NonTerminal)) {
            alert("Warning 60: NonTerminal constructor says: Please do not forget the 'new' when you call me.");
            return new NonTerminal(newName, newText);
        }
        // var that = this;        // "that" is used to make the object available to the private methods.
        // this.derivesEmpty = false;  // not here - rather in production

        // Call the super constructor
        GrammarSymbol.call( this, newName, newText );

        return( this );
    } // end constructor

    // NonTerminal inherits from GrammarSymbol
    NonTerminal.prototype = Object.create( GrammarSymbol.prototype );

    /**
     * @description  a prototype function (one copy per class, not per object)
     * @returns      {boolean} True if parse was successful
     */
    NonTerminal.prototype.parseIt = function(tokenStream, concreteTree) {
        // TODO: implement parseIT, add jsdoc for params
      //  alert("NonTerminal.parseIt says I got tokenStream" + tokenStream + "cT" + concreteTree);
        return true;
    };

    /**
     * @description  function returning decorated string for printing this NonTerminal
     * @returns      {String} (Decorated) text string representing this NonTerminal
     */
    NonTerminal.prototype.prettyString = function() {
        // TODO: determine whether we should return name, text or both. add jsdoc for params
        // TODO: determine if this method should be called prettyString or prettyObjectString
      //  alert("NonTerminal.parseIt says I got tokenStream" + tokenStream + "cT" + concreteTree);

        return "" + this.name + ".NT";
    };

    return NonTerminal;     // return NonTerminal constructor to RequireJS
}); // closure for RequireJS define()
