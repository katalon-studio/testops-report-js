import {
  Status,
  TestSuite,
  TestCreator,
  ReportLifecycle,
  TestOpsConfiguration,
  Metadata,
} from "@katalon/testops-commons";

enum SpecStatus {
  PASSED = "passed",
  FAILED = "failed",
  BROKEN = "broken",
  PENDING = "pending",
  DISABLED = "disabled",
  EXCLUDED = "excluded",
}

export class TestOpsJasmineReporter implements jasmine.CustomReporter {
  reportLifeCycle: ReportLifecycle;
  private testSuites: TestSuite[] = [];

  constructor(config: TestOpsConfiguration) {
    this.reportLifeCycle = new ReportLifecycle(config);
  }

  jasmineStarted(suiteInfo: jasmine.SuiteInfo): void {
    this.reportLifeCycle.startExecution();
  }

  suiteStarted(suite: jasmine.CustomReporterResult): void {
    const testSuite = TestCreator.testSuite(suite.description);
    this.testSuites.push(this.reportLifeCycle.startSuite(testSuite));
  }

  specStarted(spec: jasmine.CustomReporterResult): void {}

  specDone(spec: jasmine.CustomReporterResult): void {
    const testResult = TestCreator.testResult(spec.fullName);
    const currentSuite = this.getCurrentTestSuite();
    testResult.suiteName = currentSuite?.name;
    testResult.parentUuid = currentSuite?.uuid;
    testResult.duration = 0;
    switch (spec.status) {
      case SpecStatus.PENDING:
      case SpecStatus.DISABLED:
      case SpecStatus.EXCLUDED:
        testResult.status = Status.SKIPPED;
        break;
      case SpecStatus.PASSED:
        testResult.status = Status.PASSED;
      case SpecStatus.FAILED:
        testResult.status = Status.FAILED;
      case SpecStatus.BROKEN:
        testResult.status = Status.ERROR;
    }
    this.reportLifeCycle.stopTestCase(testResult);
  }

  suiteDone(suite: jasmine.CustomReporterResult): void {
    const currentSuite = this.getCurrentTestSuite();
    if (currentSuite) {
      this.reportLifeCycle.stopTestSuite(currentSuite.uuid);
    }
    this.testSuites.pop();
  }

  private getCurrentTestSuite(): TestSuite | null {
    const length = this.testSuites.length;
    if (length === 0) return null;
    return this.testSuites[length - 1];
  }

  private get metadata(): Metadata {
    return {
      framework: "jasmine",
      language: "javaScript",
    };
  }

  async jasmineDone(runDetails: jasmine.RunDetails): Promise<void> {
    this.reportLifeCycle.stopExecution();
    this.reportLifeCycle.writeExecutionReport();
    this.reportLifeCycle.writeTestResultsReport();
    this.reportLifeCycle.writeTestSuitesReport();
    this.reportLifeCycle.writeMetadata(this.metadata);
    return this.reportLifeCycle.upload();
  }
}
