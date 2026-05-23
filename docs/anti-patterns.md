# Anti-patterns — things templates MUST NOT do

> Importer auto-rejects any template containing these. Learned from 4 weeks of building 40 reference comparisons + observing what failed at scale.

---

## A. Widget config errors (silent failures)

### A1. `feature-card.icon: "bi-cpu"` (or any CSS class name)
**Why rejected:** the `icon` field is rendered as TEXT CONTENT. Passing a CSS class name shows the literal string "bi-cpu" on the page, not a glyph.
**Correct:** use emoji (`"⚡"`, `"📈"`, `"👥"`) or short numbers (`"01"`, `"02"`).

### A2. `feature-card.body: "..."` (wrong field name)
**Why rejected:** the field is `sub`, NOT `body`. Wrong field → silent fallback to `display:none` → entire features grid invisible.
**Correct:** `"sub": "..."`

### A3. `button.label: "..."` (wrong field name)
**Why rejected:** button widget reads `text`, NOT `label`. Wrong field → button missing.
**Correct:** `"text": "..."`

### A4. `image.src` is a hardcoded URL
**Why rejected:** templates are brand-agnostic. Hardcoded URLs lock the template to one photo subject.
**Correct:** `"src": "{{photo:slot-name}}"` + add the slot to `photoTags` with semantic tags.

### A5. `heading.text` contains brand-specific copy
**Why rejected:** templates can't have brand copy baked in. Per-build Sonnet generates copy.
**Correct:** `"text": "{{HERO_HEADLINE}}"` + add the slot to `copyGuidance`.

---

## B. Section / widget tree errors

### B1. Duplicate widget IDs anywhere in a widgetTree
**Why rejected:** editor can't disambiguate. Drag-drop / inline-edit breaks.
**Correct:** every widget id must be unique within its section's widgetTree.

### B2. `widgetTree.rootWidgetId` doesn't point to a `section` widget
**Why rejected:** Vincia expects every section band to root at a `section` widget. Any other root breaks renderer + editor.
**Correct:** root widget id always references a widget with `"type": "section"`.

### B3. `raw-html` widget anywhere
**Why rejected:** banned. Defeats the widget-tree abstraction. Prevents editor from working. Template fails on import.
**Correct:** compose with real widgets from the catalog.

### B4. Section with dark `bgColor` but no `darkSurface: true`
**Why rejected:** kit-CSS `--ink` token stays dark. Body text and ghost buttons disappear into dark background.
**Correct:** when `bgColor` is darker than #444444 (luma <50), set `darkSurface: true` on the section. Importer auto-detects this and rejects if missing.

### B5. Mixing `childWidgetIds[]` and `columns[].widgetIds[]` on the same section
**Why rejected:** ambiguous parent-child relationship. Renderer can't decide which to follow.
**Correct:** if section has direct children, use `childWidgetIds[]`. If it has columns, the columns widget (a child of the section) has `columns[].widgetIds[]`.

### B6. Same content slot used in two different sections
**Example:** `{{HERO_HEADLINE}}` appears in both `hero-band` and `cta-band`.
**Why rejected:** at production time, both sections render the same text. Looks duplicated.
**Correct:** each section has its own slot scope. Use `{{HERO_HEADLINE}}` in hero-band, `{{CTA_BAND_HEADLINE}}` in cta-band.

---

## C. CSS layer errors

### C1. Hardcoded color values (not using CSS custom properties)
**Example:** `.btn.primary { background: #3b82f6; color: #fff; }`
**Why rejected:** per-build palette swap won't work. Brand color stays blue forever.
**Correct:** `.btn.primary { background: var(--brand); color: var(--ink-on-brand); }`

### C2. `!important` abuse
**Why rejected:** breaks the cascade and prevents per-build CSS overrides.
**Acceptable:** `!important` ONLY on:
- `[data-widget-type="section"][data-section-padding="*"]` rules (Vincia ships inline padding that needs override)
- `.btn.primary` background/color (kits hardcode these)
- `data-section-darksurface` token-invert rules (must override widget inline color)

Anywhere else: rejected.

### C3. Backticks anywhere in the css string
**Why rejected:** templates' CSS gets embedded in JS template literals downstream. Backticks close the literal and break the build.
**Correct:** use `'apostrophes'` instead. If backtick is genuinely needed, escape with HTML entity `&#96;` or use `\\u0060`.

