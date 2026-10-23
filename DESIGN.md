---
version: alpha
name: Latty
description: >-
  A quiet, lattice-structured product design system. Neutral surfaces, hairline
  borders, and a single vivid orange accent carry the interface; hierarchy comes
  from type and a strict 4px spacing grid rather than decoration. Components are
  framework-agnostic web components that consume tokens, and the chromatic
  roles are generated from six base hexes with contrast-safe text and
  interactive states.
colors:
  primary: '#FF8200'
  secondary: '#5252C5'
  success: '#22C55E'
  warning: '#EEB308'
  error: '#EF4444'
  info: '#0EA5E9'
  ink: '#1B1B1B'
  body: '#696969'
  muted: '#696969'
  disabled: '#ABABAB'
  inverse: '#FFFFFF'
  canvas: '#FFFFFF'
  surface: '#F3F3F3'
  surface-subtle: '#FAFAFA'
  overlay: '#E4E4E4'
  hairline: '#E4E4E4'
  hairline-strong: '#ABABAB'
  hairline-input: '#CACACA'
  focus: '#FFBB87'
  primary-subtle: '#FFD4B5'
  primary-ink: '#963B00'
  on-primary: '#3C1D05'
  primary-hover: '#FF9539'
  primary-active: '#FFA860'
  on-secondary: '#FFFFFF'
  secondary-ink: '#333187'
  secondary-subtle: '#CBD2FF'
  secondary-hover: '#4544AD'
  secondary-active: '#333187'
  on-success: '#0C2E16'
  success-ink: '#006F22'
  success-subtle: '#BEEDC6'
  on-warning: '#332400'
  warning-ink: '#845A00'
  warning-subtle: '#F5E0B5'
  on-error: '#1B1B1B'
  error-ink: '#950E18'
  error-subtle: '#FFC8C1'
  on-info: '#082A3C'
  info-ink: '#005C8D'
  info-subtle: '#BCE4FE'
typography:
  display-2xl:
    fontFamily: '"Hanken Grotesk", sans-serif'
    fontSize: 72px
    fontWeight: 200
    lineHeight: 1.1
    letterSpacing: -0.02em
  display-xl:
    fontFamily: '"Hanken Grotesk", sans-serif'
    fontSize: 60px
    fontWeight: 200
    lineHeight: 1.1
    letterSpacing: -0.02em
  display-lg:
    fontFamily: '"Hanken Grotesk", sans-serif'
    fontSize: 48px
    fontWeight: 200
    lineHeight: 1.15
    letterSpacing: -0.01em
  h1:
    fontFamily: '"Hanken Grotesk", sans-serif'
    fontSize: 40px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.02em
  h2:
    fontFamily: '"Hanken Grotesk", sans-serif'
    fontSize: 32px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.01em
  h3:
    fontFamily: '"Hanken Grotesk", sans-serif'
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0em
  h4:
    fontFamily: '"Hanken Grotesk", sans-serif'
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: 0em
  h5:
    fontFamily: '"Hanken Grotesk", sans-serif'
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0em
  h6:
    fontFamily: '"Hanken Grotesk", sans-serif'
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0em
  lead:
    fontFamily: '"Hanken Grotesk", sans-serif'
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0em
  body:
    fontFamily: '"Hanken Grotesk", sans-serif'
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0em
  body-sm:
    fontFamily: '"Hanken Grotesk", sans-serif'
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0em
  caption:
    fontFamily: '"Hanken Grotesk", sans-serif'
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0em
  overline:
    fontFamily: '"Hanken Grotesk", sans-serif'
    fontSize: 11px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0.08em
  label:
    fontFamily: '"Hanken Grotesk", sans-serif'
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0em
rounded:
  none: 0px
  sm: 4px
  md: 8px
  full: 999px
spacing:
  none: 0px
  xs: 4px
  sm: 8px
  md: 12px
  base: 16px
  lg: 24px
  xl: 32px
  2xl: 40px
  section: 64px
  page: 96px
