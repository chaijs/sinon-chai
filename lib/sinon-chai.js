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

    function method(name, asserter) {
        chai.Assertion.prototype[name] = function () {
            asserter.apply(this, arguments);
            return this;
        };
    }

    function sinonProperty(name, action) {
        property(name, function () {
            this.assert(this.obj[name],
                        "expected " + this.obj.displayName + " to have been " + action,
                        "expected " + this.obj.displayName + " to not have been " + action);
        });
    }

    function sinonMethod(name, action) {
        method(name, function (other) {
            var otherString = other && other.displayName ? other.displayName : chai.inspect(other);

            this.assert(this.obj[name].call(this.obj, other),
                        "expected " + this.obj.displayName + " to have been " + action + " " + otherString,
                        "expected " + this.obj.displayName + " to not have been " + action + " " + otherString);
        });
    }

    languageChain("been");

    sinonProperty("called", "called");
    sinonProperty("calledOnce", "called exactly once");
    sinonProperty("calledTwice", "called exactly twice");
    sinonProperty("calledThrice", "called exactly thrice");
    sinonMethod("calledBefore", "called before");
    sinonMethod("calledAfter", "called after");
    sinonMethod("calledOn", "called on");
};
