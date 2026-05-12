# Plan: Dark Theme — Token Infra

## Context

Site 2 (Meridian) is complete. This plan adds dark theme infrastructure to `@latty/tokens` so:

1. `createStyleSheet({ theme: 'dark' })` outputs dark semantic tokens at `:root` — needed for Site 3 (Forma Studio, forced-dark creative agency site)
2. The distributed `semantic.css` automatically includes `@media (prefers-color-scheme: dark)` so library consumers get OS-aware dark mode for free
3. Four components with hardcoded `#fff` are fixed so all components go through the semantic layer

Scope: **token infra + component fixes only**. Docs-site toggle UI and `[data-theme]` manual override are deferred.

---

## Files to modify

| File                                                        | Change                                                       |
| ----------------------------------------------------------- | ------------------------------------------------------------ |
| `packages/tokens/src/semantic/semantic-tokens.ts`           | Add `mode` param; add dark token map                         |
| `packages/tokens/src/core/generate.ts`                      | Add optional `mediaQuery` param to `semanticTokensToCss`     |
| `packages/tokens/src/configure/configure.ts`                | Add `theme` to `LattyConfig`; update `createStyleSheet()`    |
| `packages/tokens/src/types/public-types.ts`                 | Add `theme?: 'auto' \| 'light' \| 'dark'` to `LattyConfig`   |
| `packages/tokens/src/build/tokens.ts`                       | Emit both light + dark blocks in `dist/semantic.css`         |
| `packages/web/src/css/latty.css`                            | `body` color/bg → semantic tokens                            |
| `packages/web/src/components/tooltip/tooltip.styles.ts`     | `#fff` → `var(--lt-text-inverse)`                            |
| `packages/web/src/components/sidepanel/sidepanel.styles.ts` | `#fff` → `var(--lt-bg-default)`                              |
| `packages/web/src/components/badge/badge.styles.ts`         | `#fff` → `var(--lt-text-on-primary)` (confirm exact context) |
| `packages/web/src/components/nav/nav.styles.ts`             | `var(--lt-color-neutral-0, #fff)` → `var(--lt-bg-default)`   |

---

## 1 — Dark semantic token values

`buildSemanticTokens(mode: 'light' | 'dark' = 'light')` — add mode parameter.

Dark mappings (neutral layer fully inverted; color variants shift steps for dark bg visibility):

```
Text:
  text-default   → color-neutral-100  (was 900)
  text-subtle    → color-neutral-300  (was 600)
  text-muted     → color-neutral-500  (was 400)
  text-disabled  → color-neutral-600  (was 400)
  text-inverse   → color-neutral-900  (was white)
  text-{v}       → color-{v}-300      (was {v}-700 — lighter for dark bg)
  text-on-{v}    → color-white        (unchanged — white on colored button)

Background:
  bg-default          → color-neutral-900  (was white)
  bg-subtle           → color-neutral-800  (was neutral-50)
  bg-surface          → color-neutral-800  (was neutral-100)
  bg-overlay          → color-neutral-700  (was neutral-200)
  bg-inverse          → color-neutral-50   (was neutral-900)
  bg-neutral-subtle   → color-neutral-800  (was neutral-100)
  bg-{v}              → color-{v}-500      (unchanged — colorful badges fine on dark bg)
  bg-{v}-subtle       → color-{v}-900      (was {v}-100 — dark tint on dark bg)

Border:
  border-default     → color-neutral-700   (was neutral-200)
  border-strong      → color-neutral-500   (was neutral-400)
  border-subtle      → color-neutral-800   (was neutral-100)
  border-focus       → color-primary-400   (was primary-200 — needs contrast on dark)
  border-{v}         → color-{v}-700       (was {v}-200)
  border-{v}-strong  → color-{v}-500       (unchanged)

Interactive (slightly lighter palette for dark bg visibility):
  interactive-{v}-bg        → color-{v}-400   (was 500)
  interactive-{v}-bg-hover  → color-{v}-300   (was 600)
  interactive-{v}-bg-active → color-{v}-500   (was 700)
```

---

## 2 — `semanticTokensToCss()` update (`src/core/generate.ts`)

