# PLAYGROUND-REDESIGN

## Context

The current `ComponentPlayground.astro` was built as a minimal declarative control panel backed by
`manifest.json`. It works well for simple single-element components but has several gaps:

- Controls use raw native `<select>`, `<input>`, and `<input type="checkbox">` — inconsistent with
  the design system's own components.
- No React code tab — only HTML is shown. Users have to mentally translate to React props.
- No icon picker — `icon`, `icon-start`, `icon-end` props render as plain text inputs, so users
  have to remember icon names from scratch.
- No color picker — `background`/`color` free-text props have no affordance.
- Subcomponents (e.g. `lt-breadcrumb-item`, `lt-dropdown-item`) have no controls at all.
- Complex components (`lt-table`, `lt-dialog`, `lt-select`) still require a manual `PlaygroundShell`
  page with hand-written control HTML and JS — a maintenance burden.
- No event log — form components dispatch `change`/`input`/`select` events but there's no way to
  see them fire.
- No responsive preview — components can't be tested at mobile widths.
- Playground state is not shareable — can't link to a specific configuration.

---

## Current Architecture (what exists)

| File                                            | Role                                                      |
| ----------------------------------------------- | --------------------------------------------------------- |
| `docs/src/components/ComponentPlayground.astro` | SSR + inline `<script>` for simple components             |
| `docs/src/components/PlaygroundShell.astro`     | Visual shell only; pages slot in their own controls + JS  |
| `packages/web/dist/manifest.json`               | Pre-built map of `tag → members[]` used by the playground |
| `packages/web/scripts/build-manifest.mjs`       | Transforms `custom-elements.json` → `manifest.json`       |
| `docs/src/components/FrameworkTabs.astro`       | HTML/React/Vue tabs in the Usage section                  |

`manifest.json` member types today: `boolean`, `select`, `text`, `number`.

Control rendering today: native `<select>`, `<input type="text|number">`, `<input type="checkbox">`.

---

## Design Decisions

### Controls use Latty components

All control widgets swap to `lt-switch` (boolean), `lt-select` (select), `lt-textfield` (text/number).
This makes the playground look like a first-class design-system showcase. Event wiring notes:

- `lt-switch` fires `change` with `detail.checked`
- `lt-select` fires `change` with `detail.value`
- `lt-textfield` fires `input` with `detail.value`

The client-side init script must branch on component type to read the right event/detail.

### Subcomponent tabs

A `subTags?: string[]` prop on `ComponentPlayground` allows a parent tag to declare which
sub-element tags it controls (e.g. `lt-breadcrumb` declares `['lt-breadcrumb-item']`).
When provided, the controls panel renders as an `lt-tab-group` with one tab per tag.
Each tab shows that element's manifest controls.
The preview renders a representative composed template (defined per-page via a `template` prop or
slot; falls back to a sensible default like parent + 2 children).

### Code panel: HTML + React tabs

The bottom-right code panel gains HTML and React tabs (using `lt-tab-group`).

- HTML tab: existing logic, unchanged.
- React tab: generated at runtime by the same state object using a `toReactCode()` function.

#### React code generator algorithm

1. Strip `lt-` prefix from tag name, convert to PascalCase: `lt-list-item` → `ListItem`.
2. Emit `import { ComponentName } from '@latty/react';` header.
3. For each active attribute in state:
   - boolean true → `propName` (JSX shorthand, no value)
   - string non-default → `propName="value"`
4. Slot content (the `content` prop) → JSX children between tags.

Special cases emitted as a comment: JS-only props (`columns`, `data` on `lt-table`) are noted
with `{/* Set .columns and .data via JS */}`.

### Icon picker

Manifest members whose `name` is `icon`, `icon-start`, or `icon-end` (and whose CEM type is
`string`) are given a new manifest type: `"icon"`. The playground renders these as a
`lt-combobox` pre-populated with all ~150 icon names from `@latty/icons`.

The icon list is injected at SSR time from the icons package:

```js
// build-manifest.mjs or ComponentPlayground.astro frontmatter:
import { icons } from '@latty/icons'; // flat string[] of all icon identifiers
```

Because the list is large, a combobox (with search filtering) is the right control.

### Color picker

Manifest members whose `name` is `color` or `background` AND whose resolved type is `text`
(not a union/select) are given manifest type `"color"`. The playground renders these as an
`<input type="color">` wrapped in a small swatch + hex-text combo.

The `lt-avatar.color`, `lt-header.background` etc. that are already typed as `select` are
unaffected — they stay as `lt-select`.

### Event log

A collapsible panel below the preview. On init, the playground attaches listeners for a fixed
set of events: `change`, `input`, `select`, `close`, `open`, `toggle`, `focus`, `blur`.
Each event is appended as a row: `<timestamp> <eventName> <JSON.stringify(event.detail ?? {})>`.
Max 20 rows (FIFO). The panel is collapsed by default; expands automatically on first event.

