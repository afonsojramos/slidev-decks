import { existsSync } from "fs";
import { join, resolve } from "path";
import { spawn, spawnSync } from "child_process";

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

export function findProjectRoot(deckPath: string): string {
  let current = resolve(deckPath);
  const fsRoot = resolve("/");

  while (current !== fsRoot) {
    const parent = resolve(current, "..");
    if (parent === current) break;

    if (
      existsSync(join(parent, "package.json")) &&
      (existsSync(join(parent, "bun.lock")) ||
        existsSync(join(parent, "bun.lockb")) ||
        existsSync(join(parent, "pnpm-lock.yaml")) ||
        existsSync(join(parent, "yarn.lock")) ||
        existsSync(join(parent, "package-lock.json")))
    ) {
      return parent;
    }

    current = parent;
  }

  return deckPath;
}

export function checkSlidevInstalled(pm: PackageManager, cwd: string): boolean {
  const runner = getRunnerCommand(pm);
  const [cmd, ...runnerArgs] = runner.split(" ");
  const result = spawnSync(cmd, [...runnerArgs, "slidev", "--version"], {
    cwd,
    stdio: "pipe",
    shell: false,
  });
  return result.status === 0;
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
