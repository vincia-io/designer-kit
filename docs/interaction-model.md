# Interaction model — "when X, then Y" without writing JS

> Declarative behaviour for design templates. You describe **events → guarded
> conditions → actions**; the tenant runtime injects a tiny interpreter that
> runs them. You never write `<script>`. The same model composes simple toggles
> and multi-step "X → then when Y → then Z" flows.

This is the designer-facing surface over three platform engines:
the **personalization DSL** (conditions), the **client interaction interpreter**
(in-page events/actions), and **workflows** (server reactions). You only learn
this one model.

---

## The rule shape

An interaction rule lives as attributes on the element that owns the trigger:

```html
<button data-vincia-on="click"
        data-vincia-when='user.authenticated'
        data-vincia-do="toggle:#account-menu">
```

- **`data-vincia-on`** — the trigger (one per element; see table).
- **`data-vincia-when`** — *optional* guard, a personalization-DSL expression.
  The rule's actions run only when it evaluates truthy.
- **`data-vincia-do`** — one or more actions, `;`-separated, run in order.

Targets in actions are CSS selectors (`#id`, `.class`) or a named handle
(`modal:newsletter` resolves the element with `data-vincia-modal="newsletter"`).

## Triggers (`data-vincia-on`)

| Value | Fires when |
|---|---|
| `load` | the page is ready |
| `delay:<n>s` / `delay:<n>ms` | n seconds/ms after load |
| `click` | the element is clicked |
| `change` | a form field's value changes (put on the field or the form) |
| `submit` | the enclosing form is submitted (client-side, before the POST) |
| `scroll-into-view` | the element first enters the viewport |
| `exit-intent` | the pointer leaves toward the browser chrome (desktop) |
| `event:<name>` | a session event flag named `<name>` becomes set |

## Actions (`data-vincia-do`)

| Action | Effect |
|---|---|
| `show:<target>` / `hide:<target>` | set/clear `hidden` |
| `toggle:<target>` | flip visibility |
| `add-class:<class>` (on self) / `add-class:<target>:<class>` | add a CSS class (use for reveal animations) |
| `remove-class:…` | remove a CSS class |
| `open-modal:<name>` / `close-modal:<name>` | open/close a `data-vincia-modal` element (focus-trap handled by runtime) |
| `toast:<message>` | transient toast via the runtime toast bus |
| `navigate:<path>` | client navigation (`/thank-you`) |
| `set-event:<name>` / `clear-event:<name>` | set/clear a session event flag (persisted per the flag's scope) |
| `submit-form:<form-id>` | programmatically submit a form |
| `trigger-workflow:<id>` | fire a declared workflow (must exist in `workflows[]`) |

## The `when` expression language

Identical grammar to visibility (`data-vincia-visible-when`). Namespaces:

| Namespace | Examples |
|---|---|
| `user` | `user.authenticated`, `user.roles has 'admin'`, `user.attributes.plan == 'pro'` |
| `form` | `form.fields.email != ""`, `form.fields.country == 'IN'` (only inside a form) |
| `event` | `event.has("nl_seen")`, `!event.has("contact_submitted")` |
| `time` | `time.businessHours`, `time.after('2026-07-01')` |
| `campaign` | `campaign.source == 'newsletter'` |
| `ab_variant` | `ab_variant.is("hero_test","b")` |

Operators: `==` `!=` `<` `<=` `>` `>=` `&&` `||` `!` `has` and parentheses.
Conditions that read `user` / `form` / `event` / `ab_variant` are **stateful**
(evaluated client-side, never SSR-cached); `time` / `campaign` / `locale` /
`referrer` are cacheable.

---

## Worked examples

### Timed newsletter popup, once per visitor

```html
<!-- the modal -->
<div data-vincia-modal="newsletter" class="modal" hidden>
  <button data-vincia-on="click" data-vincia-do="close-modal:newsletter; set-event:nl_seen">×</button>
  <form data-vincia-form="newsletter">
    <input data-vincia-field="email" type="email" required>
    <button type="submit">Subscribe</button>
  </form>
</div>

<!-- the trigger: 5s after load, only if not seen before -->
<div data-vincia-on="delay:5s"
     data-vincia-when='!event.has("nl_seen")'
     data-vincia-do="open-modal:newsletter"></div>
```

### Reveal the next step once email is filled

```html
<form data-vincia-form="onboard">
  <input data-vincia-field="email" type="email"
         data-vincia-on="change"
         data-vincia-when='form.fields.email != ""'
         data-vincia-do="show:#step-2">
  <fieldset id="step-2" hidden> … </fieldset>
</form>
```

### After a contact form submits, go to a thank-you page

```html
<form data-vincia-form="contact"
      data-vincia-on="submit"
      data-vincia-do="set-event:contact_submitted">
  …
</form>
<!-- elsewhere, or on any page -->
<div data-vincia-on="event:contact_submitted" data-vincia-do="navigate:/thank-you"></div>
```

(For a server confirmation email too, also add
`data-vincia-form-workflow="contact-confirmation-email"` and declare that
workflow — see [`capability-catalog.md`](capability-catalog.md) §4.)

### A multi-step cause→effect chain

"When the user clicks *Get started*, show the plan picker. When they pick a
paid plan, reveal billing. When billing is valid, enable submit."

```html
<button data-vincia-on="click" data-vincia-do="show:#plans; set-event:started">Get started</button>

<fieldset id="plans" hidden>
  <select data-vincia-field="plan"
          data-vincia-on="change"
          data-vincia-when='form.fields.plan == "pro" || form.fields.plan == "team"'
          data-vincia-do="show:#billing"> … </select>
</fieldset>

<fieldset id="billing" hidden> … </fieldset>
```

Each step's action sets state (a shown section, an `event` flag, a field
value); the next step's `when` reads it. That's the whole pattern — arbitrarily
long chains compose from it.

---

## Rules of the road (what lint enforces)

The `lint-structural` `checkInteractions` pass enforces:

1. `data-vincia-on` must be a known trigger; an element with `data-vincia-on`
   must also have `data-vincia-do`. → **error**.
2. Every action verb in `data-vincia-do` must be in the action list. → **error**.
3. `open-modal:<name>` / `close-modal:<name>` must have a matching
   `data-vincia-modal="<name>"` in the same file. → **error**.
4. `trigger-workflow:<id>` must reference a declared `workflows[]` id. → **error**.
5. `show`/`hide`/`toggle:#id` whose `id` is absent from the file. → **warn**.
6. `data-vincia-when` / `data-vincia-visible-when` must have balanced parens and
   reference only known namespaces (`user` `form` `event` `time` `campaign`
   `ab_variant` `locale` `referrer`). → **error**.
7. `delay:<n>s` over 60s. → **warn**.
8. `data-vincia-validate` must be valid JSON. → **error**.

## Why no `<script>`

Designer-authored JS can't be cache-reasoned, can't be safely re-themed, and
breaks the deterministic build. The interpreter is small, audited, ships once,
and is identical for every template — so your "when X then Y" behaves the same
on every build, and the platform can evolve it (accessibility, reduced-motion,
analytics) without you touching markup. Progressive-enhancement `script.js` is
still allowed for *purely cosmetic* motion (RULE 14), never for behaviour that
this model can express.
