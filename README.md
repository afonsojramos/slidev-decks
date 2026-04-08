# slidev-decks

<p align="center">
  <a href="https://www.npmjs.com/package/slidev-decks"><img src="https://img.shields.io/npm/v/slidev-decks" alt="npm version" /></a>
  <a href="https://github.com/afonsojramos/slidev-decks/actions/workflows/ci.yml"><img src="https://github.com/afonsojramos/slidev-decks/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="https://github.com/afonsojramos/slidev-decks/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/slidev-decks" alt="license" /></a>
</p>

A lean, zero-config CLI for managing multiple [Slidev](https://sli.dev) presentations in a single repository. Minimal dependencies, no build pipeline integration - just a fast picker and full Slidev CLI pass-through.

Also available as `sd` for quick access.

<p align="center">
  <img src="docs/demo.gif" alt="slidev-decks demo" width="700" />
</p>

## Quick Start

```bash
npx slidev-decks init       # set up repo with scripts + template
npm run new                 # create your first presentation
npm run dev                 # start dev server with deck picker
```

Or install globally with `npm install -g slidev-decks`, or use directly with `npx slidev-decks`.

## Usage

```bash
sd                          # interactive picker
sd ai                       # fuzzy match against folder names and titles
sd -y                       # auto-select most recent deck
sd new                      # create a new presentation (interactive wizard)
sd new 2026-04-my-talk      # pre-fill name, wizard for the rest
sd build ai                 # build for production
sd build ai --base /talks/  # build with custom base path
sd build --all              # build all decks into dist/<name>/
sd build --all -f "2026-*"  # build only matching decks
sd build --all --continue-on-error  # keep going on failures
sd export ai --dark         # export to PDF/PNG/PPTX
sd list                     # list all decks with titles and dates
```

Any flags `slidev-decks` doesn't recognize are forwarded directly to Slidev.

## Features

**Auto-Discovery** — No config needed. Scans for `slides.md` in `decks/`, `talks/`, `presentations/`, or the current directory. Whichever exists first is used.

**Fuzzy Matching** — Pass a query to skip the picker. Matches one deck? Starts immediately. Matches several? Shows a filtered picker.

**Package Manager Detection** — Automatically uses bun, pnpm, npm, or yarn based on your lockfile.

**Frontmatter Metadata** — Reads `title`, `date`, and `author` from each deck's `slides.md` for the picker and `list` output. Also extracts dates from folder names (e.g., `2026-03-my-talk`).

**Incremental Builds** — `build --all` automatically skips decks that haven't changed since the last build, based on file modification times.

**Templates** — Supports multiple local templates via the `_template-*` naming convention. Templates use `{{PLACEHOLDER}}` syntax (`{{TITLE}}`, `{{SUBTITLE}}`, `{{AUTHOR}}`, `{{YEAR}}`, `{{NAME}}`, `{{DESCRIPTION}}`) that gets replaced during deck creation. `init` offers a choice between a minimal and a styled starting template.

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
│   │   └── public/
│   └── 2026-04-react-conf/
│       ├── slides.md
│       └── style.css
```

## GitHub Action

A reusable composite action is included for building and deploying all decks to GitHub Pages.

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

| Input                  | Default  | Description                                                                     |
| ---------------------- | -------- | ------------------------------------------------------------------------------- |
| `base`                 | `/`      | Base path for deployment                                                        |
| `install-command`      | `npm ci` | Command to install dependencies                                                 |
| `slidev-decks-version` | `local`  | Version to install globally (`local` uses the version from your `package.json`) |

## Prior Art

- [antfu/talks](https://github.com/antfu/talks) — Anthony Fu's talks repo with a custom ~40-line picker script
- [slidevjs/slidev#2487](https://github.com/slidevjs/slidev/issues/2487) — Feature request for multi-deck support in Slidev

## License

MIT
