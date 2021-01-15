const TestOpsJasmineReporter = require('@katalon/testops-jasmine');

exports.config = {
  framework: "jasmine",
  specs: ["./dist/tests/jasmine/*.js"],
  capabilities: {
    browserName: "chrome",
    useAutomationExtension: true,
    args: [
      "--headless",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--no-sandbox",
      "--disable-popup-blocking",
      "--start-maximized",
      "--disable-web-security",
      "--allow-running-insecure-content",
      "--disable-infobars",
    ],
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
