

exports.config = {
  framework: "mocha",
  specs: ["./dist/tests/mocha/*.js"],
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
  mochaOpts: {
    timeout: "20s",
    reporter: "@katalon/testops-mocha",
  },
};
