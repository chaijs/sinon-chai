"use strict";

exports.swallow = function (thrower) {
    try {
        thrower();
    } catch (e) {
        // Intentionally swallow
    }
};
