import { PluginConfig, ProtractorPlugin } from "protractor";

export interface TestOpsPluginConfig extends PluginConfig {}

class TestOpsProtractorPlugin implements ProtractorPlugin {
  config!: TestOpsPluginConfig;

  postResults() {
    return new Promise<void>(() => {});
  }
}

module.exports = new TestOpsProtractorPlugin();
