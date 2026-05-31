# Prompt for designer LLMs — HTML output

> **How to use:** copy this entire file, paste into a fresh Claude / GPT / Gemini chat, fill in the **PART A — YOUR DESIGN INPUTS** form at the bottom, hit go. The LLM produces a self-contained folder of HTML/CSS/JS/image-references that the user opens in a browser to verify visually BEFORE handing it to Vincia for ingestion.
>
> **Why HTML, not JSON.** Designer LLMs natively produce HTML/CSS — that is their strongest medium. The user can open the result in a browser, refine the design with the LLM iteratively, and only finalize once the visual output passes muster. JSON would be invisible until rendered, which defeats the whole point of designer review.
>
> **The split:** Part A is the **manual creative direction** YOU provide per template. Part B is the **structural rules** the LLM must follow so Vincia's importer can ingest the result + Kythir can fill it with per-brand inputs at production time. Part C is the **quality bar** — what 9.5/10 actually means visually.

> **Reserved namespace.** All HTML attributes prefixed `data-vincia-*` and all JSON keys at the top level of `template.json` are reserved by Vincia for current + future system use. **Do not use them for your own purposes** (custom CSS hooks, your own state machines, debugging markers). Use a project-specific prefix instead (`data-mybrand-*`). Vincia ships new annotations periodically — see "RESERVED ANNOTATIONS — coming next" near the bottom of Part B for the upcoming surface.

---

# ============================================================
# PART B — STRUCTURAL RULES (LLM MUST FOLLOW EXACTLY)
# ============================================================

> Read this entire section. These rules are non-negotiable. The Vincia importer rejects any template that violates them.

## RULE 1 — Output a self-contained folder of files, NOT a single file

Your final deliverable is a folder. The user will save your output as files inside that folder. Use this naming exactly:

```
<template-id>/
├── template.json              ← lightweight metadata (REQUIRED)
├── styles.css                 ← all CSS (REQUIRED)
├── script.js                  ← optional progressive enhancement only
├── index.html                 ← home page (REQUIRED)
├── about.html                 ← required for website builds
├── contact.html               ← required for website builds
├── pricing.html               ← optional but recommended
├── blog.html                  ← optional
└── README.md                  ← short notes on the design intent
```

For `website` templates: also include `login.html`, `signup.html`, `dashboard.html`.
For `portal` templates: replace marketing pages with `dashboard.html`, `settings.html`, `users.html`, `analytics.html`, etc.

**Output format:** present each file in your response inside a fenced code block whose info-string is the relative file path, like:

````
```html path=index.html
<!doctype html>
...
```

```css path=styles.css
:root { --brand: oklch(72% 0.14 60); ... }
...
```
````

This format is unambiguous and the user can save each block to disk by file-path.

## RULE 2 — Use `{{SLOT}}` placeholders for ALL brand copy

Every piece of brand-specific copy MUST be a `{{SLOT_NAME}}` placeholder using `ALL_CAPS_SNAKE_CASE`. Vincia's per-build pipeline replaces these at production time with the tenant's actual brand copy.

```html
<h1 class="hero-h1">{{HERO_HEADLINE}}</h1>
<p class="hero-lede">{{HERO_LEDE}}</p>
<a class="btn primary" href="#get-started">{{HERO_CTA_PRIMARY}}</a>
```

**NEVER write hardcoded brand copy** (e.g. "Stop guessing commissions"). That couples the template to one brand and defeats the point.

