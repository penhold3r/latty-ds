# @latty/icons

Icon system for the Latty Design System with Iconoir as the default icon library.

## Features

- 🎨 **Customizable** - Register custom icons or override defaults
- 📦 **Framework-agnostic** - Works with any framework via Web Components
- 🎯 **Token-based** - Consistent with design system patterns
- 🚀 **Lazy-loadable** - Only bundle what you use
- 🎭 **Iconoir default** - 30+ common icons pre-registered

## Installation

```bash
pnpm add @latty/icons
```

## Basic Usage

### Using the Icon Component

```html
<lt-icon name="check" size="md"></lt-icon>
<lt-icon name="arrow-right" size="lg"></lt-icon>
<lt-icon name="search" size="sm"></lt-icon>
```

### Sizes

- `xs` - 12px
- `sm` - 16px
- `md` - 20px (default)
- `lg` - 24px
- `xl` - 32px

### Colors

Icons inherit `currentColor`, so you can style them with CSS:

```html
<lt-icon name="check" style="color: var(--lt-color-success-500)"></lt-icon>
<lt-icon name="warning-triangle" style="color: var(--lt-color-warning-500)"></lt-icon>
```

## Pre-registered Icons

The following icons are available by default:

**Navigation:**
- `arrow-left`, `arrow-right`, `arrow-up`, `arrow-down`
- `nav-arrow-left`, `nav-arrow-right`

**Actions:**
- `check`, `xmark`, `plus`, `minus`
- `edit`, `trash`, `save`
- `download`, `upload`

**UI Elements:**
- `search`, `menu`, `settings`, `home`, `user`, `bell`

**Status:**
- `info-circle`, `warning-triangle`, `check-circle`, `xmark-circle`

**Media:**
- `eye`, `eye-off`, `heart`, `star`

## Custom Icons

### Register a Single Icon

```typescript
import { iconRegistry } from '@latty/icons';

iconRegistry.registerIcon('my-icon', '<svg>...</svg>');
```

### Register Multiple Icons

```typescript
import { iconRegistry } from '@latty/icons';

iconRegistry.registerIcons({
  'custom-1': '<svg>...</svg>',
  'custom-2': '<svg>...</svg>',
});
```

### Override Default Icons

Custom icons take precedence over provider icons:

```typescript
// Override the default 'check' icon
iconRegistry.registerIcon('check', '<svg><!-- Your custom check --></svg>');
```

## Creating Custom Providers

You can create your own icon provider:

```typescript
import { iconRegistry } from '@latty/icons';
import type { IconProvider } from '@latty/icons';

class CustomProvider implements IconProvider {
  name = 'custom';
  private icons = new Map<string, string>();

  constructor() {
    // Load your icons
    this.icons.set('icon-1', '<svg>...</svg>');
  }

  getIcon(name: string): string | undefined {
    return this.icons.get(name);
  }

  getAllIcons(): Map<string, string> {
    return new Map(this.icons);
  }
}

const customProvider = new CustomProvider();
iconRegistry.registerProvider(customProvider, true); // true = default
```

## Using with Components

Icons integrate seamlessly with button and textfield components:

```html
<!-- Button with icon -->
<lt-button icon="check">Save</lt-button>
<lt-button icon-end="arrow-right">Next</lt-button>
<lt-button icon="arrow-left" icon-end="arrow-right">Both</lt-button>

<!-- Textfield with icons -->
<lt-textfield icon-start="search" placeholder="Search..."></lt-textfield>
<lt-textfield icon-start="user" placeholder="Email" type="email"></lt-textfield>
<lt-textfield icon-end="eye" placeholder="Password" type="password"></lt-textfield>
```

## API Reference

### iconRegistry

**Methods:**

- `registerProvider(provider, isDefault?)` - Register an icon provider
- `registerIcon(name, svg)` - Register a single icon
- `registerIcons(icons)` - Register multiple icons
- `getIcon(name)` - Get an icon SVG by name
- `hasIcon(name)` - Check if an icon exists
- `getAvailableIcons()` - Get all available icon names
- `setDefaultProvider(name)` - Change the default provider
- `clearCustomIcons()` - Remove all custom icons
- `reset()` - Reset the entire registry

### IconProvider Interface

```typescript
interface IconProvider {
  name: string;
  getIcon(name: string): string | undefined;
  getAllIcons(): Map<string, string>;
}
```

## License

MIT
