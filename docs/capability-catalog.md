# Capability Catalog — what a design template can actually DO

> **Read this before authoring anything functional.** A design template is
> static HTML/CSS that the platform parses into a live AppDefinition. The
> platform — NOT your JS — supplies behaviour. This catalog is the single
> source of truth for **which behaviours actually execute at runtime today**,
> which are authored-but-not-yet-wired, and which belong to a different layer.
>
> The golden rule: **never author a marker that doesn't execute.** Lint may
> pass it, but a visitor sees nothing happen — that's silent drift. Every row
> below is tagged with its real status so you (and any LLM driving this kit
> over MCP) only emit markup that does something.

This catalog applies identically whether you author locally (CLI) or through a
web LLM client over MCP (`vincia_sandbox_*`) — both feed the same parser and
the same tenant runtime. There is no capability that exists on one door and not
the other.

---

## Status legend

| Tag | Meaning |
|---|---|
| **LIVE** | Authored → parsed → executes at runtime. Safe to ship. |
| **LIVE (declarative interactions)** | Executes via the interaction interpreter the runtime injects. See [`interaction-model.md`](interaction-model.md). |
| **WIRED-AT-SUBMIT** | The form/collection half is live; the workflow half runs the declared steps. |
| **AUTHOR-FORWARD** | You may author it; lint validates it; the runtime does **not** execute it yet. Do **not** rely on it for a shipping site. Marked clearly so a future kit lights it up without you re-authoring. |
| **WRONG-LAYER** | Not a template concern. The composer mounts a Vincia widget, or a developer ships a connector. Reserve a module slot instead. |

---

## 1. Forms & data capture

| Case | How you author it | Status |
|---|---|---|
| Contact / lead form → stored in a data table | `<form data-vincia-form="contact">` + `data-vincia-field` inputs | **LIVE** |
| Newsletter / single-field signup | `<form data-vincia-form="newsletter">` + one email field | **LIVE** |
| Login / signup / password-reset | section `data-vincia-section-type="auth-login-form"` (or `-signup-form`, `-password-reset-form`) + a real `<form data-vincia-form="login">` | **LIVE** — pre-wired to platform auth, no workflow needed |
| Required field | native `required` attribute on the input | **LIVE** |
| Field type validation (email/url/phone/number/date) | input `type="email"` etc. — the field-kind drives a built-in validator | **LIVE** |
| Submit → store the record | implicit for every `data-vincia-form` | **LIVE** (insert-row) |
| Submit → run a server workflow (confirmation email, webhook) | `data-vincia-form-workflow="<id>"` + declare it in `template.json#workflows[]` | **LIVE** — parser stamps `config.workflowId`; the submit endpoint runs `send-email` / `send-webhook` steps (requires a platform email transport to be configured); see §4 |
| Inline success message after submit | the form widget renders it automatically (`successMessage`) | **LIVE** |
| Redirect to a thank-you page after submit | interaction rule: on the form `data-vincia-on="submit" data-vincia-do="set-event:contact_submitted"`, then `data-vincia-on="event:contact_submitted" data-vincia-do="navigate:/thank-you"` | **LIVE (declarative interactions)** |
| Rich validation (regex / min / max / match-another-field) | `data-vincia-validate='{"pattern":"…","minLength":2,"match":"password"}'` on the field | **LIVE** — enforced **client-side** by the interaction runtime (`setCustomValidity`); server still validates field types. Async "is-this-taken" checks are **AUTHOR-FORWARD**. |
| Multi-step / wizard form | author it with the interaction model — `show`/`hide` field-groups behind Next/Back buttons, guarded by `data-vincia-when` on `form.fields.*` | **LIVE (declarative interactions)** — see [`interaction-model.md`](interaction-model.md) "multi-step cause→effect chain" |

## 2. Conditional rendering (show / hide by state)

| Case | How you author it | Status |
|---|---|---|
| Show a section only when logged in / only to a role | `data-vincia-visible-when="user.authenticated"` (or `user.roles has 'admin'`) on the section | **LIVE** — compiled to a VisibilityRule, evaluated SSR + client |
| Show a thank-you band only after a form was submitted | `data-vincia-visible-when='event.has("contact_submitted")'` | **LIVE (declarative interactions)** |
| Show field B only when field A has a value | `data-vincia-visible-when='form.fields.plan == "pro"'` on field B's wrapper | **LIVE** — form-scoped `show_if` |
| Time-windowed band (business hours / date range) | `data-vincia-visible-when="time.businessHours"` | **LIVE** |
| A/B variant band | `data-vincia-visible-when='ab_variant.is("hero_test","b")'` | **LIVE** |

The `when` expression grammar is the platform's personalization DSL — see
[`interaction-model.md`](interaction-model.md) §"The `when` expression
language". The **same grammar** powers visibility *and* interaction guards, so
you learn one language.

## 3. Interactions — "when the user does X, Y happens, then when Z, W happens"

This is the declarative behaviour layer. You describe cause → effect; the
runtime injects a tiny interpreter that runs it. **No `<script>` needed.** Full
spec + examples in [`interaction-model.md`](interaction-model.md).

