

exports.config = {
  framework: "mocha",
  specs: ["./dist/tests/mocha/*.js"],
  capabilities: {
    browserName: "chrome",
    args: ["--headless", "--disable-dev-shm-usage", "--no-sandbox"],
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
