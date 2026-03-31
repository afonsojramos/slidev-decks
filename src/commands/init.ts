import {
  intro,
  outro,
  spinner,
  text,
  cancel,
  isCancel,
  note,
} from "@clack/prompts";
import pc from "picocolors";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { spawn } from "child_process";
import { detectPackageManager } from "../utils/runner.js";
import { SLIDES_TEMPLATE, STYLE_TEMPLATE, DECK_PACKAGE_JSON, applyReplacements } from "../utils/templates.js";

const SCRIPTS = {
  dev: "slidev-decks",
  build: "slidev-decks build",
  export: "slidev-decks export",
  new: "slidev-decks new",
  list: "slidev-decks list",
};

const GITIGNORE_ENTRIES = [
  "node_modules",
  "dist",
  ".slidev",
  "*.local",
  ".DS_Store",
];

function runInstall(pm: string, pkg: string, cwd: string): Promise<number> {
  const args: string[] = [];
  switch (pm) {
    case "bun":
      args.push("add", "-d", pkg);
      break;
    case "pnpm":
      args.push("add", "-D", pkg);
      break;
    case "yarn":
      args.push("add", "-D", pkg);
      break;
    case "npm":
      args.push("install", "-D", pkg);
      break;
  }

  return new Promise((resolve) => {
    const child = spawn(pm, args, { cwd, stdio: "pipe" });
    child.on("close", (code) => resolve(code ?? 1));
    child.on("error", () => resolve(1));
  });
}

export async function init() {
  const cwd = process.cwd();

  intro("slidev-decks init");

  // Check if package.json exists
  const pkgPath = join(cwd, "package.json");
  if (!existsSync(pkgPath)) {
    note(
      "No package.json found. Creating one.",
      "New project"
    );
    writeFileSync(pkgPath, JSON.stringify({ name: "my-talks", private: true }, null, 2) + "\n");
  }

  // Ask for default author
  const author = await text({
    message: "Default author name for new presentations",
    placeholder: "Your Name",
    validate: (v) => {
      if (!v.trim()) return "Author is required";
    },
  });
  if (isCancel(author)) { cancel("Cancelled"); process.exit(0); }

  const pm = detectPackageManager(cwd);
  const s = spinner();

  // 1. Install slidev-decks
  s.start(`Installing slidev-decks with ${pm}`);
  const installCode = await runInstall(pm, "slidev-decks", cwd);
  if (installCode !== 0) {
    s.stop(pc.yellow("Could not install automatically. Run manually:"));
    console.log(`  ${pm} ${pm === "npm" ? "install -D" : "add -D"} slidev-decks\n`);
  } else {
    s.stop(`Installed with ${pm}`);
  }

  // 2. Add scripts to package.json
  s.start("Adding scripts to package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  if (!pkg.scripts) pkg.scripts = {};

  let scriptsAdded = 0;
  for (const [name, cmd] of Object.entries(SCRIPTS)) {
    if (!pkg.scripts[name]) {
      pkg.scripts[name] = cmd;
      scriptsAdded++;
    }
  }

  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  s.stop(`Added ${scriptsAdded} scripts to package.json`);

  // 3. Create decks/_template/
  s.start("Creating template");
  const templateDir = join(cwd, "decks", "_template");
  mkdirSync(templateDir, { recursive: true });

  const templateReplacements = {
    TITLE: "{{TITLE}}",
    SUBTITLE: "{{SUBTITLE}}",
    DESCRIPTION: "{{DESCRIPTION}}",
    AUTHOR: "{{AUTHOR}}",
    YEAR: "{{YEAR}}",
    NAME: "{{NAME}}",
  };

  writeFileSync(
    join(templateDir, "slides.md"),
    SLIDES_TEMPLATE
  );
  writeFileSync(
    join(templateDir, "style.css"),
    STYLE_TEMPLATE
  );
  writeFileSync(
    join(templateDir, "package.json"),
    DECK_PACKAGE_JSON
  );
  s.stop("Created decks/_template/");

  // 4. Create .gitignore if needed
  const gitignorePath = join(cwd, ".gitignore");
  if (!existsSync(gitignorePath)) {
    writeFileSync(gitignorePath, GITIGNORE_ENTRIES.join("\n") + "\n");
  } else {
    const existing = readFileSync(gitignorePath, "utf-8");
    const missing = GITIGNORE_ENTRIES.filter((e) => !existing.includes(e));
    if (missing.length > 0) {
      writeFileSync(
        gitignorePath,
        existing.trimEnd() + "\n\n# slidev-decks\n" + missing.join("\n") + "\n"
      );
    }
  }

  // 5. Store default author in package.json
  pkg["slidev-decks"] = { author: author as string };
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

  note(
    [
      `${pc.bold("Scripts added:")}`,
      ...Object.entries(SCRIPTS).map(([k, v]) => `  ${pc.cyan(k.padEnd(8))} → ${v}`),
      "",
      `${pc.bold("Template:")} decks/_template/`,
      `${pc.bold("Author:")} ${author}`,
    ].join("\n"),
    "Setup complete"
  );

  outro(`Run ${pc.cyan(`${pm === "npm" ? "npm run" : pm} new`)} to create your first presentation`);
}
