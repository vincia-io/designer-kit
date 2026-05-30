# Template package format (HTML)

> **What this is.** The on-disk shape Vincia expects for any template a designer LLM produces. Both the importer and Kythir's per-build pipeline read this format.
>
> **Why HTML.** Designer LLMs natively produce HTML/CSS. The user can open the result in a browser, refine iteratively, and only finalize once it visually passes muster. JSON would be invisible until rendered.

---

## Folder layout

```
<template-id>/
├── template.json              REQUIRED — metadata (NOT the design)
├── styles.css                 REQUIRED — all CSS (variables, components, layout)
├── index.html                 REQUIRED — home page
├── about.html                 REQUIRED for website builds
├── contact.html               REQUIRED for website builds
├── pricing.html               OPTIONAL
├── blog.html                  OPTIONAL
├── login.html                 REQUIRED for portal; required for website customer-accounts variant
├── signup.html                REQUIRED for website customer-accounts variant
├── dashboard.html             REQUIRED for portal; required for website customer-accounts variant
├── settings.html              REQUIRED for portal
├── script.js                  OPTIONAL — progressive enhancement only, no frameworks
└── README.md                  OPTIONAL — design intent notes
```

Filenames are case-sensitive. Use lowercase + hyphens. The folder name must match `template.json#id`.

---

## `template.json` shape

```json
{
  "id": "wellness-habit-tracker-warm-earth-001",
  "schemaVersion": 2,
  "format": "html",
  "archetype": "wellness-habit-tracker",
  "buildType": "website",
  "designDirection": "Warm earth-tone wellness with calm typography",
  "qualityScore": 9.5,
  "designedBy": "Claude Sonnet 4.6 + reviewed by Hary",
  "createdAt": "2026-05-07",
  "referenceInspiration": ["https://example.com/inspiration"],

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
    "colors": [
      "--brand", "--accent", "--secondary",
      "--ink", "--mute",
      "--bg", "--surface", "--surface-alt",
      "--line", "--ink-on-brand"
    ],
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
    { "id": "after-features", "page": "index.html", "selector": "#zone-after-features", "label": "After Features section" }
  ],

  "allowedAdjustments": [
    "swap photoStyle from photo to illustration",
    "drop trusted-by band if no logos"
  ]
}
```

### Field-by-field

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | yes | Slug. Format `<archetype>-<direction>-NNN`. Globally unique across the registered library. |
| `schemaVersion` | number | yes | Currently `2` (HTML format). Version `1` is JSON widget-tree (legacy). |
| `format` | string | yes | `"html"` for this format. |
| `archetype` | string | yes | One of the canonical archetypes (see SCHEMA.md). |
| `buildType` | string | yes | `"website"` / `"portal"` (the only two valid values). |
| `designDirection` | string | yes | One-line summary of the visual direction. |
| `qualityScore` | number | yes | Self-assessed against VALIDATION-CHECKLIST. Must be ≥9.5 to pass importer's quality gate. |
| `designedBy` | string | yes | LLM model + reviewing human. |
| `createdAt` | string | yes | ISO date. |
| `referenceInspiration` | string[] | yes | URLs that inspired the design's KIND (not copies). |
| `signature` | object | yes | Matcher uses these for archetype/vibe/density/palette/voice/motion classification. |
| `pages` | array | yes | One entry per `.html` file. `role` is the semantic page role (`home`, `about`, `pricing`, `dashboard`, etc.). |
| `fonts` | string[] | yes | Google Fonts URLs. Vincia per-build can swap these for tenant brand fonts. |
| `themeVars` | object | yes | Lists which CSS custom properties Vincia is allowed to override at production time. |
| `copySlots` | array | yes | Every `{{SLOT}}` used in the HTML must appear here with type + word-count limits + guidance for the copy-fill LLM. |
| `photoSlots` | array | yes | Every `{{photo:slot-name}}` used in the HTML must appear here with semantic tags + aspect ratio. |
| `insertionZones` | array | optional | If the template lets users insert preset sections at marked points, list each zone here. |
| `allowedAdjustments` | string[] | optional | Per-build adjustments Sonnet may apply. |

---

## CSS conventions

### `:root` defines all themable values

