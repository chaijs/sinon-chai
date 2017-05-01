"use strict"

sinon = require("sinon")

describe "Regressions", ->
    specify "GH-19: functions with `proxy` properties", ->
        func = ->
        func.proxy = 5

        spy = sinon.spy(func)
        spy()

        expect(-> spy.should.have.been.called).to.not.throw()

    specify "GH-94: assertions on calls", ->
        func = ->
        spy = sinon.spy(func)

        spy(1, 2, 3)
        spy(4, 5, 6)

        expect(-> spy.lastCall.should.have.been.calledWith(4, 5, 6)).to.not.throw()
