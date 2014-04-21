/**
 * @FILE util.js
 * Utility functions trim, rot13, logC, putMessage
 */

// using define() because there is nothing here we want executed immediately when loaded
// we have no dependencies, so just have function() with no parameters
define(function() {
    "use strict";
// logC : either an alias for console.log() or a no-op that silences any messages logC is passed.
// from http://stackoverflow.com/questions/5133649/alias-to-chrome-console-log
//    var logD = console.log.bind(console);   // define alias util.logD() for 'debug' console.log()
    var logD = function(){};             // swap comment/uncomment with prev to toggle 'debug' console logging
    var logC = console.log.bind(console);   // define alias util.logC() for console.log()
// var logC = function(){};             // swap comment/uncomment with prev to toggle console logging

    logD("enter util.js define( no dependencies)");


    function trim(str) {      // Use a regular expression to remove leading and trailing spaces.

        return str.replace(/^\s+ | \s+$/g, "");
        /*
        Huh?  Take a breath.  Here we go:
        - The "|" separates this into two expressions, as in A or B.
        - "^\s+" matches a sequence of one or more whitespace characters at the beginning of a string.
        - "\s+$" is the same thing, but at the end of the string.
        - "g" makes is global, so we get all the whitespace.
        - "" is nothing, which is what we replace the whitespace with.
        */

    }


    function rot13(str) {   // An easy-to understand implementation of the famous and common Rot13 obfuscator.
                            // You can do this in three lines with a complex regular expression, but I'd have
        var retVal = "";    // trouble explaining it in the future.  There's a lot to be said for obvious code.

        var strLen = str.length;
        /* for (var ii in str) */  // should have hasOwnProperty check, so just use index.
        for (var ii = 0; ii < strLen; ++ii)
        {
            var ch = str.charAt(ii);
            var code = 0;
            if ("abcedfghijklmABCDEFGHIJKLM".indexOf(ch) >= 0)
            {
                code = str.charCodeAt(ii) + 13;  // It's okay to use 13.  It's not a magic number, it's called rot13.
                retVal = retVal + String.fromCharCode(code);
            }
            else if ("nopqrstuvwxyzNOPQRSTUVWXYZ".indexOf(ch) >= 0)
            {
                code = str.charCodeAt(ii) - 13;  // It's okay to use 13.  See above.
                retVal = retVal + String.fromCharCode(code);
            }
            else
            {
                retVal = retVal + ch;
            }
        }
        return retVal;
    }

    var messageAreaID;
    var messageAreaHandle;
    function putMessage(msgString) {
        if ('undefined' === typeof messageAreaHandle) {
            /* when using Karma as test-runner, alert() is converted */
            /* to (something like) console.log() */
            // alert("messageArea has not been initialized.  Call setMessageTextArea(id) first");
            logD("messageArea has not been initialized.  Call setMessageTextArea(id) first");
        } else {
            messageAreaHandle.value += msgString + "\n";
        }
        logC("Msg> " + msgString);
    }

    /*
     * returns a hash of first and last index for each first char in strings
     */
    function indexFL(sortedStringArray) {
        // if( Object.prototype.toString.call( sortedStringArray ) !== '[object Array]' ) {
        if( !Array.isArray(sortedStringArray) ) {
            alert( 'Hey, where is the Array?' );
            // console.log("addRule got an array.  hurray");
            // reverse this logic, and throw error if not array
            throw new TypeError("util.indexFL: sortedStringArray is not an array");
        }

        var firstCharIndex = {};
        var arr = sortedStringArray;
        var len = sortedStringArray.length;
        var firstChar = "";
        var priorChar = "";
        var ii;
        if (len < 2) {
            if (len < 1) {
                logC("util.indexFL: useless zero length index returned");
            } else {
                firstChar = arr[0].charAt(0);
                firstCharIndex[firstChar] = [0, 0];
            }
            return firstCharIndex;
        }
        // now we know there are two or more strings in array, so this will be safe.
        for (ii = 0; ii < len - 1; ++ii) {
            if (arr[ii] >= arr[ii+1]) { throw new Error("non-sorted (or with duplicates) array passed to util.indexFL")};
        }

        firstChar = arr[0].charAt(0);
        firstCharIndex[firstChar] = [0, 0];
        priorChar = firstChar;
        for (ii = 0; ii < len; ++ii) {
            firstChar = arr[ii].charAt(0);
            if (firstChar === priorChar) {
                // update lastIndex for this initial char
                firstCharIndex[firstChar][1] = ii;
            } else {
                firstCharIndex[firstChar] = [ii, ii];
            }
            priorChar = firstChar;
        }

        return firstCharIndex;
    }

    function setMessageTextArea(taIdString) {
        messageAreaID = taIdString;
        messageAreaHandle   = document.getElementById(taIdString);
    }

    function addToMessage(textAreaID, msgString) {
        var taHandle;
        taHandle = document.getElementById(textAreaID);
        if ('undefined' === typeof taHandle) {
            logC("textArea", textAreaID,  "not defined");
        } else {
            taHandle.value += msgString + "\n";
        }
        logC("Msg> " + msgString);
    }


    logD("leave util.js define( no dependencies), returning function references FIRST");
    return { trim: trim, rot13: rot13, logC: logC, logD: logD, indexFL: indexFL,
        setMessageTextArea: setMessageTextArea, putMessage: putMessage,
        addToMessage: addToMessage};

}); // closure for requirejs define()
