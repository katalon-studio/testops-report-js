import { browser } from "protractor";

describe("Protractor Demo App", function () {
  it("should have a title", function () {
    browser.get("http://juliemr.github.io/protractor-demo/");

    expect(browser.getTitle()).toEqual(Promise.resolve("Super Calculator"));
  });
});
