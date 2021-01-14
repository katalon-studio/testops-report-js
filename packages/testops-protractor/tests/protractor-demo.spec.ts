describe("Protractor Demo App", function () {
  it("should have a title", function () {
    browser.get("http://juliemr.github.io/protractor-demos/");

    expect(browser.getTitle()).toEqual("Super Calculator");
  });
});
