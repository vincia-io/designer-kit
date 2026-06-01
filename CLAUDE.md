# Claude — Vincia Designer Kit

You're pairing with a human designer to author visual contributions for the
[Vincia Forge](https://forge.vincia.io). This folder is the **Designer Kit
v0.4.5** — themes, design templates, section libraries, and ready-made
collections that other Vincia builders install onto their builds.

## Reading order (do this before generating anything)

1. **[`README.md`](README.md)** — kit layout, the 2-archetype taxonomy
   (`website` / `portal`), what you can ship.
2. **[`docs/prompt-for-llm.md`](docs/prompt-for-llm.md)** — the conversational
   intent-first flow. Walk this with the designer when scoping the work.
3. **[`docs/prompt-for-designer-llm.md`](docs/prompt-for-designer-llm.md)** —
   the deep structural contract (**RULES 1-25**). MANDATORY before generating
   any HTML. Every `data-vincia-*` attribute the importer expects is defined
   here.
4. **[`docs/canonical-vocabularies.md`](docs/canonical-vocabularies.md)** —
   archetypes, palette families, voice tones, motion levels.

## Pick the exemplar that matches the archetype

Before generating a template, copy and study the closest exemplar:

- **Public website** (`buildType: website`) → [`examples/wellness-habit-tracker-warm-earth-001/`](examples/wellness-habit-tracker-warm-earth-001/)
- **Portal / admin tool** (`buildType: portal`) → [`examples/portal-admin-001/`](examples/portal-admin-001/)
- **Website + customer accounts** (still `buildType: website` — customer accounts are an opt-in page set, NOT a third build type) → [`examples/portal-website-dashboard-001/`](examples/portal-website-dashboard-001/)

> There are exactly **two** `buildType` values: `website` and `portal`. The
> retired `website_as_portal` was collapsed into `website` — never offer it (or a
> "website + customer accounts" build type) as a third choice. For customer
> accounts, set `buildType: website` and add `login`/`signup`/`dashboard` pages.

## Definition of done

Self-check against [`docs/validation-checklist.md`](docs/validation-checklist.md)
(the 9.5/10 quality bar). Smoke-render against contrasting briefs in
[`sample-brands/`](sample-brands/) so the design holds across palettes + voices.

## Hit a tooling bug? File it to Studio

If you or the designer hit friction with the CLI, the docs, the install flow,
or Studio itself, call the `vincia_studio_report_issue` MCP tool (studio MCP
surface, `vst_*` token) to file it directly into Studio — don't just narrate
it in chat. See "Report friction back to Studio" in
[`docs/prompt-for-llm.md`](docs/prompt-for-llm.md). The platform team triages
these and folds fixes into the next kit/CLI version.

## Out of scope here

Plugin / connector / widget code lives in the separate
[Developer Kit](https://github.com/vincia-io/developer-kit). This kit is for
**visual** contributions only.
