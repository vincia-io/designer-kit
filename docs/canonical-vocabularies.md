# Schema — `template.json` v2 (HTML format)

> Canonical reference for the v2 (HTML) template format. Every value the
> matcher reads or the importer validates is documented here.

---

## 0. The 2-archetype taxonomy (read first)

**The platform has TWO `buildType` values: `website` and `portal`.** That's
the canonical AppArchetype taxonomy enforced by the registry, the composer,
and the runtime. A retired third value (`website_as_portal`) was collapsed
into `website` (G-S72 migration 021) — every `website` already includes
admin sign-in for the super-admin, and optionally includes customer
sign-up + customer dashboard pages when customer accounts are enabled
(`signupEnabled: true` flag on the app definition).

| `buildType` | What it produces | Required pages |
|---|---|---|
| `website` | Public site. Always includes admin sign-in. Optionally includes customer accounts (login/signup/dashboard) — declare those pages in `pages[]` to opt in. | `index.html`; recommended: `about.html`, `contact.html`; for customer-accounts variant also: `login.html`, `signup.html`, `dashboard.html` |
| `portal` | Login-gated app. No public surface — every page is behind auth. | `login.html`, `dashboard.html`; recommended: `settings.html`, `account.html` |

**There is no third option.** If you previously saw `website_as_portal`,
treat that as a `website` template whose `pages[]` includes
`login` / `signup` / `dashboard` (i.e. customer-accounts enabled).

The `archetype` field on `template.json` is a **separate, granular
category** the matcher uses to route brand briefs to compatible templates
(e.g. `wellness-habit-tracker`, `b2b-saas-marketing`, `portal-admin`).
It's NOT the AppArchetype — see § 4 for the canonical archetype list.

---

## 1. File layout (recap)

A v2 template is a **folder**, not a single JSON file. The folder contains:

```
<template-id>/
├── template.json                REQUIRED — metadata + slot manifest
├── styles.css                   REQUIRED — all CSS (variables → components)
├── index.html                   REQUIRED — home page for website builds
├── about.html                   REQUIRED for website builds
├── contact.html                 REQUIRED for website builds
├── pricing.html / blog.html     OPTIONAL
├── login.html                   REQUIRED for portal; required for website (customer-accounts variant)
├── signup.html                  REQUIRED for website (customer-accounts variant)
├── dashboard.html               REQUIRED for portal; required for website (customer-accounts variant)
├── account.html / billing.html / settings.html   OPTIONAL
├── script.js                    OPTIONAL — tiny progressive enhancement
└── README.md                    OPTIONAL — design intent notes
```

The folder name MUST match `template.json#id`. See
`TEMPLATE-PACKAGE-FORMAT.md` for the full prose spec.

---

## 2. `template.json` — top-level fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | yes | lowercase kebab-case, format `<archetype>-<direction>-NNN`. Globally unique. |
| `schemaVersion` | number | yes | `2` for HTML format. `1` is legacy widget-tree JSON. |
| `format` | string | yes | `"html"` for v2. |
| `archetype` | string | yes | One of the canonical archetypes (§ 4). |
| `buildType` | string | yes | `"website"` / `"website"` / `"portal"`. |
| `designDirection` | string | yes | One-line summary of the visual direction. |
| `qualityScore` | number | yes | Self-assessed 0–10. Must be ≥ 9.5 to register. |
| `designedBy` | string | yes | LLM model name + reviewing human. |
| `createdAt` | string | yes | ISO date `YYYY-MM-DD`. |
| `referenceInspiration` | string[] | recommended | Reference URLs for the design's KIND, not copies. |
| `signature` | object | yes | Matcher-readable classification (§ 3). |
| `pages` | array | yes | One entry per `.html` file. `{ file, role }`. Roles: `home`, `about`, `contact`, `pricing`, `blog`, `login`, `signup`, `dashboard`, `account`, `billing`, `settings`, `404`, `docs`. |
| `fonts` | string[] | yes | Google Fonts URLs. Vincia per-build can swap these. |
| `themeVars` | object | yes | `{ colors: ["--brand", ...], fonts: ["--font-display", ...] }`. Lists which CSS custom properties Vincia is allowed to override. |
| `copySlots` | array | yes | One entry per `{{SLOT}}` used in HTML. `{ slot, type, maxWords?, guidance? }`. |
| `photoSlots` | array | yes | One entry per `{{photo:slot}}`. `{ slot, tags, aspectRatio }`. |
| `insertionZones` | array | optional | Drop-zones for preset insertion. Empty array (or omitted) marks a concept template. `[ { id, page, selector, label } ]`. |
| `allowedAdjustments` | string[] | optional | Per-build adjustments Sonnet may apply. |

---

## 3. `signature` object

The matcher reads `signature` to route brand briefs to the right template.