components:
  button-primary:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.on-primary}'
    typography: '{typography.label}'
    rounded: '{rounded.md}'
    padding: 0 20px
    height: 40px
  button-secondary:
    backgroundColor: '{colors.secondary}'
    textColor: '{colors.on-secondary}'
    typography: '{typography.label}'
    rounded: '{rounded.md}'
    padding: 0 20px
    height: 40px
  button-ghost:
    backgroundColor: '{colors.canvas}'
    textColor: '{colors.primary-ink}'
    typography: '{typography.label}'
    rounded: '{rounded.md}'
    padding: 0 16px
    height: 40px
  input:
    backgroundColor: '{colors.canvas}'
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    rounded: '{rounded.md}'
    padding: 0 16px
    height: 40px
  card:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    rounded: '{rounded.md}'
    padding: 24px
  badge:
    backgroundColor: '{colors.primary-subtle}'
    textColor: '{colors.primary-ink}'
    typography: '{typography.caption}'
    rounded: '{rounded.full}'
    padding: 0 8px
    height: 22px
  alert-success:
    backgroundColor: '{colors.success-subtle}'
    textColor: '{colors.success-ink}'
    typography: '{typography.body-sm}'
    rounded: '{rounded.md}'
    padding: 12px 16px
  alert-warning:
    backgroundColor: '{colors.warning-subtle}'
    textColor: '{colors.warning-ink}'
    typography: '{typography.body-sm}'
    rounded: '{rounded.md}'
    padding: 12px 16px
  alert-error:
    backgroundColor: '{colors.error-subtle}'
    textColor: '{colors.error-ink}'
    typography: '{typography.body-sm}'
    rounded: '{rounded.md}'
    padding: 12px 16px
  alert-info:
    backgroundColor: '{colors.info-subtle}'
    textColor: '{colors.info-ink}'
    typography: '{typography.body-sm}'
    rounded: '{rounded.md}'
    padding: 12px 16px
  dialog:
    backgroundColor: '{colors.canvas}'
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    rounded: '{rounded.md}'
    padding: 20px
    width: 600px
  tooltip:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.canvas}'
    typography: '{typography.body-sm}'
    rounded: '{rounded.sm}'
    padding: 4px 8px
  divider:
    backgroundColor: '{colors.hairline}'
    height: 1px
---

# Latty Design Language

> A lattice is an invisible grid that gives things their shape. Latty is that grid for your product.

## Overview

Latty is a framework-agnostic design system: tokens generate CSS custom properties, and Lit-based web components
consume them. The design language is a **lattice** — an invisible grid that gives every surface, control, and spacing
decision a place. It should feel quiet, precise, and structural: closer to a well-set technical document than a marketing
page.

Neutral surfaces and hairline borders do the organising. A single vivid orange accent marks action and identity. Status
colour appears only when it carries meaning, and always with text or an icon. Hierarchy comes from type and spacing first,
colour second, ornament never.

**Key Characteristics:**

