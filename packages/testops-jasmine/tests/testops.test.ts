describe("TestOps test", () => {
  it("should passed", () => {
    expect(true).toBe(true);
  });

  it("should failed", () => {
    expect(true).toBe(false);
  });
});

describe("Outer describe block", () => {
  it("outer test", () => {
    expect(true).toBe(false);
  });
  describe("Inner describe block", () => {
    it("inner test", () => {
      expect(true).toBe(false);
    });
  });
});
