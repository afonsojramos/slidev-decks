# slidev-decks

CLI companion for managing multiple [Slidev](https://sli.dev) presentations in a single repository.

## Install

```bash
npm install -g slidev-decks
```

Or use directly with `npx`:

```bash
npx slidev-decks
```

## Usage

### Start a dev server

```bash
# Interactive picker
slidev-decks

# Fuzzy match by name or title
slidev-decks ai
slidev-decks react

# Auto-select the most recent deck
slidev-decks -y
```

### Build for production

```bash
slidev-decks build
slidev-decks build ai --base /talks/ai/
```

### Export to PDF

```bash
slidev-decks export
slidev-decks export ai --format pdf
```

### List all decks

```bash
slidev-decks list
```

```
  Name                      Title
  ────────────────────────  ────────────────────────────────────────
  ai-role-in-peoples-lives  The Role of AI in People's Lives
  2026-04-react-conf        React Server Components Deep Dive

  2 decks found
```

## How it works

1. Scans for directories containing `slides.md` in `decks/`, `talks/`, `presentations/`, or the current directory
2. Reads frontmatter metadata (title, date, author) from each deck
3. Presents an interactive TUI picker or fuzzy-matches your query
4. Delegates to the Slidev CLI with the correct working directory
5. Auto-detects your package manager (bun, pnpm, npm, yarn)

## Expected repo structure

```
my-talks/
├── package.json
├── decks/
│   ├── 2026-03-ai-talk/
│   │   ├── slides.md
│   │   └── style.css
│   └── 2026-04-react-conf/
│       └── slides.md
```

The directory name (`decks/`, `talks/`, or `presentations/`) is auto-detected. Folders named `_template` are ignored.

## Alias

The CLI is also available as `sd` for quick access:

```bash
sd ai        # same as slidev-decks ai
sd list      # same as slidev-decks list
```

## License

MIT
