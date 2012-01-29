sinon = require("sinon")
chai = require("chai")
should = require("chai").should()
expect = require("chai").expect
AssertionError = require("chai").AssertionError

sinonChai = require("../lib/sinon-chai")
chai.use(sinonChai)

describe "Spy matchers", ->
    spy = null

    beforeEach ->
        spy = sinon.spy()

    describe "called", ->
        it "should throw an assertion error when the spy is not called", ->
            expect(-> spy.should.have.been.called).to.throw(AssertionError)

        it "should not throw when the spy is called once", ->
            spy()

            expect(-> spy.should.have.been.called).to.not.throw()

        it "should not throw when the spy is called twice", ->
            spy()
            spy()

            expect(-> spy.should.have.been.called).to.not.throw()

    describe "calledOnce", ->
        it "should throw an assertion error when the spy is not called", ->
            expect(-> spy.should.have.been.calledOnce).to.throw(AssertionError)

        it "should not throw when the spy is called once", ->
            spy()

            expect(-> spy.should.have.been.calledOnce).to.not.throw()

        it "should throw an assertion error when the spy is called twice", ->
            spy()
            spy()

            expect(-> spy.should.have.been.calledOnce).to.throw(AssertionError)
