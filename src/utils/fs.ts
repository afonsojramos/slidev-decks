import { join } from "path";
import { existsSync, statSync, lstatSync, readdirSync } from "fs";
import type { Deck } from "./discover.js";

export function matchesFilter(name: string, pattern: string): boolean {
  try {
    const regex = new RegExp(
      "^" +
        pattern
          .replace(/[.+^${}()|[\]\\-]/g, "\\$&")
          .replace(/\*\*/g, "{{GLOBSTAR}}")
          .replace(/\*/g, "[^/]*")
          .replace(/\?/g, "[^/]")
          .replace(/\{\{GLOBSTAR\}\}/g, ".*") +
        "$",
    );
    return regex.test(name);
  } catch {
    return pattern === name;
  }
}

export function needsRebuild(deck: Deck, outDir: string): boolean {
  const builtIndex = join(outDir, "index.html");
  if (!existsSync(builtIndex)) return true;

  const builtMtime = statSync(builtIndex).mtimeMs;

  return isNewerThan(deck.path, builtMtime);
}

function isNewerThan(dir: string, threshold: number): boolean {
  if (!existsSync(dir)) return true;
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === ".slidev") continue;
    const full = join(dir, entry.name);
    try {
      const stat = lstatSync(full);
      if (stat.isSymbolicLink()) continue;
      if (stat.isDirectory()) {
        if (isNewerThan(full, threshold)) return true;
      } else {
        if (stat.mtimeMs > threshold) return true;
      }
    } catch {
      // Permission denied or broken path — skip
      continue;
    }
  }
  return false;
}
