# @latty/tokens

Design token package for the Latty Design System. Generates CSS custom properties, a JSON token object, and a browser-runtime API from a single configuration file.

---

## How it works

The build pipeline takes `tokens.config.json` as input and runs in three steps:

```
tokens.config.json
       ↓
  tsup (compile build script)
       ↓
  node dist-scripts/build-tokens.js
       ↓
  dist/tokens.css      ← primitive CSS custom properties
  dist/semantic.css    ← semantic CSS custom properties (var() references)
  dist/tokens.json     ← full token object (primitives + semantic map)
  dist/tokens.js       ← ES module export of token object
       ↓
  tsc (generate public type definitions)
       ↓
  dist/public-types.d.ts
```

In addition, `tsup` also bundles `src/configure/` into `dist/configure.js` — a browser-safe module that runs the same generation at runtime, so consumers can customise the palette without a build step.

---

## Configuring your palette

Edit `tokens.config.json` to set the base hex for each semantic color. The build generates a full 10-step OKLCH scale (50–900, plus a desaturated muted variant) from each value.

```json
{
  "color": {
    "primary":   "#05b8e1",
    "secondary": "#e26d05",
    "success":   "#22c55e",
    "warning":   "#eeb308",
    "error":     "#ef4444",
    "info":      "#0ea5e9"
  }
}
```

Then rebuild:

```bash
pnpm --filter @latty/tokens build
```

---

## Consuming tokens

### Option A — Static CSS import

Import once in your app's global stylesheet. Requires a build step.

```css
/* Primitive tokens (color scales, spacing, elevation, …) */
@import '@latty/tokens/tokens.css';

/* Semantic tokens (intent-based, reference primitives via var()) */
@import '@latty/tokens/semantic.css';
```

### Option B — Runtime `configure()` (no build step for the consumer)

Call `configure()` once at your app's entry point. It generates the full token set from the provided config and injects it into `document.head`. Useful when the palette must be determined at runtime (e.g. white-labelling, per-tenant theming).

```ts
import { configure } from '@latty/tokens/configure';

configure({
  colors: {
    primary:   '#6366f1',
    secondary: '#f59e0b',
  },
  font:   { family: 'Inter, sans-serif' },
  border: { radius: '0.375rem' },
});
```

All fields are optional — omitted values fall back to the defaults in `tokens.config.json`. Can be called again to hot-swap the theme; the existing `<style>` element is replaced.

### Option C — SSR (`createStyleSheet`)

For server-side rendering, use `createStyleSheet()` to get the CSS string and inject it yourself.

```ts
import { createStyleSheet } from '@latty/tokens/configure';

const css = createStyleSheet({ colors: { primary: '#6366f1' } });
// inject `css` into a <style> tag in your server-rendered HTML
```

### Option D — JS token object

Import the static token object for programmatic access (e.g. in a Tailwind config or a JS-driven style system).

```ts
import { tokens } from '@latty/tokens';

console.log(tokens.color.primary['500']); // "#0097be"
console.log(tokens.spacing.rem['4']);     // "1rem"
console.log(tokens.elevation['2']);       // "0 4px 6px -1px rgb(…)"
```

---

## Token reference

### Primitive tokens (`tokens.css`)

| Prefix | Example | Description |
|---|---|---|
| `--lt-color-[name]-[step]` | `--lt-color-primary-500` | Color palette steps 50–900 |
| `--lt-color-[name]-muted-[step]` | `--lt-color-primary-muted-300` | Desaturated variant of each color |
| `--lt-color-neutral-[step]` | `--lt-color-neutral-100` | Greyscale scale |
| `--lt-color-white` / `--lt-color-black` | | System colors |
| `--lt-spacing-[n]` | `--lt-spacing-4` → `1rem` | Spacing scale (rem), n = 0–24 |
| `--lt-spacing-px-[n]` | `--lt-spacing-px-4` → `16px` | Spacing scale (px) |
| `--lt-border-radius` | `0.5rem` | Global border radius |
| `--lt-elevation-[n]` | `--lt-elevation-2` | Box shadows, n = 0–5 |
| `--lt-typography-fontFamily` | `"Asap", sans-serif` | Base font family |

