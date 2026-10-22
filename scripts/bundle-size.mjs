#!/usr/bin/env node
/**
 * Measures per-component gzip bundle sizes by bundling each component entry
 * with esbuild (tree-shaking on, the shared runtime externalized) and comparing
 * against the previous run stored in bundle-report.json.
 *
 * Run:  node scripts/bundle-size.mjs
 * Flags:
 *   --update    Write results to bundle-report.json (default: only print diff)
 *   --fail-on-regression   Exit 1 if any component grew > THRESHOLD_PCT
 *
 * Exit code: 0 = clean, 1 = regressions found (when --fail-on-regression)
 *
 * Two numbers live in the report, and they mean different things:
 *
 *   components  What each component contributes to a consumer's bundle, on its own — the
 *               per-component regression guard. The shared runtime is external here, exactly as
 *               it is in the published build, so this is the code the component owns.
 *   shared      The shared runtime the consumer pulls in *once* and every component shares. It is
 *               measured as the package uses it — tree-shaken to the parts actually reached —
 *               because that is what lands in a consumer's bundle, instead of one copy per
 *               component.
 *
 * totalGzip is the two added together: what a consumer using every component carries, with the
 * shared parts counted once.
 */
import esbuild from 'esbuild';
import { gzipSync } from 'zlib';
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { logger } from '@latty-ds/utils';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const COMPONENTS_DIR = join(ROOT, 'packages/web/src/components');
const WEB_DIR = join(ROOT, 'packages/web');
const REPORT_PATH = join(ROOT, 'bundle-report.json');

const THRESHOLD_PCT = 10; // flag regressions larger than this %
const EXTERNAL = ['lit', 'lit/*', 'lit/decorators.js', '@lit/*', '@latty-ds/icons', '@floating-ui/dom'];

/**
 * The runtime the package leaves external, and the parts of it the package actually uses.
 *
 * `@floating-ui/dom` used to be inlined into each of the four popup components — four copies of
 * the same 16 kB, inside the package and again in every consumer's bundle. It is now a shared
 * dependency: the consumer's bundler resolves it once and the four components share that copy.
 *
 * Each entry names the package and the imports the design system actually reaches for, so the
 * measured size is the tree-shaken one a consumer ends up carrying.
 */
const SHARED = {
  '@floating-ui/dom': ['computePosition', 'autoUpdate', 'offset', 'flip', 'shift']
};

const UPDATE = process.argv.includes('--update');
const FAIL_ON_REGRESSION = process.argv.includes('--fail-on-regression');

// ── Load previous report ───────────────────────────────────────────────────────
const prev = existsSync(REPORT_PATH) ? JSON.parse(readFileSync(REPORT_PATH, 'utf8')) : { components: {} };

// ── Measure each component ─────────────────────────────────────────────────────
const entries = readdirSync(COMPONENTS_DIR, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => ({ name: e.name, entry: join(COMPONENTS_DIR, e.name, 'index.ts') }))
  .filter(({ entry }) => existsSync(entry));

const results = {};
let regressions = 0;

process.stdout.write(
  '\n  Component               raw (B)   gzip (B)   Δ gzip\n' +
    '  ─────────────────────────────────────────────────────\n'
);

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
        target: 'ES2020'
      }
    }
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
  process.stdout.write(`  ${col1}${col2}  ${col3}   ${delta}${flag}\n`);
}

// ── Measure the shared runtime ─────────────────────────────────────────────────
const sharedResults = {};

for (const [name, imports] of Object.entries(SHARED)) {
  const built = await esbuild.build({
    stdin: {
      contents: `export { ${imports.join(', ')} } from '${name}';`,
      resolveDir: WEB_DIR,
      loader: 'ts'
    },
    bundle: true,
    write: false,
    format: 'esm',
    minify: true,
    external: EXTERNAL.filter((dep) => dep !== name),
    tsconfigRaw: {
      compilerOptions: {
        experimentalDecorators: true,
        useDefineForClassFields: false,
        target: 'ES2020'
      }
    }
  });

  const bytes = built.outputFiles[0].contents;
  sharedResults[name] = { raw: bytes.length, gzip: gzipSync(bytes).length };
}

// ── Summary ────────────────────────────────────────────────────────────────────
const componentGzip = Object.values(results).reduce((s, r) => s + r.gzip, 0);
const sharedGzip = Object.values(sharedResults).reduce((s, r) => s + r.gzip, 0);
const totalGzip = componentGzip + sharedGzip;

const prevComponentGzip = Object.values(prev.components ?? {}).reduce((s, r) => s + (r.gzip ?? 0), 0);
const prevSharedGzip = Object.values(prev.shared ?? {}).reduce((s, r) => s + (r.gzip ?? 0), 0);
const prevTotalGzip = prevComponentGzip + prevSharedGzip;

const totalDiff = prevTotalGzip > 0 ? totalGzip - prevTotalGzip : null;
const totalLine =
  totalDiff != null ? `${totalGzip} B  (${totalDiff >= 0 ? '+' : ''}${totalDiff} B vs last run)` : `${totalGzip} B`;

process.stdout.write('  ─────────────────────────────────────────────────────\n');
for (const [name, { raw, gzip }] of Object.entries(sharedResults)) {
  process.stdout.write(`  ${`shared: ${name}`.padEnd(24)}${String(raw).padStart(8)}  ${String(gzip).padStart(9)}\n`);
}
process.stdout.write(`  Component code: ${componentGzip} B gzip\n`);
process.stdout.write(`  Shared runtime: ${sharedGzip} B gzip\n`);
process.stdout.write(`  Total gzip: ${totalLine}\n\n`);

if (regressions > 0) {
  logger.warn(`${regressions} component(s) grew ≥ ${THRESHOLD_PCT}%.`);
}

// ── Write report ────────────────────────────────────────────────────────────────
if (UPDATE) {
  const report = {
    generated: new Date().toISOString(),
    totalGzip,
    componentGzip,
    sharedGzip,
    shared: sharedResults,
    components: results
  };
  writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2) + '\n', 'utf8');
  logger.success('bundle-report.json updated.');
}

if (FAIL_ON_REGRESSION && regressions > 0) process.exit(1);
