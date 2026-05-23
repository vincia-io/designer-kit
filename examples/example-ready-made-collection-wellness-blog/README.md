# Ready-made collection exemplar — Wellness blog seed

A worked example of the **ready-made-collection** tier on the Vincia Forge.

## What this collection is

A starter blog/journal collection for wellness brands — 10 sample posts
on habit-building, sleep, focus, and mindfulness. Includes the post schema
(field definitions for the build's content model) and realistic-feeling
content (not lorem ipsum) so the design renders convincingly the moment a
build installs it.

## Files

```
example-ready-made-collection-wellness-blog/
├── manifest.json    Forge metadata (id, tier, compatibleWith, row count)
├── schema.json      Field definitions for the `blog_posts` collection
├── rows.json        10 fully-written sample posts
└── README.md        This file
```

## How a build uses this collection

1. Studio super-admin (or auto-mode) installs the collection.
2. The build's content model gets a new `blog_posts` collection (from
   `schema.json`), and the rows from `rows.json` get inserted as
   starting content the super-admin can edit/extend/delete.
3. If the host design-template has a `/blog` view, it picks up the new
   collection automatically — the template's view spec binds to
   `collection: 'blog_posts'`.
4. If no `/blog` view exists yet, the Composer can add one (Ask Vincia's
   `add_view` step).

## Why this is a good citizen

- **Real content, not lorem ipsum.** Designers can preview their template
  against meaningful copy; brand briefs that fill the collection get a
  realistic head start.
- **Schema-led.** The collection ships its own field definitions —
  installing it doesn't require the host build to pre-declare anything.
- **`photo-slot` for cover images.** Each row's `cover_image` field uses
  the `{{photo:slot-name}}` convention so the photo-matcher resolves
  Unsplash URLs at render time — collections don't ship hardcoded image
  URLs.
- **`compatibleWith` declared.** The Composer / matcher uses the
  `archetype` + `industries` + `voice` constraints to pick this seed
  only when it fits the brand brief.

## Authoring your own ready-made collection

1. Run `vincia create ready-made-collection <name>` (when scaffolds land
   in the CLI; until then, copy this example and rename).
2. Replace `schema.json` with the field definitions for your domain
   (product catalog, podcast episodes, FAQ entries, real-estate
   listings, etc.).
3. Replace `rows.json` with realistic-feeling sample content. Aim for
   10-30 rows — enough that the host build's list/grid view doesn't
   look sparse.
4. Update `manifest.json#compatibleWith` to scope the matcher
   appropriately.
5. Run `vincia publish` (when wired) — your collection appears in the
   Forge marketplace.

## Not in this example

- **Multi-collection bundles.** This collection ships one
  `blog_posts` collection. Larger seeds (e.g. an e-commerce catalog
  with `products` + `categories` + `reviews`) declare multiple
  collections in `manifest.json#collections[]` — see the
  `solution-pack` tier for cross-tier bundles.
