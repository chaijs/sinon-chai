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

    function sinonMethod(name, action) {
        method(name, function () {
            var argsString = Array.prototype.slice.call(arguments).map(stringify).join(", ");

            var alwaysSinonMethod = "always" + name[0].toUpperCase() + name.substring(1);
            var shouldBeAlways = this._always && typeof this.obj[alwaysSinonMethod] === "function";

            var sinonMethod = shouldBeAlways ? alwaysSinonMethod : name;
            var verbPhrase = shouldBeAlways ? "always have been " : "have been ";


            this.assert(this.obj[sinonMethod].apply(this.obj, arguments),
                        "expected " + this.obj.displayName + " to " + verbPhrase + action + " " + argsString,
                        "expected " + this.obj.displayName + " to not " + verbPhrase + action + " " + argsString);
        });
    }

    flagger("always");

    sinonProperty("called", "called");
    sinonProperty("calledOnce", "called exactly once");
    sinonProperty("calledTwice", "called exactly twice");
    sinonProperty("calledThrice", "called exactly thrice");
    sinonMethod("calledBefore", "called before");
    sinonMethod("calledAfter", "called after");
    sinonMethod("calledOn", "called on");
    sinonMethod("calledWith", "called with");
    sinonMethod("calledWithExactly", "called with exactly");
};
