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
pnpm typecheck              # Type-check all packages (tsc --noEmit)
pnpm check:boundaries       # Detect cross-package relative imports
```

### Cleaning

```bash
pnpm clean                  # Remove all dist directories
```

### Code generation

```bash
pnpm codegen:wrappers       # Regenerate React wrappers from custom-elements.json
```

Run this after adding or modifying web components so `@latty/react` stays in sync.

### Bundle size

```bash
pnpm bundle-size            # Print per-component gzip sizes + diff vs baseline
pnpm bundle-size:update     # Same, and write new baseline to bundle-report.json
```

Commit `bundle-report.json` updates when intentionally adding code. The `--fail-on-regression` flag (used in CI) exits 1 if any component grows ≥ 10%.

### Scaffolding

```bash
/new-component <ComponentName> [--variants v1,v2] [--sizes sm,md,lg] [--disabled] [--events e1,e2]
```

Creates all boilerplate in one shot: web component files, Vitest test, docs page, and sidebar entry. Use PascalCase (e.g. `Badge`, `DatePicker`). After running, fill in the logic, styles, types, and docs — everything else is wired up.

```bash
/new-token color <name> <hex>
```

Adds a new color to the design system: registers it in `COLOR_NAMES`, updates `tokens.config.json`, and rebuilds `@latty/tokens`. Example: `/new-token color purple #a855f7`.

```bash
/new-icon <category> <icon-name>
```

Creates an icon stub in `packages/icons/src/icons/<category>/`, registers it in the category index, and adds it to the docs gallery. If the category doesn't exist it is created and wired into the top-level `src/icons/index.ts`. Fill in the SVG markup after scaffolding. SVG conventions: `viewBox="0 0 24 24" fill="none"` on the root `<svg>`; `stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"` on each shape.

### Commit conventions

