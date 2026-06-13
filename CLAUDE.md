# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Latty is a framework-agnostic design system built on design tokens and Web Components. The architecture follows a "tokens first, components second" philosophy where design tokens generate CSS variables, and components consume them.

## Commands

### Development

```bash
pnpm dev                    # Rebuild tokens + manifest, then start Astro dev server
pnpm docs:dev               # Start Astro dev server only (skips pre-builds)
```

**What updates live vs. what needs a restart:**

| What changed                                                    | What to do                                                     |
| --------------------------------------------------------------- | -------------------------------------------------------------- |
| Component logic / styles (`*.ts`, `*.styles.ts`)                | Nothing — Vite picks it up via source alias                    |
| Docs page (`.astro`)                                            | Nothing — Astro watches `docs/src/**` automatically            |
| Component prop added / renamed (affects playground + API table) | Restart `pnpm dev` — it rebuilds `manifest.json` on start      |
| Token values (`tokens.config.json`)                             | Restart `pnpm dev` — it rebuilds `@latty-ds/tokens` on start   |
| Stale browser after restart                                     | Hard-refresh (`Cmd+Shift+R`) or run `pnpm docs:dev -- --force` |

The `manifest.json` (`packages/web/dist/manifest.json`) is the only genuinely dist-based artifact the dev server reads at SSR time. `ComponentPlayground` and `ApiTable` both use it to render controls and prop tables — it must be rebuilt whenever a component's public API changes.

### Documentation

```bash
pnpm docs:dev               # Start Astro dev server (http://localhost:4321)
pnpm docs:build             # Build documentation site (builds tokens + web first)
pnpm docs:preview           # Preview built documentation
```

### Building

```bash
pnpm build                  # Build all packages recursively
pnpm --filter @latty-ds/tokens build   # Build tokens package only
pnpm --filter @latty-ds/web build      # Build web components only
pnpm --filter @latty-ds/docs build     # Build documentation site
```

### Testing

```bash
pnpm test                   # Run all tests with Vitest
pnpm test:watch             # Run tests in watch mode
pnpm test:ui                # Open Vitest UI
pnpm vitest run <filepath>  # Run a single test file
```

### Linting

```bash
pnpm lint                   # Run ESLint on packages/ only
pnpm eslint docs/src        # Run ESLint on docs (pnpm lint does NOT cover docs)
pnpm format:check           # Prettier check (full repo — fix with: pnpm prettier --write .)
pnpm typecheck              # Type-check all packages (tsc --noEmit)
pnpm check:boundaries       # Detect cross-package relative imports
pnpm lint:markup            # markuplint HTML/a11y checks on docs pages
pnpm a11y                   # Playwright + axe-core WCAG2AA checks in light + dark mode (auto-starts dev server)
pnpm a11y:report            # Open the HTML report from the last a11y run (playwright-a11y-report/, gitignored)
```

**Important**: `pnpm typecheck` and `pnpm check:boundaries` read built `dist/` directories — always run `pnpm build` first after a `pnpm clean`. The correct full-monorepo check order is: build → test → lint (packages + docs) → format:check → typecheck → check:boundaries → lint:markup → a11y.

### Cleaning

```bash
pnpm clean                  # Remove all dist directories
```

### Code generation

```bash
pnpm codegen:wrappers       # Regenerate React wrappers from custom-elements.json
```

Run this after adding or modifying web components so `@latty-ds/react` stays in sync.

### Bundle size

```bash
pnpm bundle-size            # Print per-component gzip sizes + diff vs baseline
pnpm bundle-size:update     # Same, and write new baseline to bundle-report.json
```

Commit `bundle-report.json` updates when intentionally adding code. The `--fail-on-regression` flag (used in CI) exits 1 if any component grows ≥ 10%.

### Scaffolding

Slash command scripts live in `.claude/commands/` (e.g. `new-component.sh`, `new-token.sh`, `new-icon.sh`). Edit these files to change scaffolding behavior.

```bash
/new-component <ComponentName> [--variants v1,v2] [--sizes sm,md,lg] [--disabled] [--events e1,e2]
```

Creates all boilerplate in one shot: web component files, Vitest test, docs page, and sidebar entry. Use PascalCase (e.g. `Badge`, `DatePicker`). After running, fill in the logic, styles, types, and docs — everything else is wired up.

```bash
/new-token color <name> <hex>
```

Adds a new color to the design system: registers it in `COLOR_NAMES`, updates `tokens.config.json`, and rebuilds `@latty-ds/tokens`. Example: `/new-token color purple #a855f7`.

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

All five publishable packages (`@latty-ds/tokens`, `@latty-ds/web`, `@latty-ds/icons`, `@latty-ds/react`, `@latty-ds/utils`) are versioned together using Lerna with fixed versioning.

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

