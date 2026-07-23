# Latty — AI agent context pack

This directory is a self-contained context pack for AI coding agents (Claude, Cursor, etc.) building applications **with** Latty — the framework-agnostic design system published as `@latty-ds/*` on npm. Download or copy this folder into a consuming project and point your agent's system prompt, rules file, or project instructions at `agents/README.md` as the entry point.

This pack covers the design system from a **consumer's** perspective — installing, using, and theming Latty. It is not documentation for contributing to Latty itself.

## Packages

- `@latty-ds/tokens` — design tokens (CSS variables, JSON, JS) and the `configure()`/`createStyleSheet()` theming API
- `@latty-ds/web` — the Web Components themselves (Lit-based, `lt-*` custom elements)
- `@latty-ds/icons` — icon components
- `@latty-ds/react` — typed React wrappers around `@latty-ds/web`

## Files in this pack

| File                                       | Load this when you need to...                                                                         |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| [`installation.md`](./installation.md)     | Add Latty to a project for the first time                                                             |
| [`usage.md`](./usage.md)                   | Use components in vanilla HTML, a bundler, React, Vue, or Svelte; understand slots, events, forms     |
| [`theming.md`](./theming.md)               | Change brand colors, fonts, border radius/width, or switch light/dark theme                           |
| [`components.md`](./components.md)         | See the full component catalog and the shared prop vocabulary (`variant`, `appearance`, `size`, etc.) |
| [`decision-guide.md`](./decision-guide.md) | Decide which component fits a UI task ("I need to let the user pick a date")                          |
| [`patterns.md`](./patterns.md)             | See real multi-component composition examples (forms, cards, empty states)                            |

## Beyond this pack

This pack is orientation and decision-making context — it is deliberately not a full API reference, so it stays small enough to load as agent context. For exact, authoritative data once Latty is installed:

- **Per-component props, slots, and events**: `node_modules/@latty-ds/web/custom-elements.json` (Custom Elements Manifest format) ships with the package.
- **Token names and values**: `node_modules/@latty-ds/tokens/dist/tokens.json` and `tokens.css`.
- **Full docs site**: the published documentation site covers every component in depth with live examples.
