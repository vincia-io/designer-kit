# widget-ui-supplement.html — reference

The file that lets your design template's typography, color, and spacing
language flow into **user-added pages** that the end-customer creates AFTER
they stamp your template. Without this file, widgets on user-added pages
render in generic kit styling — your template covers only the pre-designed
sections you authored in `sections/`.

> **Status (v0.1.0 — Phase A2)**: Format locked. CLI commands `vincia template
> init / validate / coverage` are live. Tenant-runtime widget-style lookup
> lands in Phase A2.4 (~1-2 days after this file ships).

## File shape

```html
<!doctype html>
<!-- Header comment describing your template's archetype + intent. -->
<div id="vincia-widget-ui-supplement" data-archetype="portal">

  <section data-widget="data-table">
    <table class="vincia-data-table">
      <thead data-vincia-slot="header">
        <tr><th>Column</th></tr>
      </thead>
      <tbody data-vincia-slot="rows">
        <tr><td>Row</td></tr>
      </tbody>
    </table>
  </section>

  <section data-widget="form">
    <form class="vincia-form">
      <div data-vincia-slot="fields"></div>
      <button data-vincia-slot="submit">Submit</button>
    </form>
  </section>

  <!-- … one block per widget kind, ~15-40 sections depending on archetype … -->

</div>
```

## The rules

1. **One `<section data-widget="<kind>">` per widget kind** you want to style.
   Empty blocks (only a comment, only whitespace) fall back to default kit
   styling — graceful, never breaks. Don't be afraid to leave blocks empty if
   a widget genuinely doesn't fit your design.

2. **Use CSS variables from `theme/tokens.css`** for typography, color,
   spacing. The runtime substitutes real data into the HTML structure while
   preserving your CSS:

   ```html
   <section data-widget="kpi-card">
     <article style="background: var(--surface-1); padding: var(--space-4);">
       <div class="label" style="font-family: var(--font-display);" data-vincia-slot="label">
         Revenue
       </div>
       <div class="value" style="font: 32px/1 var(--font-mono);" data-vincia-slot="value">
         $12,345
       </div>
     </article>
   </section>
   ```

3. **`data-vincia-slot="<name>"` marks substitution points.** The runtime
   swaps real widget data into elements that carry a slot attribute. Slot
   names are widget-specific — the CLI lists them as you fill blocks.
   Common slots:

   | Widget kind        | Slots                                         |
   |--------------------|-----------------------------------------------|
   | `data-table`       | `header` · `rows` · `footer`                  |
   | `form`             | `fields` · `submit`                           |
   | `kanban`           | `columns` · `card-title` · `card-body`        |
   | `kpi-card`         | `label` · `value` · `delta`                   |
   | `list`             | `items` · `item-title` · `item-subtitle`      |
   | `card-grid`        | `cards` · `card-image` · `card-title` · `card-body` |
   | `calendar`         | `month-label` · `cells` · `event-title`       |

4. **`vincia template init` pre-populates the typical kinds** for your
   archetype. Run it once, then fill in each block. The kinds it lists are
   read from the canonical `ARCHETYPE_TYPICAL_WIDGETS` constant in the
   platform registry — same source the validator + coverage scorer use.

## widget-coverage.json

A companion file declares which widgets you've explicitly styled.

```jsonc
{
  "archetype": "portal",
  "buildType": "portal",
  "styledWidgets": [
    "data-table", "kanban", "calendar", "kpi-card", "form",
    "card-grid", "chart", "sidebar-layout", "breadcrumbs",
    "top-bar", "user-menu", "permissions-editor"
  ],
  "coverage": "complete"
}
```

| Field             | What it is                                                                |
|-------------------|---------------------------------------------------------------------------|
| `archetype`       | Must match `template.json` archetype.                                     |
| `buildType`       | Same value (kept for forward compat — Phase A2.4 may diverge).            |
| `styledWidgets[]` | Deduplicated kinds whose `<section>` block has non-trivial content.       |
| `coverage`        | `"complete"` \| `"partial"` \| `"minimal"`. Drives marketplace badge.     |

**You don't author this by hand.** `vincia template init` scaffolds it as
`minimal` (empty supplement). `vincia template validate` warns when it drifts
from the actual supplement contents — re-run after filling blocks and update.
A future `vincia template sync-coverage` will auto-update.

## Coverage scoring

The same rule runs in:

- the CLI (`vincia template validate` + `vincia template coverage`)
- the marketplace badge (Phase B uploads compute this server-side)
- (Phase A2.4) the tenant-runtime style-lookup as a debug-mode badge

| Level       | Rule                                                                                            |
|-------------|------------------------------------------------------------------------------------------------|
| `complete`  | Every kind in `ARCHETYPE_TYPICAL_WIDGETS[archetype]` is styled.                                |
| `partial`   | ≥ 60% of typical kinds styled.                                                                  |
| `minimal`   | Only universal primitives (heading / text / button / image / form) styled — or < 60% typical. |

End-users see the badge on the marketplace listing. Templates with
`complete` coverage get top placement in archetype-filtered browse.

## What you must NOT do

- **Don't invent new widget kinds.** Composition only. If you have a great
  design idea that needs a new widget, route it through the widget-proposal
  flow — platform team reviews and ships in the next registry release.
- **Don't add JavaScript.** The runtime owns interactivity. Your supplement
  is HTML + CSS via Vincia attributes.
- **Don't depend on real data structure.** Use slot attributes; never assume
  field names or row counts. The runtime swaps in any collection shape.

## Verifying

```bash
vincia template validate template.json
vincia template coverage
```

The validator surfaces:
- Missing required template.json fields
- Phantom widget kinds in your supplement (kinds not in any archetype's
  typical set — still allowed, just unusual)
- Typical kinds you haven't styled yet
- Coverage drift between `widget-coverage.json` and the actual supplement
