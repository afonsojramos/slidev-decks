import { existsSync } from "fs";
import { join, resolve } from "path";
import { spawn } from "child_process";
import pc from "picocolors";
import type { Deck } from "./discover.js";

type PackageManager = "bun" | "pnpm" | "npm" | "yarn";

export function detectPackageManager(cwd: string): PackageManager {
  if (existsSync(join(cwd, "bun.lock")) || existsSync(join(cwd, "bun.lockb"))) return "bun";
  if (existsSync(join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(join(cwd, "yarn.lock"))) return "yarn";
  return "npm";
}

function getRunnerCommand(pm: PackageManager): string {
  switch (pm) {
    case "bun":
      return "bunx";
    case "pnpm":
      return "pnpm exec";
    case "yarn":
      return "yarn";
    case "npm":
      return "npx";
  }
}

function hasLockfile(dir: string): boolean {
  return (
    existsSync(join(dir, "bun.lock")) ||
    existsSync(join(dir, "bun.lockb")) ||
    existsSync(join(dir, "pnpm-lock.yaml")) ||
    existsSync(join(dir, "yarn.lock")) ||
    existsSync(join(dir, "package-lock.json"))
  );
}

export function findProjectRoot(deckPath: string): string {
  let current = resolve(deckPath);
  const fsRoot = resolve("/");

  while (current !== fsRoot) {
    if (existsSync(join(current, "package.json")) && hasLockfile(current)) {
      return current;
    }

    const parent = resolve(current, "..");
    if (parent === current) break;
    current = parent;
  }

  return deckPath;
}

export function checkSlidevInstalled(root: string): boolean {
  return existsSync(join(root, "node_modules", "@slidev", "cli"));
}

export function ensureSlidevInstalled(decks: Deck[]): void {
  const root = findProjectRoot(decks[0].path);
  const pm = detectPackageManager(root);
  if (!checkSlidevInstalled(root)) {
    console.error(
      pc.red("Slidev is not installed.") +
        ` Run ${pc.cyan(`${pm === "npm" ? "npm install" : `${pm} add`} -D @slidev/cli`)} to install it.`,
    );
    process.exit(1);
  }
}

export function runSlidev(deckPath: string, command: string, args: string[] = []): Promise<number> {
  const root = findProjectRoot(deckPath);
  const pm = detectPackageManager(root);
  const runner = getRunnerCommand(pm);
  const [cmd, ...runnerArgs] = runner.split(" ");

  const fullArgs = [...runnerArgs, "slidev", ...(command ? [command] : []), ...args].filter(
    Boolean,
  );

  return new Promise((res) => {
    const child = spawn(cmd, fullArgs, {
      cwd: deckPath,
      stdio: "inherit",
      shell: false,
    });

    child.on("close", (code: number | null) => res(code ?? 1));
    child.on("error", (err) => {
      if ("code" in err && err.code === "ENOENT") {
        console.error(
          `Error: "${cmd}" not found. Make sure ${pm} is installed and available in your PATH.`,
        );
      } else {
        console.error(`Error running slidev: ${err.message}`);
      }
      res(1);
    });
  });
}