### C4. `<script>`, `<style>`, or `@import`
**Why rejected:** templates ship CSS only. No JS injection, no nested style tags, no remote imports (fonts go in `typography.fontDisplay`/`fontBody` URLs, not `@import`).

### C5. Missing `:root` token block
**Why rejected:** CSS layer must define `:root { --brand: ...; --accent: ...; --ink: ...; ... }` for production-time palette swap to work.

---

## D. Composition / archetype errors

### D1. Stacking 10+ unrelated section bands
**Why rejected:** content soup. Page becomes unreadable. Each section's purpose blurs.
**Correct:** 6-9 well-curated sections per home page.

### D2. Two adjacent sections with the same role
**Example:** two `features-band` sections in a row.
**Why rejected:** redundant. Suggests poor curation.
**Correct:** distinct roles per section.

### D3. Section count below archetype's typical pattern
**Example:** website home page with only 3 sections (hero + features + footer).
**Why rejected:** insufficient narrative. Misses trust signals, social proof, CTA.
**Correct:** 6-9 sections covering the canonical narrative.

### D4. Hero section without a clear value proposition
**Example:** hero with only an image and a logo, no headline or CTA.
**Why rejected:** visitors don't know what the brand does.
**Correct:** hero has at minimum: headline, lede, primary CTA. Optionally: secondary CTA, hero image, eyebrow.

### D5. Footer that's promotional or feature-heavy
**Why rejected:** footers are utility — info, nav, legal, copyright. Not a marketing surface.
**Correct:** footer has wordmark/logo, multi-column nav (or compact 2-row), social links, copyright. No headlines, no CTAs (except newsletter signup).

---

## E. Color / typography errors

### E1. WCAG AA contrast failure
**Why rejected:** body text on bg below 4.5:1 contrast = unreadable for many users + fails accessibility.
**Auto-checked by importer.**

### E2. Display + body fonts identical
**Example:** both fonts are Inter.
**Why rejected:** no typographic hierarchy. Headings don't feel like headings.
**Correct:** display font is visually distinct from body — typically a serif paired with a sans, or two distinct sans (Cabinet Grotesk + Inter, Source Serif 4 + Inter).

### E3. Brand and accent are 2 shades of the same hue
**Example:** brand `oklch(60% 0.14 240)` and accent `oklch(50% 0.10 240)` (both blue).
**Why rejected:** accent doesn't function as accent. No visual contrast for emphasis.
**Correct:** brand and accent in distinct hue families (e.g. brand blue + accent amber).

### E4. More than 6 distinct hues across template
**Why rejected:** palette undisciplined. Site looks like a designer threw everything in.
**Correct:** brand + accent + 3-5 neutrals = palette. That's it.

### E5. Type scale ratio < 1.4× between H1 and H2
**Why rejected:** hierarchy too flat. Headings don't differentiate.
**Correct:** H1 1.5-2× larger than H2. H2 2-3× larger than body.

---

## F. Photo / asset errors

### F1. Generic photo tag
**Example:** `"hero-image": "photo"`.
**Why rejected:** matcher can't pick a meaningful photo. Result is random.
**Correct:** 3-5 specific tags with `+`, e.g. `"warm-light + business-meeting + modern-office + diverse-team"`.

### F2. Photo aspect ratio doesn't match slot purpose
**Example:** hero image with `aspectRatio: "1/1"` (square hero).
**Why rejected:** square heroes feel like avatars. Hero photos are typically 16/10 or 5/4.
**Correct:** 16/10 or 5/4 for heroes, 4/5 for product cards, 1/1 for portraits, 16/9 for video stills.

### F3. Photo subject inconsistent with archetype
**Example:** wellness-app archetype with `"warm-domestic"` hero tags but `"high-tech-server-room"` mockup tags.
**Why rejected:** inconsistent visual language across sections.
**Correct:** photo tags within one template share a consistent visual world (lighting, subjects, mood).

---

## G. Slot / copy errors

### G1. Slot used but not declared in `copyGuidance`
**Why rejected:** Sonnet doesn't know how to fill it without guidance.
**Correct:** every `{{SLOT}}` used in widget configs has a corresponding entry in `copyGuidance` with type, word-count limits, voice guidance.

### G2. Slot in `copyGuidance` but never used in widget configs
**Why rejected:** dangling slot.
**Correct:** keep `copyGuidance` in sync with actual usage.

### G3. Slot name conflicts (case-insensitive)
**Example:** `{{HERO_HEADLINE}}` and `{{Hero_Headline}}`.
**Why rejected:** ambiguous case-handling. Causes silent miss in matcher.
**Correct:** use ALL_CAPS_SNAKE_CASE consistently.

