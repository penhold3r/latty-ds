# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 0.2.0 (2026-06-06)

### Bug Fixes

- **docs:** use Vite plugin to prevent tree-shaking of src side-effect imports ([09aac40](https://github.com/penhold3r/latty-ds/commit/09aac400e22be896690b04ec73c2a5a12cf84de6))
- **icons,docs:** make lt-icon reactive to registry changes; replace hardcoded header buttons ([a00daaa](https://github.com/penhold3r/latty-ds/commit/a00daaa0925c8a95df6a473ad5776ae779c4f480))
- **web,icons:** mark src files as sideEffects so Vite doesn't tree-shake component registrations ([9dec2af](https://github.com/penhold3r/latty-ds/commit/9dec2af5856f0d5fcb96913eec78ed7daf380af3))

### Features

- **icons,web:** add tree-shaking support with per-icon and per-component entry points ([7c4c383](https://github.com/penhold3r/latty-ds/commit/7c4c38347773a2955e9d3933cbea91cc236841b1))
- **icons:** add Latty icon set, docs page, and /new-icon scaffold ([d5e8e02](https://github.com/penhold3r/latty-ds/commit/d5e8e022c65ebcadf3ae53a7aafce9b9d3f920be))
- **icons:** expand icon library from 84 to 150 icons across 9 categories ([e4252c3](https://github.com/penhold3r/latty-ds/commit/e4252c394605d014e8225127dadd6021b900e017))
- **icons:** expand icon set to 84 icons across 7 categories, drop Iconoir ([ea3727f](https://github.com/penhold3r/latty-ds/commit/ea3727f70b9bfa054d59bf863993ef2c016475a8))
- **react:** overhaul @latty/react package ([9a27dd8](https://github.com/penhold3r/latty-ds/commit/9a27dd8c9204723d4654ae599bafce6665ef661a))
- **web,icons,react,docs:** add lt-color-input component with hex/rgb/hsl support ([c1c9fa8](https://github.com/penhold3r/latty-ds/commit/c1c9fa8e7759f3470467cf2f2902d8448779fbc4))

## 0.1.0 (2026-05-06)

Initial beta release.

### Features

- `lt-icon` Web Component for displaying icons
- Pluggable `IconRegistry` with priority-based provider system
- Iconoir default provider with 30+ pre-bundled common icons (navigation, actions, UI, status, media)
- `registerIcon` / `registerIcons` for custom icon registration
- `registerProvider` for swapping the entire icon source
- Icons sized via `size` prop (`xs` | `sm` | `md` | `lg` | `xl`) and colored via `currentColor`
