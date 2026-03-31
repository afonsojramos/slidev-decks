import { intro, outro, spinner, select, cancel, isCancel, note } from "@clack/prompts";
import pc from "picocolors";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { spawn } from "child_process";
import { detectPackageManager } from "../utils/runner.js";
import { getTemplates, DECK_PACKAGE_JSON, type TemplateStyle } from "../utils/templates.js";

const SCRIPTS = {
  dev: "slidev-decks",
  build: "slidev-decks build",
  export: "slidev-decks export",
  new: "slidev-decks new",
  list: "slidev-decks list",
};

const GITIGNORE_ENTRIES = ["node_modules", "dist", ".slidev", "*.local", ".DS_Store"];

function runInstall(pm: string, packages: string[], cwd: string): Promise<number> {
  const args: string[] = [];
  switch (pm) {
    case "bun":
      args.push("add", "-d", ...packages);
      break;
    case "pnpm":
      args.push("add", "-D", ...packages);
      break;
    case "yarn":
      args.push("add", "-D", ...packages);
      break;
    case "npm":
      args.push("install", "-D", ...packages);
      break;
  }

  return new Promise((resolve) => {
    const child = spawn(pm, args, { cwd, stdio: "pipe" });
    child.on("close", (code: number | null) => resolve(code ?? 1));
    child.on("error", () => resolve(1));
  });
}

export async function init() {
  const cwd = process.cwd();

  intro("slidev-decks init");

  // Check if package.json exists
  const pkgPath = join(cwd, "package.json");
  if (!existsSync(pkgPath)) {
    note("No package.json found. Creating one.", "New project");
    writeFileSync(pkgPath, JSON.stringify({ name: "my-talks", private: true }, null, 2) + "\n");
  }

  // Ask for template style
  const templateStyle = await select({
    message: "Template style",
    options: [
      {
        value: "minimal" as TemplateStyle,
        label: "Minimal",
        hint: "Slidev defaults, no custom CSS",
      },
      {
        value: "styled" as TemplateStyle,
        label: "Styled",
        hint: "dark mode, Geist font, callouts, gradients",
      },
    ],
  });
  if (isCancel(templateStyle)) {
    cancel("Cancelled");
    process.exit(0);
    return;
  }

  const style = templateStyle as TemplateStyle;
  const pm = detectPackageManager(cwd);
  const s = spinner();

  // 1. Install slidev-decks + @slidev/cli + theme
  const theme = style === "styled" ? "@slidev/theme-seriph" : "@slidev/theme-default";
  const packages = ["slidev-decks", "@slidev/cli", theme];

  s.start(`Installing ${packages.join(", ")} with ${pm}`);
  const installCode = await runInstall(pm, packages, cwd);
  if (installCode !== 0) {
    s.stop(pc.yellow("Could not install automatically. Run manually:"));
    console.log(`  ${pm} ${pm === "npm" ? "install -D" : "add -D"} ${packages.join(" ")}\n`);
  } else {
    s.stop(`Installed ${packages.length} packages with ${pm}`);
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

  const templates = getTemplates(style);

  writeFileSync(join(templateDir, "slides.md"), templates.slides);
  writeFileSync(join(templateDir, "style.css"), templates.css);
  writeFileSync(join(templateDir, "package.json"), DECK_PACKAGE_JSON);
  s.stop(`Created decks/_template/ (${style})`);

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
        existing.trimEnd() + "\n\n# slidev-decks\n" + missing.join("\n") + "\n",
      );
    }
  }

  note(
    [
      `${pc.bold("Scripts added:")}`,
      ...Object.entries(SCRIPTS).map(([k, v]) => `  ${pc.cyan(k.padEnd(8))} → ${v}`),
      "",
      `${pc.bold("Template:")} decks/_template/ (${style})`,
    ].join("\n"),
    "Setup complete",
  );

  outro(`Run ${pc.cyan(`${pm === "npm" ? "npm run" : pm} new`)} to create your first presentation`);
}
