import {Metadata, ReportLifecycle, Status, TestOpsConfiguration, TestResult, TestSuite} from '@katalon/testops-commons'
import {v4 as uuidv4} from 'uuid';

export class CypressTestOpsReporter {
    private report: ReportLifecycle;

    constructor(config: TestOpsConfiguration) {
        this.report = new ReportLifecycle(config);
    }

    public createTestResult(test: any): TestResult {
        const result = { } as TestResult;
        result.name = test.title[1];
        result.uuid = uuidv4();
        result.suiteName = test.title[0];
        const attempts = test.attempts[0];
        result.duration = attempts.duration;
        try {
            let startTime = new Date(attempts.startedAt);
            result.start = startTime.getTime();
            result.stop = result.start + attempts.duration;
        } catch (ignore) {
            // Ignore errors with start, end
        }
        if (test.state === 'passed') {
            result.status = Status.PASSED;
            return result;
        }
        if (test.state === 'failed') {
            result.status = Status.FAILED;
            const { error } = attempts;
            result.errorMessage = error.message;
            result.stackTrace = error.stack;
            return result;
        }
        result.status = Status.SKIPPED;
        return result;
    }

    public createTestSuite(suiteInfo: any): TestSuite {
        const suiteId: string = uuidv4();
        const suite = {} as TestSuite;
        suite.uuid = suiteId;

        let start = new Date(suiteInfo.startedAt);
        let stop = new Date(suiteInfo.endedAt);
        suite.start = start.getTime();
        suite.stop = stop.getTime();

        suite.duration = suiteInfo.duration;
        return suite;
    }

    public parseAndUploadTestResults(results: any) {
        if (!results) return;

        try {
            this.onExecutionStart();
            const runs = results.runs;
            runs.forEach((run: any) => {
                const suite = this.createTestSuite(run.stats);
                run.tests.forEach((test: any) => {
                    const result: TestResult = this.createTestResult(test);
                    this.report.stopTestCase(result);
                    suite.name = test.title[0];
                })
                this.report.startSuite(suite);
                this.report.stopTestSuite(suite.uuid);
            })
            this.onExecutionFinish();
        }catch (err) {
            console.log(err);
        }
    }

    public createMetadata(): Metadata {
        const metadata = {
            framework: "cypress",
            language: "javascript"
        }
        return metadata
    }

    public onExecutionStart() {
        this.report.startExecution();
        const metadata: Metadata = this.createMetadata();
        this.report.writeMetadata(metadata);
    }

    public onExecutionFinish() {
        this.report.stopExecution();
        this.report.writeTestResultsReport();
        this.report.writeTestSuitesReport();
        this.report.writeExecutionReport();
        this.report.upload();
    }
}
