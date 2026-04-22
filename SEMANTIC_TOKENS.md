# Semantic Token Layer — Design & Implementation Plan

## Why

The current token system exposes only **primitive tokens** like `--lt-color-primary-500`. This works, but has two problems:

1. **No guidance on intent** — it's not obvious which step (`-100`? `-500`? `-700`?) is correct for a given use case (text, background, border, etc.). Developers have to guess or copy existing patterns.
2. **Theming is hard** — switching to dark mode would require updating every component's CSS individually, because there's no single override point.

A **semantic token layer** solves both. Semantic tokens express *intent* (`--lt-text-default`, `--lt-bg-surface`, `--lt-border-focus`) and reference primitives via `var()`. To change a theme, you only redefine the semantic layer.

---

## Architecture: Two-Layer Token System

```
Layer 1 — Primitive tokens (existing, unchanged)
  --lt-color-primary-500: #0097be
  --lt-color-neutral-900: #1b1b1b
  --lt-spacing-4: 1rem
  ...

Layer 2 — Semantic tokens (new)
  --lt-text-default:    var(--lt-color-neutral-900)
  --lt-bg-surface:      var(--lt-color-neutral-100)
  --lt-border-focus:    var(--lt-color-primary-400)
  --lt-interactive-primary-bg-hover: var(--lt-color-primary-600)
  ...
```

Both layers are available in `:root`. Components can use either. The semantic layer is the recommended entry point for new work; primitives remain for fine-grained control.

---

## Semantic Token Catalog

### Text — `--lt-text-*`

| Token | References | Intent |
|---|---|---|
| `--lt-text-default` | `--lt-color-neutral-900` | Main body text |
| `--lt-text-subtle` | `--lt-color-neutral-600` | Secondary text, captions, labels |
| `--lt-text-muted` | `--lt-color-neutral-400` | Placeholder text, hints |
| `--lt-text-disabled` | `--lt-color-neutral-400` | Disabled state text |
| `--lt-text-inverse` | `--lt-color-white` | Text on dark backgrounds |
| `--lt-text-primary` | `--lt-color-primary-700` | Primary-colored label text |
| `--lt-text-secondary` | `--lt-color-secondary-700` | Secondary-colored label text |
| `--lt-text-success` | `--lt-color-success-700` | Success state text |
| `--lt-text-warning` | `--lt-color-warning-700` | Warning state text |
| `--lt-text-error` | `--lt-color-error-700` | Error state text |
| `--lt-text-info` | `--lt-color-info-700` | Info state text |
| `--lt-text-on-primary` | `--lt-color-white` | Text on solid primary bg |
| `--lt-text-on-secondary` | `--lt-color-white` | Text on solid secondary bg |
| `--lt-text-on-success` | `--lt-color-neutral-900` | Text on solid success bg (dark — better contrast on green) |
| `--lt-text-on-warning` | `--lt-color-neutral-900` | Text on solid warning bg (dark — better contrast on yellow) |
| `--lt-text-on-error` | `--lt-color-white` | Text on solid error bg |
| `--lt-text-on-info` | `--lt-color-white` | Text on solid info bg |

### Background — `--lt-bg-*`

| Token | References | Intent |
|---|---|---|
| `--lt-bg-default` | `--lt-color-white` | Page/app background |
| `--lt-bg-subtle` | `--lt-color-neutral-50` | Very light bg, sidebar, off-white areas |
| `--lt-bg-surface` | `--lt-color-neutral-100` | Cards, panels, inputs |
| `--lt-bg-overlay` | `--lt-color-neutral-200` | Hover highlights, overlay tints |
| `--lt-bg-inverse` | `--lt-color-neutral-900` | Dark surfaces, tooltips |
| `--lt-bg-primary` | `--lt-color-primary-500` | Solid primary bg (buttons, badges) |
| `--lt-bg-primary-subtle` | `--lt-color-primary-100` | Tinted primary bg (chips, avatars, tags) |
| `--lt-bg-secondary` | `--lt-color-secondary-500` | Solid secondary bg |
| `--lt-bg-secondary-subtle` | `--lt-color-secondary-100` | Tinted secondary bg |
| `--lt-bg-success` | `--lt-color-success-500` | Solid success bg |
| `--lt-bg-success-subtle` | `--lt-color-success-100` | Tinted success bg (alerts, toasts) |
| `--lt-bg-warning` | `--lt-color-warning-500` | Solid warning bg |
| `--lt-bg-warning-subtle` | `--lt-color-warning-100` | Tinted warning bg |
| `--lt-bg-error` | `--lt-color-error-500` | Solid error bg |
| `--lt-bg-error-subtle` | `--lt-color-error-100` | Tinted error bg (input error state) |
| `--lt-bg-info` | `--lt-color-info-500` | Solid info bg |
| `--lt-bg-info-subtle` | `--lt-color-info-100` | Tinted info bg |
| `--lt-bg-neutral-subtle` | `--lt-color-neutral-100` | Tinted neutral bg (neutral chips/avatars) |

