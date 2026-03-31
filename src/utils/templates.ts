export const MINIMAL_SLIDES_TEMPLATE = `---
theme: default
title: {{TITLE}}
info: |
  {{DESCRIPTION}}
drawings:
  persist: false
transition: slide-left
mdc: true
---

# {{TITLE}}

{{SUBTITLE}}

---

## Agenda

- Topic one
- Topic two
- Topic three

---
layout: center
---

# Thank You

Questions?
`;

export const MINIMAL_STYLE_TEMPLATE = `/* Add your custom styles here */
`;

export const STYLED_SLIDES_TEMPLATE = `---
theme: seriph
layout: cover
title: {{TITLE}}
info: |
  {{DESCRIPTION}}
colorSchema: dark
drawings:
  persist: false
transition: slide-left
mdc: true
---

# {{TITLE}}

{{SUBTITLE}}

<div class="abs-br m-6 text-sm opacity-50">
{{AUTHOR}} · {{YEAR}}
</div>

<!--
[~1 min] OPENING

Introduce the topic and set the tone.
-->

---
layout: center
class: text-center
---

# Opening Question

<v-click>

A thought-provoking question to engage the audience.

</v-click>

<!--
Pause here. Let people reflect before continuing.
-->

---
layout: section
---

# Section One

<p class="text-xl opacity-60">Subtitle for the section</p>

<!--
Brief intro to this section.
-->

---

# Slide Title

<v-clicks>

- First point
- Second point
- Third point

</v-clicks>

<div class="abs-bl m-4 text-xs opacity-30">Source: <a href="#" class="border-none!">Source Name</a></div>

<!--
[~2 min] SLIDE TITLE

CLICK 1: "Talking point for the first bullet."

CLICK 2: "Talking point for the second bullet."

CLICK 3: "Talking point for the third bullet."

TRANSITION: "Bridge to the next slide."
-->

---
layout: two-cols
---

# Comparison Slide

## Left Side

<v-clicks>

- Point one
- Point two
- Point three

</v-clicks>

::right::

# &nbsp;

<div v-click>

## Right Side

</div>

<v-clicks>

- Counter point one
- Counter point two
- Counter point three

</v-clicks>

<!--
Walk through left side first, then reveal right side.
-->

---
layout: center
class: text-center
---

# Key Takeaway

<v-click>

<div class="mt-8 text-xl opacity-60">

A closing thought that ties everything together.

</div>

</v-click>

<!--
Deliver this slowly. Let it land.
-->

---
layout: center
class: text-center
---

# Thank You

<p class="text-xl opacity-60 mt-4">Questions?</p>

<div class="mt-16 text-sm opacity-30">

Sources and references available in speaker notes throughout

</div>

<!--
[Q&A]

Open the floor for questions.
-->
`;

export const STYLED_STYLE_TEMPLATE = `@import url('https://cdn.jsdelivr.net/fontsource/fonts/geist-sans@latest/latin.css');
@import url('https://cdn.jsdelivr.net/fontsource/fonts/geist-mono@latest/latin.css');

:root {
  --slidev-theme-primary: #60a5fa;
  --slidev-theme-accent: #f59e0b;
}

.slidev-layout {
  font-family: 'Geist Sans', 'Geist', sans-serif;
}

code, pre {
  font-family: 'Geist Mono', monospace !important;
}

/* Cover slide gradient */
.slidev-layout.cover {
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
}

/* Section slides with subtle gradient */
.slidev-layout.section {
  background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%);
}

/* Callout cards */
.callout {
  padding: 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid;
}

.callout-warning {
  background: rgba(234, 179, 8, 0.08);
  border-color: rgba(234, 179, 8, 0.3);
}

.callout-danger {
  background: rgba(239, 68, 68, 0.08);
  border-color: rgba(239, 68, 68, 0.3);
}

.callout-info {
  background: rgba(96, 165, 250, 0.08);
  border-color: rgba(96, 165, 250, 0.3);
}

.callout-purple {
  background: rgba(168, 85, 247, 0.08);
  border-color: rgba(168, 85, 247, 0.3);
}

/* Logo cards */
.logo-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.2s ease;
}

.logo-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
}

.logo-card img {
  height: 2.5rem;
  width: auto;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.logo-card .label {
  font-weight: 600;
  font-size: 0.95rem;
}

.logo-card .desc {
  font-size: 0.75rem;
  opacity: 0.6;
}

/* Tool grid cards */
.tool-card {
  padding: 1rem 1.25rem;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.2s ease;
}

.tool-card:hover {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(96, 165, 250, 0.3);
}

/* Big number stats */
.stat {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.6;
  margin-top: 0.25rem;
}

/* Blockquote styling override */
blockquote {
  border-left: 3px solid #a78bfa !important;
  padding-left: 1.25rem !important;
  font-style: italic;
}

/* Smooth transitions for v-click */
.slidev-vclick-target {
  transition: all 0.4s ease;
}
`;

export const DECK_PACKAGE_JSON = `{
  "name": "{{NAME}}",
  "private": true,
  "scripts": {
    "dev": "slidev",
    "build": "slidev build",
    "export": "slidev export"
  }
}
`;

export type TemplateStyle = "minimal" | "styled";

export function getTemplates(style: TemplateStyle) {
  return {
    slides: style === "styled" ? STYLED_SLIDES_TEMPLATE : MINIMAL_SLIDES_TEMPLATE,
    css: style === "styled" ? STYLED_STYLE_TEMPLATE : MINIMAL_STYLE_TEMPLATE,
  };
}

export function applyReplacements(
  template: string,
  replacements: Record<string, string>
): string {
  let result = template;
  for (const [key, value] of Object.entries(replacements)) {
    result = result.replaceAll(`{{${key}}}`, value);
  }
  return result;
}
