import { TestOpsReporter } from "./TestOpsReporter";

"use strict";

import Mocha from 'mocha'
const {
    EVENT_SUITE_BEGIN,
    EVENT_SUITE_END,
    EVENT_TEST_BEGIN,
    EVENT_TEST_FAIL,
    EVENT_TEST_PASS,
    EVENT_TEST_PENDING,
    EVENT_RUN_BEGIN,
    EVENT_RUN_END
} = Mocha.Runner.constants; // other constants https://mochajs.org/api/runner.js.html

export = class MochaTestOpsReporter extends Mocha.reporters.Base {

    private coreReporter: TestOpsReporter;

    constructor(runner: Mocha.Runner) {
        super(runner);
        this.coreReporter = new TestOpsReporter();
        this.runner
            .on(EVENT_RUN_BEGIN, this.onExecutionStart.bind(this))
            .on(EVENT_RUN_END, this.onExecutionFinish.bind(this))
            .on(EVENT_SUITE_BEGIN, this.onSuiteStart.bind(this))
            .on(EVENT_SUITE_END, this.onSuiteFinish.bind(this))
            .on(EVENT_TEST_BEGIN, this.onTestStart.bind(this))
            .on(EVENT_TEST_PASS, this.onTestSuccess.bind(this))
            .on(EVENT_TEST_FAIL, this.onTestFailure.bind(this))
            .on(EVENT_TEST_PENDING, this.onTestPending.bind(this))
    }

    private onExecutionStart(hook: Mocha.Hook): void {
        console.log('onExecutionStart')
        this.coreReporter.onExecutionStart();
    }

    private onExecutionFinish(hook: Mocha.Hook): void {
        console.log('onExecutionFinish')
        this.coreReporter.onExecutionFinish();
    }

    private onSuiteStart(suite: Mocha.Suite): void {
        console.log('onSuiteStart')
        this.coreReporter.onSuiteStart(suite);
    }

    private onSuiteFinish(suite: Mocha.Suite): void {
        console.log('onSuiteFinish')
        this.coreReporter.onSuiteFinish(suite);
    }

    private onTestStart(test: Mocha.Test): void {
        console.log('onTestStart')
        this.coreReporter.onTestStart(test);
    }

    private onTestSuccess(test: Mocha.Test): void {
        console.log('onTestSuccess')
        this.coreReporter.onTestSuccess(test);
    }

    private onTestFailure(test: Mocha.Test, error: Error): void {
        console.log('onTestFailure')
        this.coreReporter.onTestFailure(test, error);
    }

    private onTestPending(test: Mocha.Test): void {
        console.log('onTestPending')
        this.coreReporter.onTestPending(test);
    }
}
