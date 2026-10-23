# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.3.0](https://github.com/penhold3r/latty-ds/compare/v1.2.0...v1.3.0) (2026-10-23)

**Note:** Version bump only for package @latty-ds/tokens

# [1.1.0](https://github.com/penhold3r/latty-ds/compare/v1.0.0...v1.1.0) (2026-10-19)

### Bug Fixes

- **tokens:** bump dark-mode border-input to neutral-600 ([a55ece8](https://github.com/penhold3r/latty-ds/commit/a55ece8c4d6456f3e79057e8210cd55f5569b32a))
- **tokens:** give border-input its own step, bump light mode to neutral-300 ([2157dc6](https://github.com/penhold3r/latty-ds/commit/2157dc641f87db2db8b604afab8acdd9464e60cb))
- **tokens:** standardize the focus ring to 2px width, 2px offset ([c65e1a4](https://github.com/penhold3r/latty-ds/commit/c65e1a401729369b477b1da7bcdb694a9b37cd5d))

### Features

- **tokens:** add --lt-shadow-rgb token, clear remaining raw-color ratchet ([088afa2](https://github.com/penhold3r/latty-ds/commit/088afa2dc164a7cf2daa0f0564764882a20fdef1))

# [1.0.0](https://github.com/penhold3r/latty-ds/compare/v0.10.4...v1.0.0) (2026-10-09)

### Features

- **tokens:** add motion, z-index, border-input, and focus-ring tokens ([2a4aae7](https://github.com/penhold3r/latty-ds/commit/2a4aae788a9b316bebb44bedc879e5c5085ecc7f))
- **tokens:** pick on-colors and interactive fills from the palette by contrast ([7b80911](https://github.com/penhold3r/latty-ds/commit/7b8091153460e23111900977e5a9cbddf9ae36d6))

## [0.10.4](https://github.com/penhold3r/latty-ds/compare/v0.10.3...v0.10.4) (2026-09-26)

### Bug Fixes

- **config:** make tsconfigs and event casts valid on both TypeScript 5.x and 6.x ([65f18fe](https://github.com/penhold3r/latty-ds/commit/65f18fecd3abedddb24284f3e649c22c2f76808c))
- **tokens:** add contrast-safe --lt-interactive-neutral-\* semantic tokens ([c7d8e65](https://github.com/penhold3r/latty-ds/commit/c7d8e65d1dfcc23a888e6ae4fd47f52cf1849300))

## [0.10.2](https://github.com/penhold3r/latty-ds/compare/v0.10.1...v0.10.2) (2026-09-11)

### Bug Fixes

- **tokens:** fix text-muted contrast against subtle backgrounds ([5fb6e23](https://github.com/penhold3r/latty-ds/commit/5fb6e23124ca0bd703372798b62be029b911e9a0))
- **tokens:** raise specificity of explicit theme-attribute selectors ([7992006](https://github.com/penhold3r/latty-ds/commit/7992006aade270f038726b1f8891394fae09d50e))
- **tokens:** restore per-component data-theme override in generated CSS ([e2ab9ad](https://github.com/penhold3r/latty-ds/commit/e2ab9ad82c61e4241767e8fd4681a9f61b26aff9))

# [0.10.0](https://github.com/penhold3r/latty-ds/compare/v0.9.0...v0.10.0) (2026-08-08)

### Features

- **tokens:** add font.heading, elevation flat-mode, and border.contrast config options ([67584ad](https://github.com/penhold3r/latty-ds/commit/67584ad47698f61528326b245d570c5869fbecff)), closes [#12](https://github.com/penhold3r/latty-ds/issues/12) [#13](https://github.com/penhold3r/latty-ds/issues/13) [#15](https://github.com/penhold3r/latty-ds/issues/15) [#21](https://github.com/penhold3r/latty-ds/issues/21)

# [0.9.0](https://github.com/penhold3r/latty-ds/compare/v0.8.1...v0.9.0) (2026-07-23)

- feat(tokens)!: support font.family arrays, per-font fallback, and remove the FOUC hack ([8530ea5](https://github.com/penhold3r/latty-ds/commit/8530ea52632b42ea4d89ecf303851aa527b8f21d))

### BREAKING CHANGES

- --lt-typography-fontFamily is renamed to
  --lt-typography-fontFamilyPrimary. configure() no longer reads or writes
  the data-lt attribute or the FOUC guard style rule.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>

# [0.8.0](https://github.com/penhold3r/latty-ds/compare/v0.7.0...v0.8.0) (2026-07-22)

### Features

- **tokens:** accept a Google Fonts URL for font.family ([c6286d4](https://github.com/penhold3r/latty-ds/commit/c6286d4aeebe8f18d81952e7273c4196ee39e407))
- **tokens:** add configurable border width to configure() ([eced8e2](https://github.com/penhold3r/latty-ds/commit/eced8e28f6b4281158fa331f28354c9c9d5f3dd2))

# [0.7.0](https://github.com/penhold3r/latty-ds/compare/v0.6.0...v0.7.0) (2026-07-01)

**Note:** Version bump only for package @latty-ds/tokens

# [0.6.0](https://github.com/penhold3r/latty-ds/compare/v0.5.0...v0.6.0) (2026-06-20)

### Bug Fixes

- **tokens:** correct dark-mode warning text contrast ([fec4bd5](https://github.com/penhold3r/latty-ds/commit/fec4bd5fce5e93ac71ca515f75a2d10dd73131a9))

# [0.5.0](https://github.com/penhold3r/latty-ds/compare/v0.4.0...v0.5.0) (2026-06-07)

**Note:** Version bump only for package @latty-ds/tokens

# [0.4.0](https://github.com/penhold3r/latty-ds/compare/v0.3.0...v0.4.0) (2026-06-07)

**Note:** Version bump only for package @latty-ds/tokens

# [0.3.0](https://github.com/penhold3r/latty-ds/compare/v0.2.0...v0.3.0) (2026-06-07)

### Features

- **icons:** auto-register built-in icons on import ([28cd0bc](https://github.com/penhold3r/latty-ds/commit/28cd0bcc86190b5bfd71516e95c32a93e791b5e1))

# 0.2.0 (2026-06-06)

### Bug Fixes

- **tokens,web,docs:** playwright+axe a11y, primary from #ff8200, contrast fixes ([742a137](https://github.com/penhold3r/latty-ds/commit/742a1374c20a3a632bf9d905339e10063a640a64)), closes [#ff8200](https://github.com/penhold3r/latty-ds/issues/ff8200) [#ff8200](https://github.com/penhold3r/latty-ds/issues/ff8200)
- **tokens,web:** replace hardcoded palette colors with semantic tokens ([2984b77](https://github.com/penhold3r/latty-ds/commit/2984b77545085938734d86ddf3cee46946826b2e))
- **tokens,web:** replace rimraf with rm -rf in clean script; update manifest ([b5db9be](https://github.com/penhold3r/latty-ds/commit/b5db9bee6f050a1564f4c25a92868f3f60b8bd7b))
- **tokens:** handle formatHex undefined return in palette ramp ([415b17b](https://github.com/penhold3r/latty-ds/commit/415b17b8d87d928ed6194f2ccf95f271a9fa61eb))
- **tokens:** source configure() defaults from tokens.config.json ([b85827e](https://github.com/penhold3r/latty-ds/commit/b85827ec839982edbd17388ec261d4de7d5e1ff7))
- **web,tokens:** fix WCAG AA color contrast and lt-list-item role ([bab4155](https://github.com/penhold3r/latty-ds/commit/bab415570c959467a3b7ee8ca5682dadddc6ac1e))

### Features

- **docs,tokens:** add plain HTML examples and FOUC-safe configure() ([6749504](https://github.com/penhold3r/latty-ds/commit/6749504b7061f29919d24c66df719af26bb02842))
- **icons:** add Latty icon set, docs page, and /new-icon scaffold ([d5e8e02](https://github.com/penhold3r/latty-ds/commit/d5e8e022c65ebcadf3ae53a7aafce9b9d3f920be))
- **tokens,web,docs:** add dark theme with per-component override ([017f69c](https://github.com/penhold3r/latty-ds/commit/017f69cb0f52742fac7c142c88ad5ba0567c38dd))
- **tokens:** make system theme opt-in; default to 'light' ([0332d2e](https://github.com/penhold3r/latty-ds/commit/0332d2e2448b40b419fc10541ab95825af402b38))
- **tokens:** open configure() to accept arbitrary palette names ([e9495bb](https://github.com/penhold3r/latty-ds/commit/e9495bb544ada9ff2b44fbc36eb46b25e28b4d83))
- **web,docs:** add lt-sidepanel, lt-image, and backdrop blur/opacity features ([86a7399](https://github.com/penhold3r/latty-ds/commit/86a73993da6f9359d3fe2ea742cb7b0939b936e6))
- **web:** switch font to Hanken Grotesk variable with weights 200/400/600 ([6438612](https://github.com/penhold3r/latty-ds/commit/64386120869a9f82e686a19958d0d32c95c58853))
- **web:** switch font to Nobile and add uppercase small-caps prop ([acd2c79](https://github.com/penhold3r/latty-ds/commit/acd2c79f0892043c4390845007778ae8f1efb12c))

## 0.1.0 (2026-05-06)

Initial beta release.

### Features

- Design token generation from `tokens.config.json` via OKLCH color palettes
- CSS custom property output (`tokens.css`, `semantic.css`)
- JSON and JavaScript module exports (`tokens.json`, `tokens.js`)
- Runtime `configure()` API for browser-side theming without a build step
- `createStyleSheet()` for SSR token injection
- Semantic token layer mapping intent-based vars to primitives
- Spacing scale (rem + px), elevation scale, border-radius, and typography tokens
