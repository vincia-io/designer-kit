# Theme exemplar — Warm Earth

A worked example of the **theme** tier on the Vincia Forge.

## What this theme is

Soft cream surfaces, warm amber brand, generous spacing — calm, domestic,
trustworthy. The display face is a serif (Source Serif 4); the body face is
a clean sans (Inter). Tokens are tuned for wellness, hospitality, newsletter,
and boutique-retail brands; the same tokens look equally good on a public
website or on a logged-in portal.

## Files

| File | Purpose |
|---|---|
| `manifest.json` | Forge metadata + tokens in structured form. The Composer reads this to pick the theme by vibe + voice + palette-family match. |
| `tokens.css` | The CSS surface a build applies. Every declared custom property is a member of `manifest.tokens` — no orphan tokens, no inline literals outside `:root`. |
| `README.md` | This file. |

## How a build uses this theme

1. Studio super-admin (or the Composer in auto-mode) picks a theme by
   browsing the marketplace + matching vibe/palette to the brand brief.
2. At render time, Vincia injects this `tokens.css` into the page head.
   Any HTML referring to `var(--brand)`, `var(--font-display)`, etc.
   resolves through these values.
3. If the build also has a `design-template` installed, its CSS authors
   against the same token names — themes and templates compose because
   they share the token vocabulary.

## Why this is a good theme

- **Every token has a job.** No "color-7" or "spacing-99" — every
  declaration names what it's for (`--brand`, `--ink-on-brand`,
  `--surface-alt`).
- **The palette holds across brands.** Vincia's per-build palette-swap
  layer can override `--brand` / `--accent` etc. without re-authoring the
  theme — the surrounding `--ink`, `--surface`, `--line` tokens stay
  cohesive.
- **`prefers-reduced-motion` honored.** The motion tokens zero out under
  the media query so themes don't override user accessibility prefs.
- **`oklch()` for chromatic colors.** Perceptually uniform — designers
  shifting hue/chroma get predictable contrast.

## Authoring your own theme

1. Run `vincia create theme <name>` (when scaffolds land in the CLI;
   until then, copy this example and rename).
2. Edit `manifest.json#tokens` — keep the structure, change the values.
3. Edit `tokens.css` — every entry MUST mirror a token in
   `manifest.json#tokens`. The Forge importer cross-checks.
4. Pick `paletteFamily` + `compatibleWith.{voice,vibe,industries}` from
   the canonical lists in
   [`../../docs/canonical-vocabularies.md`](../../docs/canonical-vocabularies.md).
5. Run `vincia publish` (when wired) — your theme appears in the Forge
   marketplace.

## Not in this example

- **The `bgVibes` axis.** Themes don't contribute background textures;
  that's the design-template's `vincia.contributions.bgVibesContribution`
  surface (see
  [`../../docs/prompt-for-designer-llm.md`](../../docs/prompt-for-designer-llm.md)
  for the structural contract).
- **Component CSS.** Themes ship tokens only; component styling lives
  inside design-templates or section-libraries. Keep the line clean.
