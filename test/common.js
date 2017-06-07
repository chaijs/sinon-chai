"use strict";

global.chai = require("chai");
global.should = require("chai").should();
global.expect = require("chai").expect;
global.AssertionError = require("chai").AssertionError;

global.sinonIsVersion1 = require("sinon/package.json").version.split('.')[0] == '1'

global.swallow = function (thrower) {
    try {
        thrower();
    } catch (e) { }
};

var sinonChai = require("../lib/sinon-chai");
chai.use(sinonChai);
