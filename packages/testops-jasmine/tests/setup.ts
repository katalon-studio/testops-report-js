import { TestOpsJasmine } from "./../src/TestOpsJasmine";
import { TestOpsJasmineReporter } from "../src/TestOpsJasmineReporter";

const reporter = new TestOpsJasmineReporter();

jasmine.getEnv().addReporter(reporter);

declare global {
  namespace NodeJS {
    interface Global {
      testOpsJasmine: TestOpsJasmine;
    }
  }
}

global.testOpsJasmine = reporter.getRuntime();
