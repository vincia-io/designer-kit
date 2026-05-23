# Section library exemplar — Marketing Essentials

A worked example of the **section-library** tier on the Vincia Forge.

## What this section-library is

Three hard-working marketing sections every website needs: a **hero** with a
clear value-prop, a **3-up features grid**, and a **call-to-action banner**.
Each section is a self-contained HTML+CSS block that drops into any host
page. CSS resolves through theme tokens (`var(--brand)`, `var(--ink)`, etc.)
so the sections inherit the host theme's identity automatically.

## Files

```
example-section-library-marketing-essentials/
├── manifest.json                    Forge metadata + per-section descriptors
├── sections/
│   ├── hero-split-eyebrow.html      Two-col hero with eyebrow + ctas
│   ├── features-3-up.html           Three feature cards in a row
│   └── cta-banner-centered.html     Full-bleed brand-coloured CTA
└── README.md                        This file
```

## How a build uses this library

1. Studio super-admin (or the Composer in auto-mode) installs the library.
2. When composing a page, the editor surfaces each section as a draggable
   block. The user drops it onto an insertion zone OR the Composer picks
   it by `kind` + `compatibleWith` match.
3. At parse time, Vincia's HTML-to-widget-tree pipeline reads the
   `data-vincia-section-type` + `data-slot-role` + `data-vincia-list`
   attributes and converts the section into editable widgets. Slot
   placeholders (`{{SLOT}}`) become bindable widget fields.
4. The build's per-build copy-fill LLM fills the slots from the brand
   brief; the photo-matcher resolves `{{photo:slot}}` to real URLs.

## Why these sections are good citizens

- **Composer-pickable**. Each section declares `compatibleWith.archetype`
  and `compatibleWith.vibe` in the manifest, so auto-mode picks them only
  when they match the brand brief.
- **Token-driven CSS**. No literal colours, fonts, or spacings outside
  `var(--*)` lookups. Per-build palette swap works without re-authoring.
- **Pixel-perfect AND editable**. The HTML is what the deployed page
  renders, but the structural attributes let the editor decompose it
  into individual editable widgets — `<h1 data-slot-role="heading-display">`
  becomes a `heading` widget the user can re-edit inline.
- **Repeated structures use `data-vincia-list`**. Features-3-up
  declares the cards as a list so the editor can add/remove cards via
  the structural editor without breaking the design.
- **Slot names are semantic**. `{{HERO_HEADLINE}}` not `{{TEXT_1}}` —
  Sonnet writes better copy when slot names describe their role.

## How sections export to the preset library

When this library is registered (via `vincia publish` once wired, or via
the studio admin import today), each section with
`exportToPresetLibrary: true` becomes a preset entry the Composer can
pick by id. This **grows the Composer's vocabulary** without baking new
section types into platform code.

## Authoring your own section library

1. Run `vincia create section-library <name>` (when scaffolds land in
   the CLI; until then, copy this example and rename).
2. Replace the three example sections with your own. Keep each section
   under 200 lines of HTML + CSS — sections should be focused.
3. Update `manifest.json#sections[]` so every entry has a matching file.
4. Run validation (`vincia publish --dry-run` once wired) to catch missing
   slots, banned literal colours, or missing structural attributes.

## See also

- [`../../docs/prompt-for-designer-llm.md`](../../docs/prompt-for-designer-llm.md)
  — the structural attribute contract every section follows (RULES 15-22)
- [`../../docs/anti-patterns.md`](../../docs/anti-patterns.md) — what to
  avoid; the importer rejects these automatically
- [`../wellness-habit-tracker-warm-earth-001/`](../wellness-habit-tracker-warm-earth-001/)
  — a full design-template that composes sections like these
