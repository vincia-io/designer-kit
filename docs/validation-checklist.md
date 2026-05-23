# Validation checklist — v2 HTML templates

> **Purpose:** the 9.5/10 quality bar a template must clear before
> registration. The CLI importer + the super-admin UI check the
> automated items; the visual judgment items are checked by the human
> reviewer (and, when `ANTHROPIC_API_KEY` is set, by an auto vision-LLM
> score in P1).
>
> **How to use:** while iterating with the designer LLM, paste this list
> into the conversation and ask the LLM to self-score against it. Anything
> below 9.5 → send the LLM the failure list and iterate.

---

## A. Folder + manifest (automated, blocks registration)

| # | Check | Linter |
|---|---|---|
| A1 | `template.json` is valid JSON | importer load |
| A2 | `template.json#id` matches the folder name | `SCHEMA.id-folder-mismatch` |
| A3 | `schemaVersion` is `2`, `format` is `"html"` | `SCHEMA.schemaVersion`, `SCHEMA.format` |
| A4 | All required top-level fields present (`id`, `archetype`, `buildType`, `qualityScore`, `designedBy`, `createdAt`, `signature`, `pages`, `fonts`, `themeVars`, `copySlots`, `photoSlots`) | `SCHEMA.required` |
| A5 | `archetype` is in canonical archetype list (see SCHEMA.md § 4) | `SCHEMA.archetype` |
| A6 | `buildType` ∈ `website`, `portal` (2-value AppArchetype taxonomy; customer-accounts variant of `website` is opt-in via page set) | `SCHEMA.buildType` |
| A7 | `qualityScore` is 0-10 and is **≥ 9.5** to register | `SCHEMA.qualityScore`, quality-gate |
| A8 | `signature.density`, `displayScale`, `motionLevel` use canonical enums | `SIG.*` |
| A9 | `signature.vibe` has 2-6 tags | `SIG.vibe` |
| A10 | `paletteFamily` and `voice` are recognized (warns if not) | `SIG.paletteFamily`, `SIG.voice` |
| A11 | `pages[]` lists every `.html` file on disk; declared files exist; required role(s) per build type are present | `PAGES.missing-file`, `PAGES.required.*` |
| A12 | `themeVars.colors[]` includes `--brand` and every entry starts with `--` | `THEME.brand`, `THEME.colors-shape` |
| A13 | `createdAt` is ISO date `YYYY-MM-DD` | `SCHEMA.createdAt` |
| A14 | `id` is lowercase kebab-case `^[a-z0-9][a-z0-9-]*$` | `SCHEMA.id` |
| A15 | Package total size < 512 KB (warns if larger) | `SIZE.large` |

---

## B. CSS layer (automated)

