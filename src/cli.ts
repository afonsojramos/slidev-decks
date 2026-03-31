import cac from "cac";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, "..", "package.json"), "utf-8"));
const version = pkg.version as string;

// Check if --help is being passed to a slidev-proxied command
// In that case, forward it to slidev instead of showing our help
const args = process.argv.slice(2);
const slidevCommands = ["dev", "build", "export"];
const isHelpForSlidev =
  args.includes("--help") &&
  args.length >= 2 &&
  slidevCommands.includes(args[0]);

if (isHelpForSlidev) {
  const cmd = args[0] === "dev" ? "" : args[0];
  const { runSlidev } = await import("./utils/runner.js");
  const code = await runSlidev(process.cwd(), cmd, ["--help"]);
  process.exit(code);
}

const cli = cac("slidev-decks");

cli
  .command("[query]", "Start dev server for a deck (default command)")
  .alias("dev")
  .option("-o, --open", "Open browser automatically")
  .option("-p, --port <port>", "Port to listen on")
  .option("-y, --latest", "Auto-select the most recent deck")
  .allowUnknownOptions()
  .action(async (query?: string, options?: Record<string, unknown>) => {
    const { dev } = await import("./commands/dev.js");
    await dev(query, {
      open: options?.open as boolean,
      port: options?.port as string,
      latest: options?.latest as boolean,
      passthrough: (options?.["--"] as string[]) || [],
    });
  });

cli
  .command("build [query]", "Build a deck for production")
  .option("-a, --all", "Build all decks into dist/<name>/")
  .option("--base <path>", "Base path for deployment")
  .option("-o, --out <dir>", "Output directory")
  .allowUnknownOptions()
  .action(async (query?: string, options?: Record<string, unknown>) => {
    const { build } = await import("./commands/build.js");
    await build(query, {
      all: options?.all as boolean,
      base: options?.base as string,
      out: options?.out as string,
      passthrough: (options?.["--"] as string[]) || [],
    });
  });

cli
  .command("export [query]", "Export a deck to PDF/PNG")
  .option("--format <format>", "Export format (pdf, png, pptx)")
  .option("-o, --output <file>", "Output file path")
  .allowUnknownOptions()
  .action(async (query?: string, options?: Record<string, unknown>) => {
    const { exportDeck } = await import("./commands/export.js");
    await exportDeck(query, {
      format: options?.format as string,
      output: options?.output as string,
      passthrough: (options?.["--"] as string[]) || [],
    });
  });

cli
  .command("list", "List all discovered decks")
  .alias("ls")
  .action(async () => {
    const { list } = await import("./commands/list.js");
    list();
  });

cli
  .command("index", "Generate an index page linking to all built decks")
  .alias("idx")
  .option("--base <path>", "Base path for links")
  .option("-o, --out <dir>", "Output directory (default: dist/)")
  .action(async (_: unknown, options?: Record<string, unknown>) => {
    const { index } = await import("./commands/index.js");
    await index({
      base: options?.base as string,
      out: options?.out as string,
    });
  });

cli
  .command("init", "Set up a multi-deck repo with scripts and template")
  .action(async () => {
    const { init } = await import("./commands/init.js");
    await init();
  });

cli
  .command("new [name]", "Create a new presentation deck")
  .action(async (name?: string) => {
    const { newDeck } = await import("./commands/new.js");
    await newDeck(name);
  });

cli.help();
cli.version(version);

cli.parse();
