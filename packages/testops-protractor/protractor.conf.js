const TestOpsJasmineReporter = require('@katalon/testops-jasmine');

exports.config = {
  framework: "jasmine",
  seleniumAddress: "http://localhost:4444/wd/hub",
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
