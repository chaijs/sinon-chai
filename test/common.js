global.sinon = require("sinon");
global.chai = require("chai");
global.should = require("chai").should();
global.expect = require("chai").expect;
global.AssertionError = require("chai").AssertionError;

var sinonChai = require("../lib/sinon-chai");
chai.use(sinonChai);
