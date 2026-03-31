import { intro, outro, spinner } from "@clack/prompts";
import pc from "picocolors";
import { discoverDecks, fuzzyMatch } from "../utils/discover.js";
import { resolveDeck } from "../utils/picker.js";
import { runSlidev } from "../utils/runner.js";
import { join } from "path";

export async function build(
  query?: string,
  options: { base?: string; out?: string; all?: boolean } = {}
) {
  const cwd = process.cwd();
  const decks = discoverDecks(cwd);

  if (decks.length === 0) {
    console.error(pc.red("No decks found."));
    process.exit(1);
  }

  if (options.all) {
    intro("Building all decks");
    const s = spinner();
    let failed = 0;

    for (const deck of decks) {
      s.start(`Building ${pc.bold(deck.name)}`);
      const outDir = join(cwd, "dist", deck.name);
      const base = options.base
        ? `${options.base.replace(/\/$/, "")}/${deck.name}/`
        : `/${deck.name}/`;

      const code = await runSlidev(deck.path, "build", [
        "--base",
        base,
        "--out",
        outDir,
      ]);

      if (code !== 0) {
        s.stop(pc.red(`Failed: ${deck.name}`));
        failed++;
      } else {
        s.stop(`Built ${pc.bold(deck.name)} → dist/${deck.name}/`);
      }
    }

    if (failed > 0) {
      outro(pc.yellow(`Done with ${failed} failure${failed > 1 ? "s" : ""}`));
      process.exit(1);
    }

    outro(
      `Built ${pc.bold(String(decks.length))} deck${decks.length > 1 ? "s" : ""} → dist/`
    );
    process.exit(0);
  }

  const matches = query ? fuzzyMatch(decks, query) : [];
  const deck = await resolveDeck(decks, matches, query);

  if (!deck) process.exit(0);

  outro(`Building ${pc.bold(deck.name)}`);

  const args: string[] = [];
  if (options.base) args.push("--base", options.base);
  if (options.out) args.push("--out", options.out);

  const code = await runSlidev(deck.path, "build", args);
  process.exit(code);
}