Standard slot names (use these whenever possible — Vincia's copy generator already knows them):

| Slot | Use case |
|---|---|
| `{{NAV_BRAND}}` | Brand wordmark text |
| `{{NAV_ANCHORS}}` | Top nav links (often "Features · Pricing · About") |
| `{{NAV_CTA}}` | Top-right CTA label ("Get started", "Sign in") |
| `{{HERO_EYEBROW}}` | Tiny pre-headline text |
| `{{HERO_HEADLINE}}` | The big H1 |
| `{{HERO_LEDE}}` | Hero subhead, 1-2 sentences |
| `{{HERO_CTA_PRIMARY}}` | Primary hero button |
| `{{HERO_CTA_SECONDARY}}` | Secondary hero link/button |
| `{{HERO_PILL}}` | Optional pill above hero |
| `{{TRUSTED_BY_LABEL}}` | "Trusted by X+ teams" or similar |
| `{{LOGO_1}}` ... `{{LOGO_5}}` | Logo strip text labels |
| `{{FEATURES_EYEBROW}}` | "FEATURES" |
| `{{FEATURES_H2}}` | Features section H2 |
| `{{FEATURES_LEDE}}` | Features section subhead |
| `{{FEATURE_1_HEADING}}` ... `{{FEATURE_N_HEADING}}` | Per-card heading |
| `{{FEATURE_1_SUB}}` ... `{{FEATURE_N_SUB}}` | Per-card description |
| `{{PROCESS_EYEBROW}}` | "HOW IT WORKS" |
| `{{PROCESS_H2}}` | Process section H2 |
| `{{STEP_1_HEADING}}` ... `{{STEP_N_*}}` | Per-step copy |
| `{{TIER_1_NAME}}`, `{{TIER_1_PRICE}}`, `{{TIER_1_FEATURES}}` ... | Pricing tiers |
| `{{TESTIMONIAL_1_QUOTE}}`, `{{TESTIMONIAL_1_NAME}}`, `{{TESTIMONIAL_1_ROLE}}` | Per-testimonial |
| `{{CTA_BAND_HEADLINE}}`, `{{CTA_BAND_LEDE}}`, `{{CTA_BAND_BUTTON}}` | Final CTA band |
| `{{FOOTER_TAGLINE}}`, `{{FOOTER_COPYRIGHT}}` | Footer copy |

If you need a slot not in this list (e.g. `{{ABOUT_MISSION_HEADLINE}}` for an about-page section), invent it — but list it in `template.json` under `copySlots[]` so Vincia knows about it.

### Brand wordmark — keep it clean, no decorative punctuation

The `{{NAV_BRAND}}` slot resolves to the brand's plain name (e.g. `Acme`, `Halcyon Dental`, `Pulsar`). **Do NOT** decorate it in HTML or CSS:

- ❌ `{{NAV_BRAND}}.` — trailing period (the "Linear./Vercel./Stripe." style — that's a per-brand decision baked into THEIR wordmark, not a default)
- ❌ `{{NAV_BRAND}} ●` or `● {{NAV_BRAND}}` — bullet/dot decoration
- ❌ `[{{NAV_BRAND}}]` / `« {{NAV_BRAND}} »` / `// {{NAV_BRAND}}` — bracket-style decorations
- ❌ CSS `.brand-mark::after { content: '.'; }` (or any other glyph injected via pseudo-element)
- ❌ Splitting into `{{NAV_BRAND}}<span class="dot">.</span>` — same problem in disguise

**Why:** these are brand-identity decisions. If Acme uses a trailing dot in their wordmark, their brief will set `BRAND_NAME` to `"Acme."` (with the dot included in the value). Hardcoding the dot in the template forces every brand using the template to inherit it, which is wrong. The wordmark is one of the few things a brand cares most about getting exactly right.

The same rule applies to `{{BRAND_NAME}}`, `{{LOGO_TEXT}}`, and any other slot that holds the literal brand identifier.



## RULE 3 — Use `{{photo:slot-name}}` for ALL images

Never hardcode an image URL. Use the photo-slot syntax:

```html
<img class="hero-image" src="{{photo:hero-image}}" alt="{{HERO_IMAGE_ALT}}" />

<div class="bg-photo" style="background-image: url('{{photo:hero-bg}}');">
```

Then list every photo slot in `template.json` with semantic tags so Vincia's image-search picks brand-appropriate photos. Tags use `+` as AND:

```json
"photoSlots": [
  { "slot": "hero-image", "tags": "lifestyle + warm-light + plants + indoor", "aspectRatio": "16/10" },
  { "slot": "mockup-image", "tags": "phone-mockup + app-screenshot + clean-ui", "aspectRatio": "9/16" }
]
```

Be specific (3-5 tags per slot). Generic tags like just "photo" produce bad matches.

While AUTHORING the template, you MAY embed real photo URLs INSIDE comments next to each photo slot so the design preview makes sense to the user during review. Example:

```html
<!-- preview: https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=85 -->
<img class="hero-image" src="{{photo:hero-image}}" alt="{{HERO_IMAGE_ALT}}" />
```

The Vincia preview tool reads these comments and uses them when no brand-brief override is provided. Same allow-list applies (see RULE 3.5 below).

## RULE 3.5 — Image source allow-list (free-license + breakage-proof)

Every image URL — in `<img src>`, in CSS `background-image: url(...)`, in `_preview-data.json#photoUrls`, AND in HTML preview comments — MUST come from one of these sources:

| Source | Pattern | License |
|---|---|---|
| Unsplash CDN | `https://images.unsplash.com/photo-<id>?...` | Unsplash License (free, commercial OK) |
| Pexels CDN | `https://images.pexels.com/photos/<id>/...` | Pexels License (free, commercial OK) |
| Pixabay CDN | `https://pixabay.com/get/...` or `https://cdn.pixabay.com/...` | Pixabay License (free, commercial OK) |
| Lorem Picsum | `https://picsum.photos/...` | CC0 (random — use ONLY for layout placeholders) |
| Placeholder | `https://placehold.co/...` or `https://placehold.it/...` | Public domain |
| Vincia internal CDN | `https://studio.vincia.io/cdn/...` | Already-rehosted, license recorded |

**Forbidden — auto-rejected at register time:**

- Shutterstock, Getty, Adobe Stock, iStock, Alamy, or any paid stock URL
- Random Google image search URLs (`encrypted-tbn0.gstatic.com/...`)
- Any URL whose license you can't articulate
- Hotlinking from a competitor's site (copyright + breakage risk)

**At register time**, the importer:

1. Verifies every image URL matches the allow-list (lint code `IMG.disallowed-source` — fails the register if violated)
2. Downloads each external image, stores in MinIO at `vincia-assets/<template-id>/<sha256>.<ext>`, and rewrites all URLs in HTML / CSS / `_preview-data.json` to `https://studio.vincia.io/cdn/<template-id>/<sha256>.<ext>`. Origin URL + (where available) attribution are recorded in `template.json#assets[]`.

This makes registered templates **self-contained** (Unsplash deletes a photo → your template still renders), **license-clean** (we hold the file, not just a hotlink), and **performance-stable** (one CDN, not three).

When you're researching reference photos to embed during authoring, prefer Unsplash for hero / lifestyle / portrait, Pexels for stock / corporate, Pixabay for high volume / generic, and `picsum.photos`/`placehold.co` only for non-meaningful filler.

## RULE 3.6 — Bundled assets: scripts/, assets/, fonts/

Some templates need files that aren't slot-driven photos or external CDN
imports — a custom Three.js scene, a decorative SVG pattern, a brand
typeface the template depends on. Drop them in one of these top-level
directories inside the template folder:

```
my-templates/<template-id>/
├── index.html
├── styles.css
├── template.json
├── scripts/        ← bundled JS files (super-admin auth required at register)
│   └── particle-field.js
├── assets/         ← decorative SVG patterns, custom illustrations, etc.
│   ├── orbit-pattern.svg
│   └── grid-background.png
└── fonts/          ← custom WOFF2 / WOFF / TTF / OTF files
    └── display-italic.woff2
```

Reference them with **relative paths** in your HTML and CSS exactly as
they sit on disk:

```html
<script src="scripts/particle-field.js"></script>
<link rel="stylesheet" href="styles.css" />
```

```css
@font-face {
  font-family: 'BrandDisplay';
  src: url(fonts/display-italic.woff2) format('woff2');
}
.hero { background-image: url(assets/orbit-pattern.svg); }
```

**At register time**, the studio:
1. Validates each file (extension allow-list, magic-byte sniff, size cap, SVG sanitization via DOMPurify).
2. Uploads to the CDN bucket at `templates/<id>/scripts/<file>` etc.
3. Rewrites parser-emitted refs to `/cdn/templates/<id>/scripts/<file>` so they resolve at runtime.

If you reference `scripts/foo.js` from HTML but don't actually include
the file in `scripts/`, the register fails with
`ASSETS.bundled-script-missing` rather than silently 404-ing at runtime.

**Limits + security:**
- Allowed extensions: `svg, png, jpg, jpeg, webp, avif, gif, ico, mp4, webm, woff, woff2, ttf, otf, js, mjs, css, json`. Anything else rejected.
- Per-file caps: 10 MB image, 50 MB video, 1 MB font, 500 KB script.
- `.js` and `.mjs` uploads require **platform-admin authorization** at register time. Non-admin authoring is restricted to inline `<script>` and CDN-allow-list imports.
- SVGs are sanitized — `<script>`, `on*=` event handlers, `javascript:` URIs, and `<foreignObject>` are stripped before serving.
- Don't put HTML, executables, or anything outside the allow-list in these dirs — they're hard-rejected.

**Per-build assets (logos, brand photos, favicons)** are NOT shipped in
the template folder. Those come from the brand brief at deploy time —
the user uploads them via the studio's brand-brief editor (or a future
CLI), and they live at `builds/<slug>/brand/<file>` in the CDN. The
template references them with `{{photo:slot-name}}` placeholders (see
RULE 3) — the brief fills the URL.

## RULE 4 — All colors, fonts, spacing live as CSS custom properties

Every theme-able value MUST be a CSS variable defined in `:root` in `styles.css`. Vincia's per-brand build injects `:root` overrides to retheme the site without touching template HTML.

```css
:root {
  --brand: oklch(72% 0.14 60);
  --accent: oklch(48% 0.10 70);
  --secondary: oklch(40% 0.08 50);
  --ink: #1c1410;
  --mute: #7a6e62;
  --bg: #fbf6ee;
  --surface: #fffdf8;
  --surface-alt: #f3eadc;
  --line: rgba(28, 20, 16, 0.08);
  --ink-on-brand: #1c1410;

  --font-display: 'Source Serif 4', Georgia, serif;
  --font-body: 'Inter', system-ui, sans-serif;

  --type-h1: clamp(40px, 7vw, 96px);
  --type-h2: clamp(28px, 4vw, 56px);
  --type-h3: clamp(22px, 2.5vw, 32px);
  --type-body-lg: clamp(18px, 1.4vw, 22px);
  --type-body: 16px;
  --type-body-sm: 14px;

  --space-1: 4px;  --space-2: 8px;  --space-3: 12px;
  --space-4: 16px; --space-5: 24px; --space-6: 32px;
  --space-7: 48px; --space-8: 72px; --space-9: 112px; --space-10: 160px;

  --radius-sm: 6px; --radius-md: 10px; --radius-lg: 18px; --radius-pill: 999px;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
  --shadow-lg: 0 12px 40px rgba(0,0,0,0.12);

  --ease: cubic-bezier(0.4, 0, 0.2, 1);
  --duration-quick: 150ms;
  --duration-medium: 280ms;
}
```

Then use `var(--brand)` etc throughout `styles.css`. Never `color: #fff` or `padding: 24px` — always `color: var(--ink-on-brand)`, `padding: var(--space-5)`.

**Forbidden:** any literal hex/rgb/oklch outside the `:root` block (except inside `url()` for SVG fills, which is fine).

### RULE 4.b — The example palette above is illustrative, not a default

The `:root` block above happens to be warm-earth-amber. It is shown to
illustrate **how** to declare tokens, not **which** values to declare.
Don't blindly reuse those exact `oklch()` numbers for every template
you author.

**Aesthetic direction is your call.** Reach for whatever palette,
typography, and overall mood lands hardest for the brief — bold,
restrained, dark, vivid, monochrome, brutalist, editorial, anything.
Templates that all look like cream + amber, or all look like
fintech-blue, or all look like clinic-sage, are a worse outcome than
you reaching for something distinctive that suits the brand. Surprise
the user.

The kit's exemplars (`exemplars/*`) are there to demonstrate **technical
structure** — how slots are wired, where class hooks go, how sections
compose, how `_preview-data.json` is shaped. Copy the structure
faithfully so Vincia's importer can splice in chrome / sections / brand
overrides. The exemplars' specific colors and fonts are properties of
their own briefs, not blueprints for yours.

When you pick a palette family, declare it in `signature.paletteFamily`
so Vincia's matcher can find peers (~25 canonical families in
`lib/canonical-vocabularies.mjs`; free-form values are accepted as
"best effort"). That tag is metadata for the matcher — it does NOT
constrain what you actually render.

## RULE 4.5 — Ship a `_preview-data.json` + include `preview-inline.js` (required: smoke-gauntlet brief + production no-op + local-preview slot fill)

> **Preview policy.** These two files are REQUIRED. `_preview-data.json` is the
> canonical brief the register-time smoke gauntlet runs against (see the picker
> order below); `preview-inline.js` is a no-op in production AND fills slots for
> the local preview. To actually SEE the design rendered, the review loop is:
> **`vincia preview`** — the kit's CLI local preview server (fills your
> `_preview-data.json` slots, serves a `127.0.0.1:<port>` URL). That's what
> works for a design-template without any studio app. When the **`/studio`** MCP
> surface is connected and the template is imported into a studio app, the
> hosted `vincia_studio_get_staging_url` / `vincia_studio_screenshot` path gives
> an inline screenshot too. **Don't hand-roll a raw-file preview** (`python -m
> http.server` / `file://` / double-click `index.html`) — the `{{SLOT}}`s show
> literal and the JSON `fetch()` is blocked; use `vincia preview` instead.
> (Update 2026-05-31: the chat-first `vincia_sandbox_run` now ALSO previews a
> `design-template` cloud draft — it returns a hosted
> `https://preview.vincia.io/p/<hash>/index.html` with slots filled, so a
> CLI-less client on the `/contributor` connector can preview from chat. Use
> `vincia preview` when working in a terminal; both are valid.)

You still ship both files, with full sample data, because the register-time smoke gauntlet reads `_preview-data.json` and the production runtime expects the `preview-inline.js` tag to be a harmless no-op. The Vincia importer always gets the un-substituted source — slots stay literal in the HTML so slot-discipline checks pass.

You produce TWO additional files alongside the HTML/CSS:

**1. `_preview-data.json`** — sample copy + photo URLs that mirror the brand brief shape:

```jsonc
{
  "copy": {
    "BRAND_NAME": "Threadbare",
    "HERO_HEADLINE": "Sentences worth keeping, every Sunday morning",
    "HERO_LEDE": "Threadbare is a weekly newsletter about prose, attention, and the quiet craft of writing.",
    // ... one entry for every {{SLOT}} you used in the HTML
  },
  "photoUrls": {
    "author-portrait": "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&q=85"
    // ... one entry for every {{photo:slot-name}}
  },
  "photoAlts": {
    "AUTHOR_PHOTO_ALT": "Lina at her writing desk in warm afternoon light"
    // alt-text slots that appear in <img alt="...">
  }
}
```

This is the SAMPLE data that demonstrates your design, not the final brand. Pick copy that's honest to the design direction — long-form serif sample for a newsletter, dense numeric sample for a dashboard, etc. A reviewer who opens the page should see the design at its intended best.

**2. Add this script tag at the bottom of EVERY `.html` page** (just before `</body>`):

```html
<script src="preview-inline.js" defer></script>
```

