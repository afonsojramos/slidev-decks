import { outro } from "@clack/prompts";
import pc from "picocolors";
import { discoverDecks, fuzzyMatch } from "../utils/discover.js";
import { resolveDeck } from "../utils/picker.js";
import { runSlidev } from "../utils/runner.js";

export async function exportDeck(
  query?: string,
  options: { format?: string; output?: string; passthrough?: string[] } = {},
) {
  const cwd = process.cwd();
  const decks = discoverDecks(cwd);
  const extra = options.passthrough || [];

  if (decks.length === 0) {
    console.error(pc.red("No decks found."));
    process.exit(1);
  }

  const matches = query ? fuzzyMatch(decks, query) : [];
  const deck = await resolveDeck(decks, matches, query);

  if (!deck) {
    process.exit(0);
    return;
  }

  outro(`Exporting ${pc.bold(deck.name)}`);

  const args: string[] = [];
  if (options.format) args.push("--format", options.format);
  if (options.output) args.push("--output", options.output);
  args.push(...extra);

  const code = await runSlidev(deck.path, "export", args);
  process.exit(code);
}
