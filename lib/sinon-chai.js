/*jshint
 curly: true, eqeqeq: true, immed: true, latedef: true, newcap: true, noarg: true, nonew: true, trailing: true,
 undef: true, white: true, es5: true, globalstrict: true, node: true */
"use strict";

module.exports = function (chai) {
    function languageChain(word) {
        Object.defineProperty(chai.Assertion.prototype, word, {
            get: function () {
                return this;
            }
        });
    }

    function property(name, asserter) {
        Object.defineProperty(chai.Assertion.prototype, name, {
            get: function () {
                asserter.call(this);
                return this;
            }
        });
    }

    languageChain("been");

    property("called", function () {
        this.assert(this.obj.called,
                    "expected " + this.obj.displayName + " to have been called",
                    "expected " + this.obj.displayName + " to not have been called");
    });

    property("calledOnce", function () {
        this.assert(this.obj.calledOnce,
                    "expected " + this.obj.displayName + " to have been called exactly once",
                    "expected " + this.obj.displayName + " to not have been called exactly once");
    });

    property("calledTwice", function () {
        this.assert(this.obj.calledTwice,
                    "expected " + this.obj.displayName + " to have been called exactly twice",
                    "expected " + this.obj.displayName + " to have been called exactly twice");
    });

    property("calledThrice", function () {
        this.assert(this.obj.calledThrice,
                    "expected " + this.obj.displayName + " to have been called exactly thrice",
                    "expected " + this.obj.displayName + " to have been called exactly thrice");
    });
};
