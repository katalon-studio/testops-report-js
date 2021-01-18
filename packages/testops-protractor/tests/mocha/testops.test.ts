import { expect } from 'chai';

describe("TestOps reports", () => {
  it("should passed", () => {
    expect(true).to.equal(true);
  });
});

describe("TestOps result", () => {
  it("should failed", () => {
    expect(true).to.equal(false);
  });
});
