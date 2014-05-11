/**
 * @FILE InBuffer_Spec
 * by default, all files in test directory matching *Spec.js will be run by karma
 */

/* inform jshint not to warn that these jasmine functions are not defined */
/*global describe, it, before, beforeEach, after, afterEach, expect, */
/* inform jshint not to warn that my logging shortcut functions are not defined */
/*global logC, logD */
define(['InBuffer'], function(InBuffer) {
    "use strict";
    // logD("enter InBuffer_Spec.js define()");

    // TODO Test multiple blank lines in middle and at end
    describe("InBuffer", function () {

        beforeEach(function () {
            this.inputText = "First Line\nSecond Line\n";
            this.source = new InBuffer(this.inputText);
        });
        afterEach(function () {
            delete this.inputText;
            delete this.source;
        });

        describe("(1) handles empty buffer correctly", function () {
            // var noSource = new InBuffer("");
            // var inCharEmpty;
            beforeEach(function () {
                this.noSource = new InBuffer("");
            });

            it("(1.1) should have no inputRemaining", function () {
                expect(this.noSource.inputRemaining()).toBe(false);
            });

            it("(1.2a) read from empty source is defined (but zero length)", function () {
                var inCharEmpty = this.noSource.read();      // read_that fails with TypeError
                expect(inCharEmpty).toBeDefined();
                expect(inCharEmpty.length).toBe(0);
                expect(inCharEmpty).toBe("");
            });

            it("(1.2b) peek from empty source is defined (but zero length)", function () {
                var inCharEmpty = this.noSource.peek();      // read_that fails with TypeError
                expect(inCharEmpty).toBeDefined();
                expect(inCharEmpty.length).toBe(0);
                expect(inCharEmpty).toBe("");
            });

            it("(1.3) should NOT throw exception on first peek past end of input", function () {
                expect(this.noSource.peekThat.bind(this)).not.toThrow();
                // assertNoException("inb.1.5 Should NOT throw exception on first peek past end of input", noSource.peekThat);
                // TODO: confirm that allowing just one extra peek is forgiving enough.
            });

            it("(1.4) should throw exception on second peek past end of input", function () {
                // noSource = new InBuffer("");
                this.noSource.peek();
                expect(this.noSource.peekThat.bind(null)).toThrow("In InBuffer.peek(), multiple peeks past end");
                //  assertException("inb.1.6 Should throw exception on second peek past end of input", noSource.peekThat, "RangeError" );
            });

            it("(1.5) should throw exception when past end of input", function () {
                // noSource =  new InBuffer("");
                var charIn;
                expect(this.noSource.inputRemaining()).toBe(false);
                charIn = this.noSource.read();
                expect(this.noSource.readThat.bind(null)).toThrow("In InBuffer.read(), somebody is trying to read past End of Source");
              //  expect(noSource.peekThat.bind(null)).toThrow("In InBuffer.peek(), multiple peeks past end");
                //  assertException("inb.1.7 Should throw exception when past end of input", noSource.readThat, "RangeError" );
            });
        }); /* end subset (1) */

        describe("(2) has expected initial conditions [not independent]", function () {
            // source will be shared between test cases
            var source = new InBuffer("First Line\nSecond Line\n");

            it("(2.1a) should start at 1,1 first char F", function () {
                expect(source.row()).toEqual(1);
                expect(source.col()).toEqual(1);
                expect(source.pos()).toEqual([1,1, ""]);
                expect(source.peek()).toEqual('F');
            });

            it("(2.1b) peek does not change input, read increments pos", function () {
                expect(source.peek()).toEqual('F');
                expect(source.read()).toEqual('F');

                expect(source.row()).toEqual(1);
                expect(source.col()).toEqual(2);
                expect(source.pos()).toEqual([1,2, ""]);
                expect(source.peek()).toEqual('i');
            });

        }); /* end subset (2) */

        describe("(3) lines can be read char by char [not independent]", function () {
            var source = new InBuffer("First Line\nSecond Line\n");

            it("(3.1) characters read should match First Line", function () {
                var nextChar;
                var lineString = "";

                // && not endOfLine  for now, just have source return newLine
                while ( source.inputRemaining() && ( "\n" != (nextChar = source.read()) ) ) {
                    lineString += nextChar;
                }
                expect(lineString).toEqual('First Line');
            });

            it("(3.2) position should be at start of second row", function () {
                // expect(lineString).toEqual('First Line');
                expect(source.row()).toEqual(2);
                expect(source.col()).toEqual(1);
            });

            it("(3.3) Second Line matches input", function () {
                var nextChar;
                var lineString = "";

                // && not endOfLine  for now, just have source return newLine
                while ( source.inputRemaining() && ( "\n" != (nextChar = source.read()) ) ) {
                    lineString += nextChar;
                }
                expect(lineString).toEqual('Second Line');
            });

            it("(3.4) position should be at start of 3rd row and EOF", function () {
                expect(source.row()).toEqual(3);
                expect(source.col()).toEqual(1);
                expect(source.inputRemaining()).toEqual(false);
            });
        }); /* end subset (3) */

        describe("(4) last line does not need newline [not independent]", function () {
            var lastLine = 'Last Line';
            var source = new InBuffer("First Line\n" + lastLine);

            it("(4.1) characters read should match First Line", function () {
                var nextChar;
                var lineString = "";

                // && not endOfLine  for now, just have source return newLine
                while ( source.inputRemaining() && ( "\n" != (nextChar = source.read()) ) ) {
                    lineString += nextChar;
                }
                expect(lineString).toEqual('First Line');
            });

            it("(4.2) position should be at start of second row", function () {
                expect(source.row()).toEqual(2);
                expect(source.col()).toEqual(1);
            });

            it("(4.3) Second (Last) line matches input", function () {
                var nextChar;
                var lineString = "";

                // && not endOfLine  for now, just have source return newLine
                while ( source.inputRemaining() && ( "\n" != (nextChar = source.read()) ) ) {
                    lineString += nextChar;
                }
                expect(lineString).toEqual(lastLine);
            });

            it("(4.4) position should be past end of 2nd row and at EOF", function () {
                expect(source.row()).toEqual(2);
                expect(source.col()).toBe(lastLine.length + 1);
                expect(source.inputRemaining()).toEqual(false);
            });
        }); /* end subset (4) */

        it("(5a) reads entire lines when asked", function () {
            var source = new InBuffer("First Line\nSecond Line\n");
            var myLine;

            myLine    = source.readLine();
            expect(myLine).toBe('First Line');
            myLine    = source.readLine();
            expect(myLine).toBe('Second Line');
            expect(source.inputRemaining()).toEqual(false);
        }); /* end spec (5a) */

        it("(5b) and does not care if last line has newline", function () {
            var source = new InBuffer("First Line\nSecond Line");
            var myLine;

            myLine    = source.readLine();
            expect(myLine).toBe('First Line');
            myLine    = source.readLine();
            expect(myLine).toBe('Second Line');
            expect(source.inputRemaining()).toEqual(false);
        }); /* end spec (5b) */

        it("(6a) will tell us the text for a given line", function () {
            var source = new InBuffer("First Line\nSecond Line");
            var myLine;

            myLine    = source.lineText(1);
            expect(myLine).toBe('First Line');
            myLine    = source.lineText(2);
            expect(myLine).toBe('Second Line');
        }); /* end spec (6a) */

        it("(6b) will throw error if lineText() called with no rowNumber", function () {
            var source = new InBuffer("First Line\nSecond Line");
            var myLine;

            // myLine    = source.lineText(1);
            expect(source.lineTextThat.bind(null)).toThrow('lineText REQUIRES a row number');
            // next two tests do not pass the line number, so end up behaving exactly like above
            // expect(source.lineTextThat.bind(this, -3)).not.toThrow();
            // expect(source.lineTextThat.bind(this, 9)).not.toThrow();
            myLine    = source.lineText(2);
            expect(myLine).toBe('Second Line');
        }); /* end spec (6b) */

        describe("(7) can skip leading and trailing white space [not independent]", function () {
            var leadWhiteSource  = new InBuffer(" one \n  two \n", "leadWhite");

           it("(7.1) first char is 'o' in col 2", function () {
                leadWhiteSource.skipWhiteSpace();
                expect(leadWhiteSource.row()).toEqual(1);
                expect(leadWhiteSource.col()).toEqual(2);
                expect(leadWhiteSource.peek()).toEqual('o');
                leadWhiteSource.read(); // o
                leadWhiteSource.read(); // n
                expect(leadWhiteSource.peek()).toEqual('e');
                leadWhiteSource.read(); // e

            });

            it("(7.2) Second word is two on 2nd line", function () {
                var nextChar;
                var posTwoExpected = [2, 3, "leadWhite"];

                leadWhiteSource.skipWhiteSpace();
                expect(leadWhiteSource.pos()).toEqual(posTwoExpected);
                expect(leadWhiteSource.peek()).toEqual('t');
                leadWhiteSource.read(); // t
                expect(leadWhiteSource.peek()).toEqual('w');
                leadWhiteSource.read(); // w
                leadWhiteSource.read(); // o
           });

            it("(7.3) And there is no other non-white space", function () {
                leadWhiteSource.skipWhiteSpace();
                expect(leadWhiteSource.inputRemaining()).toBe(false);
            });
        }); /* end subset (7) */

        describe("(8) can skip middle white space [not independent]", function () {
        //    var leadWhiteSource  = new InBuffer(" one \n  two \n", "leadWhite");
            var trimWhiteSource  = new InBuffer("one \n  two", "trimmedWhite");

            it("(8.1) first char is 'o' in col 2", function () {
                trimWhiteSource.skipWhiteSpace();
                expect(trimWhiteSource.row()).toEqual(1);
                expect(trimWhiteSource.col()).toEqual(1);
                expect(trimWhiteSource.peek()).toEqual('o');
                trimWhiteSource.read(); // o
                trimWhiteSource.read(); // n
                expect(trimWhiteSource.peek()).toEqual('e');
                trimWhiteSource.read(); // e
            });

            it("(8.2) Second word is two on 2nd line", function () {
                var nextChar;
                var posTwoExpected = [2, 3, "trimmedWhite"];

                trimWhiteSource.skipWhiteSpace();
                expect(trimWhiteSource.pos()).toEqual(posTwoExpected);
                expect(trimWhiteSource.peek()).toEqual('t');
                trimWhiteSource.read(); // t
                expect(trimWhiteSource.peek()).toEqual('w');
                trimWhiteSource.read(); // w
                trimWhiteSource.read(); // o
            });

            it("(8.3) And there is no other non-white space", function () {
                trimWhiteSource.skipWhiteSpace();
                expect(trimWhiteSource.inputRemaining()).toBe(false);
            });
        }); /* end subset (8) */

        it("(9) skipWhiteSpace handles empty source", function () {
            var emptyWhiteSource  = new InBuffer();

            emptyWhiteSource.skipWhiteSpace();
            var posBegEndExpected = [1, 1, ""];
            expect(emptyWhiteSource.pos()).toEqual(posBegEndExpected);
            expect(emptyWhiteSource.inputRemaining()).toBe(false);
        }); /* end spec (9) */

    }); /* end outermost test suite */

    // logD("leave InBuffer_Spec.js define()");
});  /* closure for requireJS define() */