import { describe, it, expect } from "bun:test";
import { generateIndexHtml } from "../src/commands/index";

describe("generateIndexHtml", () => {
  const sampleDecks = [
    { name: "2026-03-test-talk", title: "Test Talk", date: "2026-03", author: "Alice" },
    { name: "2026-04-another-talk", title: "Another Talk", date: "2026-04" },
  ];

  it("generates valid HTML document", () => {
    const html = generateIndexHtml(sampleDecks, "/");
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain('<html lang="en">');
    expect(html).toContain("</html>");
  });

  it("includes all deck titles", () => {
    const html = generateIndexHtml(sampleDecks, "/");
    expect(html).toContain("Test Talk");
    expect(html).toContain("Another Talk");
  });

  it("generates correct links with base path", () => {
    const html = generateIndexHtml(sampleDecks, "/talks/");
    expect(html).toContain('href="/talks/2026-03-test-talk/"');
    expect(html).toContain('href="/talks/2026-04-another-talk/"');
  });

  it("generates correct links with default base", () => {
    const html = generateIndexHtml(sampleDecks, "/");
    expect(html).toContain('href="/2026-03-test-talk/"');
  });

  it("shows date when available", () => {
    const html = generateIndexHtml(sampleDecks, "/");
    expect(html).toContain("2026-03");
    expect(html).toContain("2026-04");
  });

  it("shows author when available", () => {
    const html = generateIndexHtml(sampleDecks, "/");
    expect(html).toContain("Alice");
  });

  it("shows presentation count", () => {
    const html = generateIndexHtml(sampleDecks, "/");
    expect(html).toContain("2 presentations");
  });

  it("uses singular for single presentation", () => {
    const html = generateIndexHtml([sampleDecks[0]], "/");
    expect(html).toContain("1 presentation");
    expect(html).not.toContain("1 presentations");
  });

  it("handles empty deck list", () => {
    const html = generateIndexHtml([], "/");
    expect(html).toContain("0 presentations");
  });

  it("escapes HTML entities in title", () => {
    const decks = [{ name: "xss-test", title: '<script>alert("xss")</script>' }];
    const html = generateIndexHtml(decks, "/");
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("escapes HTML entities in author", () => {
    const decks = [{ name: "test", title: "Test", author: 'Bob & "Alice"' }];
    const html = generateIndexHtml(decks, "/");
    expect(html).toContain("Bob &amp; &quot;Alice&quot;");
  });

  it("encodes special characters in href", () => {
    const decks = [{ name: "my talk with spaces", title: "Test" }];
    const html = generateIndexHtml(decks, "/");
    expect(html).toContain("my%20talk%20with%20spaces");
  });

  it("strips trailing slash from base before building href", () => {
    const decks = [{ name: "talk", title: "Talk" }];
    const html = generateIndexHtml(decks, "/base/");
    expect(html).toContain('href="/base/talk/"');
    expect(html).not.toContain('href="/base//talk/"');
  });
});