- **One accent.** `{colors.primary}` (#FF8200) carries primary action, focus identity, and the brand. The indigo
  `{colors.secondary}` supports it and never competes for the same role.
- **Neutral canvas.** `{colors.canvas}` floors, `{colors.surface}` panels, `{colors.hairline}` borders. Shadows signal
  temporary lift, not decoration.
- **Modest type weights.** Display sizes sit at weight 200, headings at 600, body at 400. Size and spacing set hierarchy,
  not heavy ink.
- **One grid.** A strict 4px spacing scale, one 8px radius token, 32/40/48px control heights.
- **Semantic by default.** Components consume role tokens, never raw palette steps or literal colours.
- **Accessible by construction.** Label colours are derived by contrast, focus rings are always visible, and animated
  components respect reduced motion.
- **One grammar.** `variant`, `appearance`, `size`, `elevation`, and `shape` mean the same thing across all 38 component
  categories.

### Principles

- **Tokens first, components second.** Every visual value resolves to a token. Hard-coded hex values, `rgb()` literals,
  and raw palette steps are blocked in component styles by the `no-raw-component-colors` ESLint ratchet.
- **Semantic over literal.** A component asks for a role (`{colors.ink}`, `{colors.hairline}`), not a shade. This makes
  light/dark and brand theming a single-layer swap.
- **Accessible by default.** Filled surfaces derive their label colour by contrast, focus rings ship with the components,
  and every icon-only control requires a label.
- **One grammar across components.** A new component adopts the shared vocabulary before inventing a prop. Destructive
  actions use `variant="error"`; `danger` does not exist in Latty.
- **Themeable, not forkable.** Consumers change inputs (base colours, fonts, radius, border weight, contrast, elevation,
  theme). They do not patch component internals to get a different look.
- **Quiet chrome, clear content.** Prefer grouping with a surface and a hairline border over adding colour or stacking
  shadows.
- **Motion is feedback.** Animation confirms a state change or preserves spatial continuity. It is never decorative.

This document describes design intent, not the component API. Props, slots, events, and parts live in
`custom-elements.json` and on the docs site.

## Colors

The palette is built from six chromatic roles. Each base generates a 10-step OKLCH ramp (`50`–`900`) plus a muted ramp;
hue and chroma come from the base, lightness is normalised across the system. Neutral, white, and black are generated
separately.

- **Primary (`{colors.primary}` — #FF8200):** The single accent. Used for the most important action on a surface, the
  focus ring, and brand identity. Used scarcely.
- **Secondary (`{colors.secondary}` — #5252C5):** Supporting accent for a secondary action or a quieter brand moment. It
  never shares a screen with primary as an equal.
- **Success (`{colors.success}` — #22C55E):** Confirmed, complete, healthy.
- **Warning (`{colors.warning}` — #EEB308):** Caution, degraded service, something needs attention.
- **Error (`{colors.error}` — #EF4444):** Destructive action, failure, invalid input. This is the only negative role.
- **Info (`{colors.info}` — #0EA5E9):** Neutral information, tips, system notices.

Text and surface roles complete the system: `{colors.ink}` for primary copy, `{colors.body}` for secondary copy,
`{colors.muted}` for metadata, `{colors.disabled}` for unavailable controls, `{colors.canvas}` for the page floor,
`{colors.surface}` for grouped content, `{colors.overlay}` for raised layers, and `{colors.hairline}`,
`{colors.hairline-strong}`, and `{colors.hairline-input}` for borders at increasing emphasis.

### Semantic roles

Components and application CSS should reference roles, grouped by intent:

| Group       | Tokens                                                                                                                             |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Text        | `--lt-text-default`, `-subtle`, `-muted`, `-disabled`, `-inverse`, `-neutral`, `-<variant>`                                        |
| Background  | `--lt-bg-default`, `-subtle`, `-surface`, `-overlay`, `-inverse`, `-neutral-subtle`, `-<variant>`, `-<variant>-subtle`             |
| Border      | `--lt-border-default`, `-strong`, `-subtle`, `-input`, `-focus`, `-<variant>`, `-<variant>-strong`                                 |
| Interactive | `--lt-interactive-<variant>-bg`, `-hover`, `-active`; `--lt-interactive-neutral-bg`, `-hover`, `-active`; `--lt-text-on-<variant>` |
| Focus       | `--lt-focus-ring-color`, `--lt-focus-halo-color`                                                                                   |

Core roles across themes:

| Token                      | Light           | Dark            |
| -------------------------- | --------------- | --------------- |
| `--lt-text-default`        | `neutral-900`   | `neutral-100`   |
| `--lt-text-subtle`         | `neutral-600`   | `neutral-300`   |
| `--lt-text-muted`          | `neutral-600`   | `neutral-400`   |
| `--lt-text-disabled`       | `neutral-400`   | `neutral-600`   |
| `--lt-bg-default`          | `white`         | `neutral-900`   |
| `--lt-bg-subtle`           | `neutral-50`    | `neutral-800`   |
| `--lt-bg-surface`          | `neutral-100`   | `neutral-800`   |
| `--lt-bg-overlay`          | `neutral-200`   | `neutral-700`   |
| `--lt-border-default`      | `neutral-200`   | `neutral-700`   |
| `--lt-border-strong`       | `neutral-400`   | `neutral-500`   |
| `--lt-border-input`        | `neutral-300`   | `neutral-600`   |
| `--lt-border-focus`        | `primary-200`   | `primary-400`   |
| `--lt-text-<variant>`      | `<variant>-700` | `<variant>-300` |
| `--lt-bg-<variant>`        | `<variant>-500` | `<variant>-500` |
| `--lt-bg-<variant>-subtle` | `<variant>-100` | `<variant>-900` |

### Contrast contract

Filled surfaces never ship a hand-picked label colour. For every variant, the engine tries white, the palette's own
lightest tint, its own deepest shade, near-black, then black, and takes the first that reaches **WCAG AA (4.5:1)** on the
fill — in both themes. Hover and pressed fills are chosen to keep that contrast, which is why a bright base colour
sometimes lightens on hover instead of darkening. Results are exposed as `{colors.on-primary}`, `{colors.on-secondary}`,
`{colors.on-success}`, `{colors.on-warning}`, `{colors.on-error}`, `{colors.on-info}`, and their corresponding
`--lt-interactive-<variant>-*` tokens.

### Colour rules

- Colour carries meaning or action. It does not decorate a container that a border or spacing could separate.
- Status is never conveyed by colour alone; pair it with text, an icon, or a label.
- Body copy uses `{colors.ink}` or `{colors.body}`. `{colors.disabled}` is for unavailable controls, not de-emphasis.
- On a filled variant surface, use the matching `on-*` token. Do not assume white.
- In dark mode, semantic light/dark tokens swap roles; do not hard-code light-theme values in a component.

## Typography

The system uses **Hanken Grotesk**, a variable face from 100 to 900 with roman and italic styles, loaded with
`font-display: swap` and a Latin subset. `--lt-typography-fontFamilyHeading` can point at a second family for headings;
it falls back to the primary family.

### Type scale

`lt-text` encodes the scale. Sizes marked with a range are fluid (`clamp()`); the YAML records the maximum.

| Variant       | Size    | Weight | Line height | Tracking | Use for                               |
| ------------- | ------- | ------ | ----------- | -------- | ------------------------------------- |
| `display-2xl` | 40–72px | 200    | 1.1         | -0.02em  | Hero statements, campaign pages       |
| `display-xl`  | 32–60px | 200    | 1.1         | -0.02em  | Large hero, section openers           |
| `display-lg`  | 32–48px | 200    | 1.15        | -0.01em  | Editorial headings                    |
| `h1`          | 28–40px | 600    | 1.2         | -0.02em  | Page title                            |
| `h2`          | 24–32px | 600    | 1.25        | -0.01em  | Section title                         |
| `h3`          | 20–24px | 600    | 1.3         | 0        | Subsection                            |
| `h4`          | 20px    | 600    | 1.35        | 0        | Card or panel title                   |
| `h5`          | 18px    | 600    | 1.4         | 0        | Dense headings                        |
| `h6`          | 16px    | 600    | 1.4         | 0        | Smallest heading                      |
| `lead`        | 20px    | 400    | 1.6         | 0        | Intro paragraph                       |
| `body`        | 16px    | 400    | 1.6         | 0        | Default copy                          |
| `body-sm`     | 14px    | 400    | 1.6         | 0        | Secondary copy, helper text           |
| `caption`     | 12px    | 400    | 1.5         | 0        | Metadata, timestamps                  |
| `overline`    | 11px    | 600    | 1.2         | 0.08em   | Category labels; uppercase by default |
| `label`       | 14px    | 600    | 1.4         | 0        | Form labels, compact emphasis         |

### Typography principles

- **Size sets hierarchy.** Display sizes are large and light (200); headings are compact and semibold (600); body is
  regular (400). Avoid adding weight to compensate for a weak layout.
- **Tighten as type grows.** Display and h1/h2 tracking is negative; body and labels are neutral. Large type should feel
  dense, not loose.
- **One reading size.** Body copy is 16px with 1.6 line height. Smaller sizes are for metadata and supporting detail.
- **Labels are not buttons.** `label` is for form and compact emphasis; button labels use the size-specific control type.

### Typography rules

- Use `lt-text`; do not hand-roll font sizes in page CSS.
- Keep one `h1` per page and do not skip heading levels for visual reasons.
- Display variants are for editorial and marketing surfaces, not application chrome.
- `overline` is a category marker, not a button label.
- `caption` is the floor for readable text; never use it for essential instructions.
- Keep body copy near 60–75 characters per line.

## Layout

A strict **4px grid** with 25 steps (`0`–`24`), from 0 to 96px. Rem is canonical; pixel variants exist for precision. The
front-matter aliases map to this scale: `xs`=1, `sm`=2, `md`=3, `base`=4, `lg`=6, `xl`=8, `2xl`=10, `section`=16,
`page`=24.

| Step | rem       | px   | Typical use                          |
| ---- | --------- | ---- | ------------------------------------ |
| `1`  | `0.25rem` | 4px  | Icon/text gap, tight padding         |
| `2`  | `0.5rem`  | 8px  | Inline gaps, compact stack           |
| `3`  | `0.75rem` | 12px | Small control padding                |
| `4`  | `1rem`    | 16px | Default control padding, body rhythm |
| `5`  | `1.25rem` | 20px | Large control padding                |
| `6`  | `1.5rem`  | 24px | Card padding, form groups            |
| `8`  | `2rem`    | 32px | Section gaps                         |
| `10` | `2.5rem`  | 40px | Page gutters on compact screens      |
| `12` | `3rem`    | 48px | Block separation                     |
| `16` | `4rem`    | 64px | Section padding                      |
| `20` | `5rem`    | 80px | Large section spacing                |
| `24` | `6rem`    | 96px | Page-level rhythm                    |

### Grid and containers

Latty ships **no layout primitives**; page grids belong to the application. Use these defaults unless a product has a
documented reason to diverge:

- **Grid:** 12-column fluid grid. Columns collapse through 12 → 6 → 4 → 1 as the viewport narrows, never through arbitrary fractions.
- **Max content width:** 1280px for product screens; 720px for long-form prose.
- **Gutters:** 16px compact, 24px medium, 32px expanded.
- **Prose measure:** 60–75 characters, regardless of container width.

### Density

The default is **comfortable**. Compact density is allowed for data-heavy tables and toolbars, where control padding
drops from 16px to 12px and row height from 48px to 40px. Do not mix comfortable and compact spacing inside one
component.

### Responsive behavior

| Name     | Width         | Key changes                                                         |
| -------- | ------------- | ------------------------------------------------------------------- |
| Compact  | `< 640px`     | Single column; 16px gutters; nav collapses; controls use `lg`.      |
| Medium   | `640–1023px`  | Two columns; 24px gutters; side panels become full-height overlays. |
| Expanded | `1024–1439px` | Full grid; 32px gutters; persistent side navigation allowed.        |
| Wide     | `≥ 1440px`    | Content caps at 1280px; extra width becomes outer margin.           |

Type scales fluidly through `clamp()`; do not add per-breakpoint font-size overrides unless the layout genuinely
changes.

### Touch targets

- Primary controls should meet **44 × 44px** on touch surfaces. Use the `lg` control size (48px) by default on mobile.
- `sm` (32px) is pointer-only. If it must appear on touch, add at least 6px of hit-area padding on every side.
- The `md` control (40px) is the desktop default; it is below the 44px touch recommendation, so do not use it as the
  mobile default.

### Layout rules

- Use `--lt-spacing-<step>` (rem) for layout, and `--lt-spacing-px-<step>` only when a pixel value is the requirement.
- Do not introduce values off the grid. If the design needs 18px, it needs a different composition, not a new token.
- Repeated vertical rhythm comes from stack gaps (`2`, `4`, `6`, `8`), not from margins on individual children.
- Spacing tokens are not configurable through `configure()`; overriding them is a system-level decision.

## Elevation & Depth

Depth is restrained. Latty prefers a hairline border to a shadow; elevation means the element is temporarily above the
page, not that it is important. Shadows are derived from `neutral-900` so they stay neutral in both themes.

| Level | Intent                                        |
| ----- | --------------------------------------------- |
| `0`   | In-flow content, flat cards, sections         |
| `1`   | Slight lift: raised card, sticky header edge  |
| `2`   | Card-like elevation: popovers, menus          |
| `3`   | Prominent: dropdown panels, floating cards    |
| `4`   | Very high: dialogs, sheets, blocking overlays |
| `5`   | Maximum: rare full-surface takeovers          |

- Do not stack elevation levels to create hierarchy; use type and spacing.
- Containers that need background, radius, and shadow compose `lt-surface` rather than re-implementing it.
- `configure({ elevation: 'none' })` flattens every level for flat themes; components must degrade cleanly.
- For custom shadows, scrims, or tinted borders use `rgb(var(--lt-shadow-rgb) / <alpha>)`.

### Layering

Z-index has two bands, and components should not invent values between them.

| Band    | Token            | Value  | Use                            |
| ------- | ---------------- | ------ | ------------------------------ |
| Base    | `--lt-z-sticky`  | `100`  | Sticky headers, fixed toolbars |
| Overlay | `--lt-z-overlay` | `1000` | Menus, popovers, drawers       |

- Native top-layer APIs (`dialog`, `popover`, `tooltip`) sit above both bands; do not recreate them with z-index.
- Never use `9999` or a one-off value. If a surface needs a new band, it needs a system decision.

## Shapes

Shape language is **softened structure**. One radius token keeps the system coherent and lets a theme square or soften
everything in one move.

| Property          | Token                         | Default        |
| ----------------- | ----------------------------- | -------------- |
| Corner radius     | `--lt-border-radius`          | `0.5rem` (8px) |
| Control border    | `--lt-border-width`           | `1px`          |
| Focus ring width  | `--lt-border-focusRingWidth`  | `2px`          |
| Focus ring offset | `--lt-border-focusRingOffset` | `2px`          |

- Pills are the deliberate exception: badges, chips, progress, spinners, sliders, and avatars use `{rounded.full}`.
- Border width accepts `thin` (1px), `medium` (2px), `thick` (4px), or any CSS length. Badges and chips cap at `medium`;
  a 4px border reads as compressed at their height.
- Dividers, table rules, focus outlines, and checkbox/radio borders keep fixed widths. `border.width` is for control
  chrome.
- Do not mix radii inside one surface. Nested containers share the radius or reduce it by the inset.
- `{rounded.sm}` (4px) is reserved for tooltip-scale chrome; do not use it on controls or cards.

## Components

Latty ships 38 component categories (42 `lt-*` elements) as Lit web components. The host is the public API; internals are
private except for documented `::part()` hooks and `--lt-<component>-*` custom properties.

```text
<lt-component>            ← host: attributes, properties, events, CSS custom properties
  #shadow-root
    [part="base"]         ← styleable via ::part(base)
    .content              ← default slot wrapper (min-width: 0)
      <slot></slot>
```

The default slot is wrapped in a single `.content` element inside any flex/grid container, so rich slotted content flows
as one unit instead of being split into separately shrinking items. Containers that need background, radius, and shadow
compose `lt-surface` rather than duplicating those styles.

### Shared vocabulary

This is the design-level subset; the full prop table lives in `agents/components.md` and the authoritative per-component
detail in `custom-elements.json`.

| Prop                      | Meaning                                                | Values                                                                              |
| ------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| `variant`                 | Semantic colour role                                   | `primary`, `secondary`, `neutral`, `success`, `warning`, `error`, `info`, `default` |
| `appearance`              | Fill/outline emphasis                                  | `filled`, `outlined`, `ghost`, `solid`, `clean`, `dashed`, `dotted`                 |
| `size`                    | Component scale                                        | `sm`, `md`, `lg`                                                                    |
| `elevation`               | Shadow depth                                           | `0`–`5`                                                                             |
| `shape`                   | Geometric form                                         | `circle`, `square`, `rect`, `text`                                                  |
| `icon-start` / `icon-end` | Leading or trailing icon                               | Any registered icon name                                                            |
| `disabled`                | Unavailable and dimmed                                 | boolean (presence)                                                                  |
| `loading`                 | Work in progress; blocks interaction where appropriate | boolean (presence)                                                                  |
| `full-width`              | Stretch to container width                             | boolean (presence)                                                                  |
| `uppercase`               | Small-caps-style label with wider tracking             | boolean (presence)                                                                  |
| `theme`                   | Force one component into light/dark regardless of page | `light`, `dark`                                                                     |

### Variants

`variant` answers **what the element means**, not what colour it should be.

- `primary` — the main action on the surface. One per view, as a rule.
- `secondary` — a supporting action that still carries brand weight.
- `neutral` — an action with no semantic colour (cancel, dismiss, tertiary tools).
- `success`, `warning`, `error`, `info` — status and its consequences. `error` is the destructive/negative role.
- `default` — a component's resting role, usually neutral.

### Appearance

`appearance` answers **how much emphasis** the element carries.

| Appearance | Emphasis | Typical use                                     |
| ---------- | -------- | ----------------------------------------------- |
| `filled`   | Highest  | Primary action, active state, solid status      |
| `outlined` | Medium   | Secondary action, form chrome, grouped surfaces |
| `ghost`    | Lowest   | Tertiary action, toolbar items, inline controls |

`solid`, `clean`, `dashed`, and `dotted` are component-specific refinements (badges, alerts, dividers, accordions).
Emphasis ladder: **filled > outlined > ghost**. A view should not contain two equally filled primary actions.

### Sizes

Controls share a three-step height scale, which keeps mixed rows aligned:

| Size | Height | Type        |
| ---- | ------ | ----------- |
| `sm` | 32px   | `0.875rem`  |
| `md` | 40px   | `1rem`      |
| `lg` | 48px   | `1.0625rem` |

Do not mix `sm` and `lg` controls in one action row.

### States

| State            | Visual contract                                                       |
| ---------------- | --------------------------------------------------------------------- |
| Default          | Resting tokens; semantic border and background                        |
| Hover            | Interactive `-hover` fill or subtle surface shift; 150ms              |
| Active/pressed   | Interactive `-active` fill; may use a 100ms transform                 |
| Focus-visible    | 2px `{colors.focus}` outline, 2px offset; never removed               |
| Disabled         | `{colors.disabled}` foreground, reduced affordance, no pointer events |
| Loading          | Spinner or progress replaces content; interaction blocked             |
| Selected/checked | Persistent active treatment plus a non-colour indicator               |
| Invalid          | `{colors.error}` border plus text or icon message; never colour alone |
| Read-only        | Readable but non-editable; distinct from disabled                     |
| Open/expanded    | Persistent active treatment on the trigger plus `aria-expanded`       |

### Interaction

- Feedback begins within 100ms: a pressed state for pointer input, a focus ring for keyboard input.
- Anything that takes longer than roughly 300ms needs a progress or loading signal; block repeat submission while
  loading.
- Hover is an enhancement. Never hide the only path to an action behind hover.
- Destructive actions name the object and consequence ("Delete 3 projects"), require explicit confirmation, and use the
  `error` role.
- Validate on blur and on submit, not on every keystroke. Keep the user's input when validation fails.
- Preserve focus and scroll position when content changes; move focus only when the change is a new context (dialog,
  page).
- A control's label names the result ("Save changes"), not the mechanism ("Submit").

### Motion

Motion confirms a change or preserves spatial continuity. It is never decorative.

| Token                    | Value   | Use                             |
| ------------------------ | ------- | ------------------------------- |
| `--lt-duration-instant`  | `100ms` | Pressed states, toggles         |
| `--lt-duration-fast`     | `150ms` | Hover, focus, tooltips          |
| `--lt-duration-moderate` | `200ms` | Dropdowns, popovers, accordions |
| `--lt-duration-slow`     | `300ms` | Dialogs, sheets, large surfaces |

| Easing                 | Value                              | Use                        |
| ---------------------- | ---------------------------------- | -------------------------- |
| `--lt-ease-standard`   | `cubic-bezier(0.4, 0, 0.2, 1)`     | Most transitions           |
| `--lt-ease-emphasized` | `cubic-bezier(0.34, 1.2, 0.64, 1)` | Entrance of large surfaces |

- Motion enters with emphasis and exits faster; an element should not linger on the way out.
- Animate opacity and transform; avoid animating layout properties.
- No infinite decorative loops. Loading indicators are the exception.
- Under `prefers-reduced-motion: reduce`, remove transform and scale; keep short opacity changes or cut instantly.

### Component definitions

The `components` block in the front matter names design-level roles, not custom-element tag names. `button-primary` is
`lt-button variant="primary"`, `input` is `lt-textfield`, `card` is `lt-surface`, and `alert-success` is
`lt-alert variant="success"`. The entries below use the same keys so humans and tools can cross-reference them.

**`button-primary`** — The signature action. Background `{colors.primary}`, text `{colors.on-primary}`, type
`{typography.label}`, rounded `{rounded.md}`, 40px tall with 20px horizontal padding. Hover shifts to
`{colors.primary-hover}`; pressed to `{colors.primary-active}`. One per view.

**`button-secondary`** — Supporting brand action. Background `{colors.secondary}`, white text, same geometry. Hover
`{colors.secondary-hover}`, pressed `{colors.secondary-active}`.

**`button-ghost`** — Lowest emphasis. Canvas background, `{colors.primary-ink}` text, no visible chrome until hover. Use
for tertiary or inline actions.

**`input`** — Text field. Canvas background, `{colors.ink}` text, `{typography.body}`, 40px tall, 16px horizontal padding,
1px `{colors.hairline-input}` border, `{rounded.md}`. Focus uses a 2px `{colors.focus}` ring with 2px offset. Error state
uses an `{colors.error}` border plus a message.

**`card`** — Default container. `{colors.surface}` background, `{colors.ink}` text, `{typography.body}`, 24px padding,
`{rounded.md}`, separated by a 1px `{colors.hairline}` border. No shadow at rest; use elevation 1 only when the card is
raised.

**`badge`** — Compact status or count. `{colors.primary-subtle}` background, `{colors.primary-ink}` text,
`{typography.caption}`, full rounding, 22px tall with 8px horizontal padding. Status badges swap the pair for the
matching role.

**`alert-success`** — Inline confirmation. `{colors.success-subtle}` background, `{colors.success-ink}` text,
`{typography.body-sm}`, 12px × 16px padding, `{rounded.md}`. Pair with an icon and message.

**`alert-warning`** — Caution. `{colors.warning-subtle}` background and `{colors.warning-ink}` text, same geometry.

**`alert-error`** — Failure or destructive context. `{colors.error-subtle}` background and `{colors.error-ink}` text,
same geometry.

**`alert-info`** — Neutral information. `{colors.info-subtle}` background and `{colors.info-ink}` text, same geometry.

**`dialog`** — Blocking decision. `{colors.canvas}` background, `{colors.ink}` text, `{rounded.md}`, 20px padding,
600px default width. Rendered in the native top layer with elevation 4.

**`tooltip`** — Non-interactive hint. `{colors.ink}` background, `{colors.canvas}` text, `{typography.body-sm}`, 4px × 8px
padding, `{rounded.sm}`. Never carries essential information.

**`divider`** — Structural rule. 1px `{colors.hairline}`, no margin of its own; spacing comes from the layout.

### Composition rules

- **Forms:** every field has a visible label; helper text explains format, error text explains recovery. Use the
  component's built-in validity states rather than styling an error from scratch.
- **Actions:** one primary action per view; destructive actions use `error`; icon-only controls require a label.
- **Overlays:** `dialog` for blocking decisions, `sidepanel` for contextual detail, `dropdown` for menus, `tooltip` for
  non-interactive hints.
- **Feedback:** `alert` for persistent inline status, `snackbar` for transient confirmation, `progress` for known
  duration, `skeleton` for content-shaped loading, `spinner` for short unknown waits.
- **Navigation:** `nav` for persistent wayfinding, `breadcrumb` for hierarchy, `tab-group` for sibling views at the same
  level. Do not use tabs as navigation between pages.

## Do's and Don'ts

### Do

- Do use `{colors.primary}` for the single most important action on a surface.
- Do let type and spacing create hierarchy before reaching for colour or shadow.
- Do use semantic tokens (`{colors.ink}`, `{colors.surface}`, `{colors.hairline}`) rather than raw palette steps.
- Do pair every status colour with text or an icon.
- Do keep one `h1` per page and preserve heading order.
- Do test every screen in light and dark mode.
- Do use `lg` controls on touch surfaces and keep hit areas at least 44 × 44px.
- Do respect `prefers-reduced-motion`.

### Don't

- Don't introduce a second accent colour or a `danger` variant.
- Don't use colour as the only signal for success, warning, error, or selection.
- Don't mix radii, control sizes, or density modes inside one surface.
- Don't stack elevation levels to make something feel more important.
- Don't use display type or `overline` as application chrome.
- Don't hand-pick text on a filled variant; use `{colors.on-primary}`, `{colors.on-secondary}`, and the other `on-*` roles.
- Don't hard-code hex values, `rgb()` literals, or raw palette steps in component styles.
- Don't fork a component's shadow DOM to achieve a one-off look.

## Accessibility

**Target:** WCAG 2.2 AA.

- **Contrast.** Text meets 4.5:1 and large text meets 3:1. Filled surfaces derive their label colour by contrast; see
  the contrast contract above.
- **Focus.** Focus is always visible: a 2px ring with 2px offset, driven by `--lt-focus-ring-color` and
  `--lt-focus-halo-color`. Never remove the outline without an equally visible replacement.
- **Keyboard.** Every interactive component is reachable and operable by keyboard, with the expected arrow-key, Escape,
  and Tab behaviour for its pattern. Dialogs trap focus and restore it on close.
- **Names.** Icon-only controls require a label. Forwarded ARIA (`aria-pressed`, `aria-expanded`, `aria-haspopup`,
  `aria-controls`, `aria-current`, `aria-description`) is mirrored onto the internal native control, so set it on the
  host.
- **Semantics.** Components render native elements (`button`, `a`, `input`, `dialog`) inside their shadow roots. Do not
  rebuild a native control out of divs.
- **Motion.** Animated components respect `prefers-reduced-motion: reduce`.
- **Theme parity.** Light and dark are both first-class. A component is not done until it has been checked in both.
- **Verification.** Component tests use Vitest and jsdom with axe-core where applicable. A Playwright + axe-core suite
  runs against the production docs build in both themes, and a contrast spec checks semantic pairs directly.

See [Known Gaps](#known-gaps) for the current input-border exception.

## Theming

Theming is a set of inputs, not a fork. `configure()` (runtime) and `createStyleSheet()` (SSR) accept:

| Option            | Effect                                                                     | Default        |
| ----------------- | -------------------------------------------------------------------------- | -------------- |
| `colors`          | Base hex for `primary`, `secondary`, `success`, `warning`, `error`, `info` | Latty defaults |
| `font.family`     | Primary family, a Google Fonts CSS2 URL, or an array of slots              | Hanken Grotesk |
| `font.heading`    | Dedicated heading family for `h1`–`h6` and `display-*`                     | Primary family |
| `border.radius`   | Global corner radius                                                       | `0.5rem`       |
| `border.width`    | `thin` / `medium` / `thick` or a CSS length                                | `1px`          |
| `border.contrast` | `default` or `high` for structural borders                                 | `default`      |
| `elevation`       | `'none'` flattens every shadow level                                       | full scale     |
| `theme`           | `light`, `dark`, or `system`                                               | `light`        |

**Deliberately not themeable:** the spacing scale, type scale, motion scale, z-index scale, component anatomy, and state
model. Those are the lattice. They can be overridden in CSS, but that is a system-level decision, not consumer
customisation.

**Theme switching.** With `theme: 'system'`, set `data-theme` on `<html>` to force a mode (`light`/`dark`) or remove it
to follow the OS. Restore a saved choice with a synchronous script in `<head>` before first paint. A single component can
be forced with its `theme` property.

## Known Gaps

- **No layout primitives.** Grid, container, and breakpoint rules are recommendations; applications implement them.
- **Input border contrast.** `{colors.hairline-input}` is an incremental step and does not yet clear 3:1 against every
  field background. `configure({ border: { contrast: 'high' } })` moves structural borders closer.
- **Mode-specific tokens in YAML.** The front matter records the light theme. Dark mode swaps semantic roles; the
  mapping is documented above rather than duplicated in the token block.
- **No published Figma library.** The repository ships code and tokens; it is not a Figma source of truth.
- **Motion is prescriptive, not uniform.** Durations and easings are shared, but not every component animates the same
  properties.

## Contributing

A component is ready when:

- **Clear job.** No existing component covers it; composition was considered first.
- **Shared vocabulary.** It adopts `variant`, `appearance`, `size`, `disabled`, `loading`, and the icon slots before
  adding a bespoke prop.
- **Token-only styling.** Styles consume semantic tokens; the `no-raw-component-colors` ratchet passes.
- **Native semantics.** It renders a native element, supports keyboard operation, and has a visible focus state.
- **Theme parity.** It works in light and dark mode, including forced component themes.
- **Surface composition.** It composes `lt-surface` for container styling where applicable.
- **Slot convention.** The default slot is wrapped in `.content`.
- **Tests and docs.** Vitest suite (variants via `it.each`), docs page with playground and API table, React wrappers
  regenerated with `pnpm codegen:wrappers`.
- **Discovery.** Added to `agents/components.md` and, if it enables a new task, `agents/decision-guide.md`.
- **Budget.** Bundle size checked with `pnpm bundle-size`; the baseline is updated only for intentional growth.

Design review checklist:

1. Does hierarchy come from type and spacing before colour?
2. Is there exactly one primary action?
3. Are all values on a scale?
4. Would this survive a brand-colour swap and a dark-mode switch?
5. Does it work at 200% zoom and with a keyboard only?
6. Is status conveyed without colour?
7. Are empty, loading, and error states designed, not just the happy path?
8. Does it reuse an existing pattern instead of inventing one?

## References

| Question                                            | Source                                                          |
| --------------------------------------------------- | --------------------------------------------------------------- |
| Why does Latty look and behave this way?            | This file                                                       |
| How do I install, theme, or use a component?        | [`agents/`](./agents) and [the docs site](https://latty-ds.com) |
| What are the exact props, slots, parts, and events? | `packages/web/custom-elements.json`                             |
| What are the exact token values?                    | `packages/tokens/tokens.config.json` → `dist/tokens.{css,json}` |
| How do I contribute code, docs, or a component?     | [`CLAUDE.md`](./CLAUDE.md) / [`GEMINI.md`](./GEMINI.md)         |
| What is the consumer-facing agent context pack?     | [`agents/README.md`](./agents/README.md)                        |

- [Docs site](https://latty-ds.com) — usage, theming, component pages, recipes.
- [`agents/`](./agents) — condensed consumer context pack for AI agents.
- [`packages/tokens`](./packages/tokens) — palette generation, semantic tokens, `configure()`.
- [`packages/web`](./packages/web) — Lit components and `custom-elements.json`.
- [`CLAUDE.md`](./CLAUDE.md) — contributor workflow, commands, release process.
- [`eslint-rules/no-raw-component-colors.mjs`](./eslint-rules/no-raw-component-colors.mjs) — the colour ratchet.