| Case | How you author it (short form) | Status |
|---|---|---|
| Newsletter popup after N seconds (once per visitor) | `data-vincia-on="delay:5s" data-vincia-when='!event.has("nl_seen")' data-vincia-do="open-modal:newsletter"` | **LIVE (declarative interactions)** |
| Dismiss popup → never show again | on the close button: `data-vincia-on="click" data-vincia-do="close-modal:newsletter; set-event:nl_seen"` | **LIVE (declarative interactions)** |
| Reveal next section once email is filled | `data-vincia-on="change" data-vincia-when='form.fields.email != ""' data-vincia-do="show:#step-2"` | **LIVE (declarative interactions)** |
| Exit-intent offer | `data-vincia-on="exit-intent" data-vincia-do="open-modal:offer"` | **LIVE (declarative interactions)** |
| Reveal-on-scroll (animation) | `data-vincia-on="scroll-into-view" data-vincia-do="add-class:in-view"` | **LIVE (declarative interactions)** |
| Tabs / accordion / toggle | `data-vincia-on="click" data-vincia-do="toggle:#panel-1"` | **LIVE (declarative interactions)** |
| Chained flow (X → set flag → later rule reads flag) | `set-event:<name>` in one rule, `event.has("<name>")` in another's `when` | **LIVE (declarative interactions)** |

**Chaining is how multi-step cause→effect works.** An action sets a session
event flag; a later rule's `when` reads it. That composes arbitrary
"X → then when Y → then Z" sequences as a declarative state machine, with no
imperative code.

## 4. Server-side reactions (workflows)

Declare in `template.json#workflows[]`; reference from a form via
`data-vincia-form-workflow`.

```json
"workflows": [
  { "id": "contact-confirmation-email",
    "trigger": "form-submit",
    "formId": "contact",
    "onSuccess": "toast-success",
    "steps": [
      { "kind": "send-email", "to": "{{record.email}}",
        "subject": "Thanks for reaching out", "body": "We'll reply within a day." }
    ] }
]
```

| Step `kind` | What it does | Status |
|---|---|---|
| `insert-row` | store a record (implicit for every form) | **LIVE** |
| `send-email` | email on submit | **LIVE** — fires when a platform email transport (SendGrid / SMTP / e2) is configured; `{{record.<field>}}` templating in `to`/`subject`/`body` resolves from the submitted row |
| `send-webhook` | POST to an external URL | **LIVE** |
| `send-sms` / `branch` / `wait` | SMS / conditional / delayed steps | **AUTHOR-FORWARD** — declared + validated; multi-node control flow lands in a later phase |

> Multi-step workflows translate too (each step becomes a node chained by
> `next`), but only single-chain `send-email` / `send-webhook` / `insert-row`
> sequences execute today — `branch`/`wait` nodes are validated, not yet run.

Triggers other than `form-submit` (`schedule`, `record-create`, `webhook-in`,
`route-load`) are **AUTHOR-FORWARD** — declare them to be future-ready, but they
don't fire yet.

## 5. Dynamic / data-driven pages

| Case | How you author it | Status |
|---|---|---|
| A list of cards rendered from real records | `data-vincia-list="..." data-vincia-bind="collection:<slug>"` + `data-vincia-field` on the item template's slots | **LIVE** — runtime renders one item per row (empty-state handled by runtime) |
| Detail page `/products/:id` loading one record | `template.json#routes[]` with `load: { collection, where: { id: "{{params.id}}" } }` + `data-vincia-bind="record.<field>"` (or `{{record.<field>}}`) on slots | **LIVE** — the runtime fetches the matching record per request and fills the bound elements/tokens server-side |
| Search / filter / sort / pagination over a collection | **don't** hand-build it — reserve a module slot for a `data-table` / `filter-bar` widget | **WRONG-LAYER** |

## 6. Auth gating

| Case | How you author it | Status |
|---|---|---|
| A whole page behind login (dashboard / account / billing / settings) | give the page one of those `role`s in `template.json#pages[]` | **LIVE** — auto-mounts private |
| One section behind login on an otherwise-public page | `data-vincia-bucket="private" data-vincia-auth-message="Sign in to see this"` on the `<section>` | **LIVE** — for anonymous visitors the runtime replaces that one section with the auth message + a Sign in link; logged-in visitors see it normally |

## 7. Things that are NOT a template's job (WRONG-LAYER)

Reserve a **module slot** (`data-vincia-module-slot`, see
[`prompt-for-designer-llm.md`](prompt-for-designer-llm.md) Path 5a) and let the
composer drop a Vincia widget in. Don't hand-author these in HTML:

- Data tables with sort/filter/paginate, kanban boards, calendars, charts/KPIs
- Payment / checkout / cart (a connector + payment widgets)
- Realtime feeds / live counters
- Search across content
- File uploads beyond a single form field

You expose the **style hooks** (RULE 11) so a mounted widget inherits your
palette/type/spacing; the widget brings the behaviour.

---

## Decision flow

```
Need behaviour in a template?
│
├─ Is it a form capturing data?            → §1   (LIVE)
├─ Show/hide by state or auth?             → §2   (LIVE)
├─ "When user does X, Y happens"?          → §3   interaction-model.md (LIVE)
├─ A reaction AFTER a form submits?        → §4   workflows (WIRED-AT-SUBMIT)
├─ Cards from real records?                → §5   data-vincia-bind (LIVE)
├─ A whole/partial page behind login?      → §6   (LIVE)
└─ Tables / charts / payments / search?    → §7   reserve a MODULE SLOT (WRONG-LAYER)
```

If a case isn't in this catalog, it's probably WRONG-LAYER — ask in chat
before inventing a marker. A marker the parser doesn't read is dead weight that
lint might still wave through.
