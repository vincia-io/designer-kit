# Claude — Vincia Designer Kit

You're pairing with a human designer to author visual contributions for the
[Vincia Forge](https://forge.vincia.io). This folder is the **Designer Kit
v0.3.0** — themes, design templates, section libraries, and ready-made
collections that other Vincia builders install onto their builds.

## Reading order (do this before generating anything)

1. **[`README.md`](README.md)** — kit layout, the 2-archetype taxonomy
   (`website` / `portal`), what you can ship.
2. **[`docs/prompt-for-llm.md`](docs/prompt-for-llm.md)** — the conversational
   intent-first flow. Walk this with the designer when scoping the work.
3. **[`docs/prompt-for-designer-llm.md`](docs/prompt-for-designer-llm.md)** —
   the deep structural contract (**RULES 1-22**). MANDATORY before generating
   any HTML. Every `data-vincia-*` attribute the importer expects is defined
   here.
4. **[`docs/canonical-vocabularies.md`](docs/canonical-vocabularies.md)** —
   archetypes, palette families, voice tones, motion levels.

## Pick the exemplar that matches the archetype

Before generating a template, copy and study the closest exemplar:

- **Public website** → [`examples/wellness-habit-tracker-warm-earth-001/`](examples/wellness-habit-tracker-warm-earth-001/)
- **Portal / admin tool** → [`examples/portal-admin-001/`](examples/portal-admin-001/)
- **Website + customer accounts** → [`examples/portal-website-dashboard-001/`](examples/portal-website-dashboard-001/)

## Definition of done

Self-check against [`docs/validation-checklist.md`](docs/validation-checklist.md)
(the 9.5/10 quality bar). Smoke-render against contrasting briefs in
[`sample-brands/`](sample-brands/) so the design holds across palettes + voices.

## Out of scope here

Plugin / connector / widget code lives in the separate
[Developer Kit](https://github.com/vincia-io/developer-kit). This kit is for
**visual** contributions only.
