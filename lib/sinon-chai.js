/*jshint
 curly: true, eqeqeq: true, immed: true, latedef: true, newcap: true, noarg: true, nonew: true, trailing: true,
 undef: true, white: true, es5: true, globalstrict: true, node: true */
"use strict";

module.exports = function (chai) {
    function flagger(word) {
        Object.defineProperty(chai.Assertion.prototype, word, {
            get: function () {
                this["_" + word] = true;
                return this;
            },
            configurable: true
        });
    }

    function property(name, asserter) {
        Object.defineProperty(chai.Assertion.prototype, name, {
            get: function () {
                asserter.call(this);
                return this;
            },
            configurable: true
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

    function stringify(x) {
        return x && x.displayName ? x.displayName : chai.inspect(x);
    }

    function exceptionalSinonMethod(chaiName, sinonName, action) {
        method(chaiName, function () {
            var argsString = Array.prototype.slice.call(arguments).map(stringify).join(", ");

            var alwaysSinonMethod = "always" + sinonName[0].toUpperCase() + sinonName.substring(1);
            var shouldBeAlways = this._always && typeof this.obj[alwaysSinonMethod] === "function";

            var sinonMethod = shouldBeAlways ? alwaysSinonMethod : sinonName;
            var verbPhrase = shouldBeAlways ? "always have " : "have ";

            this.assert(this.obj[sinonMethod].apply(this.obj, arguments),
                        "expected " + this.obj.displayName + " to " + verbPhrase + action + " " + argsString,
                        "expected " + this.obj.displayName + " to not " + verbPhrase + action + " " + argsString);
        });
    }

    function sinonMethod(name, action) {
        exceptionalSinonMethod(name, name, action);
    }

    flagger("always");

    sinonProperty("called", "been called");
    sinonProperty("calledOnce", "been called exactly once");
    sinonProperty("calledTwice", "been called exactly twice");
    sinonProperty("calledThrice", "been called exactly thrice");
    sinonMethod("calledBefore", "been called before");
    sinonMethod("calledAfter", "been called after");
    sinonMethod("calledOn", "been called on");
    sinonMethod("calledWith", "been called with");
    sinonMethod("calledWithExactly", "been called with exactly");
    sinonMethod("returned", "returned");
    exceptionalSinonMethod("thrown", "threw", "thrown");
};