```css
:root {
  --brand: oklch(72% 0.14 60);
  --accent: oklch(48% 0.10 70);
  --ink: #1c1410;
  --bg: #fbf6ee;
  --surface: #fffdf8;
  --line: rgba(28, 20, 16, 0.08);

  --font-display: 'Source Serif 4', Georgia, serif;
  --font-body: 'Inter', system-ui, sans-serif;

  --type-h1: clamp(40px, 7vw, 96px);
  --type-h2: clamp(28px, 4vw, 56px);
  --type-body: 16px;

  --space-1: 4px; --space-2: 8px; ... --space-10: 160px;
  --radius-sm: 6px; --radius-md: 10px; --radius-lg: 18px; --radius-pill: 999px;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --ease: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Everything else uses `var(...)`

```css
.btn.primary {
  background: var(--brand);
  color: var(--ink-on-brand);
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-pill);
  font-family: var(--font-body);
  font-weight: 600;
  transition: transform var(--duration-quick) var(--ease);
}

.btn.primary:hover { transform: translateY(-1px); }

.hero-h1 {
  font-family: var(--font-display);
  font-size: var(--type-h1);
  line-height: 1.05;
  color: var(--ink);
}
```

### Forbidden in CSS

- Literal colors outside `:root` (use a token)
- Literal pixel sizes for spacing outside `:root` (use `--space-*`)
- `@import`, `url()` to remote stylesheets (Google Fonts go via `<link>` in HTML)
- `!important` outside button-override scope (rare)
- Backticks anywhere (breaks JS template literals downstream)

---

## HTML conventions

### Slot placeholders

All brand copy → `{{SLOT_NAME_IN_CAPS}}`.
All images → `<img src="{{photo:slot-name}}" alt="{{ALT_SLOT}}">` or `style="background-image:url('{{photo:bg-slot}}')"`.

### Preview-time photo URLs (optional)

To make the design preview-able BEFORE Vincia fills it, you may add a comment with a sample URL right before each photo tag:

```html
<!-- preview: https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=85 -->
<img src="{{photo:hero-image}}" alt="{{HERO_IMAGE_ALT}}" />
```

The `preview-template.mjs` tool reads these comments when no brand brief overrides them.

### Insertion zones

Marker divs let users add preset sections post-instantiation:

```html
<div id="zone-after-features" data-vincia-insertion-zone="after-features"></div>
```

### No inline styles

Other than `style="background-image:url('{{photo:slot}}')"` for slot-driven background images, all styling lives in `styles.css`.

### No client-side JS frameworks

`script.js` is for tiny progressive enhancement (mobile-nav toggle, accordion). No React/Vue/Alpine/jQuery imports. No `<script type="module" src="https://...">`.

---

## How Kythir uses this at production time

When a tenant requests a build using template `wellness-habit-tracker-warm-earth-001`:

1. **Generate brand brief** (Sonnet) from tenant inputs — palette + fonts + voice + copy slots + photo prompts
2. **Inject CSS variable overrides** at the top of `styles.css`:
   ```css
   :root {
     --brand: <tenant brand color>;
     --accent: <tenant accent color>;
     --ink: <tenant ink color>;
     /* ... only the vars listed in template.json#themeVars */
   }
   ```
3. **Swap Google Fonts `<link>`** in each HTML page if brand fonts differ from template fonts
4. **Substitute `{{SLOT}}`** placeholders with tenant copy generated by the copy-fill LLM
5. **Substitute `{{photo:slot-name}}`** placeholders with image-search results matched against `photoSlots[].tags`
6. **Optionally splice preset sections** into marked insertion zones if the tenant added any post-instantiation
7. **Output** the resulting HTML/CSS to the tenant origin

No widget tree conversion happens. The HTML stays HTML. The editor's section-add flow operates on insertion zones; section-edit operates on slots and photos via overrides stored separately.

---

## Two template shapes: flexible vs. concept

Templates fall into one of two shapes depending on how much flexibility the designer wants to grant the end user. Both are first-class — Vincia imports and edits both identically. The only difference is the `insertionZones[]` array in `template.json`.

| Shape | `insertionZones[]` | Best for | What end user can do |
|---|---|---|---|
| **Flexible** | Several (e.g. `after-features`, `before-cta`, `after-testimonials`) | SaaS marketing pages, agency sites, normal commerce — pages where users may want to extend with their own preset sections | Edit slots + add preset sections at marked zones |
| **Concept** | Zero or one | Microsites, exhibition sites, scroll-driven narratives, art portfolios, wedding invitations, product-launch teasers — designs where the layout IS the product | Edit slots only (copy / photos / palette / fonts). Section composition is locked. |

### Concept templates are first-class

A concept template might be a single-page scroll-driven story with 12 custom-designed panels, custom SVG transitions between them, and a horizontal-scroll gallery. None of those panels exist in any preset library — and nor should they; the design coherence depends on them being purpose-built.

In Vincia, this template:

1. Imports identically to a flexible template (same `template.json` shape, same HTML/CSS files)
2. Renders identically through the brand-substitution pipeline (slots filled, CSS vars overridden)
3. Edits through the same slot-editor panel (user changes `{{HERO_HEADLINE}}` via the editor; the underlying HTML is never touched)
4. **Differs only in that** `insertionZones: []` (or omitted) — so the editor's "+ Add section" button hides for that page

The benefit: designers can ship genuinely bespoke designs that would be impossible to express as a widget tree, and they remain fully tenant-editable through the slot system.

### Why the slot system is enough for editability

For a concept template, "editable" means:

- **Copy:** every text line is a `{{SLOT}}`. The slot editor surfaces each one; users type new copy; renderer substitutes at production. The custom typography / animation / layout is preserved.
- **Photos:** every image is `{{photo:slot-name}}`. Users swap by uploading or by re-running image-search with new tags. The custom photo treatment / position / aspect ratio is preserved.
- **Palette / fonts:** every visual property reads from `:root` CSS vars. Users reskin via the palette editor. The custom layout / animation / SVG is preserved.

What concept templates correctly forbid:

- Adding new sections (the design isn't built to accept them)
- Reordering sections (the scroll narrative depends on the sequence)
- Swapping a section for a different design (no swap candidate would visually belong)

These restrictions ARE the design intent. Vincia respects them by reading `insertionZones[]` and gating the editor accordingly.

### Example: a concept template

```jsonc
// template.json for an exhibition microsite
{
  "id": "art-exhibition-scroll-narrative-001",
  "schemaVersion": 2,
  "format": "html",
  "archetype": "art-exhibition-microsite",
  "buildType": "website",
  "designDirection": "Single-page scroll narrative with 8 hand-tuned panels, parallax photo reveals, and custom typographic moments. Concept site — not extensible.",
  "signature": { "vibe": ["editorial", "poster", "cinematic"], "displayScale": "editorial-poster", ... },
  "pages": [{ "file": "index.html", "role": "home" }],
  "copySlots": [ /* every {{SLOT}} listed */ ],
  "photoSlots": [ /* every {{photo:slot}} listed */ ],
  "insertionZones": [],   // concept template — locked to designed layout
  "allowedAdjustments": ["palette retint within warm-earth family", "swap hero photo"]
}
```

End user opens the Vincia editor on this build → sees:
- Slot editor with all copy + photo slots
- Palette + font reskin panels
- NO "+ Add section" button (because `insertionZones: []`)
- NO drag-handles for reordering sections
- The design ships exactly as the designer intended, but the BRAND is the user's

---

---

## Vincia axis contributions (optional, schemaVersion 2)

Templates can extend the Vincia composer's visual axis vocabulary
(typography signatures, background textures, register hints, hero
shapes) by declaring an optional `vincia.contributions` block in
`template.json`. Registration extracts + sanitizes + persists each
contribution to the `vincia_axes` DB table; from that point on, every
future Vincia build can pick from the new axis values you contributed.

**This is how the system grows.** Today the composer picks from 10
themeVariants × 14 bgVibes × 12 registers — all hardcoded. With your
contributions, registering 20 templates can grow that pool to 30
themeVariants × 100+ bgVibes × 30 registers without any engineer code
change.

### Block shape

```jsonc
{
  // ... rest of template.json ...
  "vincia": {
    // Hint at which existing registers this template targets, OR
    // declare a NEW register the template introduces. Existing values
    // (minimal-anchor, editorial-magazine, brutalist-bold,
    // dark-cinematic, photo-cinematic, mood-aurora, luxury-serif,
    // craft-warm, tech-mono, data-dense, social-proof, industry-specific)
    // are accepted silently. Novel values trigger a "new register
    // contributed" warning at validate time and a registry insert
    // at register time.
    "registerHints": ["craft-warm", "luxury-serif", "wabi-sabi-organic"],

    // Contribute a NEW typography signature. The composer can then pick
    // it as the build's themeVariant. Stamped on every section as
    // data-vincia-theme-variant; CSS rules generated from these fields.
    "themeVariantContribution": {
      "id": "wabi-sabi-organic",
      "displayName": "Wabi-Sabi Organic",
      "description": "Japanese tea-house typography, asymmetric serif",
      "fontSans": "\"Cormorant Garamond\", \"Iowan Old Style\", serif",
      "fontSerif": "\"Cormorant Garamond\", \"Iowan Old Style\", serif",
      "fontMono": "ui-monospace, Menlo, monospace",
      "radius": { "sm": 0, "md": 2, "lg": 4 },
      "letterSpacing": "0.005em",
      "headingTransform": "italic",
      "inspiration": "wabi-sabi philosophy, hand-pressed paper, asymmetric balance"
    },

    // Contribute one or more new background textures (max 8 per template).
    // Each becomes a pickable bgVibe value in the composer schema.
    // The CSS in `background` is sanitized + scoped to
    // [data-section-bg-vibe="<id>"]::before at registration time.
    "bgVibesContribution": [
      {
        "id": "cracked-paint",
        "displayName": "Cracked Paint",
        "description": "Aged painted-wall texture in muted ink",
        "background": "url('/cdn/templates/wabi-sabi-organic-001/cracked.svg')",
        "blendMode": "multiply",
        "opacity": 0.18,
        "pairing": ["craft-warm", "wabi-sabi-organic"]
      },
      {
        "id": "rice-paper",
        "displayName": "Rice Paper",
        "description": "Soft rice-paper grain at low opacity",
        "background": "url('/cdn/templates/wabi-sabi-organic-001/rice.svg')",
        "blendMode": "overlay",
        "opacity": 0.12,
        "pairing": ["luxury-serif", "wabi-sabi-organic"]
      }
    ],

    // Contribute a novel hero composition pattern.
    "heroShapeContribution": {
      "id": "tea-house-asymmetric",
      "displayName": "Tea House Asymmetric",
      "description": "Off-center anchor with negative space right and brushstroke divider",
      "gridLayout": "offset-left",
      "atomShape": ["eyebrow", "headline", "lede", "ctaPrimary", "decorativeBrushstroke"]
    }
  }
}
```

### Field-by-field

| Field | Type | Required | Purpose |
|---|---|---|---|
| `registerHints` | string[] | no | Existing or novel register ids; novel values become new entries in `vincia_axes` |
| `themeVariantContribution.id` | kebab-case string | yes (if block present) | Unique id; collisions with existing entries upsert |
| `themeVariantContribution.fontSans/fontSerif/fontMono` | CSS font-family string | no | Each ≤240 chars, no `; { } \` characters |
| `themeVariantContribution.radius` | { sm, md, lg } | no | Numbers 0-64 px |
| `themeVariantContribution.letterSpacing` | CSS length string | no | ≤32 chars |
| `bgVibesContribution[]` | array | no | Max 8 per template |
| `bgVibesContribution[].id` | kebab-case string | yes per item | |
| `bgVibesContribution[].background` | CSS background value | yes per item | ≤600 chars; no `; { }`, no `expression(`, no `javascript:`, no `@import` |
| `bgVibesContribution[].blendMode` | CSS blend-mode keyword | no | One of: normal/multiply/screen/overlay/darken/lighten/color-dodge/color-burn/hard-light/soft-light/difference/exclusion/hue/saturation/color/luminosity |
| `bgVibesContribution[].opacity` | number 0–1 | no | |
| `bgVibesContribution[].pairing` | string[] | no | Other axis ids this vibe composes well with |
| `heroShapeContribution.id` | kebab-case string | yes (if block present) | |
| `heroShapeContribution.gridLayout` | enum | no | One of: stack / offset-left / offset-right / split-half / sidebar-rail / magazine-3col / mosaic |
| `heroShapeContribution.atomShape` | string[] | no | List of atom names making up the hero |

### Where contributed CSS comes from

Two patterns:

1. **Self-contained CSS** — declare `background` as a CSS value
   referencing inline SVG data URIs, gradient stacks, or repeating
   patterns. Renders without external assets.
2. **Bundled asset** — reference a file you bundled with the template
   (uploaded to `/cdn/templates/<your-template-id>/<file>` at register
   time). Use this for SVG textures, noise patterns.

### Safety + collision rules

- **No CSS injection.** `;`, `{`, `}`, `\` rejected in font/background
  strings; `expression(`, `javascript:`, `@import` rejected in
  backgrounds.
- **Length caps.** Font stacks ≤ 240 chars, backgrounds ≤ 600 chars,
  letterSpacing ≤ 32 chars.
- **De-duplication.** Structural hash at register time; existing match
  → contribution linked as alias instead of duplicate insert.
- **Scoping.** Your `background` is automatically scoped to
  `[data-section-bg-vibe="<id>"]::before`. Two templates' "noise" can't
  collide.
- **Deprecation cascade.** If your template is unpublished, all its
  contributions are marked `status='deprecated'`. Existing builds that
  snapshotted them keep rendering; new composer runs skip them.

---

## Schema version compatibility

| `schemaVersion` | `format` | Notes |
|---|---|---|
| `1` | (omitted) | Legacy: full widget-tree JSON template. See `PROMPT-FOR-DESIGNER-LLM-JSON-LEGACY.md`. Importer still accepts. |
| `2` | `"html"` | Current: HTML/CSS package. Designer-LLM-friendly. Supports both flexible and concept template shapes. |

Both formats coexist in `registered/`. Kythir checks `schemaVersion` to pick the right rendering path.
