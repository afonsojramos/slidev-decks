import { intro, outro, spinner } from "@clack/prompts";
import pc from "picocolors";
import { discoverDecks, fuzzyMatch } from "../utils/discover.js";
import { matchesFilter, needsRebuild } from "../utils/fs.js";
import { resolveDeck } from "../utils/picker.js";
import { runSlidev, ensureSlidevInstalled } from "../utils/runner.js";
import { generateIndexHtml } from "./index.js";
import { join } from "path";
import { mkdirSync, writeFileSync } from "fs";

export interface BuildOptions {
  base?: string;
  out?: string;
  all?: boolean;
  filter?: string;
  continueOnError?: boolean;
  passthrough?: string[];
}

export async function build(query?: string, options: BuildOptions = {}) {
  const cwd = process.cwd();
  const decks = discoverDecks(cwd);
  const extra = options.passthrough || [];

  if (decks.length === 0) {
    console.error(pc.red("No decks found."));
    process.exit(1);
  }

  ensureSlidevInstalled(decks);

  if (options.all) {
    let targetDecks = decks;

    if (options.filter) {
      targetDecks = decks.filter((d) => matchesFilter(d.name, options.filter!));
      if (targetDecks.length === 0) {
        console.error(pc.red(`No decks matching "${options.filter}".`));
        process.exit(1);
      }
    }

    intro(`Building ${targetDecks.length} deck${targetDecks.length > 1 ? "s" : ""}`);
    const s = spinner();
    let failed = 0;
    let skipped = 0;
    const failedNames: string[] = [];

    for (let i = 0; i < targetDecks.length; i++) {
      const deck = targetDecks[i];
      const progress = pc.dim(`[${i + 1}/${targetDecks.length}]`);
      const outDir = join(cwd, "dist", deck.name);
      const base = options.base
        ? `${options.base.replace(/\/$/, "")}/${deck.name}/`
        : `/${deck.name}/`;

      // Incremental: skip if nothing changed
      if (!needsRebuild(deck, outDir)) {
        s.start(`${progress} Checking ${pc.bold(deck.name)}`);
        s.stop(`${progress} ${pc.dim("Skipped")} ${deck.name} (unchanged)`);
        skipped++;
        continue;
      }

      s.start(`${progress} Building ${pc.bold(deck.name)}`);

      const code = await runSlidev(deck.path, "build", ["--base", base, "--out", outDir, ...extra]);

      if (code !== 0) {
        s.stop(`${progress} ${pc.red("Failed")} ${deck.name}`);
        failed++;
        failedNames.push(deck.name);
        if (!options.continueOnError) {
          outro(pc.red(`Build failed at ${deck.name}. Use --continue-on-error to keep going.`));
          process.exit(1);
        }
      } else {
        s.stop(`${progress} ${pc.green("Built")} ${pc.bold(deck.name)} → dist/${deck.name}/`);
      }
    }

    // Generate index page for built decks only
    const outDir = join(cwd, "dist");
    const base = options.base || "/";
    mkdirSync(outDir, { recursive: true });
    const html = generateIndexHtml(targetDecks, base);
    writeFileSync(join(outDir, "index.html"), html);

    const built = targetDecks.length - failed - skipped;
    const parts: string[] = [];
    if (built > 0) parts.push(`${built} built`);
    if (skipped > 0) parts.push(`${skipped} skipped`);
    if (failed > 0) parts.push(`${failed} failed`);
    const summary = parts.join(", ");

    if (failed > 0) {
      outro(pc.yellow(`Done (${summary}). Failed: ${failedNames.join(", ")}`));
      process.exit(1);
    }

    outro(`Done (${summary}) + index → dist/`);
    process.exit(0);
  }

  const matches = query ? fuzzyMatch(decks, query) : [];
  const deck = await resolveDeck(decks, matches, query);

  if (!deck) {
    process.exit(0);
    return;
  }

  outro(`Building ${pc.bold(deck.name)}`);

  const args: string[] = [];
  if (options.base) args.push("--base", options.base);
  if (options.out) args.push("--out", options.out);
  args.push(...extra);

  const code = await runSlidev(deck.path, "build", args);
  process.exit(code);
}
