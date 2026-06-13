# @latty-ds/docs

Astro-based documentation site for the Latty Design System. Provides a live component playground, full API reference, token explorer, and getting-started guides.

**Live site:** https://latty-ds.com

## Development

Run from the repo root (requires `pnpm install` first):

```bash
pnpm docs:dev      # Start the Astro dev server at localhost:4321
pnpm docs:build    # Build for production
pnpm docs:preview  # Preview the production build locally
```

The dev server hot-reloads `.astro` pages and component logic automatically. If you add or rename a component prop, restart with `pnpm dev` (not `pnpm docs:dev`) to trigger manifest and token rebuilds first.

## Structure

```text
src/
  pages/
    index.mdx                 # Homepage
    getting-started/          # Installation and setup guides
    tokens/                   # Design token reference
    components/               # One directory per component
    frameworks/               # Framework-specific guides
  layouts/
    BaseLayout/               # Page shell (sidebar + topbar)
  components/
    ComponentPlayground/      # Interactive prop editor with event log and URL sharing
    ApiTable/                 # Component API reference table (reads manifest.json)
    CodeSnippet/              # Syntax-highlighted code blocks
    Sidebar/                  # Collapsible navigation
  plugins/
    rehype-prefix-links.mjs   # Prefixes local hrefs/srcs with BASE_PATH
    rehype-lt-text.mjs        # Replaces <p> elements with <lt-text> in MDX
  styles/
    global.css                # Base styles and token imports
```

## Rehype plugins

- **`rehype-prefix-links`** — rewrites relative `href` and `src` attributes with `BASE_PATH` so links resolve correctly when deployed to a GitHub Pages subpath (`/latty-ds`).
- **`rehype-lt-text`** — swaps plain `<p>` tags for `<lt-text>` in MDX output so all body copy uses the design system typography component.

## Deployment

The site deploys automatically to GitHub Pages on every push to `main` via `.github/workflows/deploy-docs.yml`. The workflow sets `SITE_URL=https://latty-ds.com` and `BASE_PATH=/`. No manual step needed.
