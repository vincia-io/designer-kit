# Vincia Designer Kit — v0.3.0

You've extracted the Designer Kit — the curated starter pack for designers
authoring **visual contributions** that ship to the **Vincia Forge**.
Designers ship themes, design templates, section libraries, ready-made
collections, and specialty packs that other Vincia builders install onto
their builds.

**v0.3.0 is the consolidated unified kit.** It absorbs the structural
contracts the platform's Composer + Studio runtime + Editor consume,
so a template authored from this kit is **pixel-perfect AND fully
editable** the moment it's installed.

## What you have

```
README.md                                    ← you are here
docs/
  prompt-for-llm.md                          Entry conversational flow — paste into your LLM first
  prompt-for-designer-llm.md                 Deep structural reference (RULES 1-22) — read before authoring HTML
  canonical-vocabularies.md                  Archetypes / palette families / voice tones / motion levels
  template-package-format.md                 On-disk shape of a design-template folder
  validation-checklist.md                    The 9.5/10 quality bar (automated + visual)
  anti-patterns.md                           What the importer auto-rejects
  archetype-widget-coverage.md               Typical widget set per archetype
  widget-ui-supplement-spec.md               How user-added pages stay on-brand
  template-json-spec.md                      Legacy field reference (kept for back-compat)
  widget-catalog.html                        Browseable card grid (open with file://)
  widget-catalog-for-llm.md                  LLM-ingestion: one section per widget
  widget-catalog.json                        Build-time snapshot of all 95 widgets
examples/
  wellness-habit-tracker-warm-earth-001/     design-template (website)        — calm warm-earth wellness
  portal-admin-001/                          design-template (portal)         — internal admin tool
  portal-website-dashboard-001/              design-template (website +       — SaaS marketing + customer auth + dashboard
                                                                  customer accounts)
  example-theme-warm-earth/                  theme                            — full token surface
  example-section-library-marketing-essentials/   section-library             — hero + features + cta sections
  example-ready-made-collection-wellness-blog/    ready-made-collection       — 10-post blog schema + sample content
sample-brands/                               Multi-brand smoke-test fixtures
  bloomtrack-wellness.json
  pulsar-saas.json
  threadbare-newsletter.json
  noir-discipline.json
  axis-internal-admin.json
```

## The 2-archetype taxonomy (read first)

The platform has **TWO** `buildType` values:

- **`website`** — public site. Always includes admin sign-in. Optionally
  includes customer sign-up + dashboard pages (add `login.html` +
  `signup.html` + `dashboard.html` to opt in).
- **`portal`** — login-gated app. No public surface; every page behind auth.

A retired third value (`website_as_portal`) was collapsed into `website`.
The `archetype` field on `template.json` is a *separate, granular* category
(e.g. `wellness-habit-tracker`, `b2b-saas-marketing`, `portal-admin`) the
matcher uses to route brand briefs to compatible templates — it is **not**
the AppArchetype. See [`docs/canonical-vocabularies.md`](docs/canonical-vocabularies.md) §0.

## Quick start

1. **Install the CLI** (one-time):
   ```bash
   curl -fsSL https://get.vincia.io/install | bash
   ```

2. **Log in** with your Vincia deployment:
   ```bash
   vincia login --api-host https://<your-vincia-host>
   ```

3. **Open this folder in your LLM client** (Claude Code, Cursor, etc.)
   and read [`docs/prompt-for-llm.md`](docs/prompt-for-llm.md) first.
   That doc walks the conversational intent flow.

4. **Pick an exemplar that matches your archetype**:
   - Building a public website → study [`examples/wellness-habit-tracker-warm-earth-001/`](examples/wellness-habit-tracker-warm-earth-001/)
   - Building a portal/admin tool → study [`examples/portal-admin-001/`](examples/portal-admin-001/)
   - Building a SaaS site with customer accounts → study [`examples/portal-website-dashboard-001/`](examples/portal-website-dashboard-001/)

5. **Author your template** as an HTML/CSS folder following
   [`docs/prompt-for-designer-llm.md`](docs/prompt-for-designer-llm.md).
   That's the deep structural reference — RULES 1-22 cover every
   `data-vincia-*` attribute the importer expects.

6. **Self-check against** [`docs/validation-checklist.md`](docs/validation-checklist.md)
   — 9.5/10 quality bar.

7. **Smoke-render** against contrasting briefs in [`sample-brands/`](sample-brands/)
   so you know the design holds across palettes + voices.

8. **Publish**:
   ```bash
   vincia publish
   ```

## How a template flows through the platform

