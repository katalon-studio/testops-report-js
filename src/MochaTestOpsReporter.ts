import { TestOpsReporter } from "./TestOpsReporter";

"use strict";

import Mocha from 'mocha'
const {
    EVENT_HOOK_BEGIN,
    EVENT_HOOK_END,
    EVENT_SUITE_BEGIN,
    EVENT_SUITE_END,
    EVENT_TEST_BEGIN,
    EVENT_TEST_FAIL,
    EVENT_TEST_PASS,
    EVENT_TEST_PENDING,
    EVENT_RUN_BEGIN,
    EVENT_RUN_END
} = Mocha.Runner.constants; // other constants https://mochajs.org/api/runner.js.html

export = class MochaTestOpsReporter extends Mocha.reporters.Base{
    private coreReporter: TestOpsReporter
    constructor(runner: Mocha.Runner) {
        // console.log('runner', runner)
        super(runner);
        this.coreReporter = new TestOpsReporter();
        // console.log('coreReporter', this.coreReporter)

        this.runner
            .on("hook", this.onHookStart.bind(this))
            .on("hook end", this.onHookEnd.bind(this))
            .on(EVENT_RUN_BEGIN, () => console.log('helolllll'))
            .on(EVENT_SUITE_BEGIN, this.onSuite.bind(this))
            .on(EVENT_TEST_BEGIN, this.onTest.bind(this))
            .on(EVENT_TEST_PASS, this.onPassed.bind(this))
            .on(EVENT_TEST_FAIL, this.onFailed.bind(this))
            .on(EVENT_TEST_PENDING, this.onPending.bind(this))
            .on(EVENT_RUN_END, () => console.log('end nef'))
            .on(EVENT_SUITE_END, this.onSuiteEnd.bind(this))
    }

    private onSuite(suite: Mocha.Suite): void {
        console.log('onSuite')
        this.coreReporter.startSuite(suite.fullTitle());
    }

    private onSuiteEnd(): void {
        console.log('onSuiteEnd')
        this.coreReporter.endSuite();
    }

    private onTest(test: Mocha.Test): void {
        console.log('onTest')
        this.coreReporter.startCase(test);
    }

    private onPassed(test: Mocha.Test): void {
        console.log('onPassed')
        this.coreReporter.passTestCase(test);
    }

    private onFailed(test: Mocha.Test, error: Error): void {
        console.log('onFailed')
        this.coreReporter.failTestCase(test, error);
    }

    private onPending(test: Mocha.Test): void {
        console.log('onPending')
        this.coreReporter.pendingTestCase(test);
    }

    private onHookStart(hook: Mocha.Hook): void {
        console.log('onHookStart')
        this.coreReporter.startHook(hook.title);
    }

    private onHookEnd(hook: Mocha.Hook): void {
        console.log('onHookEnd')
        this.coreReporter.endHook(hook.error());
    }
}
