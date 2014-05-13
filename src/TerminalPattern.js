/**
 * @FILE TerminalPattern
 * Created by
 * @AUTHOR David McDonald
 */

define(['NonTerminal'], function (NonTerminal) {
    "use strict";
    var modGlobal = {};     // global for this module, hidden from outside enclosure

    /**
     *  Creates a new TerminalPattern
     *  @constructor
     *  @param {String} newName name of GrammarSymbol (Block, Expr, braceL, braceR, etc)
     *  @param {String} [newText] text of GrammarSymbol (Block, Expr, {     , }, etc)
     */
    function TerminalPattern(/** @String*/ newName, /** @String= */ newText) { // constructor
        // TODO: Consider whether TerminalPatterns always have same name and text.  If so, eliminate newText param
        // TODO: update jsdoc param descriptions with TerminalPattern in mind vs GrammarSymbol
        if (!(this instanceof TerminalPattern)) {
            alert("Warning 60: TerminalPattern constructor says: Please do not forget the 'new' when you call me.");
            return new TerminalPattern(newName, newText);
        }
        // var that = this;        // "that" is used to make the object available to the private methods.

        // Call the super constructor
        NonTerminal.call( this, newName, newText );

        return( this );
    } // end constructor

    // TerminalPattern inherits from NonTerminal
    TerminalPattern.prototype = Object.create( NonTerminal.prototype );


    /**
     * @description  a prototype function (one copy per class, not per object)
     * @returns      {boolean} True if parse was successful
     */
    TerminalPattern.prototype.parseIt = function(tokenStream, concreteTree) {
        // TODO: implement parseIT, add jsdoc for params
        //  alert("TerminalPattern.parseIt says I got tokenStream" + tokenStream + "cT" + concreteTree);
        return true;
    };


    /**
     * @description  function returning decorated string for printing this TerminalPattern
     * @returns      {String} (Decorated) text string representing this TerminalPattern
     */
    TerminalPattern.prototype.prettyString = function() {
        // TODO: determine whether we should return name, text or both. add jsdoc for params
        // TODO: determine if this method should be called prettyString or prettyObjectString
        return "" + this.name + ".TP";
    };


    return TerminalPattern;     // return TerminalPattern constructor to RequireJS

}); // closure for RequireJS define()