Toggle button uses `lt-button` with a log icon.

### Responsive preview

Three width-preset buttons above the preview area: **Mobile** (375 px) · **Tablet** (768 px) ·
**Desktop** (full). Clicking sets `max-width` on the `preview-stage`. Uses `lt-button` group with
`appearance="outlined"` and active state toggle.

### URL-shareable state

On every state change, update `window.history.replaceState` with `?s=<base64(JSON(state))>`.
On init, if `?s=` is present, decode and merge into defaults before first render.
The Copy button gains a sibling "Share" button that copies the current URL to clipboard.

### Variant presets row

If the manifest has a `variant` or `appearance` member with select options, render a static
read-only row below the playground titled "All variants" showing the component at each option
simultaneously. No interactivity needed — this is a flat flex row of instances. Opt out per
page via a `hidePresets` prop.

---

## Implementation Phases

### Phase 1 — Core UX lift _(highest value, self-contained)_

**Goal:** Replace native controls with Latty components; add React tab; icon picker; color picker.

Files changed:

- `packages/web/scripts/build-manifest.mjs` — detect `icon`/`icon-start`/`icon-end` → emit
  `"type": "icon"`; detect free-text `color`/`background` → emit `"type": "color"`.
- `docs/src/components/ComponentPlayground.astro` — full rewrite of SSR markup and client script:
  - Control rendering: `lt-switch`, `lt-select`, `lt-textfield`, icon combobox, color swatch.
  - Code panel: add `lt-tab-group` with HTML + React tabs; wire React code generator.
  - Import icon list from `@latty/icons` in the frontmatter for the icon combobox options.
