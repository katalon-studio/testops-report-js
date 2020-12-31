# Katalon TestOps JavaScript Reporters

## Usage

### Configuration

#### Environment variables

* `TESTOPS_BASE_PATH` Default value: *https://testops.katalon.io*

* `TESTOPS_API_KEY`

* `TESTOPS_PROJECT_ID`

* `TESTOPS_REPORT_FOLDER` Default value: *testops-report*

#### Configuration file

testops-config.json
```
{
    // Default value: https://testops.katalon.io
    "basePath": "",
    "apiKey": "",
    "projectId": "",
    // Default value: testops-report
    "reportFolder": ""
}

```

#### Mocha
- Sample: https://github.com/katalon-studio-samples/testops-report-sample-js/mocha
- Install dependency
```
npm i @katalon/testops-mocha
```
- Add reporter
```
mocha dist --recursive --reporter @katalon/testops-mocha './tests/*.js'
```

#### Cypress
- Sample: https://github.com/katalon-studio-samples/testops-report-sample-js/cypress
- Install dependency
```
npm i @katalon/testops-cypress
```
- Add reporter
```
const cypress = require('cypress')
const CypressTestOpsReporter = require('@katalon/testops-cypress');

cypress.run({
})
.then((results) => {
    const reporter = new CypressTestOpsReporter();
    reporter.parseAndUploadTestResults(results);
})
.catch((err) => {
    console.error(err)
})

```

#### Jasmine
- Sample: https://github.com/katalon-studio-samples/testops-report-sample-js/jasmine
- Install dependency
```
npm i @katalon/testops-jasmine
```
- Add reporter
```
import TestOpsJasmineReporter from "@katalon/testops-jasmine";

const reporter = new TestOpsJasmineReporter()

jasmine.getEnv().addReporter(reporter)
```

#### Jest
- Sample: https://github.com/katalon-studio-samples/testops-report-sample-js/jest
- Install dependency
```
npm i @katalon/testops-jest
```
- Setup reporter in `jest.config.js` file
```
module.exports = {
     "reporters": ["default", "@katalon/testops-jest"]
};
```

## Samples

https://github.com/katalon-studio-samples/testops-report-sample-js
