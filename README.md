# slidev-decks

CLI companion for managing multiple [Slidev](https://sli.dev) presentations in a single repository.

## Quick Start

```bash
# Set up a new multi-deck repo
npx slidev-decks init

# Create your first presentation
npm run new

# Start the dev server
npm run dev
```

## Install

```bash
# Option 1: Initialize a repo (recommended)
npx slidev-decks init

# Option 2: Install globally
npm install -g slidev-decks

# Option 3: Use directly with npx
npx slidev-decks
```

`init` installs `slidev-decks` as a devDependency, adds scripts to your `package.json`, and creates a `decks/_template/` with a ready-to-use slide template.

## Commands

### `slidev-decks` / `slidev-decks dev`

Start a dev server. Picks a deck interactively or by fuzzy match.

```bash
slidev-decks            # TUI picker
slidev-decks ai         # fuzzy match
slidev-decks -y         # auto-select most recent deck
slidev-decks --open     # open browser automatically
```

### `slidev-decks new [name]`

Create a new presentation with an interactive wizard.

```bash
slidev-decks new                    # full wizard
slidev-decks new 2026-04-my-talk    # pre-fill the name
```

Prompts for title, subtitle, and author. Uses `decks/_template/` if it exists, otherwise falls back to the built-in template. Optionally starts the dev server after creation.

### `slidev-decks build [query]`

Build a deck for production.

```bash
slidev-decks build ai --base /talks/ai/
```

### `slidev-decks export [query]`

Export a deck to PDF, PNG, or PPTX.

```bash
slidev-decks export ai --format pdf
```

### `slidev-decks list`

List all discovered decks with their titles.

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

### `slidev-decks init`

Set up a multi-deck repo. Runs once.

```bash
npx slidev-decks init
```

This will:
- Install `slidev-decks` as a devDependency
- Add `dev`, `build`, `export`, `new`, and `list` scripts to `package.json`
- Create `decks/_template/` with slides, styles, and Geist font
- Add `.gitignore` entries

## How it works

1. Scans for directories containing `slides.md` in `decks/`, `talks/`, `presentations/`, or the current directory
2. Reads frontmatter metadata (title, date, author) from each deck
3. Presents an interactive TUI picker or fuzzy-matches your query
4. Delegates to the Slidev CLI with the correct working directory
5. Auto-detects your package manager (bun, pnpm, npm, yarn)

## Repo structure

```
my-talks/
├── package.json
├── decks/
│   ├── _template/          # used by `slidev-decks new`
│   │   ├── slides.md
│   │   ├── style.css
│   │   └── package.json
│   ├── 2026-03-ai-talk/
│   │   ├── slides.md
│   │   ├── style.css
│   │   └── public/
│   └── 2026-04-react-conf/
│       └── slides.md
```

The directory name (`decks/`, `talks/`, or `presentations/`) is auto-detected. Folders named `_template` are ignored by the picker.

## Alias

Also available as `sd`:

```bash
sd ai        # same as slidev-decks ai
sd list      # same as slidev-decks list
```

## License

MIT
