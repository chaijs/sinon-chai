describe "Call count", ->
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

    describe "not called", ->
        it "should not throw when the spy is not called", ->
            expect(-> spy.should.not.have.been.called).to.not.throw()

        it "should throw an assertion error when the spy is called once", ->
            spy()

            expect(-> spy.should.not.have.been.called).to.throw(AssertionError)

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

    describe "calledTwice", ->
        it "should throw an assertion error when the spy is not called", ->
            expect(-> spy.should.have.been.calledTwice).to.throw(AssertionError)

        it "should throw an assertion error when the spy is called once", ->
            spy()

            expect(-> spy.should.have.been.calledTwice).to.throw(AssertionError)

        it "should not throw when the spy is called twice", ->
            spy()
            spy()

            expect(-> spy.should.have.been.calledTwice).to.not.throw()

        it "should throw an assertion error when the spy is called thrice", ->
            spy()
            spy()
            spy()

            expect(-> spy.should.have.been.calledTwice).to.throw(AssertionError)

    describe "calledThrice", ->
        it "should throw an assertion error when the spy is not called", ->
            expect(-> spy.should.have.been.calledThrice).to.throw(AssertionError)

        it "should throw an assertion error when the spy is called once", ->
            spy()

            expect(-> spy.should.have.been.calledThrice).to.throw(AssertionError)

        it "should throw an assertion error when the spy is called twice", ->
            spy()
            spy()

            expect(-> spy.should.have.been.calledThrice).to.throw(AssertionError)

        it "should not throw when the spy is called thrice", ->
            spy()
            spy()
            spy()

            expect(-> spy.should.have.been.calledThrice).to.not.throw()

        it "should throw an assertion error when the spy is called four times", ->
            spy()
            spy()
            spy()
            spy()

            expect(-> spy.should.have.been.calledThrice).to.throw(AssertionError)
