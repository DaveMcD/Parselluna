/**
 * @FILE webPageInterface.js
 * this code factored out of HTML file.
 */

// using require() because there is something(init) we want executed immediately when loaded
require(   ['util', 'webPageTestInputs', 'Grammar', 'lexer', 'parse', 'ecotree', 'domReady', 'Symbol', 'SymbolTable', 'PullParser'],
    function(util,   webPageTestInputs,   Grammar,   lexer,   parse,  notECOTree, domReady, Symbol, SymbolTable, PullParser) {
// use below, if using deferred loading of (something like lexer)
// require(['require', 'util', 'parse'], function(require, util, parse) {
    "use strict";

// Global variables
// var errorCount = 0;

    var logC = util.logC;                   // take the default from util
    var logD = util.logD;                   // take the default from util
    //  logC = function(){};                // to silence console logging
    //  logC = console.log.bind(console);   // if we don't have the util version to glom onto
    var taMsg = util.addToMessage;
    // TODO: find better design pattern that does not need new input
    var pageTestInputs = new webPageTestInputs();
    var grammarForParse = {};

    logD("enter webPageInterface/require(require, util, parse(, lexer)), at top FOURTH");

    domReady(function () {
        logD('The DOM is ready before I happen FOURTH(plus)');
        init();
    });

    function init()
    {
        logD("in webPageInterface/init SIXTH ");
        document.getElementById("btnCompile").onclick = btnCompile_click;
        var btnGram = document.getElementById("btnReadGrammar");
        var taGram  = document.getElementById("taGrammar");
        btnGram.onclick = function() {
           if (btnGram.value === "Unlock Grammar") {
               btnGram.value = "Parse Grammar";
               taGram.readOnly = false;
               taGram.disabled = false;
           } else {
               /* btnGram.value === "Parse Grammar" */
               parseGrammar();
               btnGram.value = "Unlock Grammar";
               taGram.readOnly = true;
           }
        };
        logD("in webPageInterface/init, assigned onclick... } SEVENTH");

        document.getElementById('selectSource').onchange = processSelectSource;
        document.getElementById('selectGrammar').onchange = processSelectGrammar;
        populateSelect("selectSource", pageTestInputs.getCompileTestLabels());

        if ('undefined' !== pageTestInputs.getCompileTestCase('default') ) {
            document.getElementById('taSourceCode').value = "";
            taMsg('taSourceCode', pageTestInputs.getCompileTestCase('default') );
        }

        if ('undefined' !== pageTestInputs.getGrammarTestCase('default') ) {
            document.getElementById('taGrammar').value = "";
            taMsg('taGrammar', pageTestInputs.getGrammarTestCase('default') );
            parseGrammar();
        }
        populateSelect("selectGrammar", pageTestInputs.getGrammarTestLabels());

        // util.setMessageTextArea("taOutput");
        util.setMessageTextArea("taParseResults");

        // Draw sample tree at bottom of page
        // var treeDiv = document.getElementById("myParseTreeContainer");

        window.concreteTreeDisplay = CreateECOTree('concreteTreeDisplay',
                                                   'concreteTreeContainer', "#FFCCCC");
        window.abstractTreeDisplay = CreateECOTree('abstractTreeDisplay', 'abstractTreeContainer', "#77FF77");
        // or window.concreteTree = new ECOTree('concreteTree', 'myConcreteTreeContainer');
        // then configure, populate (with add), and window.concreteTree.UpdateTree();
    } /* end init */

        function resetGrammarParseOutput() {
            // Clear the text area message boxes.
            document.getElementById('taTypeResults').value = "";
            document.getElementById('taParseScope').value = "";
            document.getElementById('taParseCST').value = "";
            document.getElementById('taLexResults').value = "";
            document.getElementById('taLexOutput').value = "";
            document.getElementById('taParseAST').value = "";
            document.getElementById('taCode').value = "";
            // Set the initial values for our globals.
            //    errorCount = 0;
        }

    function parseGrammar()
    {
        // This is executed as a result of the usr pressing the
        // "readGrammar" button between the two text areas, above.
        // Note the <input> element's event handler: onclick="btnReadGrammar_click();
        // try/catch from http://www.w3schools.com/js/js_errors.asp
        try {
            resetCompilationOutput();
            resetGrammarParseOutput();
            taMsg('taTypeResults', "Grammar Analysis Started");
            var inGrammarString = document.getElementById("taGrammar").value;
            grammarForParse = new Grammar(inGrammarString);


            taMsg('taTypeResults', "Our list of terminals: ");
            taMsg('taTypeResults', Object.keys(grammarForParse.getTerminals()).toString() );
            taMsg('taTypeResults', "Our list of keywords: ");
            taMsg('taTypeResults', Object.keys(grammarForParse.getKeywords()).toString() );

            taMsg('taParseScope', "Our SymbolTable (containing keywords, kinds): ");
            taMsg('taParseScope', grammarForParse.getSymbolTable().prettyString());

            taMsg('taParseAST', "Our list of terminal (allowable) characters: ");
            taMsg('taParseAST', Object.keys(grammarForParse.getTerminalCharList()).toString() );
            taMsg('taParseAST', "\nOur list of terminal patterns: ");
            taMsg('taParseAST', Object.keys(grammarForParse.getTerminalPatternList()).toString() );
            taMsg('taParseAST', "\nOur list of non-Terminals: ");
            taMsg('taParseAST', Object.keys(grammarForParse.getNonTerminalList()).toString() );

            taMsg('taCode', "Our parsed grammar is: ");
            // var grammarBNF = grammarForParse.
            // TODO: read the next line and refactor or punt
            taMsg('taCode', grammarForParse.doNotUseThis_getGrammarBNF().prettyString() );
        }
        catch (uncaughtException) {
            var txt;
            txt="There was an error on this page in parseGrammar().\n\n";
            txt+="Error description: " + uncaughtException.message + "\n\n";
            txt+="Click OK to continue.\n\n";
            alert(txt);
        }
    }

    function resetCompilationOutput() {
        // Clear the message box.
        document.getElementById("taParseResults").value = "";
        // Set the initial values for our globals.
    //    errorCount = 0;
    }

    function btnCompile_click()
    {
      //  var tokenSequence;
        // This is executed as a result of the usr pressing the
        // "compile" button between the two text areas, above.
        // Note the <input> element's event handler: onclick="btnCompile_click();
        // Note that btnCompile_click is now assigned in init()
        resetCompilationOutput();
        resetGrammarParseOutput();      // clear the Grammar parse output also, as same fields are used for compile output

        util.putMessage("Compilation Started");

        // NOTE: there is no good reason to use delayed loading here, but...
        //      if this was a time consuming function, not always executed
        //      it might be worthwhile to do so (say, for example if compiling a compiler)
        // This method results in out of order execution, so in this example,
        // we want parse to also be inside the require closure.
        if ('undefined' === typeof lexer) {
            // lexer undefined, so we need to load it now (and call it lexerParam).
            /* var lexerVar = */
            require(["lexer"], function (lexerParam) {
                //// Error: Module name "2+3" has not been loaded yet for context: (if calling lexerVar)
                //// tokenSequence = lexerVar("2+3");
                logC("in webPageInterface reqP(lex).  calling lexerParam() TENTH!!!");
//                tokenSequence = lexerParam(document.getElementById("taSourceCode").value);
//                // logC("in webPageInterface reqP(lex).  after lexerParam() TENTH+!!!");
//                logC("Late Lex returned [" + tokenSequence + "]");
//                util.putMessage("Late Lex returned [" + tokenSequence + "]");
//
//                // . . . and parse!
//                parse(tokenSequence);  // for now, pass putMessage function to parse.
            });

            //// Error: Module name "1+2" has not been loaded yet for context: (if calling lexerVar)
            //// tokenSequence = lexerVar(document.getElementById("taSourceCode").value);
            //// Error: lexerParam is not defined: (if calling lexerParam)
            //// tokenSequence = lexerParam(document.getElementById("taSourceCode").value);
//        } else {
        }
            // lexer is defined, so we do not need to load it now.
            logC("in webPageInterface using outer req(lex).  calling lexer() NINTH");
            // Grab the tokens from the lexer . . .
        //    tokenSequence = lexer(document.getElementById("taSourceCode").value);
            // util.putMessage("Lex returned [" + tokenSequence + "]");
        //    taMsg("taParseResults", "Lex returned [" + tokenSequence + "]");

            // . . . and parse!
            // first with the old, simple way TODO: (soon to be eliminated once we have something useful from PullParser)
        //    parse(tokenSequence);
            // util.putMessage("rot13 of aNzM is [" + util.rot13("aNzM") + "]");
            // then parse with our grammar based pull parser
        var parser = new PullParser(grammarForParse);
        var parseMsg = { 'text': ''};
        // var parseOutput =
        parser.parseSource(document.getElementById("taSourceCode").value, parseMsg);

        taMsg("taLexOutput", "[\n" + parseMsg['text'] + "]");

        taMsg('taParseScope', "{ keywords/lexemes, kinds } ");
        taMsg('taParseScope', grammarForParse.getSymbolTable().prettyString());


//        }
    } /* end btnCompile_click */


    function processSelectSource() {
        var selectionText = this.options[this.selectedIndex].text;
    //    alert("processSelectSource is processing " + selectionText);
        document.getElementById('taSourceCode').value = "";
        taMsg('taSourceCode', pageTestInputs.getCompileTestCase(selectionText) );
    }

    function processSelectGrammar() {
        var selectionText = this.options[this.selectedIndex].text;
        // alert("processSelectGrammar is processing" + selectionText);

        document.getElementById('taGrammar').value = "";
        taMsg('taGrammar', pageTestInputs.getGrammarTestCase(selectionText) );
        parseGrammar();
    }

    /* derived from http://stackoverflow.com/questions/8674618/adding-options-to-select-with-javascript */
    function populateSelect(target, options){
        if( !Array.isArray(options) ) {
            alert('populateSelect says: options must be an array of strings');
            return false;
        }

        if (!target) {
            return false;
        }
        else {
            var optionCount = options.length;
            // var min = min || 0,
            //     max = max || min + 100;

            var select = document.getElementById(target);

            for (var ii = 0; ii < optionCount; ++ii){
                var opt = document.createElement('option');
                opt.value = options[ii];
                opt.innerHTML = options[ii];
                select.appendChild(opt);
            }
        }
        return true;
    }

    // var myTree = null;
    function CreateECOTree(myTreeVarName, myContainer, defaultNodeColor) {
        var newTree;

        newTree = new ECOTree(myTreeVarName, myContainer);
        newTree.config.nodeColor = defaultNodeColor || "#9999FF";
        // newTree.config.nodeColor = "#FFAAAA";
     //   newTree.config.colorStyle = ECOTree.CS_LEVEL;
        newTree.config.colorStyle = ECOTree.CS_NODE;
     //   newTree.config.nodeFill = ECOTree.NF_GRADIENT;
        newTree.config.nodeFill = ECOTree.NF_FLAT;
        newTree.config.useTarget = false;
        newTree.config.selectMode = ECOTree.SL_MULTIPLE;
        newTree.config.defaultNodeWidth = 65;
        newTree.config.defaultNodeHeight = 20;
        newTree.config.iSubtreeSeparation = 30;
        newTree.config.iSiblingSeparation = 20;
        newTree.config.iLevelSeparation = 30;
        newTree.add(1,  -1, '. (period)');
        newTree.add(2,   1, 'that',  80, 40, "#FF7777");
        newTree.add(3,   2, 'think',  -1, -1);
        newTree.add(4,   3, 'I',  90, 18);
        newTree.add(5,   2, 'shall', 120, 30);
        newTree.add(6,   5, 'I',  60, 60);
        newTree.add(7,   5, 'see');
        newTree.add(8,   7, 'never');
        // 9 not used...
        newTree.add(10,  1, 'poem');
        newTree.add(11, 10, 'A');
        newTree.add(12, 10, 'as');
        newTree.add(13, 12, 'lovely');
        newTree.add(14, 13, 'a');
        newTree.add(15, 13, 'tree');
        newTree.UpdateTree();

        return newTree;
    }


    // return init;
    logD("leave webPageInterface/require(), before calling our own init() FIFTH");
   // init();
});