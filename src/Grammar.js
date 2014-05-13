/**
 * @FILE Grammar.js
 * Created by
 * @AUTHOR David McDonald
 */
define(['util', 'InBuffer', 'BNF', 'Production', 'ProductionSet', 'GrammarSymbol', 'NonTerminal', 'TerminalPattern', 'Terminal', 'Symbol', 'SymbolTable', 'DFA'],
 function(util,  InBuffer,   BNF,   Production,   ProductionSet,   GrammarSymbol,   NonTerminal,   TerminalPattern,   Terminal,   Symbol,   SymbolTable,   DFA ) {
// our module name is Grammar (based on our file name)
"use strict";

// TODO: some planned functions...
// function validateLL1() { /* CaC Figure 5.4, p. 149  */ }
// function deriveEpsilon() { /* */ }
// function firstSet(nonTerminal) { /* */ }
// function productionsFor(Non-terminal) { /* */ }   // or is it productionsOf(nonTerminal) ??

/**
 *  Creates a new Grammar
 *  @constructor
 *  @param      {String} bnfString multi-line string with grammar to be parsed, in Backus-Naur Form
 *              see BNF.js for accepted syntax of BNF
 *  @returns    {Grammar} object (containing text BNF and derived info, such as lists of Terminals and nonTerminals
 */
function Grammar(bnfString) {
    if (!(this instanceof Grammar)) {
        alert("Grammar constructor says: Please do not forget the 'new' when you call me.");
        return new Grammar(bnfString);
    }
    util.logD("Begin Grammar constructor");

    // TODO: refactor so that constructor only saves bnfString, and init() does the work,
    //       so that we can move big functions out of constructor and implement as Grammar.prototype functions.
	var that = this;
    var uTimer;
	var startTime;
    var privateTerminals = {};          // TODO: determine if there is a refactor with fewer redundant categories
    var privateTerminalKinds = {};
    var privateTerminalPatterns = {};
    var privateTerminalChars = {};
    var privateKeywords = {};
    var privateNonTerminals = {};
    var privateLexerSymTab;
    var dfaForLex = {};

//    var bnfLength;
    var sortedBnf;

    var goalIndex;
//    var firstChar;
//    var lastIndex;
//    var ii;

    // safari for windows does not support window.performance.now
    //noinspection JSUnresolvedVariable
    if ('undefined' === typeof window.performance) {
        uTimer = Date.now;
    } else {
        uTimer = function() {  //noinspection JSUnresolvedVariable
            return window.performance.now(); };
        // bind does not work in this cast (startTime = uTimer() gets TypeError: Illegal invocation
        // uTimer = window.performance.now.bind(window);
    }
    startTime = uTimer();

    if ( ('undefined' === typeof bnfString ) || 0 === bnfString.length ) {
        throw new TypeError("Error 30: Grammar constructor says: non-empty bnfString is required");
    }

    var myBNF_obj = new BNF(bnfString);
    myBNF_obj.init();

    sortedBnf = myBNF_obj.getBNF();
    this.bnf = sortedBnf;           // TODO: some customers access this.bnf directly.  Hunt them down and change them
    goalIndex = myBNF_obj.getBNF_Goal_Index();


    // we end up with a copy of function getIndexFor in every Grammar, but likely there is only one BNF anyway.
    this.getIndexFor = function (/** String */ needle) {
        return myBNF_obj.indexOfProductionSetNamed(needle);
    };


    var generateTerminalList = function() {
        privateTerminals = {};
        // head ::== body, as per Purple Dragon p.197
        var headCount, ruleCount, gramSymCount;
        var curHead, curRule, curGramSym;
        var ii, jj, kk;

        headCount = that.bnf.length;
        for ( ii = 0; ii < headCount; ++ii ) {              // for each head
            curHead   =  that.bnf[ii];

            ruleCount = curHead.rules.length;
            for ( jj = 0; jj < ruleCount; ++jj ) {          // for each rule
                curRule = curHead.rules[jj];

                gramSymCount = curRule.length;
                for ( kk = 0; kk < gramSymCount ; ++kk ) {  // for each grammarSymbol
                    curGramSym = curRule[kk];
                    // check each GrammarSymbol to see if it can be found on Left Hand Side of ::==
                    // if (that.hasMemberHeadThat(curGramSym)) {  // currently, either way works.
                    if (that.hasMemberHead(curGramSym)) {
                        // not a terminal
                    } else {
                        privateTerminals[curGramSym] = "#";  // TODO this will give us duplicates ?????
                        privateTerminalKinds[curGramSym] = curHead.headName;  // TODO this will give us duplicates ?????
                        // ????? keep head of terminals in hash, instead of '#'?  makes tests harder, but will give
                        // us some for free like digit
                    }
                } /* end forEach grammarSymbol */
            } /* end forEach rule */
        } /* end forEach head */
      util.logD("privateTerminals:", privateTerminals);
    };

    var generateTerminalPatternAndNonTerminalLists = function() {
        privateTerminalPatterns = {};
        privateNonTerminals = {};
        // privateTerminals = {};
        // head ::== body, as per Purple Dragon p.197
        var headCount, ruleCount, gramSymCount;
        var curHead, curHeadName, curRule, curGramSym;
        var ii, jj, kk;

        headCount = that.bnf.length;
        for ( ii = 0; ii < headCount; ++ii ) {              // for each head
            curHead   =  that.bnf[ii];
            curHeadName = curHead.headName;

            // for this ProductionSet, see if there are ONLY terminals on right
            // any nonTerminal disqualifies curHead from joining the TerminalPattern club
            // the only catch is... we did not yet prepare list of nonTerminals.
            // we do, however, have a list of terminals, so let's start with that.
            // for us, StringExpr and Id and CharList might be terminalPatterns, but
            // they do appear on LHS.
            var hasOnlyTerminals = true;
            ruleCount = curHead.rules.length;
            for ( jj = 0; jj < ruleCount && hasOnlyTerminals; ++jj ) {          // for each rule
                curRule = curHead.rules[jj];

                gramSymCount = curRule.length;
                for ( kk = 0; kk < gramSymCount && hasOnlyTerminals; ++kk ) {  // for each grammarSymbol
                    curGramSym = curRule[kk];
                    if ( ! that.isTerminal(curGramSym)) {
                        hasOnlyTerminals = false;
                    }
                } /* end forEach grammarSymbol */
            } /* end forEach rule */
            if ( hasOnlyTerminals ) {
                // add an entry in hash table
                // TODO: warn if first char of headName is not lower case
                privateTerminalPatterns[curHead.headName] = '#';
            } else {
                // TODO: warn if first char of headName is not upper case
                privateNonTerminals[curHead.headName] = '#';
            }
        } /* end forEach head */
      util.logD("privateTerminalPatterns:", privateTerminalPatterns);
      util.logD("privateNonTerminals:", privateNonTerminals);
    };

    var generateTerminalCharList = function() {
        privateTerminalChars = {};
        var curWord;
        var ii, jj;
        var words;  // was initialized to [], but that does not seem to be needed.
        words = Object.keys(privateTerminals);

        for ( ii = 0; ii < words.length; ++ii ) {
            curWord   =  words[ii];
            var wordLen = curWord.length;
            for ( jj = 0; jj < wordLen; ++jj ) {
                privateTerminalChars[curWord.charAt(jj)] = '#';
            }
        }
//        var myZZTerminalChars;   // was initialized to [], but that does not seem to be needed.
//        myZZTerminalChars = Object.keys(privateTerminalChars);
//        myZZTerminalChars.sort();

//        util.logD("myTerminalChars:", myZZTerminalChars.toString());
        util.logD("privateTerminalChars:", privateTerminalChars);
//        return myZZTerminalChars;
    };

    var generateKeywordList = function() {
        var curWord;
        var ii;
        var words;     // was initialized to [], but that does not seem to be needed.
        words = Object.keys(privateTerminals);

        for ( ii = 0; ii < words.length; ++ii ) {
            curWord   =  words[ii];
            // TODO: starts with lower case letter and longer than one char
            //       is probably not the right approach, but it works for our grammar
            if (curWord.charAt(0).match(/[a-z]/)) {
                if (curWord.length > 1) { privateKeywords[curWord] = '#'; }
            }
        }
        util.logD("privateKeywords:", privateKeywords);
    };

    var isKeyword = function(/**String*/ candidate) {
        return ( ! ('undefined' === typeof privateKeywords[candidate]) );

//        var bool_by_undefined;
//        if ( ! ('undefined' === typeof privateKeywords[candidate]) ) {
//            bool_by_undefined = true;
//        } else {
//            bool_by_undefined = false;
//        }
//
//        var candidateIsKeyword = false;
//        var curWord;
//        var ii;
//        var words;     // was initialized to [], but that does not seem to be needed.
//        words = Object.keys(privateKeywords);
//
//        for ( ii = 0; ii < words.length; ++ii ) {
//            curWord   =  words[ii];
//            if (curWord === candidate) {
//                candidateIsKeyword = true;
//                break;
//            }
//        }
//        util.logD("isKeyword(" + candidate + ") is " + candidateIsKeyword);
//        return candidateIsKeyword;
    };

    var isTerminalPattern = function(/**String*/ candidate) {
        return ( ! ('undefined' === typeof privateTerminalPatterns[candidate]) );

//        var candidateIsTerminalPattern = false;
//        var curWord;
//        var ii;
//        var words;     // was initialized to [], but that does not seem to be needed.
//        words = Object.keys(privateTerminalPatterns);
//
//        for ( ii = 0; ii < words.length; ++ii ) {
//            curWord   =  words[ii];
//            if (curWord === candidate) {
//                candidateIsTerminalPattern = true;
//                break;
//            }
//        }
//        util.logD("isKeyword(" + candidate + ") is " + candidateIsTerminalPattern);
//        return candidateIsTerminalPattern;
    };


var addKeywordsToSymbolTable = function (/**BNF*/ parsedBNF, /**SymbolTable*/ symTab) {
    var ii, jj, kk;
    var bnfRef = parsedBNF.getBNF();                // TODO: is this another sign of need for refactor?
    var headCount = bnfRef.length;
    for (ii = 0; ii < headCount; ++ii) {
        var prodSet = bnfRef[ii];
        var prodSetLength = prodSet.rules.length;   // TODO: is this another sign of need for refactor?
        for (jj = 0; jj < prodSetLength; ++jj) {
            var gramSeq = prodSet.rules[jj];
            var gramSeqCount = gramSeq.length;
            for (kk = 0; kk < gramSeqCount; ++kk) {
                if (isKeyword(gramSeq[kk])) {
                    if (isTerminalPattern(prodSet.headName)) {
                        symTab.addSymbol(new Symbol(gramSeq[kk], prodSet.headName));
                    } else {
                        // Not a terminal pattern.  must be part of NonTerminal.
                        // tag with prodSet.Name AND 'Keyword'
                    //    symTab.addSymbol(new Symbol(gramSeq[kk], prodSet.headName + 'Keyword'));
                        // instead, tag with own name TODO: see what this attempt at brevity breaks.  Seems OK so far.
                        symTab.addSymbol(new Symbol(gramSeq[kk], gramSeq[kk]));
                    }
                }
            }
        } /* end for jj */
    }
    symTab.markLastKeyword();
}; /* end addKeywordsToSymbolTable */

/**
 *  Based on the grammar data available, generate the DFA that lex() will use for scanning source code
 */
var generateDfaForLex = function () {
    dfaForLex = new DFA();
    // setup StringExpr  TODO: add Char list characters, instead of hardcoded
    // TODO: handle via COMPILER_DIRECTIVE
    dfaForLex.addDelimitedSequence("StringExpr", '"',
        " abcdefghijklmnopqrstuvwxyz", '"');
    // manually setup Id (filter out keywords from symbol table later)
    //                   (filter out Id's over MAX_ID_LEN later)
    //                   TODO: add chars in TerminalPattern char, instead of hardcoded
    // TODO: handle via COMPILER_DIRECTIVE
    dfaForLex.addUnlimitedSequence("Id", "abcdefghijklmnopqrstuvwxyz");

    // manually setup digit (any one digit 0-9)
    //                   (filter out Id's over MAX_ID_LEN later)
    //                   TODO: add chars in TerminalPattern digit, instead of hardcoded
    //                   TODO: to reject 99, we may need to use same approach as for char
    // TODO: handle via COMPILER_DIRECTIVE
    dfaForLex.addOneOfMany("digit", "0123456789");

    /**
     * Add remaining terminals (those not char, digit or StringExpr) to the DFA
     */
    var terminalsToAdd = Object.keys(privateTerminals);
    terminalsToAdd.forEach(function (term) {
        if (privateLexerSymTab.isKeyword(term)) {
            // keywords will be scanned as Id, then compared to keywords in symbol table, so do not add to dfa
        } else {
            util.logD("term:", term, "kind:", privateTerminalKinds[term]);
            // TODO: handle via COMPILER_DIRECTIVE
            if (/* 'undefined' !== typeof privateTerminalKinds[term] */ 1 === 1
            && ( privateTerminalKinds[term] === 'digit'
            || privateTerminalKinds[term] === 'char'
            || privateTerminalKinds[term] === 'space'
            || privateTerminalKinds[term] === 'digitTERM'
            || privateTerminalKinds[term] === 'charTERM'
            || privateTerminalKinds[term] === 'spaceTERM'
            || privateTerminalKinds[term] === 'StringExprNT'
            )
            ) {
                // we already added this to DFA
            } else {
                dfaForLex.addTerm(term, term);
            }
        }
    });

    util.logD("our DFA:\n", dfaForLex.prettyString());
}; /* end generateDfaForLex */


    // TODO: read the next line and refactor or punt 
    // (note that this.bnf is already available to users, but perhaps should not be 
    this.doNotUseThis_getGrammarBNF = /*const */ function () { return myBNF_obj; };
    this.getGoalIndex = /*const */ function () { return goalIndex; };
    this.hasMemberHeadThat = function (/* String */ needle) { return (that.getIndexFor(needle) !== -1);  };
    this.getTerminals = function() {return privateTerminals;};
    this.getTerminalCharList = function() {return privateTerminalChars;};
    this.getTerminalPatternList = function() {return privateTerminalPatterns;};
    this.getNonTerminalList = function() {return privateNonTerminals;};
    this.getKeywords = function() {return privateKeywords;};
    this.getSymbolTable = function() {return privateLexerSymTab;};
    this.getLexerDFA = function() {return dfaForLex;};

    this.isTerminal = function(/* String */ candidate) {
        return ( 'undefined' !== typeof privateTerminals[candidate] );
    };
    this.isNonTerminal = function(/* String */ candidate) {
        return ( 'undefined' !== typeof privateNonTerminals[candidate] );
    };
    /**
     *
     * @param candidate
     * @returns {string} one of 'NonTerminal', 'TerminalPattern', 'Keyword' or 'Terminal'
     */
    this.grammarSymbolType = function(/* String */ candidate) {
        // First, two special cases due to lex behavior
        // COMPILER_DIRECTIVE
        if ('Id' === candidate) { return 'TerminalPattern'; }
        if ('StringExpr' === candidate) { return 'TerminalPattern'; }

        if (this.isNonTerminal(candidate)) { return 'NonTerminal'; }
        // TerminalPattern is a kind of NonTerminal
        if ( isTerminalPattern(candidate)) { return 'TerminalPattern'; }
        // Keyword is a kind of Terminal
        if (         isKeyword(candidate)) { return 'Keyword'; }
        // else if none of the above, must be a plain terminal
        // mostly punctuation () {} = == !=
        return ( 'Terminal' );
    };

    generateTerminalList();
    generateTerminalCharList();
    generateKeywordList();
    generateTerminalPatternAndNonTerminalLists();

//    var nextHead;
//    var
//    myBNF_obj.getd.forEach(function(prodSet){
//        if ( this.isNonTerminal(prodSet.headName) ) {}
//    });
//    var objectiveBNF = [];

    var generateObjectiveBNF = function (/**BNF*/ parsedBNF) {
        var ii, jj, kk;
        var bnfRef = parsedBNF.getBNF();                // TODO: is this another sign of need for refactor?
        var headCount = bnfRef.length;
        for (ii = 0; ii < headCount; ++ii) {
            var prodSet = bnfRef[ii];
    var a_tempType = that.grammarSymbolType(prodSet.headName);
            switch ( that.grammarSymbolType(prodSet.headName) ) {
                case 'NonTerminal':
                    prodSet.setHead( new NonTerminal(prodSet.headName) );
                    break;
                case 'TerminalPattern':
                    prodSet.setHead( new TerminalPattern(prodSet.headName) );
                    break;
                case 'Keyword':
                case 'Terminal':
                default:
                    // Hard to imagine how this could happen, but let's not ignore the possibility
                    throw new TypeError("Error 31: Grammar.generateObjectiveBNF says: invalid text [" +
                                        prodSet.headName + "] on LHS of BNF");
            }

            var prodSetLength = prodSet.rules.length;   // TODO: is this another sign of need for refactor?
            for (jj = 0; jj < prodSetLength; ++jj) {
                var gramSeq = prodSet.rules[jj];
                var gramSeqCount = gramSeq.length;
                /* TODO: add new empty Production */
                // we need to keep a handle for the new Production, so we can build it up below
                var newProd = new Production();
                prodSet.addProduction(newProd);

                if ( gramSeqCount === 0 ) {
                /* TODO: push an empty Production (array) to represent epsilon */
                }
                for (kk = 0; kk < gramSeqCount; ++kk) {
                    // either build up a Production one element at a time, then add in one step
                    //     OR append each element to the Production as we go.
            var a_gsText = gramSeq[kk];
            a_tempType = that.grammarSymbolType(gramSeq[kk]);
            //        switch ( that.grammarSymbolType(gramSeq[kk]) ) {
                    util.logC("Adding type", a_tempType, a_gsText, "to", ii, prodSet.headName, "rule", jj, "word", kk);
                    switch ( a_tempType ) {
                        case 'NonTerminal':
                            newProd.addGrammarSymbol( new NonTerminal(gramSeq[kk]) );
                            break;
                        case 'TerminalPattern':
                            newProd.addGrammarSymbol( new TerminalPattern(gramSeq[kk]) );
                            break;
                        case 'Keyword':
                            // TODO: need Terminal and (maybe) Keyword class/prototype/objects.
                            newProd.addGrammarSymbol( new Terminal(gramSeq[kk]) );
                            break;
                        case 'Terminal':
                            newProd.addGrammarSymbol( new Terminal(gramSeq[kk]) );
                            break;
                        default:
                            // Hard to imagine how this could happen, but let's not ignore the possibility
                            throw new TypeError("Error 31: Grammar.generateObjectiveBNF says: invalid text on RHS of BNF");
                    }


                }
            } /* end for jj */
        }
        // symTab.markLastKeyword();
    }; /* end generateObjectiveBNF */

    generateObjectiveBNF(myBNF_obj);

    privateLexerSymTab = new SymbolTable();
    addKeywordsToSymbolTable(myBNF_obj, privateLexerSymTab);
//    util.logC("lexSymTab:", privateLexerSymTab.prettyString());
    generateDfaForLex();


//  Just in case we need to punt and not use punctuation as a label for itself
//  var punctuationLabels = {
//      '$': 'EndProgram' ,
//      '{': 'braceL' ,
//      '}': 'braceR' ,
//      '(': 'parenL' ,
//      ')': 'parenR' ,
//      '=': 'assignment' ,
//      '"': 'doubleQuote' ,
//      '+': 'plus' ,
//  };

    // TODO: knowing what we do now, we can create an objectified BNF
    // Based on text analysis, build a new, object based BNF


    var msElapsed;
    msElapsed = uTimer() - startTime;
    // util.logC("End Grammar constructor.  Elapsed time (ms): ", msElapsed.toFixed(3), "\n for gram with nonTerms:\n", this.getNonTerminalList());
    util.logD("End Grammar constructor.  Elapsed time (ms): ", msElapsed.toFixed(3));
}

Grammar.prototype.hasMemberHead = function (/* String */ needle) { return (this.getIndexFor(needle) !== -1);  };


return Grammar;
 
});  // closure for the RequireJS define()