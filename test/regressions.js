import sinon from "sinon";
import { expect } from "chai";

describe("Regressions", function () {
    specify("GH-19: functions with `proxy` properties", function () {
        function func() {
            // Contents don't matter
        }
        func.proxy = 5;

        var spy = sinon.spy(func);
        spy();

        expect(function () {
            spy.should.have.been.called;
        }).to.not.throw();
    });

    specify("GH-94: assertions on calls", function () {
        function func() {
            // Contents don't matter
        }
        var spy = sinon.spy(func);

        spy(1, 2, 3);
        spy(4, 5, 6);

        expect(function () {
            spy.lastCall.should.have.been.calledWith(4, 5, 6);
        }).to.not.throw();
    });
});
