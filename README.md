# Vincia Designer Kit — v0.4.6

You've extracted the Designer Kit — the curated starter pack for designers
authoring **visual contributions** that ship to the **Vincia Forge**.
Designers ship themes, design templates, section libraries, ready-made
collections, and specialty packs that other Vincia builders install onto
their builds.

**v0.4.0 builds on v0.3.0's consolidated unified kit + adds visual-debug
tooling and an MCP-driven sample-brands round-trip.** It absorbs the structural
contracts the platform's Composer + Studio runtime + Editor consume,
so a template authored from this kit is **pixel-perfect AND fully
editable** the moment it's installed.

## What you have

```
README.md                                    ← you are here
docs/
  prompt-for-llm.md                          Entry conversational flow — paste into your LLM first
  prompt-for-designer-llm.md                 Deep structural reference (RULES 1-25) — read before authoring HTML
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
   # macOS / Linux:
   curl -fsSL https://get.vincia.io/install | bash
   ```
   ```powershell
   # Windows (PowerShell):
   iwr -useb https://get.vincia.io/install.ps1 | iex
   ```
   > **Windows note:** the global npm bin dir is only on PATH in **newly
   > opened** terminals, so open a fresh PowerShell after install. If a
   > default `Restricted` execution policy blocks `npm`/`vincia` (`.ps1`
   > shims), run once (no admin needed):
   > `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`
   > — or call the `.cmd` shims (`npm.cmd`, `vincia.cmd`). Requires Node 18+.

2. **Log in** (the default Studio host is `studio.vincia.io`, so bare
   `vincia login` is all you need for the public Vincia SaaS):
   ```bash
   vincia login
   # Self-hosted / enterprise deployment only:
   vincia login --studio-url https://<your-vincia-host>
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
   That's the deep structural reference — RULES 1-25 cover every
   `data-vincia-*` attribute the importer expects.

6. **Self-check** — run the offline linter (no login required):
   ```bash
   vincia validate          # slot parity, CSS color-scope, HTML, anti-patterns
   ```
   …against the [`docs/validation-checklist.md`](docs/validation-checklist.md)
   9.5/10 quality bar. (`vincia test` runs the same checks inside a
   design-template folder.)

7. **Smoke-render** against contrasting briefs in [`sample-brands/`](sample-brands/)
   so you know the design holds across palettes + voices. Once a draft of
   the template is in studio, the LLM-driven equivalent is
   `vincia_studio_apply_theme(slug, expert_pick_id) +
   vincia_studio_screenshot(slug, page, viewport)` against a test app you
   own — see the screenshot section in
   [`docs/prompt-for-llm.md`](docs/prompt-for-llm.md) for the
   round-trip pattern. Both checks should pass before publish.

8. **Publish**:
   ```bash
   vincia publish
   ```

## Keeping the kit up to date

New kit versions ship regularly (bug fixes, new rules, new examples). This kit is a folder you downloaded — it doesn't auto-update.

- **Check your version vs latest:** the title line above (`# Vincia Designer Kit — vX.Y.Z`) and the `## Status` line show what you have; the latest is at `https://get.vincia.io/kits/` and in the `## What's new` changelog below.
- **Cloned with git (recommended for staying current):** `git pull` updates the rulebook, examples, and editor configs in place, and shows you exactly what changed.
  ```bash
  git clone https://github.com/vincia-io/designer-kit.git    # first time
  cd designer-kit && git pull                                # to update
  ```
- **Downloaded the zip:** re-download the latest and unzip it over the folder (back up local edits first).
  ```bash
  curl -fsSL https://get.vincia.io/kits/designer-kit-latest.zip -o designer-kit.zip && unzip -o designer-kit.zip
  ```
- **Keep the CLI current too** (separate from the kit): `vincia upgrade`, or re-run `curl -fsSL https://get.vincia.io/install | bash`. After upgrading the CLI **or** the kit, **restart your LLM client / MCP server** so it relaunches `vincia mcp serve` and surfaces new tools.

