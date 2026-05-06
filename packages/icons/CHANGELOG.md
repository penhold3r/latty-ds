# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 0.1.0 (2026-05-06)

Initial beta release.

### Features

- `lt-icon` Web Component for displaying icons
- Pluggable `IconRegistry` with priority-based provider system
- Iconoir default provider with 30+ pre-bundled common icons (navigation, actions, UI, status, media)
- `registerIcon` / `registerIcons` for custom icon registration
- `registerProvider` for swapping the entire icon source
- Icons sized via `size` prop (`xs` | `sm` | `md` | `lg` | `xl`) and colored via `currentColor`