### Border — `--lt-border-*`

| Token | References | Intent |
|---|---|---|
| `--lt-border-default` | `--lt-color-neutral-200` | Standard dividers, input borders |
| `--lt-border-strong` | `--lt-color-neutral-400` | Emphasized borders, selected state |
| `--lt-border-subtle` | `--lt-color-neutral-100` | Very subtle separation |
| `--lt-border-focus` | `--lt-color-primary-400` | Focus ring / outline |
| `--lt-border-primary` | `--lt-color-primary-200` | Subtle primary-colored border |
| `--lt-border-primary-strong` | `--lt-color-primary-500` | Strong primary-colored border |
| `--lt-border-secondary` | `--lt-color-secondary-200` | Subtle secondary border |
| `--lt-border-secondary-strong` | `--lt-color-secondary-500` | Strong secondary border |
| `--lt-border-success` | `--lt-color-success-200` | Subtle success border |
| `--lt-border-success-strong` | `--lt-color-success-500` | Strong success border |
| `--lt-border-warning` | `--lt-color-warning-200` | Subtle warning border |
| `--lt-border-warning-strong` | `--lt-color-warning-500` | Strong warning border |
| `--lt-border-error` | `--lt-color-error-200` | Subtle error border |
| `--lt-border-error-strong` | `--lt-color-error-500` | Strong error border |
| `--lt-border-info` | `--lt-color-info-200` | Subtle info border |
| `--lt-border-info-strong` | `--lt-color-info-500` | Strong info border |

### Interactive — `--lt-interactive-*`

Used for stateful components (buttons, links, clickable chips). Encodes the hover/active ramp so components don't need to know which step number to use.

| Token | References | Intent |
|---|---|---|
| `--lt-interactive-primary-bg` | `--lt-color-primary-500` | Default bg |
| `--lt-interactive-primary-bg-hover` | `--lt-color-primary-600` | Hovered bg |
| `--lt-interactive-primary-bg-active` | `--lt-color-primary-700` | Pressed/active bg |
| `--lt-interactive-secondary-bg` | `--lt-color-secondary-500` | — |
| `--lt-interactive-secondary-bg-hover` | `--lt-color-secondary-600` | — |
| `--lt-interactive-secondary-bg-active` | `--lt-color-secondary-700` | — |
| *(same pattern for success, warning, error, info)* | | |

---

## Output Files

The token build will emit a new file alongside the existing ones:

```
packages/tokens/dist/
  tokens.css      ← unchanged (primitive tokens only)
  tokens.json     ← gets a new top-level "semantic" key
  tokens.js       ← same
  semantic.css    ← NEW: all semantic tokens as var() references
```

`semantic.css` format:
```css
/* ── Semantic tokens ───────────────────────────────── */
:root {
  --lt-bg-default: var(--lt-color-white);
  --lt-bg-error: var(--lt-color-error-500);
  --lt-bg-error-subtle: var(--lt-color-error-100);
  --lt-bg-inverse: var(--lt-color-neutral-900);
  --lt-bg-neutral-subtle: var(--lt-color-neutral-100);
  --lt-bg-overlay: var(--lt-color-neutral-200);
  --lt-bg-primary: var(--lt-color-primary-500);
  --lt-bg-primary-subtle: var(--lt-color-primary-100);
  /* ... ~70 tokens total, alphabetically sorted ... */
}
```

---

## Implementation Steps

### 1. Create `packages/tokens/src/semantic/semantic-tokens.ts`

Pure data module. Flat `Record<string, string>` — keys are bare token names, values are bare primitive references. The build emitter adds `--lt-` prefixes uniformly.