Color names: `primary`, `secondary`, `success`, `warning`, `error`, `info` (each with a `-muted` variant).

### Semantic tokens (`semantic.css`)

Semantic tokens encode intent, not raw values. They reference primitives via `var()` so theming only requires overriding this layer.

| Group | Example | Intent |
|---|---|---|
| `--lt-text-*` | `--lt-text-default` | Foreground / text colors |
| `--lt-bg-*` | `--lt-bg-surface` | Background fills |
| `--lt-border-*` | `--lt-border-focus` | Stroke colors |
| `--lt-interactive-*` | `--lt-interactive-primary-bg-hover` | Stateful component backgrounds |

Key semantic tokens:

```css
/* Text */
--lt-text-default          → --lt-color-neutral-900   /* body text */
--lt-text-subtle           → --lt-color-neutral-600   /* secondary / captions */
--lt-text-muted            → --lt-color-neutral-400   /* placeholder, hints */
--lt-text-inverse          → --lt-color-white         /* text on dark bg */
--lt-text-[variant]        → --lt-color-[variant]-700 /* colored label text */
--lt-text-on-[variant]     → white or neutral-900     /* text on solid colored bg */

/* Background */
--lt-bg-default            → --lt-color-white
--lt-bg-surface            → --lt-color-neutral-100   /* cards, panels */
--lt-bg-[variant]          → --lt-color-[variant]-500 /* solid colored bg */
--lt-bg-[variant]-subtle   → --lt-color-[variant]-100 /* tinted bg (chips, badges) */

/* Border */
--lt-border-default        → --lt-color-neutral-200
--lt-border-focus          → --lt-color-primary-400   /* focus ring */
--lt-border-[variant]      → --lt-color-[variant]-200 /* subtle colored border */
--lt-border-[variant]-strong → --lt-color-[variant]-500

/* Interactive */
--lt-interactive-[variant]-bg        → --lt-color-[variant]-500
--lt-interactive-[variant]-bg-hover  → --lt-color-[variant]-600
--lt-interactive-[variant]-bg-active → --lt-color-[variant]-700
```

`[variant]` = `primary` | `secondary` | `success` | `warning` | `error` | `info`

---

## Package exports

| Export | File | Use |
|---|---|---|
| `@latty/tokens` | `dist/index.js` | JS token object |
| `@latty/tokens/configure` | `dist/configure.js` | Runtime `configure()` / `createStyleSheet()` |
| `@latty/tokens/tokens.css` | `dist/tokens.css` | Primitive CSS custom properties |
| `@latty/tokens/semantic.css` | `dist/semantic.css` | Semantic CSS custom properties |
| `@latty/tokens/tokens.json` | `dist/tokens.json` | Full token object as JSON |

---

## Source structure

```
src/
  constants/       Shared constants (color steps, spacing base, default radius/font)
  types/           TypeScript type definitions (Tokens, LattyConfig, palette types, …)

  colors/          OKLCH color palette generator (main + muted scales)
  spacing/         Spacing scale generator (rem + px, 0–24 steps)
  elevation/       Box-shadow elevation generator (0–5 levels)
  semantic/        Semantic token map (intent → primitive reference)

  core/            Orchestration — combines generators into a Tokens object;
                   exports tokensToCss and semanticTokensToCss

  configure/       Public browser-runtime API (configure, createStyleSheet)
                   Includes unit tests

  build/           Node.js build pipeline (not browser-safe)
    colors.ts      Color token builder helper
    tokens.ts      Entry point — reads config, writes dist/ files
```

---

## Development

```bash
# Build the package (all three steps)
pnpm --filter @latty/tokens build

# Run tests
pnpm test

# Clean dist
pnpm --filter @latty/tokens clean
```
