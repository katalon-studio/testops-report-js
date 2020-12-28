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

export class MochaTestOpsReporter extends Mocha.reporters.Base {

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

    private onExecutionStart(): void {
        console.log('onExecutionStart')
        try {
            this.coreReporter.onExecutionStart();
        }catch (err) {
            console.log(err)
        }
    }

    private onExecutionFinish(): void {
        console.log('onExecutionFinish')
        try {
            this.coreReporter.onExecutionFinish();
        }catch (err) {
            console.log(err)
        }
    }

    private onSuiteStart(suite: Mocha.Suite): void {
        console.log('onSuiteStart')
        try {
            this.coreReporter.onSuiteStart(suite);
        }catch (err) {
            console.log(err)
        }
    }

    private onSuiteFinish(suite: Mocha.Suite): void {
        console.log('onSuiteFinish')
        try {
            this.coreReporter.onSuiteFinish(suite);
        }catch (err) {
            console.log(err)
        }
    }

    private onTestStart(test: Mocha.Test): void {
        console.log('onTestStart')
        try {
            this.coreReporter.onTestStart(test);
        }catch (err) {
            console.log(err)
        }
    }

    private onTestSuccess(test: Mocha.Test): void {
        console.log('onTestSuccess')
        try {
            this.coreReporter.onTestSuccess(test);
        }catch (err) {
            console.log(err)
        }
    }

    private onTestFailure(test: Mocha.Test, error: Error): void {
        console.log('onTestFailure')
        try {
            this.coreReporter.onTestFailure(test, error);
        }catch (err) {
            console.log(err)
        }
    }

    private onTestPending(test: Mocha.Test): void {
        console.log('onTestPending')
        try {
            this.coreReporter.onTestPending(test);
        }catch (err) {
            console.log(err)
        }
    }
}
