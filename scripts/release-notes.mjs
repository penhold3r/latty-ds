#!/usr/bin/env node
/**
 * Builds the GitHub release body for a published version out of the repo CHANGELOG, so every `v*` tag gets
 * release notes without hand-writing them. `.github/workflows/publish.yml` runs this after a successful
 * publish; it can also be run locally to preview the notes for a release.
 *
 * The body has three parts, in order:
 *   1. Which packages actually shipped at this version (lerna uses fixed versioning, but a package with no
 *      changes in the range keeps its previous version and is not republished).
 *   2. That version's CHANGELOG section — fixes, features, breaking changes.
 *   3. A compare link to the previous tag.
 *
 * Run: node scripts/release-notes.mjs [--version <x.y.z>] [--out <file>]
 *   --version  Version to describe (default: the tag in GITHUB_REF_NAME, else `git describe`).
 *   --out      Write the notes to this file (default: stdout).
 * Exit code: 0 even when the version has no CHANGELOG section — a tag must never go unreleased just because
 * its notes are missing; the gap is reported as a warning and the compare link is still emitted.
 */
import { readFileSync, writeFileSync } from 'fs';
import { spawnSync } from 'child_process';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { logger } from '@latty-ds/utils';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const CHANGELOG = join(ROOT, 'CHANGELOG.md');

// The four packages lerna versions and publishes; `@latty-ds/utils` and the docs site are private.
const PUBLIC_PACKAGES = ['web', 'react', 'icons', 'tokens'];

const REPO_URL = 'https://github.com/penhold3r/latty-ds';

// Commit trailers leak into some CHANGELOG bodies (a breaking-change description that quoted the commit
// message); they mean nothing to a release reader.
const TRAILER_RE = /^(Co-Authored-By|Claude-Session|Signed-off-by):/;

/** Reads `--flag value` / `--flag=value` style arguments. */
function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith('--')) continue;
    const [key, inline] = arg.slice(2).split('=');
    args[key] = inline ?? argv[++i];
  }
  return args;
}

/**
 * Splits the CHANGELOG into one section per version. Headings are not consistently levelled — most are
 * `# [1.2.3](compare) (date)` but a handful of 0.x releases use `##` — so the level is not part of the match.
 */
function readSections(markdown) {
  const lines = markdown.split('\n');
  const heading = /^#{1,3}\s+\[?(\d+\.\d+\.\d+)\]?(?:\(([^)]*)\))?\s*\((\d{4}-\d{2}-\d{2})\)\s*$/;

  const starts = [];
  lines.forEach((line, index) => {
    const match = line.match(heading);
    if (match) starts.push({ index, version: match[1], compare: match[2] ?? '' });
  });

  const sections = new Map();
  starts.forEach((start, i) => {
    const end = i + 1 < starts.length ? starts[i + 1].index : lines.length;
    const body = lines
      .slice(start.index + 1, end)
      .filter((line) => !TRAILER_RE.test(line.trim()))
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    sections.set(start.version, { compare: start.compare, body });
  });

  return sections;
}

/**
 * Versions of the public packages as committed at the tag being released. The tag is the source of truth
 * rather than the working tree, so this also produces correct notes locally on a branch that has moved on.
 */
function readPackageVersions(version) {
  const tag = `v${version}`;

  const fromTag = (pkg) => {
    const shown = spawnSync('git', ['show', `${tag}:packages/${pkg}/package.json`], { cwd: ROOT, encoding: 'utf8' });
    if (shown.status !== 0) return null;
    return JSON.parse(shown.stdout);
  };

  const fromWorkingTree = (pkg) => {
    try {
      return JSON.parse(readFileSync(join(ROOT, 'packages', pkg, 'package.json'), 'utf8'));
    } catch {
      return null;
    }
  };

  return PUBLIC_PACKAGES.map((pkg) => fromTag(pkg) ?? fromWorkingTree(pkg))
    .filter(Boolean)
    .map((manifest) => ({ name: manifest.name, version: manifest.version }));
}

function resolveVersion(explicit) {
  if (explicit) return explicit;
  const ref = process.env.GITHUB_REF_NAME ?? '';
  if (/^v\d+\.\d+\.\d+$/.test(ref)) return ref.slice(1);
  const described = spawnSync('git', ['describe', '--tags', '--abbrev=0'], { cwd: ROOT, encoding: 'utf8' });
  const tag = described.stdout?.trim() ?? '';
  return tag.replace(/^v/, '');
}

/** The tag immediately preceding `version`, used for the compare link when the heading has none. */
function previousTag(version) {
  const tags = spawnSync('git', ['tag', '--sort=v:refname'], { cwd: ROOT, encoding: 'utf8' })
    .stdout.split('\n')
    .map((tag) => tag.trim())
    .filter((tag) => /^v\d+\.\d+\.\d+$/.test(tag));
  const index = tags.indexOf(`v${version}`);
  return index > 0 ? tags[index - 1] : '';
}

function buildNotes(version) {
  const section = readSections(readFileSync(CHANGELOG, 'utf8')).get(version);
  const packages = readPackageVersions(version);

  const shipped = packages.filter((pkg) => pkg.version === version).map((pkg) => `${pkg.name}@${version}`);
  const held = packages
    .filter((pkg) => pkg.version !== version)
    .map((pkg) => `${pkg.name} unchanged at ${pkg.version}`);

  const parts = [];
  if (shipped.length) {
    parts.push(`Published to npm: ${shipped.join(', ')}${held.length ? ` (${held.join(', ')})` : ''}`);
  }

  if (!section?.body) {
    logger.warn(`No CHANGELOG section for ${version} — releasing with a compare link only.`);
    parts.push('_No changelog entry recorded for this release._');
  } else {
    parts.push(section.body);
  }

  // The first release has no predecessor to compare against, so it carries no compare link.
  const compare =
    section?.compare || (previousTag(version) && `${REPO_URL}/compare/${previousTag(version)}...v${version}`);
  if (compare) parts.push(`**Full Changelog**: ${compare}`);

  return `${parts.join('\n\n')}\n`;
}

const args = parseArgs(process.argv.slice(2));
const version = resolveVersion(args.version);

if (!/^\d+\.\d+\.\d+$/.test(version)) {
  logger.error(`Could not determine a version to release (got "${version}") — pass --version <x.y.z>.`);
  process.exit(1);
}

const notes = buildNotes(version);

if (args.out) {
  writeFileSync(args.out, notes);
  logger.success(`Release notes for ${version} written to ${args.out}`);
} else {
  process.stdout.write(notes);
}
