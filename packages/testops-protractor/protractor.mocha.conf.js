

exports.config = {
  framework: "mocha",
  seleniumAddress: "http://localhost:4444/wd/hub",
  specs: ["./dist/tests/mocha/*.js"],
  // plugins: [
  //   {
  //     path: "./dist/src/TestOpsJasmineReporter.js",
  //   },
  // ],
  onComplete: () => new Promise(() => {}),
  mochaOpts: {
    timeout: '20s',
    reporter: "@katalon/testops-mocha",
  },
};