The designer drops a copy of `preview-inline.js` (which ships in the kit's `tools/` folder) into the same folder. When they open `index.html`, the script reads `_preview-data.json` and substitutes every `{{SLOT}}` and `{{photo:slot}}` in the rendered DOM. The HTML SOURCE files still contain the slots, so the importer's slot-discipline checks still see them.

In production, Vincia's runtime fills slots BEFORE serving HTML, so `preview-inline.js` finds no `{{}}` patterns at production time and is a no-op. It does not affect the production build at all.

**Pattern recap:**

```
your-template-folder/
├── template.json                  ← metadata (Vincia reads this)
├── styles.css                     ← all CSS
├── index.html                     ← <body> ends with <script src="preview-inline.js" defer></script>
├── about.html
├── contact.html
├── _preview-data.json             ← sample data for direct-browser preview
└── preview-inline.js              ← copy from kit's tools/ folder
```

Importer behavior: `_preview-data.json` is now **also used as the canonical brief** for the register-time smoke gauntlet (canonical + 3 stress modes: long-content / minimal-content / extreme-palette). It's preferred over the server's `sample-brands/*.json` library because it always covers the template's own slot inventory faithfully. So make sure `_preview-data.json` is complete (every declared `copySlots[]` slot has a value, every `photoSlots[]` has a URL) — otherwise the smoke gauntlet will report unfilled slots.

`preview-inline.js` is bundled but not used by Kythir at deploy time — it's just for the local browser-preview workflow.

Brief picker order at register time (server-side, see `lib/template-library.ts#resolveBrief`):

1. Caller's `--brief <slug>` if it resolves on the server's sample-brands library.
2. The template's own `_preview-data.json` (this file).
3. Server-side `sample-brands/*.json` whose `industry` matches your archetype.
4. First server-side brief alphabetically (last-resort fallback — if you see this in the CLI's "smoke brief: source" line, your archetype has no canonical brief and no `_preview-data.json` was bundled — fix the latter).

## RULE 5 — Load Google Fonts via `<link>` in EVERY `.html` page

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
<link href="styles.css" rel="stylesheet" />
```

List the font URLs in `template.json` under `fonts[]` so Vincia's per-brand pipeline can swap them when the brand asks for a different typeface.

## RULE 6 — `template.json` shape (lightweight metadata only)

This is NOT the design — the design lives in HTML/CSS. This is just the metadata Vincia needs to register, classify, and substitute at production time.

```json
{
  "id": "wellness-habit-tracker-warm-earth-001",
  "schemaVersion": 2,
  "format": "html",
  "archetype": "wellness-habit-tracker",
  "buildType": "website",
  "designDirection": "Warm earth-tone wellness with calm typography",
  "qualityScore": 9.5,
  "designedBy": "Claude Sonnet 4.6 + reviewed by <human>",
  "createdAt": "2026-05-07",
  "referenceInspiration": ["https://example.com"],

  "signature": {
    "vibe": ["calm", "warm", "domestic", "trustworthy"],
    "density": "standard",
    "displayScale": "default",
    "paletteFamily": "warm-earth-amber",
    "voice": "wellness-calm",
    "motionLevel": "subtle",
    "industries": ["wellness", "habit-tracker", "lifestyle-app"]
  },

  "pages": [
    { "file": "index.html", "role": "home" },
    { "file": "about.html", "role": "about" },
    { "file": "contact.html", "role": "contact" }
  ],

  "fonts": [
    "https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&display=swap",
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
  ],

  "themeVars": {
    "colors": ["--brand", "--accent", "--secondary", "--ink", "--mute", "--bg", "--surface", "--surface-alt", "--line", "--ink-on-brand"],
    "fonts": ["--font-display", "--font-body"]
  },

  "copySlots": [
    { "slot": "HERO_HEADLINE", "type": "headline", "maxWords": 8, "guidance": "Action-led, calm, declarative." },
    { "slot": "HERO_LEDE", "type": "subhead", "maxWords": 28, "guidance": "1-2 sentences explaining what + who-for." }
  ],

  "photoSlots": [
    { "slot": "hero-image", "tags": "lifestyle + warm-light + plants + indoor", "aspectRatio": "16/10" },
    { "slot": "mockup-image", "tags": "phone-mockup + app-screenshot + clean-ui", "aspectRatio": "9/16" }
  ],

  "insertionZones": [
    { "id": "after-features", "page": "index.html", "selector": "#zone-after-features", "label": "After Features section" },
    { "id": "before-cta", "page": "index.html", "selector": "#zone-before-cta", "label": "Before final CTA band" }
  ],

  "allowedAdjustments": [
    "swap photoStyle from photo to illustration",
    "drop trusted-by band if no logos",
    "switch to dark mode via [data-theme=dark] attribute"
  ]
}
```

## RULE 7 — Insertion zones for post-instantiation editing

Vincia users can add preset sections (from the 250+ preset library) into a template-based build. To support this, mark drop zones inside each HTML page with a stable selector:

```html
<!-- After the features section, before the testimonials -->
<div id="zone-after-features" data-vincia-insertion-zone="after-features"></div>
```

The Vincia editor finds these zones, lets users insert preset sections at them. Without zones the template still works — users just can't add custom sections inline.

List all zones in `template.json` under `insertionZones[]` so Vincia's editor knows where they are.

## RULE 8 — Forbidden anti-patterns (auto-rejected by importer)

| Anti-pattern | Why rejected |
|---|---|
| Hardcoded brand copy in HTML (e.g. `<h1>Stop guessing commissions</h1>`) | Couples template to one brand |
| Hardcoded image URLs (e.g. `<img src="https://images.unsplash.com/...">` outside a comment) | Breaks per-brand image search |
| Literal colors outside `:root` (e.g. `color: #1a1a1a` mid-stylesheet) | Breaks per-brand theming |
| Inline `<style>` blocks in HTML | All CSS must live in `styles.css` |
| Inline `style="..."` attributes (other than `background-image:url('{{photo:...}}')`) | Same reason |
| `<script>` blocks with non-trivial logic | Templates ship as static HTML; client-side complexity belongs to widgets, not templates |
| External JS frameworks (`<script src="https://cdn.jsdelivr.net/...">`) | Breaks Kythir's deterministic build |
| `<form>` with `action="https://..."` posting to remote endpoints | Forms must POST to relative paths; Vincia's runtime owns form handling |
| `@import` or `url()` to remote stylesheets (other than the Google Fonts `<link>` tag) | Same security/determinism reasoning |
| `!important` outside CSS reset / button override scope | Indicates design fighting itself |
| Different fonts/colors page-to-page | Templates must be coherent across all pages |
| Stacking >9 sections per page | Content soup risk |
| Same headline content repeated across sections | Duplication |
| Slot names not in `copySlots[]` of `template.json` | Vincia can't fill them |
| Photo slots not in `photoSlots[]` | Vincia can't search images |

## RULE 9 — Required pages

| Build type | Required pages |
|---|---|
| `website` | `index.html`, `about.html`, `contact.html` (pricing/blog optional) |
| `website` | `index.html`, `about.html`, `contact.html`, `login.html`, `signup.html`, `dashboard.html` |
| `portal` | `dashboard.html`, `settings.html` (others vary by archetype) |

Each page should have 6-9 visible sections. Fewer feels thin; more feels like content soup.

## RULE 10 — Signature must use canonical vocabularies

`signature.archetype` ∈ canonical archetype list (see `SCHEMA.md`).
`signature.vibe[]` from canonical vibe vocabulary (3-6 tags).
`signature.density` ∈ {compact, standard, airy}.
`signature.displayScale` ∈ {default, oversize, editorial-poster}.
`signature.paletteFamily` from canonical palette families.
`signature.voice` from canonical voice tones.
`signature.motionLevel` ∈ {still, subtle, playful, cinematic}.

The matcher uses these as enums. Stick to them.

## RULE 11 — Preset-library awareness (where users splice in extras)

Vincia ships a catalog of ~250 reusable preset section-blocks (every category below is filled in already; new ones rarely appear). When `insertionZones[]` is non-empty, end users can pick presets from this catalog at marked spots and append them to your template at build time. So your job is two-fold: (a) place insertion zones at the joints in your composition where the user is *most likely to want extra material*, (b) make sure spliced sections will visually belong by exposing **generic class hooks** they can inherit.

### Existing preset categories (the user can pick from any of these)

| Category | Typical use | Examples |
|---|---|---|
| `headers` (≈30) | Top-of-page bands | nav-band, sticky-nav, utility-bar, brand-strip |
| `heroes` (≈30) | Hero-band variants | photo-overlay-hero, mockup-overlap-hero, split-cta-hero, dark-hero, oversize-headline-hero |
| `features` (≈30) | Feature grids | 4-up-card-grid, 2col-feature-with-feed-sidebar, 3-up-icon-row, alternating-split-rows |
| `pricing` (≈12) | Pricing tiers | 3-tier-grid, simple-table, tiered-with-most-popular, single-price-callout |
| `testimonials` (≈18) | Social proof | quote-pull, photo-grid, marquee-quotes, single-feature-quote |
| `process` (≈18) | How-it-works | 3-step-card, 4-stage-pipeline, dashed-connector-process, numbered-rows |
| `cta` (≈15) | Conversion blocks | dark-cta-band, full-bleed-cta, two-column-with-form, app-store-pair |
| `faq` (≈8) | Q&A | accordion, 2col-grid, search-faq |
| `gallery` (≈30) | Image grids | 3x2-photo-cards, 8up-cover-tiles, mosaic-mixed, masonry |
| `lists` (≈20) | Article/feed rows | list-rows-with-format-chips, byline-and-readtime, archive-grouped |
| `team` (≈10) | Team grids | portrait-grid, 2col-bio, leadership-row |
| `stats` (≈12) | KPI strips | 4-up-stats, dark-stat-band, animated-counters |
| `footers` (≈15) | Page footers | multi-col-with-newsletter, simple-2-row, dark-with-social |
| `forms` (≈20) | Form layouts | contact-2col, multi-step-onboarding, single-field-newsletter |
| `dashboard-tiles` (≈15) | KPI / metric cards | sparkline-kpi, big-number-tile, gauge-tile |
| `data-tables` (≈10) | Sortable tables | basic-rows, with-status-pill, with-row-actions |
| `press` (≈8) | Logo strips, mentions | 5-up-mono, 3-row-grid |
| `category-grid` (≈12) | Card directories | 4-up-with-counts, 6-up-with-eyebrow |

The user picks at most 1-3 presets per build, and only at zones you've marked. So make every zone a meaningful seam, not noise.

### Recommended zones per archetype

- **SaaS marketing (`b2b-saas-marketing`, `portal-website-dashboard` home)**: 3 zones — `after-hero` (room for a quick `press` or `stats` band), `after-features` (room for `process` or `testimonials`), `before-cta` (room for `pricing` or `faq`).
- **Wellness / lifestyle (`wellness-habit-tracker`, `lifestyle-blog-mosaic`)**: 2 zones — `after-features`, `before-cta`. Hero stays clean; users don't want to insert mid-narrative.
- **Magazine / editorial (`magazine-broadsheet`, `literary-journal`, `scientific-publisher`)**: 6-10 zones — between every column / cover-strip / archive band, so the user can extend the publication with new editorial bands.
- **Concept sites (microsites, scroll narratives, art portfolios, wedding invitations)**: **`insertionZones: []`**. The design IS the product. Editing happens through the slot system only. The Vincia editor hides the "+ Add section" button.
- **Portal dashboard pages (`/dashboard`, `/account`, `/billing`)**: 0-1 zones at most. Dashboards are intentional layouts — preset insertion would clutter them.
- **Catalog / directory (`startup-directory`, `restaurant-hospitality`, `agency-portfolio`)**: 2-4 zones — between section bands so the user can add filtered sub-collections.

### Make spliced presets visually belong: expose these class hooks

Spliced presets read your template's CSS via shared class names. Without these hooks, an inserted section ships its own crude defaults and looks airdropped. Define these as part of `styles.css`:

```css
/* Buttons — every preset's CTAs read these */
.btn { ... }
.btn.primary { background: var(--brand); color: var(--ink-on-brand); }
.btn.secondary { background: var(--surface); color: var(--ink); border: 1px solid var(--line-strong); }
.btn.ghost, .btn.danger, .btn.sm, .btn.lg { ... }

/* Section chrome — spliced bands inherit padding + max-width */
.container, .container-narrow { ... }

/* Eyebrow / heading hierarchy — every preset uses these */
.eyebrow { color: var(--brand); text-transform: uppercase; ... }
.h1, .h2, .h3 { ... }
.lede { ... }

/* Cards — feature-card / testimonial-card / faq-item presets all read .card */
.card { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius-lg); padding: var(--space-5); }
.card-header { ... }

/* Badges + status pills — used by data-table / list / dashboard presets */
.badge { ... }
.badge.success, .badge.warning, .badge.danger { ... }

/* Form fields — used by every form preset */
.field { ... }
.field input, .field select, .field textarea { ... }

/* Insertion zone marker — invisible, but presets append after it */
[data-vincia-insertion-zone] { display: block; height: 0; overflow: visible; }
```

Both shipped exemplars (`wellness-habit-tracker-warm-earth-001`, `portal-website-dashboard-001`) demonstrate this hook surface — read either's `styles.css` for the canonical set. As long as your template names its primitives the same way, anything Kythir splices in adopts your palette, type scale, and spacing automatically.

### When `insertionZones: []` is the right answer

You should leave `insertionZones[]` empty when:

- The page IS the design — wedding invite, art portfolio, product-launch teaser, scroll narrative.
- Adding a section anywhere would visually break the composition.
- The brand asked for a coherent, locked design and the user editing later only changes copy / photos / palette.

This is a first-class shape, not a downgrade. Vincia's editor reads `insertionZones: []` and hides the "+ Add section" button on every page so users never see a preset picker that wouldn't fit. The slot editor still surfaces every `{{SLOT}}`, `{{photo:slot}}`, and palette/font override — the design stays editable.

---

# ============================================================
# PART C — QUALITY BAR (≥9.5/10)
# ============================================================

> A 9.5/10 template means: a senior designer would say "yes, this is a real production design" not "this looks templated".

| Dimension | What 9.5+ looks like |
|---|---|
| **Page narrative** | Visitor's eye flows hero → trust → features → process → social-proof → CTA → footer. Each section earns its place. |
| **Type hierarchy** | H1 dramatically larger than H2 (1.5-2× ratio). H2 dramatically larger than body (2-3× ratio). Tracking + leading tuned for the chosen face. |
| **Color palette discipline** | 1 brand + 1 accent + neutrals (4-5 colors total). Not a rainbow. 4.5:1 minimum text contrast. Brand and accent occupy distinct hue families. |
| **Spacing rhythm** | Section padding cadence feels designed, not random. Hero usually large; mid-page alternates large/medium; footer compact. |
| **Layout proportions** | When 2-col, golden (7.4/4.6) or editorial (5/7) or magazine (4/8). 50/50 only when content is genuinely symmetric. |
| **CTA hierarchy** | Primary button visually dominates (filled, brand color). Secondary visibly secondary (ghost or outlined). Tertiary tiny text-only. |
| **Photo treatment** | Coherent filter / treatment across all photos in the build. If hero is duotone, all secondaries duotone with same tint. |
| **Distinctive moment** | Every template has 1-2 signature elements that make it memorable. Floating dashboard mockup, oversize editorial H1, colored squircle process badges, etc. |
| **No content soup** | Every section earns its place. You can articulate WHY it's there. |
| **Production-ready** | Slots semantic + named (`HERO_HEADLINE` not `TEXT_1`). Photo tags specific. Allowed adjustments listed. |
| **Cross-page coherence** | About + Contact + Pricing share the same nav, footer, CSS variables, type rhythm. They feel like the same site. |
| **Responsive without fragility** | Single-column on mobile. No horizontal scroll. Hero text remains legible. Touch targets ≥44px. |

When in doubt, ask: "Could this template, with realistic brand inputs, ship as a $5,000 designer-built site?" If yes → 9.5+. If "feels templated" → revise.

---

# ============================================================
# PART B (cont.) — STATEFUL & A11Y CONVENTIONS
# ============================================================

## RULE 12 — Dark-mode and theme-state overrides

When a template wants to support dark-mode, app-state-driven look-and-feel
(maintenance / onboarding / error), or per-route theming, follow these
attribute selectors. Vincia's runtime sets them; your CSS reads them.

### Dark mode — `[data-theme="dark"]` on `<html>`

```css
:root {
  /* light defaults */
  --ink: #0c1220;
  --bg: #f6f8fb;
  --surface: #ffffff;
  --surface-alt: #f0f3f8;
  --line: rgba(12, 18, 32, 0.08);
}

[data-theme="dark"] {
  /* override only the colors that change */
  --ink: #f0f3f8;
  --bg: #0c1220;
  --surface: #161b2a;
  --surface-alt: #1f2538;
  --line: rgba(240, 243, 248, 0.08);
}
```

Rules to follow:

- Re-declare the variables inside `[data-theme="dark"]`. Do **not** re-define `--brand` unless the brand explicitly demands a different brand color in dark mode.
- Don't write component-specific dark-mode rules (e.g. `[data-theme="dark"] .card { background: #161b2a }`). The component already reads `var(--surface)` which now resolves to the dark value.
- If a photo or illustration looks wrong in dark mode, use `[data-theme="dark"] .hero img { filter: brightness(0.85) contrast(1.05); }` — that's the only place photo treatment may be theme-conditional.

### App state — `[data-state="..."]` on `<html>` or `<body>`

The host runtime may set `data-state="maintenance"`, `"error"`, or `"onboarding"`. Your template can show a different surface when these are active:

```css
[data-state="maintenance"] .hero { display: none; }
[data-state="maintenance"] .maintenance-banner { display: block; }

[data-state="onboarding"] .nav-anchors { display: none; }
[data-state="onboarding"] .hero-cta-row { gap: var(--space-2); }
```

Use sparingly. If you're not sure the state will ever fire, skip it.

### Per-route theming — `[data-route="/admin"]`

For website templates, the marketing pages and the dashboard often share a header but want different chrome density. Use `[data-route="..."]` selectors instead of duplicating CSS:

```css
[data-route^="/admin"] .site-header { display: none; }
[data-route^="/admin"] .app-shell { display: grid; }

[data-route="/"], [data-route^="/about"], [data-route^="/pricing"] {
  /* marketing surface */
}
```

If the runtime doesn't set `data-route`, your normal cascade still works — the route selectors are additive overrides.

### Coexistence with Vincia's `resolveActiveTheme`

Vincia's runtime evaluates theme overrides server-side too — `resolveActiveTheme(brand, route, state)` resolves to the right CSS-var values before HTML ships. Your selectors run as a redundant layer on the client, which is the right belt-and-suspenders default for SSR + hydration. Don't fight it.

## RULE 13 — Accessibility baseline + reduced motion

Every template must meet WCAG AA for body copy and AA-large for headlines. The importer can't measure contrast yet (P1), but reviewers will.

### Color contrast minimums

- **Body text on background**: 4.5:1 ratio (WCAG AA).
- **Large text** (18px+ regular, 14px+ bold): 3:1 ratio (WCAG AA-large).
- **Interactive elements** (buttons, links): 3:1 against their immediate background.
- **Focus rings**: 3:1 against both the focused element AND the surrounding background.

If you're using oklch, aim for ~30% lightness gap between text and background for body, ~20% for large text.

### Focus-visible required

```css
*:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: 2px;
  border-radius: var(--radius-xs);
}
```

This applies globally. Don't `outline: none` anywhere unless you replace it with a `box-shadow` ring of equivalent visibility.

### Reduced motion

If you use any motion (transitions, transforms, scroll animations, marquees), gate them behind:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

(One of the few legitimate uses of `!important` — accessibility override.
The CSS lint **allows** `!important` inside `@media (prefers-reduced-motion: ...)`,
`@media (prefers-contrast: ...)`, and `@media (forced-colors: ...)` queries
without warning. Use the universal-selector pattern shown above.)

### ARIA conventions

- **Landmarks**: every page has `<header>`, `<main>`, and `<footer>` once each. Sidebar uses `<aside>`. Multi-section pages can use `<section>` per band.
- **Buttons vs links**: a `<button>` does an action (open modal, submit form, toggle state). An `<a href>` navigates. Don't fake buttons with anchors.
- **Form labels**: every `<input>` has an explicit `<label for="...">` or wraps a label. Placeholder is not a label.
- **Image alt text**: every `<img>` declares `alt`. Decorative images use `alt=""`. Slot-driven images use `alt="{{ALT_SLOT}}"` with a corresponding copy slot.
- **Modal**: outer container uses `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` pointing at the modal heading id. Hidden state via `aria-hidden="true"` on the overlay.
- **Toast**: `role="status"` + `aria-live="polite"`. For errors use `role="alert"` + `aria-live="assertive"`.
- **Tabs**: tab buttons use `role="tab"` + `aria-selected="true|false"`; the panel uses `role="tabpanel"` + `aria-labelledby` pointing at the tab.
- **Sidebar nav active item**: `aria-current="page"` on the current-page link (the CSS reads `[aria-current="page"]`).

### Keyboard navigation

- Tab order should follow visual order (don't `tabindex` your way out of bad markup).
- All interactive elements reachable by keyboard alone.
- Modals trap focus while open and restore focus to the trigger on close (the host runtime handles this, but your markup must be tab-correct).
- Skip-to-content link recommended at the top of every page:

```html
<a class="skip-link" href="#main">Skip to content</a>
<!-- ... -->
<main id="main">...</main>
```

with CSS:

```css
.skip-link {
  position: absolute;
  left: -9999px;
}
.skip-link:focus {
  position: static;
  padding: var(--space-2) var(--space-3);
  background: var(--ink);
  color: var(--ink-on-brand);
}
```

## RULE 14 — Motion language (matches `signature.motionLevel`)

Pick a motion budget at the start of authoring — it's part of `signature.motionLevel`. The budget tells you how much animation to write and what the page feels like in motion. Below: the four levels and what each looks like in practice. **Wrap every motion you ship in `prefers-reduced-motion: reduce` (Rule 13)** so users who opt out get a static page.

### Tokenize motion in `:root`

Same idea as palette/spacing — define motion as variables so per-build adjustments stay one-place:

```css
:root {
  --duration-instant: 80ms;
  --duration-quick:   150ms;
  --duration-mid:     280ms;
  --duration-slow:    480ms;
  --duration-cinematic: 800ms;

  --ease-snap:    cubic-bezier(0.2, 0, 0, 1);            /* enters / exits / hovers */
  --ease-in-out:  cubic-bezier(0.4, 0, 0.2, 1);          /* generic */
  --ease-spring:  cubic-bezier(0.34, 1.56, 0.64, 1);     /* playful overshoot */
  --ease-soft:    cubic-bezier(0.25, 0.1, 0.25, 1);      /* cinematic */

  --reveal-distance: 12px;       /* how far entrance animations slide */
}
```

### `motionLevel: still`

No animation, no transitions. Hover changes color/opacity instantly. No entrance reveals, no scroll effects, no parallax.

```css
:root { --duration-quick: 0ms; --duration-mid: 0ms; }
.btn { transition: none; }
```

Right for: clinical-medical-trust, legal-empathetic-trust, scientific-publisher, academic-research-lab, financial-advisor-trust. Anywhere the brand reads as authoritative + serious + must-not-feel-app-like.

### `motionLevel: subtle` (default for most templates)

Small `--duration-quick` transitions on color / background / transform. Single-property fades for image swaps. NO scroll-driven anything. NO autoplay. NO bounce/spring/overshoot.

```css
.btn { transition: background var(--duration-quick) var(--ease-snap),
                   transform var(--duration-quick) var(--ease-snap); }
.btn.primary:hover { transform: translateY(-1px); background: var(--ink); }
.card { transition: border-color var(--duration-mid) var(--ease-snap); }
.card:hover { border-color: var(--line-strong); }

/* ONE entrance pattern — fade + slide-up on hero only, on first paint, no scroll dependency */
@keyframes hero-rise {
  from { opacity: 0; transform: translateY(var(--reveal-distance)); }
  to   { opacity: 1; transform: translateY(0); }
}
.hero .h1 { animation: hero-rise var(--duration-slow) var(--ease-snap) both; }
.hero .lede { animation: hero-rise var(--duration-slow) var(--ease-snap) 80ms both; }
```

Right for: b2b-saas-marketing, wellness-habit-tracker, portal-website-dashboard, agency-portfolio, creator-newsletter, magazine-broadsheet. The default — modern but not loud.

### `motionLevel: playful`

Spring eases on hover, button micro-interactions, badge pop-in on data load, scroll-triggered reveals on content sections, optional cursor-follower on hero illustrations. Still no autoplay video / parallax-drift hero.

```css
.btn { transition: transform var(--duration-mid) var(--ease-spring); }
.btn.primary:hover { transform: translateY(-2px) scale(1.02); }
.feature-card { transition: transform var(--duration-mid) var(--ease-spring),
                            box-shadow var(--duration-mid) var(--ease-snap); }
.feature-card:hover { transform: translateY(-4px) rotate(-0.4deg); box-shadow: var(--shadow-lg); }

@keyframes pop-in {
  from { opacity: 0; transform: scale(0.96); }
  to   { opacity: 1; transform: scale(1); }
}
.kpi-tile .value { animation: pop-in var(--duration-mid) var(--ease-spring) both; }

/* Scroll reveal — needs IntersectionObserver in script.js to add `.in-view` */
.feature-card { opacity: 0; transform: translateY(var(--reveal-distance)); transition: opacity var(--duration-slow) var(--ease-snap), transform var(--duration-slow) var(--ease-snap); }
.feature-card.in-view { opacity: 1; transform: translateY(0); }
```

Right for: pet-services-warm, music-artist-portfolio (subset), startup-directory, lifestyle-blog-mosaic, fitness-gym-studio, podcast-show.

When you use `playful`, ship a tiny `script.js` with an IntersectionObserver that toggles `.in-view` on `[data-reveal]` elements as they enter the viewport. Keep it under 30 lines, no framework imports.

### `motionLevel: cinematic`

Full-bleed hero with subtle parallax + slow auto-fading background images. Page transitions (only for SPA-shape sites). Long-running ambient animations on hero (scroll-locked image cross-fade, oversized typography reveal sequenced word-by-word). Reserved for editorial, art, and luxury surfaces where motion IS part of the brand.

```css
.hero {
  /* subtle parallax via transform on scroll — needs scroll-listener in script.js */
  --parallax-y: 0px;
  background-image: url('{{photo:hero-image}}');
  background-size: cover;
  background-position: center calc(50% + var(--parallax-y));
}

/* Word-by-word headline reveal */
@keyframes word-rise {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.hero .h1 .word {
  display: inline-block;
  animation: word-rise var(--duration-cinematic) var(--ease-soft) both;
}
.hero .h1 .word:nth-child(1) { animation-delay: 0ms; }
.hero .h1 .word:nth-child(2) { animation-delay: 120ms; }
.hero .h1 .word:nth-child(3) { animation-delay: 240ms; }
/* ... etc */

/* Slow background cross-fade on hero photo */
@keyframes ambient-fade {
  0%, 90%, 100% { opacity: 1; }
  45%, 55% { opacity: 0; }
}
.hero::after { animation: ambient-fade 12s var(--ease-soft) infinite alternate; }
```

Right for: luxury-monograph, art-exhibition-microsite, music-artist-portfolio (full), wedding-invitation, product-launch-teaser, photography-portfolio.

### Pattern matrix — what to use where

| Pattern | still | subtle | playful | cinematic |
|---|---|---|---|---|
| Hover state (color shift) | instant | quick | mid spring | mid soft |
| Hover state (transform translateY/scale) | none | -1px | -2px to -4px + scale | sequenced |
| Entrance — hero | none | fade+rise (first paint) | fade+rise w/ spring | word-by-word reveal |
| Entrance — content sections | none | none | scroll-triggered fade-up | sequenced reveals |
| Page transition | none | none | none | slow cross-fade (SPA only) |
| Parallax | none | none | none | subtle bg-position-y scroll lock |
| Marquee / ticker | none | none | OK if brand-relevant | OK |
| Cursor follower | none | none | optional | yes (hero only) |
| Autoplay video | never | never | never | only if muted + loop + decorative |

### Reduced-motion fallback (always required if you ship any motion)

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  /* If you used IntersectionObserver, also force everything to "in-view": */
  [data-reveal] { opacity: 1 !important; transform: none !important; }
}
```

If a user opts into reduced-motion, the page must be **fully usable without any motion** — no half-rendered states, no invisible-until-revealed content, no jank.

### Importer / lint hooks (current + planned)

The current linter doesn't read motion. Future rules to add (P3):

- Warn if `signature.motionLevel === 'still'` but the CSS contains animation/transition declarations.
- Warn if `signature.motionLevel !== 'still'` but the CSS lacks a `@media (prefers-reduced-motion: reduce)` block.
- Warn if any animation duration > 1500ms (likely accidental, not intentional cinematic).

Until those land, self-check: **does my motion pass the rubric for the `motionLevel` I declared, and is it gated behind reduced-motion?**

---

# PART B-EXT — PATH 3 PARSER-READY CONTRACTS (RULES 15-22)

> **Why these rules matter.** Vincia's importer parses your template's HTML
> into a native AppDefinition (the same widget-tree model the in-app section
> editor + Kythir co-pilot use). When the parser succeeds, the deployed site
> looks **identical** to your design AND remains **fully editable** — users
> can add/remove sections, edit copy, reorder, change palette, etc. without
> losing visual fidelity.
>
> For the parser to work, your HTML must declare its STRUCTURE via
> `data-vincia-*` attributes. These rules formalise that contract.
>
> Each registered template's sections also auto-export to Vincia's preset
> library (272+ existing presets). Other users can splice your sections into
> their builds; Kythir's blend mode composes new sites from cross-template
> sections. **Following these rules makes your template a contributor to the
> whole library — not just a leaf.**

## RULE 15 — Every `<section>` declares its type

Every top-level `<section>` element MUST carry `data-vincia-section-type="<value>"`. The value MUST be from `SECTION_TYPES` in `lib/canonical-vocabularies.mjs`. Common values:

| Build type | Section types you'll commonly use |
|---|---|
| `website` | `nav-primary`, `hero`, `features`, `feature-card-grid`, `testimonials`, `logo-strip`, `pricing-tiers`, `cta`, `closer`, `faq`, `gallery-grid`, `recent-articles`, `pull-quote`, `inline-subscribe-form`, `contact-form`, `site-footer` |
| `website` | All `website` types PLUS `auth-login-form`, `auth-signup-form`, `dashboard-summary`, `dashboard-kpi-grid`, `dashboard-data-table`, `account-profile`, `billing-summary`, `sidebar-nav` |
| `portal` | `auth-login-form`, `dashboard-summary`, `dashboard-kpi-grid`, `dashboard-data-table`, `audit-log-band`, `role-grid`, `admin-users`, `settings-form`, `sidebar-nav`, `breadcrumbs`, `filter-bar`, `batch-toolbar`, `drawer-detail` |

Industry-specific types are also available (`menu-display`, `reservations-form`, `class-schedule`, `product-showcase`, `cart-summary`, `episode-grid`, `tour-dates`, `discography`, `event-registration`, `wedding-rsvp`, `gallery-masonry`).

```html
<section data-vincia-section-type="hero" class="hero-band">
  …
</section>

<section data-vincia-section-type="features" class="features-band">
  …
</section>
```

If your section is genuinely novel (no canonical type fits), pick the closest match and write a short note in `template.json#designDirection` — don't invent ad-hoc types.

## RULE 16 — Every slot-bearing element declares its `data-slot-role`

Every element holding a `{{SLOT}}` placeholder MUST carry `data-slot-role="<value>"`. The value tells the parser which Vincia widget primitive to bind the slot to.

```html
<!-- Hero -->
<span class="eyebrow" data-slot-role="eyebrow">{{HERO_EYEBROW}}</span>
<h1   class="h1"     data-slot-role="heading-display">{{HERO_HEADLINE}}</h1>
<p    class="lede"   data-slot-role="lede">{{HERO_LEDE}}</p>
<a    class="btn primary"
      data-slot-role="cta-primary"
      href="{{HERO_CTA_HREF}}">{{HERO_CTA_LABEL}}</a>
<a    class="btn ghost"
      data-slot-role="cta-secondary"
      href="{{HERO_CTA_2_HREF}}">{{HERO_CTA_2_LABEL}}</a>
<span class="trust-line" data-slot-role="trust-line">{{HERO_TRUST}}</span>
```

Common roles: `heading-display`, `heading-section`, `heading-card`, `lede`, `body`, `eyebrow`, `kicker`, `meta`, `trust-line`, `legal-text`, `cta-primary`, `cta-secondary`, `cta-ghost`, `link-href`, `link-label`, `nav-label`, `placeholder`, `helper-text`, `field-label`, `feature-title`, `feature-body`, `quote`, `attribution`, `attribution-role`, `attribution-org`, `stat-value`, `stat-label`, `stat-delta`, `pricing-tier-name`, `pricing-amount`, `pricing-cadence`, `pricing-feature-item`, `badge-text`, `faq-question`, `faq-answer`, `step-number`, `step-title`, `step-body`, `article-kicker`, `article-title`, `article-sub`, `article-date`, `article-author`, `alt-text`, `image-caption`, `footer-tagline`, `footer-section-heading`, `footer-link-label`, `footer-copyright`. Full list in `lib/canonical-vocabularies.mjs#CANONICAL_SLOT_ROLES`.

If a role doesn't fit, use `generic` — but every slot still needs a role attribute.

## RULE 17 — Every `<form>` is parser-functional, not decorative

For `website` and `portal` builds, login + signup + password-reset forms MUST be REAL functional forms, not visual mockups. The parser turns them into Vincia's `login-form` / `signup-form` / `password-reset-form` widgets which actually authenticate.

Every `<form>` declares:
- `data-vincia-form="<form-id>"` — unique within the page (e.g. `newsletter`, `contact`, `login`)
- Optional `data-vincia-form-workflow="<workflow-slug>"` — workflow to fire on submit

Every form field declares:
- `data-vincia-field="<field-name>"` — the AppDefinition field name (kebab-case)
- input element's `type` attribute MUST be from `FORM_FIELD_TYPES`: `text`, `email`, `longtext` (use `<textarea>`), `number`, `password`, `url`, `tel`, `date`, `time`, `datetime`, `color`, `file`, `country`, `state`, `city`, `operations`, `checkbox`, `radio`, `select`, `reference`, `richtext`
- HTML `required` attribute when applicable
- `<label for="...">` referencing the field's `id`, with `data-slot-role="field-label"`
- Placeholder slot: `data-slot-role="placeholder"` (empty span if no placeholder needed)
- Helper text below: `data-slot-role="helper-text"` (optional)
- Submit button: `<button type="submit" class="btn primary" data-slot-role="cta-primary">{{FORM_SUBMIT}}</button>`

```html
<form data-vincia-form="newsletter-subscribe" class="subscribe-form">
  <label for="newsletter-email" data-slot-role="field-label">{{SUBSCRIBE_LABEL}}</label>
  <input type="email"
         id="newsletter-email"
         data-vincia-field="email"
         placeholder="{{SUBSCRIBE_PLACEHOLDER}}"
         required />
  <button type="submit"
          class="btn primary"
          data-slot-role="cta-primary">{{SUBSCRIBE_BUTTON_LABEL}}</button>
  <p class="helper" data-slot-role="helper-text">{{SUBSCRIBE_HELPER}}</p>
</form>
```

For login forms specifically, the parser recognises `data-vincia-form="login"` + an email field + password field as the canonical login pattern.

## RULE 18 — Every `<nav>` declares its type

Every `<nav>` element carries `data-vincia-nav="<value>"` from `NAV_TYPES`: `primary`, `secondary`, `utility-bar`, `footer`, `breadcrumbs`, `mobile`, `sidebar`, `tabs`.

Each nav item carries `data-vincia-nav-item="<id>"` + a real `href`:

```html
<nav data-vincia-nav="primary" class="site-nav">
  <a data-vincia-nav-item="home"     href="/"        data-slot-role="nav-label">{{NAV_HOME}}</a>
  <a data-vincia-nav-item="about"    href="/about"   data-slot-role="nav-label">{{NAV_ABOUT}}</a>
  <a data-vincia-nav-item="archive"  href="/archive" data-slot-role="nav-label">{{NAV_ARCHIVE}}</a>
  <a data-vincia-nav-item="contact"  href="/contact" data-slot-role="nav-label">{{NAV_CONTACT}}</a>
</nav>
```

For sidebar nav (portal / dashboard): `data-vincia-nav="sidebar"`. For utility bars (sign in · subscribe across the top): `data-vincia-nav="utility-bar"`.

## RULE 19 — Lists declare type + item template

When you have a repeated structure (cards, articles, testimonials, gallery items, pricing tiers, etc.), the container element carries `data-vincia-list="<value>"` from `LIST_TYPES`. The first child carries `data-vincia-list-item-template`. Subsequent items follow the SAME structure (same elements, same slot-roles).

```html
<ul data-vincia-list="articles"
    data-vincia-list-min="1"
    data-vincia-list-max="6"
    class="articles-list">
  <li data-vincia-list-item-template class="article-row">
    <span data-slot-role="article-kicker">{{ARTICLE_1_KICKER}}</span>
    <h3   data-slot-role="article-title">{{ARTICLE_1_TITLE}}</h3>
    <p    data-slot-role="article-sub">{{ARTICLE_1_SUB}}</p>
  </li>
  <li class="article-row">
    <span data-slot-role="article-kicker">{{ARTICLE_2_KICKER}}</span>
    <h3   data-slot-role="article-title">{{ARTICLE_2_TITLE}}</h3>
    <p    data-slot-role="article-sub">{{ARTICLE_2_SUB}}</p>
  </li>
  <!-- ARTICLE_3 follows -->
</ul>
```

The parser turns this into a Vincia repeater widget. Tenants with 1 article and tenants with 6 articles BOTH render correctly — the parser knows how to add/remove items dynamically.

`data-vincia-list-min` / `-max` (optional) — reasonable bounds. Defaults are `1` / `12`.

Common list types: `articles`, `testimonials`, `team-members`, `pricing-tiers`, `features`, `feature-cards`, `gallery-items`, `events`, `releases`, `kpis`, `stats`, `faqs`, `nav-items`, `logos`, `process-steps`, `menu-items`, `class-schedule`, `product-cards`, `episodes`, `tour-dates`, `audit-events`, `role-cards`, `data-rows`.

## RULE 20 — Insertion zones formalised

Insertion zones (RULE 7) get a stricter contract for Path 3:

- Declared in HTML: `<div data-vincia-insertion-zone="<zone-id>"></div>` (empty div is fine; semantic role is on the attribute)
- Mirrored in `template.json#insertionZones[]`: `{ id, page, selector: "[data-vincia-insertion-zone='<zone-id>']", label }`
- Common zone IDs in `COMMON_INSERTION_ZONE_IDS`: `after-hero`, `before-features`, `after-features`, `before-testimonials`, `after-testimonials`, `before-pricing`, `after-pricing`, `before-cta`, `before-footer`, `sidebar-bottom`, `dashboard-extra`. Custom IDs allowed but must appear in both HTML AND `template.json` (parity is lint-checked).

## RULE 21 — Section export to preset library

By default, every `<section data-vincia-section-type="...">` auto-exports to Vincia's preset library when the template is registered. Other users can splice your sections into their builds; Kythir blends across-templates.

To opt-out a specific section (e.g. wedding-microsite signature elements that aren't reusable), add `data-vincia-export="false"`:

```html
<section data-vincia-section-type="hero"
         data-vincia-export="false"
         class="signature-overlap-hero">
  …
</section>
```

Defaults:
- Concept templates (`insertionZones: []` in `template.json`): `data-vincia-export="false"` by default — concept templates are bespoke, sections aren't designed for reuse
- Flexible templates (any non-empty `insertionZones[]`): `data-vincia-export="true"` by default — these sections are explicitly designed to compose with others

Override per-section as needed. Most marketing-band sections (hero, features, testimonials, CTA, footer) should export.

## RULE 22 — Cross-build-type completeness

For each build type, the template MUST cover the relevant page set with FUNCTIONAL parser-recognized markup:

### `website`
- `index.html` (home) — required
- `about.html`, `contact.html` — recommended
- All bands are presentational; no `<form data-vincia-form>` required

### `website`
- `index.html`, `about.html`, `contact.html` — public marketing
- `login.html` — REAL login form: `<form data-vincia-form="login">` with email + password fields, parser converts to `login-form` widget
- `signup.html` — REAL signup form: `<form data-vincia-form="signup">` with email + password + (optional) name/company fields
- `dashboard.html` — at least one `data-vincia-section-type="dashboard-*"` section (summary / kpi-grid / data-table / chart-strip)

### `portal`
- `login.html` — REAL login form (same as above)
- `dashboard.html` — landing page after login, with at least one dashboard section
- `settings.html` (recommended) — `data-vincia-section-type="settings-form"` with real `<form data-vincia-form="settings">`
- `account.html` (recommended) — `data-vincia-section-type="account-profile"`

The lint code `STRUCT.required-page-incomplete` errors if a portal template's auth pages don't have functional form widgets.

## RULE 23 — Resilient text (long-content drift defense)

A template must look reasonable when a tenant has 3× the canonical copy. The
register-time stress smoke-render uploads a `long-content` brief automatically;
your CSS must accommodate it.

- **No `font-size` in absolute `px`** for headings. Use `clamp(min, fluid, max)`
  or `rem`. Lint code: `CSS.absolute-font-size`.
- **No fixed `height` on text blocks** (`.lede`, `.body`, `.feature-body`,
  `.testimonial-body`, `.prose`). Use `min-height` if you need to bound a
  collapsed state. Lint code: `CSS.fixed-height-text-block`.
- **Display headings declare `text-wrap: balance`** (or `pretty`) so long
  copy wraps gracefully. Lint code: `CSS.missing-text-wrap`.
- **Body-text classes declare `overflow-wrap: anywhere`** — long URLs, hashes,
  or merged words won't break narrow viewport layouts. Lint code:
  `CSS.no-overflow-wrap`.

## RULE 24 — Resilient photos (aspect-ratio + object-fit + scrim)

Tenant photos arrive in random aspect ratios. Layouts that don't reserve
space + crop properly look broken on uploads.

- **Every image-bearing selector declares `aspect-ratio`** so the box
  reserves space pre-load. Lint code: `CSS.image-no-aspect-ratio`.
- **Every `<img>` selector declares `object-fit: cover`** (or `contain` for
  logos) so the photo fills its box without squashing. Lint code:
  `CSS.image-no-object-fit`.
- **Photo-overlay sections** (`.cinematic-hero`, `.hero-photo`, etc.) MUST
  add a darkening scrim — a `::before` pseudo-element with a
  `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7))` — so tenant photos
  on the bright end don't kill text readability. Lint code:
  `CSS.text-on-photo-no-scrim`.
- **Declare `tone` and `subjectType` per photoSlot** in `template.json` so
  the future photo-transform pipeline can warn on tenant uploads that
  don't match the design intent. Canonical values listed in
  `lib/canonical-vocabularies.mjs#CANONICAL_PHOTO_TONES` +
  `CANONICAL_PHOTO_SUBJECT_TYPES`.

## RULE 25 — Resilient slots (maxChars + required + repeats)

The schema for `copySlots[]` extends with three optional fields. Declaring
them lets stress-render bound the test space + lets the render engine
(future) hide optional empty slots gracefully.

- **`maxChars`** — soft cap on copy length the slot is designed to handle.
  Hero headlines: 80–120 chars; lede: 240; feature body: 200. Stress-render's
  `long-content` mode triples copy regardless; this field documents intent.
- **`required: false`** — slots that the deployed render engine should
  HIDE if a tenant brief doesn't fill them. Examples: `HERO_PILL` (optional
  callout), `STATS_DELTA` (optional KPI delta marker), `TESTIMONIAL_QUOTE`
  (optional pull-quote). Default is `required: true`.
- **`repeats: { min, max }`** — slots that may appear multiple times
  (testimonials, feature cards, KPIs). Documents the canonical count
  range; future render engine trims `[data-vincia-list]` items to the
  brief's actual count.

The render-engine side (hide `[data-slot-optional]:empty`, trim lists
to count) is deferred to a follow-up phase per the resilience plan;
declaring the schema extensions today means templates author against
the contract from day one.

---

# ============================================================
# RESERVED ANNOTATIONS — coming next (forward-compatible)
# ============================================================

> **You can skip this section if you're authoring a static design template
> that doesn't need functional behavior.** It exists to (a) reserve the
> annotation surface so designers don't accidentally use these names for
> their own purposes, and (b) preview what's coming so templates authored
> today don't need rewrites when these features ship.
>
> **All annotations below are forward-compatible**: they're optional, the
> current importer accepts them silently, and the runtime will start
> honoring them in the phases noted. Templates authored today work as-is;
> when you opt in to a future phase, the importer + runtime do the right
> thing without manual migration.

## Path 4 — Functional templates (forms / dynamic URLs / lists / workflows / auth gating)

### Path 4a · Form submissions to a backing data table (Phase 1 — SHIPPED)

`<form data-vincia-form="contact">` already creates a backing collection
per RULE 17. Submissions land in the studio's data tables automatically
(no extra annotation needed). To trigger a workflow on submit:

```html
<form data-vincia-form="contact"
      data-vincia-form-workflow="contact-confirmation-email">
```

Declare the workflow in `template.json#workflows[]`:

```json
"workflows": [
  { "id": "contact-confirmation-email",
    "trigger": "form-submit",
    "formId": "contact",
    "steps": [{ "kind": "send-email", "to": "{{record.email}}",
                "subject": "Thanks for reaching out", "body": "..." }] }
]
```

### Path 4b · Dynamic-URL pages with API data loading (SCHEMA + LINT SHIPPED · runtime PLANNED)

For pages like `/products/:id` or `/blog/:slug` that load record data at
request time, declare in `template.json#routes[]`:

```json
"routes": [
  { "path": "/products/:id", "view": "product-detail.html",
    "load": { "collection": "products", "where": { "id": "{{params.id}}" } } }
]
```

Inside the page HTML, annotate slot elements that should substitute from
the loaded record:

```html
<h1 data-slot-role="heading-display"
    data-vincia-bind="record.title">{{TITLE}}</h1>
<p data-slot-role="lede" data-vincia-bind="record.description">{{LEDE}}</p>
```

**What's validated today (v2.3.0+):**

- `routes[].path` must match `^/(?:[a-z0-9_-]+|:[a-z][a-z0-9_]*)…$`
- `routes[].view` must reference a file in the package
- `routes[].load.where[<field>]` values must be `{{params.<name>}}` templates
  whose `<name>` matches a `:<name>` segment in `routes[].path`
- `data-vincia-bind="..."` value must match one of:
  `record.<field>` | `collection:<name>` | `params.<name>`
- Pages that use `data-vincia-bind` but have no matching `routes[]` entry
  warn (not error) — useful when authoring forward-compatibly

**What's not yet wired:** the tenant runtime ignores `routes[]` and
`data-vincia-bind` for now — pages render with literal `{{SLOT}}` fallbacks
filled from the brand brief. Runtime support lands in Path 4b Phase 2.

### Path 4c · Lists from real collection data (PLANNED)

For lists that should render one card per record from a backing collection:

```html
<ul data-vincia-list="features" data-vincia-bind="collection:projects">
  <li data-vincia-list-item-template>
    <h3 data-slot-role="feature-title"
        data-vincia-field="name">{{TITLE}}</h3>
    <p data-slot-role="feature-body"
       data-vincia-field="description">{{BODY}}</p>
  </li>
</ul>
```

### Path 4d · Workflows / web flows (SCHEMA + LINT SHIPPED · runtime PARTIAL — see Path 4a)

Multi-step workflows declared in `template.json#workflows[]` per the
shape above. Triggers can be `form-submit`, `route-load`, `webhook-in`,
`schedule`, `record-create`, `record-update`. Steps include `send-email`,
`send-sms`, `send-webhook`, `insert-row`, `update-row`, `wait`, `branch`.

**What's validated today (v2.4.0+):**

- `workflows[].id` must be lowercase kebab-case + unique within the array
- `workflows[].trigger` must be one of the 6 canonical values above
- `workflows[].formId` required when `trigger=form-submit` (warns if no
  matching `data-vincia-form` exists in any HTML page)
- `workflows[].cron` required when `trigger=schedule`
- `workflows[].collection` required when `trigger=record-create|record-update`
- `workflows[].steps[]` must be a non-empty array; each step's `kind`
  must be one of the 7 canonical kinds
- Every `data-vincia-form-workflow="<id>"` in HTML must reference a
  declared workflow id (otherwise the workflow never fires)

**What's not yet wired:** the runtime executes the form-submit hook
trivially (insert-row only, no email send / no branching / no waits).
Full step-runner support lands with Path 4d Phase 2.

### Path 4e · Auth-gated sections (LINT SHIPPED · runtime PARTIAL — page-level auth via role)

Today: pages with role `dashboard`/`account`/`billing`/`settings`/`admin`
auto-mount as private (auth-required). For per-section auth-gating on a
public-bucket page (e.g. a "members-only preview" band on the marketing
home), annotate:

```html
<section data-vincia-section-type="hero"
         data-vincia-bucket="private"
         data-vincia-auth-message="Sign in to see your dashboard preview">
```

**What's validated today (v2.4.0+):**

- `data-vincia-bucket` value must be `public | private | system`
- `data-vincia-auth-message` warns if empty
- `data-vincia-auth-message` without a sibling `data-vincia-bucket="private"`
  warns (the message has no effect on a public section)

**What's not yet wired:** the runtime ignores `data-vincia-bucket` on
section elements — every section in a page renders regardless of bucket.
Per-section gating lands with Path 4e Phase 2.

## Path 5a — Module slots (drop Vincia widgets into designer-marked spots)

Declare regions where the user (post-author) can drop pre-built Vincia
widgets (charts, kanban boards, data tables, calendars, kpi tiles, etc.)
without breaking the template's design:

```html
<section data-vincia-section-type="dashboard-metrics">
  <div class="container">
    <h2>Live numbers</h2>
    <div data-vincia-module-slot="metrics-chart"
         data-vincia-module-allow="chart,kpi-tiles"
         data-vincia-module-style="inherit"
         data-vincia-module-min-height="320px">
    </div>
  </div>
</section>
```

`module-style` modes:
- `inherit` (default) — module inherits template's CSS variables (--brand, --ink, --font-display, etc.) so it visually fits.
- `vincia` — module renders with its own kit's full styling. Bounded to the slot.
- `custom` — slot owns its CSS. Designer styles the inner module via slot-scoped rules in styles.css.

`module-allow` accepts widget types (`chart`, `data-table`, `calendar`,
`kanban`, `kpi-tiles`, `gantt`, etc.) AND composition ids
(`metrics-overview`, `customer-directory`, `billing-dashboard`).

For required slots, add `data-vincia-module-required="true"` — the deploy
gate will fail if the slot is empty.

---

# ============================================================
# PART E — WIDGET CAPABILITY INDEX (discovery, not authoring)
# ============================================================

> **You can skip this section if you're authoring a static design template
> that doesn't compose with Vincia widgets.** It exists so designers who
> DO ship templates with portal / dashboard pages know exactly which
> widgets Vincia might mount inside their layouts, what those widgets
> publish/subscribe to on the inter-widget event bus, and how to preview
> them with realistic dummy data while iterating.

## What the platform exposes

Every Vincia build serves a public, edge-cached manifest of every widget
the platform can mount:

```
GET https://<build-host>/api/v2/widgets/manifest
```

The response is `ApiEnvelope<{ contractVersion, count, widgets[] }>` —
`contractVersion: 1` since 2026-05-11, additive only. Each widget entry
carries:

- `kind` (e.g. `data-table`, `kpi-card`, `kanban`, `login-form`)
- `version`, `display.label` / `display.description` / `display.category`
  / `display.surfaces` (`public` / `private` / `system`)
- `agentTool.inputSchema` — the full JSON schema Vincia's planner uses to
  configure this widget
- `dataBinding`, `prefetch.{collectionRows, tenantUsers, serviceConfig,
  viewsSummary}` — tells you whether the runtime pre-fetches data before
  rendering this widget on a page
- `slotEligibility[]` — which slot kinds accept the widget
- `bindable[]`, `displayKind` (`block` | `inline`)
- `dataBusEmits[]` / `dataBusSubscribes[]` — see the wiring graph below
- `hasPreviewFixture: boolean` — every widget reports `true` since
  2026-05-11 Phase 1 close (Day 7-8 backfilled 84 of 84)
- `workflowEmits[]` — workflow trigger events the widget fires

There's no token to enumerate the manifest. Designer-kit preview tooling
and future developer-kit blueprint authoring both consume this endpoint.

## Why kit authors should care

1. **Style hooks.** Heavy widgets the platform mounts inside your portal
   pages (data-table, kanban, multi-step-form, calendar) have stable
   DOM class hooks. The same template that styles a kpi-card on one
   page styles every kpi-card on every page — design once, apply
   everywhere. The manifest tells you which widgets your template
   might host based on declared `surfaces`.

2. **Inter-widget event wiring (the data bus).** Widgets publish
   `data.row.upserted` / `data.row.deleted` / `data.bulk.changed` /
   `auth.session.changed` on a shared bus when their actions complete.
   Subscribers (kpi-card, list, calendar, recent-posts, etc.) refresh
   themselves without page reload. The manifest's `dataBusEmits[]` and
   `dataBusSubscribes[]` arrays are the source of truth — if a
   subscribing widget is on the same `collectionSlug` as a publishing
   widget elsewhere on the page, they will auto-sync.

   Practical implication: when your template puts a `data-table` and a
   `kpi-card` on the same dashboard, they self-coordinate. You don't
   wire anything; the bus does.

3. **Preview fixtures.** Every widget exposes a `previewFixture()` that
   returns a self-sufficient config + realistic dummy resolved data.
   The kit's preview server uses this to render any widget in isolation
   while you author your template's CSS. Faker seeds by widget kind →
   the same dummy rows render every reload (no churn in visual diffs).

## What you DON'T do as a template author

- You don't pick widgets. Vincia's composer (or the user via the editor)
  decides which widgets sit in which slots based on the build's needs
  and the template's `insertionZones[]`.
- You don't wire events between widgets. The bus handles it.
- You don't write widget render code. The platform owns that.

## What you DO do

- Expose generic class hooks (RULE 11's hook list) so spliced widgets
  inherit your template's palette + type + spacing.
- Reserve insertion zones (RULE 20) where a build might need extra
  widgets the template doesn't supply directly.
- Keep `:root` tokens canonical so any mounted widget that reads
  `var(--brand)` / `var(--surface)` / etc. picks up your theme cleanly.

When in doubt about which widgets might land in your template, curl the
manifest of any live build and filter by `display.surfaces.includes(<your
target surface>)`. The list is current as of every deploy.

---

# ============================================================
# PART A — YOUR DESIGN INPUTS (FILL THIS IN)
# ============================================================

> The user fills this in for each template they want produced. The LLM uses it as creative direction within Part B's structural rules.

```
ARCHETYPE: <one of canonical archetypes — see SCHEMA.md>

BUILD TYPE: <website | website | portal>

DESIGN DIRECTION (one paragraph):
<Describe the visual direction. Example: "Dark navy hero with photo backdrop and floating dashboard mockup; light-gray features 4-card 2x2 grid with subtle violet icon backgrounds; white process band with 3 colored squircle badges (teal/purple/orange); dark teal final-CTA band with white H2; minimal dark navy footer.">

REFERENCES (URLs of designs that inspire this template's KIND, not copies):
- <url 1>
- <url 2>
- <url 3 — optional>

VIBE TAGS (3-6 from canonical vocabulary):
<e.g. modern, trust, data-driven, professional>

PALETTE FAMILY (one from canonical list):
<e.g. dark-navy-amber>

VOICE TONE (one from canonical list):
<e.g. modern-trust>

DENSITY: <compact | standard | airy>
DISPLAY SCALE: <default | oversize | editorial-poster>
MOTION LEVEL: <still | subtle | playful | cinematic>

INDUSTRIES THIS TEMPLATE FITS (1-5):
<e.g. saas, revops, fintech, b2b, platform>

SECTIONS REQUIRED (home page) — list each section + role:
1. <section role + brief description>
2. ...

OTHER PAGES NEEDED (per page, brief section list):
- about: <comma-separated section roles>
- pricing: <if relevant>
- contact: <comma-separated section roles>
- blog: <if relevant>

SIGNATURE / DISTINCTIVE MOMENT:
<What's the 1-2 elements that make this template memorable?>

PALETTE HINT (optional):
<If you have specific brand colors in mind, put hex/oklch values. Otherwise leave blank.>

TYPOGRAPHY HINT (optional):
<If you want specific fonts, name them. Otherwise leave blank — LLM picks from Google Fonts.>

ALLOWED ADJUSTMENTS (optional):
<List per-build overrides Sonnet can apply per brand.>

TEMPLATE ID (optional — auto-generated if blank):
<archetype-direction-NNN, e.g. "wellness-habit-tracker-warm-earth-001">

DESIGNED-BY:
<Your model name + reviewing human>
```

---

# ============================================================
# OUTPUT INSTRUCTIONS
# ============================================================

Produce the template now as a series of fenced code blocks, one per file, with `path=<relative-file-path>` in the info-string. Files in this order:

1. `template.json`
2. `styles.css`
3. `index.html`
4. `about.html`
5. `contact.html`
6. (other pages as needed)
7. (optional) `script.js`
8. (optional) `README.md`

After all files, end with one short paragraph (≤4 sentences) summarizing the design choices and any assumptions you made. Nothing else.

The user will save each block to disk as the named file inside a folder, then open `index.html` in a browser to verify the design visually before handing the folder to Vincia for ingestion.

Quality goal: this template, when populated with brand inputs, must ship as a 9.5+/10 production website indistinguishable from a top-tier hand-crafted design.
