# GitHub Copilot — Vincia Designer Kit

You're pairing with a designer to author visual contributions for the
[Vincia Forge](https://forge.vincia.io). This folder is the **Designer Kit
v0.4.4**.

## Required reading before generating

1. [`README.md`](../README.md) — kit layout + 2-archetype taxonomy
2. [`docs/prompt-for-llm.md`](../docs/prompt-for-llm.md) — conversational
   intent-first flow
3. [`docs/prompt-for-designer-llm.md`](../docs/prompt-for-designer-llm.md) —
   structural contract, **RULES 1-25** (mandatory before any HTML)
4. [`docs/canonical-vocabularies.md`](../docs/canonical-vocabularies.md) —
   archetypes, palettes, voices, motion levels

## Pick the closest exemplar before authoring

- Public website → `examples/wellness-habit-tracker-warm-earth-001/`
- Portal / admin → `examples/portal-admin-001/`
- Website + customer accounts → `examples/portal-website-dashboard-001/`

## Done means

Self-check against [`docs/validation-checklist.md`](../docs/validation-checklist.md)
(the 9.5/10 quality bar). Smoke-render against contrasting brands in
[`sample-brands/`](../sample-brands/).

Plugin / widget / connector code → separate
[Developer Kit](https://github.com/vincia-io/developer-kit).
