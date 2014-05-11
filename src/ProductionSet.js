define(['util'], function(util) {
"use strict";
// our module name is ProductionSet (based on our file name)

// ********************
// Supported syntax examples:
//      space ::== ' '
//		type ::== int | string | boolean
//      char ::== a |b...c | 'd'
//      nonTerminal ::== sequence of ( grammar ) symbols
//                  ::== alternate sequence of grammar symbols
//		nonTerminal ::== First Sequence | Second Sequence
//
// NOTE: currently, processing of pipes is handled by the BNF object using ProductionSets
// NOTE: the calling BNF object also handles input, providing headNames (space, type, ...)
//       and grammarSequences (words on right side of ::==) to ProductionSet
// type and char fall into the "terminalPattern" category.
// Unless open and close paren appear on the left side of a production rule somewhere (unlikely),
//    they may be a special case of terminalPattern (where the pattern matches just one char)


/**
 *  Creates a new, empty text version of BNF ProductionSet
 *  @constructor
 *  @param {String} headValue is word from left side of ::== that is associated with one or more GrammarSequences
 */
function ProductionSet(headValue) {
    if (!(this instanceof ProductionSet)) {
        alert("Warning 60: ProductionSet constructor says: Please do not forget the 'new' when you call me.");
        return new ProductionSet(headValue);
    }
	var that = this;                 // currently, that is not referenced
	this.headName = headValue;
	this.rules = [];					// rename this to rules at first opportunity
	// var  hasNonTerminal = true;


    /**
     *  test for existence of GrammarSequence in current ProductionSet
     *  @returns {Boolean} true if same exact sequence GrammarSymbols (words) is already in this ProductionSet
     */
    var hasTheseSymbols = function (/** Array */ arrayOfGrammarSymbols) {
        if( !Array.isArray(arrayOfGrammarSymbols) ) {
            alert( 'Hey, where is the Array?' );
            throw new TypeError("Error 43: ProductionSet.hasTheseSymbols says: arrayOfGrammarSymbols is not an array");
        }
        var ii;
        var ruleCount = that.rules.length;
        for (ii = 0; ii < ruleCount; ++ii) {
            if ( util.arraysIdentical(arrayOfGrammarSymbols,  that.rules[ii]) ) { return true;}
        }
        return false;
    };

    /**
     *  test for existence of GrammarSequence in current ProductionSet
     *  @returns {void} true if same exact sequence GrammarSymbols (words) is already in this ProductionSet
     */
    this.addRule = function(/** Array */ arrayOfGrammarSymbols) {
		// from http://stackoverflow.com/questions/4775722/check-if-object-is-array
		// if( Object.prototype.toString.call( arrayOfGrammarSymbols ) !== '[object Array]' ) {
        if( !Array.isArray(arrayOfGrammarSymbols) ) {
            alert( 'Hey, where is the Array?' );
			// console.log("addRule got an array.  hurray");
			// reverse this logic, and throw error if not array
			throw new TypeError("Error 43: ProductionSet.addRule says: arrayOfGrammarSymbols is not an array");
		}

		// an empty array is OK, as long as it is an array
        if ( hasTheseSymbols(arrayOfGrammarSymbols) ) {
            alert("Warning 42: ProductionSet.addRule says: attempt to add duplicate rule [" +
                arrayOfGrammarSymbols +
                "] was ignored") ;
        } else {
            this.rules.push(arrayOfGrammarSymbols);
        }
      // return;
    };
	
//	this.isTerminal = function() { return ! that.hasNonTerminal; };
	// need a method to check or set if we are terminal

	// this.prettyStringThat = function() { return that.prettyString(); };

} // end constructor	


ProductionSet.prototype.prettyString = function() {
	var prettyStr = ""; 		// will be returned
	var ruleStr;
	// grammarSymbol == Token or nonTerminal: one item from RHS (body)  
	// 	  The hash (#) is not in our vocabulary, and disambiguates our list vs. native array.toString
	var grammarSymbolSeparator = "#";
    // ε	&epsilon;	&#949;	&#x3B5;	Lowercase Epsilon  Unicode U+03BF
    var EPSILON_CODE = 949;
    var EPSILON_CHAR = String.fromCharCode(EPSILON_CODE);
    // var EPSILON_HTML = '&epsilon;';

	var ruleCount;				// number of productions for a given head.  Must be one or more.
	                            // The one _could_ be epsilon.
	var grammarSymbolCount;		// number of grammarSymbols in a rule.  (zero for epsilon)
	var curRule;				// could be empty (if epsilon)
	var curHead;
	var jj, kk;

	curHead   =  this;
	prettyStr += curHead.headName.toString() + "::==\n";
	ruleCount =  curHead.rules.length;
	ruleStr   =  "";

	for (jj = 0; jj < ruleCount; ++jj) {
		curRule = curHead.rules[jj];
		ruleStr += "    [";                     // Only Firefox honors space indentation in text area consider .. or --
		grammarSymbolCount = curRule.length;
        if ( 0 === grammarSymbolCount ) {
            ruleStr += EPSILON_CHAR;            // Works for text areas.  for HTML, might need &epsilon;
        }
		// console.log("grammarSymbolCount=" + grammarSymbolCount);
		for (kk = 0; kk < grammarSymbolCount; ++kk) {
			if ( 0 < kk ) {
                ruleStr += grammarSymbolSeparator;
            }
			ruleStr += curRule[kk];
		}
		ruleStr += "]\n";
	}
	prettyStr += ruleStr ;
	// util.logD(prettyStr);
	return prettyStr;
};


/** adds a range of characters to ProductionSet when specified as 0...9 or a ... z
 * @param {Array} textGrammarSequence An array of strings.  words (w/o spaces) where each word represents a GrammarSymbol
 * @returns {Boolean} true if we recognized ellipsis and added chars to prodSet
 */
ProductionSet.prototype.processEllipsis = function (/** Array */ textGrammarSequence /** , ProductionSet prodSet */) {
    if( ! Array.isArray(textGrammarSequence) ) {
        alert( "Error 40: ProductionSet.processEllipsis says: textGrammarSequence should be an array of strings" );
    }
//        if ( ! (prodSet instanceof ProductionSet) ) {
//            alert( "Error 41: ProductionSet.processEllipsis says: prodSet should be a ProductionSet" );
//        }

    var addedRangeToProdSet = false;
    if (   ( 3 === textGrammarSequence.length && textGrammarSequence[1] === '...' )
        || ( 1 === textGrammarSequence.length && textGrammarSequence[0].match(/^.\.\.\..$/) )
    ) {
        // alert("Info 82: ProductionSet.processEllipsis found ellipsis");
        // NOTE:  the ellipsis must be space delimited or not, but not mixed like 'a... z'
        var seqFirst;
        var seqLast;
        if ( 1 === textGrammarSequence.length) {
            seqFirst = textGrammarSequence[0].charAt(0);
            seqLast  = textGrammarSequence[0].charAt(4);
        } else { // (3 === length)
            seqFirst = textGrammarSequence[0];
            seqLast  = textGrammarSequence[2];
        }
        var codeFirst = seqFirst.charCodeAt(0);
        var codeLast  = seqLast.charCodeAt(0);
        var cc;
        // TODO: we could handle single quoted chars, but lets save that for future
        if (   1 === seqFirst.length
            && 1 === seqLast.length
            && codeFirst <= codeLast )  {
            // alert("Info 83: ProductionSet.processEllipsis found valid ellipsis pattern");
            for (cc = codeFirst; cc <= codeLast; ++cc) {
                this.addRule([String.fromCharCode(cc)]);
            }
            addedRangeToProdSet = true;
        } else {
            // ellipsis pattern invalid.  Treat like regular production.
            alert("Warning 84: ProductionSet.processEllipsis says: The ellipsis pattern [" +
            textGrammarSequence +
                // seqFirst + ' ... ' + seqLast +
            "] is not valid.  Treating like regular production");
        }
    // } else {    // no ellipsis found
    //     // nothing real to do, just leave the textGrammarSequence unmolested
    //     // and let caller addRule since we did not
    //     addedRangeToProdSet = false;
    }
    return addedRangeToProdSet;
}; /* end processEllipsis */
    
    
/**
 * @description  parse the specified body (rule) into words, validate, then add to current ProductionSet
 * @param {String} body A space delimited string where each word represents a GrammarSymbol
 * @returns      {void} containing publicValue2
 */
ProductionSet.prototype.parseThenAddGrammarSequenceText = function (/** String */ body ) {
    // ε	&epsilon;	&#949;	&#x3B5;	Lowercase Epsilon  Unicode U+03BF
    var EPSILON_CODE = 949;     // as per: http://webdesign.about.com/od/localization/l/blhtmlcodes-gr.htm
    var quotedChar;             // a single character, surrounded by single quotes
    var rangeAdded = false;     // boolean set to true when processEllipsis added to this ProductionSet
    var grammarSequence = [];   // an array of strings to be added for new rule

    var testForQuotes = body.match(/'.'/);      // intended ONLY for handling the space char, but handles most
    if (null !== testForQuotes) {   // betweenPipesHasQuotedChar == true;
        // extract quotedChar, add as a Grammar Symbol (that will always be a terminal char).
        // it seems that testForQuotes is not a string.  so make a new one.
        var testCopy = "" + testForQuotes;
        quotedChar = testCopy.charAt(1);
        // Add to grammar
        this.addRule([quotedChar]);		//================ add here ... or ...
    } else {    // bodyHasPipe == true, betweenPipesHasQuotedChar == false
        // TODO: check and warn for non-conforming quote usage like 'ab'  currently accepts as literal 'ab'
        grammarSequence = [];       // epsilon if body.length == 0
        // prefer empty sequence to sequence of 1 containing empty
        if (body.length > 0) {
            if (1 === body.length && body.charCodeAt(0) == EPSILON_CODE) {
                /* do nothing - treat this the same as an empty body */
                // alert("Info 81: ProductionSet.parseThenAddGrammarSequenceText() found an epsilon");
            } else {
                grammarSequence = body.split(/[\s]+/);
                rangeAdded = this.processEllipsis(grammarSequence);
            }
        // } else {  // TODO: warning - these comments may be in wrong place
        // body.length is zero
        // empty string creates an element when split,
        // but it will be easier to search for epsilon if array length zero,
        // rather than length one containing empty string
        //     grammarSequence = [];
        }
        if (!rangeAdded) {
            // ellipsis processing did not already add rule(s) for this body
            this.addRule(grammarSequence);			//================ add here
        }
    }
};

return ProductionSet;
 
});  // closure for the RequireJS define()
