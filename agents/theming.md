# Theming

Latty's theme engine generates a full color palette from a single base color, giving consistent light and dark modes without hand-crafting every shade.

## Changing the brand color

Use `configure()` from `@latty-ds/tokens/configure`. Call it once at the app's entry point, before any components render:

```ts
import { configure } from '@latty-ds/tokens/configure';

configure({
  colors: { primary: '#6366f1', secondary: '#f59e0b' },
  font: { family: 'Inter, sans-serif' },
  border: { radius: '0.375rem', width: 'medium' }
});
```

`configure()` generates the full token palette from the base colors and injects them as a `<style id="lt-tokens">` element into `<head>`. Calling it again replaces the previous values. All options are optional — omit any key to keep the default.

### Border width

`border.width` sets the outline weight of control chrome across the system — outlined buttons, inputs, chips, badges, cards, and popover panels. Accepts three named presets — `'thin'` (1px, default), `'medium'` (2px), `'thick'` (4px) — or any CSS length (e.g. `'1.5px'`). Separators (dividers, table rules), focus outlines, and checkbox/radio borders keep their fixed widths by design. Chips and badges cap at `'medium'` even when the theme requests `'thick'` — at their small pill heights, a 4px border reads as compressed rather than bold.

```ts
configure({ border: { width: 'thick' } }); // bold, brutalist outlines
configure({ border: { width: '1.5px' } }); // raw CSS lengths pass through
```

### Loading a font from a CDN

`font.family` also accepts a Google Fonts CSS2 stylesheet URL instead of a plain CSS value — `configure()` `@import`s it and derives the family name from the URL's `family=` query param, so there's no separate `<link>` tag to add:

```ts
configure({
  font: {
    family: 'https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,100..900;1,100..900&display=swap'
  }
});
```

This works with `createStyleSheet()` too — the `@import` is written as the first line of the returned string, so it stays valid CSS once dropped into a `<style>` tag. Auto-detection only covers `fonts.googleapis.com` URLs; for other font CDNs, load the stylesheet separately and pass the resulting family name as a plain `font.family` value instead.

A bare URL string always falls back to the generic `sans-serif` family if the font itself fails to load. For a font that isn't sans-serif (a serif display font, a monospace font, etc.), pass a `{ url, fallback }` object instead so the safety-net fallback matches:

```ts
configure({
  font: {
    family: {
      url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700&display=swap',
      fallback: 'serif'
    }
  }
});
```

`fallback` accepts any standard CSS generic family: `'sans-serif'` (default), `'serif'`, `'monospace'`, `'cursive'`, `'fantasy'`, `'system-ui'`.

### Loading multiple fonts

`font.family` also accepts an array of entries — each a plain value, a URL string, or a `{ url, fallback }` object — resolved independently and mapped to its own token in order, rather than being combined into one CSS fallback stack: `--lt-typography-fontFamilyPrimary`, `--lt-typography-fontFamilySecondary`, `--lt-typography-fontFamilyTertiary`, and so on. This lets you use a heading font and a body font (or any other combination) independently in your own CSS:

```ts
configure({
  font: {
    family: [
      'https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,100..900&display=swap',
      'Georgia, serif'
    ]
  }
});
```

```css
h1,
h2,
h3 {
  font-family: var(--lt-typography-fontFamilySecondary);
}
```

### SSR

For server-side rendering use `createStyleSheet()`, which returns the CSS string instead of touching the DOM:

```ts
import { createStyleSheet } from '@latty-ds/tokens/configure';

const css = createStyleSheet({ colors: { primary: '#6366f1' } });
// inject `css` into a <style> tag in the server-rendered HTML
```

## CSS overrides

Override individual tokens directly in a stylesheet for one-off adjustments or scoped changes:

```css
:root {
  --lt-border-radius: 2px; /* sharper corners globally */
  --lt-border-width: 2px; /* heavier control outlines */
  --lt-typography-fontFamilyPrimary: 'Inter', sans-serif; /* swap font */
}

/* Scoped to a section of the page */
.sidebar {
  --lt-color-neutral-50: #f8f8ff;
  --lt-color-neutral-100: #f0f0f8;
}

/* Spacing tokens — only overridable this way, not via configure() */
:root {
  --lt-spacing-4: 1.25rem; /* default: 1rem */
}
```

`--lt-typography-fontFamilyPrimary` is case-sensitive — `--lt-typography-fontfamilyprimary` silently does nothing.

## Component-level overrides

Every component exposes CSS custom properties — named `--lt-[component]-[property]` — that let it adapt to a specific context. Set them on the element or any ancestor:

```css
/* All icon buttons in the header get a light colour */
.site-header {
  --lt-icon-button-color: white;
  --lt-icon-button-hover-bg: rgba(255, 255, 255, 0.15);
}

/* A single progress bar with a custom fill colour */
.upload-progress {
  --lt-progress-color: #8b5cf6;
  --lt-progress-track-color: #ede9fe;
}
```

Because CSS custom properties inherit through shadow DOM, this works with a plain class name — no `::part()` selector needed. The full list of props for each component is in `custom-elements.json`.

## Theme switching

Pass `theme: 'system'` to `configure()` to generate light, dark, and `prefers-color-scheme` layers in one call:

```ts
configure({
  theme: 'system',
  colors: { primary: '#6366f1' }
});
```

With that in place, toggling themes at runtime requires no further calls to `configure()` — just set a `data-theme` attribute on `<html>`:

```ts
// Follow the OS preference (remove any previous override)
document.documentElement.removeAttribute('data-theme');

// Force light
document.documentElement.setAttribute('data-theme', 'light');

// Force dark
document.documentElement.setAttribute('data-theme', 'dark');
```

### Persisting the user's choice

```ts
function setTheme(theme: 'light' | 'dark' | 'system') {
  if (theme === 'system') {
    document.documentElement.removeAttribute('data-theme');
    localStorage.removeItem('lt-theme');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('lt-theme', theme);
  }
}
```

Restore the saved theme before first paint by placing a synchronous script at the top of `<head>`:

```html
<script>
  const saved = localStorage.getItem('lt-theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
</script>
```

## Framework notes

**Vanilla JS / Vite / webpack** — call `configure()` in the entry file. No other setup is required.

**React (CSR)** — call `configure()` at the top of `main.tsx`, before `ReactDOM.createRoot`:

```tsx
// main.tsx
import { configure } from '@latty-ds/tokens/configure';
configure({ colors: { primary: '#6366f1' }, theme: 'system' });

import { createRoot } from 'react-dom/client';
import App from './App';
createRoot(document.getElementById('root')!).render(<App />);
```

**React SSR (Next.js App Router, Remix)** — `configure()` touches `document` and must not run on the server. Use `createStyleSheet()` in the root layout to inject tokens at render time:

```tsx
// app/layout.tsx
import { createStyleSheet } from '@latty-ds/tokens/configure';

export default function RootLayout({ children }) {
  const tokenCss = createStyleSheet({ colors: { primary: '#6366f1' }, theme: 'system' });
  return (
    <html lang="en">
      <head>
        <style id="lt-tokens" dangerouslySetInnerHTML={{ __html: tokenCss }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

Tokens are inlined server-side so there is no flash. Theme toggling with `data-theme` still works client-side as described above.
