

exports.config = {
  framework: "mocha",
  specs: ["./dist/tests/mocha/*.js"],
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
