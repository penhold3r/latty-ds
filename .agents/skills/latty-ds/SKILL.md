---
name: latty-ds
description: >-
  Build, style, and integrate web applications using the Latty Design System (@latty-ds/*).
  Use this skill whenever creating or modifying UI using Latty Web Components (lt-* custom elements),
  using @latty-ds/react wrappers, configuring design tokens and themes with configure() or createStyleSheet(),
  selecting appropriate Latty components, or composing multi-component layouts and forms.
---

# Latty Design System Skill

Latty is a framework-agnostic design system built on **design tokens first** and **Lit-based Web Components**. All components share a unified prop vocabulary, consume `--lt-*` CSS custom properties, and can be themed dynamically at runtime or build time.

---

## Quick Reference & Progressive Disclosure

The complete consumer agent context pack is maintained at [`agents/`](../../../agents/README.md). Load these detailed reference files when working on specific areas:

| Task                                         | Reference File                                           |
| -------------------------------------------- | -------------------------------------------------------- |
| Installing packages, stylesheets, setup      | [`installation.md`](../../../agents/installation.md)     |
| Framework usage (HTML, React, Vue, Svelte)   | [`usage.md`](../../../agents/usage.md)                   |
| Theming, brand colors, typography, dark mode | [`theming.md`](../../../agents/theming.md)               |
| Component catalog & shared prop vocabulary   | [`components.md`](../../../agents/components.md)         |
| UI intent / which component to pick          | [`decision-guide.md`](../../../agents/decision-guide.md) |
| Real multi-component composition recipes     | [`patterns.md`](../../../agents/patterns.md)             |

Authoritative runtime references:

- Component props, slots, CSS parts, events: `node_modules/@latty-ds/web/custom-elements.json`
- Design tokens: `node_modules/@latty-ds/tokens/dist/tokens.json` & `tokens.css`

---

## Core Mandates & Rules

1. **Tokens First, Components Second**:
   - Custom styling must consume `--lt-*` CSS variables (e.g. `var(--lt-spacing-4)`, `var(--lt-text-subtle)`, `var(--lt-border-radius)`).
   - Never hardcode raw hex colors or fixed layout pixel paddings when a token exists.
2. **Naming Conventions**:
   - npm scope: `@latty-ds/*` (`@latty-ds/tokens`, `@latty-ds/web`, `@latty-ds/react`, `@latty-ds/icons`)
   - Custom element prefix: `lt-*` (e.g. `lt-button`, `lt-textfield`, `lt-dialog`)
   - CSS variables prefix: `--lt-*`
3. **Semantic Variant Vocabulary**:
   - Standard variants: `primary`, `secondary`, `neutral`, `success`, `warning`, `error`, `info`, `default`.
   - **CRITICAL**: Use `variant="error"` for destructive actions (e.g. Delete). `danger` does **not** exist in Latty.
4. **Boolean Attributes**:
   - Custom elements adhere to standard HTML boolean attribute semantics: **presence = true**, **absence = false**.
   - Never set `element.setAttribute('disabled', 'false')` (this disables it because the attribute is present). Use `element.removeAttribute('disabled')` or `element.disabled = false`.
5. **Accessibility**:
   - Always supply an accessible `label` prop to icon-only controls: `<lt-icon-button icon="trash" label="Delete item"></lt-icon-button>`.

---

## Quick Start Recipes

### 1. Baseline Installation & Imports

```bash
pnpm add @latty-ds/tokens @latty-ds/web
# optional: pnpm add @latty-ds/react @latty-ds/icons
```

In entry point:

```ts
import '@latty-ds/tokens/tokens.css';
import '@latty-ds/tokens/semantic.css';
import '@latty-ds/web'; // registers all lt-* custom elements
```

### 2. Vanilla / Web Component Usage

```html
<!-- Form controls -->
<lt-surface appearance="outlined" elevation="1">
  <lt-textfield label="Email" type="email" placeholder="name@example.com" required></lt-textfield>
  <lt-button variant="primary" type="submit">Sign In</lt-button>
  <lt-button variant="error" appearance="ghost">Cancel</lt-button>
</lt-surface>
```

### 3. React Usage

```tsx
'use client'; // Required in Next.js App Router — custom elements run client-side

import { Button, Textfield, Dialog } from '@latty-ds/react';
import { useState } from 'react';

export function DeleteConfirmation({ onConfirm }: { onConfirm: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="error" onClick={() => setOpen(true)}>
        Delete Item
      </Button>
      <Dialog open={open} heading="Confirm Deletion" onClose={() => setOpen(false)}>
        Are you sure? This action cannot be undone.
        <div slot="footer">
          <Button appearance="outlined" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="error" onClick={onConfirm}>
            Confirm Delete
          </Button>
        </div>
      </Dialog>
    </>
  );
}
```

### 4. Theming at Runtime (`configure()`)

```ts
import { configure } from '@latty-ds/tokens/configure';

configure({
  colors: {
    primary: '#6366f1',
    secondary: '#ec4899'
  },
  font: {
    family: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
    heading: {
      url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap',
      fallback: 'serif'
    }
  },
  border: {
    radius: '0.5rem',
    width: 'medium',
    contrast: 'default' // or 'high'
  },
  elevation: 'none', // flatten shadows for a brutalist / flat theme
  theme: 'system' // supports 'light', 'dark', or 'system' with [data-theme] overrides
});
```

For Server-Side Rendering (Next.js, Remix):
Use `createStyleSheet()` from `@latty-ds/tokens/configure` and inject it into `<head>` inside `<style id="lt-tokens">`.

---

## Critical Gotchas & Best Practices

| Gotcha                      | Correct Pattern                                           | Incorrect / Stale Pattern                          |
| --------------------------- | --------------------------------------------------------- | -------------------------------------------------- |
| **Destructive variant**     | `variant="error"`                                         | `variant="danger"` ❌ (does not exist)             |
| **Icon button icon prop**   | `<lt-icon-button icon="search" label="Search">`           | `<lt-icon-button name="search">` ❌ (ignores prop) |
| **Standalone icon element** | `<lt-icon name="folder"></lt-icon>`                       | `<lt-icon-button>` without a label ❌              |
| **Compound tab panels**     | `<lt-tab-panel slot="panel" value="profile">`             | unslotted tab contents ❌                          |
| **Dropdown trigger slot**   | `<lt-icon-button slot="trigger" icon="more">`             | trigger without `slot="trigger"` ❌                |
| **Form submission**         | Read `.value` off input elements in submit event listener | Assuming inputs submit natively via FormData ❌    |
| **React Server Components** | Mark component with `'use client'`                        | Rendering Web Components in server components ❌   |
| **Full width buttons**      | `full-width` attribute (`fullWidth` in React)             | Hand-crafted `width: 100%` on host ❌              |
| **Cards & panels**          | `<lt-surface appearance="outlined">`                      | Hand-rolled `<div>` with border & shadow ❌        |

---

## Common Component Pairings

- **Cards / Containers**: `lt-surface` + `lt-text` + `lt-divider` + `lt-button`
- **Dialogs**: `lt-dialog` (heading attribute + body + `slot="footer"` action buttons)
- **Menu Dropdowns**: `lt-dropdown` (`slot="trigger"` + `lt-dropdown-item` children)
- **Tabs**: `lt-tab-group` (`lt-tab` headers + `lt-tab-panel slot="panel"` bodies)
- **Sidebar Nav**: `lt-nav` + `lt-nav-item` (supports nested sub-items)
- **Form Groups**: `<form>` + `lt-textfield` / `lt-select` / `lt-checkbox` + `lt-button type="submit"`
