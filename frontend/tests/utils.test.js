// Tests for pure utility functions that don't require a browser or API

describe("cn utility", () => {
  let cn;

  beforeAll(async () => {
    const mod = await import("../src/lib/utils.js");
    cn = mod.cn;
  });

  test("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  test("handles conditional classes", () => {
    expect(cn("foo", false && "bar", "baz")).toBe("foo baz");
  });

  test("deduplicates conflicting tailwind classes (last wins)", () => {
    // tailwind-merge: p-4 overrides p-2
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  test("returns empty string with no arguments", () => {
    expect(cn()).toBe("");
  });
});
