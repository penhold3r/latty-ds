# Composition patterns

Real multi-component recipes, condensed from the docs site's recipe gallery. Each shows idiomatic composition — which components pair together and how.

## Login form

`lt-surface` (container) + `lt-textfield` × 2 + `lt-checkbox` + `lt-button` + `lt-link` + `lt-divider`:

```html
<lt-surface appearance="outlined" elevation="1" style="max-width: 360px; border-radius: 12px;">
  <div style="padding: var(--lt-spacing-8); display: flex; flex-direction: column; gap: var(--lt-spacing-4);">
    <div style="text-align: center;">
      <lt-text variant="h4">Welcome back</lt-text>
      <lt-text variant="body-sm" style="color: var(--lt-text-subtle);">Sign in to your account</lt-text>
    </div>
    <lt-textfield label="Email" type="email" placeholder="you@example.com"></lt-textfield>
    <lt-textfield label="Password" type="password" placeholder="••••••••"></lt-textfield>
    <div style="display: flex; align-items: center; justify-content: space-between;">
      <lt-checkbox label="Remember me"></lt-checkbox>
      <lt-link href="/auth/reset">Forgot password?</lt-link>
    </div>
    <lt-button variant="primary" full-width>Sign in</lt-button>
    <lt-divider></lt-divider>
    <lt-text variant="body-sm" style="text-align: center; color: var(--lt-text-subtle);">
      Don't have an account? <lt-link href="/auth/register">Sign up</lt-link>
    </lt-text>
  </div>
</lt-surface>
```

Note this is presentational markup only — wire up the actual submit handling per [`usage.md`](./usage.md)'s Forms section (wrap in a `<form>`, read `.value` off each field on submit).

## Profile card

`lt-surface` + `lt-avatar` + `lt-text` + `lt-chip` (repeated for tags) + `lt-divider` + `lt-button`:

```html
<lt-surface appearance="outlined" elevation="0" style="max-width: 280px;">
  <div
    style="padding: var(--lt-spacing-6); display: flex; flex-direction: column; align-items: center; text-align: center; gap: var(--lt-spacing-3);"
  >
    <lt-avatar src="https://example.com/avatar.jpg" size="xl"></lt-avatar>
    <div>
      <lt-text variant="h5">Alex Morgan</lt-text>
      <lt-text variant="body-sm" style="color: var(--lt-text-subtle);">Senior Product Designer</lt-text>
    </div>
    <div style="display: flex; flex-wrap: wrap; gap: var(--lt-spacing-2); justify-content: center;">
      <lt-chip>Figma</lt-chip>
      <lt-chip>Design Tokens</lt-chip>
      <lt-chip>Web Components</lt-chip>
    </div>
    <lt-divider style="width: 100%;"></lt-divider>
    <div style="display: flex; gap: var(--lt-spacing-2);">
      <lt-button variant="primary" size="sm">Follow</lt-button>
      <lt-button variant="neutral" appearance="outlined" size="sm" icon-start="mail">Message</lt-button>
    </div>
  </div>
</lt-surface>
```

## Empty state

Plain container (no `lt-surface` needed — this is a full-width state, not a card) + icon badge + `lt-text` + `lt-button` + `lt-link`:

```html
<div
  style="display: flex; flex-direction: column; align-items: center; text-align: center; padding: var(--lt-spacing-10) var(--lt-spacing-8); max-width: 380px;"
>
  <div
    style="width: 72px; height: 72px; border-radius: 50%; background: var(--lt-color-primary-50); display: flex; align-items: center; justify-content: center; margin-bottom: var(--lt-spacing-5);"
  >
    <lt-icon name="folder" size="lg" style="color: var(--lt-color-primary-500);"></lt-icon>
  </div>
  <lt-text variant="h4" style="margin-bottom: var(--lt-spacing-2);">No items yet</lt-text>
  <lt-text variant="body" style="color: var(--lt-text-subtle); margin-bottom: var(--lt-spacing-6);">
    Get started by creating your first item. It only takes a few seconds.
  </lt-text>
  <lt-button variant="primary" icon-start="plus">Create item</lt-button>
  <lt-link href="#" style="margin-top: var(--lt-spacing-3); display: block;">Learn more →</lt-link>
</div>
```

## General patterns worth noting

- **Cards/panels almost always start with `lt-surface`** for background, elevation, and border-radius — avoid hand-rolling that CSS on a plain `<div>`.
- **Spacing uses token custom properties** (`var(--lt-spacing-4)`, etc.) rather than hardcoded pixel values, so layouts stay consistent with the rest of the theme and respond to `configure()` overrides.
- **Muted/secondary text** uses `color: var(--lt-text-subtle)` (or the `text-muted` utility class on the docs site) rather than a hardcoded gray.
- **React equivalents**: every tag maps 1:1 to a `@latty-ds/react` component with the same name in PascalCase and camelCase props (`full-width` → `fullWidth`, `icon-start` → `iconStart`). See [`installation.md`](./installation.md) and [`usage.md`](./usage.md) for the wrapper setup.
