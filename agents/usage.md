# Usage

## Vanilla HTML

No build tool required:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <link rel="stylesheet" href="node_modules/@latty-ds/tokens/dist/tokens.css" />
    <link rel="stylesheet" href="node_modules/@latty-ds/tokens/dist/semantic.css" />
  </head>
  <body>
    <lt-button variant="primary" icon-start="save">Save changes</lt-button>

    <script type="module">
      import '@latty-ds/web';
    </script>
  </body>
</html>
```

## With a bundler (Vite, webpack, etc.)

```js
// entry.js
import '@latty-ds/tokens/tokens.css';
import '@latty-ds/tokens/semantic.css';
import '@latty-ds/web';
```

```html
<lt-button variant="primary">Click me</lt-button>

<lt-textfield label="Email address" type="email" required helper-text="We'll never share your email"></lt-textfield>
```

## React

Use `@latty-ds/react` for typed props and idiomatic React event names:

```tsx
import { Button, Textfield } from '@latty-ds/react';

export function Example() {
  return (
    <Button variant="primary" iconStart="save" onClick={() => console.log('saved')}>
      Save changes
    </Button>
  );
}
```

### Without the React wrapper

Using `lt-*` elements directly in React without `@latty-ds/react` requires attaching event listeners via `ref` — React's synthetic event system does not handle custom DOM events:

```tsx
import { useRef, useEffect } from 'react';

function EmailField() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = (e: Event) => console.log((e as CustomEvent).detail.value);
    el.addEventListener('change', handler);
    return () => el.removeEventListener('change', handler);
  }, []);

  return <lt-textfield ref={ref} label="Email" type="email" />;
}
```

### React Server Components

Custom elements run in the browser — they cannot be used inside React Server Components. In Next.js App Router, any file that renders Latty components must be marked `'use client'`:

```tsx
'use client';

import { Button, Dialog } from '@latty-ds/react';

export function ConfirmDialog({ onConfirm }: { onConfirm: () => void }) {
  return (
    <Dialog title="Are you sure?">
      <Button slot="footer" variant="danger" onClick={onConfirm}>
        Delete
      </Button>
    </Dialog>
  );
}
```

## Vue

Vue 3 supports Web Components natively. Add one-time config in the app entry:

```ts
// main.ts
import { createApp } from 'vue';
import '@latty-ds/tokens/tokens.css';
import '@latty-ds/tokens/semantic.css';
import '@latty-ds/web';
import App from './App.vue';

const app = createApp(App);
app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith('lt-');
app.mount('#app');
```

Use `@event` for listeners and `:prop` for reactive bindings in templates:

```vue
<script setup lang="ts">
function save() {
  /* ... */
}
function onEmail(e: Event) {
  console.log((e as CustomEvent).detail.value);
}
</script>

<template>
  <lt-button variant="primary" @click="save">Save changes</lt-button>
  <lt-textfield label="Email" type="email" @change="onEmail"></lt-textfield>
</template>
```

## Svelte

Web Components work natively in Svelte. Import tokens and components in the root layout:

```svelte
<!-- +layout.svelte -->
<script>
  import '@latty-ds/tokens/tokens.css';
  import '@latty-ds/tokens/semantic.css';
  import '@latty-ds/web';
</script>

<slot />
```

```svelte
<script>
  let value = '';
</script>

<lt-textfield label="Name" bind:value></lt-textfield>
<lt-button variant="primary" on:click={() => console.log(value)}>Submit</lt-button>
```

## Slots

Components use standard HTML slots to accept content. Content placed directly inside an element goes into its default slot. Content with a `slot="name"` attribute targets a specific named region.

The most common named slot is `trigger` on `lt-dropdown` — any element placed there becomes the anchor that opens the menu:

```html
<lt-dropdown>
  <lt-icon-button slot="trigger" name="more-horiz" label="Options"></lt-icon-button>
  <lt-dropdown-item>Edit</lt-dropdown-item>
  <lt-dropdown-item>Delete</lt-dropdown-item>
</lt-dropdown>
```

`lt-dialog` uses named slots to place content in distinct regions of the overlay:

```html
<lt-dialog id="confirm-dialog" title="Delete item">
  Are you sure you want to permanently delete this item?
  <div slot="footer">
    <lt-button appearance="outlined" id="cancel-btn">Cancel</lt-button>
    <lt-button variant="danger" id="confirm-btn">Delete</lt-button>
  </div>
