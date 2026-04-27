# Latty

> A lattice is an invisible grid that gives things their shape. Latty is that grid for your product.

Framework-agnostic design system built on design tokens and Web Components. One token change updates every component, in every framework.

## Packages

| Package | Description |
| --- | --- |
| `@latty/tokens` | Design tokens → CSS variables, JSON, and JS exports |
| `@latty/web` | Web Components (`lt-` prefix, built with Lit) |
| `@latty/icons` | Icon components with pluggable provider system |
| `@latty/react` | React wrappers for web components |
| `@latty/angular` | Angular wrappers for web components |
| `@latty/utils` | Shared utilities |

## Quick start

```bash
pnpm add @latty/tokens @latty/web
```

```js
import '@latty/tokens/dist/tokens.css';
import '@latty/web';
```

```html
<lt-button variant="primary">Save changes</lt-button>
<lt-textfield label="Email" type="email" required></lt-textfield>
```

## Development

Requires Node.js >= 24 and pnpm.

```bash
pnpm install
pnpm dev          # Start docs site at localhost:4321
pnpm test         # Run all tests
pnpm build        # Build all packages
```

See [CLAUDE.md](CLAUDE.md) for full command reference and architecture details.

## License

MIT
