"use strict";

var sinon = require("sinon");
var expect = require("chai").expect;
var swallow = require("./common").swallow;
var stripAnsi = require("strip-ansi");

function makeErrorMessageTransform(transform) {
    return function (func) {
        return function () {
            try {
                func();
            } catch (error) {
                error.message = transform(error.message);
                throw error;
            }
        };
    };
}
var stripQuotes = makeErrorMessageTransform(function (message) {
    return message.replace(/\\*['"]/g, "");
});
var stripColors = makeErrorMessageTransform(stripAnsi);
var stripQuotesAndColors = makeErrorMessageTransform(function (message) {
    return stripAnsi(message).replace(/\\*['"]/g, "");
});

describe("Messages", function () {
    describe("about call count", function () {
        it("should be correct for the base cases", function () {
            var spy = sinon.spy();

            expect(stripQuotes(function () {
                spy.should.have.been.called;
            })).to.throw("expected spy to have been called at least once, but it was never called");
            expect(stripQuotes(function () {
                spy.should.have.been.calledOnce;
            })).to.throw("expected spy to have been called exactly once, but it was called 0 times");
            expect(stripQuotes(function () {
                spy.should.have.been.calledTwice;
            })).to.throw("expected spy to have been called exactly twice, but it was called 0 times");
            expect(stripQuotes(function () {
                spy.should.have.been.calledThrice;
            })).to.throw("expected spy to have been called exactly thrice, but it was called 0 times");

            expect(stripQuotes(function () {
                spy.should.have.callCount(1);
            })).to.throw("expected spy to have been called exactly once, but it was called 0 times");
            expect(stripQuotes(function () {
                spy.should.have.callCount(4);
            })).to.throw("expected spy to have been called exactly 4 times, but it was called 0 times");

            expect(stripQuotes(function () {
                spy.should.have.been.calledOnceWith();
            })).to.throw("expected spy to have been called exactly once with arguments");
            expect(stripQuotes(function () {
                spy.should.have.been.calledOnceWithExactly();
            })).to.throw("expected spy to have been called exactly once with exact arguments");
        });

        it("should be correct for the negated cases", function () {
            var calledOnce = sinon.spy();
            var calledTwice = sinon.spy();
            var calledThrice = sinon.spy();
            var calledFourTimes = sinon.spy();

            calledOnce();
            calledTwice();
            calledTwice();
            calledThrice();
            calledThrice();
            calledThrice();
            calledFourTimes();
            calledFourTimes();
            calledFourTimes();
            calledFourTimes();

            expect(function () {
                calledOnce.should.not.have.been.called;
            }).to.throw("expected spy to not have been called");

            expect(stripQuotes(function () {
                calledOnce.should.not.have.been.calledOnce;
            })).to.throw("expected spy to not have been called exactly once");

            expect(stripQuotes(function () {
                calledTwice.should.not.have.been.calledTwice;
            })).to.throw("expected spy to not have been called exactly twice");

            expect(stripQuotes(function () {
                calledThrice.should.not.have.been.calledThrice;
            })).to.throw("expected spy to not have been called exactly thrice");

            expect(stripQuotes(function () {
                calledOnce.should.not.have.callCount(1);
            })).to.throw("expected spy to not have been called exactly once");

            expect(stripQuotes(function () {
                calledFourTimes.should.not.have.callCount(4);
            })).to.throw("expected spy to not have been called exactly 4 times");
        });
    });

    describe("about call order", function () {
        function calledRegex(func, criteria, otherFunc) {
            return new RegExp(
                "expected " + func.displayName + " to " + criteria +
                " (function " + otherFunc.displayName + "\\(\\) \\{\\}|\\[Function.*\\])"
            );
        }
        it("should be correct for the base cases", function () {
            var spyA = sinon.spy();
            var spyB = sinon.spy();

            spyA.displayName = "spyA";
            spyB.displayName = "spyB";

            expect(function () {
                spyA.should.have.been.calledBefore(spyB);
            }).to.throw(calledRegex(spyA, "have been called before", spyB));

            if (spyA.calledImmediatelyBefore) {
                expect(function () {
                    spyA.should.have.been.calledImmediatelyBefore(spyB);
                }).to.throw(calledRegex(spyA, "have been called immediately before", spyB));
            }

            expect(function () {
                spyB.should.have.been.calledAfter(spyA);
            }).to.throw(calledRegex(spyB, "have been called after", spyA));

            if (spyB.calledImmediatelyAfter) {
                expect(function () {
                    spyB.should.have.been.calledImmediatelyAfter(spyA);
                }).to.throw(calledRegex(spyB, "have been called immediately after", spyA));
            }
        });

        it("should be correct for the negated cases", function () {
            var spyA = sinon.spy();
            var spyB = sinon.spy();

            spyA.displayName = "spyA";
            spyB.displayName = "spyB";

            spyA();
            spyB();

            expect(function () {
                spyA.should.not.have.been.calledBefore(spyB);
            }).to.throw(calledRegex(spyA, "not have been called before", spyB));

            if (spyA.calledImmediatelyBefore) {
                expect(function () {
                    spyA.should.not.have.been.calledImmediatelyBefore(spyB);
                }).to.throw(calledRegex(spyA, "not have been called immediately before", spyB));
            }

            expect(function () {
                spyB.should.not.have.been.calledAfter(spyA);
            }).to.throw(calledRegex(spyB, "not have been called after", spyA));

            if (spyB.calledImmediatelyAfter) {
                expect(function () {
                    spyB.should.not.have.been.calledImmediatelyAfter(spyA);
                }).to.throw(calledRegex(spyB, "not have been called immediately after", spyA));
            }
        });
    });

    describe("about call context", function () {
        it("should be correct for the basic case", function () {
            var spy = sinon.spy();
            var context = {};
            var badContext = { x: "y" };

            spy.call(badContext);

            var expected = new RegExp(
                "expected spy to have been called with \\{\\s*\\} as this, but it was called with " +
                spy.printf("%t") + " instead"
            );
            expect(function () {
                spy.should.have.been.calledOn(context);
            }).to.throw(expected);
            expect(function () {
                spy.getCall(0).should.have.been.calledOn(context);
            }).to.throw(expected);
        });

        it("should be correct for the negated case", function () {
            var spy = sinon.spy();
            var context = {};

            spy.call(context);

            var expected = /expected spy to not have been called with \{\s*\} as this/;
            expect(function () {
                spy.should.not.have.been.calledOn(context);
            }).to.throw(expected);
            expect(function () {
                spy.getCall(0).should.not.have.been.calledOn(context);
            }).to.throw(expected);
        });

        it("should be correct for the always case", function () {
            var spy = sinon.spy();
            var context = {};
            var badContext = { x: "y" };

            spy.call(badContext);

            var expected = new RegExp(
                "expected spy to always have been called with \\{\\s*\\} as this, but it was called with " +
                spy.printf("%t") + " instead"
            );
            expect(function () {
                spy.should.always.have.been.calledOn(context);
            }).to.throw(expected);
        });
    });

    describe("about calling with new", function () {
        /* eslint-disable new-cap, no-new */
        it("should be correct for the basic case", function () {
            var spy = sinon.spy();

            spy();

            var expected = "expected spy to have been called with new";
            expect(function () {
                spy.should.have.been.calledWithNew;
            }).to.throw(expected);
            expect(function () {
                spy.getCall(0).should.have.been.calledWithNew;
            }).to.throw(expected);
        });

        it("should be correct for the negated case", function () {
            var spy = sinon.spy();

            new spy();

            var expected = "expected spy to not have been called with new";
            expect(function () {
                spy.should.not.have.been.calledWithNew;
            }).to.throw(expected);
            expect(function () {
                spy.getCall(0).should.not.have.been.calledWithNew;
            }).to.throw(expected);
        });

        it("should be correct for the always case", function () {
            var spy = sinon.spy();

            new spy();
            spy();

            var expected = "expected spy to always have been called with new";
            expect(function () {
                spy.should.always.have.been.calledWithNew;
            }).to.throw(expected);
        });
        /* eslint-enable new-cap, no-new */
    });

    describe("about call arguments", function () {
        it("should be correct for the basic cases", function () {
            var spy = sinon.spy();

            spy(1, 2, 3);

            expect(stripQuotesAndColors(function () {
                spy.should.have.been.calledWith("a", "b", "c");
            })).to.throw("expected spy to have been called with arguments \n1 a \n2 b \n3 c");
            expect(stripQuotesAndColors(function () {
                spy.should.have.been.calledWithExactly("a", "b", "c");
            })).to.throw("expected spy to have been called with exact arguments \n1 a \n2 b \n3 c");
            expect(stripColors(function () {
                spy.should.have.been.calledWithMatch(sinon.match("foo"));
            })).to.throw("expected spy to have been called with arguments matching \n1 match(\"foo\")");
            expect(stripQuotesAndColors(function () {
                spy.should.have.been.calledOnceWith("a", "b", "c");
            })).to.throw("expected spy to have been called exactly once with arguments \n1 a \n2 b \n3 c");
            expect(stripQuotesAndColors(function () {
                spy.should.have.been.calledOnceWithExactly("a", "b", "c");
            })).to.throw("expected spy to have been called exactly once with exact arguments \n1 a \n2 b \n3 c");

            expect(stripQuotesAndColors(function () {
                spy.getCall(0).should.have.been.calledWith("a", "b", "c");
            })).to.throw("expected spy to have been called with arguments \n1 a \n2 b \n3 c");
            expect(stripQuotesAndColors(function () {
                spy.getCall(0).should.have.been.calledWithExactly("a", "b", "c");
            })).to.throw("expected spy to have been called with exact arguments \n1 a \n2 b \n3 c");
            expect(stripColors(function () {
                spy.getCall(0).should.have.been.calledWithMatch(sinon.match("foo"));
            })).to.throw("expected spy to have been called with arguments matching \n1 match(\"foo\")");
        });

        it("should be correct for the negated cases", function () {
            var spy = sinon.spy();

            spy(1, 2, 3);

            expect(function () {
                spy.should.not.have.been.calledWith(1, 2, 3);
            }).to.throw("expected spy to not have been called with arguments 1, 2, 3");
            expect(function () {
                spy.should.not.have.been.calledWithExactly(1, 2, 3);
            }).to.throw("expected spy to not have been called with exact arguments 1, 2, 3");
            expect(function () {
                spy.should.not.have.been.calledWithMatch(sinon.match(1));
            }).to.throw(/expected spy to not have been called with arguments matching.*match\(1\)/);
            expect(function () {
                spy.should.not.have.been.calledOnceWith(1, 2, 3);
            }).to.throw("expected spy to not have been called exactly once with arguments 1, 2, 3");
            expect(function () {
                spy.should.not.have.been.calledOnceWithExactly(1, 2, 3);
            }).to.throw("expected spy to not have been called exactly once with exact arguments 1, 2, 3");

            expect(function () {
                spy.getCall(0).should.not.have.been.calledWith(1, 2, 3);
            }).to.throw("expected spy to not have been called with arguments 1, 2, 3");
            expect(function () {
                spy.getCall(0).should.not.have.been.calledWithExactly(1, 2, 3);
            }).to.throw("expected spy to not have been called with exact arguments 1, 2, 3");
            expect(function () {
                spy.getCall(0).should.not.have.been.calledWithMatch(sinon.match(1));
            }).to.throw(/expected spy to not have been called with arguments matching.*match\(1\)/);
        });

        it("should be correct for the always cases", function () {
            var spy = sinon.spy();

            spy(1, 2, 3);
            spy("a", "b", "c");

            var expected = new RegExp(
                "expected spy to always have been called with arguments.*" +
                  "Call 2:\\na 1 \\nb 2 \\nc 3",
                "s"
            );
            expect(stripQuotesAndColors(function () {
                spy.should.always.have.been.calledWith(1, 2, 3);
            })).to.throw(expected);

            var expectedExactly = new RegExp(
                "expected spy to always have been called with exact arguments.*" +
                  "Call 2:\\na 1 \\nb 2 \\nc 3",
                "s"
            );
            expect(stripQuotesAndColors(function () {
                spy.should.always.have.been.calledWithExactly(1, 2, 3);
            })).to.throw(expectedExactly);

            var expectedMatch = new RegExp(
                "expected spy to always have been called with arguments matching.*" +
                  "Call 2:\\na match\\(1\\)",
                "s"
            );
            expect(stripQuotesAndColors(function () {
                spy.should.always.have.been.calledWithMatch(sinon.match(1));
            })).to.throw(expectedMatch);

            var expectedOnce = new RegExp(
                "expected spy to have been called exactly once with arguments.*" +
                  "Call 2:\\na 1 \\nb 2 \\nc 3",
                "s"
            );
            expect(stripQuotesAndColors(function () {
                spy.should.always.have.been.calledOnceWith(1, 2, 3);
            })).to.throw(expectedOnce);

            var expectedExactlyOnce = new RegExp(
                "expected spy to have been called exactly once with exact arguments.*" +
                  "Call 2:\\na 1 \\nb 2 \\nc 3 ",
                "s"
            );
            expect(stripQuotesAndColors(function () {
                spy.should.always.have.been.calledOnceWithExactly(1, 2, 3);
            })).to.throw(expectedExactlyOnce);

            spy.resetHistory();
            spy(1, 2, 3);
            spy(1, 2, 3);

            var expectedOnceButTwice = new RegExp(
                "expected spy to have been called exactly once with arguments.*" +
                  "Call 2:\\n1\\n2\\n3",
                "s"
            );
            expect(stripColors(function () {
                spy.should.always.have.been.calledOnceWith(1, 2, 3);
            })).to.throw(expectedOnceButTwice);

            var expectedExactlyOnceButTwice = new RegExp(
                "expected spy to have been called exactly once with exact arguments.*" +
                  "Call 2:\\n1\\n2\\n3",
                "s"
            );
            expect(stripColors(function () {
                spy.should.always.have.been.calledOnceWithExactly(1, 2, 3);
            })).to.throw(expectedExactlyOnceButTwice);
        });
    });

    describe("about returning", function () {
        it("should be correct for the basic case", function () {
            var spy = sinon.spy(function () {
                return 1;
            });

            spy();

            expect(function () {
                spy.should.have.returned(2);
            }).to.throw("expected spy to have returned 2");
            expect(function () {
                spy.getCall(0).should.have.returned(2);
            }).to.throw("expected spy to have returned 2");
        });

        it("should be correct for the negated case", function () {
            var spy = sinon.spy(function () {
                return 1;
            });

            spy();

            expect(function () {
                spy.should.not.have.returned(1);
            }).to.throw("expected spy to not have returned 1");
            expect(function () {
                spy.getCall(0).should.not.have.returned(1);
            }).to.throw("expected spy to not have returned 1");
        });

        it("should be correct for the always case", function () {
            var spy = sinon.spy(function () {
                return 1;
            });

            spy();

            expect(function () {
                spy.should.always.have.returned(2);
            }).to.throw("expected spy to always have returned 2");
        });
    });

    describe("about throwing", function () {
        it("should be correct for the basic cases", function () {
            var spy = sinon.spy();
            var throwingSpy = sinon.spy(function () {
                throw new Error();
            });

            spy();
            swallow(throwingSpy);

            expect(function () {
                spy.should.have.thrown();
            }).to.throw("expected spy to have thrown");
            expect(function () {
                spy.getCall(0).should.have.thrown();
            }).to.throw("expected spy to have thrown");

            expect(stripQuotes(function () {
                throwingSpy.should.have.thrown("TypeError");
            })).to.throw("expected spy to have thrown TypeError");
            expect(stripQuotes(function () {
                throwingSpy.getCall(0).should.have.thrown("TypeError");
            })).to.throw("expected spy to have thrown TypeError");

            expect(function () {
                throwingSpy.should.have.thrown({ message: "x" });
            }).to.throw(/expected spy to have thrown { message: ['"]x['"] }/);
            expect(function () {
                throwingSpy.getCall(0).should.have.thrown({ message: "x" });
            }).to.throw(/expected spy to have thrown { message: ['"]x['"] }/);
        });

        it("should be correct for the negated cases", function () {
            var error = new Error("boo!");
            var spy = sinon.spy(function () {
                throw error;
            });

            swallow(spy);

            expect(function () {
                spy.should.not.have.thrown();
            }).to.throw("expected spy to not have thrown");
            expect(function () {
                spy.getCall(0).should.not.have.thrown();
            }).to.throw("expected spy to not have thrown");

            expect(stripQuotes(function () {
                spy.should.not.have.thrown("Error");
            })).to.throw("expected spy to not have thrown Error");
            expect(stripQuotes(function () {
                spy.getCall(0).should.not.have.thrown("Error");
            })).to.throw("expected spy to not have thrown Error");

            expect(function () {
                spy.should.not.have.thrown(error);
            }).to.throw("expected spy to not have thrown Error: boo!");
            expect(function () {
                spy.getCall(0).should.not.have.thrown(error);
            }).to.throw("expected spy to not have thrown Error: boo!");
        });

        it("should be correct for the always cases", function () {
            var spy = sinon.spy();
            var throwingSpy = sinon.spy(function () {
                throw new Error();
            });

            spy();
            swallow(throwingSpy);

            expect(function () {
                spy.should.have.always.thrown();
            }).to.throw("expected spy to always have thrown");

            expect(stripQuotes(function () {
                throwingSpy.should.have.always.thrown("TypeError");
            })).to.throw("expected spy to always have thrown TypeError");

            expect(function () {
                throwingSpy.should.have.always.thrown({ message: "x" });
            }).to.throw(/expected spy to always have thrown { message: ['"]x['"] }/);
        });
    });

    describe("when used on a non-spy/non-call", function () {
        function notSpy() {
            // Contents don't matter
        }

        it("should be informative for properties", function () {
            expect(function () {
                notSpy.should.have.been.called;
            }).to.throw(TypeError, "not a spy");
        });

        it("should be informative for methods", function () {
            expect(function () {
                notSpy.should.have.been.calledWith("foo");
            }).to.throw(TypeError, "not a spy");
        });
    });

    it("should not trigger getters for passing assertions", function () {
        var obj = {};
        var getterCalled = false;
        Object.defineProperty(obj, "getter", {
            get: function () {
                getterCalled = true;
            },
            enumerable: true
        });

        var spy = sinon.spy();

        spy(obj);

        spy.should.have.been.calledWith(obj);

        expect(getterCalled).to.be.false;
    });
});
