define(['util', 'InBuffer', 'ProductionSet'], function(util, InBuffer, ProductionSet) {
// define('Grammar',['InBuffer', 'ProductionSet'], function(InBuffer, ProductionSet) {
// our module name is Grammar (based on our file name)
// we require InBuffer module
"use strict";
/* --------  
   Grammar.js

   Utility functions.
   -------- */
// function isNonTerminal(terminalCandidate) { /* binary search through cached nonTerminals list */ }
// function listNonTerminals() { /* returns (sorted?) array of headNames */ }
// function indexNonTerminals() { /* if we don't sort BNF itself, this might let us lookup particular nonT faster */ }
//   but... I really think we will want to sort or hash the BNF 
// function listTerminals() { /* terminal and kind (corresponding headName) */ }
// function validateLL1() { /* CaC Figure 5.4, p. 149  */ }
// function firstSet(nonTerminal) { /* */ }
// function deriveEpsilon() { /* */ }
// function productionsFor(Non-terminal) { /* */ }   // or is it productionsOf(nonTerminal) ??
// function 

function Grammar(bnfString) {
	var that = this;
	var startTime;
    // safari for windows does not support window.performance.now
    if ('undefined' !== typeof window.performance) {
        startTime = window.performance.now();
    }
	var goalIndex;
    var firstChar;
    var lastIndex;
    var ii;

	console.log("Begin Grammar constructor");
	this.bnf = this.readBNF(bnfString);
	goalIndex = 0;					// if we sort the heads, this will probably change.

    var sortResult;
    var bnfLength;
    sortResult = this.cloneAndSortBNF(this.bnf);
    goalIndex = sortResult[0];
    var sortedBnf = sortResult[1];
    bnfLength = sortedBnf.length;

    var emptyPrefix = "";
    var headList = [];
    for (ii = 0; ii < bnfLength; ++ii) {
        headList[ii] = emptyPrefix + sortedBnf[ii].headName;
    }
	var headIndex = util.indexFL(headList);

	// var terminals = function() { return that.initTerminals(); };
	// var nonTerminals = function() { return that.initNonTerminals(); };
	var terminalChars;

    // we end up with a copy of function prettyString in every BNF, but likely there is only one anyway.
    this.getIndexFor = function (/* String */ needle) {
        var needleIndex = -1;        // assume needle not found
        if (typeof needle !== 'string') {
            throw new TypeError("needle passed to Grammar.containsHead is NOT a string");
        }

        firstChar = needle.charAt(0);
        if (typeof headIndex[firstChar] !== 'undefined') {
            lastIndex = headIndex[firstChar][1];
            for (ii = headIndex[firstChar][0]; ii <= lastIndex; ++ii) {
                if (headList[ii] === needle) {
                    needleIndex = ii;
                    break;
                }
            }
        }
        return needleIndex;
    };


    this.hasMemberHeadThis = function (/* String */ needle) { return (this.getIndexFor(needle) !== -1);  };
    this.hasMemberHeadThat = function (/* String */ needle) { return (that.getIndexFor(needle) !== -1);  };


	// we end up with a copy of function prettyString in every BNF, but likely there is only one anyway.
	this.prettyString = function () { 
		var prettyStr = ""; 		// will be returned
		var headCount;				// head ::== body, as per Purple Dragon p.197
		var curHead;

		headCount = that.bnf.length;
		// console.log("headCount=" + headCount);
		for (var ii = 0; ii < headCount; ++ii ) {
			curHead   =  that.bnf[ii];
			prettyStr += curHead.prettyString();
			// console.log(prettyStr);
		} 

		return prettyStr;
	};

    var privateTerminals = {};
    var generateTerminalList = function() {
        privateTerminals = {};
        // head ::== body, as per Purple Dragon p.197
        var headCount, ruleCount, gramSymCount;
        var curHead, curRule, curGramSym;
        var ii, jj, kk;
        var prettyStr = "";
        headCount = that.bnf.length;
        // console.log("headCount=" + headCount);
        for ( ii = 0; ii < headCount; ++ii ) {
            curHead   =  that.bnf[ii];
            // console.log(prettyStr);
            // for each head
            // for each rule
            // for each grammarSymbol
//        var grammarSym;
            ruleCount = curHead.rules.length;
            for ( jj = 0; jj < ruleCount; ++jj ) {
                var curRule = curHead.rules[jj];
                gramSymCount = curRule.length;
                for ( kk = 0; kk < gramSymCount ; ++kk ) {
                    curGramSym = curRule[kk];
                    if (that.hasMemberHeadThat(curGramSym)) {
                    // if (that.getIndexFor(curGramSym) !== -1) {
                        // not a terminal
                    } else {
                        privateTerminals[curGramSym] = '#';  // TODO this will give us duplicates
                    }
                }
            }
            // check each GrammarSymbol for LHS
        }
      //  var termCount = privateTerminals.length;
      //  console.log("privateTerminals:", privateTerminals);

    };

    generateTerminalList();

    this.getTerminals = function() {return privateTerminals;};

    var privateTerminalChars = {};
    var generateTerminalCharList = function() {
        privateTerminalChars = {};
        // head ::== body, as per Purple Dragon p.197
        var terminalCount, charCount;
        var curWord;
// , curRule, curGramSym;
        var ii, jj, kk;
//        var prettyStr = "";
        terminalCount = privateTerminals.length;
        // console.log("headCount=" + headCount);
        var words = [];
        words = Object.keys(privateTerminals);

      //      console.log("curWord:", curWord);
        for ( ii = 0; ii < words.length; ++ii ) {
            curWord   =  words[ii];
            // console.log(prettyStr);
            // for each head
            // for each rule
            // for each grammarSymbol
//        var grammarSym;
            var wordLen = curWord.length;
            // ruleCount = curHead.rules.length;
            for ( jj = 0; jj < wordLen; ++jj ) {
                privateTerminalChars[curWord.charAt(jj)] = '#';
            }
            // check each GrammarSymbol for LHS
        }
        var termCount = privateTerminalChars.length;
        console.log("privateTerminalChars:", privateTerminalChars);

    };

    generateTerminalCharList();

    this.getTerminalCharList = function() {return privateTerminalChars;};


    var privateKeywords = {};
    var generateKeywordList = function() {
        // stupid, do not clear this here!!! privateTerminalChars = {};
        // head ::== body, as per Purple Dragon p.197
        var terminalCount, charCount;
        var curWord;
// , curRule, curGramSym;
        var ii, jj, kk;
//        var prettyStr = "";
        terminalCount = privateTerminals.length;
        // console.log("headCount=" + headCount);
        var words = [];
        words = Object.keys(privateTerminals);


      //      console.log("curWord:", curWord);
        for ( ii = 0; ii < words.length; ++ii ) {
            curWord   =  words[ii];
            if (curWord.length > 1) { privateKeywords[curWord] = '#'; }
        }
      //  var termCount = privateTerminalChars.length;
      //  console.log("privateKeywords:", privateKeywords);

    };

    generateKeywordList();

    this.getKeywords = function() {return privateKeywords;};


    var msElapsed = 'performance not available';
    if ('undefined' !== typeof window.performance) {
        msElapsed = window.performance.now() - startTime;
        console.log("End Grammar constructor.  Elapsed time (ms): ", msElapsed.toFixed(3));
    }
    // note: above method is prettier, and seemed to take a little less time, though no official measurements made.
    // console.log("End Grammar constructor.  Elapsed time (ms): ", window.performance.now() - startTime);
}

Grammar.prototype.hasMemberHead = function (/* String */ needle) { return (this.getIndexFor(needle) !== -1);  };

Grammar.prototype.cloneAndSortBNF = function(inBnf) {
    var curHead;
    var headCount = inBnf.length;
    var sortedBnf = [];
    var goalIndex = -1;
    var goalName = inBnf[0].headName;
    var ii;
    // console.log("headCount=" + headCount);
    for (ii = 0; ii < headCount; ++ii ) {
        sortedBnf[ii] =  inBnf[ii];
    }
    sortedBnf.sort(function(a, b) {
        var firstBigger = 0;
        if (a.headName > b.headName) {
            firstBigger  = 1;
        } else if (a.headName < b.headName) {
            firstBigger = -1;
        }
        return firstBigger;
        // return a.headName > b.headName ? 1 : -1;
    });
    for (ii = 0; ii < headCount ; ++ii ) {
        if (goalName === sortedBnf[ii].headName) {
            goalIndex = ii;
            break;
        }
    }
    if ( (goalIndex < 0) || (goalName !== sortedBnf[goalIndex].headName) ) {
        throw new Error("Impossibly, we lost our goal!");
    }

    var prettySortedStr = '';
    for (ii = 0; ii < headCount; ++ii ) {
        curHead   =  sortedBnf[ii];
        prettySortedStr += curHead.prettyString();
    }
    // console.log("pretty");
    // console.log(prettySortedStr);
    // console.log("sorted");
    return [goalIndex, sortedBnf];

};

Grammar.prototype.readBNF = function(bnfString) {

	var bnf = [];			//  of ProductionSets
	var prodSet;			//  reference to a ProductionSet (headName and corresponding ?derivations?)
	var grammarSequence = [];
	var quotedChar;
	var bnfSourceCode;
    var bnfLine;
	var bnfIndex = -1;		// this could cause a problem if we don't get a lhs in first rule.  so don't do that.
    var prodIndex = 0;
	var producedBy = '::==';	// RHS is productionFor LHS.  Also, LHS derives RHS.
	// const pipeSearch = '\|';
	var headAndBody;
	var body;
	var headName;
	// var bodyHasPipe;
	// var debugRuleCount;
	var production = [];
	
	bnfSourceCode = new InBuffer(bnfString);

	while ( bnfSourceCode.inputRemaining() ) {
//		bnfLine = bnfSourceCode.readLine();
//		headAndBody = bnfLine.split(producedBy);
		bnfLine = bnfSourceCode.readLine();
		headAndBody = bnfLine.split(producedBy);
        if (headAndBody.length === 2) {
            // we do not want leading or trailing spaces on headName
            headName = headAndBody[0].trim();
            // if we do not trim body, split will put extra empty strings front and back if there are leading/trailing spaces
            body = headAndBody[1].trim();

            if ( headName.length > 0 ) {
                // we have a new head, not a continuation of productions for previous head
                // we SHOULD check to make sure it is not already present, but for now, just do not put duplicates in the BNF.
                prodSet = new ProductionSet(headName);
                bnfIndex++;
                prodIndex = 0;
                bnf.push( prodSet );
            }

            // ********************
            // Handle special cases
            // NOTE: special cases cannot be combined. (though they could, with refactoring and a performance penalty)
            //       to refactor, check pipes first, then quote. if quote, for nonTerm, scan instead of split.
            // Supported:
            //      space ::== ' '
            //		type ::== int | string | boolean
            //      nonTerminal ::== sequence of grammar symbols
            //                  ::== alternate sequence of grammar symbols
            // Unsupported:
            //		nonTerminal ::== First Sequence | Second Sequence
            // var bodyHasSingleQuotes;
            var testForQuotes = body.match(/\'.\'/);  	// intended ONLY for handling the space char
            // console.log("body=" + body + " HasSingleQuote" + " where-" + testForQuotes + "-");
            if ( null !== testForQuotes ) {
                // bodyHasSingleQuotes = true;
                // console.log("body=" + body + " HasSingleQuote" + " where-" + testForQuotes + "-");
                // console.log("testforquotes", testForQuotes);
                // extract quotedChar, add to Grammar
                // it seems that testForQuotes is not a string.  so make a new one.
                var testCopy = "" + testForQuotes;
                quotedChar = testCopy.charAt(1);
                // quotedChar = testForQuotes[1];
                // console.log("quotedChar", quotedChar, "code", quotedChar.charCodeAt());
                // TODO add to grammar
                // grammarSequence.length = 1;		// truncate array.  This fails.
                // grammarSequence = [];		// get a fresh empty array.  This works.
                // grammarSequence[0] = quotedChar;
                // adding 'arrayed' quotedChar works, avoids need for grammarSequence[]
                prodSet.addRule( [quotedChar] );		//================ add here (repeated)
                //console.log(prodSet);
            } else {
                // bodyHasSingleQuotes = false;
                // var bodyHasPipe;
                // if ( null === body.match(/\|/) ) { bodyHasPipe = false; } else { bodyHasPipe = true; }

                if ( null !== body.match(/\|/) ) {
                    // bodyHasPipe = true;
                    var choices;
                    choices = body.split(/\|+/);	// split on the pipes
                    // console.log("body=" + body + " HasPipe=" + bodyHasPipe);
                    // console.log("choices=" + choices);
                    // Note: forEach(func) needs ECMAscript 5
                    choices.forEach(function(token) {
                        token = token.trim();
                        // add token as new rule (array with one element)
                        // grammarSequence.length = 1;		// truncate array.  This fails.  3 hours wasted!
                        // grammarSequence = [];		// get a fresh empty array.  This works.
                        // grammarSequence[0] = token;
                        // console.log("token", token, "gramSeq", grammarSequence);
                        // adding 'arrayed' token works, avoids need for grammarSequence[]
                        prodSet.addRule( [token] );		//================ add here (repeated)
                        // prodSet.addRule( grammarSequence );		//================ add here (repeated)
                        // bnf[bnfIndex].rules[prodIndex++] = ( grammarSequence );	// old way.  also works
                    });
                } else {
                    // false == (bodyHasPipe || bodyHasSingleQuotes)
                    // ********************
                    // Handle normal sequences of grammar symbols
                    if ( body.length > 0 ) {
                        // bnf[bnfIndex].rules[prodIndex] = ( body.split(/[\s]+/) );
                        // bnf[bnfIndex].addRule( body.split(/[\s]+/) );
                        // prodSet.addRule( body.split(/[\s]+/) );
                        grammarSequence = [];
                        grammarSequence = body.split(/[\s]+/);
                    } else {
                        // body.length is zero
                        // empty string creates an element when split,
                        // but it will be easier to search for epsilon if array length zero,
                        // rather than length one containing empty string
                        // bnf[bnfIndex].rules[prodIndex] = ( [] );
                        // bnf[bnfIndex].addRule( [] );
                        grammarSequence = [];
                    }
                    // bnf[bnfIndex].rules[prodIndex] = ( grammarSequence );	// old way.  also works
                    prodSet.addRule( grammarSequence );			//================ add here
                } // end normal sequence
            } // end noQuotes

        } else {
            // we did not get exactly a head and body, separated by ::==
            // if it is just a blank line, ignore and continue.  otherwise, give error message
            if (bnfLine.trim().length > 0) {
                throw new Error("50: Invalid Grammar syntax. [" + bnfLine + "]");
            }
        }
/*
			
		} else {
		//	production = body.split(/[\s]+/);
		}
		// empty string still creates an element when split.  
		// more elegant if this rule.length == 0, because then we do not need to check if strlen == 0 to find epsilon
		if ( body.length > 0 ) {   

		   // bnf[bnfIndex].rules[prodIndex] = ( body.split(/[\s]+/) );
		   bnf[bnfIndex].addRule( body.split(/[\s]+/) );
		} else {
		   // bnf[bnfIndex].rules[prodIndex] = ( [] );
		   bnf[bnfIndex].addRule( [] );
		}
*/		// when debugRuleCount is zero, we have epsilon
		// debugRuleCount = bnf[bnfIndex].rules[prodIndex].length;
//		prodIndex++;		// not needed, now that we use addrule
	} // end while inputRemaining

	return bnf;
}; // end readBNF



/*****************************
Grammar.prototype.terminals = [];
Grammar.prototype.generateTerminalList = function() {
    this.terminals = [];
    // head ::== body, as per Purple Dragon p.197
    var headCount, ruleCount, gramSymCount;
    var curHead, curRule, curGramSym;
    var ii, jj, kk;
    var prettyStr = "";
    headCount = this.bnf.length;
    // console.log("headCount=" + headCount);
    for ( ii = 0; ii < headCount; ++ii ) {
        curHead   =  this.bnf[ii];
        // console.log(prettyStr);
        // for each head
        // for each rule
        // for each grammarSymbol
//        var grammarSym;
        ruleCount = curHead.rules.length;
        for ( jj = 0; jj < ruleCount; ++jj ) {
            var curRule = curHead.rules[jj];
            gramSymCount = curRule.length;
            for ( kk = 0; kk < gramSymCount -99; ++kk ) {
                curGramSym = curRule[kk];
              //  if (this.hasMemberHead(curGramSym)) {
                if (this.getIndexFor(curGramSym) !== -1) {
                    // not a terminal
                } else {
                    this.terminals.push(curGramSym);  // TODO this will give us duplicates
                }
            }
        }

        // check each GrammarSymbol for LHS
    }

};
************************************/

    return Grammar;
 
});  // closure for the requirejs structures