| Field | Required | Allowed values |
|---|---|---|
| `vibe` | yes | 2-6 tags. Examples: `calm`, `warm`, `dense`, `editorial`, `cinematic`, `data-driven`, `playful`. Free-form but stay in the family. |
| `density` | yes | `compact` / `standard` / `airy` |
| `displayScale` | yes | `default` / `oversize` / `editorial-poster` |
| `paletteFamily` | recommended | One of the canonical palettes (§ 5). |
| `voice` | recommended | One of the canonical voice tones (§ 6). |
| `motionLevel` | yes | `still` / `subtle` / `playful` / `cinematic` |
| `industries` | recommended | 1-5 industry slugs. The matcher uses these to resolve "wellness app" → `wellness-habit-tracker`. |

---

## 4. Canonical archetypes

| Archetype | Typical buildType | Best for |
|---|---|---|
| `b2b-saas-marketing` | website | SaaS marketing landings (CRMs, analytics, dev tools) |
| `wellness-habit-tracker` | website | Calm wellness / lifestyle apps |
| `luxury-monograph` | website | Single-product luxury sites (boutique skincare, home goods) |
| `workshop-course-poster` | website | Course / workshop signups |
| `music-artist-portfolio` | website | Musician sites / album sites |
| `magazine-broadsheet` | website | Magazine / publication |
| `literary-journal` | website | Literary / poetry magazine |
| `lifestyle-blog-mosaic` | website | Mosaic-grid lifestyle blogs |
| `scientific-publisher` | website | Open-access research publishers |
| `open-access-publisher` | website | Multi-discipline OA publishers |
| `academic-conference-dense` | website | Mid-2010s academic conference style |
| `medical-conference-modern` | website | Modern medical/clinical conferences |
| `academic-research-lab` | website | University research lab pages |
| `ecommerce-boutique-luxe` | website | Small-collection luxe ecommerce |
| `local-retail-grand-opening` | website | Brick-and-mortar single-screen poster |
| `pet-services-warm` | website | Pet care / grooming / boarding |
| `legal-empathetic-trust` | website | Solo / boutique law practice |
| `creator-newsletter` | website | Newsletter / writer brand sites |
| `startup-directory` | website | Curated startup directories |
| `restaurant-hospitality` | website | Restaurants, hotels, cafes |
| `agency-portfolio` | website | Design / dev agency case-studies |
| `clinic-medical-trust` | website | Clinics, dental, therapy |
| `real-estate-listing` | website | Property listings |
| `event-conference-eventful` | website | Single-event conferences |
| `fitness-gym-studio` | website | Gyms, studios, fitness brands |
| `podcast-show` | website | Show / season landing pages |
| `financial-advisor-trust` | website | Wealth advisors, accountants |
| `nonprofit-impact` | website | Charities, advocacy |
| `booking-reservation` | website | Hospitality booking flows |
| `photography-portfolio` | website | Portrait / wedding / commercial photography |
| `art-exhibition-microsite` | website | Single-exhibition microsite (concept) |
| `wedding-invitation` | website | Single-event invitation (concept) |
| `product-launch-teaser` | website | Pre-launch / coming-soon (concept) |
| `portal-website-dashboard` | website | Marketing + auth + dashboard SaaS portal |
| `portal-admin` | portal | Internal admin tools, no marketing surface |

To add an archetype: edit `lib/canonical-vocabularies.mjs`, document it here, and ideally author at least one exemplar under `exemplars/`.

---

## 5. Canonical palette families

`signature.paletteFamily` should match one of these. Free-form is allowed but the matcher treats out-of-list values as "best effort".

```
warm-earth-amber       cool-sage              dark-mono
warm-amber-walnut      sage-academic-cream    pure-noir-canvas
sunset-warm            forest-nature-cream    high-contrast-bw
mesh-warm              lavender-empathetic    midnight
mesh-cool              lavender-indigo        gradient-blue
saffron                vivid-blue-amber       electric-royal-blue
coral-pink-cream       cream-newsprint        dark-mint-tech
academic-cream         dark-navy-amber        concert-warm-spotlight
playful-pastel         corporate-blue         luxury-monograph
startup-purple
```

---

## 6. Canonical voice tones

```
modern-trust            editorial-formal
quiet-luxe              imperative-twin
wellness-calm           warm-friendly
empathetic-pro          data-driven-confident
academic-formal         modern-playful
bold-imperative
```

---

## 7. Density / displayScale / motionLevel enums

- `density`: `compact` | `standard` | `airy`
- `displayScale`: `default` | `oversize` | `editorial-poster`
- `motionLevel`: `still` | `subtle` | `playful` | `cinematic`

These map onto kit-CSS axes the runtime expands (paddingY, line-height, transition durations, animation budgets).

---

## 8. `copySlots[]` shape

Each entry:

```jsonc
{
  "slot": "HERO_HEADLINE",      // ALL_CAPS_SNAKE_CASE — must match {{HERO_HEADLINE}} in HTML
  "type": "headline",            // see types table below
  "maxWords": 8,                 // copy-fill LLM hard cap
  "guidance": "Action-led, calm" // optional natural-language hint
}
```

