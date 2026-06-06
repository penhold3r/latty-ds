# Latty Design System

> A lattice is an invisible grid that gives things their shape. Latty is that grid for your product.

![Version](https://img.shields.io/badge/version-0.1.0-6C4DE6) ![License](https://img.shields.io/badge/license-MIT-22c55e) ![Node](https://img.shields.io/badge/node-%E2%89%A524-339933?logo=nodedotjs&logoColor=white) ![Built with Lit](https://img.shields.io/badge/built_with-Lit-324FFF?logo=lit&logoColor=white) ![pnpm workspace](https://img.shields.io/badge/pnpm-workspace-F69220?logo=pnpm&logoColor=white) ![Web Components](https://img.shields.io/badge/Web_Components-lt--*-e11d48?logo=webcomponentsdotorg&logoColor=white)

Framework-agnostic design system built on design tokens and Web Components. One token change cascades through every component in every framework — no re-theming, no duplication.

**Docs:** https://penhold3r.github.io/latty-ds/

## Highlights

- **Token-first** — a single `tokens.config.json` drives CSS variables, JSON, and JS exports; full OKLCH colour palettes generated automatically.
- **Any framework** — components ship as standard Web Components (`lt-*`); React wrappers are auto-generated from the same manifest.
- **Themeable at runtime or build time** — call `configure()` in the browser to swap palettes on the fly, or use `createStyleSheet()` at build time to inject tokens with zero flash of unstyled content.
- **Accessible by default** — every component is tested with axe-core and validated with markuplint.
- **Monorepo, batteries included** — tokens, web components, icons, React wrappers, utilities, and a live documentation site all in one repo.

## Packages

| Package                               | Description                                         |
| ------------------------------------- | --------------------------------------------------- |
| [`@latty-ds/tokens`](packages/tokens) | Design tokens → CSS variables, JSON, and JS exports |
| [`@latty-ds/web`](packages/web)       | Web Components (`lt-` prefix, built with Lit)       |
| [`@latty-ds/icons`](packages/icons)   | Icon components with pluggable provider system      |
| [`@latty-ds/react`](packages/react)   | React wrappers auto-generated from the web manifest |
| [`@latty-ds/utils`](packages/utils)   | Shared internal utilities                           |

## Installation

```bash
pnpm add @latty-ds/tokens @latty-ds/web
# or: npm install @latty-ds/tokens @latty-ds/web
```

Import the token CSS once at the root of your app:

```js
import '@latty-ds/tokens/dist/tokens.css';
import '@latty-ds/web';
```

### HTML / Web Components

```html
<lt-button variant="primary">Save changes</lt-button>
<lt-textfield label="Email" type="email" required></lt-textfield>
<lt-badge variant="success">Active</lt-badge>
```

### React

```bash
pnpm add @latty-ds/react
```

```tsx
import { Button, Textfield, Badge } from '@latty-ds/react';

<Button variant="primary">Save changes</Button>
<Textfield label="Email" type="email" required />
<Badge variant="success">Active</Badge>
```

### Vue

Web Components work natively in Vue — no extra package needed:

```vue
<template>
  <lt-button variant="primary" @click="save">Save changes</lt-button>
  <lt-textfield label="Email" type="email" required></lt-textfield>
</template>
```

## Theming

Latty exposes a `configure()` API for runtime theming — useful for white-labelling, dark mode, or per-tenant colour schemes:

```ts
import { configure } from '@latty-ds/tokens/configure';

configure({
  colors: { primary: '#7c3aed' },
  font: { family: 'Inter, sans-serif' },
  border: { radius: '0.5rem' }
});
```

For **zero flash of unstyled content** at build time (Astro, Next.js, etc.), use `createStyleSheet()` and inject the result into your `<head>` before any components render:

```ts
import { createStyleSheet } from '@latty-ds/tokens/configure';

const css = createStyleSheet({ colors: { primary: '#7c3aed' } });
// inject as <style> in <head>
```

## Development

**Prerequisites:** Node.js ≥ 24, pnpm.

```bash
pnpm install          # install all workspace dependencies
pnpm dev              # build tokens + manifest, then start docs at localhost:4321
pnpm test             # run the full test suite (Vitest)
pnpm build            # build all packages
pnpm typecheck        # TypeScript type-check across the monorepo
pnpm lint             # ESLint (packages only — run pnpm eslint docs/src for docs)
```

Additional tools:

```bash
pnpm codegen:wrappers # regenerate React wrappers after changing web components
pnpm bundle-size      # print per-component gzip sizes vs baseline
pnpm lint:markup      # markuplint accessibility checks on the docs site
pnpm a11y             # pa11y-ci full-page accessibility audit (requires live server)
```

## Architecture

```
packages/
  tokens/   # tokens.config.json → CSS vars, JSON, JS (OKLCH palette generation)
  web/      # Lit-based Web Components; builds custom-elements.json manifest
  icons/    # Iconoir-based icons with pluggable provider
  react/    # React wrappers (auto-generated from custom-elements.json)
  utils/    # shared utilities — no external deps
docs/       # Astro documentation site with live component demos
scripts/    # codegen, bundle analysis, boundary checks
```

Package boundary rule: within a package use relative imports; across packages use the declared `workspace:*` package name. A `check:boundaries` script (also runs on `git push`) enforces this.

## Contributing

1. Fork and clone the repo.
2. Install dependencies: `pnpm install`.
3. Create a feature branch.
4. Make changes, run `pnpm test && pnpm typecheck && pnpm lint`.
5. Commit following [Conventional Commits](https://www.conventionalcommits.org/) (`feat`, `fix`, `docs`, etc.) — a commit-msg hook enforces this.
6. Open a pull request.

To scaffold a new component: `/new-component <Name>` (via Claude Code) — generates the web component, tests, docs page, and sidebar entry in one step.

## License

MIT
