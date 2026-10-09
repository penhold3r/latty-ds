# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.0.0](https://github.com/penhold3r/latty-ds/compare/v0.10.4...v1.0.0) (2026-10-09)

### Bug Fixes

- **react:** assign array/object props via ref instead of JSX attributes (X7) ([ac9e402](https://github.com/penhold3r/latty-ds/commit/ac9e402554c74f06bf6be47738e131882e11192f))
- **web:** close out the keyboard/ARIA batch (radio, dropdown, combobox, tabs) ([72f216c](https://github.com/penhold3r/latty-ds/commit/72f216c14aee8fb2ec3cdea4de821b19b97506d4))
- **web:** derive lt-calendar/lt-date-input week-start from locale (X5) ([e90a337](https://github.com/penhold3r/latty-ds/commit/e90a337cd2c7213fd094f9596eadd115970f0df4))
- **web:** finish the audit's robustness batch (alert, progress, table) ([4d32ffd](https://github.com/penhold3r/latty-ds/commit/4d32ffd58ea9163197ba15f609a95b66b28bd3eb))
- **web:** fix lt-button's form association, add name/value/formaction ([c0b0c8a](https://github.com/penhold3r/latty-ds/commit/c0b0c8afab76c6b33f8eceb71d2b74fd20604194))
- **web:** rename lt-dialog/lt-alert's title prop to heading ([b6186c1](https://github.com/penhold3r/latty-ds/commit/b6186c10d3ba87b80758c119f8237f5d2ab08d8b))

- feat(web)!: make lt-select's value an array when multiple is set ([0dba3b7](https://github.com/penhold3r/latty-ds/commit/0dba3b71cdc9e1bda32cf0e943e14310ab422ea0))
- feat(web)!: make lt-sidepanel's anchor and lt-tooltip's placement logical (X5) ([3994ec3](https://github.com/penhold3r/latty-ds/commit/3994ec3cfda8dd3c868dccfad637a5518a62437b))

### Features

- **react:** pass the event to every wrapper handler ([75253cc](https://github.com/penhold3r/latty-ds/commit/75253cc93bbbd319cf9a6b9bddc00c056d2da7a2))
- **web:** add clearable and counter to lt-textfield ([48e19cd](https://github.com/penhold3r/latty-ds/commit/48e19cd14f04cb25831fd01a9e6d8156f471c5ff))
- **web:** add i18n labels prop to alert, breadcrumb, chip, dialog, sidepanel, snackbar (X5) ([887e474](https://github.com/penhold3r/latty-ds/commit/887e474abf5720119334d973701685b8a0613482))
- **web:** add i18n labels prop to calendar (X5) ([341dc1e](https://github.com/penhold3r/latty-ds/commit/341dc1e0cbe409133e5f7133586487c9619d2fe8))
- **web:** add i18n labels prop to checkbox, color-input, radio, select, switch (X5) ([5baf0b9](https://github.com/penhold3r/latty-ds/commit/5baf0b9be08467777abfb025d6e85783c905f28e))
- **web:** add i18n labels prop to combobox, date-input, textfield (X5) ([f7e2666](https://github.com/penhold3r/latty-ds/commit/f7e2666788dcb7ffdbe0d3e681441a28eaa03c4a))
- **web:** add i18n labels prop to pagination (X5) ([822db70](https://github.com/penhold3r/latty-ds/commit/822db70df8d758089472f5564a7e211715cd5c97))

### BREAKING CHANGES

- lt-select's value is now typed string | string[]. Code that
  reads select.value as a string needs to narrow it, or read the change event's
  detail.value. Single-select behaviour is unchanged.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>

- SidePanelAnchor changes from 'left' | 'right' | 'top' |
  'bottom' to 'start' | 'end' | 'top' | 'bottom'; TooltipPlacement changes
  from 'top' | 'bottom' | 'left' | 'right' to 'top' | 'bottom' | 'start' |
  'end'. Per user decision: both previously meant a fixed physical side
  regardless of reading direction. anchor='start'/placement='start' now
  resolve to the left edge in LTR and the right edge in RTL (and vice versa
  for 'end'), matching every other RTL-aware convention in this batch.

lt-tooltip needed no JavaScript changes at all — every property its
start/end placements need (inset-inline-_, border-inline-_-color) already
has a real CSS logical-property equivalent, unlike lt-sidepanel/box-shadow
below.

lt-sidepanel's positioning (inset-inline-start/end) is the same story, but
its off-screen slide transform and box-shadow offset are not expressible
as logical properties at all — translateX() and box-shadow take raw
lengths with no "which side" semantic. Solved with two CSS custom
properties (--\_start-x/--\_end-x for the transform sign, --\_dir-sign for
the shadow offset) defined once under :host and flipped under
:host(:dir(rtl)) — sidepanel.ts's \_offScreenTransform getter references
these by name instead of hardcoding a literal sign, so the component
itself never reads computed direction; the existing anchor-change JS
(snapping to the off-screen position without a transition) needed no
other changes, since it already just reads this same getter.

Live-verified in real Chromium, both LTR and the page's actual
`direction: rtl` (not merely attribute-syntax — confirmed via
getComputedStyle): sidepanel's position, slide direction and box-shadow
side all correctly flip for both anchor values; tooltip's bubble position
and arrow direction (border-inline-\*-color) both correctly flip for both
placement values. Not re-verified: hot-swapping anchor on an already-open
panel while direction is rtl — this exercises the same
requestAnimationFrame-deferred cleanup this session has repeatedly found
unreliable to observe through this specific browser-automation tool (not
a mechanism this change altered); the primary use case (anchor set once,
then opened) is what's confirmed above.

Updated every consumer: docs pages (sidepanel.mdx, tooltip.mdx), the
agents/ context pack's prop-vocabulary table (per CLAUDE.md), and both
packages' test suites.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VVmMnZua36PpJGtPtgA6T8

## [0.10.4](https://github.com/penhold3r/latty-ds/compare/v0.10.3...v0.10.4) (2026-09-26)

**Note:** Version bump only for package @latty-ds/react

## [0.10.3](https://github.com/penhold3r/latty-ds/compare/v0.10.2...v0.10.3) (2026-09-26)

**Note:** Version bump only for package @latty-ds/react

## [0.10.1](https://github.com/penhold3r/latty-ds/compare/v0.10.0...v0.10.1) (2026-08-08)

**Note:** Version bump only for package @latty-ds/react

# [0.10.0](https://github.com/penhold3r/latty-ds/compare/v0.9.0...v0.10.0) (2026-08-08)

**Note:** Version bump only for package @latty-ds/react

# [0.9.0](https://github.com/penhold3r/latty-ds/compare/v0.8.1...v0.9.0) (2026-07-23)

**Note:** Version bump only for package @latty-ds/react

## [0.8.1](https://github.com/penhold3r/latty-ds/compare/v0.8.0...v0.8.1) (2026-07-22)

**Note:** Version bump only for package @latty-ds/react

# [0.8.0](https://github.com/penhold3r/latty-ds/compare/v0.7.0...v0.8.0) (2026-07-22)

### Features

- **web:** add error fallback, load events, and lazy loading to image ([d68a033](https://github.com/penhold3r/latty-ds/commit/d68a033ce50df98fabd94b2fbd8dab5201eb4d5d))
- **web:** add interactive clickable and href rows to list-item ([50ab265](https://github.com/penhold3r/latty-ds/commit/50ab2651b3ff53145671a98e86c9dd21d5ec359f))

# [0.7.0](https://github.com/penhold3r/latty-ds/compare/v0.6.0...v0.7.0) (2026-07-01)

**Note:** Version bump only for package @latty-ds/react

# [0.6.0](https://github.com/penhold3r/latty-ds/compare/v0.5.0...v0.6.0) (2026-06-20)

**Note:** Version bump only for package @latty-ds/react

# [0.5.0](https://github.com/penhold3r/latty-ds/compare/v0.4.0...v0.5.0) (2026-06-07)

### Features

- **react,scripts:** unwrap CustomEvent detail in generated React event handlers ([4a92555](https://github.com/penhold3r/latty-ds/commit/4a9255522e90af1e3c83d7462adb8c0bd5a5463c))

# [0.4.0](https://github.com/penhold3r/latty-ds/compare/v0.3.0...v0.4.0) (2026-06-07)

### Features

- **web,react:** add property reflection, event standardization, and form association ([e015945](https://github.com/penhold3r/latty-ds/commit/e0159451d6f32e6780bb6bf280a8b66af13ad8bc))

# [0.3.0](https://github.com/penhold3r/latty-ds/compare/v0.2.0...v0.3.0) (2026-06-07)

**Note:** Version bump only for package @latty-ds/react

# 0.2.0 (2026-06-06)

### Bug Fixes

- **react:** set kebab-case attributes directly for camelCase props ([ac69fd3](https://github.com/penhold3r/latty-ds/commit/ac69fd3b990a444ea33cca1e5a465d7555f6efd3))
- **web:** add form association to lt-button ([188d226](https://github.com/penhold3r/latty-ds/commit/188d226c08338fd3aff6c47d93f65a90c6f63ebd))

### Features

- **react:** add Icon component and expose it from @latty/react ([832876a](https://github.com/penhold3r/latty-ds/commit/832876aebbad57cfe2e4891699e1104d8d500b49))
- **react:** auto-register web components on import — consumers no longer need @latty/web ([f21ac44](https://github.com/penhold3r/latty-ds/commit/f21ac44e678d0e2f6d147c3f37f9526bb921afc2))
- **react:** overhaul @latty/react package ([9a27dd8](https://github.com/penhold3r/latty-ds/commit/9a27dd8c9204723d4654ae599bafce6665ef661a))
- **web,docs,react:** add lt-calendar V2 features ([607ab9b](https://github.com/penhold3r/latty-ds/commit/607ab9b49199ca61bd85164741f666573866d81c))
- **web,docs,react:** add lt-date-input component ([03f1cb5](https://github.com/penhold3r/latty-ds/commit/03f1cb50b0785bc58708d555e6f06e683494df01))
- **web,docs:** add lt-calendar component ([b2a736c](https://github.com/penhold3r/latty-ds/commit/b2a736c99ba62b08eb7c2c388ebca2fda478e7bb))
- **web,docs:** add lt-sidepanel, lt-image, and backdrop blur/opacity features ([86a7399](https://github.com/penhold3r/latty-ds/commit/86a73993da6f9359d3fe2ea742cb7b0939b936e6))
- **web,icons,react,docs:** add lt-color-input component with hex/rgb/hsl support ([c1c9fa8](https://github.com/penhold3r/latty-ds/commit/c1c9fa8e7759f3470467cf2f2902d8448779fbc4))
- **web,react,docs:** add CJS build, move lit to peerDeps, add framework docs ([dc36e21](https://github.com/penhold3r/latty-ds/commit/dc36e214b053a0cbe8cb648a0c587969f76201b1))
- **web,react,docs:** add lt-icon-button component ([a765421](https://github.com/penhold3r/latty-ds/commit/a7654217306db7231dbd985293bfc75e0a75c1e8))
- **web,react,docs:** add textfield validation with dynamic helper text ([3b77d31](https://github.com/penhold3r/latty-ds/commit/3b77d31871f18067d26aedd31a49c116ea49fcee))
- **web:** add combobox, datepicker, empty-state, pagination, and tab-panel components ([2eac528](https://github.com/penhold3r/latty-ds/commit/2eac5286da4a8f4fe88f6f820988f5460f091e2d))
- **web:** add full-width prop to lt-button ([31e4000](https://github.com/penhold3r/latty-ds/commit/31e4000445ef9c5bd04ae9b7c13ef0f2a80485ff))
- **web:** add icon, icon-end, divider, and no-marker to lt-list and lt-list-item ([40927e0](https://github.com/penhold3r/latty-ds/commit/40927e0bfa011ffbd5a025345e0d86c1df817580))
- **web:** add lt-dropdown and lt-dropdown-item components ([560fe9e](https://github.com/penhold3r/latty-ds/commit/560fe9eba3003573f8e26fb73ce043d5f6c8de72))
- **web:** add lt-header component ([2d0e5b3](https://github.com/penhold3r/latty-ds/commit/2d0e5b36eb9c3586c6881d65d227887a7dc90737))
- **web:** add lt-slider component ([e4800a2](https://github.com/penhold3r/latty-ds/commit/e4800a291f6c834991fd450605801f6e93b7f606))
- **web:** add Navigation component (lt-nav + lt-nav-item) ([a09487b](https://github.com/penhold3r/latty-ds/commit/a09487b76b6e4dc481934c012aba8f1b5b2bbfbf))

## 0.1.0 (2026-05-06)

Initial beta release.

### Features

- React wrappers for all `@latty-ds/web` components
- Full TypeScript types generated from `custom-elements.json`
- ESM + CommonJS dual build for broad bundler compatibility
- React 18 and 19 support via peer dependency range
- Forwarded `onClick`, `onChange`, `onInput`, and other React event props
