import { describe, expect, it } from "@jest/globals";

describe("TestOps reports", () => {
  it("should failed", () => {
    expect(false).toBe(true);
    expect(1).toBe(2);
  });

  it("should throw exception", () => {
    throw new Error("something wrong");
  });

  it.skip("should skipped", () => {
    console.log("it should not run");
  });

  it.each([
    [1, 1, 2],
    [1, 2, 3],
    [2, 1, 4],
  ])("add(%i, %i)", (a, b, expected) => {
    expect(a + b).toBe(expected);
  });

  it.todo("todo test");

  describe("Nested describe", () => {
    it("it should run", () => {
      expect(true).toBe(true);
    });
  });
});

describe("TestOps result", () => {
  it("should failed", () => {
    expect(true).toBe(false);
  });
});
