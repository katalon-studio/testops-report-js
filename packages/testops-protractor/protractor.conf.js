const TestOpsJasmineReporter = require('@katalon/testops-jasmine');

exports.config = {
  framework: "jasmine",
  specs: ["./dist/tests/jasmine/*.js"],
  capabilities: {
    browserName: "chrome",
    useAutomationExtension: false,
    args: ["--disable-dev-shm-usage"],
  },
  plugins: [
    {
      path: "./dist",
    },
  ],
  onPrepare: () => {
    const reporter = new TestOpsJasmineReporter();
    jasmine.getEnv().addReporter(reporter);
  },
};
