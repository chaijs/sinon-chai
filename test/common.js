
import * as chai from "chai";
import sinonChai from "../lib/sinon-chai.js";

chai.use(sinonChai);
chai.should();

function swallow(thrower) {
    try {
        thrower();
    } catch (e) {
        // Intentionally swallow
    }
}

export default swallow;
