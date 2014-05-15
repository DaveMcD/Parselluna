/**
 * @FILE GrammarSymbol
 * Created by
 * @AUTHOR David McDonald
 */

//define(['Production'], function (Production) {
define([], function () {
    // warning - this is a circular dependency.  Hopefully, RequireJS will handle it.
    "use strict";
    var modGlobal = {};     // global for this module, hidden from outside enclosure

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

    GrammarSymbol.prototype = {
        /**
         * @description  a prototype function (one copy per class, not per object)
         * @returns      {String} name for this GrammarSymbol
         */
        getName: /* const */ function () {return (this.name);   },

        /**
         * @description  a prototype function (one copy per class, not per object)
         * @returns      {Production} reference to the Production of which we are a member
         */
        getParentProduction: /* const */ function () {return (this.parentProduction);   },

        /**
         * @description  a prototype function (one copy per class, not per object)
         * @param        {Production} myParentProd reference to some Production (hopefully, the Production of which we are a member)
         * @returns      {void}
         */
        setParentProduction:  function (/**Production*/ myParentProd ) {
            // Have to trust caller to send the right type, or we create circular dependency
//            if ( ! (myParentProd instanceof Production) ) {
//                throw new TypeError("Error 46: GrammarSymbol.setParentProduction says: myParentProd must be a Production");
//                // return new TerminalPattern(newName, newText);
//            }

            this.parentProduction = myParentProd;
        },

        /**
         * @description  a prototype function (one copy per class, not per object)
         * @param        {ProductionSet} myParentProdSet reference to some ProductionSet (hopefully, the Production of which we are a member)
         * @returns      {void}
         */
        setParentProductionSet:  function (/**ProductionSet*/ myParentProdSet ) {
            // Have to trust caller to send the right type, or we create circular dependency
//            if ( ! (myParentProd instanceof ProductionSet) ) {
//                throw new TypeError("Error 46: GrammarSymbol.setParentProductionSet says: myParentProdSet must be a ProductionSet");
//                // return new TerminalPattern(newName, newText);
//            }

            this.parentProductionSet = myParentProdSet;
        },

//        /**
//         * @description  constructor for a GrammarSymbol.WorkList
//         * @returns      {Array} an empty WorkList
//         * NOTE: should NOT be associated with any particular GrammarSymbol
//         *       as implemented, we can only have one.  If more than one is needed, we can keep an array in modGlobal
//         */
//        WorkList:  function () {
//            modGlobal.workList = [];
//            return modGlobal.workList;
//        },
//
//        /**
//         * @description  adds the name of a GlobalSymbol to workList (if not already in workList)
//         * @returns      {void}
//         */
//        workList_push:  function (/**String*/ gsName) {
//            if (this.workList_getGsIndex(gsName) === -1) {
//                modGlobal.workList.push(gsName);
//            }
//        },
//
//        /**
//         * @description  returns (and removes) most recently added gsName from workList
//         * @returns      {String} most recently added gsName
//         */
//        workList_pop:  function () {
//            return modGlobal.workList.pop();
//        },
//
//        /**
//         * @description  returns index of a GlobalSymbol name from workList.  Used by delGsNamed()
//         * @returns      {Number} index (or -1 if not found)
//         */
//        workList_getGsIndex:  function (/**String*/ gsName) {
//            var ii;
//            for (ii = 0; ii < modGlobal.workList.length; ++ii) {
//                if (gsName === modGlobal.workList[ii]) {
//                    return ii;
//                }
//            }
//            return -1;
//        },
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
