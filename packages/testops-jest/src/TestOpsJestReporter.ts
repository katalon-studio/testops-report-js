import {
  Status,
  TestCreator,
  ReportLifecycle,
  Metadata,
  Execution,
  TestSuite,
} from "@katalon/testops-commons";
import {
  Reporter,
  Context,
  ReporterOnStartOptions,
  Test,
} from "@jest/reporters";
import {
  AggregatedResult,
  TestCaseResult,
  TestResult,
} from "@jest/test-result";
import { AssertionResult } from "@jest/types/build/TestResult";

export class TestOpsJestReporter
  implements
    Pick<Reporter, "onRunComplete" | "onTestResult" | "onTestCaseResult"> {
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

  onTestFileStart(test: Test) {
    console.log("test file start");
  }

  onTestStart(test: Test) {
    console.log("test start ");
  }

  onTestCaseResult(test: Test, testCaseResult: TestCaseResult) {
    console.log("Test case result");
    // console.log(test);
    // console.log(testCaseResult);
  }

  onTestResult(
    test: Test,
    testResult: TestResult,
    aggregatedResult: AggregatedResult
  ) {
    const { testResults = [], perfStats } = testResult;
    if (testResults.length > 0) {
      const ancestorTitle = testResults[0].ancestorTitles[0];
      const suiteName = ancestorTitle || "No name";
      const testSuite = TestCreator.testSuite(suiteName);
      testSuite.start = perfStats.start;
      testSuite.stop = perfStats.end;
      testSuite.duration = perfStats.runtime;
      this.reportLifecycle.startSuite(testSuite);
      testResults.forEach((testResult) => {
        const testOpsResult = this.convertTestResult(testResult, testSuite);
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
    this.reportLifecycle.writeMetadata(this.getMetadata());
    this.reportLifecycle.upload();
  }

  private getMetadata(): Metadata {
    return {
      framework: "jest",
      language: "javascript",
    };
  }

  private convertTestResult(testResult: AssertionResult, testSuite: TestSuite) {
    const { fullName, duration, status } = testResult;
    const testOpsResult = TestCreator.testResult(fullName);
    testOpsResult.duration = duration || 0;
    testOpsResult.status = this.convertStatus(status);
    testOpsResult.parentUuid = testSuite.uuid;
    testOpsResult.suiteName = testSuite.name;
    
    //test result does not have start stop, so we take it from test suite
    testOpsResult.start = testSuite.start;
    testOpsResult.stop = testSuite.start + testOpsResult.duration;
    return testOpsResult;
  }

  // private buildTestSuite(testResult: TestResult): TestSuite {
  // }

  private convertStatus(status: string) {
    switch (status) {
      case "passed":
        return Status.PASSED;
      case "faile":
        return Status.FAILED;
      case "error":
        return Status.ERROR;
      case "pending":
      case "skipped":
      case "disabled":
        return Status.SKIPPED;
      case "todo":
        return Status.INCOMPLETE;
      default:
        return Status.INCOMPLETE;
    }
  }
}
