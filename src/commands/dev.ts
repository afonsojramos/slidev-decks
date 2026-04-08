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

export async function dev(
  query?: string,
  options: { open?: boolean; port?: string; latest?: boolean; passthrough?: string[] } = {},
) {
  const cwd = process.cwd();
  const decks = discoverDecks(cwd);
  const extra = options.passthrough || [];

  if (decks.length === 0) {
    console.error(
      pc.red("No decks found.") + " Make sure you have a decks/ directory with slides.md files.",
    );
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

  if (options.latest) {
    const deck = decks[0];
    console.log(`  ${pc.green("✓")} Latest: ${pc.bold(deck.name)}\n`);
    outro(`Starting ${pc.bold(deck.name)}`);
    const args = [
      ...(options.open ? ["--open"] : []),
      ...(options.port ? ["--port", options.port] : []),
      ...extra,
    ];
    const code = await runSlidev(deck.path, "", args);
    process.exit(code);
  }

  const matches = query ? fuzzyMatch(decks, query) : [];
  const deck = await resolveDeck(decks, matches, query);

  if (!deck) {
    process.exit(0);
    return;
  }

  outro(`Starting ${pc.bold(deck.name)}`);

  const args: string[] = [];
  if (options.open) args.push("--open");
  if (options.port) args.push("--port", options.port);
  args.push(...extra);

  const code = await runSlidev(deck.path, "", args);
  process.exit(code);
}
