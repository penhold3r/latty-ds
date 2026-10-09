# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.0.0](https://github.com/penhold3r/latty-ds/compare/v0.10.4...v1.0.0) (2026-10-09)

### Bug Fixes

- **web:** add forced-colors support to radio, switch, slider, progress (X6) ([78f86bd](https://github.com/penhold3r/latty-ds/commit/78f86bd20b94ee813e91deb0db4a292371c1b469))
- **web:** add prefers-reduced-motion support to 25 components (X6) ([4bb4d95](https://github.com/penhold3r/latty-ds/commit/4bb4d9526112af4c503392e7d1573760c68221c4))
- **web:** associate lt-textfield's label with its input, describe it with helper text ([c3d075b](https://github.com/penhold3r/latty-ds/commit/c3d075b3c2b8a493e1ec23bba1b52de6400e7abf))
- **web:** clamp lt-slider's value, compute its thumb offset in pure CSS ([2c4fe0f](https://github.com/penhold3r/latty-ds/commit/2c4fe0f010bad035c720fb1e18991c1cc1b180c3))
- **web:** close out the keyboard/ARIA batch (radio, dropdown, combobox, tabs) ([72f216c](https://github.com/penhold3r/latty-ds/commit/72f216c14aee8fb2ec3cdea4de821b19b97506d4))
- **web:** convert physical CSS properties to logical ones for RTL (X5) ([7aa24cb](https://github.com/penhold3r/latty-ds/commit/7aa24cbd3e9e0dbed8ff91bb30e6e1e6760c3f8d))
- **web:** derive lt-calendar/lt-date-input week-start from locale (X5) ([e90a337](https://github.com/penhold3r/latty-ds/commit/e90a337cd2c7213fd094f9596eadd115970f0df4))
- **web:** expose nav group open/closed state to assistive tech ([c1a9b27](https://github.com/penhold3r/latty-ds/commit/c1a9b275f11d10959488d2fe25f79c6e21683bdb))
- **web:** finish the audit's robustness batch (alert, progress, table) ([4d32ffd](https://github.com/penhold3r/latty-ds/commit/4d32ffd58ea9163197ba15f609a95b66b28bd3eb))
- **web:** fix calendar roving tabindex, keyboard nav, and disabled-day focus ([1efde10](https://github.com/penhold3r/latty-ds/commit/1efde1008a743879022383045bba179006bfa16c))
- **web:** fix lt-button's form association, add name/value/formaction ([c0b0c8a](https://github.com/penhold3r/latty-ds/commit/c0b0c8afab76c6b33f8eceb71d2b74fd20604194))
- **web:** fix lt-sidepanel CSS bugs found via live-browser verification ([c4e182d](https://github.com/penhold3r/latty-ds/commit/c4e182dcbb57b9845f687f98500bd42c866308fa))
- **web:** forward native validity into lt-datepicker's ElementInternals ([3c57fd8](https://github.com/penhold3r/latty-ds/commit/3c57fd8a5012b1a25a285c4474eae1411f2fe618))
- **web:** forward native validity into lt-textfield's ElementInternals ([9cbd48d](https://github.com/penhold3r/latty-ds/commit/9cbd48dcee7d490504e190612123862d84e5c5c6))
- **web:** harden components against bad input and undersized targets ([44ca860](https://github.com/penhold3r/latty-ds/commit/44ca86017a26c59ee4ca8410575d8db639db67c6))
- **web:** implement formDisabledCallback across all form controls ([9435556](https://github.com/penhold3r/latty-ds/commit/94355560c9259d1bd92ec8ae1e24642fced0842c))
- **web:** implement the ARIA tabs pattern for lt-tab-group ([acc845d](https://github.com/penhold3r/latty-ds/commit/acc845d0ccb9682467004e602a9cc087735d588d))
- **web:** keep focus on the select/combobox control, not its options ([95a8b70](https://github.com/penhold3r/latty-ds/commit/95a8b7041cf93e2b083bf6a03c5c5123fa4ba67a))
- **web:** keep text on lt-alert and lt-snackbar fills at full opacity ([37f8427](https://github.com/penhold3r/latty-ds/commit/37f84276475d4800b25877059661b4f24bdbae7a))
- **web:** link helper text to its control with aria-describedby ([d0bd734](https://github.com/penhold3r/latty-ds/commit/d0bd734a6b44a94b12e371c1af93325d43049047))
- **web:** make lt-tooltip's text reach the accessibility tree ([59679a0](https://github.com/penhold3r/latty-ds/commit/59679a08fe3aed83bcbed8c06cb2e6a7ffb4c664))
- **web:** make radios group correctly with or without lt-radio-group ([b551a12](https://github.com/penhold3r/latty-ds/commit/b551a12b62b1140a4fc862729f0c2e2cc2e4f507))
- **web:** make the password show/hide toggle keyboard and screen-reader operable ([63f7077](https://github.com/penhold3r/latty-ds/commit/63f70778da3e03a9de87a2a0b8f0e5fde0983e82))
- **web:** prevent default on Escape in combobox/date-input dropdowns ([3431db0](https://github.com/penhold3r/latty-ds/commit/3431db08345e1ed3a7c1a4676840260edc98a574))
- **web:** remove dead ./shared export from package.json (X7) ([1c5af51](https://github.com/penhold3r/latty-ds/commit/1c5af515abc9ab84ca30d95d6d83dc5ca96bc5bc))
- **web:** rename lt-dialog/lt-alert's title prop to heading ([b6186c1](https://github.com/penhold3r/latty-ds/commit/b6186c10d3ba87b80758c119f8237f5d2ab08d8b))
- **web:** render lt-tooltip in the top layer so it isn't hidden by an open dialog ([60e05da](https://github.com/penhold3r/latty-ds/commit/60e05da7fd66f3ab25fbc27562b7719f4abfa1fc))
- **web:** stop loading/disabled buttons from leaking clicks to the host ([bf6d737](https://github.com/penhold3r/latty-ds/commit/bf6d737400b3cde9681670f9cdc6933991146a0e))
- **web:** stop lt-datepicker's native input/change from double-firing ([9004ef7](https://github.com/penhold3r/latty-ds/commit/9004ef78b681b3ad8b3d37bd54af684ab3f1caa7))
- **web:** stop lt-snackbar emitting hide on mount ([64b948d](https://github.com/penhold3r/latty-ds/commit/64b948ddb16d94a038b1f18b74868a4db876a34e))
- **web:** stop lt-tab pointing aria-controls at panels that don't exist ([2e6fe2e](https://github.com/penhold3r/latty-ds/commit/2e6fe2e9829011a4f66c8466f387071fdbd92086))
- **web:** stop reflecting value/checked on form controls, fix reset defaults ([2d01f47](https://github.com/penhold3r/latty-ds/commit/2d01f4752688cb8b5ecd8d1fa07b7027a9ecb241))
- **web:** submit the form on Enter in lt-textfield ([7d5025e](https://github.com/penhold3r/latty-ds/commit/7d5025e810acda5e57207e08a4c24b345fbd3e62))
- **web:** use theme-aware tokens instead of raw palette colors ([d1abb63](https://github.com/penhold3r/latty-ds/commit/d1abb63b4a9bc13d67c3cd54c4775b8986ab1860))

- feat(web)!: make lt-select's value an array when multiple is set ([0dba3b7](https://github.com/penhold3r/latty-ds/commit/0dba3b71cdc9e1bda32cf0e943e14310ab422ea0))
- feat(web)!: make lt-sidepanel's anchor and lt-tooltip's placement logical (X5) ([3994ec3](https://github.com/penhold3r/latty-ds/commit/3994ec3cfda8dd3c868dccfad637a5518a62437b))
- feat(web)!: make lt-table's column align logical, not physical (X5) ([8fa9f93](https://github.com/penhold3r/latty-ds/commit/8fa9f935da2f8c0ab3bd825e3a994ee3b42b9311))

### Features

- **web:** add clearable and counter to lt-textfield ([48e19cd](https://github.com/penhold3r/latty-ds/commit/48e19cd14f04cb25831fd01a9e6d8156f471c5ff))
- **web:** add i18n labels prop to alert, breadcrumb, chip, dialog, sidepanel, snackbar (X5) ([887e474](https://github.com/penhold3r/latty-ds/commit/887e474abf5720119334d973701685b8a0613482))
- **web:** add i18n labels prop to calendar (X5) ([341dc1e](https://github.com/penhold3r/latty-ds/commit/341dc1e0cbe409133e5f7133586487c9619d2fe8))
- **web:** add i18n labels prop to checkbox, color-input, radio, select, switch (X5) ([5baf0b9](https://github.com/penhold3r/latty-ds/commit/5baf0b9be08467777abfb025d6e85783c905f28e))
- **web:** add i18n labels prop to combobox, date-input, textfield (X5) ([f7e2666](https://github.com/penhold3r/latty-ds/commit/f7e2666788dcb7ffdbe0d3e681441a28eaa03c4a))
- **web:** add i18n labels prop to pagination (X5) ([822db70](https://github.com/penhold3r/latty-ds/commit/822db70df8d758089472f5564a7e211715cd5c97))
- **web:** migrate lt-dialog to a native <dialog> element ([dd57141](https://github.com/penhold3r/latty-ds/commit/dd57141a36e39db93e1fb93ba405cf723f54f364))
- **web:** migrate lt-sidepanel to a native <dialog> element ([e8e96d6](https://github.com/penhold3r/latty-ds/commit/e8e96d6e41c59b2a168f217129eedd894da3504e))
- **web:** migrate lt-snackbar to a native popover (SNK-6) ([6772135](https://github.com/penhold3r/latty-ds/commit/677213560ccece1d71437a7b1018595ebfea5156))
- **web:** use native-shaped event names ([afcf232](https://github.com/penhold3r/latty-ds/commit/afcf2327d18e1a892ef9ac4a870ffbe330e0ee6f))
- **web:** warn in development when a component is missing its accessible name ([16ccc38](https://github.com/penhold3r/latty-ds/commit/16ccc387edd49d27ef4d785de83b8d46c20ba85c))

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

- CellAlign changes from 'left' | 'center' | 'right' to
  'start' | 'center' | 'end'. Per user decision: numeric/currency columns
  using align should flip to the reading-end side in RTL rather than staying
  pinned to a physical edge, consistent with the rest of this component's
  own default alignment (already converted to text-align: start in the
  RTL logical-properties pass, 7aa24cb).

Renamed the data-align attribute values and their CSS selectors
(`th/td[data-align='right']` -> `[data-align='end']`, text-align: right ->
end) to match, and updated every internal consumer: table.ts's default
fallback, its own JSDoc example, the table test suite, and the docs site's
SpacingTable (a real lt-table consumer using align: 'right' for its
numeric step column — not caught by typechecking since its columns ref is
typed unknown[], so needed a manual sweep). Live-verified: an 'end'-
aligned column still renders right-aligned in today's LTR-only pages.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VVmMnZua36PpJGtPtgA6T8

## [0.10.4](https://github.com/penhold3r/latty-ds/compare/v0.10.3...v0.10.4) (2026-09-26)

### Bug Fixes

- **config:** make tsconfigs and event casts valid on both TypeScript 5.x and 6.x ([65f18fe](https://github.com/penhold3r/latty-ds/commit/65f18fecd3abedddb24284f3e649c22c2f76808c))
- **web:** meet WCAG AA contrast for neutral buttons, solid neutral badges and calendar outside days ([d4b3f4b](https://github.com/penhold3r/latty-ds/commit/d4b3f4b316f3e7357fd3cc645e8d1eb20c0da21f))

## [0.10.3](https://github.com/penhold3r/latty-ds/compare/v0.10.2...v0.10.3) (2026-09-26)

### Bug Fixes

- **web:** fix breadcrumb list semantics, icon-button anchor color, header on-primary text ([2478767](https://github.com/penhold3r/latty-ds/commit/2478767dd262a8fc5bfde82a0d2425a0d4e648f2))
- **web:** fix lt-list's <ul>/<ol> not validly containing lt-list-item (a11y) ([db3f06d](https://github.com/penhold3r/latty-ds/commit/db3f06dd9adb4ce8ad632b435478cb072b3b8dfb))
- **web:** fix nonexistent icon names in lt-combobox and lt-pagination ([26257fb](https://github.com/penhold3r/latty-ds/commit/26257fbc4475b5028b24d10b304d6dd923074647))

## [0.10.1](https://github.com/penhold3r/latty-ds/compare/v0.10.0...v0.10.1) (2026-08-08)

### Bug Fixes

- **web:** route latty.css's baseline body font-family through the token ([0579e73](https://github.com/penhold3r/latty-ds/commit/0579e737602d41c98000281a0db064a28e5525b8)), closes [#12](https://github.com/penhold3r/latty-ds/issues/12) [#22](https://github.com/penhold3r/latty-ds/issues/22)

# [0.10.0](https://github.com/penhold3r/latty-ds/compare/v0.9.0...v0.10.0) (2026-08-08)

### Features

- **web:** add elevation/appearance/bordered props and CSS override hooks ([f4219c8](https://github.com/penhold3r/latty-ds/commit/f4219c82b4a21aa0d1e4d7bfdefcb988112d7d08))

# [0.9.0](https://github.com/penhold3r/latty-ds/compare/v0.8.1...v0.9.0) (2026-07-23)

- fix(web)!: rename --lt-typography-fontFamily to fontFamilyPrimary in component styles ([4ed93c8](https://github.com/penhold3r/latty-ds/commit/4ed93c8c8c738598a4b52e6b08ceb70a53537a57))

### BREAKING CHANGES

- consumers overriding --lt-typography-fontFamily directly
  need to switch to --lt-typography-fontFamilyPrimary.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>

## [0.8.1](https://github.com/penhold3r/latty-ds/compare/v0.8.0...v0.8.1) (2026-07-22)

**Note:** Version bump only for package @latty-ds/web

# [0.8.0](https://github.com/penhold3r/latty-ds/compare/v0.7.0...v0.8.0) (2026-07-22)

### Bug Fixes

- **web:** make surface background prop write the custom property the styles read ([76909aa](https://github.com/penhold3r/latty-ds/commit/76909aae884e1fb8d41e45c1fb9d466dcf012c75))
- **web:** stop native change/input events double-firing on the host ([9275899](https://github.com/penhold3r/latty-ds/commit/9275899969a2b8521b99bc780c505e4d07084677))
- **web:** wire --lt-typography-fontFamily into component styles ([1c19cfa](https://github.com/penhold3r/latty-ds/commit/1c19cfa10e2c6edb316db6548a00dcf66cb89879))

### Features

- **web:** add aria forwarding, ghost appearance, and themeable min-width to buttons ([5d3645c](https://github.com/penhold3r/latty-ds/commit/5d3645c62aca128cf33330c097efd6dc72ad2fbc))
- **web:** add error fallback, load events, and lazy loading to image ([d68a033](https://github.com/penhold3r/latty-ds/commit/d68a033ce50df98fabd94b2fbd8dab5201eb4d5d))
- **web:** add interactive clickable and href rows to list-item ([50ab265](https://github.com/penhold3r/latty-ds/commit/50ab2651b3ff53145671a98e86c9dd21d5ec359f))
- **web:** support SPA routers in nav-item via cancelable click and aria-current ([143acc0](https://github.com/penhold3r/latty-ds/commit/143acc0c3f1cb76fd7d751f5b13a341b832cef56))
- **web:** theme control-chrome border widths via --lt-border-width ([2fbe922](https://github.com/penhold3r/latty-ds/commit/2fbe922d8f487d9b83a12097632ee6b523d987a2))

# [0.7.0](https://github.com/penhold3r/latty-ds/compare/v0.6.0...v0.7.0) (2026-07-01)

### Bug Fixes

- **web:** stop list-item flex layout fragmenting rich content ([b7063f1](https://github.com/penhold3r/latty-ds/commit/b7063f11909845e52d5eaabe2c606f8ea7e110ec))

# [0.6.0](https://github.com/penhold3r/latty-ds/compare/v0.5.0...v0.6.0) (2026-06-20)

### Bug Fixes

- **web:** guard floating-overlay cleanup race and dropdown background ([6f5c5dd](https://github.com/penhold3r/latty-ds/commit/6f5c5ddbca991fe78d1ad359b63ff0eeb581cd2f))

# [0.5.0](https://github.com/penhold3r/latty-ds/compare/v0.4.0...v0.5.0) (2026-06-07)

**Note:** Version bump only for package @latty-ds/web

# [0.4.0](https://github.com/penhold3r/latty-ds/compare/v0.3.0...v0.4.0) (2026-06-07)

### Features

- **web,react:** add property reflection, event standardization, and form association ([e015945](https://github.com/penhold3r/latty-ds/commit/e0159451d6f32e6780bb6bf280a8b66af13ad8bc))

# [0.3.0](https://github.com/penhold3r/latty-ds/compare/v0.2.0...v0.3.0) (2026-06-07)

### Features

- **icons:** auto-register built-in icons on import ([28cd0bc](https://github.com/penhold3r/latty-ds/commit/28cd0bcc86190b5bfd71516e95c32a93e791b5e1))

# 0.2.0 (2026-06-06)

### Bug Fixes

- **docs,web:** audit and sync playground controls with component attrs ([b58478a](https://github.com/penhold3r/latty-ds/commit/b58478a6c85c1e5daefab963a11af358931ef3ed))
- **docs:** correct sidebar nav hierarchy — items smaller than section label ([a8d1a7e](https://github.com/penhold3r/latty-ds/commit/a8d1a7e1bf1a69af1eaf65c73b0fe1439ef8e135))
- **docs:** make sidebar section label a bold title above nav links ([0fc10f6](https://github.com/penhold3r/latty-ds/commit/0fc10f6d5c6a79b68976932d79c81f04092c2b2b))
- **docs:** rename all overview routes to introduction, fix dark-mode contrast ([202bfdf](https://github.com/penhold3r/latty-ds/commit/202bfdf45ead0c1b2223d4a24a9b2942a413081f)), closes [#6A737](https://github.com/penhold3r/latty-ds/issues/6A737) [#9ba7b5](https://github.com/penhold3r/latty-ds/issues/9ba7b5)
- **docs:** use Vite plugin to prevent tree-shaking of src side-effect imports ([09aac40](https://github.com/penhold3r/latty-ds/commit/09aac400e22be896690b04ec73c2a5a12cf84de6))
- **icons,docs:** make lt-icon reactive to registry changes; replace hardcoded header buttons ([a00daaa](https://github.com/penhold3r/latty-ds/commit/a00daaa0925c8a95df6a473ad5776ae779c4f480))
- **tokens,web,docs:** playwright+axe a11y, primary from #ff8200, contrast fixes ([742a137](https://github.com/penhold3r/latty-ds/commit/742a1374c20a3a632bf9d905339e10063a640a64)), closes [#ff8200](https://github.com/penhold3r/latty-ds/issues/ff8200) [#ff8200](https://github.com/penhold3r/latty-ds/issues/ff8200)
- **tokens,web:** replace hardcoded palette colors with semantic tokens ([2984b77](https://github.com/penhold3r/latty-ds/commit/2984b77545085938734d86ddf3cee46946826b2e))
- **tokens,web:** replace rimraf with rm -rf in clean script; update manifest ([b5db9be](https://github.com/penhold3r/latty-ds/commit/b5db9bee6f050a1564f4c25a92868f3f60b8bd7b))
- **web,docs:** achieve WCAG 2 AA across all 18 a11y tests in light + dark mode ([6f6ac53](https://github.com/penhold3r/latty-ds/commit/6f6ac53fe908ec16108c202d6fc6c51acfa0ba48))
- **web,docs:** align header content with page layout ([84dc5c5](https://github.com/penhold3r/latty-ds/commit/84dc5c554fbba6413e9ba2d964f70b7e1a58992c))
- **web,docs:** guard updated() lifecycle calls and fix radio-group aria-label ([b9a9cc8](https://github.com/penhold3r/latty-ds/commit/b9a9cc8a0802b5b4fb013bd8fafe190a1b149cd3))
- **web,icons:** mark src files as sideEffects so Vite doesn't tree-shake component registrations ([9dec2af](https://github.com/penhold3r/latty-ds/commit/9dec2af5856f0d5fcb96913eec78ed7daf380af3))
- **web,tokens:** fix WCAG AA color contrast and lt-list-item role ([bab4155](https://github.com/penhold3r/latty-ds/commit/bab415570c959467a3b7ee8ca5682dadddc6ac1e))
- **web:** add form association to lt-button ([188d226](https://github.com/penhold3r/latty-ds/commit/188d226c08338fd3aff6c47d93f65a90c6f63ebd))
- **web:** align list-item inner flex to flex-start for multi-line slot content ([d91dd4f](https://github.com/penhold3r/latty-ds/commit/d91dd4fadb5f4f0a6dd2ce585b701396ac64fa0c))
- **web:** fix accordion focus ring and sidebar item density ([397e0c1](https://github.com/penhold3r/latty-ds/commit/397e0c12448ffcaf4bc0c4320450c071027da685))
- **web:** fix anchor color contrast in lt-button dark mode ([347dd79](https://github.com/penhold3r/latty-ds/commit/347dd79f1b915fb81911e94ec7fa86246d2aae60)), closes [#f3f3f3](https://github.com/penhold3r/latty-ds/issues/f3f3f3)
- **web:** fix checkbox checkmark centering ([efbfa9e](https://github.com/penhold3r/latty-ds/commit/efbfa9e4a17a3a30a64fe47b7bf6cb57300534df))
- **web:** fix lt-surface outlined variant ignoring background-color prop ([2017755](https://github.com/penhold3r/latty-ds/commit/2017755546b1b61a0e8a293238879289f64df289))
- **web:** fix vi.fn() type in click-outside test ([1bc7572](https://github.com/penhold3r/latty-ds/commit/1bc757289b0c74bd0ed406af84a3a77d5cf21ee8))
- **web:** include prop descriptions in manifest.json for API tables ([90d529b](https://github.com/penhold3r/latty-ds/commit/90d529b5a5aceb81b1ea9bc5f725264070a7ceeb))
- **web:** make lt-nav-item colors context-aware ([2940569](https://github.com/penhold3r/latty-ds/commit/2940569cee99888b84fbf40c0f2918ed5a4c6bac))
- **web:** remove superfluous li wrapper from lt-list-item ([5455f83](https://github.com/penhold3r/latty-ds/commit/5455f83313f50158ab6e2bb5cd0ff60fc0e3c4f5))
- **web:** unify label styles across all input components and fix date-input dropdown positioning ([2e0fb65](https://github.com/penhold3r/latty-ds/commit/2e0fb650ea76b5d731e26120a3b08f79b93d6d3d))

### Features

- **docs,tokens:** add plain HTML examples and FOUC-safe configure() ([6749504](https://github.com/penhold3r/latty-ds/commit/6749504b7061f29919d24c66df719af26bb02842))
- **docs,web:** enhance ComponentPlayground with event log, URL sharing, and variant presets ([4d19cac](https://github.com/penhold3r/latty-ds/commit/4d19cacf2cbfff6c5682896cf2112255500f30cf))
- **docs:** add Ember coffee shop example site with a11y audit tooling ([4a13f3a](https://github.com/penhold3r/latty-ds/commit/4a13f3aea6df489d635bb1bb8d4168a4432fbfaa))
- **docs:** add favicon, OG image, and replace logo assets ([09c6be8](https://github.com/penhold3r/latty-ds/commit/09c6be8b4981277e01cb92eb86265f0955824e98))
- **docs:** add Recipes section with 6 composed UI pattern pages ([26d7900](https://github.com/penhold3r/latty-ds/commit/26d79007a261e37a0d11e63693bd7f34a485b3f6))
- **icons,web:** add tree-shaking support with per-icon and per-component entry points ([7c4c383](https://github.com/penhold3r/latty-ds/commit/7c4c38347773a2955e9d3933cbea91cc236841b1))
- **icons:** add Latty icon set, docs page, and /new-icon scaffold ([d5e8e02](https://github.com/penhold3r/latty-ds/commit/d5e8e022c65ebcadf3ae53a7aafce9b9d3f920be))
- **icons:** expand icon set to 84 icons across 7 categories, drop Iconoir ([ea3727f](https://github.com/penhold3r/latty-ds/commit/ea3727f70b9bfa054d59bf863993ef2c016475a8))
- **react:** overhaul @latty/react package ([9a27dd8](https://github.com/penhold3r/latty-ds/commit/9a27dd8c9204723d4654ae599bafce6665ef661a))
- **tokens,web,docs:** add dark theme with per-component override ([017f69c](https://github.com/penhold3r/latty-ds/commit/017f69cb0f52742fac7c142c88ad5ba0567c38dd))
- **web,docs,react:** add lt-calendar V2 features ([607ab9b](https://github.com/penhold3r/latty-ds/commit/607ab9b49199ca61bd85164741f666573866d81c))
- **web,docs,react:** add lt-date-input component ([03f1cb5](https://github.com/penhold3r/latty-ds/commit/03f1cb50b0785bc58708d555e6f06e683494df01))
- **web,docs:** add Forma Studio example site and fix switch dark-mode colors ([9f06eb9](https://github.com/penhold3r/latty-ds/commit/9f06eb989b0f5408fd64d2620ba80e275a10d1de))
- **web,docs:** add lt-calendar component ([b2a736c](https://github.com/penhold3r/latty-ds/commit/b2a736c99ba62b08eb7c2c388ebca2fda478e7bb))
- **web,docs:** add lt-sidepanel, lt-image, and backdrop blur/opacity features ([86a7399](https://github.com/penhold3r/latty-ds/commit/86a73993da6f9359d3fe2ea742cb7b0939b936e6))
- **web,docs:** expose CSS custom properties for component-level style overrides ([a6e2cd8](https://github.com/penhold3r/latty-ds/commit/a6e2cd84161ee634d9c72f190c6503c6544c1a32))
- **web,icons,react,docs:** add lt-color-input component with hex/rgb/hsl support ([c1c9fa8](https://github.com/penhold3r/latty-ds/commit/c1c9fa8e7759f3470467cf2f2902d8448779fbc4))
- **web,react,docs:** add CJS build, move lit to peerDeps, add framework docs ([dc36e21](https://github.com/penhold3r/latty-ds/commit/dc36e214b053a0cbe8cb648a0c587969f76201b1))
- **web,react,docs:** add lt-icon-button component ([a765421](https://github.com/penhold3r/latty-ds/commit/a7654217306db7231dbd985293bfc75e0a75c1e8))
- **web,react,docs:** add textfield validation with dynamic helper text ([3b77d31](https://github.com/penhold3r/latty-ds/commit/3b77d31871f18067d26aedd31a49c116ea49fcee))
- **web:** add breadcrumb, divider, progress, skeleton components ([33a8ecf](https://github.com/penhold3r/latty-ds/commit/33a8ecf0a8bb0ded7d000b0c18dbb0f5627ffe08))
- **web:** add clean variant to lt-accordion; adopt in docs sidebar ([d13aba4](https://github.com/penhold3r/latty-ds/commit/d13aba407de818e5f2f442fb90e63ab396fcb125))
- **web:** add combobox, datepicker, empty-state, pagination, and tab-panel components ([2eac528](https://github.com/penhold3r/latty-ds/commit/2eac5286da4a8f4fe88f6f820988f5460f091e2d))
- **web:** add fluid responsive font sizes and --lt-text-weight to lt-text ([94aa9bb](https://github.com/penhold3r/latty-ds/commit/94aa9bb4b376d4d607ae89b5f6f213d6282e4575))
- **web:** add full-width prop to lt-button ([31e4000](https://github.com/penhold3r/latty-ds/commit/31e4000445ef9c5bd04ae9b7c13ef0f2a80485ff))
- **web:** add href prop to lt-button for anchor rendering ([29dccab](https://github.com/penhold3r/latty-ds/commit/29dccabec5c7e9f4682a4eccdb3f97c55b2afe08))
- **web:** add icon, icon-end, divider, and no-marker to lt-list and lt-list-item ([40927e0](https://github.com/penhold3r/latty-ds/commit/40927e0bfa011ffbd5a025345e0d86c1df817580))
- **web:** add lt-dropdown and lt-dropdown-item components ([560fe9e](https://github.com/penhold3r/latty-ds/commit/560fe9eba3003573f8e26fb73ce043d5f6c8de72))
- **web:** add lt-header component ([2d0e5b3](https://github.com/penhold3r/latty-ds/commit/2d0e5b36eb9c3586c6881d65d227887a7dc90737))
- **web:** add lt-link component ([4a38126](https://github.com/penhold3r/latty-ds/commit/4a3812690b453e04bf17dbee109cb2a414e329ab))
- **web:** add lt-slider component ([e4800a2](https://github.com/penhold3r/latty-ds/commit/e4800a291f6c834991fd450605801f6e93b7f606))
- **web:** add lt-text component with 15 typographic variants ([6a41cda](https://github.com/penhold3r/latty-ds/commit/6a41cdac1217a5d077bea9200727fa2c2307dbf3))
- **web:** add Navigation component (lt-nav + lt-nav-item) ([a09487b](https://github.com/penhold3r/latty-ds/commit/a09487b76b6e4dc481934c012aba8f1b5b2bbfbf))
- **web:** adopt lt-text across components for consistent typography ([e6839a0](https://github.com/penhold3r/latty-ds/commit/e6839a0d870a3d47cbf8d868c998aedbda62ea8e))
- **web:** animate lt-dialog open and close ([43e2382](https://github.com/penhold3r/latty-ds/commit/43e2382769988ef1ebfda1b068ecf263d9d5b51b))
- **web:** integrate @floating-ui/dom + Popover API for floating panels ([8ff557d](https://github.com/penhold3r/latty-ds/commit/8ff557da19608eab65df7b7181fc270e6e8cc7e4))
- **web:** support JSON string attributes on lt-table for SSR use ([8da78b9](https://github.com/penhold3r/latty-ds/commit/8da78b9262a550f0dd08ea91578d319e3ccd0b7c))
- **web:** switch font to Hanken Grotesk variable with weights 200/400/600 ([6438612](https://github.com/penhold3r/latty-ds/commit/64386120869a9f82e686a19958d0d32c95c58853))
- **web:** switch font to Nobile and add uppercase small-caps prop ([acd2c79](https://github.com/penhold3r/latty-ds/commit/acd2c79f0892043c4390845007778ae8f1efb12c))

## 0.1.0 (2026-05-06)

Initial beta release.

### Features

- 30+ Lit-based Web Components with `lt-` prefix
- Full design token integration via `--lt-*` CSS custom properties
- Accordion, Alert, Avatar, Badge, Breadcrumb, Button, Checkbox, Chip, Dialog, Divider, Dropdown, Header, Link, List, Nav, Progress, Radio, RadioGroup, Select, Skeleton, Slider, Snackbar, Spinner, Surface, Switch, Tab, TabGroup, Table, Text, Textfield, Tooltip
- Icon support via `@latty-ds/icons` integration on Button and Textfield
- Reflected attributes for all reactive properties
- Shadow DOM encapsulation with CSS part exposure
- Custom Elements Manifest (`custom-elements.json`) for tooling integration
- Nobile font bundled in `dist/fonts/`
