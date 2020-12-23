import {
    TestResult,
    TestSuite,
    Metadata,
    Status,
    ReportLifecycle,
    TestOpsConfiguration,
} from '@katalon/testops-commons'
import { v4 as uuidv4 } from 'uuid';
import Mocha from 'mocha'

export class TestOpsReporter {

    private suites: TestSuite[] = [];
    private currentTest: TestResult | null = null;
    private report: ReportLifecycle;
    private currentSuite: TestSuite | null = this.suites.length > 0 ? this.suites[this.suites.length - 1] : null;

    constructor() {
        const configurationParams: TestOpsConfiguration = {
            username: "lydoan@kms-technology.com",
            password: "Dtl#@1999",
            basePath: "http://localhost:8444",
            projectId: 3,
            reportFolder: "./testops-result"
        };
        this.report = new ReportLifecycle(configurationParams);
    }

    public createMetadata(): Metadata {
        const metadata = {
          framework: "mocha",
          language: "js"
        }
        return metadata
    }

    public onExecutionStart(): void {
        this.report.startExecution();
        const metadata: Metadata = this.createMetadata();
        this.report.writeMetadata(metadata);
    }

    public onExecutionFinish(): void {
        this.report.stopExecution();
        this.report.writeTestResultsReport();
        this.report.writeTestSuitesReport();
        this.report.writeExecutionReport();
        this.report.upload();
    }

    public onSuiteStart(suite: any): void {
        const suiteName = suite.fullTitle();
        if (suiteName) {
          const suiteId: string = uuidv4();
          suite.TO_UUID = suiteId;
          this.currentSuite = {} as TestSuite;
          this.currentSuite.name = suiteName;
          this.report.startSuite(this.currentSuite);
          this.pushSuite(this.currentSuite);
        }
    }

    public onSuiteFinish(suite: any): void {
        if (suite.TO_UUID) {
          this.report.stopTestSuite(suite.TO_UUID)
        }
    }

    public onTestStart(test: Mocha.Test, start: number = Date.now()): void {
        const suite: any = test.parent;
        this.currentTest = { } as TestSuite;
        this.currentTest.name = test.title;
        this.currentTest.uuid = uuidv4();
        this.currentTest.start = start;
        this.currentTest.duration = test.duration;
        this.currentTest.suiteName = suite.fullTitle();
    }

    public onTestSuccess(test: Mocha.Test): void {
        if (this.currentTest === null) {
            this.onTestStart(test);
        }
        this.endTest(Status.PASSED);
    }

    public onTestFailure(test: Mocha.Test, error: Error): void {
        if (this.currentTest === null) {
            this.onTestStart(test);
        } else {
            const latestStatus = this.currentTest.status;
            // if test already has a failed state, we should not overwrite it
            if (latestStatus === Status.FAILED) {
                return;
            }
        }
        const status = Status.FAILED;

        this.endTest(status, error.message, error.stack);
    }

    public onTestPending(test: Mocha.Test): void {
        this.onTestStart(test);
        this.endTest(Status.SKIPPED);
    }

    public pushSuite(suite: TestSuite): void {
        this.suites.push(suite);
    }

    private endTest(status: Status, error?: string, stackTrace?: string, stop: number = Date.now()): void {
        if (this.currentTest === null) {
            throw new Error("endTest while no test is running");
        }
        this.currentTest.status = status;
        if (error) {
            this.currentTest.errorMessage = error;
        }
        if (stackTrace) {
            this.currentTest.stackTrace = stackTrace;
        }
        this.currentTest.stop = stop;
        this.currentTest.duration = this.currentTest.stop - this.currentTest.start;
        this.report.stopTestCase(this.currentTest);
        this.currentTest = null;
    }
}
