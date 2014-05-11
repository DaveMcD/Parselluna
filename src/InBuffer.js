define([], function() {
// define('InBuffer', [], function() {
// we are module InBuffer.  We have no dependencies.  If first param not specified, our module name comes from file name.

// http://stackoverflow.com/questions/1441212/javascript-instance-functions-versus-prototype-functions
// jsdoc tags listed at https://code.google.com/p/jsdoc-toolkit/wiki/TagReference
"use strict";

/**
 *  Creates a new InBuffer
 *  @constructor 
 *  @param {String} text The (multi-line) string of source to be buffered.
 *  @param {String} sourceInfo description of source (file name, input field, etc
 */ 
function InBuffer(/** @String*/ text, /** @String */ sourceInfo) { // constructor
    var that = this;        // "that" is used to make the object available to the private methods.
    this._sourceCode = text || "";
    this._lineNum    = 0;       // even programmers start counting lines at ONE, so we will add 1 if they ask
    this._lineCol    = 0;       // 
    this._sourceLabel = sourceInfo || "";
    this._lines      = this._sourceCode.split("\n");
    this._lastLineNum   = this._lines.length - 1;
    this._peeksPastEnd = 0;

   
    this.readThat = function() {
        // might be OK when there are no params, but what if there are params ???  (see bind/call/apply)
        // we need this wrapper so that when invoked by callback, context can be provided to that.read()
        // (callback used by js test driver assertException and assertNoException)
        // when specifying the unwrapped prototype function, the callback is invoked without this. context
        return that.read();
    };

    this.peekThat = function() {
        // see comments for readThat (above)
        return that.peek();
    };
    
    this.lineTextThat = function(/**Number*/ rowNumber) {
        // see comments for readThat (above)
        // return lineText.apply(that, arguments);
        return that.lineText(rowNumber);
    };
    
} // end constructor

    /**
	 * @description  To see if there is any input remaining
     * @author       David McDonald
     * @returns      {boolean} True if we are not at end of input
     */
    InBuffer.prototype.inputRemaining = /* const */ function() {
        // aliases, for improved readability 
        var row = this._lineNum;
        var lastRow = this._lastLineNum;
        var col = this._lineCol;
        // curLine might blow up, or become undefined, so wait to set it.
        var curLine;
        
        if ( (row < lastRow) ) { return true;  }
        if ( (row > lastRow) ) { return false; }
        // row === lastRow aka lineNum === lastLine
        curLine = this._lines[row];
        return (col < curLine.length);   // return true if not at end of last line
    };
    

    /**
	 * @description  peek at next character, but do not consume it.
     * @throws       RangeError if peeking past end of input
     * @returns      {String} of length 1, containing next character
     */
    InBuffer.prototype.peek = function() {
        // consider throwing exception if caller peeks past end twice,
        // because they might have gotten into an infinite loop, which is rather rude
        if ( this._peeksPastEnd > 0 ) {
            this._peeksPastEnd++;
            throw new RangeError("In InBuffer.peek(), multiple peeks past end");
        }

        // aliases, for improved readability 
        var row = this._lineNum;
        var lastRow = this._lastLineNum;
        var col = this._lineCol;
        // curLine might blow up, or become undefined, so wait to set it.
        var curLine;
        var retChar;
        
        if ( (row > lastRow + 1) ) {
            throw new RangeError("In InBuffer.peek(), somebody is trying to peek past End of Source");
        }

        curLine = this._lines[row];

        if ( this.inputRemaining() ) { 
            if (col == curLine.length) {
                retChar = "\n";
            } else {
                retChar = curLine.charAt(col);
            }
        } else {
            retChar = "";               // set EOF = -1 somewhere.  empty string seems equally valid. ??? ponder a bit...
            this._peeksPastEnd++;       // track peeks past end to help caller avoid infinite loop
        }
        return retChar;
        // return this._lines[this._lineNum][this._lineCol];
		// or maybe return this._lines[this._lineNum].charAt(this._lineCol);
    };
    
    // get (and consume) next character  
    /**
	 * @description  get (and consume) next character.  First read at end returns "".  After that, throws error
     * @throws       RangeError if reading past end of input
     * @returns      {String} of length 1, containing next character
     * @example
     * while ( src.inputRemaining() ) { inChar = src.read(); }
     * @example
     * inChar = src.read();
     * if ( 0 === inChar.length ) { /* handle end of input *\/ }
     */
    InBuffer.prototype.read = function() {
        var retChar = "";
        // Throw exception if caller reads past end twice,
        // because they might have gotten into an infinite loop
        if ( (this._lineNum > this._lastLineNum /* + 1 */) ) {
            throw new RangeError("In InBuffer.read(), somebody is trying to read past End of Source");
        }

        if ( !this.inputRemaining() ) {
            this._lineNum += 1; // we are now pointing (way) past the end
            return retChar; 
        }
        // be aware of various CR/LF versions
        // we need for caller to be able to know we are on a new line (mainly for when handling quotes)
        
        if (this._lineCol >= this._lines[this._lineNum].length) {
            // ??? we are at end of line.  return first char from next line
            // ??? maybe return a "\n"
            // retChar = this._lines[this._lineNum][this._lineCol]
            retChar = "\n";
            this._lineNum += 1;
            this._lineCol  = 0;
        } else {
            // we still have a char on current line
            retChar = this._lines[this._lineNum][this._lineCol];
            this._lineCol += 1;
        }

        return retChar;
    };

    /**
	 * @description  skips over any white space characters ( space, tab, newline ) and positions at next non-WS or at end
     * @returns      {InBuffer} in case this can be usefully chained.
     */
    InBuffer.prototype.skipWhiteSpace = function() {
        while ( this.inputRemaining() && this.peek().match(/[\s\t\n]/) ) {
            this.read(); 
        }
        return this;
    };
 
    /**
	 * @description  reports row number for next char to be read
     * @returns      {Number} with Row Number of next char
     * @example
     * WARNING: If we are at end of input, this might be past end
     * @example
     * WARNING: maybe we don't need this function, and instead need "whereDidIJustRead"
     */
    InBuffer.prototype.row  = /* const */ function() { return this._lineNum + 1; };

    /**
	 * @description  reports column number for next char to be read
     * @returns      {Number} with Col Number of next char
     * @example
     * WARNING: If we are at end of input, this might be past end
     * @example
     * WARNING: maybe we don't need this function, and instead need "whereDidIJustRead"
     */
     InBuffer.prototype.col      = /* const */ function() { return this._lineCol + 1; };

    /**
	 * @description  reports [row, col, source] for next char to be read
     * @returns      {Array} with row, column and source of next char
     * @example
     * WARNING: If we are at end of input, this might be past end
     */
     InBuffer.prototype.pos      = /* const */ function()     { 
        var returnPos = [];     /* [number, number, string] */
        returnPos[0] = this._lineNum + 1;   
        returnPos[1] = this._lineCol + 1;
        returnPos[2] = this._sourceLabel;
		return returnPos; 
	 };
     
     /**
	 * @description  get (but do not consume) specified line
     * @throws       TypeError if num is not a number 
     * @throws       RangeError if num < 0 or last < num
     * @returns      {String} of length 1, containing next character
     */
    InBuffer.prototype.lineText = /* const */ function(/**Number*/ rowNumber) {
        if ( (arguments.length != 1) || ("number" !== typeof rowNumber) ) {
            throw new TypeError("lineText REQUIRES a row number"); 
        }
        // [num - 1] because we count from zero internally, but interface counts from 1
        var row = rowNumber - 1;
        // Reject out of range (including negative) numbers
        if ( (row < 0) || (this._lastLineNum < row) ) {
            throw new RangeError("in lineText rowNumber (" +
                                  rowNumber + ")was out of bounds.  Max is: " + (this._lastLineNum + 1));
        }
        return this._lines[row]; // This probably returns undefined when calling inBuf.lineText(1.5)
    };

    // probably best not to mix nextLine and next on same pass through source.
    // should we have same behaviour as .read(), and return an empty string once at end of input?
    // sadly, that really isn't an option, because a blank line might be valid input.
    // we might also need a .setToBeginning() function.
	// we might also need a .peekLine() function (so readBNF can see if next line starts with ::==, i.e. still same head
   /**
	 * @description  get (and consume) current line.  Do NOT intermingle with .read()
     * @author       David McDonald
     * @throws       RangeError if reading past end of input
     * @returns      {String} of length 1, containing next character
     * @example
     * WARNING: Do NOT intermingle readLine and read
     */
    InBuffer.prototype.readLine = function() { 
        if ( this.inputRemaining() ) {
            return this._lines[this._lineNum++];
        } else {
            throw new RangeError("In InBuffer.readLine(), somebody is trying to read past End of Source"); 
        }       
    };
    
    /* InBuffer would have been in Global Namespace, but we wrapped in a module/define. */
    return InBuffer;

}); // closure for RequireJS
    