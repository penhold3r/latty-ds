#!/usr/bin/env node
/**
 * Detects relative imports that cross package boundaries within the monorepo.
 * A cross-boundary import is any relative import (starting with ./ or ../) that,
 * when resolved from the importing file, points outside the package root.
 *
 * Run: node scripts/check-boundaries.mjs
 * Exit code: 1 if violations found, 0 if clean.
 */
import { readFileSync, readdirSync } from 'fs';
import { resolve, join, relative, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PACKAGES_DIR = join(ROOT, 'packages');

const SKIP_DIRS = new Set(['node_modules', 'dist', 'dist-scripts', '.git', '__tests__']);
const SOURCE_RE = /\.(ts|mts|cts|js|mjs|cjs)$/;
const IMPORT_RE = /(?:import|export)(?:\s[\s\S]*?\sfrom)?\s+['"]([^'"]+)['"]/g;

function findSourceFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      files.push(...findSourceFiles(full));
    } else if (entry.isFile() && SOURCE_RE.test(entry.name) && !entry.name.endsWith('.d.ts')) {
      files.push(full);
    }
  }
  return files;
}

function extractImports(content) {
  const paths = [];
  let m;
  IMPORT_RE.lastIndex = 0;
  while ((m = IMPORT_RE.exec(content)) !== null) paths.push(m[1]);
  return paths;
}

let violations = 0;

for (const pkgEntry of readdirSync(PACKAGES_DIR, { withFileTypes: true })) {
  if (!pkgEntry.isDirectory()) continue;
  const pkgRoot = join(PACKAGES_DIR, pkgEntry.name);

  for (const file of findSourceFiles(pkgRoot)) {
    const content = readFileSync(file, 'utf8');
    for (const imp of extractImports(content)) {
      if (!imp.startsWith('.')) continue;
      const resolved = resolve(dirname(file), imp);
      if (relative(pkgRoot, resolved).startsWith('..')) {
        console.error(`VIOLATION: ${relative(ROOT, file)}`);
        console.error(`  imports '${imp}' which resolves outside package root\n`);
        violations++;
      }
    }
  }
}

if (violations > 0) {
  console.error(`${violations} cross-package boundary violation(s) found.`);
  process.exit(1);
}

console.log('✓ No cross-package boundary violations found.');
