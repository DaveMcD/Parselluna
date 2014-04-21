define('ProductionSet',[], function() {
"use strict";
// our module name is ProductionSet (based on our file name)
// we require InBuffer module

function ProductionSet(headValue) {
	var that = this;
	this.headName = headValue;
	this.rules = [];					// rename this to rules at first opportunity
	var  hasNonTerminal = true;
	
    this.addRule = function(arrayOfGrammarSymbols) {
		// from http://stackoverflow.com/questions/4775722/check-if-object-is-array
		// if( Object.prototype.toString.call( arrayOfGrammarSymbols ) !== '[object Array]' ) {
        if( !Array.isArray(arrayOfGrammarSymbols) ) {
            alert( 'Hey, where is the Array?' );
			// console.log("addRule got an array.  hurray");
			// reverse this logic, and throw error if not array
			throw new TypeError("ProductionSet.addRule: arrayOfGrammarSymbols is not an array");
		}
		// an empty array is OK, as long as it is an array
		this.rules.push(arrayOfGrammarSymbols);
        return;
    };
	
	this.isTerminal = function() { return ! that.hasNonTerminal; };
	// need a method to check or set if we are terminal

	this.prettyStringThat = function() { return that.prettyString(); };

} // end constructor	


ProductionSet.prototype.prettyString = function() {
	var prettyStr = ""; 		// will be returned
	var ruleStr = "";
	// grammarSymbol == Token or nonTerminal: one item from RHS (body)  
	// 	  The hash (#) is not in our vocabulary, and disambiguates our list vs. native array.toString
	var grammarSymbolSeparator = "#";
	var ruleCount;				// number of productions for a given head.  Must be one or more.
	                            // The one _could_ be epsilon.
	var grammarSymbolCount;		// number of grammarSymbols in a rule.  (zero for epsilon)
	var curRule;				// could be empty (if epsilon)
	var curHead;
	var ii, jj, kk;

	curHead   =  this;
	prettyStr += curHead.headName.toString() + "::==\n";
	ruleCount =  curHead.rules.length;
	ruleStr   =  "";
	// console.log("ruleCount=" + ruleCount);
	for (jj = 0; jj < ruleCount; ++jj) {
		curRule = curHead.rules[jj];
		ruleStr += "    [";
		grammarSymbolCount = curRule.length;
		// console.log("grammarSymbolCount=" + grammarSymbolCount);
		for (kk = 0; kk < grammarSymbolCount; ++kk) {
			if ( 0 < kk ) { ruleStr += grammarSymbolSeparator; };
			ruleStr += curRule[kk];
		}
		ruleStr += "]\n";
	}
	// console.log(ruleStr);
	prettyStr += ruleStr ;
	// console.log(prettyStr);
	return prettyStr;
};

	
return ProductionSet;
 
});  // closure for the requirejs structures