```
   designer (or designer LLM)
            │
            │  authors HTML+CSS folder following kit docs
            ▼
   vincia publish (CLI)
            │
            │  validates: schema + lint + smoke-render
            ▼
   Forge marketplace listing
            │
            │  installable by any Vincia build
            ▼
    ┌───────┴────────────┐
    │                    │
    ▼                    ▼
  Studio Editor      Vincia Composer (auto-mode)
  (manual)           (LLM-driven build)
    │                    │
    │ Parser converts    │ Reads template's vincia.contributions
    │ HTML → editable    │ to register themeVariant / bgVibe /
    │ widget tree using  │ heroShape axes; sections export to
    │ data-vincia-*      │ preset library for cross-build reuse
    ▼                    ▼
   Pixel-perfect rendered build, fully editable, fully Composer-pickable
```

## Designer tiers — what you can ship

The Forge accepts 11 designer asset tiers. The 4 foundation tiers are
scaffold-ready today; the 7 specialty packs are docs-only on Forge and will
get CLI scaffolds in upcoming releases.

**Foundation tiers (scaffold-ready):**

| Tier | What it is | Exemplar |
|---|---|---|
| `design-template` | Full HTML+CSS folder for `website` or `portal`. **The heart of the designer offering.** | [`examples/wellness-habit-tracker-warm-earth-001/`](examples/wellness-habit-tracker-warm-earth-001/), [`examples/portal-admin-001/`](examples/portal-admin-001/), [`examples/portal-website-dashboard-001/`](examples/portal-website-dashboard-001/) |
| `theme` | Color + typography + spacing + motion tokens. Drops into any design-template. | [`examples/example-theme-warm-earth/`](examples/example-theme-warm-earth/) |
| `section-library` | Pre-composed sections (hero, features, CTA) that drop into any host template. Auto-exports to the Composer's preset library. | [`examples/example-section-library-marketing-essentials/`](examples/example-section-library-marketing-essentials/) |
| `ready-made-collection` | Schema + sample content (blog posts, products, FAQs, etc.) — installs into a build's content model. | [`examples/example-ready-made-collection-wellness-blog/`](examples/example-ready-made-collection-wellness-blog/) |

**Specialty packs** (documented at https://forge.vincia.io/docs/tier-guides/;
CLI scaffolds queued):

- `icon-pack` · `motion-pack` · `chrome-pack` · `background-pack`
- `email-template-pack` · `microcopy-voice-pack` · `imagery-treatment-pack`

## Why design-template is special

When a designer's `design-template` registers, **three things happen**:

1. **The template enters the Forge marketplace** — any Vincia build can
   install it from the marketplace and use it whole (the Composer picks
   it via `designTemplateId: 'plugin:<id>'` when brand fingerprints match).

2. **Its sections auto-export to the preset library** — the structural
   `data-vincia-section-type` attributes let the parser extract each
   section as a reusable preset. The Composer can pick *individual
   sections* from your template across **every future build, across every
   tenant**.

3. **Its `vincia.contributions` block enlarges the platform's design
   vocabulary** — themeVariants (typography + radius profiles), bgVibes
   (texture overlays with CSS rules), and heroShapes get upserted into
   the `vincia_axes` table. The Composer's tool schema is generated
   dynamically from this table, so your contributions **permanently
   widen what the platform's auto-mode can produce**.

This is why the structural data-attribute contract matters. Without it,
the same HTML would render pixel-perfect but couldn't be edited or
re-composed — a dead-end artifact. With it, your work compounds across
every build that ships after you.

## For LLM clients (Claude Desktop, Cursor, etc.)

If you're an LLM reading this kit on a designer's behalf:

1. Propose these terminal commands to the designer:
   ```bash
   curl -fsSL https://get.vincia.io/install | bash
   vincia login --api-host https://<their-vincia-host>
   ```
2. Load [`docs/prompt-for-llm.md`](docs/prompt-for-llm.md) and walk the
   conversational flow from its top.
3. When the designer picks "design-template", LOAD
   [`docs/prompt-for-designer-llm.md`](docs/prompt-for-designer-llm.md)
   into context — that's where the structural rules live. Read at least
   PART B (RULES 1-22) before producing any HTML.
4. Study the exemplar closest to the requested archetype before
   authoring — `examples/wellness-habit-tracker-warm-earth-001/` for
   website, `examples/portal-admin-001/` for portal, or
   `examples/portal-website-dashboard-001/` for website + customer-
   accounts hybrid.

## Status — v0.3.0 (May 2026)

- The CLI's `widgets *` commands are live.
- `create *` scaffolds the 4 foundation tiers (theme, design-template,
  section-library, ready-made-collection) plus the 5 developer tiers.
  HTML-format scaffold for `design-template` is queued — for now,
  derive your template from an exemplar by copying the directory.
- `test`, `preview`, and `publish` commands are under active development.
- v0.3.0 replaces the legacy v0.2.x JSON-format examples with HTML-format
  exemplars + the canonical structural docs (PROMPT, SCHEMA, VALIDATION,
  ANTI-PATTERNS, TEMPLATE-PACKAGE-FORMAT) that the platform's importer +
  Composer + parser actually consume.

## Earn

Designer contributions picked from the Forge marketplace earn $1 per
recipient per active month, forever. See your dashboard at
`/admin/contributor`.
