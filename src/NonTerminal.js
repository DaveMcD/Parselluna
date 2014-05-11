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
     *  @param {String} newName description of param1
     *  @param {String} newText description of param1
     */
    function NonTerminal(/** @String*/ newName, /** @String */ newText) { // constructor
        if (!(this instanceof NonTerminal)) {
            alert("Warning 60: NonTerminal constructor says: Please do not forget the 'new' when you call me.");
            return new NonTerminal(newName, newText);
        }
        // var that = this;        // "that" is used to make the object available to the private methods.

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

    return NonTerminal;     // return NonTerminal constructor to RequireJS
}); // closure for RequireJS define()
