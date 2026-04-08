import matter from "gray-matter";
import { readFileSync, readdirSync, existsSync } from "fs";
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
const IGNORED_DIRS = new Set(["_template", "node_modules"]);

function findEntryFiles(base: string): string[] {
  if (!existsSync(base)) return [];
  return readdirSync(base, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !IGNORED_DIRS.has(d.name))
    .map((d) => join(d.name, ENTRY_FILE))
    .filter((rel) => existsSync(join(base, rel)));
}

export function findDecksDir(cwd: string): string | null {
  for (const dir of DEFAULT_DECKS_DIRS) {
    const full = dir === "." ? cwd : join(cwd, dir);
    if (findEntryFiles(full).length > 0) return full;
  }
  return null;
}

export function discoverDecks(cwd: string): Deck[] {
  const decksDir = findDecksDir(cwd);
  if (!decksDir) return [];

  const entries = findEntryFiles(decksDir);

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
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn(`  Warning: could not read ${fullPath}: ${msg}`);
      }

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

/**
 * Score how well a query matches a target string.
 * Returns 0 for no match, higher is better.
 *
 * Scoring priorities:
 * - Exact match: 100
 * - Starts with query: 80
 * - Substring match: 60
 * - All query words found: 40
 * - Subsequence match (characters in order): 20
 */
export function fuzzyScore(target: string, query: string): number {
  const t = target.toLowerCase();
  const q = query.toLowerCase();

  if (q.length === 0) return 0;
  if (t === q) return 100;
  if (t.startsWith(q)) return 80;
  if (t.includes(q)) return 60;

  // Word matching: all query words must appear somewhere in target
  const queryWords = q.split(/[\s-]+/).filter(Boolean);
  if (queryWords.length > 1) {
    const allWordsFound = queryWords.every((w) => t.includes(w));
    if (allWordsFound) return 40;
  }

  // Subsequence match: all query chars appear in order
  let ti = 0;
  for (let qi = 0; qi < q.length; qi++) {
    const idx = t.indexOf(q[qi], ti);
    if (idx === -1) return 0;
    ti = idx + 1;
  }
  return 20;
}

export function fuzzyMatch(decks: Deck[], query: string): Deck[] {
  const scored = decks
    .map((d) => ({
      deck: d,
      score: Math.max(fuzzyScore(d.name, query), fuzzyScore(d.title, query)),
    }))
    .filter((s) => s.score > 0)
    .toSorted((a, b) => b.score - a.score);

  return scored.map((s) => s.deck);
}
