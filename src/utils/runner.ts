import { existsSync } from "fs";
import { join } from "path";
import { spawn } from "child_process";

type PackageManager = "bun" | "pnpm" | "npm" | "yarn";

export function detectPackageManager(cwd: string): PackageManager {
  if (existsSync(join(cwd, "bun.lock")) || existsSync(join(cwd, "bun.lockb")))
    return "bun";
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

export function runSlidev(
  deckPath: string,
  command: string,
  args: string[] = []
): Promise<number> {
  // Walk up to find the lockfile / root
  let root = deckPath;
  for (let i = 0; i < 5; i++) {
    const parent = join(root, "..");
    if (
      existsSync(join(parent, "package.json")) &&
      (existsSync(join(parent, "bun.lock")) ||
        existsSync(join(parent, "bun.lockb")) ||
        existsSync(join(parent, "pnpm-lock.yaml")) ||
        existsSync(join(parent, "yarn.lock")) ||
        existsSync(join(parent, "package-lock.json")))
    ) {
      root = parent;
    } else {
      break;
    }
  }

  const pm = detectPackageManager(root);
  const runner = getRunnerCommand(pm);
  const [cmd, ...runnerArgs] = runner.split(" ");

  const fullArgs = [...runnerArgs, "slidev", ...(command ? [command] : []), ...args].filter(Boolean);

  return new Promise((resolve) => {
    const child = spawn(cmd, fullArgs, {
      cwd: deckPath,
      stdio: "inherit",
      shell: false,
    });

    child.on("close", (code) => resolve(code ?? 1));
    child.on("error", () => resolve(1));
  });
}
