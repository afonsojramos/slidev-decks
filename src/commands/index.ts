import { intro, outro } from "@clack/prompts";
import pc from "picocolors";
import { discoverDecks } from "../utils/discover.js";
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function generateIndexHtml(
  decks: { name: string; title: string; date?: string; author?: string }[],
  base: string,
): string {
  const rows = decks
    .map((d) => {
      const href = `${base.replace(/\/$/, "")}/${encodeURI(d.name)}/`;
      const date = d.date ? `<span class="date">${escapeHtml(d.date)}</span>` : "";
      const author = d.author ? `<span class="author">${escapeHtml(d.author)}</span>` : "";
      const meta = [date, author].filter(Boolean).join(" · ");

      return `    <li>
      <a href="${href}">${escapeHtml(d.title)}</a>
      ${meta ? `<div class="meta">${meta}</div>` : ""}
    </li>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Presentations</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #0f172a;
      color: #e2e8f0;
      min-height: 100vh;
      padding: 4rem 2rem;
    }
    .container {
      max-width: 640px;
      margin: 0 auto;
    }
    h1 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 2rem;
      color: #f8fafc;
    }
    ul { list-style: none; }
    li {
      padding: 1rem 0;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    li:last-child { border-bottom: none; }
    a {
      color: #60a5fa;
      text-decoration: none;
      font-size: 1.1rem;
      font-weight: 500;
    }
    a:hover { text-decoration: underline; }
    .meta {
      color: #64748b;
      font-size: 0.85rem;
      margin-top: 0.25rem;
    }
    .count {
      color: #475569;
      font-size: 0.85rem;
      margin-top: 2rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Presentations</h1>
    <ul>
${rows}
    </ul>
    <p class="count">${decks.length} presentation${decks.length === 1 ? "" : "s"}</p>
  </div>
</body>
</html>
`;
}

export async function index(options: { base?: string; out?: string } = {}) {
  const cwd = process.cwd();
  const decks = discoverDecks(cwd);

  if (decks.length === 0) {
    console.error(pc.red("No decks found."));
    process.exit(1);
  }

  intro("Generating index page");

  const outDir = options.out || join(cwd, "dist");
  const base = options.base || "/";

  mkdirSync(outDir, { recursive: true });

  const html = generateIndexHtml(decks, base);
  const outPath = join(outDir, "index.html");
  writeFileSync(outPath, html);

  outro(
    `Generated ${pc.bold("dist/index.html")} with ${decks.length} deck${decks.length > 1 ? "s" : ""}`,
  );
}
