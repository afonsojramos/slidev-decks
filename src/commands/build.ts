import { outro } from "@clack/prompts";
import pc from "picocolors";
import { discoverDecks, fuzzyMatch } from "../utils/discover.js";
import { resolveDeck } from "../utils/picker.js";
import { runSlidev } from "../utils/runner.js";

export async function build(query?: string, options: { base?: string; out?: string } = {}) {
  const cwd = process.cwd();
  const decks = discoverDecks(cwd);

  if (decks.length === 0) {
    console.error(pc.red("No decks found."));
    process.exit(1);
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