```ts
export type SemanticTokenMap = Record<string, string>;

const VARIANTS = ['primary', 'secondary', 'success', 'warning', 'error', 'info'] as const;

export const buildSemanticTokens = (): SemanticTokenMap => {
  const map: SemanticTokenMap = {};

  // Text
  map['text-default']  = 'color-neutral-900';
  map['text-subtle']   = 'color-neutral-600';
  map['text-muted']    = 'color-neutral-400';
  map['text-disabled'] = 'color-neutral-400';
  map['text-inverse']  = 'color-white';
  for (const v of VARIANTS) {
    map[`text-${v}`]    = `color-${v}-700`;
    map[`text-on-${v}`] = (v === 'warning' || v === 'success') ? 'color-neutral-900' : 'color-white';
  }

  // Background
  map['bg-default']        = 'color-white';
  map['bg-subtle']         = 'color-neutral-50';
  map['bg-surface']        = 'color-neutral-100';
  map['bg-overlay']        = 'color-neutral-200';
  map['bg-inverse']        = 'color-neutral-900';
  map['bg-neutral-subtle'] = 'color-neutral-100';
  for (const v of VARIANTS) {
    map[`bg-${v}`]        = `color-${v}-500`;
    map[`bg-${v}-subtle`] = `color-${v}-100`;
  }

  // Border
  map['border-default'] = 'color-neutral-200';
  map['border-strong']  = 'color-neutral-400';
  map['border-subtle']  = 'color-neutral-100';
  map['border-focus']   = 'color-primary-400';
  for (const v of VARIANTS) {
    map[`border-${v}`]        = `color-${v}-200`;
    map[`border-${v}-strong`] = `color-${v}-500`;
  }

  // Interactive
  for (const v of VARIANTS) {
    map[`interactive-${v}-bg`]        = `color-${v}-500`;
    map[`interactive-${v}-bg-hover`]  = `color-${v}-600`;
    map[`interactive-${v}-bg-active`] = `color-${v}-700`;
  }

  return map;
};
```

### 2. Create `packages/tokens/src/semantic/index.ts`

```ts
export { buildSemanticTokens } from './semantic-tokens';
export type { SemanticTokenMap } from './semantic-tokens';
```

### 3. Update `packages/tokens/src/scripts/build-tokens.ts`

Add a dedicated CSS emitter for semantic tokens (bypasses the existing recursive walker, which emits raw string values — semantic tokens need `var()` wrappers):

```ts
import { buildSemanticTokens } from '../semantic/';
import type { SemanticTokenMap } from '../semantic/';

const semanticTokensToCss = (map: SemanticTokenMap): string => {
  const lines = Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, ref]) => `  --lt-${key}: var(--lt-${ref});`);
  return `/* Semantic tokens */\n:root {\n${lines.join('\n')}\n}\n`;
};
```

Then after building `tokens`, add:
```ts
const semanticMap = buildSemanticTokens();
const semanticCss = semanticTokensToCss(semanticMap);

fs.writeFileSync(path.join(outDir, 'semantic.css'), semanticCss, 'utf8');

// Add "semantic" key to JSON + JS outputs
const output = { ...tokens, semantic: semanticMap };
fs.writeFileSync(path.join(outDir, 'tokens.json'), JSON.stringify(output, null, 2) + '\n', 'utf8');
fs.writeFileSync(path.join(outDir, 'tokens.js'), `export const tokens = ${JSON.stringify(output)};\n`, 'utf8');
```

### 4. Update `packages/tokens/src/types/public-types.ts`

```ts
import type { SemanticTokenMap } from '../semantic/';

export type Tokens = {
  color:      Record<TokenColorName, PaletteFlat>;
  spacing:    SpacingTokens;
  border:     { radius: string; square: false };
  typography: { fontFamily: string };
  elevation:  ElevationTokens;
  semantic:   SemanticTokenMap;   // ← new
};
```

### 5. Update `packages/tokens/package.json`

Add export:
```json
"./semantic.css": "./dist/semantic.css"
```

### 6. Update `docs/src/styles/global.css`

```css
@import '@latty/tokens/tokens.css';
@import '@latty/tokens/semantic.css';   /* ← add */
```

### 7. Update `.storybook/preview.ts`

```ts
import '../packages/tokens/dist/tokens.css';
import '../packages/tokens/dist/semantic.css';   // ← add
```

### 8. Create `docs/src/pages/tokens/semantic.astro`

Docs page that reads `tokens.json` at build time and renders a table grouped by category (text, bg, border, interactive) with live color swatches for each token.

### 9. Update `docs/src/components/Sidebar.astro`

Add to the Tokens section:
```ts
{ label: 'Semantic Tokens', href: '/tokens/semantic' }
```

---

## What's Out of Scope (follow-up work)

- **Component migration**: existing components keep using primitives (`--lt-color-primary-500`). Migrating button, chip, avatar etc. to semantic tokens is a separate refactor pass — nothing breaks if deferred.
- **Dark mode**: semantic tokens are the *enabler* (a `[data-theme="dark"]` block would only need to redefine the semantic layer), but dark mode itself is a separate feature.

---

## Verification Checklist

1. `pnpm --filter @latty/tokens build` succeeds and emits `dist/semantic.css`
2. `dist/semantic.css` contains only `var(--lt-color-*)` values — no raw hex
3. `dist/tokens.json` has a top-level `semantic` key (~70 entries)
4. `pnpm dev` — docs site loads without errors
5. `/tokens/semantic` page renders with swatches and correct grouping
6. Browser DevTools `:root` shows `--lt-text-default`, `--lt-bg-default`, etc. resolved
