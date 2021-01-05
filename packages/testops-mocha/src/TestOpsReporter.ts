import {
    TestResult,
    TestSuite,
    Metadata,
    Status,
    ReportLifecycle,
    TestCreator, Execution
} from '@katalon/testops-commons'
import { v4 as uuidv4 } from 'uuid';
import Mocha from 'mocha'

export class TestOpsReporter {

    private report: ReportLifecycle;
    private execution: Execution = TestCreator.execution();

    constructor() {
        this.report = new ReportLifecycle();
    }

    public createMetadata(): Metadata {
        const metadata = {
          framework: "mocha",
          language: "javascript"
        }
        return metadata
    }

    public onExecutionStart(): void {
        this.report.startExecution(this.execution);
        const metadata: Metadata = this.createMetadata();
        this.report.writeMetadata(metadata);
    }

    public onExecutionFinish(): void {
        this.report.stopExecution(this.execution);
        this.report.writeTestResultsReport();
        this.report.writeTestSuitesReport();
        this.report.writeExecutionReport();
        this.report.upload();
    }

    public onSuiteStart(suite: any): void {
        const suiteName = suite.title;
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
        const testSuite = { } as TestSuite
        if (suite.TO_UUID) {
            testSuite.uuid = suite.TO_UUID;
            this.report.stopTestSuite(testSuite);
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
        const testError: Error = {
          message = error.message;
          stackTrace = error.stack;
        };
        result.errors.push(testError);
        this.endTest(result, Status.FAILED);
    }

    public onTestPending(test: Mocha.Test): void {
        const result: TestResult = this.createTestResult(test);
        this.endTest(result, Status.SKIPPED);
    }

    public createTestResult(test: any): TestResult {
        const suite: any = test.parent;
        const result = { } as TestResult;
        result.name = `${suite.title}.${test.title}`;
        result.uuid = uuidv4();
        result.start = test.TO_START;
        result.duration = test.duration;
        result.suiteName = suite.title;
        result.errors = [];
        return result;
    }

    private endTest(result: any, status: Status): void {
        result.status = status;
        result.stop = Date.now();
        result.duration = result.stop - result.start;
        this.report.stopTestCase(result);
    }
}
