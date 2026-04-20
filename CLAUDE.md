# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Latty is a framework-agnostic design system built on design tokens and Web Components. The architecture follows a "tokens first, components second" philosophy where design tokens generate CSS variables, and components consume them.

## Commands

### Development
```bash
pnpm dev                    # Run Astro documentation site
pnpm docs:dev               # Same as dev
```

### Documentation
```bash
pnpm docs:dev               # Start Astro dev server (http://localhost:4321)
pnpm docs:build             # Build documentation site (builds tokens + web first)
pnpm docs:preview           # Preview built documentation
```

### Building
```bash
pnpm build                  # Build all packages recursively
pnpm --filter @latty/tokens build   # Build tokens package only
pnpm --filter @latty/web build      # Build web components only
pnpm --filter @latty/docs build     # Build documentation site
```

### Testing
```bash
pnpm test                   # Run all tests with Vitest
pnpm test:watch             # Run tests in watch mode
pnpm test:ui                # Open Vitest UI
```

### Linting
```bash
pnpm lint                   # Run ESLint
```

### Cleaning
```bash
pnpm clean                  # Remove all dist directories
```

### Scaffolding
```bash
./scripts/new-component.sh <ComponentName>   # Scaffold a new component
```

Creates all boilerplate in one shot: web component files, Vitest test, docs page, and sidebar entry. Use PascalCase (e.g. `Badge`, `DatePicker`). After running, fill in the logic, styles, types, and docs — everything else is wired up.

## Architecture

### Monorepo Structure

This is a pnpm workspace monorepo with the following packages:

- **@latty/tokens** - Design tokens system that generates CSS variables, JSON, and JavaScript exports from `tokens.config.json`
- **@latty/web** - Web Components built with Lit (uses `lt-` prefix for custom elements)
- **@latty/icons** - Icon components using Iconoir library with pluggable provider system
- **@latty/docs** - Astro-based documentation site with MDX support and live component demos
- **@latty/react** - React wrappers for web components
- **@latty/angular** - Angular wrappers for web components
- **@latty/utils** - Shared utilities

### Design Tokens Build Process

The `@latty/tokens` package has a unique multi-step build:

1. **Build scripts**: `tsup` bundles `src/scripts/build-tokens.ts` into `dist-scripts/`
2. **Generate tokens**: Node executes `dist-scripts/build-tokens.js` which:
   - Reads `tokens.config.json` (base color values)
   - Generates color palettes with tints/shades using culori
   - Builds spacing scales (rem and px variants)
   - Outputs `dist/tokens.css`, `dist/tokens.json`, `dist/tokens.js`
3. **Type definitions**: `tsc -p tsconfig.types.json` generates public type definitions

Spacing tokens have special handling: `spacing.rem["4"]` becomes `--lt-spacing-4`, while `spacing.px["4"]` becomes `--lt-spacing-px-4`.

### Web Components

Components in `@latty/web` follow this structure:
```
components/
  button/
    button.ts           # LitElement component
    button.styles.ts    # Lit css tagged template
    button.types.ts     # TypeScript types
    button.stories.ts   # Legacy Storybook stories (reference only)
    __tests__/
      button.test.ts    # Vitest tests
    index.ts            # Public exports
```

All custom elements use the `lt-` prefix (e.g., `lt-button`, `lt-spinner`). Components consume design tokens via CSS custom properties with the `--lt-` prefix.

**Adding a new component**: always use `./scripts/new-component.sh <Name>` — it creates the 5 web package files, registers the export in `packages/web/src/index.js`, creates the docs page, and adds the sidebar entry alphabetically. Never create these manually.

### Documentation Site

The `@latty/docs` package uses Astro with MDX for documentation:

```
docs/
  src/
    pages/              # Documentation pages (auto-routed)
      index.mdx         # Homepage
      getting-started/  # Getting started guides
      tokens/           # Design tokens documentation
      components/       # Component documentation
      frameworks/       # Framework-specific guides
    layouts/            # Astro layouts
      BaseLayout.astro  # Main page layout
    components/         # Astro components
      Sidebar.astro       # Collapsible nav — add new component entries here (script does it automatically)
      ApiTable.astro      # Reads component metadata and renders prop/attr table
      ComponentPlayground.astro  # Attribute playground for simple components
      PlaygroundShell.astro      # Shell for custom JS-driven playgrounds
      CodeSnippet.astro   # Syntax-highlighted code block
    styles/             # Global styles
      global.css        # Base styles + token imports
```

Documentation pages can:
- Use MDX for rich content
- Import and render live Web Components
- Include interactive examples with `<script>` tags
- Import Astro components for reusable patterns

### TypeScript Path Aliases

The workspace uses path aliases defined in `tsconfig.base.json`:
- `@web/*` → `packages/web/src/*`
- `@tokens/*` → `packages/tokens/src/*`
- `@utils/*` → `packages/utils/src/*`

These are resolved in Vite/Vitest via `vite-tsconfig-paths` plugin and in build via `tsc-alias`.

### Creating Documentation

**Always use the scaffold script** — it generates the docs page automatically. For manual edits, component pages live at `docs/src/pages/components/<name>/index.astro` and use `.astro` (not `.mdx`) so they can include `<script>` blocks for live demos.

Two playground patterns exist:

1. **`ComponentPlayground`** — declarative, zero JS, reads attributes automatically:
```astro
<ComponentPlayground tag="lt-button" content="Click me" />
```

2. **`PlaygroundShell`** — for components that need JS to set properties (e.g. `lt-table` which takes `.columns`/`.data`):
```astro
<PlaygroundShell id="my-playground" previewHeight="auto">
  <div slot="preview">...</div>
  <div slot="controls">...</div>
</PlaygroundShell>
```

The docs page must `import '@latty/web'` inside a `<script>` tag to register the custom elements in the browser.

## Naming Conventions

Per `ARCHITECTURE.md`:
- **npm scope**: `@latty/*`
- **Custom element prefix**: `lt-`
- **CSS variable prefix**: `--lt-*`

## Testing

Tests use Vitest with jsdom environment. Test files are located at `packages/**/src/**/*.test.ts`. The configuration includes:
- Global test utilities enabled
- Setup file at `./vitest.setup.ts`
- Path aliases via `vite-tsconfig-paths`

## Node Version

Requires Node.js >= 24.0.0 (see `.nvmrc` and `package.json` engines field).
