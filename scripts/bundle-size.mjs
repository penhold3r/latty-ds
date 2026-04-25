#!/usr/bin/env node
/**
 * Measures per-component gzip bundle sizes by bundling each component entry
 * with esbuild (tree-shaking on, Lit externalized) and comparing against
 * the previous run stored in bundle-report.json.
 *
 * Run:  node scripts/bundle-size.mjs
 * Flags:
 *   --update    Write results to bundle-report.json (default: only print diff)
 *   --fail-on-regression   Exit 1 if any component grew > THRESHOLD_PCT
 *
 * Exit code: 0 = clean, 1 = regressions found (when --fail-on-regression)
 */
import esbuild from 'esbuild';
import { gzipSync } from 'zlib';
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const COMPONENTS_DIR = join(ROOT, 'packages/web/src/components');
const REPORT_PATH = join(ROOT, 'bundle-report.json');

const THRESHOLD_PCT = 10;  // flag regressions larger than this %
const EXTERNAL = ['lit', 'lit/*', 'lit/decorators.js', '@lit/*', '@latty/icons'];

const UPDATE = process.argv.includes('--update');
const FAIL_ON_REGRESSION = process.argv.includes('--fail-on-regression');

// ── Load previous report ───────────────────────────────────────────────────────
const prev = existsSync(REPORT_PATH)
  ? JSON.parse(readFileSync(REPORT_PATH, 'utf8'))
  : { components: {} };

// ── Measure each component ─────────────────────────────────────────────────────
const entries = readdirSync(COMPONENTS_DIR, { withFileTypes: true })
  .filter(e => e.isDirectory())
  .map(e => ({ name: e.name, entry: join(COMPONENTS_DIR, e.name, 'index.ts') }))
  .filter(({ entry }) => existsSync(entry));

const results = {};
let regressions = 0;

console.log('\n  Component               raw (B)   gzip (B)   Δ gzip\n' +
            '  ─────────────────────────────────────────────────────');

for (const { name, entry } of entries) {
  const built = await esbuild.build({
    entryPoints: [entry],
    bundle: true,
    write: false,
    format: 'esm',
    minify: true,
    external: EXTERNAL,
    tsconfigRaw: {
      compilerOptions: {
        experimentalDecorators: true,
        useDefineForClassFields: false,
        target: 'ES2020',
      },
    },
  });

  const bytes = built.outputFiles[0].contents;
  const raw = bytes.length;
  const gzip = gzipSync(bytes).length;
  results[name] = { raw, gzip };

  const prevGzip = prev.components?.[name]?.gzip;
  let delta = '';
  let flag = '';

  if (prevGzip != null) {
    const diff = gzip - prevGzip;
    const pct = ((diff / prevGzip) * 100).toFixed(1);
    const sign = diff > 0 ? '+' : '';
    delta = `${sign}${diff} B (${sign}${pct}%)`;
    if (diff > 0 && Math.abs(Number(pct)) >= THRESHOLD_PCT) {
      flag = '  ⚠️  regression';
      regressions++;
    }
  } else {
    delta = 'new';
  }

  const col1 = name.padEnd(24);
  const col2 = String(raw).padStart(8);
  const col3 = String(gzip).padStart(9);
  console.log(`  ${col1}${col2}  ${col3}   ${delta}${flag}`);
}

// ── Summary ────────────────────────────────────────────────────────────────────
const totalGzip = Object.values(results).reduce((s, r) => s + r.gzip, 0);
const prevTotalGzip = Object.values(prev.components ?? {}).reduce((s, r) => s + (r.gzip ?? 0), 0);
const totalDiff = prevTotalGzip > 0 ? totalGzip - prevTotalGzip : null;

console.log('  ─────────────────────────────────────────────────────');
const totalLine = totalDiff != null
  ? `${totalGzip} B  (${totalDiff >= 0 ? '+' : ''}${totalDiff} B vs last run)`
  : `${totalGzip} B`;
console.log(`  Total gzip: ${totalLine}\n`);

if (regressions > 0) {
  console.warn(`  ⚠️  ${regressions} component(s) grew ≥ ${THRESHOLD_PCT}%.`);
}

// ── Write report ────────────────────────────────────────────────────────────────
if (UPDATE) {
  const report = {
    generated: new Date().toISOString(),
    totalGzip,
    components: results,
  };
  writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2) + '\n', 'utf8');
  console.log(`  ✓ bundle-report.json updated.\n`);
}

if (FAIL_ON_REGRESSION && regressions > 0) process.exit(1);
