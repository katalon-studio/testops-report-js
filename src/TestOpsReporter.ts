import {
    TestResult,
    TestSuite,
    Execution,
    Metadata,
    Status,
    ReportLifecycle,
    TestOpsConfiguration,
    TestOpsReportGenerator,
    ReportUploader
} from '@katalon/testops-commons'
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import Mocha from 'mocha'

export class TestOpsReporter {

    private suites: TestSuite[] = [];
    private results: TestResult[] = [];
    private currentTest: TestResult | null = null;
    private currentExecution: Execution | null = null;
    private report: ReportLifecycle;
    private currentSuite: TestSuite | null = this.suites.length > 0 ? this.suites[this.suites.length - 1] : null;

    constructor() {
        const axiosInstance = axios.create();

        const configurationParams: TestOpsConfiguration = {
            username: "anhle@mailinator.com",
            password: "12345678",
            basePath: "http://localhost:8444",
            projectId: 241,
            reportFolder: "./testops-result",
            axiosInstance,
        };
        const reportUploader = new ReportUploader(configurationParams);
        const reportGenerator = new TestOpsReportGenerator(configurationParams);
        this.report = new ReportLifecycle(reportGenerator, reportUploader);
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
        const metadata: Metadata = this.createMetadata()
        this.report.writeMetadata(metadata);
    }

    public onExecutionFinish(): void {
        this.report.writeTestResultsReport();
        this.report.writeTestSuitesReport();
        this.report.stopExecution();
        this.report.writeExecutionReport();
        // this.report.upload();
    }

    public onSuiteStart(suite: any): void {
        const suiteName = suite.fullTitle();
        if (suiteName) {
          console.log('SuiteName: ', suiteName);
          const suiteId: string = uuidv4();
          suite.TO_UUID = suiteId;
          this.currentSuite = {} as TestSuite;
          this.currentSuite.name = suiteName;
          this.report.startSuite(this.currentSuite, suiteId);
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

    public startHook(title: string): void {
        // const suite: TestSuite | null = this.currentSuite;
        // console.log("Execution name: ", title);
    }

    public endHook(error?: Error): void {
        // console.log('End hook: ', error)
        // this.report.writeTestResultsReport()
        // this.report.writeExecutionReport();
        // this.report.writeTestSuitesReport()
        // this.report.stopExecution();
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

        console.log('Test result: ', this.currentTest);
        this.report.stopTestCase(this.currentTest)
        this.currentTest = null;
    }

}