- `docs/src/components/PlaygroundShell.astro` — same control-slot styles updated to use Latty
  class names (or replace the global CSS so shared slots don't need updating).

### Phase 2 — Subcomponent support

**Goal:** Allow `lt-breadcrumb`, `lt-dropdown`, `lt-list`, `lt-accordion`, etc. to expose child
controls without a manual PlaygroundShell page.

Files changed:

- `ComponentPlayground.astro` — add `subTags?: string[]` and `template?: string` props.
  When `subTags` is provided:
  - Controls panel is an `lt-tab-group`.
  - Tab 0 = parent tag controls.
  - Tabs 1..N = child tag controls (each sourced from manifest[subTag]).
  - `applyState()` applies parent props to the parent element, child props to all child elements
    in the preview.
  - Code generator emits nested HTML/React with child elements inside the parent.
- Docs pages that currently use `PlaygroundShell` and could be migrated:
  - `breadcrumb/index.astro` → `ComponentPlayground` with `subTags={['lt-breadcrumb-item']}`
  - `dropdown/index.astro` → if applicable
  - `accordion/index.astro` → if applicable

The `template` prop is an HTML string that defines the initial preview markup. If omitted,
defaults to `<parent-tag>` + 2–3 `<child-tag>` items with reasonable slot text.

### Phase 3 — Enhanced features _(polish, lower priority)_

Files changed:

- `ComponentPlayground.astro`:
  - **Event log**: collapsible `<div>` below preview. `initPlayground()` attaches event listeners
    after element creation. Uses `lt-button` with a `history` icon as the toggle.
  - **Responsive preview**: add a `<div class="breakpoints">` above the preview with 3
    `lt-button` instances (Mobile / Tablet / Desktop). On click, set `max-width` on stage.
  - **URL sharing**: `window.history.replaceState` on state change; decode `?s=` on init. Add
    "Share" `lt-button` next to "Copy".
- **Variant presets row**: new component `VariantPresets.astro` that takes `tag` and `member`
  (default `"variant"`). Renders one component instance per option. Included on pages that have
  a variant/appearance dimension (button, badge, chip, alert, etc.).

---

## Manifest Type Additions

After Phase 1, `manifest.json` members can have these types:

| Type            | Control                       | Trigger prop names               |
| --------------- | ----------------------------- | -------------------------------- |
| `boolean`       | `lt-switch`                   | any boolean                      |
| `select`        | `lt-select`                   | any union                        |
| `text`          | `lt-textfield`                | any string                       |
| `number`        | `lt-textfield type=number`    | any number                       |
| `icon` _(new)_  | `lt-combobox` + icon preview  | `icon`, `icon-start`, `icon-end` |
| `color` _(new)_ | `<input type="color">` swatch | free-text `color`, `background`  |

Detection logic in `build-manifest.mjs` `toMember()`:

```js
// After resolving typeText = 'string':
const isIconProp = ['icon', 'icon-start', 'icon-end'].includes(name);
if (isIconProp) return { name, type: 'icon', default: '' };

const isColorProp = ['color', 'background'].includes(name);
if (isColorProp) return { name, type: 'color', default: '' };

return { name, type: 'text', default: parseDefault(rawDefault) ?? '' };
```

---

## React Code Generator (client-side utility)

```js
function toReactCode(tag, members, state, slotContent, defaults) {
  // lt-list-item → ListItem
  const componentName = tag
    .replace(/^lt-/, '')
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');

  const props = [];
  members.forEach((member) => {
    const value = state[member.name];
    if (member.type === 'boolean') {
      if (value === true) props.push(member.name);
    } else if (value !== '' && value !== undefined && value !== defaults[member.name]) {
      props.push(`${toCamelCase(member.name)}="${value}"`);
    }
  });

  const propsStr = props.length ? '\n  ' + props.join('\n  ') + '\n' : '';
  const children = slotContent ? `\n  ${slotContent}\n` : '';
  const inner = children || (propsStr ? '' : '');

  return [
    `import { ${componentName} } from '@latty/react';`,
    '',
    inner ? `<${componentName}${propsStr}>${inner}</${componentName}>` : `<${componentName}${propsStr} />`
  ].join('\n');
}
```

`toCamelCase` converts `icon-start` → `iconStart` for React prop names (web component attrs use
kebab, React wrappers expose camelCase).

---

## Icon List Source

```js
// In ComponentPlayground.astro frontmatter (SSR — runs at build time):
import { icons } from '@latty/icons';
// icons is a flat string[] of all icon identifiers, e.g. ['actions/check', 'ui/search', ...]
// or whatever the export shape is — confirm at implementation time.
```

If `@latty/icons` doesn't export a flat list, derive it from the `custom-elements.json` of the
icons package, or enumerate `packages/icons/src/icons/**/*.ts` filenames at build time using
`import.meta.glob` (Astro/Vite feature):

```js
const iconFiles = import.meta.glob('../../packages/icons/src/icons/**/*.ts', { eager: false });
const iconNames = Object.keys(iconFiles)
  .map((p) =>
    p
      .replace(/.*icons\//, '')
      .replace(/\.ts$/, '')
      .replace(/\/index$/, '')
  )
  .filter(Boolean);
```

---

## Pages Still Requiring `PlaygroundShell`

These pages have JS-only properties (arrays/objects) that can't be driven by attribute controls
and will continue to use `PlaygroundShell` + manual script even after this redesign:

- `table/index.astro` — `.columns` and `.data` are JS objects.
- `select/index.astro` — `.options` is a JS array.
- `combobox/index.astro` — same.
- `dialog/index.astro` — trigger-based; open/close via JS method calls.

For these, Phase 1 still benefits them by updating the `PlaygroundShell` shared control styles to
use Latty components.

---

## Open Questions / Decisions Deferred to Implementation

1. **Icon combobox vs. grid picker** — `lt-combobox` with search is the recommended choice given
   ~150 icons, but a visual grid popup could be nicer. Revisit when implementing.
2. **Color picker UX** — `<input type="color">` is universally supported but the OS picker is
   ugly. A palette of `--lt-color-*` swatches might be more on-brand. Decide in Phase 1.
3. **`subTags` template authoring** — the `template` prop (HTML string) works for simple cases
   but gets verbose for deeply nested components. May want a named-slot pattern instead.
4. **Event log event set** — hardcoded `['change', 'input', 'select', 'close', 'open', 'toggle']`
   is a guess. The CEM `events` array (from `custom-elements.json`) has the authoritative list —
   consider pulling it into `manifest.json` during `build-manifest.mjs`.
5. **Variant presets row** — decide whether this is a new `VariantPresets.astro` component (explicit
   inclusion per page) or auto-rendered inside `ComponentPlayground` when a `variant` member
   exists.

---

## Verification Plan (per phase)

**Phase 1**

- `pnpm --filter @latty/web build` → manifest has `"type": "icon"` and `"type": "color"` entries.
- `pnpm docs:dev` → open `lt-button` page, verify `lt-switch` for `disabled`, `lt-select` for
  `variant`, icon combobox for `icon-start` / `icon-end`.
- Switch React tab → valid import + JSX emitted; copy works.
- Toggle theme control → preview background flips.

**Phase 2**

- Open `lt-breadcrumb` page → controls panel shows two tabs (Breadcrumb / Breadcrumb Item).
- Change `separator` on parent tab → preview updates, code includes `separator=">"`.
- Change `current` on item tab → item in preview renders as non-linked text.

**Phase 3**

- Dispatch `change` event on `lt-switch` playground → event log row appears.
- Click Mobile breakpoint → preview stage constrained to 375 px.
- Mutate controls → URL `?s=` param updates; reload page with that URL → same state restored.
