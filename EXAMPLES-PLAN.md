# Plan: Three Full-Page Example Sites (Iterative)

## Context

Build three polished full-page demo sites that showcase Latty at scale. The process is intentionally iterative — each site is a real-world audit of the design system, surfacing gaps (missing components, inflexible attributes, token shortcomings) before moving to the next. The third site requires a dark theme in `@latty/tokens` which is built after site 2's audit.

---

## Workflow

```
Build Site 1 (Coffee & Co.)
       ↓
  Pause + Review
  — what components were missing or needed new attrs?
  — what felt awkward or required hacky workarounds?
       ↓
Build Site 2 (Pulse Analytics)
       ↓
  Pause + Review
  — same audit
       ↓
Add dark theme to @latty/tokens
       ↓
Build Site 3 (Forma Studio) — uses dark theme
```

---

## Site Details

| Site                | Theme                          | Primary          | Font             |
| ------------------- | ------------------------------ | ---------------- | ---------------- |
| **Coffee & Co.**    | Warm artisan café landing page | `#b45309` amber  | Playfair Display |
| **Pulse Analytics** | SaaS dashboard shell           | `#4f46e5` indigo | Inter            |
| **Forma Studio**    | Dark-mode creative agency      | `#0891b2` cyan   | Space Grotesk    |

---

## Phase 1 — Site 1: Coffee & Co.

### Files to create

- `docs/src/pages/examples/coffee-shop/index.astro` — standalone `<!DOCTYPE html>` (no BaseLayout)

### configure() call

```ts
import { configure } from '@latty/tokens/configure';
configure({
  colors: { primary: '#b45309', secondary: '#92400e' },
  font: { family: "'Playfair Display', Georgia, serif" },
  border: { radius: '0.75rem' }
});
import '@latty/web';
```

### Sections

- **Nav**: sticky bar, logo text, `lt-button` CTA
- **Hero**: full-viewport dark overlay, `lt-text variant="display-xl"`, two `lt-button` (primary + outlined)
- **Menu cards**: 3-col grid, `lt-surface elevation="2"` + `lt-badge` + `lt-text`
- **Story**: 2-col, text side uses `lt-divider` + `lt-text variant="lead"` + `lt-button`
- **Newsletter**: `lt-textfield` + `lt-button` strip
- **Footer**: dark bar, `lt-link` nav items

---

## Phase 1 → Review

After building site 1, audit: what components were missing, which needed new attributes, which felt rigid. Document findings before continuing. This review shapes site 2 and potentially triggers new component work.

---

## Phase 2 — Site 2: Pulse Analytics

### Files to create

- `docs/src/pages/examples/pulse-analytics/index.astro` — standalone `<!DOCTYPE html>`

### configure() call

```ts
import { configure } from '@latty/tokens/configure';
configure({
  colors: { primary: '#4f46e5', secondary: '#7c3aed' },
  font: { family: "'Inter', system-ui, sans-serif" },
  border: { radius: '0.5rem' }
});
import '@latty/web';
```

### Layout

CSS grid app shell (sidebar | main):

- **Top bar**: `lt-header background="primary"`, `lt-avatar` user icon
- **Sidebar**: `lt-nav` + `lt-nav-item` (Dashboard, Analytics, Reports, Settings)
- **KPI row**: 4 × `lt-surface elevation="1"` — `lt-text variant="overline"` label, `lt-text variant="display-lg"` value, `lt-badge` trend
- **Table**: `lt-table` with `.columns`/`.data` set via JS, `lt-progress` per row
- **Filters**: `lt-select` + `lt-chip` active-filter tags
- **Alert panel**: `lt-alert` info + `lt-avatar` team list

---

## Phase 2 → Review

Same audit as phase 1 review. Feeds into the dark theme design and site 3 planning.

---

## Phase 3 — Dark theme in `@latty/tokens`

Before building site 3, add a proper dark theme mechanism to `@latty/tokens`. Scope TBD after the phase 2 review, but likely involves:

- Extending `configure()` or adding a `theme` option (`'light' | 'dark'`)
- Dark neutral palette (redefining `--lt-color-neutral-*` variables for dark mode)
- Possibly a `.dark` class or `prefers-color-scheme` media query layer

This is a substantial project — design carefully before implementing.

---

## Phase 4 — Site 3: Forma Studio

Uses the dark theme from phase 3.

### Files to create

- `docs/src/pages/examples/forma-studio/index.astro` — standalone `<!DOCTYPE html>`

### configure() call

```ts
import { configure } from '@latty/tokens/configure';
configure({
  colors: { primary: '#0891b2', secondary: '#06b6d4' },
  font: { family: "'Space Grotesk', system-ui, sans-serif" },
  border: { radius: '0.25rem' },
  theme: 'dark' // or however the dark theme API lands
});
import '@latty/web';
```

### Sections

- **Hero**: `lt-text variant="display-2xl"`, two `lt-button`
- **Work grid**: 3-col `lt-surface appearance="outlined"` cards, `lt-chip` tags
- **About strip**: `lt-divider` + pull-quote + `lt-avatar` row
- **Contact**: `lt-textfield` inputs + `lt-button`
- **Footer**: `lt-link` social links

---

## Shared Infrastructure (after all three sites exist)

- `docs/src/pages/examples/index.astro` — overview with three cards (BaseLayout, mirrors `recipes/index.astro` card grid)
- `docs/src/components/Sidebar.astro` — add Examples section after Recipes

---

## Starting Point (this session)

Build Phase 1 only — `coffee-shop/index.astro`. Pause for review before continuing.

### Key patterns to reuse

- `configure()` import path: `import { configure } from '@latty/tokens/configure'`
- Component imports: `import '@latty/web'` in `<script>` block
- Text variants: `display-2xl | display-xl | display-lg | h1-h6 | lead | body | body-sm | caption | overline | label`
- Button: `variant` (primary/secondary/neutral…), `appearance` (filled/outlined), `size` (sm/md/lg)
- Surface: `elevation` (0-5), `appearance` (filled/outlined)

### Verification (after site 1)

1. `pnpm docs:dev` → `/examples/coffee-shop` — font loads, palette applied, all components render
2. `pnpm lint:markup` → zero errors
