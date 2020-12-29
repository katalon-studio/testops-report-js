describe("TestOps reports", () => {
  it("should passed", () => {
    expect(true).toBe(true);
  });

  it("should passed too", () => {
    expect(true).toBe(true);
  });

  describe("Nested describe", () => {
    it("test should run", () => {
      expect(true).toBe(true);
    });
  })
});

describe("TestOps result", () => {
  it("should failed", () => {
    expect(false).toBe(false);
  });
});