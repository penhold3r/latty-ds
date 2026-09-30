#!/usr/bin/env node
/**
 * Confirms each public package's main entry actually loads under Node's native ESM resolver — not just a
 * bundler's (X7). `@latty-ds/icons` previously shipped extension-less relative imports from a plain `tsc`
 * build, which `import()`  fails to resolve outside a bundler; `@latty-ds/web` and `@latty-ds/react` failed
 * the same way transitively, since both import icons.
 *
 * Run from each package's own directory (not the repo root, which doesn't declare these as dependencies) so
 * `import('@latty-ds/<pkg>')` resolves exactly the way a real consumer's bare specifier would.
 *
 * Run: node scripts/check-esm-smoke.mjs
 * Exit code: 1 if any package fails to load, 0 if clean.
 */
import { spawnSync } from 'child_process';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { logger } from '@latty-ds/utils';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const PACKAGES = [
  { name: '@latty-ds/tokens', dir: 'packages/tokens' },
  { name: '@latty-ds/icons', dir: 'packages/icons' },
  { name: '@latty-ds/web', dir: 'packages/web' },
  { name: '@latty-ds/react', dir: 'packages/react' }
];

let failures = 0;

for (const { name, dir } of PACKAGES) {
  const result = spawnSync(process.execPath, ['-e', `await import('${name}')`], {
    cwd: join(ROOT, dir),
    encoding: 'utf8'
  });

  if (result.status === 0) {
    logger.success(`${name} — Node ESM import OK`);
  } else {
    logger.error(`${name} — Node ESM import FAILED`);
    logger.error(result.stderr.trim());
    failures++;
  }
}

if (failures > 0) {
  logger.error(`${failures} package(s) failed to load under Node's native ESM resolver.`);
  process.exit(1);
}

logger.success('All public packages load correctly under Node ESM.');
