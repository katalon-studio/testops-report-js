import { TestOpsJasmineReporter } from "../src/TestOpsJasmineReporter";

const reporter = new TestOpsJasmineReporter()


jasmine.getEnv().addReporter(reporter)
