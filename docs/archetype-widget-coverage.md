# Archetype-typical widget sets

A Vincia design template targets ONE archetype. The widgets you style in
`widget-ui-supplement.html` should cover the **typical set for that
archetype** — the widgets users most often place on the pages they create
after stamping your template.

## Two archetypes

The platform has **two** archetypes: `website` and `portal`. There is no
third option. (`website_as_portal` was retired — the new `website` covers
everything that used to need it.)

## The canonical list lives in registry

`packages/registry/src/data/archetype-widget-coverage.ts` exports
`ARCHETYPE_TYPICAL_WIDGETS`, surfaced via the manifest endpoint at
`/api/v2/widgets/manifest`. The CLI (`vincia test` / `vincia create`), the
marketplace badge, and the tenant-runtime style-lookup all read from the same
source — drift across these would let templates ship with placeholder blocks
for kinds the runtime never asks about. A test guard at
`packages/registry/tests/archetype-widget-coverage.test.mjs` asserts every
kind is a real `WidgetDef.kind`.

The lists below are the v0.2 baseline (post-archetype-collapse, 2026-05-22).
Treat the constant as authoritative; this doc is a snapshot.

## `website` — public site (with optional customer accounts)

Public-facing pages plus **always-on admin sign-in** (the super-admin uses it
to manage forms data, content, customer records) and **optional customer
sign-up + dashboard pages** (when customer accounts are enabled).

A `website` template should style:

1. **Marketing surface** (hero, features, testimonials, pricing, FAQ, CTA,
   contact, media)
2. **Auth surface** (login-form, signup-form, password-reset-form, user-menu)
   — these are part of every website because the super-admin always uses
   sign-in
3. **Customer-private data layer** (data-table, card-grid, kpi-card, list) —
   reserved for the optional customer-dashboard pages

**Typical kinds**:

```
heading · text · button · image · markdown · divider · spacer · section · columns
landing-hero · feature-card · testimonial · pricing-table · faq · callout · pullquote
gallery-grid · image-carousel · video · smart-video · mockup-frame
form
nav-group · site-nav · footer-nav · breadcrumbs
logo-strip · social-links · business-info · badge
login-form · signup-form · password-reset-form · user-menu
data-table · card-grid · kpi-card · list
admin-users · account-settings
```

Composition patterns:
- "Features grid" = N × `feature-card` inside `columns`
- "Testimonials wall" = N × `testimonial` inside `columns`
- "Logo proof" = `logo-strip` (multiple logos as one widget)
- "Hero" = `landing-hero`; or `heading` + `text` + `button` inside `section`
  for a custom hero
- "CTA band" = `section` (brand-color bg) + `heading` + `button`
- "Contact form" = generic `form` bound to a contacts collection
- "FAQ accordion" = `faq` (already accordion-shaped)
- "My orders" (customer dashboard) = `data-table` filtered to the logged-in
  customer
- "Account dashboard" (customer dashboard) = N × `kpi-card` inside `columns`
- Auth surface = `login-form` + `signup-form` + `password-reset-form` (the
  trio) — give these signature treatment; highest-visibility customer
  touchpoint

## `portal` — login-gated dashboard chrome

Sidebar app, not a website. Staff-facing or role-gated. Data-heavy. Every
page is behind login — no public surface.

**Typical kinds**:

```
sidebar-layout · nav-group · site-nav · breadcrumbs · user-menu · role-switcher
data-table · kanban · calendar · chart · kpi-card · stat · card-grid · list
form · multi-step-form · file-upload · search-box
admin-users · permissions-editor · team-onboarding
heading · text · button · markdown · divider · columns · section · callout · badge
tabs · overlay · pagination
```

Composition patterns:
- "Pipeline board" = `kanban` (status-driven movement between columns)
- "Schedule view" = `calendar` (date-field driven)
- "Trending metric" = `kpi-card` + `chart` side-by-side via `columns`
- "Audit log" = `data-table` bound to an audit collection, sorted desc
- "Admin permissions" = `permissions-editor` (matrix UI for roles × views)
- "Multi-step wizard" = `multi-step-form` (NOT N separate forms; one widget)
- "Modal" = `overlay` (the universal overlay widget; no dedicated "modal")

## Coverage policy

`vincia test` warns when typical kinds aren't styled, but does NOT fail.
Templates that style ALL typical widgets for their archetype earn a
`complete` marketplace badge. `partial` (≥60% styled) and `minimal` (only
universals or <60%) are the alternative bands.

End-users picking from the marketplace see the coverage level on the listing.
Templates with `complete` coverage get top placement in archetype-filtered
browse.

## Updating these lists

If the canonical constant in registry changes, run:

```bash
vincia widgets sync
```

…from inside your extracted kit. This regenerates the catalog files and
pulls the latest typical-widget map. If your supplement covers kinds that
got dropped from the typical set, no problem — they still render against
your styling. If new typical kinds get added, the validator warns; fill the
new blocks at your convenience.
