# @latty/web

Web Components for the Latty design system — 30+ framework-agnostic UI components built with Lit and driven by design tokens.

## Installation

```bash
pnpm add @latty/tokens @latty/web
```

## Setup

Import the CSS tokens once in your app entry point, then import the component library:

```css
/* your global stylesheet */
@import '@latty/tokens/tokens.css';
@import '@latty/tokens/semantic.css';
```

```js
import '@latty/web';
```

Or import individual components to keep bundles small:

```js
import '@latty/web/dist/components/button';
import '@latty/web/dist/components/textfield';
```

## Components

| Component | Tag | Description |
|---|---|---|
| Accordion | `lt-accordion` | Collapsible content sections |
| Alert | `lt-alert` | Status messages with variants |
| Avatar | `lt-avatar` | User avatar with image or initials |
| Badge | `lt-badge` | Small status indicator |
| Breadcrumb | `lt-breadcrumb` / `lt-breadcrumb-item` | Navigation trail |
| Button | `lt-button` | Action button |
| Checkbox | `lt-checkbox` | Boolean input |
| Chip | `lt-chip` | Compact tag or filter |
| Dialog | `lt-dialog` | Modal overlay |
| Divider | `lt-divider` | Visual separator |
| Dropdown | `lt-dropdown` | Floating action menu |
| Header | `lt-header` | Page header bar |
| Link | `lt-link` | Styled anchor |
| List | `lt-list` | Vertical list layout |
| Nav | `lt-nav` | Navigation container |
| Progress | `lt-progress` | Progress bar |
| Radio / RadioGroup | `lt-radio` / `lt-radio-group` | Single-select inputs |
| Select | `lt-select` | Dropdown select |
| Skeleton | `lt-skeleton` | Loading placeholder |
| Slider | `lt-slider` | Range input |
| Snackbar | `lt-snackbar` | Toast notifications |
| Spinner | `lt-spinner` | Loading indicator |
| Surface | `lt-surface` | Styled container |
| Switch | `lt-switch` | Toggle input |
| Tab / TabGroup | `lt-tab` / `lt-tab-group` | Tabbed navigation |
| Table | `lt-table` | Data table |
| Text | `lt-text` | Typographic element |
| Textfield | `lt-textfield` | Text input |
| Tooltip | `lt-tooltip` | Hover tooltip |

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

See [@latty/icons](../icons/README.md) for the full icon reference.

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
import type { Button } from '@latty/web';
```

The `custom-elements.json` manifest (at the package root) is compatible with VS Code's custom data format for HTML IntelliSense.

## License

MIT
