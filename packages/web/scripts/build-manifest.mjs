/**
 * Transforms custom-elements.json (CEM) → dist/manifest.json
 *
 * manifest.json is consumed by ComponentPlayground.astro to render
 * live controls. Each entry maps a tag name to a list of members:
 *
 *   { "lt-chip": { "members": [
 *     { "name": "variant", "type": "select", "options": [...], "default": "primary" },
 *     { "name": "disabled", "type": "boolean", "default": false }
 *   ]}}
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const cem = JSON.parse(readFileSync(join(root, 'custom-elements.json'), 'utf8'));

/** Parse union string literals from a *.types.ts source file. */
function resolveUnion(typeName, componentDir) {
  const typesFile = join(root, 'src/components', componentDir, `${componentDir}.types.ts`);
  if (!existsSync(typesFile)) return null;
  const src = readFileSync(typesFile, 'utf8');
  const match = src.match(new RegExp(`export type ${typeName}\\s*=\\s*([^;]+);`));
  if (!match) return null;
  return [...match[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
}

/** Enumerate all icon names from the @latty/icons source directory. */
function getIconNames() {
  const iconsRoot = resolve(__dirname, '../../icons/src/icons');
  if (!existsSync(iconsRoot)) return [];
  return readdirSync(iconsRoot, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .flatMap((d) => {
      const catDir = join(iconsRoot, d.name);
      return readdirSync(catDir)
        .filter((f) => f.endsWith('.ts') && f !== 'index.ts')
        .map((f) => f.replace(/\.ts$/, ''));
    })
    .sort();
}

/** Convert camelCase property name to kebab-case attribute name (Lit convention). */
function toAttrName(propName) {
  return propName.replace(/([A-Z])/g, '-$1').toLowerCase();
}

/** Strip surrounding quotes from a CEM default value like `"'primary'"`. */
function parseDefault(raw) {
  if (raw === undefined || raw === null) return undefined;
  return String(raw).replace(/^['"`]|['"`]$/g, '');
}

/** Convert a CEM field declaration into a manifest member, or null to skip. */
function toMember(field, componentDir) {
  const { name: propName, attribute, type, default: rawDefault, privacy, static: isStatic, description } = field;
  const name = attribute ?? toAttrName(propName);

  if (isStatic) return null;
  if (privacy === 'private' || privacy === 'protected') return null;
  if (propName.startsWith('_')) return null;
  // Skip framework / LitElement lifecycle fields
  if (['styles', 'shadowRoot', 'renderRoot', 'updateComplete'].includes(propName)) return null;

  const typeText = type?.text ?? 'string';

  if (typeText === 'boolean') {
    return { name, description, type: 'boolean', default: rawDefault === 'true' };
  }

  if (typeText === 'number') {
    return { name, description, type: 'number', default: rawDefault !== undefined ? Number(rawDefault) : 0 };
  }

  if (typeText === 'string') {
    if (['icon', 'icon-start', 'icon-end'].includes(name)) {
      return { name, description, type: 'icon', default: '' };
    }
    if (['color', 'background'].includes(name)) {
      return { name, description, type: 'color', default: '' };
    }
    return { name, description, type: 'text', default: parseDefault(rawDefault) ?? '' };
  }

  // Unknown / complex type (arrays, objects, Element refs) → skip
  if (
    typeText.includes('[]') ||
    typeText.includes('{') ||
    typeText.includes('Element') ||
    typeText.includes('Event') ||
    typeText.includes('Promise') ||
    typeText.includes('Record') ||
    typeText.includes('Map') ||
    typeText.includes('HTMLElement')
  ) {
    return null;
  }

  // Strip `| ''` / `'' |` suffixes that just represent an "unset" sentinel
  const hasEmptySentinel = /\|\s*''|''\s*\|/.test(typeText);
  const resolvedType = typeText
    .replace(/\s*\|\s*''/g, '')
    .replace(/^''\s*\|\s*/g, '')
    .trim();

  // Union / named type — try to resolve from *.types.ts
  const options = resolveUnion(resolvedType, componentDir);
  if (options?.length) {
    const def = parseDefault(rawDefault) ?? options[0];
    // Prepend '' option so the playground can show "— default —"
    const finalOptions = hasEmptySentinel ? ['', ...options] : options;
    return { name, description, type: 'select', options: finalOptions, default: def };
  }

  // Fallback: treat as free-text
  return { name, description, type: 'text', default: parseDefault(rawDefault) ?? '' };
}

const manifest = {};

for (const mod of cem.modules) {
  for (const decl of mod.declarations ?? []) {
    if (!decl.tagName || !decl.customElement) continue;

    const componentDir = decl.tagName.replace(/^lt-/, '');
    const members = [];

    for (const field of decl.members ?? []) {
      if (field.kind !== 'field') continue;
      const member = toMember(field, componentDir);
      if (member) members.push(member);
    }

    manifest[decl.tagName] = { members };
  }
}

const iconNames = getIconNames();
writeFileSync(join(root, 'dist/manifest.json'), JSON.stringify({ _meta: { iconNames }, ...manifest }, null, 2));
// eslint-disable-next-line no-console
console.log(`manifest.json → ${Object.keys(manifest).length} components, ${iconNames.length} icons`);

// ── Generate per-component exports map in package.json ────────────────────────
const componentDirs = readdirSync(join(root, 'dist/components'), { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .sort();

const pkgPath = join(root, 'package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));

const perComponentExports = Object.fromEntries(
  componentDirs.map((dir) => [
    `./${dir}`,
    { import: `./dist/components/${dir}/index.js`, default: `./dist/components/${dir}/index.js` }
  ])
);

pkg.main = './dist/index.cjs';

pkg.exports = {
  '.': {
    types: './dist/index.d.ts',
    require: './dist/index.cjs',
    import: './dist/index.js',
    default: './dist/index.js'
  },
  './css/latty.css': './dist/css/latty.css',
  './css/font-face.css': './dist/css/font-face.css',
  './manifest.json': './dist/manifest.json',
  ...perComponentExports
};

// Every dist file calls customElements.define() — bundlers must not tree-shake them
pkg.sideEffects = true;

writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
