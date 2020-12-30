describe("Async test", () => {
  it("works with async/await", async () => {
    await new Promise((r) => setTimeout(r, 1000));
  });

  it("should be timeout", async () => {
    await new Promise((r) => setTimeout(r, 10000));
  });
});
