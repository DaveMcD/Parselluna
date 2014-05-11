/**
 * @FILE DFA.js
 * Created by
 * @AUTHOR David McDonald
 */

define(['util'], function (util) {
    "use strict";
    var modGlobal = {}; // is it really a global for this module, and hidden from world?

    /**
     *  Creates a new DFA
     *  @constructor
     *  @param {Array}  [termList] optional array of things TBD for initialization
     */
    function DFA( termList ) { // constructor
        if (!(this instanceof DFA)) {
            alert("DFA constructor says: Please do not forget the 'new' when you call me.");
            return new DFA(termList);
        }
        if ('undefined' !== typeof termList) { alert("termList for DFA not yet supported"); }

        var that = this;        // "that" is used to make the object available to the private methods.
        this.dfat = [];         // make it an array
        this.START_STATE = 0;
        this.dfat[this.START_STATE] = [];      // with an empty array in 1st row
        modGlobal.dfat = this.dfat;      // this seems to give access to those that need it,
                                            // but we need to try the same for a non-this var.
        this.ERROR_STATE = 1;               // TODO: DONE propagate START_STATE and ERROR_STATE to replace 0's and 1's
        this.dfat[this.ERROR_STATE] = [];  // with an empty array in 2nd row with no exit
        this.labels = [];
        this.labelIndex = {};               // to help let multiple values for a kind share their accepting state
        var subChar;
        var nextRow;
//        var charCode;

        /**
         * @description  add a delimited sequence to DFA, and the label to be returned when matched
         * @param {String} label - text to be returned when terminal is accepted during lex
         * @param {String} start single delimiter char to start sequence only
         *      (string members after 1st position are ignored)
         * @param {String} sequenceChars  every character in string will be added as sequence candidates
         * @param {String} stop  single delimiter char to start sequence only
         *      (string members after 1st position are ignored)
         */
        this.addDelimitedSequence =
            function (/**String*/ label, /**String */ start, /**String*/ sequenceChars, /**String*/ stop) {
                var sequenceRow = that.dfat.length;
                // Delimited Sequence will be added at end of dfat
                // (other than the start char, which needs to be in state zero [obviously?])
                var sequenceLen = sequenceChars.length;
                var cc;
                // Verify that start char is not already in dfat[this.START_STATE]
                if ('undefined' === typeof this.dfat[this.START_STATE][start.charAt(0)]) {
                    that.dfat[this.START_STATE][start.charAt(0)] = sequenceRow;
                    that.dfat[sequenceRow] = [];    // setup empty array
                    // add repeating sequence, returning to same state.
                    for (cc = 0; cc < sequenceLen; ++cc) {
                        // TODO: consider warning if stop char is in sequence
                        //       If it is, we will just overwrite next state for stop char after loop completes
                        // TODO: consider warning if char already there (though since this is a new row,
                        //       this will only happen if caller put duplicate chars in the sequence.)
                        that.dfat[sequenceRow][sequenceChars.charAt(cc)] = sequenceRow;
                    }
                    that.dfat[sequenceRow][stop.charAt(0)] = sequenceRow + 1;
                    that.dfat[sequenceRow + 1] = [];            // no way out other than error
                    that.labels[sequenceRow + 1] = label;       // accept label
                    that.labelIndex = sequenceRow + 1;
                } else {
                    alert("Error 46: DFA.addDelimitedSequence says: start char '" +
                           start + "' already in use.  At this time only one DelimitedSequence" +
                          " can be used per start char");
                    // TODO: attempt to add appropriate entries.
                }
            };

        // next available index is 4

        /**
         * @description  add an unlimited sequence to DFA, and the label to be returned when matched
         * @param {String} label - text to be returned when terminal is accepted during lex
         * @param {String} sequenceChars  every character in string will be added as sequence candidates
         */
        this.addUnlimitedSequence =
            function (/**String*/ label, /**String*/ sequenceChars) {
                var startRow = that.START_STATE;
            //    var sequenceRow = 4;
                var sequenceRow = that.dfat.length;
                var sequenceLen = sequenceChars.length;
                var cc;
                that.dfat[sequenceRow] = [];    // setup empty array ???
                for (cc = 0; cc < sequenceLen; ++cc) {
                    if ('undefined' === typeof that.dfat[startRow][sequenceChars.charAt(cc)]) {
                        that.dfat[startRow]   [sequenceChars.charAt(cc)] = sequenceRow;
                        that.dfat[sequenceRow][sequenceChars.charAt(cc)] = sequenceRow;
                    } else {
                        alert("Error 47: DFA.addUnlimitedSequence says: character '" +
                        sequenceChars.charAt(cc) + "' already in use.  Character will NOT be added " +
                        "to DFA sequence" );
                        // TODO: attempt to add appropriate entries.
                        //       by following existing chains (probably keywords) to end and adding
                        //       new nextState that points to our sequence state.  Doable, but the
                        //       approach already implemented to accept any word, then check for
                        //       keyword and max length is already working.
                    }
                }
                that.labels[sequenceRow] = label;
                that.labelIndex = sequenceRow;
            };

        // next available index is 5

        /**
         * @description  add a group of chars, where one of the group will match,
         *               and the label to be returned when matched
         *               as implemented, works only when none of the chars have their start spot occupied
         * @param {String} label - text to be returned when terminal is accepted during lex
         * @param {String} manyChars  every character in string will be added as candidates
         */
        this.addOneOfMany =
            function (/**String*/ label, /**String*/ manyChars) {
                if ('string' !== typeof manyChars) {
                    throw new TypeError("DFA.addOneOfMany() requires label and manyChars (both strings)");
                }
                if ('string' !== typeof label) {
                    throw new TypeError("DFA.addOneOfMany() requires label and manyChars (both strings)");
                }
                var startRow = that.START_STATE;
            //    var sequenceRow = 4;
                var sequenceRow = that.dfat.length;     // This will be the accepting state, and dead end
                var sequenceLen = manyChars.length;     // TODO: rename sequenceLen and sequenceRow
                var cc;
                that.dfat[sequenceRow] = [];    // setup empty array ???
                for (cc = 0; cc < sequenceLen; ++cc) {
                    if ('undefined' === typeof that.dfat[startRow][manyChars.charAt(cc)]) {
                        that.dfat[startRow]   [manyChars.charAt(cc)] = sequenceRow;
                        // that.dfat[sequenceRow][manyChars.charAt(cc)] = sequenceRow;
                    } else {
                        alert("Error 47: DFA.addOneOfMany says: character '" +
                        manyChars.charAt(cc) + "' already in use.  Character will NOT be added " +
                        "to DFA " );
                        // TODO: attempt to add appropriate entries.
                        //       by following existing chains (probably keywords) to end and adding
                        //       new nextState that points to our sequence state.  Doable, but the
                        //       approach already implemented to accept any word, then check for
                        //       keyword and max length is already working.
                    }
                }
                that.labels[sequenceRow] = label;
                that.labelIndex = sequenceRow;
            };

        /**
         * @description  add a terminal to DFA, and the label to be returned when matched
         * @param {String} terminal valid terminal to be added to table
         * @param {String} label - text to be returned when terminal is accepted during lex
         */
        this.addTerm = function (label, terminal) {
            // TODO: DONE swap argument order, so that label is first as it is for other functions
            if ('string' !== typeof label) {
                throw new TypeError("DFA.addTerm() requires terminal and label");
            }
            if ('string' !== typeof terminal) {
                throw new TypeError("DFA.addTerm() requires terminal and label");
            }

            var termLen = terminal.length;
            var indexedTerminal = that.labelIndex[label];
            var ii;
            var curState = this.START_STATE;

            // TODO: figure out how to benefit from keeping labelIndex hash object
            //       for now, we just end up with a bunch of rows where one might do.
            for (ii = 0; ii < termLen; ++ii) {
                // TODO: handles only one char.  need loop (I think this todo is done)
                subChar = terminal.charAt(ii);

                if ('undefined' === typeof that.dfat[curState][subChar]) {
                    // not there yet, so we add the row at end and column (or hash)
                    nextRow = that.dfat.length;
                    that.dfat[nextRow] = [];
                    that.dfat[curState][subChar] = nextRow;
                    curState = nextRow;
                } else {
                    // alert("DFA.addTerm() does not yet support adding an overlapping terminal.  no action taken");
                    // TODO: confirm that this can be ignored for more than just our Grammar
                    //       it seems that it _IS_ actually supported.
                    util.logD("DFA.addTerm() found overlapping terminal [" + subChar + "] which is not yet supported.  no action taken");
                    nextRow = that.dfat[curState][subChar];     // instead of add at end, go to existing state
                    curState = nextRow;
                }

            }
            if ('undefined' === typeof that.labels[nextRow]) {
                that.labels[nextRow] = label;  // only add the accepting label after we have stored the entire terminal in DFA
                that.labelIndex = nextRow;  // ???

            } else {
                if (label === that.labels[nextRow]) {
                    util.logC("DFA.addTerm() found an existing acceptance label MATCHING: [" + label + "]");
                } else {
                    util.logC("DFA.addTerm() found an existing acceptance label [" + label + "] and it does NOT match: [" + that.labels[nextRow] + "]");
                }
            }
        }; /* end addTerm */

        /**
         * @description  get next state index for current state and char
         * @param {Number} curState which row (state) we are in now
         * @param {String} curChar - char to check next state
         * @returns      {Number} next state index or error
         */
        this.nextState = function (curState, curChar) {
            var next;
            if ('number' !== typeof curState) {
                throw new TypeError("DFA.nextState() requires curState and curChar");
            }
            if ('string' !== typeof curChar) {
                throw new TypeError("DFA.nextState() requires curStart and curChar");
            }
            if ( curChar.length === 0 ) {
                throw new TypeError("DFA.nextState() curChar is empty");
            }
            if ( curChar.length !== 1 ) {
                alert("WARNING: All characters other than first in [" +
                       curChar + "] will be ignored");
            }
            next = that.dfat[curState][curChar];
            if ( 'undefined' !== typeof next) {
                return next;
            } else {
                return -1;   // signal break.  let caller determine if this is error or accept
            }
        }; /* end nextState */


        /**
         * @description  get next state index for current state and char
         * @param {Number} someState which row (state) to check for acceptedLabel
         * @returns      {String} corresponding label (if defined)  otherwise, returns undefined
         */
        this.acceptedLabel = function (someState) {
            return that.labels[someState];  // can validly be undefined if someState is not an accepting state
        }; /* end acceptedLabel */


        /**
         * @description  get string representation of the dfat
         * @returns      {String} meaningful representation of dfat (versus Object: object)
         */
        this.dfat.toString = function () {
            var outString = '\n';
            var ii;
            var dfatRow, nxChar, nxState;
            for (ii = 0; ii < that.dfat.length; ++ii) {
                dfatRow = that.dfat[ii];
                outString += '[' + ii + ']: ' ;

                for (  nxChar in dfatRow) {
                    if (dfatRow.hasOwnProperty(nxChar)) {
                        nxState = dfatRow[nxChar];
                        outString += nxChar + ':' + nxState + ' ';
                    }
                }
                outString += '\n';
            }
            return outString;
        };

        /**
         * @description  get string representation of the dfa (with labels indicating acceptance)
         * @returns      {String} meaningful representation of dfa (versus Object: object)
         */
        this.prettyString = function () {
            var outString = '\n';
            var ii;
            var dfatRow, nxChar, nxState;
            for (ii = 0; ii < that.dfat.length; ++ii) {
                dfatRow = that.dfat[ii];
                outString += '{' + (that.labels[ii] || "N/A") + '} ' + '[' + ii + ']: ' ;

                for (  nxChar in dfatRow) {
                    if (dfatRow.hasOwnProperty(nxChar)) {
                        nxState = dfatRow[nxChar];
                        outString += nxChar + ':' + nxState + ' ';
                    }
                }
                outString += '\n';
            }
            return outString;
        };

    } // end constructor

    /**
     * @description  get some semi-secret? value
     * @returns      whatever was stashed in modGlobal
     */
    DFA.prototype.getModGlobal = /* const */ function (tag) {
        return modGlobal[tag];
    };

    /* DFA would have been in Global Namespace, but we wrapped in a module/define. */
    /* The stuff we return is our public interface */
    return DFA;

}); // closure for RequireJS
