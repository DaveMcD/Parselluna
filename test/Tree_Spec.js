/**
 * @FILE Tree_Spec
 *   NOTE: with standard configuration, all files in test directory matching *Spec.js will be run by karma
 * Created by
 *   @AUTHOR David McDonald
 */

/* inform jshint not to warn that these jasmine functions are not defined */
/*global describe, it, xdescribe, xit, before, beforeEach, after, afterEach, expect, */
/* inform jshint not to warn that my logging shortcut functions are not defined */
/*global logC, logD */
define(['Tree', 'Token'], function (Tree, Token) {
    "use strict";
    // logD("enter Tree_Spec.js define()");

    describe("Tree", function () {   // outermost test suite
        beforeEach(function () {
            this.newForEachCalculated = 'top_level';
        });

        describe("(1) When asked, returns what was added", function () {
            var testTree = new Tree();
            testTree.addNode("Program", "branch");
            testTree.addNode("Block", "branch");
            testTree.addNode("{", "leaf");
            testTree.addNode("}", "leaf");
            testTree.endChildren();
            testTree.addNode("$", "leaf");
            testTree.endChildren();
//            beforeEach(function () {
//            });

            it("(1.1) should return root name", function () {
                var expected_result = 'Program';
                // logD("(1.1)Testing nested_answer");
                expect(testTree.root.name).toEqual(expected_result);
            });
            it("(1.2) should return names of children", function () {
                var expected_result0 = 'Block';
                var expected_result1 = '$';
                // logD("(1.1)Testing nested_answer");
                expect(testTree.root.children[0].name).toEqual(expected_result0);
                expect(testTree.root.children[1].name).toEqual(expected_result1);
            });

            it("(1.2) and should return names of grandchildren", function () {
                var expected_result0 = '{';
                var expected_result1 = '}';
                // logD("(1.1)Testing nested_answer");
                expect(testTree.root.children[0].children[0].name).toEqual(expected_result0);
                expect(testTree.root.children[0].children[1].name).toEqual(expected_result1);
            });

            it("(1.3) Tree.toString() should look treelike and match input", function () {
                var stringyTree = "<Program>\n-<Block>\n--[{]\n--[}]\n-[$]\n";
                // logD("(2) Top Level ");
                expect(testTree.toString()).toEqual(stringyTree);
            });
        });
        /* end (1) test suite subset */


    });
    /* end outermost test suite */

    // logD("leave Tree_Spec.js define()");
});
/* closure for RequireJS define() */