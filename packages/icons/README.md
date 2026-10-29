# @latty-ds/icons

Icon system for the Latty Design System. Ships 200 curated icons across 16 categories and a pluggable registry for adding your own.

See the [icon gallery](https://latty-ds.com/icons/introduction) in the docs for the full list of available icons.

## Installation

```bash
pnpm add @latty-ds/icons
```

## Basic usage

```html
<lt-icon name="check"></lt-icon>
<lt-icon name="arrow-right" size="lg"></lt-icon>
<lt-icon name="search" size="sm"></lt-icon>
```

Icons inherit `currentColor`, so color them with CSS:

```html
<lt-icon name="check" style="color: var(--lt-color-success-500)"></lt-icon>
```

### Sizes

`xs` (12px) · `sm` (16px) · `md` (20px, default) · `lg` (24px) · `xl` (32px) · `inherit` (1em, scales with surrounding text)

### Accessibility

Icons are **decorative by default** (`aria-hidden="true"`). When an icon conveys meaning on its own (not inside a labelled button or link), set `label`:

```html
<!-- Decorative (default) — hidden from screen readers -->
<lt-icon name="search"></lt-icon>

<!-- Informative — announced as "Warning" -->
<lt-icon name="warning-triangle" label="Warning"></lt-icon>
```

## Registering custom icons

```typescript
import { iconRegistry } from '@latty-ds/icons';

// Single icon
iconRegistry.registerIcon('my-icon', '<svg>...</svg>');

// Multiple at once
iconRegistry.registerIcons({
  'icon-a': '<svg>...</svg>',
  'icon-b': '<svg>...</svg>'
});
```

Custom icons override any built-in with the same name:

```typescript
iconRegistry.registerIcon('check', '<svg><!-- your custom check --></svg>');
```

> **Security note:** SVG strings are rendered as-is via Lit's `unsafeSVG`. Never pass untrusted or user-provided SVG to `registerIcon`.

## Tree-shaking

Importing the main entry (`@latty-ds/icons`) registers all 200 icons. For smaller bundles, import only what you need:

```typescript
import '@latty-ds/icons/search';
import '@latty-ds/icons/check';
```

Each per-icon entry registers that icon and defines the `lt-icon` custom element — no other import needed.

## Using icons inside components

Components that accept icons use `icon` / `icon-end` / `icon-start` props:

```html
<lt-button icon="save">Save</lt-button>
<lt-button icon-end="arrow-right">Next</lt-button>
<lt-textfield icon-start="search" placeholder="Search…"></lt-textfield>
```

## API reference

### `lt-icon` element

| Property | Attribute | Type            | Default | Description                                                    |
| -------- | --------- | --------------- | ------- | -------------------------------------------------------------- |
| `name`   | `name`    | `LattyIconName` | `''`    | Icon name from the registry                                    |
| `size`   | `size`    | `IconSize`      | `'md'`  | Icon size                                                      |
| `label`  | `label`   | `string`        | `''`    | Accessible label; when set, icon is informative (`role="img"`) |

CSS custom property: `--lt-icon-size` overrides the `size` attribute.

### `iconRegistry`

| Method                    | Description                                               |
| ------------------------- | --------------------------------------------------------- |
| `registerIcon(name, svg)` | Register a single icon                                    |
| `registerIcons(icons)`    | Register multiple icons at once                           |
| `getIcon(name)`           | Get an icon's SVG string                                  |
| `hasIcon(name)`           | Check if an icon is registered                            |
| `getAvailableIcons()`     | Get all registered icon names (sorted)                    |
| `subscribe(listener)`     | Listen for registry changes; returns unsubscribe function |
| `reset()`                 | Clear all icons from the registry                         |

## License

MIT
