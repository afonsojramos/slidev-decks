import fg from "fast-glob";
import matter from "gray-matter";
import { readFileSync, existsSync } from "fs";
import { join, basename, dirname } from "path";

export interface Deck {
  name: string;
  path: string;
  entry: string;
  title: string;
  date?: string;
  author?: string;
}

const DEFAULT_DECKS_DIRS = ["decks", "talks", "presentations", "."];
const ENTRY_FILE = "slides.md";

export function findDecksDir(cwd: string): string | null {
  for (const dir of DEFAULT_DECKS_DIRS) {
    const full = dir === "." ? cwd : join(cwd, dir);
    if (existsSync(full)) {
      const entries = fg.sync(`*/${ENTRY_FILE}`, { cwd: full, onlyFiles: true });
      if (entries.length > 0) return full;
    }
  }
  return null;
}

export function discoverDecks(cwd: string): Deck[] {
  const decksDir = findDecksDir(cwd);
  if (!decksDir) return [];

  const entries = fg.sync(`*/${ENTRY_FILE}`, {
    cwd: decksDir,
    onlyFiles: true,
    ignore: ["_template/**", "node_modules/**"],
  });

  return entries
    .map((entry) => {
      const fullPath = join(decksDir, entry);
      const deckDir = dirname(fullPath);
      const name = basename(deckDir);

      let title = name;
      let date: string | undefined;
      let author: string | undefined;

      try {
        const content = readFileSync(fullPath, "utf-8");
        const { data } = matter(content);
        if (data.title) title = data.title;
        if (data.date) date = data.date;
        if (data.author) author = data.author;
      } catch {}

      // Try to extract date from folder name (e.g., 2026-03-ai-talk)
      const dateMatch = name.match(/^(\d{4}-\d{2})/);
      if (dateMatch && !date) date = dateMatch[1];

      return { name, path: deckDir, entry: fullPath, title, date, author };
    })
    .toSorted((a, b) => {
      // Sort by date descending (most recent first), then name
      if (a.date && b.date) return b.date.localeCompare(a.date);
      if (a.date) return -1;
      if (b.date) return 1;
      return a.name.localeCompare(b.name);
    });
}

export function fuzzyMatch(decks: Deck[], query: string): Deck[] {
  const q = query.toLowerCase();
  return decks.filter((d) => d.name.toLowerCase().includes(q) || d.title.toLowerCase().includes(q));
}
