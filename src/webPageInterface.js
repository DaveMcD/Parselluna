/**
 * @FILE webPageInterface.js
 * this code factored out of HTML file.
 */

// using require() because there is something(init) we want executed immediately when loaded
require(['util', 'lexer', 'parse', 'ecotree', 'domReady'], function(util, lexer, parse, notECOTree, domReady) {
// require(['util', 'lexer', 'parse', 'domReady'], function(util, lexer, parse, domReady) {
// use above, if not using deferred loading of lexer
// use below, if using deferred loading of lexer
// require(['require', 'util', 'parse'], function(require, util, parse) {
// require(['require', 'util', 'parse'], function(requireParam, util, parse) {
    "use strict";

// Global variables
// var errorCount = 0;

    var logC = util.logC;                   // take the default from util
    var logD = util.logD;                   // take the default from util
    //  logC = function(){};                // to silence console logging
    //  logC = console.log.bind(console);   // to restore console logging

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
        btnGram.onclick = function() {
           if (btnGram.value === "Unlock Grammar") {
               btnGram.value = "Parse Grammar";
               btnGram.disabled = false;
           } else {
               btnGram.value = "Unlock Grammar";
               btnGram.disabled = true;
               alert("Woot!  Grammar has been fake parsed, and locked again.");
           }
        };
        logD("in webPageInterface/init, assigned onclick... } SEVENTH");
        // util.setMessageTextArea("taOutput");
        util.setMessageTextArea("taParseResults");

        // Draw sample tree at bottom of page
        // var treeDiv = document.getElementById("myParseTreeContainer");

        window.concreteTreeDisplay = CreateECOTree('concreteTreeDisplay',
                                                   'concreteTreeContainer', "#FFCCCC");
        window.abstractTreeDisplay = CreateECOTree('abstractTreeDisplay', 'abstractTreeContainer', "#77FF77");
        // or window.concreteTree = new ECOTree('concreteTree', 'myConcreteTreeContainer');
        // then configure, populate (with add), and window.concreteTree.UpdateTree();

    }


    function resetCompilation() {
        // Clear the message box.
        document.getElementById("taParseResults").value = "";
        // Set the initial values for our globals.
    //    errorCount = 0;
    }


    function btnCompile_click()
    {
        var tokenSequence;
        // This is executed as a result of the usr pressing the
        // "compile" button between the two text areas, above.
        // Note the <input> element's event handler: onclick="btnCompile_click();
        // Note that btnCompile_click is now assigned in init()
        resetCompilation();

        util.putMessage("Compilation Started");

        // NOTE: there is no good reason to use delayed loading here, but...
        //      if this was a time consuming function, not always executed
        //      it might be worthwhile to do so (say, for example if compiling a compiler)
        // This method results in out of order execution, so in this example,
        // we want parse to also be inside the requireParam closure.
        if ('undefined' === typeof lexer) {
            // lexer undefined, so we need to load it now (and call it lexerParam).
            /* var lexerVar = */
            // requireParam(["lexer"], function (lexerParam) {
            require(["lexer"], function (lexerParam) {
                //// Error: Module name "2+3" has not been loaded yet for context: (if calling lexerVar)
                //// tokenSequence = lexerVar("2+3");
                logC("in webPageInterface reqP(lex).  calling lexerParam() TENTH!!!");
                tokenSequence = lexerParam(document.getElementById("taSourceCode").value);
                // logC("in webPageInterface reqP(lex).  after lexerParam() TENTH+!!!");
                logC("Late Lex returned [" + tokenSequence + "]");
                util.putMessage("Late Lex returned [" + tokenSequence + "]");

                // . . . and parse!
                parse(tokenSequence);  // for now, pass putMessage function to parse.
            });

            //// Error: Module name "1+2" has not been loaded yet for context: (if calling lexerVar)
            //// tokenSequence = lexerVar(document.getElementById("taSourceCode").value);
            //// Error: lexerParam is not defined: (if calling lexerParam)
            //// tokenSequence = lexerParam(document.getElementById("taSourceCode").value);
        } else {
            // lexer is defined, so we do not need to load it now.
            logC("in webPageInterface using outer req(lex).  calling lexer() NINTH");
            // Grab the tokens from the lexer . . .
            tokenSequence = lexer(document.getElementById("taSourceCode").value);
            util.putMessage("Lex returned [" + tokenSequence + "]");

            // . . . and parse!
            parse(tokenSequence);
            // util.putMessage("rot13 of aNzM is [" + util.rot13("aNzM") + "]");
        }
    } /* end btnCompile_click */

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