### G4. Slot name not semantic
**Example:** `{{TEXT_1}}`, `{{TEXT_2}}`.
**Why rejected:** Sonnet has no context to write good copy.
**Correct:** `{{HERO_HEADLINE}}`, `{{FEATURE_3_SUB}}`, `{{TIER_2_NAME}}`.

---

## H. Build-type errors

### H1. `website` template missing `home` page
**Why rejected:** marketing sites need a home page. Auto-rejected.

### H2. `website` template missing auth pages
**Why rejected:** portal-websites combine marketing + auth. Need at minimum: home (marketing), login, signup, dashboard.

### H3. `portal` template with marketing-style hero
**Why rejected:** portals are internal tools. The "hero" of a portal is a dashboard or app shell, not a marketing landing.
**Correct:** portal home is `dashboard` with KPI cards / data tables / charts.

### H4. `signature.archetype` doesn't match top-level `archetype`
**Why rejected:** matcher uses signature; mismatch causes wrong matching at production.

---

## I. Performance / resource errors

### I1. Template JSON > 500KB
**Why rejected:** prompt-cached templates have token limits. Bloated templates cost more per build.
**Correct:** keep CSS layer under 500 lines. Don't embed inline base64 data URIs.

### I2. Photo URLs hardcoded with sizes/queries
**Why rejected:** templates aren't allowed to dictate photo URL queries.
**Correct:** semantic tags only; the photo-matcher resolves to a real Unsplash URL at production time.

### I3. CSS layer > 1000 lines
**Why rejected:** likely contains repeated rules or hardcoded values that should be tokens.
**Correct:** 200-500 lines is the sweet spot. If you need more, factor out repeated rules into common selectors.

---

## J. Edit-flow errors (post-template-instantiation)

### J1. Widget IDs that change per render
**Example:** generated UUIDs per render run.
**Why rejected:** editor relies on stable IDs to track edits.
**Correct:** widget IDs are stable strings declared in the template.

### J2. Section that requires special-case rendering
**Why rejected:** Vincia's renderer handles standard widget trees. Special cases break the abstraction.
**Correct:** compose with available widgets. If a feature truly needs a new widget type, propose it for the catalog.

### J3. Hidden / required widgets
**Why rejected:** users editing the build need to see + edit every widget. Hidden widgets confuse.
**Correct:** every widget is visible in the editor by default.

---

## K. Common LLM mistakes (and what to look for in review)

| Mistake | Where it shows up | Fix |
|---|---|---|
| LLM adds `lorem ipsum` placeholder copy | hardcoded copy instead of `{{SLOTS}}` | reject; ask LLM to redo with slots |
| LLM uses `font-family: "Inter, sans-serif"` directly in css string | bypassing the `--font-body` token | replace with `font-family: var(--font-body)` |
| LLM emits HTML in `widgetTree` | `widgetTree` contains HTML strings | reject; templates are JSON widget trees |
| LLM ignores `forceColumns` for asymmetric splits | imbalanced 2-col layout collapses to single column on desktop | add `forceColumns: true` on the columns widget |
| LLM sets `widthFraction` values that don't sum to 12 | renderer gets confused | normalize fractions to sum to 12 |
| LLM uses `feature-card.body` (wrong field) | features render as display:none | replace with `sub` |
| LLM uses `aspectRatio: "auto"` | inconsistent rendering | use specific ratios from the allowed set |
| LLM uses `bg: linear-gradient(...)` directly in section config | should use `bgGradient` named preset | use `bgGradient: 'mesh-warm'` etc. |

---

## How importer enforces

`import-template.mjs` runs all of the above as automated checks. Output:

```
Template raw-uploads/wellness-habit-tracker-warm-earth-002.json:

✗ A2 (silent failure): widget id 'feat-3' uses 'body' instead of 'sub'
✗ B4 (dark surface): section 'cta-band' has bgColor #0e1729 but darkSurface is not true
✗ C1 (hardcoded color): css layer line 47 uses '#3b82f6' instead of 'var(--brand)'
✓ everything else

REJECTED. File stays in raw-uploads/. Fix the 3 issues + re-run.
```

When all checks pass:

```
Template raw-uploads/wellness-habit-tracker-warm-earth-002.json:
✓ all checks passed
✓ smoke render successful
→ moved to registered/website/wellness-habit-tracker/wellness-habit-tracker-warm-earth-002.json
→ index.json updated
```