| # | Check | Linter |
|---|---|---|
| B1 | `styles.css` exists and is non-empty | `CSS.missing` |
| B2 | Contains a `:root { ... }` block declaring `--brand: ...` | `CSS.no-root`, `CSS.root-no-brand` |
| B3 | No literal hex / hsl / oklch outside `:root` (palette swap won't propagate) | `CSS.literal-hex`, `CSS.literal-hsl`, `CSS.literal-oklch` |
| B4 | `rgba()` outside `:root` is allowed but warned (use for shadows / scrims) | `CSS.literal-rgb` (warn) |
| B5 | No backticks anywhere (would break downstream JS template literals) | `CSS.backtick` |
| B6 | No `@import` (fonts go via HTML `<link>`) | `CSS.import` |
| B7 | `!important` only on `.btn.primary`, `.btn.secondary`, `[data-section-padding=*]`, `[data-section-darksurface]`, `[data-bg-gradient*]`, `figure img` | `CSS.important` (warn) |
| B8 | Total line count ≤ 1000 (warns above) | `CSS.too-large` |
| B9 | Every var listed in `themeVars.colors` is referenced via `var(--x)` somewhere in the CSS | `THEME.unused-var` (warn) |

---

## C. HTML layer (automated, per `.html` file)

| # | Check | Linter |
|---|---|---|
| C1 | Has `<!doctype html>` | `HTML.no-doctype` (warn) |
| C2 | Has `<meta charset="utf-8">` | `HTML.no-charset` (warn) |
| C3 | Has `<meta name="viewport">` | `HTML.no-viewport` (warn) |
| C4 | Has `<title>` tag | `HTML.no-title` |
| C5 | `<html>` has `lang="..."` | `HTML.lang-missing` (warn) |
| C6 | Has `<link rel="stylesheet" href="styles.css">` (any attribute order) | `HTML.no-stylesheet-link` |
| C7 | No inline `<style>` blocks | `HTML.inline-style-tag` (warn) |
| C8 | No inline `style="..."` except `style="background-image:url('{{photo:slot}}')"` | `HTML.inline-style-attr` (warn) |
| C9 | No remote `<script src="https://...">` to a JS framework (React, Vue, Alpine, jQuery, htmx) | `HTML.framework-import` |
| C10 | Inline `<script>` discouraged (warns if non-empty body) | `HTML.inline-script` (warn) |
| C11 | Every `<img>` declares `alt` (a11y) | `J-alt-text` (warn) |
| C12 | No long hardcoded text (≥ 25 chars / ≥ 4 words) inside headings/paragraphs without a `{{SLOT}}` placeholder | `HTML.hardcoded-copy` (warn) |

---

## D. Slot discipline (automated, cross-cuts CSS + HTML + template.json)

| # | Check | Linter |
|---|---|---|
| D1 | Every `{{SLOT}}` in HTML is declared in `copySlots[]` | `COPY.undeclared` |
| D2 | Every `{{photo:slot}}` in HTML is declared in `photoSlots[]` | `PHOTO.undeclared` |
| D3 | Slot names are ALL_CAPS_SNAKE_CASE; photo slots are lowercase-kebab-case | `COPY.slot-name`, `PHOTO.slot-name` |
| D4 | No case-collision between two copy slots | `G3` |
| D5 | No non-semantic slot names (`TEXT_1`, `FOO_2`, `ITEM_3`) | `G4` (warn) |
| D6 | Every photo slot has 3+ tags joined with " + " | `F1` (warn) |
| D7 | `aspectRatio` is in canonical list (`16/9`, `16/10`, `5/4`, `1/1`, `4/5`, `21/9`, `9/16`, etc.) | `PHOTO.aspectRatio` (warn) |
| D8 | No `<img src>` that's a remote URL (must be `{{photo:slot}}`) | `A4` |
| D9 | No inline `background-image: url(https://...)` on a remote URL | `I2` |
| D10 | No copy slot used in two visually distinct `<section>` elements within one page | `B6` (warn) |
| D11 | Declared but unused slots warned (kill noise) | `COPY.unused`, `PHOTO.unused` (warn) |

---

## E. Insertion zones (automated)

| # | Check | Linter |
|---|---|---|
| E1 | Every `insertionZones[]` entry has `id`, `page`, `selector` | `ZONE.id`, `ZONE.page`, `ZONE.selector` |
| E2 | Each zone's `page` matches a real `.html` file | `ZONE.page-missing` |
| E3 | Each zone's selector resolves to a marker `<div id="..."` or `[data-vincia-insertion-zone="..."]` in that page's HTML | `ZONE.marker-missing` |
| E4 | `insertionZones: []` is allowed and marks a concept template (Vincia editor hides "+ Add section") | (no error) |

---

## F. Smoke render (automated)

The importer renders the package against an auto-picked sample brand brief
(matching `industry === archetype` if available, else first brief).

| # | Check | Linter |
|---|---|---|
| F1 | All copy slots in HTML have a value in the brand brief's `copy{}` (or `photoAlts{}`) — no `{{SLOT}}` left in the rendered HTML | `SMOKE.unfilled-copy` |
| F2 | All photo slots resolve to a URL — either from the brief's `photoUrls{}` or from a `<!-- preview: URL -->` comment in the HTML | `SMOKE.unfilled-photo` (warn) |
| F3 | The injected `:root { ... }` override block lists only vars that exist in `themeVars.colors`/`themeVars.fonts` | (silently filtered by `smokeRender`) |
| F4 | The Google Fonts `<link>` tags swap to the brief's typography URLs | (visible in rendered HTML) |

If F1 errors, fix the template (declare the slot in `copySlots[]`) OR fix
the brief (add the value under `copy{}`). For shipping templates, the
brief used during smoke-render should cover every slot.

---

## G. Visual judgment (human / vision-LLM, not automated)

These don't block registration but should be self-scored before submitting.
Each item is 1 point on the 10-point scale.

| # | Item | What "great" looks like |
|---|---|---|
| G1 | Hierarchy reads | One H1 per page; H2/H3/body sizes obviously differ; eyebrow + headline + lede compose into a clear visual rhythm |
| G2 | Palette holds across brands | When previewed against 3 contrasting briefs (warm / cool / dark), every brand renders coherently — no leaking literal colors |
| G3 | Spacing breathes | Sections have generous vertical rhythm; cards aren't crammed; line-length stays around 60-75ch for body |
| G4 | One distinctive moment | At least one design choice that's not stock — overlay treatment, grid-break, type pairing, motion accent |
| G5 | Photos belong | Hero / mockup / detail crops feel like one visual world (lighting, mood, subject matter) |
| G6 | CTAs are unmissable | Primary CTA contrasts with surrounding chrome, secondary CTA reads as different state |
| G7 | A11y baseline | Body contrast ≥ 4.5:1, large text ≥ 3:1, focus rings visible, alt text on every photo |
| G8 | Coherent across pages | Header/footer/typography/colors stay consistent home → about → contact (or auth → dashboard) |
| G9 | Mobile holds | At narrow widths nothing overlaps, type scales sensibly, dense bands collapse cleanly |
| G10 | No content soup | Each section has a clear job; no two adjacent sections do the same job |

---

## H. Human review checklist before clicking "Register"

- [ ] Validation panel shows zero errors
- [ ] Multi-brand preview renders cleanly across 3 contrasting briefs (warm + cool + dark, or whatever 3 contrasts make sense for the archetype)
- [ ] Designer self-score in `template.json#qualityScore` is honest (you'd genuinely show this template to a customer)
- [ ] `referenceInspiration[]` URLs are KIND inspirations, not copies
- [ ] `signature.industries[]` actually fits the archetype (matcher uses these)
- [ ] If `insertionZones: []` (concept template), document the design intent in `README.md` so the next reviewer understands why it can't extend
- [ ] If `insertionZones[]` is non-empty, every zone has a marker in the HTML and a sensible `label`

---

## I. After registration

- The template lands at `registered/<buildType>/<archetype>/<id>/`
- `registered/index.json` gets a new entry with status = `active`
- The audit log records who registered + when (visible at `/admin/template-library/activity`)
- The matcher picks it up on next Kythir build that matches archetype + vibe
- If you find a bug post-registration, use the super-admin UI to **quarantine** the template (Kythir won't pick it for new builds; existing tenant builds keep their copy until they re-render) or **retire** it (matcher skips entirely)

---

## J. Tips for hitting 9.5/10

- **Lead with the distinctive moment.** Most 7/10 templates fail because they're "fine" — generic SaaS hero, generic features grid, generic footer. The 9/10 has at least one design choice that's specific to the archetype.
- **Steal one detail per inspiration URL.** Two inspirations × one detail each = a coherent design that's clearly its own. Three or more inspirations = pastiche.
- **Slot every text node, even mundane ones.** The temptation to leave "Sign in" hardcoded in the nav is real. Resist. Vincia tenants might be in another language; the slot system is what makes that work.
- **Keep `styles.css` under 600 lines.** If you're heading toward 1000, you're either repeating yourself or styling things the cascade already handles. Tokenize, then re-inline only when truly needed.
- **Iterate the photo brief, not the HTML.** If a hero photo doesn't land, change the `photoSlots[].tags` — the matcher does the photo search at production. Your job is semantic tags, not URLs.
