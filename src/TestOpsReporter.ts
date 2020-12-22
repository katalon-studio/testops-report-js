import {
    TestResult,
    TestSuite,
    Execution,
    Status,
    ReportLifecycle,
    TestOpsConfiguration,
    TestOpsReportGenerator
} from '@katalon/testops-commons'
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";

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
        const reportGenerator = new TestOpsReportGenerator(configurationParams);
        this.report = new ReportLifecycle(reportGenerator);
    }

    public startSuite(suiteName: string): void {
        console.log('SuiteName: ', suiteName);
        const suiteId: string = uuidv4();
        this.currentSuite = { } as TestSuite;
        this.currentSuite.uuid = suiteId;
        this.currentSuite.name = suiteName;
        this.report.startSuite(this.currentSuite, suiteId);
        console.log('current test suite: ', this.currentSuite)
        console.log('report lycivle    :', this.report)
        this.pushSuite(this.currentSuite);
    }

    public pushSuite(suite: TestSuite): void {
        this.suites.push(suite);
    }

    public startHook(title: string): void {
        const suite: TestSuite | null = this.currentSuite;
        console.log("Execution name: ", title);
        this.report.startExecution();
    }

    public endHook(error?: Error): void {
        console.log('End hook: ', error)
        // this.report.writeTestResultsReport()
        // this.report.writeExecutionReport();
        // this.report.writeTestSuitesReport()
        // this.report.stopExecution();
    }

    public startCase(test: Mocha.Test, start: number = Date.now()): void {
        if (this.currentSuite === null) {
            throw new Error("No active suite");
        }
        this.currentTest = { } as TestSuite;
        this.currentTest.name = test.title;
        this.currentTest.uuid = uuidv4();
        this.currentTest.start = start;
        this.currentTest.duration = test.duration;
        this.currentTest.suiteName = this.currentSuite.name;
    }

    public passTestCase(test: Mocha.Test): void {
        if (this.currentTest === null) {
            this.startCase(test);
        }
        this.endTest(Status.PASSED);
    }

    public pendingTestCase(test: Mocha.Test): void {
        this.startCase(test);
        this.endTest(Status.SKIPPED);
    }

    public failTestCase(test: Mocha.Test, error: Error): void {
        if (this.currentTest === null) {
            this.startCase(test);
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
        console.log('report lycivle  end test  :', this.report)
        this.currentTest = null;
    }

    public endSuite(): void {
        console.log('onEndSuite')
        console.log('report lycivle  end alllllll before :', this.report)
        this.report.writeTestResultsReport();

        if (this.currentSuite?.uuid) {
            this.report.stopTestSuite(this.currentSuite.uuid)
        };
        this.report.writeExecutionReport();
        this.report.writeTestSuitesReport()
        console.log('report lycivle  end alllllll  :', this.report)
        this.report.stopExecution();
    }

}
