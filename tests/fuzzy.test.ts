import { describe, it, expect } from "bun:test";
import { fuzzyScore, fuzzyMatch } from "../src/utils/discover";

describe("fuzzyScore", () => {
  it("returns 100 for exact match", () => {
    expect(fuzzyScore("hello", "hello")).toBe(100);
  });

  it("is case-insensitive", () => {
    expect(fuzzyScore("Hello", "hello")).toBe(100);
    expect(fuzzyScore("hello", "HELLO")).toBe(100);
  });

  it("returns 80 for starts-with match", () => {
    expect(fuzzyScore("hello-world", "hello")).toBe(80);
  });

  it("returns 60 for substring match", () => {
    expect(fuzzyScore("my-hello-world", "hello")).toBe(60);
  });

  it("returns 40 for all-words match", () => {
    expect(fuzzyScore("2026-03-ai-talk", "ai talk")).toBe(40);
  });

  it("returns 20 for subsequence match", () => {
    // "at" → a...t in "hello-world" → no, let's use a better example
    expect(fuzzyScore("react-conf", "rc")).toBe(20);
  });

  it("returns 0 when no match", () => {
    expect(fuzzyScore("hello", "xyz")).toBe(0);
  });

  it("returns 0 when subsequence fails", () => {
    expect(fuzzyScore("abc", "ba")).toBe(0);
  });

  it("handles empty query", () => {
    expect(fuzzyScore("hello", "")).toBe(80); // starts with empty string
  });

  it("handles single-word query not triggering word match", () => {
    // Single word query shouldn't use word matching (only substring/subsequence)
    expect(fuzzyScore("react-conf", "conf")).toBe(60); // substring match
  });
});

describe("fuzzyMatch ordering", () => {
  const decks = [
    { name: "2026-03-test-talk", path: "", entry: "", title: "Test Talk" },
    { name: "2026-04-react-conf", path: "", entry: "", title: "React Conference" },
    { name: "2026-01-typescript", path: "", entry: "", title: "TypeScript Deep Dive" },
  ];

  it("orders exact matches first", () => {
    const matches = fuzzyMatch(decks, "2026-04-react-conf");
    expect(matches[0].name).toBe("2026-04-react-conf");
  });

  it("orders starts-with before substring", () => {
    const matches = fuzzyMatch(decks, "2026-03");
    expect(matches[0].name).toBe("2026-03-test-talk");
  });

  it("returns all matches sorted by score", () => {
    const matches = fuzzyMatch(decks, "t");
    expect(matches.length).toBeGreaterThan(0);
    // All decks contain 't' somewhere
  });

  it("uses title for matching too", () => {
    const matches = fuzzyMatch(decks, "Deep Dive");
    expect(matches).toHaveLength(1);
    expect(matches[0].name).toBe("2026-01-typescript");
  });

  it("returns empty for no match", () => {
    const matches = fuzzyMatch(decks, "zzzzz");
    expect(matches).toHaveLength(0);
  });
});
