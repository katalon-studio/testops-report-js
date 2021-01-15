import { browser } from "protractor";

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const expect = chai.expect;

describe("no protractor at all", function () {
  it("should still do normal tests", function () {
    expect(true).to.equal(true);
  });
});

describe("protractor library", function () {
  it.skip("should be able to skip tests", function () {
    expect(true).to.equal(false);
  });

  it("should expose the correct global variables", function () {
    expect(protractor).to.exist;
    expect(browser).to.exist;
    expect(by).to.exist;
    expect(element).to.exist;
    expect($).to.exist;
  });

  it("should wrap webdriver", function () {
    // Mocha will report the spec as slow if it goes over this time in ms.
    this.slow(6000);
    browser.get("http://juliemr.github.io/protractor-demo/");
    expect(browser.getTitle()).to.eventually.equal("Super Calculator");
  });
});
