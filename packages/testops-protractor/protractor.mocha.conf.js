

exports.config = {
  framework: "mocha",
  specs: ["./dist/tests/mocha/*.js"],
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
  mochaOpts: {
    timeout: "20s",
    reporter: "@katalon/testops-mocha",
  },
};