Commits must follow [Conventional Commits](https://www.conventionalcommits.org/). The `commit-msg` hook enforces this via commitlint.

Format: `type(scope): subject`

Valid types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`, `perf`, `ci`, `build`
Valid scopes: `tokens`, `web`, `icons`, `react`, `utils`, `docs`, `scripts`, `deps`, `config`, `ci`, `release`

Example: `feat(web): add tooltip component`

Subject max length is 100 characters (longer than conventional default). Body lines may be up to 120 characters.

The `pre-push` hook also runs `pnpm check:boundaries && pnpm typecheck` before every push — fix any violations before pushing rather than skipping the hook.

### Releasing

All five publishable packages (`@latty/tokens`, `@latty/web`, `@latty/icons`, `@latty/react`, `@latty/utils`) are versioned together using Lerna with fixed versioning.

```bash
pnpm release          # Bump versions via conventional commits, commit, and tag
```

This runs `lerna version --conventional-commits`, which:

1. Inspects commits since the last tag to determine the version bump
2. Updates `version` in each package's `package.json` and `lerna.json`
3. Creates a `chore(release): publish vX.Y.Z` commit and a `vX.Y.Z` git tag
4. Pushes the commit and tag to `origin`

CI then picks up the tag and runs `lerna publish from-git` to publish to npm (see `.github/workflows/publish.yml`). Two secrets must be set in the GitHub repo: `NPM_TOKEN` (npm publish token) and `GH_TOKEN` (GitHub PAT with write access, needed to push version bumps).

To do a dry run without pushing: `pnpm exec lerna version --conventional-commits --no-push`.

## Architecture

### Monorepo Structure

This is a pnpm workspace monorepo with the following packages:

- **@latty/tokens** - Design tokens system that generates CSS variables, JSON, and JavaScript exports from `tokens.config.json`
- **@latty/web** - Web Components built with Lit (uses `lt-` prefix for custom elements)
- **@latty/icons** - Icon components using Iconoir library with pluggable provider system
- **@latty/docs** - Astro-based documentation site with MDX support and live component demos
- **@latty/react** - React wrappers for web components (auto-generated from `custom-elements.json`)
- **@latty/utils** - Shared utilities

### Design Tokens Build Process

The `@latty/tokens` package has a unique multi-step build (`pnpm run build:scripts && build:tokens && build:types`):

1. **Build scripts**: `tsup` bundles `src/build/tokens.ts` into `dist-scripts/tokens.js`. `@latty/utils` is inlined via `noExternal` so the script is fully self-contained.
2. **Generate tokens**: Node executes `dist-scripts/tokens.js` which:
   - Reads `tokens.config.json` (base hex values for each semantic color)
   - Generates full color palettes with tints/shades using culori (OKLCH)
   - Builds spacing scales (rem and px variants)
   - Outputs `dist/tokens.css`, `dist/tokens.json`, `dist/tokens.js`
   - Outputs `dist/semantic.css` (semantic token layer — maps raw tokens to role-based vars)
3. **Browser runtime**: `tsup` also bundles `src/configure/index.ts` → `dist/configure.js` (the `configure()` API for runtime theming)
4. **Type definitions**: `tsc -p tsconfig.types.json` generates public type definitions into `dist/`

Spacing tokens have special handling: `spacing.rem["4"]` becomes `--lt-spacing-4`, while `spacing.px["4"]` becomes `--lt-spacing-px-4`.

To add a new color, use `/new-token color <name> <hex>` — do not edit `tokens.config.json` by hand.

### Web Components

Components in `@latty/web` follow this structure:

```text
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

**Adding a new component**: always use the `/new-component <Name>` slash command — it creates the 5 web package files, registers the export in `packages/web/src/index.ts`, creates the docs page, and adds the sidebar entry alphabetically. Never create these manually. After scaffolding, run `pnpm codegen:wrappers` to regenerate the React wrappers.

**Custom Elements Manifest**: `pnpm build` in `@latty/web` runs `cem analyze` (via `cem.config.mjs`) to generate `custom-elements.json` at the package root. This manifest is what `pnpm codegen:wrappers` reads to produce React wrappers — always rebuild the web package before running codegen after changing component APIs.

**Font assets**: `pnpm build` in `@latty/web` also copies Nobile font files to `dist/fonts/` and `src/css/` to `dist/css/`. The package exports `dist/css/font-face.css` and `dist/css/latty.css` for consumers who want to load fonts and base styles without a bundler.

**Reuse existing components**: before writing custom CSS for a new component, check whether an existing component can provide the same structure. For example, `lt-surface` provides background, elevation (shadow), and border-radius — new components that need a styled container should use it rather than hand-rolling those styles. Import the dependency with a side-effect import (e.g. `import '../surface/surface'`) and use `::part(surface)` to style layout internals from the consumer's shadow DOM.

### Documentation Site

The `@latty/docs` package uses Astro with MDX for documentation:

```text
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

### Package Boundaries

`tsconfig.base.json` defines no path aliases. The rule is:

- **Within a package**: use relative imports (`../foo/bar`)
- **Across packages**: use the package name declared as a `workspace:*` dep (`@latty/utils`, `@latty/web`, etc.)
- **Never**: use relative imports that leave a package root (e.g. `../../other-package/`)

The `pnpm check:boundaries` script (also runs on `git push`) enforces this and exits 1 on any violation.

Cross-package dependencies must be declared in the consuming package's `package.json`. Currently wired:

- `@latty/web` depends on `@latty/icons` and `@latty/tokens` (CSS only)
- `@latty/tokens` depends on `@latty/utils`
- `@latty/react` depends on `@latty/web`

Vitest resolves imports at test time via `vite-tsconfig-paths` (no aliases needed).

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

- Global test utilities enabled (`describe`, `it`, `expect`, `vi` available without imports)
- Setup file at `./vitest.setup.ts` — imports `@testing-library/jest-dom` for DOM matchers
- Path aliases via `vite-tsconfig-paths`

**Lit component testing**: Lit renders asynchronously. After setting properties or calling `requestUpdate()`, always `await el.updateComplete` before asserting on the DOM or shadow root.

**Iterating over variants/sizes/appearances**: use `it.each([...] as const)('reflects %s variant to attribute', ...)` — never a `for...of` or `forEach` loop inside an `it` block. Each value becomes its own named test row, making failures easier to pinpoint. The `vitest/prefer-each` ESLint rule (`eslint.config.mts`) enforces the related pattern of not generating `it()` calls via loops inside `describe` blocks; the inside-`it` form is a convention enforced by this note.

## Tooling

**ESLint**: Uses v9 flat config (`eslint.config.mts`) with Astro, JSON, CSS, and Markdown support. CSS rules allow unknown `--lt-*` custom properties (`allowUnknownVariables: true`) since they are resolved at runtime by `@latty/tokens`. `no-console` is an error — use the `logger` utility from `@latty/utils` in scripts instead.

**Prettier**: `printWidth: 120`, `singleQuote: true`, `trailingComma: "none"`. Includes `prettier-plugin-astro` for `.astro` file formatting.

## CI/CD

The docs site deploys automatically to GitHub Pages on every push to `main` via `.github/workflows/deploy-docs.yml`. The workflow installs with `--frozen-lockfile` and runs `pnpm docs:build`. No manual deploy step is needed.

## Node Version

Requires Node.js >= 24.0.0 (see `.nvmrc` and `package.json` engines field).
