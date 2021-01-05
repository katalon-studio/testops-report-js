import {
  Error,
  Status,
  TestCreator,
  ReportLifecycle,
  Metadata,
  Execution,
  TestSuite,
  TestResult,
} from "@katalon/testops-commons";
import {
  Reporter,
  Context,
  ReporterOnStartOptions,
  Test,
} from "@jest/reporters";
import {
  AggregatedResult,
  TestResult as JestTestResult,
} from "@jest/test-result";
import stripAnsi from "strip-ansi";
import { AssertionResult } from "@jest/types/build/TestResult";

const METADATA_FRAMEWORK: string = "jest";
const METADATA_LANGUAGE: string = "javascript";

export class TestOpsJestReporter
  implements Pick<Reporter, "onRunComplete" | "onTestResult" | "onRunStart"> {
  private globalConfig;
  private options;
  private currentExecution: Execution | null = null;
  private reportLifecycle: ReportLifecycle;

  constructor(globalConfig: any, options: any) {
    this.globalConfig = globalConfig;
    this.options = options;
    this.reportLifecycle = new ReportLifecycle(this.options);
  }

  onRunStart(results: AggregatedResult, options: ReporterOnStartOptions) {
    const execution = TestCreator.execution();
    this.currentExecution = this.reportLifecycle.startExecution(execution);
  }

  onTestResult(
    test: Test,
    testResult: JestTestResult,
    aggregatedResult: AggregatedResult
  ) {
    const { testResults = [] } = testResult;
    if (testResults.length > 0) {
      const testSuite = this.buildTestSuite(testResult);
      this.reportLifecycle.startSuite(testSuite);
      testResults.forEach((testResult) => {
        const testOpsResult = this.buildTestResult(testResult, testSuite);
        this.reportLifecycle.stopTestCase(testOpsResult);
      });
      this.reportLifecycle.stopTestSuite(testSuite);
    }
  }

  onRunComplete(contexts: Set<Context>, results: AggregatedResult) {
    if (this.currentExecution === null) {
      throw new Error("No active execution");
    }
    this.reportLifecycle.stopExecution(this.currentExecution);

    this.reportLifecycle.writeTestResultsReport();
    this.reportLifecycle.writeTestSuitesReport();
    this.reportLifecycle.writeExecutionReport();
    this.reportLifecycle.writeMetadata(this.metaData);
    this.reportLifecycle.upload();
  }

  private get metaData(): Metadata {
    return {
      framework: METADATA_FRAMEWORK,
      language: METADATA_LANGUAGE,
      reportFolder: this.options.reportFolder,
      buildLabel: this.options.buildLabel,
      buildUrl: this.options.buildUrl,
    };
  }

  private buildTestResult(
    testResult: AssertionResult,
    testSuite: TestSuite
  ): TestResult {
    const { fullName, duration, status, failureMessages } = testResult;
    const testOpsResult = TestCreator.testResult(fullName);
    testOpsResult.duration = duration || 0;
    testOpsResult.status = this.convertStatus(status);
    testOpsResult.parentUuid = testSuite.uuid;
    testOpsResult.suiteName = testSuite.name;
    if (failureMessages) {
      failureMessages.forEach((m) => {
        const error: Error = {};
        error.message = "";
        error.stackTrace = stripAnsi(m);
        testOpsResult.errors = testOpsResult.errors || [];
        testOpsResult.errors.push(error);
      });
    }
    //test result does not have start stop, so we take it from test suite
    testOpsResult.start = testSuite.start;
    testOpsResult.stop = testSuite.start + testOpsResult.duration;
    return testOpsResult;
  }

  private buildTestSuite(testResult: JestTestResult): TestSuite {
    const { testResults = [], perfStats } = testResult;
    const ancestorTitle = testResults[0].ancestorTitles[0];
    const suiteName = ancestorTitle || "No name";
    const testSuite = TestCreator.testSuite(suiteName);
    testSuite.start = perfStats.start;
    testSuite.stop = perfStats.end;
    testSuite.duration = perfStats.runtime;
    return testSuite;
  }

  private convertStatus(status: string) {
    switch (status) {
      case "passed":
        return Status.PASSED;
      case "failed":
        return Status.FAILED;
      case "pending":
      case "skipped":
      case "disabled":
      case "todo":
      default:
        return Status.SKIPPED;
    }
  }
}
