# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
