exports.config = {
  framework: "jasmine",
  seleniumAddress: "http://localhost:4444/wd/hub",
  specs: ["./dist/tests/*.js"],
  plugins: [
    {
      path: "./dist/src/TestOpsJasmineReporter.js",
    },
  ],
};