</lt-dialog>
```

Components that expose slots list them in `custom-elements.json`. Omitting a named slot usually hides that region entirely — e.g. omitting `slot="footer"` on a dialog removes the footer bar.

## Compound components

Some components are parent/child pairs. The parent manages shared state; child elements are slotted in as its content.

**Tabs** — `lt-tab-group` owns the active tab state via its `value` prop. Each `lt-tab` declares its own value, and panel content is slotted with a matching `data-value`:

```html
<lt-tab-group value="profile">
  <lt-tab label="Profile" value="profile" icon-start="user"></lt-tab>
  <lt-tab label="Settings" value="settings" icon-start="settings"></lt-tab>
  <lt-tab label="Billing" value="billing" icon-start="credit-card"></lt-tab>

  <div slot="panel" data-value="profile">Profile content here</div>
  <div slot="panel" data-value="settings">Settings content here</div>
  <div slot="panel" data-value="billing">Billing content here</div>
</lt-tab-group>

<script type="module">
  document.querySelector('lt-tab-group').addEventListener('change', (e) => {
    console.log('active tab:', e.detail.value);
  });
</script>
```

**Navigation** — `lt-nav-item` elements can be nested to create collapsible groups. In vertical mode they expand inline; in horizontal mode they open as a dropdown panel:

```html
<lt-nav>
  <lt-nav-item href="/dashboard" label="Dashboard" icon-start="home" active></lt-nav-item>
  <lt-nav-item label="Settings" icon-start="settings">
    <lt-nav-item href="/settings/profile" label="Profile"></lt-nav-item>
    <lt-nav-item href="/settings/security" label="Security"></lt-nav-item>
  </lt-nav-item>
</lt-nav>
```

## Events

Components dispatch standard DOM events — no custom prefix. Interactive components carry data in `e.detail`:

```js
// Text inputs — e.detail.value is the current string value
document.querySelector('lt-textfield').addEventListener('change', (e) => {
  console.log(e.detail.value); // string
});

// Select — e.detail.value is the selected option's value
document.querySelector('lt-select').addEventListener('change', (e) => {
  console.log(e.detail.value); // string
});

// Checkbox — e.detail.checked is the boolean state
document.querySelector('lt-checkbox').addEventListener('change', (e) => {
  console.log(e.detail.checked); // boolean
});

// Tab group — e.detail.value is the newly active tab's value
document.querySelector('lt-tab-group').addEventListener('change', (e) => {
  console.log(e.detail.value); // string
});

// Dropdown — e.detail.item is the selected lt-dropdown-item element
document.querySelector('lt-dropdown').addEventListener('select', (e) => {
  console.log(e.detail.item.textContent);
});

// Overlays — open and close carry no detail
document.querySelector('lt-dialog').addEventListener('open', () => {});
document.querySelector('lt-dialog').addEventListener('close', () => {});
```

## Attributes vs properties

HTML attributes are always strings — they can represent text, boolean presence, and simple enumerations. For anything richer (arrays, objects, render functions), set the JavaScript property directly:

```html
<!-- Attributes — strings and booleans -->
<lt-button variant="primary" size="md">Save</lt-button>

<!-- Boolean: presence = true, absence = false -->
<lt-button disabled>Can't click</lt-button>
<lt-textfield required label="Email"></lt-textfield>
```

```js
// Properties — rich data
const table = document.querySelector('lt-table');

// Arrays and objects must be set as JS properties, not attributes
table.columns = [
  { key: 'name', label: 'Name' },
  {
    key: 'role',
    label: 'Role',
    render: (v) => {
      const badge = document.createElement('lt-badge');
      badge.textContent = v;
      return badge;
    }
  }
];
table.data = [
  { name: 'Alice', role: 'Admin' },
  { name: 'Bob', role: 'Member' }
];
```

A common gotcha: `element.setAttribute('disabled', false)` does not disable the boolean — the attribute is still present regardless of its string value. Use `element.removeAttribute('disabled')` to clear it, or set the property: `element.disabled = false`.

## Forms

`lt-button` participates in native HTML form submission — a button with `type="submit"` inside a `<form>` triggers the form's submit event as expected. Input components (`lt-textfield`, `lt-select`, `lt-checkbox`, etc.) do not submit their values natively. Read them via events or the element's `value` property on submit:

```html
<form id="signup-form">
  <lt-textfield name="email" label="Email" type="email" required></lt-textfield>
  <lt-select id="role-select" label="Role"></lt-select>
  <lt-button type="submit" variant="primary">Sign up</lt-button>
</form>

<script type="module">
  import '@latty-ds/web';

  const roleSelect = document.getElementById('role-select');
  roleSelect.options = [
    { value: 'admin', label: 'Admin' },
    { value: 'member', label: 'Member' }
  ];

  document.getElementById('signup-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('lt-textfield[name="email"]').value;
    const role = roleSelect.value;
    console.log({ email, role });
  });
</script>
```

## Next

- [`theming.md`](./theming.md) — customize tokens to match your brand
- [`components.md`](./components.md) — explore the full component catalog
- [`decision-guide.md`](./decision-guide.md) — pick the right component for a task
