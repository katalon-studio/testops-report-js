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

export default class MochaTestOpsReporter extends Mocha.reporters.Base {

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
        try {
            this.coreReporter.onExecutionStart();
        } catch (err) {
            console.error(err)
        }
    }

    private onExecutionFinish(): void {
        try {
            this.coreReporter.onExecutionFinish();
        } catch (err) {
            console.error(err)
        }
    }

    private onSuiteStart(suite: Mocha.Suite): void {
        try {
            this.coreReporter.onSuiteStart(suite);
        } catch (err) {
            console.error(err)
        }
    }

    private onSuiteFinish(suite: Mocha.Suite): void {
        try {
            this.coreReporter.onSuiteFinish(suite);
        } catch (err) {
            console.error(err)
        }
    }

    private onTestStart(test: Mocha.Test): void {
        try {
            this.coreReporter.onTestStart(test);
        } catch (err) {
            console.error(err)
        }
    }

    private onTestSuccess(test: Mocha.Test): void {
        try {
            this.coreReporter.onTestSuccess(test);
        } catch (err) {
            console.error(err)
        }
    }

    private onTestFailure(test: Mocha.Test, error: Error): void {
        try {
            this.coreReporter.onTestFailure(test, error);
        } catch (err) {
            console.error(err)
        }
    }

    private onTestPending(test: Mocha.Test): void {
        try {
            this.coreReporter.onTestPending(test);
        } catch (err) {
            console.error(err)
        }
    }
}
