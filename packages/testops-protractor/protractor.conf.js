const TestOpsJasmineReporter = require('@katalon/testops-jasmine');

exports.config = {
  framework: "jasmine",
  specs: ["./dist/tests/jasmine/*.js"],
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
