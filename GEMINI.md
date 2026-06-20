# Latty Design System - Gemini Mandates

This file provides foundational mandates, project-specific conventions, architecture rules, and workflows for the Latty design system. These instructions take absolute precedence over general defaults.

## Core Mandates

### 1. Architectural Integrity

- **Philosophy:** "Tokens first, components second". Design tokens generate CSS variables, and components consume them.
- **Monorepo Structure:** pnpm workspace.
  - `@latty-ds/tokens`: Design token generation (CSS, JSON, JS).
  - `@latty-ds/web`: Lit-based Web Components.
  - `@latty-ds/icons`: Icon registry and components.
  - `@latty-ds/react`: Auto-generated React wrappers.
  - `@latty-ds/utils`: Shared utilities.
  - `docs`: Astro/MDX documentation site.
- **Naming Conventions:**
  - npm scope: `@latty-ds/*`
  - Custom element prefix: `lt-`
  - CSS variable prefix: `--lt-*`
- **Package Boundaries:**
  - **Within a package:** Use relative imports (`../foo/bar`).
  - **Across packages:** Use the package name (`@latty-ds/web`, etc.).
  - **Never:** Use relative imports that leave a package root.
  - Path aliases are NOT used in `tsconfig.base.json`.

### 2. Engineering Standards

- **Surgical Updates:** Apply minimal, targeted changes. Do not perform unrelated refactoring or "cleanup".
- **Types and Linters:** Rigorously follow the type system and linting rules. Never suppress warnings or use `any` unless explicitly instructed.
- **Testing:**
  - Use Vitest with jsdom.
  - **Lit Components:** Always `await el.updateComplete` after property changes or `requestUpdate()`.
  - **Variants:** Use `it.each([...])` for testing multiple variants/sizes.
- **Documentation:**
  - The docs site must showcase the system. Use Latty components (`lt-text`, `lt-button`, etc.) in documentation pages instead of plain HTML where possible.
  - Component pages use `.astro` to allow `<script>` blocks for live demos.

## Workflows

### Scaffolding

- **New Component:** Use `/new-component <ComponentName>`. This creates web component files, tests, and docs.
- **New Token:** Use `/new-token color <name> <hex>`.
- **New Icon:** Use `/new-icon <category> <icon-name>`.
- **React Wrappers:** After modifying web components, run `pnpm codegen:wrappers` to keep `@latty-ds/react` in sync.

### Build and Test

- **Build All:** `pnpm build`
- **Dev Docs:** `pnpm dev` or `pnpm docs:dev`
- **Test All:** `pnpm test`
- **Bundle Size:** `pnpm bundle-size` (check) or `pnpm bundle-size:update` (baseline update).

### Commits

- **Conventional Commits:** Required. `type(scope): subject`.
- **Scopes:** `tokens`, `web`, `icons`, `react`, `utils`, `docs`, `scripts`, `deps`, `config`, `ci`, `release`.

## Research and Planning

- **Agent Documents:** Planning documents and research belong in `_agent-plans/` (gitignored, local-only) using `SCREAMING-KEBAB.md` naming. Do not use `_agent-docs/`.
- **Private Memory:** Local setup or private notes go to `/Users/nico/.gemini/tmp/latty-ds/memory/MEMORY.md`.
