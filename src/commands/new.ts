import { intro, text, confirm, select, cancel, outro, isCancel, spinner } from "@clack/prompts";
import pc from "picocolors";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync, cpSync } from "fs";
import { join } from "path";
import { findDecksDir } from "../utils/discover.js";
import { getTemplates, DECK_PACKAGE_JSON, applyReplacements } from "../utils/templates.js";
import { runSlidev } from "../utils/runner.js";

export async function newDeck(nameArg?: string) {
  const cwd = process.cwd();

  intro("New Presentation");

  const decksDir = findDecksDir(cwd) || join(cwd, "decks");

  // Read author from root package.json
  let pkgAuthor = "";
  try {
    const pkg = JSON.parse(readFileSync(join(cwd, "package.json"), "utf-8"));
    if (typeof pkg.author === "string") pkgAuthor = pkg.author;
    else if (pkg.author?.name) pkgAuthor = pkg.author.name;
  } catch {}

  const now = new Date();
  const datePrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const name =
    nameArg ||
    (await (async () => {
      const result = await text({
        message: "Deck name (kebab-case)",
        placeholder: `${datePrefix}-my-talk`,
        validate: (value) => {
          if (!value?.trim()) return "Name is required";
          if (!/^[a-z0-9-]+$/.test(value))
            return "Use lowercase letters, numbers, and hyphens only";
          if (existsSync(join(decksDir, value))) return `${value} already exists`;
        },
      });
      if (isCancel(result)) {
        cancel("Cancelled");
        process.exit(0);
      }
      return result as string;
    })());

  const title = await text({
    message: "Presentation title",
    placeholder: "My Awesome Talk",
    validate: (v) => {
      if (!v?.trim()) return "Title is required";
    },
  });
  if (isCancel(title)) {
    cancel("Cancelled");
    process.exit(0);
  }

  const subtitle = await text({
    message: "Subtitle (optional)",
    placeholder: "A deep dive into...",
  });
  if (isCancel(subtitle)) {
    cancel("Cancelled");
    process.exit(0);
  }

  const author = await text({
    message: "Author",
    defaultValue: pkgAuthor || undefined,
    placeholder: pkgAuthor || "Your Name",
  });
  if (isCancel(author)) {
    cancel("Cancelled");
    process.exit(0);
  }

  const shouldStart = await confirm({
    message: "Start dev server after creating?",
  });
  if (isCancel(shouldStart)) {
    cancel("Cancelled");
    process.exit(0);
  }

  const s = spinner();
  s.start("Creating deck");

  const deckDir = join(decksDir, name);
  mkdirSync(deckDir, { recursive: true });
  const replacements = {
    TITLE: title as string,
    SUBTITLE: (subtitle as string) || "",
    DESCRIPTION: "",
    AUTHOR: (author as string) || "",
    YEAR: now.getFullYear().toString(),
    NAME: name,
  };

  // Discover local templates (_template, _template-*, etc.)
  const localTemplates = existsSync(decksDir)
    ? readdirSync(decksDir).filter(
        (d) => d.startsWith("_template") && existsSync(join(decksDir, d, "slides.md")),
      )
    : [];

  let templateDir: string | null = null;

  if (localTemplates.length === 1) {
    templateDir = join(decksDir, localTemplates[0]);
  } else if (localTemplates.length > 1) {
    s.stop("Multiple templates found");
    const picked = await select({
      message: "Which template?",
      options: localTemplates.map((t) => ({
        value: t,
        label: t.replace(/^_template-?/, "") || "default",
        hint: t,
      })),
    });
    if (isCancel(picked)) {
      cancel("Cancelled");
      process.exit(0);
    }
    templateDir = join(decksDir, picked as string);
    s.start("Creating deck");
  }

  if (templateDir) {
    cpSync(templateDir, deckDir, { recursive: true });
    for (const file of ["slides.md", "package.json", "style.css"]) {
      const filePath = join(deckDir, file);
      if (existsSync(filePath)) {
        const content = readFileSync(filePath, "utf-8");
        writeFileSync(filePath, applyReplacements(content, replacements));
      }
    }
  } else {
    const templates = getTemplates("minimal");
    writeFileSync(join(deckDir, "slides.md"), applyReplacements(templates.slides, replacements));
    writeFileSync(join(deckDir, "style.css"), templates.css);
    writeFileSync(
      join(deckDir, "package.json"),
      applyReplacements(DECK_PACKAGE_JSON, replacements),
    );
  }

  s.stop(`Created ${pc.bold(`decks/${name}`)}`);

  if (shouldStart) {
    outro(`Starting dev server for ${pc.bold(name)}`);
    const code = await runSlidev(deckDir, "");
    process.exit(code);
  } else {
    outro(`Run ${pc.cyan(`slidev-decks ${name}`)} to start the dev server`);
  }
}
