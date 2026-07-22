# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
