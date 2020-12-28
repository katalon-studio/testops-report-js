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

    private report: ReportLifecycle;

    constructor() {
        const config: TestOpsConfiguration = {
            username: "lydoan@kms-technology.com",
            password: "Dtl#@1999",
            basePath: "http://localhost:8444",
            projectId: 3,
            reportFolder: "./testops-result"
        };
        this.report = new ReportLifecycle(config);
    }

    public onExecutionStart(): void {
        this.report.startExecution();
    }

    public onExecutionFinish(): void {
        this.report.stopExecution();
        this.report.writeTestResultsReport();
        this.report.writeTestSuitesReport();
        this.report.writeExecutionReport();
        this.report.writeMetadata(this.metadata);
        this.report.upload();
    }

    public onSuiteStart(suite: any): void {
        const suiteName = suite.fullTitle();
        if (suiteName) {
            const suiteId: string = uuidv4();
            suite.TO_UUID = suiteId;

            const currentSuite = {} as TestSuite;
            currentSuite.uuid = suiteId;
            currentSuite.name = suiteName;
            this.report.startSuite(currentSuite);
        }
    }

    public onSuiteFinish(suite: any): void {
        if (suite.TO_UUID) {
            this.report.stopTestSuite(suite.TO_UUID);
        }
    }

    public onTestStart(test: any): void {
        test.TO_START = Date.now();
    }

    public onTestSuccess(test: Mocha.Test): void {
        const result: TestResult = this.createTestResult(test);
        this.endTest(result, Status.PASSED);
    }

    public onTestFailure(test: Mocha.Test, error: Error): void {
        const result: TestResult = this.createTestResult(test);
        result.errorMessage = error.message;
        result.stackTrace = error.stack;
        this.endTest(result, Status.FAILED);
    }

    public onTestPending(test: Mocha.Test): void {
        const result: TestResult = this.createTestResult(test);
        this.endTest(result, Status.SKIPPED);
    }

    private createTestResult(test: any): TestResult {
        const suite: any = test.parent;
        const result = { } as TestResult;
        result.name = test.title;
        result.uuid = uuidv4();
        result.start = test.TO_START;
        result.duration = test.duration;
        result.suiteName = suite.fullTitle();
        return result;
    }

    private endTest(result: any, status: Status): void {
        result.status = status;
        result.stop = Date.now();
        result.duration = result.stop - result.start;
        this.report.stopTestCase(result);
    }

    private get metadata(): Metadata {
      return {
        framework: "mocha",
        language: "javaScript",
      };
    }
}