Add optional `mediaQuery` param. When present, wraps output in `@media { :root { ... } }` instead of bare `:root { ... }`:

```typescript
export const semanticTokensToCss = (map: SemanticTokenMap, mediaQuery?: string): string => {
  const lines = Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, ref]) => `  --lt-${key}: var(--lt-${ref});`);

  if (mediaQuery) {
    const indented = lines.map((l) => '  ' + l);
    return `${mediaQuery} {\n  :root {\n${indented.join('\n')}\n  }\n}\n`;
  }
  return `/* Semantic tokens */\n:root {\n${lines.join('\n')}\n}\n`;
};
```

---

## 3 — `configure.ts` update

Add `theme` to `LattyConfig` (in `public-types.ts`):

```typescript
theme?: 'auto' | 'light' | 'dark';  // default: 'auto'
```

Replace the single module-level `SEMANTIC_CSS` constant with:

```typescript
const LIGHT_SEMANTIC_CSS = semanticTokensToCss(buildSemanticTokens('light'));
const DARK_SEMANTIC_CSS = semanticTokensToCss(buildSemanticTokens('dark'), '@media (prefers-color-scheme: dark)');
const AUTO_SEMANTIC_CSS = LIGHT_SEMANTIC_CSS + '\n' + DARK_SEMANTIC_CSS;
```

Update `createStyleSheet()`:

```typescript
export const createStyleSheet = (userConfig: LattyConfig = {}): string => {
  // ... (existing tokens build logic unchanged) ...

  const primitives = tokensToCss(tokens);
  const theme = userConfig.theme ?? 'auto';

  if (theme === 'dark') return primitives + '\n' + semanticTokensToCss(buildSemanticTokens('dark'));
  if (theme === 'light') return primitives + '\n' + LIGHT_SEMANTIC_CSS;
  return primitives + '\n' + AUTO_SEMANTIC_CSS; // 'auto'
};
```

`configure()` is unchanged — it calls `createStyleSheet()`, so inherits the new behaviour.

---

## 4 — Build script (`src/build/tokens.ts`)

Update the semantic.css write step to emit both light + dark blocks:

```typescript
const lightSemantic = semanticTokensToCss(buildSemanticTokens('light'));
const darkSemantic = semanticTokensToCss(buildSemanticTokens('dark'), '@media (prefers-color-scheme: dark)');
writeFile(join(outDir, 'semantic.css'), lightSemantic + '\n' + darkSemantic);
```

---

## 5 — `latty.css` update

```css
/* before */
body {
  color: var(--lt-color-neutral-900, #111);
  background: var(--lt-color-neutral-50, #fff);
}

/* after */
body {
  color: var(--lt-text-default);
  background: var(--lt-bg-default);
}
```

Also update `:focus-visible` outline to `var(--lt-border-focus)`.

---

## 6 — Component hardcoded color fixes

- `tooltip.styles.ts` — `color: #fff` → `color: var(--lt-text-inverse)`
- `sidepanel.styles.ts` — `background: #fff` → `background: var(--lt-bg-default)`
- `badge.styles.ts` — `color: #fff` → `color: var(--lt-text-on-primary)` (check per-variant rule context)
- `nav.styles.ts` — `var(--lt-color-neutral-0, #fff)` → `var(--lt-bg-default)`

---

## Verification

1. `pnpm --filter @latty/tokens build` — `dist/semantic.css` contains both `:root {}` (light) and `@media (prefers-color-scheme: dark) { :root {} }` blocks
2. `pnpm typecheck` — passes
3. `pnpm docs:dev` → OS set to dark → docs site and example pages flip automatically via media query
4. Site 3 SSR: `createStyleSheet({ theme: 'dark', colors: { primary: '#0891b2' } })` → dark semantics at `:root`, correct on first paint with zero FOUC
5. `pnpm a11y` → all pages pass WCAG2AA

---

## What's deferred

- `[data-theme="dark"]` / `[data-theme="light"]` attribute selectors for manual toggle
- Docs site dark mode toggle UI
- Site 3 build (Forma Studio) — starts after this plan is implemented
