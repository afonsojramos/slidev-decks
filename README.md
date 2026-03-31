# slidev-decks

CLI companion for managing multiple [Slidev](https://sli.dev) presentations in a single repository.

## Quick Start

```bash
npx slidev-decks init       # set up repo with scripts + template
npm run new                 # create your first presentation
npm run dev                 # start dev server with deck picker
```

## Install

```bash
# Recommended: guided setup
npx slidev-decks init

# Or install globally
npm install -g slidev-decks

# Or use directly
npx slidev-decks
```

## Features

### Interactive Deck Picker

Run `slidev-decks` with no arguments to get a TUI selector listing all your presentations. Arrow keys to navigate, enter to select.

### Fuzzy Matching

Pass a query to skip the picker. Matches against folder names and slide titles.

```bash
slidev-decks ai             # matches "2026-03-ai-role-in-peoples-lives"
slidev-decks react          # matches "2026-04-react-server-components"
```

If the query matches multiple decks, you get a filtered picker. If it matches one, it starts immediately.

### Auto-Select Latest

```bash
slidev-decks -y             # starts the most recent deck (sorted by date)
```

### Auto-Discovery

No config needed. The CLI scans for directories containing `slides.md` in:

- `decks/`
- `talks/`
- `presentations/`
- current directory

Whichever exists first is used. Folders prefixed with `_template` are excluded from the picker.

### Full Slidev CLI Pass-Through

Any flags `slidev-decks` doesn't recognize are forwarded directly to Slidev. You get the full power of the Slidev CLI without us having to mirror every option.

```bash
sd export ai --dark --with-clicks --range 1,4-5
sd build ai --download
sd dev ai --remote
```

Running `--help` on `dev`, `build`, or `export` shows Slidev's own help with all available options:

```bash
sd export --help    # shows Slidev's export options (format, dark, timeout, range, etc.)
sd build --help     # shows Slidev's build options (download, base, etc.)
sd dev --help       # shows Slidev's dev options (remote, port, etc.)
sd --help           # shows slidev-decks commands
```

### Package Manager Detection

Automatically detects and uses your package manager (bun, pnpm, npm, yarn) based on the lockfile present in your repo.

### Frontmatter Metadata

Reads `title`, `date`, and `author` from each deck's `slides.md` frontmatter for display in the picker and `list` output. Also extracts dates from folder names (e.g., `2026-03-my-talk`).

### Multiple Templates

Supports multiple local templates using the `_template-*` naming convention:

```
decks/
├── _template/              # default template
├── _template-styled/       # dark mode, Geist font, custom CSS
├── _template-company/      # branded company template
```

When creating a new deck:

- **1 template** found: uses it automatically
- **Multiple templates**: shows a picker to choose
- **No templates**: falls back to a built-in minimal template

### Template Placeholders

Templates support `{{PLACEHOLDER}}` syntax that gets replaced during deck creation:

| Placeholder       | Replaced with                                             |
| ----------------- | --------------------------------------------------------- |
| `{{TITLE}}`       | Presentation title                                        |
| `{{SUBTITLE}}`    | Subtitle                                                  |
| `{{DESCRIPTION}}` | Info/description metadata                                 |
| `{{AUTHOR}}`      | Author name (defaults from `package.json` `author` field) |
| `{{YEAR}}`        | Current year                                              |
| `{{NAME}}`        | Deck folder name                                          |

Placeholders are replaced in `slides.md`, `package.json`, and `style.css`.

### Init with Template Choice

`init` lets you choose between a minimal or styled starting template:

```
? Template style
  > Minimal   (Slidev defaults, no custom CSS)
    Styled    (dark mode, Geist font, callouts, gradients)
```

**Minimal**: `theme: default`, empty `style.css`.

**Styled**: seriph theme, dark mode, Geist Sans/Mono fonts, cover/section gradients, callout cards (`.callout-warning`, `.callout-danger`, `.callout-info`, `.callout-purple`), logo cards, tool cards, stat number styling, and polished blockquotes.

## Commands

### `slidev-decks` / `slidev-decks dev [query]`

Start the Slidev dev server for a deck.

```bash
slidev-decks                # interactive picker
slidev-decks ai             # fuzzy match
slidev-decks -y             # most recent deck
slidev-decks --open         # open browser automatically
slidev-decks -p 8080        # custom port
```

### `slidev-decks new [name]`

Create a new presentation with an interactive wizard.

```bash
slidev-decks new                    # full wizard
slidev-decks new 2026-04-my-talk    # pre-fill name, wizard for the rest
```

Prompts for: deck name (kebab-case validated), title, subtitle, author, and whether to start the dev server.

### `slidev-decks build [query]`

Build a deck for production deployment.

```bash
slidev-decks build                  # picker
slidev-decks build ai               # fuzzy match
slidev-decks build ai --base /talks/ai/
slidev-decks build ai -o dist/ai
```

### `slidev-decks export [query]`

Export a deck to PDF, PNG, or PPTX.

```bash
slidev-decks export                 # picker
slidev-decks export ai              # fuzzy match
slidev-decks export ai --format pdf
slidev-decks export ai -o talk.pdf
```

### `slidev-decks list`

List all discovered decks with titles and dates.

```bash
slidev-decks list
```

```
  Name                      Title
  ────────────────────────  ────────────────────────────────────────
  ai-role-in-peoples-lives  [2026-03] The Role of AI in People's Lives
  2026-04-react-conf        [2026-04] React Server Components Deep Dive

  2 decks found
```

### `slidev-decks init`

One-time guided setup for a multi-deck repo.

```bash
npx slidev-decks init
```

What it does:

- Detects your package manager
- Installs `slidev-decks` as a devDependency
- Adds `dev`, `build`, `export`, `new`, and `list` scripts to `package.json`
- Asks for template style (minimal or styled)
- Creates `decks/_template/` with chosen template
- Adds `.gitignore` entries (node_modules, dist, .slidev)

## Repo Structure

```
my-talks/
├── package.json
├── decks/
│   ├── _template/                  # default template
│   ├── _template-styled/           # optional additional templates
│   ├── 2026-03-ai-talk/
│   │   ├── slides.md
│   │   ├── style.css
│   │   ├── package.json
│   │   └── public/
│   │       └── logos/
│   └── 2026-04-react-conf/
│       ├── slides.md
│       └── style.css
```

The decks directory name is auto-detected. Any of `decks/`, `talks/`, or `presentations/` works.

## Alias

Also available as `sd` for quick access:

```bash
sd              # picker
sd ai           # fuzzy match
sd list         # list decks
sd new          # create deck
sd build ai     # build
```

## GitHub Action

A reusable composite action is included for building and deploying all decks in CI.

```yaml
# .github/workflows/deploy.yml
name: Deploy Presentations

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build all decks
        uses: afonsojramos/slidev-decks/action@main
        with:
          base: "/"
          install-command: "npm ci"

      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

The action builds every deck into `dist/<deck-name>/`, generates an `index.html`, and outputs the `dist` path for deployment.

**Inputs:**

| Input             | Default  | Description                     |
| ----------------- | -------- | ------------------------------- |
| `base`            | `/`      | Base path for deployment        |
| `install-command` | `npm ci` | Command to install dependencies |

## Prior Art

- [antfu/talks](https://github.com/antfu/talks) - Anthony Fu's talks repo with a custom ~40-line picker script
- [slidevjs/slidev#2487](https://github.com/slidevjs/slidev/issues/2487) - Feature request for multi-deck support in Slidev

## License

MIT
