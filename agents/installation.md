# Installation

## Install packages

```bash
pnpm add @latty-ds/tokens @latty-ds/web
# or
npm install @latty-ds/tokens @latty-ds/web
# or
yarn add @latty-ds/tokens @latty-ds/web
```

## Load the tokens

Both CSS files must be loaded before any components render — import them once at the app's entry point.

```js
// JS / bundler
import '@latty-ds/tokens/tokens.css';
import '@latty-ds/tokens/semantic.css';
```

```css
/* CSS @import */
@import '@latty-ds/tokens/tokens.css';
@import '@latty-ds/tokens/semantic.css';
```

```html
<!-- Plain HTML, no bundler -->
<link rel="stylesheet" href="node_modules/@latty-ds/tokens/dist/tokens.css" />
<link rel="stylesheet" href="node_modules/@latty-ds/tokens/dist/semantic.css" />
```

## Register components

Components are self-registering custom elements. Once imported, use them anywhere in HTML.

```js
// All components at once
import '@latty-ds/web';

// Or cherry-pick to keep bundles small
import '@latty-ds/web/button';
import '@latty-ds/web/textfield';
import '@latty-ds/web/dialog';
```

## React wrappers (optional)

For typed props and idiomatic React event names, install the React wrapper package:

```bash
pnpm add @latty-ds/react
```

Importing any `@latty-ds/react` wrapper auto-registers all `lt-*` elements and icons — a separate `@latty-ds/web` import is not needed alongside it. Vue and Svelte users don't need a wrapper — `lt-*` elements work natively in both. See [`usage.md`](./usage.md) for framework-specific setup.

## TypeScript

All packages ship with `.d.ts` files — no extra setup needed.

## Next

- [`usage.md`](./usage.md) — start using components
- [`theming.md`](./theming.md) — customize the look and feel
