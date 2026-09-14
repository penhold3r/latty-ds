# @latty-ds/docs

Docusaurus-based documentation site for the Latty Design System. Provides a live component playground, full API reference, token explorer, and getting-started guides.

**Live site:** https://latty-ds.com

## Development

Run from the repo root (requires `pnpm install` first):

```bash
pnpm docs:dev      # Start the Docusaurus dev server at localhost:3000
pnpm docs:build    # Build for production
pnpm docs:preview  # Preview the production build locally
```

## Deployment

Deployed automatically to GitHub Pages by `.github/workflows/deploy-docs.yml` on every push to `main` — no manual deploy step needed.