| `type` | When to use |
|---|---|
| `eyebrow` | Tiny pre-headline label |
| `headline` | H1 / H2 |
| `subhead` | Lede paragraph under a headline |
| `card-heading` | Heading inside a feature/testimonial/pricing card |
| `card-body` | Body copy inside a card |
| `long-form` | Multi-paragraph prose (about/story bodies) |
| `label` | Nav link, badge, footer link, stat label |
| `cta` | Button text |
| `quote` | Testimonial / pull-quote |
| `alt-text` | `<img alt>` describing a photo slot |

The importer **errors** if any `{{SLOT}}` in HTML is not declared here, and **warns** if a declared slot is unused.

---

## 9. `photoSlots[]` shape

```jsonc
{
  "slot": "hero-image",                                // lowercase kebab-case
  "tags": "lifestyle + warm-light + plants + indoor",  // 3+ tags joined with " + "
  "aspectRatio": "16/10"                               // see allowed list below
}
```

Allowed `aspectRatio` values: `16/9`, `16/10`, `4/3`, `5/4`, `3/2`, `21/9`, `9/16`, `1/1`, `4/5`, `2/3`, `3/4`.

The importer errors when a `{{photo:slot}}` in HTML is not declared and warns when the brief's tags are too thin (< 3 tags).

---

## 10. `themeVars` shape

```jsonc
{
  "colors": [
    "--brand",            // REQUIRED — matcher reads this
    "--accent",
    "--ink",
    "--bg",
    "--surface",
    "--line",
    "--ink-on-brand"
    // ... only vars listed here may be overridden by Vincia per-build
  ],
  "fonts": ["--font-display", "--font-body"]
}
```

Listing a var here is permission for Vincia's brand-swap pipeline to inject `:root { --x: <tenant value> }` overrides. Anything not listed stays at the template's default. This is also the safety surface — the kit can't accidentally rewrite spacing tokens or shadows.

---

## 11. `insertionZones[]` shape

```jsonc
{
  "id": "after-features",                      // stable identifier
  "page": "index.html",                        // which page the zone lives on
  "selector": "#zone-after-features",          // CSS selector for the marker div
  "label": "After Features section"            // human-readable label (Vincia editor)
}
```

The HTML must contain a marker matching the selector:

```html
<div id="zone-after-features" data-vincia-insertion-zone="after-features"></div>
```

When `insertionZones: []` (concept template), the editor hides the "+ Add section" button. See `TEMPLATE-PACKAGE-FORMAT.md` § "Two template shapes".

---

## 12. Slot naming conventions

- ALL_CAPS_SNAKE_CASE for copy slots: `HERO_HEADLINE`, `FEATURE_3_SUB`, `TIER_2_NAME`.
- lowercase-kebab-case for photo slots: `hero-image`, `team-photo-1`, `cta-photo`.
- Make slot names **semantic** — `HERO_HEADLINE` not `TEXT_1`. Sonnet generates better copy when the slot name describes its role.
- Don't repeat slots across visually distinct sections — the copy-fill LLM emits one value per slot, so re-use produces visible duplication.

---

## 13. Build-type required pages

| `buildType` | Required page roles | Recommended additional |
|---|---|---|
| `website` | `home` | `about`, `contact` |
| `website` | `home`, `login`, `signup`, `dashboard` | `about`, `contact`, `account`, `billing` |
| `portal` | `login`, `dashboard` | `settings`, `account` |

Importer errors if a required role is missing from `pages[]`. Warns on missing recommended roles.

---

## 14. Validation summary (what the importer checks)

The importer runs the same `lib/` modules the super-admin UI calls:

1. **`validate-package.mjs`** — schema shape, required fields, theme-var allowlist, slot/photo cross-check, build-type page rules.
2. **`lint-css.mjs`** — `:root` block + `--brand` declared, no literal hex/oklch outside `:root`, no `@import`, no backticks, `!important` only on allowed selectors.
3. **`lint-html.mjs`** — `<title>`, `<meta charset>`, viewport, lang attribute, stylesheet `<link>`, no inline `<style>`, no remote frameworks, alt-text on images.
4. **`lint-anti-patterns.mjs`** — data-driven rules (see `ANTI-PATTERNS.md`). Includes A4 (hardcoded image URLs), F1 (thin photo tags), G3/G4 (slot naming), B6 (cross-section slot reuse).
5. **`smoke-render.mjs`** — applies a sample brand brief; errors on unfilled copy slots, warns on unfilled photo slots (which fall back to placeholder service).

A template registers only when steps 1-5 produce zero errors and `qualityScore ≥ 9.5`.

---

## 15. Schema version compatibility

| `schemaVersion` | `format` | Status |
|---|---|---|
| `1` | (omitted) | **Legacy** — full widget-tree JSON template. Importer accepts via `--legacy` flag. See `SCHEMA-JSON-LEGACY.md`. |
| `2` | `"html"` | **Current** — HTML/CSS folder package. Both flexible and concept template shapes supported. |

Both formats coexist in `registered/`. Kythir checks `schemaVersion` to pick the right rendering path at production.
