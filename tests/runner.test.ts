import { describe, it, expect } from "bun:test";
import { join } from "path";
import { mkdirSync, writeFileSync, rmSync } from "fs";
import { detectPackageManager, findProjectRoot } from "../src/utils/runner";

const TMP = join(import.meta.dir, "__runner_test");

function setup() {
  rmSync(TMP, { recursive: true, force: true });
  mkdirSync(TMP, { recursive: true });
}

function teardown() {
  rmSync(TMP, { recursive: true, force: true });
}

describe("detectPackageManager", () => {
  it("detects bun from bun.lock", () => {
    setup();
    writeFileSync(join(TMP, "bun.lock"), "");
    expect(detectPackageManager(TMP)).toBe("bun");
    teardown();
  });

  it("detects bun from bun.lockb", () => {
    setup();
    writeFileSync(join(TMP, "bun.lockb"), "");
    expect(detectPackageManager(TMP)).toBe("bun");
    teardown();
  });

  it("detects pnpm from pnpm-lock.yaml", () => {
    setup();
    writeFileSync(join(TMP, "pnpm-lock.yaml"), "");
    expect(detectPackageManager(TMP)).toBe("pnpm");
    teardown();
  });

  it("detects yarn from yarn.lock", () => {
    setup();
    writeFileSync(join(TMP, "yarn.lock"), "");
    expect(detectPackageManager(TMP)).toBe("yarn");
    teardown();
  });

  it("defaults to npm when no lockfile", () => {
    setup();
    expect(detectPackageManager(TMP)).toBe("npm");
    teardown();
  });

  it("prioritizes bun over pnpm", () => {
    setup();
    writeFileSync(join(TMP, "bun.lock"), "");
    writeFileSync(join(TMP, "pnpm-lock.yaml"), "");
    expect(detectPackageManager(TMP)).toBe("bun");
    teardown();
  });

  it("prioritizes pnpm over yarn", () => {
    setup();
    writeFileSync(join(TMP, "pnpm-lock.yaml"), "");
    writeFileSync(join(TMP, "yarn.lock"), "");
    expect(detectPackageManager(TMP)).toBe("pnpm");
    teardown();
  });
});

describe("findProjectRoot", () => {
  it("returns the deck path itself when no parent has lockfile", () => {
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

  it("walks up to find parent with package.json and lockfile", () => {
    setup();
    writeFileSync(join(TMP, "package.json"), "{}");
    writeFileSync(join(TMP, "bun.lock"), "");
    const deckDir = join(TMP, "my-talk");
    mkdirSync(deckDir, { recursive: true });
    expect(findProjectRoot(deckDir)).toBe(TMP);
    teardown();
  });

  it("walks up through intermediate dirs without lockfile", () => {
    setup();
    // Simulate: TMP (root with lockfile) > decks > my-talk
    writeFileSync(join(TMP, "package.json"), "{}");
    writeFileSync(join(TMP, "bun.lock"), "");
    const decksDir = join(TMP, "decks");
    mkdirSync(decksDir, { recursive: true });
    const deckDir = join(decksDir, "my-talk");
    mkdirSync(deckDir, { recursive: true });
    expect(findProjectRoot(deckDir)).toBe(TMP);
    teardown();
  });
});