> Using a web client over the remote MCP surface (`https://mcp.vincia.io/contributor`) instead of a local kit? That surface is always current — nothing to upgrade.

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
   vincia login   # public SaaS default; self-hosted: vincia login --studio-url https://<their-vincia-host>
   ```
2. Load [`docs/prompt-for-llm.md`](docs/prompt-for-llm.md) and walk the
   conversational flow from its top.
3. When the designer picks "design-template", LOAD
   [`docs/prompt-for-designer-llm.md`](docs/prompt-for-designer-llm.md)
   into context — that's where the structural rules live. Read at least
   PART B (RULES 1-25) before producing any HTML.
4. Study the exemplar closest to the requested archetype before
   authoring — `examples/wellness-habit-tracker-warm-earth-001/` for
   website, `examples/portal-admin-001/` for portal, or
   `examples/portal-website-dashboard-001/` for website + customer-
   accounts hybrid.

## What's new in v0.4.6 (June 2026)

- **Chat-first authoring: write the COMPLETE file set to the draft.** RULE 4.5 now
  spells out that a cloud-draft design-template needs ALL of `template.json`,
  `index.html` (+ pages), `styles.css`, `_preview-data.json`, and `preview-inline.js`
  written via `vincia_sandbox_write_file` BEFORE `vincia_sandbox_run` — the LLM
  often stopped after `index.html`, leaving slots literal. `vincia_sandbox_run` now
  returns `complete:false` + `warnings[]` naming the missing files, and **renders an
  inline screenshot** so a headless client (Claude Code / chat) SEES the result, not
  just a URL. (Platform-side: the `?screenshot=1` preview endpoint + the studio
  drafts "Run draft" panel now render via the screenshot-renderer service; a "Drafts"
  entry was added to the Forge nav.)

## What's new in v0.4.5 (May 2026)

- **New "Keeping the kit up to date" section** (above) — how to refresh an existing
  kit to a newer version: `git pull` if you cloned (recommended), or re-download the
  `-latest` zip; how to check your version vs latest; and a reminder to keep the CLI
  current + restart your MCP client after an upgrade. Mirrors the hosted
  https://forge.vincia.io/docs/getting-started "Keeping your kit up to date" section.

## What's new in v0.4.4 (May 2026)

- **Chat-first preview now works for design-templates.** `vincia_sandbox_run` on a
  `design-template` cloud draft now returns a hosted preview URL
  (`https://preview.vincia.io/p/<hash>/index.html`, slots filled) — so a CLI-less
  LLM client (Claude.ai / ChatGPT / Claude Desktop on the `mcp.vincia.io/contributor`
  connector) can preview a design-template directly from chat. The preview policy in
  `docs/prompt-for-llm.md` now lists it as option 1 for chat-first sessions; the v0.4.3
  note that said the sandbox couldn't render design-templates is superseded. `vincia preview`
  remains the local-terminal loop.
- **New contributor guide:** [`docs/prompt-for-llm.md`](docs/prompt-for-llm.md) +
  the hosted page at https://forge.vincia.io/docs/connecting-llm-clients walk through
  connecting Claude.ai, ChatGPT, and Claude Desktop to the `/contributor` surface, the
  chat-first vs local-first loops, and worked designer/developer use cases.

## What's new in v0.4.3 (May 2026)

- **Preview docs corrected.** `vincia preview` (the CLI local preview server) is
  the design-template review loop that actually works — earlier docs wrongly
  blanket-deprecated "localhost preview" and pointed only at the studio
  screenshot path, which needs the `/studio` MCP surface + an imported studio
  app. Now: use `vincia preview`; the studio screenshot path is documented as
  conditional; and a note clarifies the chat-first sandbox runner renders
  developer-kit code assets, **not** designer-kit HTML templates. (Don't
  hand-roll `python -m http.server`/`file://` — `vincia preview` fills slots.)

## What's new in v0.4.2 (May 2026)

- **New `vincia validate` command** — offline design-template lint (slot parity,
  CSS color-scope, HTML head/alt, anti-patterns) with **no login required**.
  `vincia test` now runs the same checks inside a design-template folder instead
  of erroring on a missing `manifest.json`.
- **Windows install docs** — the PowerShell installer one-liner, an
  execution-policy note (`Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`),
  and an "open a fresh terminal" PATH reminder.

## What's new in v0.4.1 (May 2026)

- **Build-type taxonomy de-drift**: docs + examples now consistently state there
  are exactly two `buildType` values (`website` / `portal`). Removed an invalid
  `portal-website` value from an example and a duplicated `website` in two field
  tables. Customer accounts are an opt-in page set within `website`, never a
  third build type.
- **Structural rulebook is RULES 1-25**: every cross-reference now matches
  `docs/prompt-for-designer-llm.md` (rules 23-25 cover resilient text / photos /
  slots).
- **Auth-first + sandbox-only preview**: the conversational flow opens with an
  explicit `vincia whoami` / `vincia login` step and recommends the hosted
  sandbox preview (studio staging URL + screenshot) — never a localhost preview.
- **`vincia login` corrected**: docs no longer reference the non-existent
  `--api-host` flag; bare `vincia login` is the default, `--studio-url` is for
  self-hosted deployments.
- **Report friction to Studio**: the new `vincia_studio_report_issue` MCP tool
  lets an LLM client file kit/CLI/docs bugs directly into Studio for the next
  release.

## What's new in v0.4.0 (May 2026)

- **Visual debug via studio MCP**: `docs/prompt-for-llm.md` now teaches
  `vincia_studio_screenshot(slug, page, viewport)` + the 7 mutating
  studio tools' `include_screenshot: true` option. Iterate visually
  without bouncing to a browser tab; LLM clients that render MCP image
  content blocks (Claude.ai) show the rendered after-state inline in
  chat.
- **Sample-brands smoke-test gains an MCP-driven round-trip**:
  `vincia_studio_apply_theme(slug, expert_pick_id) +
  vincia_studio_screenshot(slug)` against a test app you own is the
  LLM equivalent of the local `sample-brands/` smoke-render —
  documented in the README quick start.
- **Built-in widget catalog snapshot**: every kit zip bakes in
  `docs/widget-catalog.{html,json}` + `docs/widget-catalog-for-llm.md`
  generated from the live platform manifest at build time. If the
  catalog gains a widget after you extracted the kit, run
  `vincia widgets sync --out docs` to refresh the snapshot.

## Status — v0.4.6 (May 2026)

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
