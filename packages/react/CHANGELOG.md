# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.6.0](https://github.com/penhold3r/latty-ds/compare/v1.5.0...v1.6.0) (2026-10-30)

### Features

- **icons:** add label prop for a11y and registerProvider for external icon libraries ([90c0baf](https://github.com/penhold3r/latty-ds/commit/90c0baff0807018989ab0d0034cdd03d23725107))
- **web:** add shape prop to lt-avatar-group ([a047093](https://github.com/penhold3r/latty-ds/commit/a047093a3c043fe9448ad000e4de7137448cabd3))

# [1.5.0](https://github.com/penhold3r/latty-ds/compare/v1.4.0...v1.5.0) (2026-10-28)

**Note:** Version bump only for package @latty-ds/react

# [1.4.0](https://github.com/penhold3r/latty-ds/compare/v1.3.0...v1.4.0) (2026-10-28)

### Bug Fixes

- **config:** add skipLibCheck to base tsconfig ([542a64a](https://github.com/penhold3r/latty-ds/commit/542a64a198c41bd6fe45ab9155242317056081a4))

# [1.3.0](https://github.com/penhold3r/latty-ds/compare/v1.2.0...v1.3.0) (2026-10-23)

### Features

- **react:** expose native HTML attribute types and normalize props ([b68766d](https://github.com/penhold3r/latty-ds/commit/b68766dbc0e859701f6daf16f0af2b39d5e2e139))
- **web:** move the form-association plumbing into a shared base class ([e5ef339](https://github.com/penhold3r/latty-ds/commit/e5ef3397261d552074f106b7b912a5a82025fb59))

# [1.2.0](https://github.com/penhold3r/latty-ds/compare/v1.1.0...v1.2.0) (2026-10-19)

### Bug Fixes

- **react:** suppress hydration warnings from Lit's reflected default attributes ([2ba7d51](https://github.com/penhold3r/latty-ds/commit/2ba7d513bc94f4dc3e048b40834aa926f25aa25e)), closes [#2](https://github.com/penhold3r/latty-ds/issues/2)

- feat(web)!: split lt-textfield's min/max into real native min/max/minLength/maxLength ([a5d7b4a](https://github.com/penhold3r/latty-ds/commit/a5d7b4a56b90b7c7ee9c6abb3e10a8d5c9a0779d)), closes [#6](https://github.com/penhold3r/latty-ds/issues/6)

### Reverts

- Revert "chore(release): publish v2.0.0" ([32f6ab2](https://github.com/penhold3r/latty-ds/commit/32f6ab263b9add1b40811cb7d5ecfebd526a26ed))

### BREAKING CHANGES

- a consumer using lt-textfield's `max` as a character-length
  limit on a non-numeric type must migrate to `maxLength` (same for `min` ->
  `minLength`). `min`/`max` themselves are unchanged for type="number".

Also fixes a matching pre-existing gap this surfaced: `cem analyze` never
records an explicit `attribute: '...'` override, so both the React wrapper
codegen (scripts/codegen-wrappers.mjs) and the docs manifest generator
(packages/web/scripts/build-manifest.mjs) guess a property's attribute name
via kebab-case — wrong for any property deliberately given a true native
spelling instead. The wrapper codegen already had an override table for
button.ts's formAction; the manifest generator didn't, so the docs site's
API table and Playground already mislabeled formaction's control, and the
Playground's React-tab code generator (docs/src/components/
ComponentPlayground/ComponentPlayground.script.ts) already emitted the
wrong prop casing there too. Both now carry a matching override table,
covering formAction and the two new properties.

# [1.1.0](https://github.com/penhold3r/latty-ds/compare/v1.0.0...v1.1.0) (2026-10-19)

### Bug Fixes

- **react:** fix SSR/hydration attribute casing, boolean removal, and missing Icon export ([c6f6959](https://github.com/penhold3r/latty-ds/commit/c6f69590576cf0c39e115b9c7b4c388d67d068e4))

### Features

- **web:** add autocomplete, prefix/suffix and autosize to lt-textfield ([7a3dd90](https://github.com/penhold3r/latty-ds/commit/7a3dd90a099bb6d0ee0c070c8388806b851fa2cd))
- **web:** add autofocus to lt-textfield ([3f67471](https://github.com/penhold3r/latty-ds/commit/3f67471715e4a3b208ce2f9d594ef83823821cd4))
- **web:** add caption and sticky-header to lt-table ([a7431b8](https://github.com/penhold3r/latty-ds/commit/a7431b8e61d62a6b37538426959ef0d20a6a8494))
- **web:** add clearable to lt-select and lt-combobox ([b7b4731](https://github.com/penhold3r/latty-ds/commit/b7b4731273c3d0b406843778e86110cbbe04a82b))
- **web:** add click-to-scroll buttons to lt-tab-group ([b0c83a9](https://github.com/penhold3r/latty-ds/commit/b0c83a99b9f92242653d54525751a93796a34e19))
- **web:** add column resize to lt-table ([992798c](https://github.com/penhold3r/latty-ds/commit/992798c567f41977c4486d237a76a0c87cf46ef0))
- **web:** add creatable (create-new) to lt-combobox ([7062f02](https://github.com/penhold3r/latty-ds/commit/7062f02c17bf17390a3551b1202fe0ee93f57414))
- **web:** add default slot and max (count overflow) to lt-badge ([e4390ec](https://github.com/penhold3r/latty-ds/commit/e4390ec0ee03832d2c8e22f5b00bc0e91e66bce9))
- **web:** add delay to lt-tooltip ([1d66c15](https://github.com/penhold3r/latty-ds/commit/1d66c155612a87d188fe0db7d412b67b79914589))
- **web:** add hoverable to lt-tooltip ([1758c75](https://github.com/penhold3r/latty-ds/commit/1758c75e0326484b2d9462601b2dd84edfe448cb))
- **web:** add loading state to lt-select and lt-combobox ([da862ed](https://github.com/penhold3r/latty-ds/commit/da862ed9ab0d0c6f5f15ad753c99bb4fde2d084e))
- **web:** add lt-accordion-group for exclusive/multiple accordion groups ([adbbee3](https://github.com/penhold3r/latty-ds/commit/adbbee33fcfe88545314b905f970b43d2aba9366))
- **web:** add lt-avatar-group for overlapping avatar stacks ([3fe81f8](https://github.com/penhold3r/latty-ds/commit/3fe81f83b5cc7fd033af6af8de5cf6a07fc773bc))
- **web:** add lt-snackbar-group for queued/stacked toasts ([f8f8cb1](https://github.com/penhold3r/latty-ds/commit/f8f8cb17b71468a3944d3786696c5c01e67bc88d))
- **web:** add multiple/tags mode to lt-combobox ([7437778](https://github.com/penhold3r/latty-ds/commit/74377780a239ec3e8cf2346643f322241734a590))
- **web:** add pagination coupling to lt-table ([6eaf7db](https://github.com/penhold3r/latty-ds/commit/6eaf7db7c23fbe23aa2fc5f9f7af1a57b897784f))
- **web:** add presence status dot to lt-avatar ([9032bb4](https://github.com/penhold3r/latty-ds/commit/9032bb48d51a0df18a4c869e9bfaa73f54bf5c85))
- **web:** add presets to lt-calendar ([8980cc4](https://github.com/penhold3r/latty-ds/commit/8980cc420224937f7865a03e0cf3c1de537c5a53))
- **web:** add rich label content and helper-text to checkbox, switch, radio ([def0803](https://github.com/penhold3r/latty-ds/commit/def08037f566dd93babb437eb13114f40c37c7df))
- **web:** add row selection to lt-table ([71fd09b](https://github.com/penhold3r/latty-ds/commit/71fd09b83d0ab4abb019806f7949c6f94868519f))
- **web:** add row virtualization to lt-table ([3f6da43](https://github.com/penhold3r/latty-ds/commit/3f6da43f5b4249bf72cee8529b3a35a09a7a8633))
- **web:** add rowclick event to lt-table ([3386c16](https://github.com/penhold3r/latty-ds/commit/3386c16bfccd8650afaa5df78119322705ccb685))
- **web:** add selectable (filter-chip) mode and Backspace-to-delete to lt-chip ([8be1081](https://github.com/penhold3r/latty-ds/commit/8be10816062d8ec284023eeede5c1e35e4c9bb83))
- **web:** add srcset, sizes, and aspect-ratio to lt-image ([244b819](https://github.com/penhold3r/latty-ds/commit/244b819e58f4c7676d29b9c4563597c98ba81d1f))
- **web:** add toggle mode and loading-label to lt-button ([bf276c1](https://github.com/penhold3r/latty-ds/commit/bf276c1f56409f2585bcb5afa7b39e5fa907abf4))
- **web:** add touch to lt-tooltip ([e556a57](https://github.com/penhold3r/latty-ds/commit/e556a57ff7e8ef7d879ce1952efd108f188b4226))
- **web:** add underline, target, rel, and download to lt-link ([8fb6098](https://github.com/penhold3r/latty-ds/commit/8fb6098c9c1f810cdfc1978e53e581e325f38c11))
- **web:** add vertical orientation to lt-tab-group ([5a2b8e1](https://github.com/penhold3r/latty-ds/commit/5a2b8e14046a526b1e00b29b7a11b011939feea0))
- **web:** add week numbers to lt-calendar ([a146f5b](https://github.com/penhold3r/latty-ds/commit/a146f5b2f4aaa509f0b9f73e5e58a0a5ce877c3a))

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
