const TestOpsJasmineReporter = require('@katalon/testops-jasmine');

exports.config = {
  framework: "jasmine",
  specs: ["./dist/tests/jasmine/*.js"],
  capabilities: {
    browserName: "chrome",
    args: ["--headless", "--disable-dev-shm-usage", "--no-sandbox"],
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
  jasmineNodeOpts: {
    defaultTimeoutInterval: 20000,
  },
};
