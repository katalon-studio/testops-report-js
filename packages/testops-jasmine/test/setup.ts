import { TestOpsJasmineReporter } from "../src/TestOpsJasmineReporter";

const reporter = new TestOpsJasmineReporter({
  username: "anhle@mailinator.com",
  password: "12345678",
  basePath: "http://localhost:8444",
  projectId: 241,
  reportFolder: "./testops-result",
})


jasmine.getEnv().addReporter(reporter)