- **@latty-ds/tokens** - Design tokens system that generates CSS variables, JSON, and JavaScript exports from `tokens.config.json`
- **@latty-ds/web** - Web Components built with Lit (uses `lt-` prefix for custom elements)
- **@latty-ds/icons** - Icon components using Iconoir library with pluggable provider system
- **@latty-ds/docs** - Astro-based documentation site with MDX support and live component demos (lives at `docs/` in repo root, not `packages/`)
- **@latty-ds/react** - React wrappers for web components (auto-generated from `custom-elements.json`)
- **@latty-ds/utils** - Shared utilities

### Design Tokens Build Process

The `@latty-ds/tokens` package has a unique multi-step build (`pnpm run build:scripts && build:tokens && build:types`):

1. **Build scripts**: `tsup` bundles `src/build/tokens.ts` into `dist-scripts/tokens.js`. `@latty-ds/utils` is inlined via `noExternal` so the script is fully self-contained.
2. **Generate tokens**: Node executes `dist-scripts/tokens.js` which:
   - Reads `tokens.config.json` (base hex values for each semantic color)
   - Generates full color palettes with tints/shades using culori (OKLCH)
   - Builds spacing scales (rem and px variants)
   - Outputs `dist/tokens.css`, `dist/tokens.json`, `dist/tokens.js`
   - Outputs `dist/semantic.css` (semantic token layer — maps raw tokens to role-based vars)
3. **Browser runtime**: `tsup` also bundles `src/configure/index.ts` → `dist/configure.js`, exporting `configure()` and `createStyleSheet()`:
   - `configure(config?)` — injects tokens as a `<style>` element at runtime (call once at app entry).
   - `createStyleSheet(config?)` — returns a CSS string for SSR; inject into `<head>` to avoid FOUC.
   - Both accept `{ colors, font, border, theme }`. The `theme` field is `'light' | 'dark' | 'system'` (system = light + dark via `prefers-color-scheme` + `[data-theme]` overrides).
4. **Type definitions**: `tsc -p tsconfig.types.json` generates public type definitions into `dist/`

Spacing tokens have special handling: `spacing.rem["4"]` becomes `--lt-spacing-4`, while `spacing.px["4"]` becomes `--lt-spacing-px-4`.

To add a new color, use `/new-token color <name> <hex>` — do not edit `tokens.config.json` by hand.

### Web Components

Components in `@latty-ds/web` follow this structure:

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

**Custom Elements Manifest**: `pnpm build` in `@latty-ds/web` runs `cem analyze` (via `cem.config.mjs`) to generate `custom-elements.json` at the package root. This manifest is what `pnpm codegen:wrappers` reads to produce React wrappers — always rebuild the web package before running codegen after changing component APIs.

**Font assets**: `pnpm build` in `@latty-ds/web` also copies Hanken Grotesk font files (`HankenGrotesk-Variable.woff2`, `HankenGrotesk-VariableItalic.woff2`) to `dist/fonts/` and `src/css/` to `dist/css/`. The package exports `dist/css/font-face.css` and `dist/css/latty.css` for consumers who want to load fonts and base styles without a bundler.

**Reuse existing components**: before writing custom CSS for a new component, check whether an existing component can provide the same structure. For example, `lt-surface` provides background, elevation (shadow), and border-radius — new components that need a styled container should use it rather than hand-rolling those styles. Import the dependency with a side-effect import (e.g. `import '../surface/surface'`) and use `::part(surface)` to style layout internals from the consumer's shadow DOM.

### Documentation Site

The `@latty-ds/docs` package uses Astro with MDX for documentation:

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
      BaseLayout/       # Main page layout
        index.astro
        BaseLayout.script.ts
        BaseLayout.styles.css
    components/         # Astro components — each in its own directory
      Sidebar/          # Collapsible nav (script updates this automatically)
        index.astro
        Sidebar.styles.css
      ApiTable/         # Reads component metadata and renders prop/attr table
        index.astro
        ApiTable.script.ts
        ApiTable.styles.css
      ComponentPlayground/  # Interactive attribute playground
        index.astro
        ComponentPlayground.script.ts
        ComponentPlayground.styles.css
        ComponentPlayground.types.ts
        ComponentPlayground.ssr.ts
      CodeSnippet/      # Syntax-highlighted code block
        index.astro
        CodeSnippet.script.ts
        CodeSnippet.styles.css
    styles/             # Global styles
      global.css        # Base styles + token imports
