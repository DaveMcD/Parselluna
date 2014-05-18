/**
 * @FILE Tree
 * Created by
 * @AUTHOR David McDonald
 *
 * Derived from treeDemo.js by Alan G. Labouseur (in turn, basedon 2009 work by Michael Ardizzone and Tim Smith)
 */

define(['Token'], function (Token) {
    "use strict";
    // var modGlobal = {};     // global for this module, hidden from outside enclosure

    /**
     *  Creates a new Tree
     *  @constructor
     */
    function Tree() { // constructor
        if (!(this instanceof Tree)) {
            alert("Warning 60: Tree constructor says: Please do not forget the 'new' when you call me.");
            return new Tree();
        }
        var that = this;        // "that" is used to make the object available to the private methods.
//        var privateValue1 = arg1 || "default1";
//        this.publicValue2 = arg2 || "default2";
//-----------------------------------------
// treeDemo.js
//
// By Alan G. Labouseur, based on the 2009
// work by Michael Ardizzone and Tim Smith.
//-----------------------------------------

            // ----------
            // Attributes
            // ----------

            this.root = null;  // Note the NULL root node of this tree.
            this.cur = {};     // Note the EMPTY current node of the tree we're building.


            // -- ------- --
            // -- Methods --
            // -- ------- --

            // Add a node: kind in {branch, leaf}.
            this.addNode = function(name, kind) {
                // Construct the node object.
                var node = { name: name,
                    children: [],
                    parent: {}
                };

                // Check to see if it needs to be the root node.
                if ( (this.root == null) || (!this.root) )
                {
                    // We are the root node.
                    this.root = node;
                }
                else
                {
                    // We are the children.
                    // Make our parent the CURrent node...
                    node.parent = this.cur;
                    // ... and add ourselves (via the unfrotunately-named
                    // "push" function) to the children array of the current node.
                    this.cur.children.push(node);
                }
                // If we are an interior/branch node, then...
                if (kind == "branch")
                {
                    // ... update the CURrent node pointer to ourselves.
                    this.cur = node;
                }
            };

            // Note that we're done with this branch of the tree...
            this.endChildren = function() {
                // ... by moving "up" to our parent node (if possible).
                if ((this.cur.parent !== null) && (this.cur.parent.name !== undefined))
                {
                    this.cur = this.cur.parent;
                }
                else
                {
                    // TODO: Some sort of error logging.
                    // This really should not happen, but it will, of course.
                }
            };

            // Return a string representation of the tree.
            this.toString = function() {
                // Initialize the result string.
                var traversalResult = "";

                // Recursive function to handle the expansion of the nodes.
                function expand(node, depth)
                {
                    var ii;     // i was declared twice below.  instead, we declare it 'twice' here :)
                    // Space out based on the current depth so
                    // this looks at least a little tree-like.
                    for (ii = 0; ii < depth; ++ii)
                    {
                        traversalResult += "-";
                    }

                    // If there are no children (i.e., leaf nodes)...
                    if (!node.children || node.children.length === 0)
                    {
                        // ... note the leaf node.
                        traversalResult += "[" + node.name + "]";
                        traversalResult += "\n";
                    }
                    else
                    {
                        // There are children, so note these interior/branch nodes and ...
                        traversalResult += "<" + node.name + ">\n";
                            // On the above line, there used to be a space between > and \n
                            //      Better NOT to have the space, as it creates invisible trailing output
                            //      that makes setting up test cases more difficult
                        // .. recursively expand them.
                        for (ii = 0; ii < node.children.length; ++ii)
                        {
                            expand(node.children[ii], depth + 1);
                        }
                    }
                }
                // Make the initial call to expand from the root.
                expand(this.root, 0);
                // Return the result.
                return traversalResult;
            };
    } // end constructor

    /**
     * @description  a prototype function (one copy per class, not per object)
     * @returns      {boolean} True if something
     */
    Tree.prototype.isSomething = /* const */ function () {
        return (true);   // return true if ...
    };


    /**
     * @description  get publicValue2
     * @returns      {String} containing publicValue2
     */
    Tree.prototype.getPublicValue2 = /* const */ function () {
        return this.publicValue2;
    };


    /**
     * @description  sets publicValue2
     * @param {String} newArg2 description of param
     * @throws       Error if called with invalid argument
     * @example
     * WARNING: throwme in throws me out.
     */
    Tree.prototype.setPublicValue2 = function (/** @String */ newArg2) {
        if (newArg2 === 'throwme') throw new Error("Bad newArg2 [" + newArg2 + "]");
        this.publicValue2 = newArg2;
    };

    return Tree;     // return Tree constructor to RequireJS

}); // closure for RequireJS define()
