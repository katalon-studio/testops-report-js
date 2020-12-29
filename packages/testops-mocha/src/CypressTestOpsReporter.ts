import {
    Execution,
    Metadata,
    ReportLifecycle,
    Status,
    TestOpsConfiguration,
    TestResult,
    TestSuite
} from '@katalon/testops-commons'
import {v4 as uuidv4} from 'uuid';

export class CypressTestOpsReporter {
    private report: ReportLifecycle;

    constructor(config: TestOpsConfiguration) {
        this.report = new ReportLifecycle(config);
    }

    public createTestResult(test: any): TestResult {
        const result = { } as TestResult;
        result.name = test.title.join('.');
        result.uuid = uuidv4();

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
            const execution = this.onExecutionStart(results);
            const runs = results.runs;

            runs.forEach((run: any) => {
                const suite = this.createTestSuite(run.stats);
                const suiteName = run.spec.name;
                suite.name = suiteName;
                suite.parentUuid = execution.uuid;

                run.tests.forEach((test: any) => {
                    const result: TestResult = this.createTestResult(test);
                    result.suiteName = suiteName;
                    this.report.stopTestCase(result);
                })

                this.report.stopTestSuite(suite);
            })

            this.onExecutionFinish(execution);
        }catch (err) {
            console.error(err);
        }
    }

    public createMetadata(): Metadata {
        const metadata = {
            framework: "cypress",
            language: "javascript"
        }
        return metadata
    }

    public createExecution(results: any): Execution {
        const execution = { } as Execution;
        execution.uuid = uuidv4();

        let start = new Date(results.startedTestsAt);
        let stop = new Date(results.endedTestsAt);
        execution.start = start.getTime();
        execution.stop = stop.getTime();
        execution.duration = results.totalDuration;

        if (results.totalFailed > 0) {
            execution.status = Status.FAILED;
            return execution;
        }
        execution.status = Status.PASSED;
        return execution;
    }

    public onExecutionStart(results: any): Execution {
        const metadata: Metadata = this.createMetadata();
        this.report.writeMetadata(metadata);
        return this.createExecution(results);
    }

    public onExecutionFinish(execution: Execution) {
        this.report.stopExecution(execution);
        this.report.writeTestResultsReport();
        this.report.writeTestSuitesReport();
        this.report.writeExecutionReport();
        this.report.upload();
    }
}
