import { describe, it, expect } from "bun:test";
import { join } from "path";
import { mkdirSync, rmSync } from "fs";
import { discoverDecks, fuzzyMatch, findDecksDir } from "../src/utils/discover";

const FIXTURES = join(import.meta.dir, "fixtures");

describe("findDecksDir", () => {
  it("finds decks/ directory", () => {
    const result = findDecksDir(FIXTURES);
    expect(result).toBe(join(FIXTURES, "decks"));
  });

  it("returns null for empty directory", () => {
    const emptyDir = join(FIXTURES, "__empty_test");
    mkdirSync(emptyDir, { recursive: true });
    try {
      const result = findDecksDir(emptyDir);
      expect(result).toBeNull();
    } finally {
      rmSync(emptyDir, { recursive: true });
    }
  });
});

describe("discoverDecks", () => {
  it("discovers all decks excluding _template", () => {
    const decks = discoverDecks(FIXTURES);
    const names = decks.map((d) => d.name);

    expect(names).toContain("2026-03-test-talk");
    expect(names).toContain("2026-04-another-talk");
    expect(names).not.toContain("_template");
  });

  it("reads frontmatter title", () => {
    const decks = discoverDecks(FIXTURES);
    const testTalk = decks.find((d) => d.name === "2026-03-test-talk");

    expect(testTalk).toBeDefined();
    expect(testTalk!.title).toBe("Test Talk");
  });

  it("reads frontmatter author", () => {
    const decks = discoverDecks(FIXTURES);
    const another = decks.find((d) => d.name === "2026-04-another-talk");

    expect(another).toBeDefined();
    expect(another!.author).toBe("Someone");
  });

  it("extracts date from folder name", () => {
    const decks = discoverDecks(FIXTURES);
    const testTalk = decks.find((d) => d.name === "2026-03-test-talk");

    expect(testTalk!.date).toBe("2026-03");
  });

  it("sorts by date descending", () => {
    const decks = discoverDecks(FIXTURES);

    expect(decks[0].name).toBe("2026-04-another-talk");
    expect(decks[1].name).toBe("2026-03-test-talk");
  });
});

describe("fuzzyMatch", () => {
  const decks = discoverDecks(FIXTURES);

  it("matches by folder name", () => {
    const matches = fuzzyMatch(decks, "test");
    expect(matches).toHaveLength(1);
    expect(matches[0].name).toBe("2026-03-test-talk");
  });

  it("matches by title", () => {
    const matches = fuzzyMatch(decks, "Another");
    expect(matches).toHaveLength(1);
    expect(matches[0].name).toBe("2026-04-another-talk");
  });

  it("matches case-insensitively", () => {
    const matches = fuzzyMatch(decks, "TEST");
    expect(matches).toHaveLength(1);
  });

  it("matches multiple decks", () => {
    const matches = fuzzyMatch(decks, "talk");
    expect(matches).toHaveLength(2);
  });

  it("returns empty for no match", () => {
    const matches = fuzzyMatch(decks, "zzzzz");
    expect(matches).toHaveLength(0);
  });

  it("matches by date prefix", () => {
    const matches = fuzzyMatch(decks, "2026-03");
    expect(matches).toHaveLength(1);
    expect(matches[0].name).toBe("2026-03-test-talk");
  });
});
