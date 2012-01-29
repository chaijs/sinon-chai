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

    function sinonProperty(name, action) {
        property(name, function () {
            this.assert(this.obj[name],
                        "expected " + this.obj.displayName + " to have been " + action,
                        "expected " + this.obj.displayName + " to not have been " + action);
        });
    }

    languageChain("been");

    sinonProperty("called", "called");
    sinonProperty("calledOnce", "called exactly once");
    sinonProperty("calledTwice", "called exactly twice");
    sinonProperty("calledThrice", "called exactly thrice");
};
