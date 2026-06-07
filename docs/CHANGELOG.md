# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.5.0](https://github.com/penhold3r/latty-ds/compare/v0.4.0...v0.5.0) (2026-06-07)

**Note:** Version bump only for package @latty-ds/docs

# [0.4.0](https://github.com/penhold3r/latty-ds/compare/v0.3.0...v0.4.0) (2026-06-07)

### Bug Fixes

- **docs:** replace custom version-badge span with lt-badge component ([4705b8b](https://github.com/penhold3r/latty-ds/commit/4705b8bb82ec77114cccd86ac5afa3b2dbcfa8a1))

# [0.3.0](https://github.com/penhold3r/latty-ds/compare/v0.2.0...v0.3.0) (2026-06-07)

### Features

- **icons:** auto-register built-in icons on import ([28cd0bc](https://github.com/penhold3r/latty-ds/commit/28cd0bcc86190b5bfd71516e95c32a93e791b5e1))

# 0.2.0 (2026-06-06)

### Bug Fixes

- **docs,web:** audit and sync playground controls with component attrs ([b58478a](https://github.com/penhold3r/latty-ds/commit/b58478a6c85c1e5daefab963a11af358931ef3ed))
- **docs:** cap prose width and fix GitHub header link ([87a7888](https://github.com/penhold3r/latty-ds/commit/87a7888bc809c79a1e6c929d9f0716630fa762d9))
- **docs:** correct sidebar nav hierarchy — items smaller than section label ([a8d1a7e](https://github.com/penhold3r/latty-ds/commit/a8d1a7e1bf1a69af1eaf65c73b0fe1439ef8e135))
- **docs:** expand prose section to full width ([6c0c9c4](https://github.com/penhold3r/latty-ds/commit/6c0c9c4582679f995992723b5001ff9a418d48b2))
- **docs:** fix a11y violations in component playground pages ([36a74b6](https://github.com/penhold3r/latty-ds/commit/36a74b673bdbcfacab366eee65ea59ab28bebe85))
- **docs:** fix hero contrast on coffee-shop — light text on dark gradient ([c14ab24](https://github.com/penhold3r/latty-ds/commit/c14ab248974654358c500b06e2247a68ce432851))
- **docs:** indent sidebar nav items deeper than section label ([ead7690](https://github.com/penhold3r/latty-ds/commit/ead769021640320ccc11541aa1ae92376e68727b))
- **docs:** inject tokens via SSR to eliminate configure() FOUC ([2ef8f4a](https://github.com/penhold3r/latty-ds/commit/2ef8f4a7c3a780ab7bb64628723a6cb995e6ead9))
- **docs:** make sidebar section label a bold title above nav links ([0fc10f6](https://github.com/penhold3r/latty-ds/commit/0fc10f6d5c6a79b68976932d79c81f04092c2b2b))
- **docs:** make site/base path configurable via env vars ([d76cb84](https://github.com/penhold3r/latty-ds/commit/d76cb846d84ab01e7d2b1b9c10b1ebde544769ad))
- **docs:** mobile-first responsive layout ([1c4fc66](https://github.com/penhold3r/latty-ds/commit/1c4fc66cc9adff7b78e48ce4b907364e99600910))
- **docs:** prefix all internal links with BASE_URL for GitHub Pages ([8967f28](https://github.com/penhold3r/latty-ds/commit/8967f28f5315ed9e5134a465730756a7f6e23a46))
- **docs:** prefix MDX prose links with base path for GitHub Pages ([a5a6c51](https://github.com/penhold3r/latty-ds/commit/a5a6c51c49e245c437d719ee752337cdb3fc8b34))
- **docs:** rename all overview routes to introduction, fix dark-mode contrast ([202bfdf](https://github.com/penhold3r/latty-ds/commit/202bfdf45ead0c1b2223d4a24a9b2942a413081f)), closes [#6A737](https://github.com/penhold3r/latty-ds/issues/6A737) [#9ba7b5](https://github.com/penhold3r/latty-ds/issues/9ba7b5)
- **docs:** render hero banner title at correct display-lg weight ([651e2dd](https://github.com/penhold3r/latty-ds/commit/651e2ddab4dbaf880bbb58cd1ef0185beea4e510))
- **docs:** use Vite plugin to prevent tree-shaking of src side-effect imports ([09aac40](https://github.com/penhold3r/latty-ds/commit/09aac400e22be896690b04ec73c2a5a12cf84de6))
- **icons,docs:** make lt-icon reactive to registry changes; replace hardcoded header buttons ([a00daaa](https://github.com/penhold3r/latty-ds/commit/a00daaa0925c8a95df6a473ad5776ae779c4f480))
- **tokens,web,docs:** playwright+axe a11y, primary from #ff8200, contrast fixes ([742a137](https://github.com/penhold3r/latty-ds/commit/742a1374c20a3a632bf9d905339e10063a640a64)), closes [#ff8200](https://github.com/penhold3r/latty-ds/issues/ff8200) [#ff8200](https://github.com/penhold3r/latty-ds/issues/ff8200)
- **web,docs:** achieve WCAG 2 AA across all 18 a11y tests in light + dark mode ([6f6ac53](https://github.com/penhold3r/latty-ds/commit/6f6ac53fe908ec16108c202d6fc6c51acfa0ba48))
- **web,docs:** align header content with page layout ([84dc5c5](https://github.com/penhold3r/latty-ds/commit/84dc5c554fbba6413e9ba2d964f70b7e1a58992c))
- **web,docs:** guard updated() lifecycle calls and fix radio-group aria-label ([b9a9cc8](https://github.com/penhold3r/latty-ds/commit/b9a9cc8a0802b5b4fb013bd8fafe190a1b149cd3))
- **web:** add form association to lt-button ([188d226](https://github.com/penhold3r/latty-ds/commit/188d226c08338fd3aff6c47d93f65a90c6f63ebd))
- **web:** fix accordion focus ring and sidebar item density ([397e0c1](https://github.com/penhold3r/latty-ds/commit/397e0c12448ffcaf4bc0c4320450c071027da685))
- **web:** make lt-nav-item colors context-aware ([2940569](https://github.com/penhold3r/latty-ds/commit/2940569cee99888b84fbf40c0f2918ed5a4c6bac))

### Features

- **docs,tokens:** add plain HTML examples and FOUC-safe configure() ([6749504](https://github.com/penhold3r/latty-ds/commit/6749504b7061f29919d24c66df719af26bb02842))
- **docs,web:** enhance ComponentPlayground with event log, URL sharing, and variant presets ([4d19cac](https://github.com/penhold3r/latty-ds/commit/4d19cacf2cbfff6c5682896cf2112255500f30cf))
- **docs:** add Ember coffee shop example site with a11y audit tooling ([4a13f3a](https://github.com/penhold3r/latty-ds/commit/4a13f3aea6df489d635bb1bb8d4168a4432fbfaa))
- **docs:** add favicon, OG image, and replace logo assets ([09c6be8](https://github.com/penhold3r/latty-ds/commit/09c6be8b4981277e01cb92eb86265f0955824e98))
- **docs:** add Recipes section with 6 composed UI pattern pages ([26d7900](https://github.com/penhold3r/latty-ds/commit/26d79007a261e37a0d11e63693bd7f34a485b3f6))
- **docs:** github pages config ([4a9cf7f](https://github.com/penhold3r/latty-ds/commit/4a9cf7ffeacb529ff1e7d84d919dec585eb63fa6))
- **docs:** replace all plain HTML tables with lt-table ([05fe702](https://github.com/penhold3r/latty-ds/commit/05fe7029eefe753480d6b94630ef7a081b8c8366))
- **docs:** replace markdown tables in MDX pages with lt-table ([ed947fb](https://github.com/penhold3r/latty-ds/commit/ed947fb807db44d5166ee0b9b1093ff2e6215fe4))
- **docs:** replace mobile nav with lt-sidepanel and add footer ([afcb595](https://github.com/penhold3r/latty-ds/commit/afcb595ec82ef50761b36f07e35480c4f06e6c61))
- **docs:** replace spacing scale div-grid with lt-table ([914ef3a](https://github.com/penhold3r/latty-ds/commit/914ef3a65a3c7864d7b6039c2e55fddb52fded11))
- **docs:** show package version badge in header ([57dd0e0](https://github.com/penhold3r/latty-ds/commit/57dd0e09cb7061fa9026a14e3bf1186baeaea404))
- **docs:** use lt-text and lt-button on homepage hero ([091fa52](https://github.com/penhold3r/latty-ds/commit/091fa52139b84f1b21efe836efce8cfe0cf3c605))
- **icons,web:** add tree-shaking support with per-icon and per-component entry points ([7c4c383](https://github.com/penhold3r/latty-ds/commit/7c4c38347773a2955e9d3933cbea91cc236841b1))
- **icons:** add Latty icon set, docs page, and /new-icon scaffold ([d5e8e02](https://github.com/penhold3r/latty-ds/commit/d5e8e022c65ebcadf3ae53a7aafce9b9d3f920be))
- **icons:** expand icon library from 84 to 150 icons across 9 categories ([e4252c3](https://github.com/penhold3r/latty-ds/commit/e4252c394605d014e8225127dadd6021b900e017))
- **icons:** expand icon set to 84 icons across 7 categories, drop Iconoir ([ea3727f](https://github.com/penhold3r/latty-ds/commit/ea3727f70b9bfa054d59bf863993ef2c016475a8))
- **react:** add Icon component and expose it from @latty/react ([832876a](https://github.com/penhold3r/latty-ds/commit/832876aebbad57cfe2e4891699e1104d8d500b49))
- **tokens,web,docs:** add dark theme with per-component override ([017f69c](https://github.com/penhold3r/latty-ds/commit/017f69cb0f52742fac7c142c88ad5ba0567c38dd))
- **tokens:** make system theme opt-in; default to 'light' ([0332d2e](https://github.com/penhold3r/latty-ds/commit/0332d2e2448b40b419fc10541ab95825af402b38))
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
- **web:** add icon, icon-end, divider, and no-marker to lt-list and lt-list-item ([40927e0](https://github.com/penhold3r/latty-ds/commit/40927e0bfa011ffbd5a025345e0d86c1df817580))
- **web:** add lt-dropdown and lt-dropdown-item components ([560fe9e](https://github.com/penhold3r/latty-ds/commit/560fe9eba3003573f8e26fb73ce043d5f6c8de72))
- **web:** add lt-header component ([2d0e5b3](https://github.com/penhold3r/latty-ds/commit/2d0e5b36eb9c3586c6881d65d227887a7dc90737))
- **web:** add lt-link component ([4a38126](https://github.com/penhold3r/latty-ds/commit/4a3812690b453e04bf17dbee109cb2a414e329ab))
- **web:** add lt-slider component ([e4800a2](https://github.com/penhold3r/latty-ds/commit/e4800a291f6c834991fd450605801f6e93b7f606))
- **web:** add lt-text component with 15 typographic variants ([6a41cda](https://github.com/penhold3r/latty-ds/commit/6a41cdac1217a5d077bea9200727fa2c2307dbf3))
- **web:** add Navigation component (lt-nav + lt-nav-item) ([a09487b](https://github.com/penhold3r/latty-ds/commit/a09487b76b6e4dc481934c012aba8f1b5b2bbfbf))
- **web:** switch font to Hanken Grotesk variable with weights 200/400/600 ([6438612](https://github.com/penhold3r/latty-ds/commit/64386120869a9f82e686a19958d0d32c95c58853))
- **web:** switch font to Nobile and add uppercase small-caps prop ([acd2c79](https://github.com/penhold3r/latty-ds/commit/acd2c79f0892043c4390845007778ae8f1efb12c))
