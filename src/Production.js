/**
 * @FILE Production
 *      Generally, a Production _IS_ a GrammarSequence (array of GrammarSymbols)
 *      The GrammarSymbols should not be generic GrammarSymbols, but rather specific types of GrammarSymbols,
 *      such as NonTerminals, TerminalPatterns (a kind of NonTerminal that has only Terminals on RHS),
 *      Keywords or Terminals.  A Production may contain an empty array, which represents epsilon (nullable)
 *      The textual equivalent of Production is a rule.  In current design, a ProductionSet contains both
 *      an array of rules and an array of Productions.
 * Created by
 * @AUTHOR David McDonald
 */

define([     'GrammarSymbol', 'NonTerminal', 'TerminalPattern', 'Terminal'],
    function (GrammarSymbol,   NonTerminal,   TerminalPattern,   Terminal) {
    "use strict";
    var modGlobal = {};     // global for this module, hidden from outside enclosure

    /**
     *  Creates a new Production (A sequence of GrammarSymbols and member of a ProductionSet)
     *  @constructor
     *  @param {Array} [grammarSequence] optional array of GrammarSymbols
     */
    function Production(/** @Array=*/ grammarSequence) { // constructor
        if (!(this instanceof Production)) {
            alert("Warning 60: Production constructor says: Please do not forget the 'new' when you call me.");
            return new Production(grammarSequence);
        }
        var that = this;        // "that" is used to make the object available to the private methods.
        this.gramSeq = [];
        var newSeqLen;
        var ii;
        if ( ! ('undefined' === typeof grammarSequence) ) {
            if (Array.isArray(grammarSequence)) {
                newSeqLen =  grammarSequence.length;
                if ( newSeqLen === 0 ) {
                    // we are all set - already have an empty this.gramSeq that represents epsilon
                } else {
                    for (ii = 0; ii < newSeqLen; ++ii) {
                        if ( ! (grammarSequence[ii] instanceof GrammarSymbol) ) {
                            throw new TypeError("Error 45: Production constructor says: All members of grammarSequence must be GrammarSymbols");
                            // return new TerminalPattern(newName, newText);
                        }
                        // TODO: consider verifying we have a subtype of GrammarSymbol, not an actual GrammarSymbol
                        this.gramSeq[ii] = grammarSequence[ii];
                    }
                }
            } else {
                throw new TypeError("Error 43: Production constructor says: grammarSequence is not an array");
            }
        }

        this.publicValue2 = 1;      // TODO: cleanup by deleting this and dependencies
    } // end constructor

    /**
     * @description  a prototype function (one copy per class, not per object)
     * @returns      {boolean} True if something
     */
    Production.prototype.isSomething = /* const */ function () {
        return (true);   // return true if ...
    };


//    /**
//     * @description  get publicValue2
//     * @returns      {String} containing publicValue2
//     */
//    Production.prototype.getPublicValue2 = /* const */ function () {
//        return this.publicValue2;
//    };


    /**
     * @description  sets publicValue2
     * @param {String} newArg2 description of param
     * @throws       Error if called with invalid argument
     * @example
     * WARNING: throwme in throws me out.
     */
    Production.prototype.setPublicValue2 = function (/** @String */ newArg2) {
        if (newArg2 === 'throwme') throw new Error("Bad newArg2 [" + newArg2 + "]");
        this.publicValue2 = newArg2;
    };

    /** adds GrammarSymbol to end of current production
     * Typically would be used when building the Production incrementally by scanning through the
     * corresponding textual member of rules[] array.
     * @param {GrammarSymbol} newGramSym
     */
   Production.prototype.addGrammarSymbol = function (/** GrammarSymbol */ newGramSym) {
       if ( ! (newGramSym instanceof GrammarSymbol) ) {
           throw new TypeError("Error 46: Production.addGrammarSymbol says: newGramSym must be a (kind of) GrammarSymbol");
           // return new TerminalPattern(newName, newText);
       }
       this.gramSeq.push(newGramSym);
   };

    /** adds Array of GrammarSymbols to end of current production
     * There is little reason for using this function, since if caller has an array of GrammarSymbols,
     * it would probably have been better to just provide that array to the Production constructor function.
     * @param {Array} newGrammarSequence
     */
// Production.prototype.addGrammarSequence = function (/** Array */ newGramSeq) {};

    /** adds Parses tokenStreamSource according to specific type/class of each item in the Production (gramSeq)
     * Terminals, Keywords and TerminalPatterns are simply matched, NonTerminals are parsed (recursively)
     * It is generally assumed that caller has peeked to confirm that THIS is the correct Production to expand,
     * but if they didn't we will inform them of their error by returning false result.
     * @param {lex} tokenStreamSource
     * @param {String} [parseMsg] - a text report of parse status, expectations, findings and errors
     * @returns {boolean} true if Production (and all resulting recursions) completed without errors
     */
    Production.prototype.parse = function (/** lex */ tokenStreamSource, /** String= */ parseMsg) {};

    Production.prototype.prettyStringOfObjects = function () {
        var prodStr = "";
        var grammarSymbolCount;
        var kk;
        var curProd = this;

        // 	  The hash (#) is not in our vocabulary, and disambiguates our list vs. native array.toString
        var grammarSymbolSeparator = "#";
        // ε	&epsilon;	&#949;	&#x3B5;	Lowercase Epsilon  Unicode U+03BF
        var EPSILON_CODE = 949;
        var EPSILON_CHAR = String.fromCharCode(EPSILON_CODE);
        // var EPSILON_HTML = '&epsilon;';


        prodStr += "    [";                     // Only Firefox honors space indentation in text area consider .. or --
        grammarSymbolCount = curProd.gramSeq.length;
        if ( 0 === grammarSymbolCount ) {
            prodStr += EPSILON_CHAR;            // Works for text areas.  for HTML, might need &epsilon;
        }
        // console.log("grammarSymbolCount=" + grammarSymbolCount);
        for (kk = 0; kk < grammarSymbolCount; ++kk) {
            if ( 0 < kk ) {
                prodStr += grammarSymbolSeparator;
            }
            prodStr += curProd.gramSeq[kk].prettyString();  // TODO: decide if we rename to prettyStringOfObjects()
        }
        prodStr += "]\n";
        return prodStr;
    };

    return Production;     // return Production constructor to RequireJS

}); // closure for RequireJS define()
