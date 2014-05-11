/**
 * @FILE webPageTestInputs
 * Created by
 * @AUTHOR David McDonald
 */

define([], function () {
    "use strict";
    // var modGlobal = {}; // is it really a global for this module, and hidden from world?

    /**
     *  Creates a new webPageTestInputs
     *  @constructor
     */
    function webPageTestInputs() { // constructor
        var that = this;        // "that" is used to make the object available to the private methods.
        //noinspection JSLastCommaInObjectLiteral
        this.grammarTests = {
            'default'    :
                "Program ::== Block $ \n" +
                "Block ::== { Statement } \n" +
                "Statement ::== PrintStatement \n" +
                "    ::== Block \n" +
                "PrintStatement ::== print ( Expr ) \n" +
                "Expr ::== digit \n" +
                "digit ::== 1 | 2 \n" +
                ""                ,
            'D O E'    :
                "G ::== E \n" +
                "E ::== D O E \n" +
                "::== D \n" +
                "D ::== 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 0  \n" +
                "O ::== + | - \n" +
                ""           ,
            'DOE Compact'    :
                "G ::== E \n" +
                "E ::== D O E | D \n" +
                "D ::== 0...4 | 5 ... 8 | 9  \n" +
                "O ::== + | - \n" +
                ""           ,
            'Final Project Grammar' :
                "Program ::== Block $ \n" +
                "Block ::== { StatementList } \n" +
                "StatementList ::== Statement StatementList \n" +
                "    ::== ε \n" +
                "Statement ::== PrintStatement \n" +
                "    ::== AssignmentStatement \n" +
                "    ::== VarDecl \n" +
                "    ::== WhileStatement \n" +
                "    ::== IfStatement \n" +
                "    ::== Block \n" +
                "PrintStatement ::== print ( Expr ) \n" +
                "AssignmentStatement ::== Id = Expr \n" +
                "VarDecl ::== type Id \n" +
                "WhileStatement ::== while BooleanExpr Block \n" +
                "IfStatement ::== if BooleanExpr Block \n" +
                "Expr ::== IntExpr \n" +
                "    ::== StringExpr \n" +
                "    ::== BooleanExpr \n" +
                "    ::== Id \n" +
                "IntExpr ::== digit intop Expr \n" +
                "    ::== digit \n" +
                "StringExpr ::== \" CharList \"  \n" +
                "BooleanExpr ::== ( Expr boolop Expr )  \n" +
                "    ::== boolval \n" +
                "Id ::== char \n" +
                "CharList ::== char CharList \n" +
                "    ::== space CharList \n" +
                "    ::== ε \n" +
                "type ::== int | string | boolean \n" +
                "char ::== a | b | c ... z \n" +
                "space ::== ' ' \n" +
                "digit ::== 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 0  \n" +
                "boolop ::== == | != \n" +
                "boolval ::== false | true \n" +
                "intop ::== + \n" +
                ""                ,

            'Print 1 or 2' :
                "Program ::== Block $ \n" +
                "Block ::== { Statement } \n" +
                "Statement ::== PrintStatement \n" +
                "    ::== Block \n" +
                "PrintStatement ::== print ( Expr ) \n" +
                "Expr ::== digit \n" +
                "digit ::== 1 | 2 \n" +
                ""                ,
        };

        /**
         * @description  get array of labels (for select options)
         * @returns      {Array} of label strings1
         */
        this.getGrammarTestLabels = function () {
            // var gramLabels = Object.keys(that.grammarTests);
            return Object.keys(that.grammarTests);
        };

        /**
         * @description  gets multi-line grammar
         * @param        {String} label for test case
         * @returns      {String} multi line grammar text
         */
        this.getGrammarTestCase = function (label) {
            return that.grammarTests[label];
        };


        //noinspection JSLastCommaInObjectLiteral
        this.compileTests = {
            'default'    :
            "{ print( 1 ) } $\n" +
            ""           ,
            '1 + 2'    :
                "1 + 2 \n" +
                ""           ,
            '-1+2-3+'    :
                "-1+2-3+\n" +
                ""           ,
            'Print 1'    :
                "{ print( 1 ) } $\n" +
                ""           ,
            'Final Project Grammar(pass): All Tokens'    :
                "{\n" +
                "  int i\n" +
                "  i = 0\n" +
                "  string s\n" +
                "  s = \"ima string\"\n" +
                "  boolean t\n" +
                "  t = true \n" +
                "  boolean f\n" +
                "  f = false \n" +
                "  while ( i != 2 ) { \n" +
                "    if ( i == 1 ) { \n" +
                "      print( \"last time\" ) \n" +
                "    } \n" +
                "    print( i ) \n" +
                "    print( s ) \n" +
                "    print( t ) \n" +
                "    print( f ) \n" +
                "    i = 1 + i \n" +
                "  }\n" +
                "} $\n" +
                ""           ,
        };

        /**
         * @description  get array of labels (for select options)
         * @returns      {Array} of label strings1
         */
        this.getCompileTestLabels = function () {
            // var compLabels = Object.keys(that.compileTests);
            return Object.keys(that.compileTests);
        };

        /**
         * @description  gets multi-line grammar
         * @param        {String} label for test case
         * @returns      {String} multi line grammar text
         */
        this.getCompileTestCase = function (label) {
            return that.compileTests[label];
        };
     } // end constructor

    return webPageTestInputs;

}); // closure for RequireJS
