import { TestOpsJasmine } from "./../src/TestOpsJasmine";
import { TestOpsJasmineReporter } from "../src/TestOpsJasmineReporter";

const reporter = new TestOpsJasmineReporter();

jasmine.getEnv().addReporter(reporter);
(global as any).testOpsJasmine = reporter.getRuntime();

declare global {
  export const testOpsJasmine: TestOpsJasmine;
}
