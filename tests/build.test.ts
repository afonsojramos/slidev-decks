import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { join } from "path";
import { mkdirSync, writeFileSync, rmSync, utimesSync } from "fs";
import { matchesFilter, needsRebuild } from "../src/utils/fs";

describe("matchesFilter", () => {
  it("matches exact name", () => {
    expect(matchesFilter("2026-03-test-talk", "2026-03-test-talk")).toBe(true);
  });

  it("matches with wildcard", () => {
    expect(matchesFilter("2026-03-test-talk", "2026-03-*")).toBe(true);
    expect(matchesFilter("2026-04-react-conf", "2026-03-*")).toBe(false);
  });

  it("matches with year prefix", () => {
    expect(matchesFilter("2026-03-test-talk", "2026-*")).toBe(true);
    expect(matchesFilter("2025-12-old-talk", "2026-*")).toBe(false);
  });

  it("matches with question mark", () => {
    expect(matchesFilter("2026-03-ai", "2026-0?-ai")).toBe(true);
    expect(matchesFilter("2026-03-ai", "2026-0?-bi")).toBe(false);
  });

  it("matches all with single wildcard", () => {
    expect(matchesFilter("anything", "*")).toBe(true);
  });

  it("does not match partial without wildcard", () => {
    expect(matchesFilter("2026-03-test-talk", "2026-03")).toBe(false);
  });

  it("handles special regex characters in pattern", () => {
    expect(matchesFilter("my.talk", "my.talk")).toBe(true);
    expect(matchesFilter("myXtalk", "my.talk")).toBe(false);
  });

  it("falls back to exact match on invalid regex pattern", () => {
    expect(matchesFilter("test", "[invalid")).toBe(false);
    expect(matchesFilter("[invalid", "[invalid")).toBe(true);
  });
});

describe("needsRebuild", () => {
  const TMP = join(import.meta.dir, "__build_test");

  beforeEach(() => {
    rmSync(TMP, { recursive: true, force: true });
    mkdirSync(TMP, { recursive: true });
  });

  afterEach(() => {
    rmSync(TMP, { recursive: true, force: true });
  });

  it("returns true when output directory does not exist", () => {
    const deckDir = join(TMP, "deck");
    const outDir = join(TMP, "out");
    mkdirSync(deckDir, { recursive: true });
    writeFileSync(join(deckDir, "slides.md"), "# Test");
    const deck = { name: "test", path: deckDir, entry: join(deckDir, "slides.md"), title: "Test" };
    expect(needsRebuild(deck, outDir)).toBe(true);
  });

  it("returns true when source is newer than output", () => {
    const deckDir = join(TMP, "deck");
    const outDir = join(TMP, "out");
    mkdirSync(deckDir, { recursive: true });
    mkdirSync(outDir, { recursive: true });

    const oldTime = new Date("2025-01-01");
    writeFileSync(join(outDir, "index.html"), "<html></html>");
    utimesSync(join(outDir, "index.html"), oldTime, oldTime);

    writeFileSync(join(deckDir, "slides.md"), "# Test");

    const deck = { name: "test", path: deckDir, entry: join(deckDir, "slides.md"), title: "Test" };
    expect(needsRebuild(deck, outDir)).toBe(true);
  });

  it("returns false when output is newer than source", () => {
    const deckDir = join(TMP, "deck");
    const outDir = join(TMP, "out");
    mkdirSync(deckDir, { recursive: true });
    mkdirSync(outDir, { recursive: true });

    const oldTime = new Date("2025-01-01");
    writeFileSync(join(deckDir, "slides.md"), "# Test");
    utimesSync(join(deckDir, "slides.md"), oldTime, oldTime);

    writeFileSync(join(outDir, "index.html"), "<html></html>");

    const deck = { name: "test", path: deckDir, entry: join(deckDir, "slides.md"), title: "Test" };
    expect(needsRebuild(deck, outDir)).toBe(false);
  });
});
