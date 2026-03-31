import { select, cancel, isCancel, intro } from "@clack/prompts";
import pc from "picocolors";
import type { Deck } from "./discover.js";

export async function pickDeck(
  decks: Deck[],
  message: string = "Which deck?"
): Promise<Deck | null> {
  const selected = await select({
    message,
    options: decks.map((d) => ({
      value: d,
      label: d.name,
      hint: d.title !== d.name ? d.title : undefined,
    })),
  });

  if (isCancel(selected)) {
    cancel("Cancelled");
    return null;
  }

  return selected as Deck;
}

export async function resolveDeck(
  decks: Deck[],
  matches: Deck[],
  query?: string
): Promise<Deck | null> {
  if (matches.length === 1) {
    const deck = matches[0];
    console.log(`  ${pc.green("✓")} Matched: ${pc.bold(deck.name)}${deck.title !== deck.name ? pc.dim(` — ${deck.title}`) : ""}\n`);
    return deck;
  }

  if (matches.length > 1) {
    intro(`Multiple decks match ${pc.cyan(`"${query}"`)}`);
    return pickDeck(matches, "Pick one:");
  }

  if (query) {
    intro(`No deck matching ${pc.cyan(`"${query}"`)}`);
  } else {
    intro("slidev-decks");
  }

  return pickDeck(decks);
}
