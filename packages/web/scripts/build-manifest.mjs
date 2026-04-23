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

import { readFileSync, writeFileSync, existsSync } from 'fs';
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
  return [...match[1].matchAll(/'([^']+)'/g)].map(m => m[1]);
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
  const { name: propName, attribute, type, default: rawDefault, privacy, static: isStatic } = field;
  const name = attribute ?? toAttrName(propName);

  if (isStatic) return null;
  if (privacy === 'private' || privacy === 'protected') return null;
  if (propName.startsWith('_')) return null;
  // Skip framework / LitElement lifecycle fields
  if (['styles', 'shadowRoot', 'renderRoot', 'updateComplete'].includes(propName)) return null;

  const typeText = type?.text ?? 'string';

  if (typeText === 'boolean') {
    return { name, type: 'boolean', default: rawDefault === 'true' };
  }

  if (typeText === 'number') {
    return { name, type: 'number', default: rawDefault !== undefined ? Number(rawDefault) : 0 };
  }

  if (typeText === 'string') {
    return { name, type: 'text', default: parseDefault(rawDefault) ?? '' };
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

  // Union / named type — try to resolve from *.types.ts
  const options = resolveUnion(typeText, componentDir);
  if (options?.length) {
    const def = parseDefault(rawDefault) ?? options[0];
    return { name, type: 'select', options, default: def };
  }

  // Fallback: treat as free-text
  return { name, type: 'text', default: parseDefault(rawDefault) ?? '' };
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

writeFileSync(join(root, 'dist/manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`manifest.json → ${Object.keys(manifest).length} components`);
