/**
 * @FILE BNF.js
 * Created by
 * @AUTHOR David McDonald
 */
define(['util', 'InBuffer', 'ProductionSet'], function(util, InBuffer, ProductionSet) {
"use strict";
// var modGlobal = { /* a global shared location for this module, (with no direct access from outside closure???) */ };

/**
 *  Creates a new text version of BNF grammar
 *  @constructor
 *  @param {String} bnfString Grammar definition in BNF format
 */
function BNF(bnfString) {
    if (!(this instanceof BNF)) {
        alert("Warning 60: BNF constructor says: Please do not forget the 'new' when you call me.");
        return new BNF(bnfString);
    }
    // var that = this;     // currently, that is unreferenced
    var privateBNF = [];    // array of ProductionSets
    //  this.goalIndex;       // currently, this lives only in modGlobal

    ////////////////////////////////////////////////////////////////////
    //        Constructor logic begins here         ////////////////////
    ////////////////////////////////////////////////////////////////////

    util.logD("Begin BNF constructor");
    if ( ('undefined' === typeof bnfString ) || 0 === bnfString.length ) {
        throw new TypeError("Error 30: BNF constructor says: non-empty bnfString is required");
    }

    // defer parsing BNF until init or one of our getters is called.
    // give prototype methods access to our private data
//    modGlobal.initialized = false;
    this.initialized = false;
//    modGlobal.textBnf = privateBNF;
    this.textBnf = privateBNF;
    // modGlobal.goalName = undefined;
    // this.goalName = '';      // TODO: determine if this is needed
//    modGlobal.bnfSource = new InBuffer(bnfString);
    this.bnfSource = new InBuffer(bnfString);

} /* end BNF constructor */
//////////////////////////////////////////////////////////////////////


    /**
     *  BNF has the basic grammar, in text form.  You WILL need getBNF_Goal_Index to know where to start
     *  @returns {Array} BNF as an array of ProductionsSets (a head and associated productions)
     */
    BNF.prototype.getBNF = function() {
        if (! this.initialized) { this.init(); }
        return this.textBnf;
    };

    /**
     *  goal Index tells us where top level of parse tree starts
     *  @returns {Number} goalIndex the index of original first NonTerminal in provided BNF
     */
    BNF.prototype.getBNF_Goal_Index = function () {
        if (! this.initialized) { this.init(); }
        return this.goalIndex;
    };

    /**
     *  goal Index tells us where top level of parse tree starts
     *  @returns {Number} goalIndex the index of original first NonTerminal in provided BNF
     */
    BNF.prototype.getBNF_GoalName = function () {
        if (! this.initialized) { this.init(); }
        return this.textBnf[this.goalIndex].headName;
    };

    /**
     *  get the index of ProductionSet corresponding to headName
     *  @returns {Number} index of matching ProductionSet (or -1 if headName not found)
     */
    BNF.prototype.indexOfProductionSetNamed = /* const */ function (/**String */ headNeedle) {
        if (! this.initialized) { this.init(); }

        // lookup headName in our sorted BNF, return reference
        var targetIndex = -1;
        var prodSets = this.textBnf;
    //    var prodSetCount = prodSets.length;

        // for stupid large grammar (2500 nonTerminals), first letter index
        // reduces Grammar constructor time from around 100 to around 50 ms
        // a real hash would likely give much better times. saving the sort
        // and scans of 50ish nonTerminals that start with same letter.
        var useIndex = true;
        var first, last;
        /////////////
        if ( useIndex ) {
            var firstChar = headNeedle.charAt(0);
            if (typeof this.headIndexFL[firstChar] !== 'undefined') {
                first = this.headIndexFL[firstChar][0];    // first index starting with same character
                last  = this.headIndexFL[firstChar][1];    // last  index starting with same character
            } else {
                return targetIndex;     // if we do not have in index, we will not find by scanning
            }
        } else {
            first = 0;
            last  = prodSets.length - 1;
        }

        /////////////
        var ii;
        // NOTE: prodSets is sorted and indexed via headIndex, so we could do binary search,
        //       or we could index it via util.indexFL()
        for (ii = first; ii <= last ; ++ii ) {
            if ( headNeedle === prodSets[ii].headName ) {
                targetIndex = ii;
                break;
            }
        }
        return targetIndex;
    };

    /**
     *  test for existence of ProductionSet corresponding to headName
     *  @returns {Boolean} true if headName found, otherwise false
     */
    BNF.prototype.hasProdSetNamed = /* const */ function (/**String */ headName) {
        return (this.indexOfProductionSetNamed(headName) != -1) ;
    };

    /**
     *  get the ProductionSet corresponding to headName
     *  @returns {ProductionSet} matching ProductionSet (or undefined if headName not found)
     */
    BNF.prototype.getProductionSetNamed = /* const */ function (/**String */ headName) {
        if (! this.initialized) { this.init(); }

        // lookup headName in our sorted BNF, return reference
        var headIndex = this.indexOfProductionSetNamed(headName);
        var targetProdSet;
        if (headIndex != -1) { targetProdSet = this.textBnf[headIndex]; }

        return targetProdSet;
    };

    /**
     *  Creates structured text version of BNF from Grammar in BNF format
     */
    BNF.prototype.init = function () {
        // prevent initialization more than one time.
        // TODO: can we seal the BNF object after initialization?
        if ( this.initialized ) {
            alert("Warning 61: BNF.init says: please only call me one time");
            return;
        }

        var prodSet;			//  reference to a ProductionSet (headName and corresponding GrammarSequences)
        var bnfSource = this.bnfSource;
        var localBNF = this.textBnf;
        var bnfLine;

//        var EPSILON_CODE = 949;     // as per: http://webdesign.about.com/od/localization/l/blhtmlcodes-gr.htm
//                                    // ε	&epsilon;	&#949;	&#x3B5;	Lowercase Epsilon  Unicode U+03BF
        var producedBy = '::==';	// RHS is productionFor LHS.  Also, LHS derives RHS.
        var headAndBody;            // [headName, body]
        var headName, body;
//        var rangeAdded;
        var errorLineNum;

        while ( bnfSource.inputRemaining() ) {
            bnfLine = bnfSource.readLine();
            // "head ::== body1 body2" ==>> ["head ", " body1 body2 "]
            headAndBody = bnfLine.split(producedBy);
            if (headAndBody.length !== 2) {
                // we did not get exactly a head and body, separated by ::==
                // if it is just a blank line, ignore and continue.  otherwise, throw error message
                if (bnfLine.trim().length > 0) {
                    errorLineNum = bnfSource.row() - 1;
                    throw new Error("Error 51: BNF.init says: Invalid Grammar syntax. [" + bnfLine + "] on line " + errorLineNum);
                }
            } else {    // all good so far
                // we do not want leading or trailing spaces on headName
                headName = headAndBody[0].trim();
                // if body untrimmed, split puts extra empty strings front and back when there are lead/trail spaces
                body = headAndBody[1].trim();

                if (headName.length <= 0) {
                    if (localBNF.length === 0) {
                        // no head AND no goal yet
                        throw new Error("Error 52: BNF.init says: " +
                            "First line of BNF Grammar must include a goal on Left Hand Side of " + producedBy);
                    } /* else... adding to existing prodSet */
                } else {
                    // We have a new head (or goal, if first head), not a continuation of productions for previous head
                    // Check to make sure it is not already present.
                    //   Ideally, be flexible, accept it and store in the right spot,
                    //   but for now, just throw error to force user to follow stricter syntax for BNF
                    for (var ii = 0; ii < localBNF.length; ++ii) {
                        if (localBNF[ii].headName === headName) {
                            throw new Error("Error 53: BNF.init says: " +
                                "please keep all related productions in a single set.  " +
                                "Each head (Left Hand Side word) should appear only once.");
                        }
                    }
                    prodSet = new ProductionSet(headName);
                    localBNF.push(prodSet);
                }

                // ****************************************
                // If the body contains any pipes, split on the pipes, then treat
                // each pipe separated section as a body of its own.
                // let ProductionSet.parseThenAddGrammarSequenceText worry about the details parsing body
                // ****************************************
                if (null !== body.match(/\|/)) {
                    var pipeChoices = body.split(/\|+/);	// split on the pipes
                    // Note: Array.forEach(func) needs ECMAScript 5 (or a shim)
                    pipeChoices.forEach(function (betweenPipes) {
                        betweenPipes = betweenPipes.trim();
                        prodSet.parseThenAddGrammarSequenceText(betweenPipes);
                    });
                } else {  // false === bodyHasPipe
                    prodSet.parseThenAddGrammarSequenceText(body);
                }
            } /* end else normal processing */
        } /* end while inputRemaining */

        var goalName = localBNF[0].headName;
        var goalIndex = 0;

        var sortByHeadName = function(a, b) {
            return a.headName > b.headName ? 1 : -1;
        };
        localBNF.sort(sortByHeadName);

        var headCount = localBNF.length;
        for (ii = 0; ii < headCount ; ++ii ) {
            if (goalName === localBNF[ii].headName) {
                goalIndex = ii;
                break;
            }
        }
        if ( (goalIndex < 0) || (goalName !== localBNF[goalIndex].headName) ) {
            throw new Error("Error 54: Impossibly, we lost our goal!");
        }

        // TODO: consider wrapping in private function generateHeadIndex()
        // store headIndex somewhere accessible and modify indexOfProductionSetNamed to use it.
        // then benchmark to see if there is measurable benefit from indexing vs linear search
        var emptyPrefix = "";
        var headList = [];
        for (ii = 0; ii < headCount; ++ii) {
            // headList[ii] = emptyPrefix + this.getBNF()[ii].headName;    // causes infinite recursion
            headList[ii] = emptyPrefix + this.textBnf[ii].headName;
        }
        this.headIndexFL = util.indexFL(headList);

        this.goalIndex = goalIndex;
        this.initialized = true;
    }; // end init

    /**
     *  Format the list of ProductionSets included in this BNF
     *  @returns {String} formatted text representing all ProductionSets
     */
    BNF.prototype.prettyString = function () {
        var prettyStr = ""; 		// will be returned
        var prodSetCount;           // head ::== body, as per Purple Dragon p.197
        var curProdSet;				// ProdSet is the one head and the set of corresponding bodies (GrammarSequences)

        if ( ! this.initialized) { this.init(); }

        prodSetCount = this.textBnf.length;
        for (var ii = 0; ii < prodSetCount; ++ii ) {
            curProdSet   =  this.textBnf[ii];
            prettyStr += curProdSet.prettyString();
        }

        // util.logD(prettyStr);
        return prettyStr;
    };

    /**
     *  Format the list of ProductionSets included in this BNF
     *  @returns {String} formatted text representing all ProductionSets
     */
    BNF.prototype.prettyStringOfObjects = function () {
        var prettyStr = ""; 		// will be returned
        var prodSetCount;           // head ::== body, as per Purple Dragon p.197
        var curProdSet;				// ProdSet is the one head and the set of corresponding bodies (GrammarSequences)

        if ( ! this.initialized) { this.init(); }

        prodSetCount = this.textBnf.length;
        for (var ii = 0; ii < prodSetCount; ++ii ) {
            curProdSet   =  this.textBnf[ii];
            prettyStr += curProdSet.prettyStringOfObjects();
        }

        // util.logD(prettyStr);
        return prettyStr;
    };

    return BNF;
});  // closure for the RequireJS wrapper