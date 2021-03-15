import { TestOpsJasmineReporter } from "./TestOpsJasmineReporter";
import { ReportLifecycle, TestOpsRuntime } from "@katalon/testops-commons";
import { AttachmentOptions } from "@katalon/testops-commons/dist/src/model";
export class TestOpsJasmine extends TestOpsRuntime {
  constructor(
    protected readonly reportLifecycle: ReportLifecycle,
    protected readonly reporter: TestOpsJasmineReporter
  ) {
    super(reportLifecycle);
  }

  visualCheckpointPath(name: string, options: AttachmentOptions = {}): string {
    const path = super.visualCheckpointPath(name, options);
    this.reporter.addAttachment(path);
    return path;
  }

  visualCheckpoint(
    name: string,
    content: Buffer | string,
    options: AttachmentOptions = {}
  ): string {
    const path = super.visualCheckpoint(name, content, options);
    this.reporter.addAttachment(path);
    return path;
  }
}
