import pc from "picocolors";
import { discoverDecks } from "../utils/discover.js";

export function list() {
  const cwd = process.cwd();
  const decks = discoverDecks(cwd);

  if (decks.length === 0) {
    console.log(pc.dim("No decks found."));
    return;
  }

  console.log();

  const nameWidth = Math.max(...decks.map((d) => d.name.length), 4);

  console.log(
    `  ${pc.dim("Name".padEnd(nameWidth))}  ${pc.dim("Title")}`
  );
  console.log(`  ${pc.dim("─".repeat(nameWidth))}  ${pc.dim("─".repeat(40))}`);

  for (const deck of decks) {
    const date = deck.date ? pc.dim(`[${deck.date}] `) : "";
    const title = deck.title !== deck.name ? deck.title : pc.dim("(no title)");
    console.log(`  ${pc.bold(deck.name.padEnd(nameWidth))}  ${date}${title}`);
  }

  console.log();
  console.log(pc.dim(`  ${decks.length} deck${decks.length === 1 ? "" : "s"} found`));
  console.log();
}
