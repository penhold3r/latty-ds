# CSS Custom Properties — Component Customization Plan

## Problem

Shadow DOM encapsulates styles. Class names applied from outside don't penetrate it, so
consumers who need to adapt a component to a non-standard context (e.g. a white icon button
on a primary-coloured header) must use `::part()`. That selector has two problems:

1. **Not intuitive** — every developer expects class names to work.
2. **Specificity footgun** — `::part()` overrides shadow-DOM styles unconditionally, so it
   can accidentally clobber component variants (e.g. we killed `round` by setting
   `border-radius` via `::part(base)`).

## Solution

CSS custom properties inherit through shadow DOM. A component that reads
`var(--lt-icon-button-color, <default-token>)` lets any ancestor set
`--lt-icon-button-color` via a plain class — no `::part()` needed.

**Naming convention:** `--lt-[component-tag-without-lt]-[property]`
Examples: `--lt-icon-button-color`, `--lt-tooltip-bg`, `--lt-slider-fill`

## Pattern

```css
/* Inside the component's shadow styles */
[part='base'] {
  color: var(--lt-icon-button-color, var(--lt-text-subtle)); /* public hook → token fallback */
}
```

```css
/* Consumer — plain class, no ::part() */
.header-btn {
  --lt-icon-button-color: var(--lt-color-neutral-100);
}
```

## Scope of Work

### Priority 1 — Rename existing private props (already wired, just unexposed)

| Component      | Private prop                         | Public prop                      |
| -------------- | ------------------------------------ | -------------------------------- |
| `lt-tooltip`   | `--_tooltip-bg`                      | `--lt-tooltip-bg`                |
| `lt-tooltip`   | `--_tooltip-color`                   | `--lt-tooltip-color`             |
| `lt-tooltip`   | `--_offset`                          | `--lt-tooltip-offset`            |
| `lt-sidepanel` | `--_overlay-opacity`                 | `--lt-sidepanel-overlay-opacity` |
| `lt-alert`     | `--_bg-subtle` (per-variant default) | `--lt-alert-bg`                  |
| `lt-alert`     | `--_color` (per-variant default)     | `--lt-alert-color`               |
| `lt-alert`     | `--_border` (per-variant default)    | `--lt-alert-border-color`        |

Alert pattern: each variant still sets its own token default, but wraps it through the
public prop so consumers can override:

```css
:host([variant='success']) {
  --_bg-subtle: var(--lt-alert-bg, var(--lt-bg-success-subtle));
  --_color: var(--lt-alert-color, var(--lt-text-success));
}
```

### Priority 2 — Add new hooks (components with no override surface)

| Component        | Props to add                                                                              | Typical use case                 |
| ---------------- | ----------------------------------------------------------------------------------------- | -------------------------------- |
| `lt-icon-button` | `--lt-icon-button-color`, `--lt-icon-button-hover-bg`                                     | Light button on dark/primary bg  |
| `lt-button`      | `--lt-button-color`, `--lt-button-bg`, `--lt-button-border-color`, `--lt-button-hover-bg` | Custom brand colour override     |
| `lt-surface`     | `--lt-surface-bg`, `--lt-surface-border-radius`, `--lt-surface-padding`                   | Card customization               |
| `lt-progress`    | `--lt-progress-color`, `--lt-progress-track-color`, `--lt-progress-height`                | Custom branded progress bar      |
| `lt-slider`      | `--lt-slider-fill`, `--lt-slider-track-height`                                            | Already half-done with `--_fill` |
| `lt-avatar`      | `--lt-avatar-size`, `--lt-avatar-bg`, `--lt-avatar-color`                                 | Size/colour in specific contexts |
| `lt-badge`       | `--lt-badge-bg`, `--lt-badge-color`                                                       | Custom semantic colour           |
| `lt-chip`        | `--lt-chip-bg`, `--lt-chip-color`, `--lt-chip-border-color`                               | Custom chip colouring            |
| `lt-spinner`     | `--lt-spinner-color`, `--lt-spinner-size`                                                 | Branded loading indicator        |

### Out of scope (keep ::part only)

Structural/layout customisation (widths, z-index overrides, dialog positioning) is fine to
leave as `::part()` — those are genuinely structural, not "I want it a different colour".

## Docs cleanup

Once `lt-icon-button` gets `--lt-icon-button-color` and `--lt-icon-button-hover-bg`,
`BaseLayout.styles.css` can drop `::part(base)` entirely:

```css
/* before */
.header-btn::part(base) {
  color: var(--lt-color-neutral-100);
}
.header-btn::part(base):hover {
  background: color-mix(in srgb, white 15%, transparent);
}

/* after */
.header-btn {
  --lt-icon-button-color: var(--lt-color-neutral-100);
  --lt-icon-button-hover-bg: color-mix(in srgb, white 15%, transparent);
}
```

## Implementation order

1. `lt-icon-button` — unblocks the immediate docs usage
2. `lt-tooltip`, `lt-alert`, `lt-sidepanel` — rename existing private props (safe, trivial)
3. `lt-button` — most impactful for consumers
4. Remaining Priority 2 components
5. Update `BaseLayout.styles.css` to remove all `::part()` for colour overrides
6. Add CSS custom props to each component's docs API table

## Non-goals

- Don't expose every possible style property as a custom prop — only what varies in
  practice. Deeply structural CSS (grid layout inside a complex component) is fine to leave
  to `::part()`.
- Don't add `--lt-*` props speculatively; add them when there is a concrete use case.
