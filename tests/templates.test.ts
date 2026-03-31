import { describe, it, expect } from "bun:test";
import {
  applyReplacements,
  getTemplates,
  MINIMAL_SLIDES_TEMPLATE,
  STYLED_SLIDES_TEMPLATE,
} from "../src/utils/templates";

describe("applyReplacements", () => {
  it("replaces all placeholders", () => {
    const template = "Hello {{NAME}}, welcome to {{TITLE}}!";
    const result = applyReplacements(template, {
      NAME: "World",
      TITLE: "Slidev",
    });
    expect(result).toBe("Hello World, welcome to Slidev!");
  });

  it("replaces multiple occurrences", () => {
    const template = "{{NAME}} is {{NAME}}";
    const result = applyReplacements(template, { NAME: "cool" });
    expect(result).toBe("cool is cool");
  });

  it("leaves unmatched placeholders", () => {
    const template = "{{NAME}} and {{OTHER}}";
    const result = applyReplacements(template, { NAME: "hi" });
    expect(result).toBe("hi and {{OTHER}}");
  });

  it("handles empty replacements", () => {
    const template = "Title: {{TITLE}}";
    const result = applyReplacements(template, { TITLE: "" });
    expect(result).toBe("Title: ");
  });
});

describe("getTemplates", () => {
  it("returns minimal templates", () => {
    const templates = getTemplates("minimal");
    expect(templates.slides).toBe(MINIMAL_SLIDES_TEMPLATE);
    expect(templates.css).toContain("/* Add your custom styles here */");
  });

  it("returns styled templates", () => {
    const templates = getTemplates("styled");
    expect(templates.slides).toBe(STYLED_SLIDES_TEMPLATE);
    expect(templates.css).toContain("Geist");
    expect(templates.css).toContain(".callout");
  });

  it("minimal template uses default theme", () => {
    const templates = getTemplates("minimal");
    expect(templates.slides).toContain("theme: default");
  });

  it("styled template uses seriph theme", () => {
    const templates = getTemplates("styled");
    expect(templates.slides).toContain("theme: seriph");
    expect(templates.slides).toContain("colorSchema: dark");
  });

  it("templates contain required placeholders", () => {
    for (const style of ["minimal", "styled"] as const) {
      const templates = getTemplates(style);
      expect(templates.slides).toContain("{{TITLE}}");
    }
  });
});

describe("runner", () => {
  // Import here to test the pure function
  const { detectPackageManager } = require("../src/utils/runner");

  it("detects bun from bun.lock", () => {
    // The slidev-decks repo itself uses bun
    const result = detectPackageManager(new URL("..", import.meta.url).pathname.replace(/\/$/, ""));
    expect(result).toBe("bun");
  });

  it("defaults to npm when no lockfile", () => {
    const result = detectPackageManager("/tmp");
    expect(result).toBe("npm");
  });
});
