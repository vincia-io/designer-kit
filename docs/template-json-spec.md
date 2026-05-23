# template.json — reference

The metadata file at the root of every Vincia template package.

> **Status (v0.1.0)**: Phase A.4 ships this skeleton. The full validator + the
> `widget-coverage.json` companion file finalize in Phase A2 (~3-4 days from
> 2026-05-12).

## Skeleton

```jsonc
{
  "slug": "minimal-portal",
  "name": "Minimal portal",
  "description": "A tight, monospaced dashboard chrome for staff-facing portals.",
  "version": "0.1.0",
  "archetype": "portal",
  "tags": ["minimal", "dark", "monospace"],
  "preview": {
    "thumbnail": "preview/thumb.jpg",
    "screenshots": [
      "preview/desktop.jpg",
      "preview/mobile.jpg"
    ]
  },
  "theme": {
    "tokensFile": "theme/tokens.css"
  },
  "sections": [
    { "id": "hero",     "file": "sections/hero.html" },
    { "id": "features", "file": "sections/features.html" },
    { "id": "footer",   "file": "sections/footer.html" }
  ],
  "widgetUiSupplement": "widget-ui-supplement.html",
  "widgetCoverageFile": "widget-coverage.json"
}
```

## Fields (v0.1.0 contract)

| Field                  | Required | Notes                                                                                  |
| ---------------------- | -------- | -------------------------------------------------------------------------------------- |
| `slug`                 | yes      | URL-safe identifier. Unique per contributor.                                           |
| `name`                 | yes      | Human-facing name shown in the marketplace card.                                       |
| `description`          | yes      | 1-2 sentence summary. Drives marketplace search relevance.                             |
| `version`              | yes      | Semver `<major>.<minor>.<patch>`. Marketplace surfaces version history.                |
| `archetype`            | yes      | One of `website` \| `portal`. Drives widget-coverage badge. (`website_as_portal` was retired — `website` now covers public + customer-account surfaces.)     |
| `tags`                 | no       | Filter tags (`minimal`, `dark`, `serif`, …). Surface in marketplace filters.           |
| `preview`              | no       | Paths to preview images. Marketplace renders these in the listing.                     |
| `theme.tokensFile`     | yes      | Path (relative to the template root) to the CSS-tokens file.                           |
| `sections[]`           | yes      | Ordered list of pre-designed section files. Each `{ id, file }`.                       |
| `widgetUiSupplement`   | no       | Path to the per-widget styling file. Required for full-coverage marketplace badge.     |
| `widgetCoverageFile`   | no       | Path to the JSON manifest reflecting which widgets are explicitly styled.              |

## What lands in Phase A2

- The exact `widget-ui-supplement.html` schema (`<section data-widget="<kind>">`
  blocks, slot conventions like `data-vincia-slot="header"`).
- The `widget-coverage.json` shape (`coverage: "complete" | "partial" | "minimal"`).
- The `vincia template validate` rules and the coverage-badge thresholds.

Treat this v0.1.0 spec as additive: future fields will land alongside, not
replace, what's above.
