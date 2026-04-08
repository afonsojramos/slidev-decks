import { outro } from "@clack/prompts";
import pc from "picocolors";
import { discoverDecks, fuzzyMatch } from "../utils/discover.js";
import { resolveDeck } from "../utils/picker.js";
import {
  runSlidev,
  findProjectRoot,
  detectPackageManager,
  checkSlidevInstalled,
} from "../utils/runner.js";

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

  // Check if Slidev is installed before proceeding
  const root = findProjectRoot(decks[0].path);
  const pm = detectPackageManager(root);
  if (!checkSlidevInstalled(pm, root)) {
    console.error(
      pc.red("Slidev is not installed.") +
        ` Run ${pc.cyan(`${pm === "npm" ? "npm install" : `${pm} add`} -D @slidev/cli`)} to install it.`,
    );
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
