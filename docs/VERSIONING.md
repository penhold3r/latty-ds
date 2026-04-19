# Documentation Versioning

This document explains how to manage multiple versions of the Latty documentation.

## Current Approach

The documentation uses a simple path-based versioning system:

- Latest version: `/` (root)
- Previous versions: `/v{major}.{minor}/` (e.g., `/v0.9/`, `/v0.8/`)

## Publishing a New Version

When releasing a new major or minor version:

### 1. Archive Current Version

Before building the new version, archive the current documentation:

```bash
# Build current docs
pnpm docs:build

# Copy dist to a versioned folder
cp -r docs/dist docs/dist-archive/v1.0
```

### 2. Update Version Switcher

Edit `docs/src/components/VersionSwitcher.astro` to add the new version:

```typescript
const versions = [
  { label: 'v1.1 (latest)', value: 'v1.1', path: '/' },
  { label: 'v1.0', value: 'v1.0', path: '/v1.0/' },
  // ...
];
```

### 3. Deploy All Versions

Deploy the archived versions alongside the new build:

```bash
# Example with static hosting
cp -r docs/dist-archive/v1.0 docs/dist/v1.0
# Now deploy docs/dist
```

## Alternative: Using Git Tags

For a more automated approach, you can:

1. Tag documentation releases in git (e.g., `docs-v1.0`)
2. Use a deployment script that builds from each tag
3. Automatically merge outputs into a single deployment

## Future Enhancement

Consider using a tool like **Docusaurus** if you need:
- Automatic version management
- Built-in version dropdown
- Separate versioned sidebars
- Version-specific configuration

The current manual approach works well for smaller projects with infrequent major releases.
