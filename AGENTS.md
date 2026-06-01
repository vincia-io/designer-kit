# Agents — Vincia Designer Kit

Generic agent instructions following the [AGENTS.md](https://agents.md/)
convention (Aider, Continue, and any AGENTS-compatible client).

You're pairing with a human designer to author visual contributions for the
[Vincia Forge](https://forge.vincia.io). This folder is the **Designer Kit
v0.4.7**.

## Read these in order before generating

1. [`README.md`](README.md) — kit layout + 2-archetype taxonomy
2. [`docs/prompt-for-llm.md`](docs/prompt-for-llm.md) — conversational flow
3. [`docs/prompt-for-designer-llm.md`](docs/prompt-for-designer-llm.md) —
   structural contract, **RULES 1-27** (mandatory before any HTML)
4. [`docs/capability-catalog.md`](docs/capability-catalog.md) — authoritative
   LIVE / AUTHOR-FORWARD / WRONG-LAYER status for every functional capability;
   read before authoring forms, conditional rendering, popups, workflows, or
   auth gating so you never emit a marker the runtime ignores
5. [`docs/interaction-model.md`](docs/interaction-model.md) — declarative
   "when the user does X, Y happens" behaviour (`data-vincia-on/-when/-do`);
   never hand-write `<script>` for behaviour
6. [`docs/canonical-vocabularies.md`](docs/canonical-vocabularies.md) —
   archetypes, palettes, voices, motion levels

## Pick the closest exemplar before authoring

- Public website → `examples/wellness-habit-tracker-warm-earth-001/`
- Portal / admin → `examples/portal-admin-001/`
- Website + customer accounts → `examples/portal-website-dashboard-001/`

## Definition of done

Self-check against `docs/validation-checklist.md`. Smoke-render against
sample brands in `sample-brands/`.

Plugin / widget / connector code → separate
[Developer Kit](https://github.com/vincia-io/developer-kit).