```

**Docs file naming convention**: every component and layout lives in its own directory (`Name/`). Co-located files follow `Name.script.ts`, `Name.styles.css`, `Name.types.ts`, `Name.ssr.ts` — never generic `script.ts` or `style.css`. Pages that need client `.ts` or data `.ts` files prefix them with `_` (e.g. `_icons.script.ts`, `_icons.data.ts`) because any `.ts` file in `src/pages/` without a `_` prefix is treated as an API route by Astro.

**CSS nesting**: Astro/Vite uses Lightning CSS which supports `& .child` and `&:hover` nesting, but **BEM modifier nesting (`&--modifier`) is invalid native CSS** — esbuild warns during minification. Write BEM modifiers as standalone rules: `.block--modifier {}` instead of `&--modifier {}` inside `.block {}`.

**`is:global` scoping**: dynamically created DOM elements (e.g. elements appended by `ComponentPlayground.script.ts`) are not targeted by Astro's scoped CSS. Use `<style is:global>@import './Name.styles.css';</style>` for components that create DOM dynamically.

**a11y and shadow DOM**: `pnpm a11y` uses Playwright + `@axe-core/playwright`. axe-core pierces shadow DOM, so it can audit the internals of `lt-button`, `lt-chip`, `lt-link`, and all other custom elements — no false positives from shadow boundary. Tests live in `a11y/a11y.spec.ts` and run against `playwright.a11y.config.ts`.

Documentation pages can:

- Use MDX for rich content
- Import and render live Web Components
- Include interactive examples with `<script>` tags
- Import Astro components for reusable patterns

### Package Boundaries

`tsconfig.base.json` defines no path aliases. The rule is:

- **Within a package**: use relative imports (`../foo/bar`)
- **Across packages**: use the package name declared as a `workspace:*` dep (`@latty-ds/utils`, `@latty-ds/web`, etc.)
- **Never**: use relative imports that leave a package root (e.g. `../../other-package/`)

The `pnpm check:boundaries` script (also runs on `git push`) enforces this and exits 1 on any violation.

Cross-package dependencies must be declared in the consuming package's `package.json`. Currently wired:

- `@latty-ds/web` depends on `@latty-ds/icons` and `@latty-ds/tokens` (CSS only)
- `@latty-ds/tokens` depends on `@latty-ds/utils`
- `@latty-ds/react` depends on `@latty-ds/web`

Vitest resolves imports at test time via `vite-tsconfig-paths` (no aliases needed).

### Creating Documentation

**Always use the scaffold script** — it generates the docs page automatically. For manual edits, component pages live at `docs/src/pages/components/<name>/index.astro` and use `.astro` (not `.mdx`) so they can include `<script>` blocks for live demos.

Use **`ComponentPlayground`** for all component pages. It reads attributes automatically and supports JS-only properties and trigger buttons:

```astro
{/* Simple component */}
<ComponentPlayground tag="lt-button" content="Click me" />

{/* JS-only properties (options, columns, data) — set after element creation */}
<ComponentPlayground
  tag="lt-select"
  seedData={{
    options: [
      { value: 'us', label: 'United States' },
      { value: 'ca', label: 'Canada' }
    ]
  }}
/>

{/* Components that start hidden and need a trigger (dialog, drawer) */}
<ComponentPlayground
  tag="lt-dialog"
  previewTrigger="Open Dialog"
  defaults={{ title: 'Dialog title', 'close-on-escape': true }}
/>
```

The docs page must `import '@latty-ds/web'` inside a `<script>` tag to register the custom elements in the browser.

**The docs site is a showcase of the design system.** Every docs page must use Latty components wherever possible — headings, body copy, buttons, badges, tables, alerts, links. Reach for `lt-text`, `lt-button`, `lt-badge`, `lt-alert`, `lt-link`, etc. before writing plain HTML or inline styles. Native HTML elements are only acceptable when no Latty component covers the use case. This rule applies to layout pages, overview pages, recipe pages, and getting-started guides — not just component demo pages.

## Naming Conventions

- **npm scope**: `@latty-ds/*`
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

**ESLint**: Uses v9 flat config (`eslint.config.mts`) with Astro, JSON, CSS, and Markdown support. CSS rules allow unknown `--lt-*` custom properties (`allowUnknownVariables: true`) since they are resolved at runtime by `@latty-ds/tokens`. `no-console` is an error — use the `logger` utility from `@latty-ds/utils` in scripts instead. Never use `any` or suppress linting warnings unless explicitly instructed.

**Prettier**: `printWidth: 120`, `singleQuote: true`, `trailingComma: "none"`. Includes `prettier-plugin-astro` for `.astro` file formatting.

## Agent Documents

Two directories at the repo root hold agent-produced documents. Both are tracked in git and survive context resets.

### `_agent-plans/` — Implementation and refactor plans

Use this for any task with multiple steps that need tracking across a session.

- Name files in SCREAMING-KEBAB: `ICONS-SVG-DOWNLOAD.md`, `DARK-THEME-REFACTOR.md`, etc.
- Every plan must use a **checkbox list** (`- [ ]`) so progress is visible at a glance and can be checked off as steps complete.
- Always write here before starting a multi-step implementation — do not rely on the ephemeral `~/.claude/plans/` file alone.

### `_agent-docs/` — Design decisions, audits, and research

Use this for non-actionable reference material: architectural decisions, audits, research notes, and context that future sessions will need.

- Name files in SCREAMING-KEBAB: `EXAMPLE-SITES-AUDIT.md`, `A11Y-CONTRAST-NOTES.md`, etc.
- No checkbox lists — these are reference docs, not task trackers.

## CI/CD

The docs site deploys automatically to GitHub Pages on every push to `main` via `.github/workflows/deploy-docs.yml`. The workflow installs with `--frozen-lockfile` and runs `pnpm docs:build`. No manual deploy step is needed.

## Node Version

Requires Node.js >= 24.0.0 (see `.nvmrc` and `package.json` engines field).
