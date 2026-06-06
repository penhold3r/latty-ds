# @latty-ds/icons

Icon system for the Latty Design System. Ships a curated set of pre-registered icons from [Iconoir](https://iconoir.com) and a pluggable provider registry for adding your own.

See the [icon gallery](https://penhold3r.github.io/latty-ds/) in the docs for the full list of available icons.

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

`xs` (12px) · `sm` (16px) · `md` (20px, default) · `lg` (24px) · `xl` (32px)

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

Custom icons take priority over provider icons, so you can override any default:

```typescript
iconRegistry.registerIcon('check', '<svg><!-- your custom check --></svg>');
```

## Custom providers

```typescript
import { iconRegistry } from '@latty-ds/icons';
import type { IconProvider } from '@latty-ds/icons';

class MyProvider implements IconProvider {
  name = 'my-provider';
  private icons = new Map([['icon-1', '<svg>...</svg>']]);

  getIcon(name: string) {
    return this.icons.get(name);
  }

  getAllIcons() {
    return new Map(this.icons);
  }
}

iconRegistry.registerProvider(new MyProvider());
```

## Using icons inside components

Components that accept icons use `icon` / `icon-end` / `icon-start` props:

```html
<lt-button icon="save">Save</lt-button>
<lt-button icon-end="arrow-right">Next</lt-button>
<lt-textfield icon-start="search" placeholder="Search…"></lt-textfield>
```

## API reference

### `iconRegistry`

| Method                                   | Description                             |
| ---------------------------------------- | --------------------------------------- |
| `registerProvider(provider, isDefault?)` | Register an icon provider               |
| `registerIcon(name, svg)`                | Register a single icon                  |
| `registerIcons(icons)`                   | Register multiple icons                 |
| `getIcon(name)`                          | Get an icon SVG string by name          |
| `hasIcon(name)`                          | Check if an icon is registered          |
| `getAvailableIcons()`                    | Get all registered icon names           |
| `setDefaultProvider(name)`               | Change the active default provider      |
| `clearCustomIcons()`                     | Remove all manually registered icons    |
| `reset()`                                | Reset the registry to its initial state |

### `IconProvider` interface

```typescript
interface IconProvider {
  name: string;
  getIcon(name: string): string | undefined;
  getAllIcons(): Map<string, string>;
}
```

## License

MIT
