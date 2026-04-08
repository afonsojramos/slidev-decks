import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { join } from "path";
import { mkdirSync, writeFileSync, rmSync } from "fs";
import { detectPackageManager, findProjectRoot, checkSlidevInstalled } from "../src/utils/runner";

const TMP = join(import.meta.dir, "__runner_test");

describe("detectPackageManager", () => {
  beforeEach(() => {
    rmSync(TMP, { recursive: true, force: true });
    mkdirSync(TMP, { recursive: true });
  });

  afterEach(() => {
    rmSync(TMP, { recursive: true, force: true });
  });

  it("detects bun from bun.lock", () => {
    writeFileSync(join(TMP, "bun.lock"), "");
    expect(detectPackageManager(TMP)).toBe("bun");
  });

  it("detects bun from bun.lockb", () => {
    writeFileSync(join(TMP, "bun.lockb"), "");
    expect(detectPackageManager(TMP)).toBe("bun");
  });

  it("detects pnpm from pnpm-lock.yaml", () => {
    writeFileSync(join(TMP, "pnpm-lock.yaml"), "");
    expect(detectPackageManager(TMP)).toBe("pnpm");
  });

  it("detects yarn from yarn.lock", () => {
    writeFileSync(join(TMP, "yarn.lock"), "");
    expect(detectPackageManager(TMP)).toBe("yarn");
  });

  it("defaults to npm when no lockfile", () => {
    expect(detectPackageManager(TMP)).toBe("npm");
  });

  it("prioritizes bun over pnpm", () => {
    writeFileSync(join(TMP, "bun.lock"), "");
    writeFileSync(join(TMP, "pnpm-lock.yaml"), "");
    expect(detectPackageManager(TMP)).toBe("bun");
  });

  it("prioritizes pnpm over yarn", () => {
    writeFileSync(join(TMP, "pnpm-lock.yaml"), "");
    writeFileSync(join(TMP, "yarn.lock"), "");
    expect(detectPackageManager(TMP)).toBe("pnpm");
  });
});

describe("findProjectRoot", () => {
  beforeEach(() => {
    rmSync(TMP, { recursive: true, force: true });
    mkdirSync(TMP, { recursive: true });
  });

  afterEach(() => {
    rmSync(TMP, { recursive: true, force: true });
  });

  it("returns the deck path itself when no ancestor has lockfile", () => {
    const tmpDir = join("/tmp", "__slidev_decks_runner_test");
    rmSync(tmpDir, { recursive: true, force: true });
    const deckDir = join(tmpDir, "decks", "my-talk");
    mkdirSync(deckDir, { recursive: true });
    try {
      expect(findProjectRoot(deckDir)).toBe(deckDir);
    } finally {
      rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it("returns current dir if it has package.json and lockfile", () => {
    writeFileSync(join(TMP, "package.json"), "{}");
    writeFileSync(join(TMP, "bun.lock"), "");
    expect(findProjectRoot(TMP)).toBe(TMP);
  });

  it("walks up to find parent with package.json and lockfile", () => {
    writeFileSync(join(TMP, "package.json"), "{}");
    writeFileSync(join(TMP, "bun.lock"), "");
    const deckDir = join(TMP, "my-talk");
    mkdirSync(deckDir, { recursive: true });
    expect(findProjectRoot(deckDir)).toBe(TMP);
  });

  it("walks up through intermediate dirs without lockfile", () => {
    writeFileSync(join(TMP, "package.json"), "{}");
    writeFileSync(join(TMP, "bun.lock"), "");
    const decksDir = join(TMP, "decks");
    mkdirSync(decksDir, { recursive: true });
    const deckDir = join(decksDir, "my-talk");
    mkdirSync(deckDir, { recursive: true });
    expect(findProjectRoot(deckDir)).toBe(TMP);
  });
});

describe("checkSlidevInstalled", () => {
  beforeEach(() => {
    rmSync(TMP, { recursive: true, force: true });
    mkdirSync(TMP, { recursive: true });
  });

  afterEach(() => {
    rmSync(TMP, { recursive: true, force: true });
  });

  it("returns true when @slidev/cli exists in node_modules", () => {
    mkdirSync(join(TMP, "node_modules", "@slidev", "cli"), { recursive: true });
    expect(checkSlidevInstalled(TMP)).toBe(true);
  });

  it("returns false when @slidev/cli does not exist", () => {
    expect(checkSlidevInstalled(TMP)).toBe(false);
  });
});
