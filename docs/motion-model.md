# Motion model — the "Framer feel" without writing JS

> Declarative motion for design templates. You add one attribute,
> `data-vincia-motion`, and the platform's motion runtime animates the element
> on scroll / hover. No `<script>`, no animation library — the platform owns
> the engine; you declare intent. Respects `prefers-reduced-motion` and the
> editor automatically. Companion to the interaction model
> ([`interaction-model.md`](interaction-model.md)).

## The one attribute

```html
<h1 data-vincia-motion="fade-up">{{HERO_HEADLINE}}</h1>
<img data-vincia-motion="parallax" data-vincia-motion-speed="0.3" src="…">
```

`data-vincia-motion="<effect>"` + optional `data-vincia-motion-<param>`.

## Effects

| Effect | What it does |
|---|---|
| `reveal` / `fade-up` | fades + slides up as it enters the viewport |
| `fade-in` | fades in, no movement |
| `scale-in` | fades + scales up from 94% |
| `stagger` | on a **container**: its children enter in sequence |
| `parallax` | element drifts vertically as you scroll (depth) |
| `scroll-scrub` | maps the element's scroll progress (0→1) to a CSS var `--vincia-progress` (and fades it if `data-vincia-motion-fade="true"`) |
| `hover-lift` | lifts on pointer hover |
| `hover-tilt` | 3D tilt that tracks the pointer |
| `float` | gentle ambient up/down loop |

## Params (all optional)

| Param | Applies to | Default |
|---|---|---|
| `data-vincia-motion-distance` | reveal/fade-up (px of travel) | 24 |
| `data-vincia-motion-duration` | enter effects (ms) | 600 |
| `data-vincia-motion-delay` | enter effects (ms) | 0 |
| `data-vincia-motion-stagger` | stagger (seconds between children) | 0.08 |
| `data-vincia-motion-speed` | parallax (0–1.5; subtle = 0.2–0.4) | 0.3 |
| `data-vincia-motion-once` | enter effects — `"false"` re-fires on re-enter | once |

## Examples

```html
<!-- staggered feature cards -->
<div class="features" data-vincia-motion="stagger" data-vincia-motion-stagger="0.1">
  <div class="card">…</div>
  <div class="card">…</div>
  <div class="card">…</div>
</div>

<!-- hero image with depth -->
<img data-vincia-motion="parallax" data-vincia-motion-speed="0.25" src="{{photo:hero}}">

<!-- a card that tilts toward the cursor -->
<article class="pricing" data-vincia-motion="hover-tilt">…</article>

<!-- scroll-scrubbed progress bar: width:calc(var(--vincia-progress)*100%) in CSS -->
<div class="reading-progress" data-vincia-motion="scroll-scrub"></div>
```

## What lint enforces (RULE 28)
- `data-vincia-motion` must be a known effect → **error** otherwise.
- numeric params must be numbers → **error**; over the comfort cap (e.g. speed > 1.5, duration > 2000ms, distance > 200px) → **warn** (keeps pages from feeling sluggish or nauseating).

## Rules of the road
- **Reduced motion is automatic** — visitors with `prefers-reduced-motion` see content instantly, no animation. You don't handle it.
- **Keep it subtle** — `parallax` speed 0.2–0.4, durations 400–800ms. The caps exist because over-animation reads as amateur.
- **`data-vincia-motion` ≠ `data-vincia-animate`** — `-motion` is this rich designer vocabulary; the older `-animate` is the legacy reveal hook. Use `-motion`.
- **Still no behavior JS.** Motion is *how things look while they move*; *what happens* (popups, navigation, state) is the interaction model (RULE 26). Both are declarative; neither is `script.js`.
