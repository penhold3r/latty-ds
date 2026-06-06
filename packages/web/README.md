# @latty-ds/web

Web Components for the Latty Design System — framework-agnostic UI components built with Lit and driven by design tokens.

## Installation

```bash
pnpm add @latty-ds/tokens @latty-ds/web
```

## Setup

Import the CSS tokens once in your app entry point, then import the component library:

```css
/* your global stylesheet */
@import '@latty-ds/tokens/tokens.css';
@import '@latty-ds/tokens/semantic.css';
```

```js
import '@latty-ds/web';
```

Or import individual components to keep bundles small:

```js
import '@latty-ds/web/dist/components/button';
import '@latty-ds/web/dist/components/textfield';
```

## Components

Buttons, inputs, overlays, navigation, data display, and more — all prefixed `lt-*`. See the [full component reference](https://penhold3r.github.io/latty-ds/) for props, events, and live examples.

## Usage

Components work in any HTML environment — no framework required.

```html
<lt-button variant="primary" size="md">Save changes</lt-button>

<lt-textfield label="Email" type="email" required></lt-textfield>

<lt-badge variant="success">Active</lt-badge>

<lt-spinner size="md" variant="primary"></lt-spinner>
```

### Common props

Most components share these props:

- **`variant`** — `primary` | `secondary` | `neutral` | `success` | `warning` | `error` | `info`
- **`size`** — `sm` | `md` | `lg`
- **`disabled`** — boolean

All props reflect to HTML attributes, so server-rendered markup works out of the box.

### Icons

Pass an icon name to components that support them:

```html
<lt-button icon="save">Save</lt-button>
<lt-button icon-end="arrow-right">Next</lt-button>
<lt-textfield icon-start="search" placeholder="Search…"></lt-textfield>
```

See [@latty-ds/icons](../icons/README.md) for the full icon reference.

### CSS customization

Components expose CSS parts for external styling:

```css
lt-button::part(button) {
  border-radius: 999px;
}
```

All visual properties are driven by `--lt-*` CSS custom properties. Override tokens globally or per-component:

```css
:root {
  --lt-interactive-primary-bg: hotpink;
}

lt-button {
  --lt-interactive-primary-bg: hotpink;
}
```

## TypeScript

Full type definitions are included. Import types directly:

```ts
import type { Button } from '@latty-ds/web';
```

The `custom-elements.json` manifest (at the package root) is compatible with VS Code's custom data format for HTML IntelliSense.

## License

MIT
