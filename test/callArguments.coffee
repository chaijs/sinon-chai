describe "Call arguments", ->
    spy = null
    arg1 = null
    arg2 = null
    notArg = null

    beforeEach ->
        spy = sinon.spy()
        arg1 = "A"
        arg2 = "B"
        notArg = "C"

    describe "calledWith", ->
        it "should throw an assertion error when the spy is not called", ->
            expect(-> spy.should.have.been.calledWith(arg1, arg2)).to.throw(AssertionError)

        it "should not throw when the spy is called with the correct arguments", ->
            spy(arg1, arg2)

            expect(-> spy.should.have.been.calledWith(arg1, arg2)).to.not.throw()
            expect(-> spy.getCall(0).should.have.been.calledWith(arg1, arg2)).to.not.throw()

        it "should not throw when the spy is called with the correct arguments and more", ->
            spy(arg1, arg2, notArg)

            expect(-> spy.should.have.been.calledWith(arg1, arg2)).to.not.throw()
            expect(-> spy.getCall(0).should.have.been.calledWith(arg1, arg2)).to.not.throw()

        it "should throw an assertion error when the spy is called with incorrect arguments", ->
            spy(notArg, arg1)

            expect(-> spy.should.have.been.calledWith(arg1, arg2)).to.throw(AssertionError)
            expect(-> spy.getCall(0).should.have.been.calledWith(arg1, arg2)).to.throw(AssertionError)

        it "should not throw when the spy is called with incorrect arguments but then correct ones", ->
            spy(notArg, arg1)
            spy(arg1, arg2)

            expect(-> spy.should.have.been.calledWith(arg1, arg2)).to.not.throw()
            expect(-> spy.getCall(1).should.have.been.calledWith(arg1, arg2)).to.not.throw()


    describe "always calledWith", ->
        it "should throw an assertion error when the spy is not called", ->
            expect(-> spy.should.always.have.been.calledWith(arg1, arg2)).to.throw(AssertionError)
            expect(-> spy.should.have.always.been.calledWith(arg1, arg2)).to.throw(AssertionError)
            expect(-> spy.should.have.been.always.calledWith(arg1, arg2)).to.throw(AssertionError)

        it "should not throw when the spy is called with the correct arguments", ->
            spy(arg1, arg2)

            expect(-> spy.should.always.have.been.calledWith(arg1, arg2)).to.not.throw()
            expect(-> spy.should.have.always.been.calledWith(arg1, arg2)).to.not.throw()
            expect(-> spy.should.have.been.always.calledWith(arg1, arg2)).to.not.throw()

        it "should not throw when the spy is called with the correct arguments and more", ->
            spy(arg1, arg2, notArg)

            expect(-> spy.should.always.have.been.calledWith(arg1, arg2)).to.not.throw()
            expect(-> spy.should.have.always.been.calledWith(arg1, arg2)).to.not.throw()
            expect(-> spy.should.have.been.always.calledWith(arg1, arg2)).to.not.throw()

        it "should throw an assertion error when the spy is called with incorrect arguments", ->
            spy(notArg, arg1)

            expect(-> spy.should.always.have.been.calledWith(arg1, arg2)).to.throw(AssertionError)
            expect(-> spy.should.have.always.been.calledWith(arg1, arg2)).to.throw(AssertionError)
            expect(-> spy.should.have.been.always.calledWith(arg1, arg2)).to.throw(AssertionError)

        it "should throw an assertion error when the spy is called with incorrect arguments but then correct ones", ->
            spy(notArg, arg1)
            spy(arg1, arg2)

            expect(-> spy.should.always.have.been.calledWith(arg1, arg2)).to.throw(AssertionError)
            expect(-> spy.should.have.always.been.calledWith(arg1, arg2)).to.throw(AssertionError)
            expect(-> spy.should.have.been.always.calledWith(arg1, arg2)).to.throw(AssertionError)

    describe "calledWithExactly", ->
        it "should throw an assertion error when the spy is not called", ->
            expect(-> spy.should.have.been.calledWithExactly(arg1, arg2)).to.throw(AssertionError)

        it "should not throw when the spy is called with the correct arguments", ->
            spy(arg1, arg2)

            expect(-> spy.should.have.been.calledWithExactly(arg1, arg2)).to.not.throw()
            expect(-> spy.getCall(0).should.have.been.calledWithExactly(arg1, arg2)).to.not.throw()

        it "should throw an assertion error when the spy is called with the correct arguments and more", ->
            spy(arg1, arg2, notArg)

            expect(-> spy.should.have.been.calledWithExactly(arg1, arg2)).to.throw(AssertionError)
            expect(-> spy.getCall(0).should.have.been.calledWithExactly(arg1, arg2)).to.throw(AssertionError)

        it "should throw an assertion error when the spy is called with incorrect arguments", ->
            spy(notArg, arg1)

            expect(-> spy.should.have.been.calledWithExactly(arg1, arg2)).to.throw(AssertionError)
            expect(-> spy.getCall(0).should.have.been.calledWithExactly(arg1, arg2)).to.throw(AssertionError)

        it "should not throw when the spy is called with incorrect arguments but then correct ones", ->
            spy(notArg, arg1)
            spy(arg1, arg2)

            expect(-> spy.should.have.been.calledWithExactly(arg1, arg2)).to.not.throw()
            expect(-> spy.getCall(1).should.have.been.calledWithExactly(arg1, arg2)).to.not.throw()


    describe "always calledWithExactly", ->
        it "should throw an assertion error when the spy is not called", ->
            expect(-> spy.should.always.have.been.calledWithExactly(arg1, arg2)).to.throw(AssertionError)
            expect(-> spy.should.have.always.been.calledWithExactly(arg1, arg2)).to.throw(AssertionError)
            expect(-> spy.should.have.been.always.calledWithExactly(arg1, arg2)).to.throw(AssertionError)

        it "should not throw when the spy is called with the correct arguments", ->
            spy(arg1, arg2)

            expect(-> spy.should.always.have.been.calledWithExactly(arg1, arg2)).to.not.throw()
            expect(-> spy.should.have.always.been.calledWithExactly(arg1, arg2)).to.not.throw()
            expect(-> spy.should.have.been.always.calledWithExactly(arg1, arg2)).to.not.throw()

        it "should throw an assertion error when the spy is called with the correct arguments and more", ->
            spy(arg1, arg2, notArg)

            expect(-> spy.should.always.have.been.calledWithExactly(arg1, arg2)).to.throw(AssertionError)
            expect(-> spy.should.have.always.been.calledWithExactly(arg1, arg2)).to.throw(AssertionError)
            expect(-> spy.should.have.been.always.calledWithExactly(arg1, arg2)).to.throw(AssertionError)

        it "should throw an assertion error when the spy is called with incorrect arguments", ->
            spy(notArg, arg1)

            expect(-> spy.should.always.have.been.calledWithExactly(arg1, arg2)).to.throw(AssertionError)
            expect(-> spy.should.have.always.been.calledWithExactly(arg1, arg2)).to.throw(AssertionError)
            expect(-> spy.should.have.been.always.calledWithExactly(arg1, arg2)).to.throw(AssertionError)

        it "should throw an assertion error when the spy is called with incorrect arguments but then correct ones", ->
            spy(notArg, arg1)
            spy(arg1, arg2)

            expect(-> spy.should.always.have.been.calledWithExactly(arg1, arg2)).to.throw(AssertionError)
            expect(-> spy.should.have.always.been.calledWithExactly(arg1, arg2)).to.throw(AssertionError)
            expect(-> spy.should.have.been.always.calledWithExactly(arg1, arg2)).to.throw(AssertionError)
