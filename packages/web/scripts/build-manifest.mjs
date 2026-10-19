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
import ts from 'typescript';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const cemPath = join(root, 'custom-elements.json');
const cem = JSON.parse(readFileSync(cemPath, 'utf8'));

// ── Normalize CEM ordering ────────────────────────────────────────────────────
// `cem analyze` emits modules in a non-deterministic order (filesystem glob
// enumeration), so every local build produced phantom diffs against the
// checked-in file. Sort modules by path to make the output stable, then rewrite
// in cem's own format (2-space indent + trailing newline) so it's a no-op when
// already sorted.
cem.modules.sort((a, b) => a.path.localeCompare(b.path));
writeFileSync(cemPath, JSON.stringify(cem, null, 2) + '\n', 'utf8');

// Escape regex metacharacters — a type name below comes from a CEM type-text string, not a literal identifier,
// so it isn't guaranteed regex-safe (an unescaped `|`, for instance, silently becomes alternation instead of a
// literal character and can match a shorter, group-less prefix, leaving a capture group undefined).
function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Which module path (as written in the source, e.g. `'../calendar/calendar.types'`) a component's own .ts file
 * imports `typeName` from, if any — used to resolve a type alias that's reused across components (e.g.
 * `date-input.ts` importing `CalendarWeekStart`/`CalendarDisabledDates` from calendar.types.ts, rather than
 * redeclaring its own copy) back to the file that actually defines it, instead of assuming every type a
 * component uses is declared in its own *.types.ts.
 */
function findTypeImportSource(typeName, componentDir) {
  const mainFile = join(root, 'src/components', componentDir, `${componentDir}.ts`);
  if (!existsSync(mainFile)) return null;
  const src = readFileSync(mainFile, 'utf8');
  const sourceFile = ts.createSourceFile(mainFile, src, ts.ScriptTarget.Latest, true);
  let modulePath = null;
  sourceFile.forEachChild((node) => {
    if (
      modulePath ||
      !ts.isImportDeclaration(node) ||
      !node.importClause?.namedBindings ||
      !ts.isNamedImports(node.importClause.namedBindings)
    ) {
      return;
    }
    const hasType = node.importClause.namedBindings.elements.some((el) => el.name.text === typeName);
    if (hasType) modulePath = node.moduleSpecifier.text;
  });
  return modulePath;
}

/**
 * Resolves the *.types.ts file that actually declares `typeName`: the component's own file if it defines it
 * there, otherwise wherever its own .ts file imports that name from (see `findTypeImportSource`). Returns null
 * if neither finds it.
 */
function typesFileFor(typeName, componentDir) {
  const localFile = join(root, 'src/components', componentDir, `${componentDir}.types.ts`);
  const declPattern = new RegExp(`export type ${escapeRegex(typeName)}\\b`);
  if (existsSync(localFile) && declPattern.test(readFileSync(localFile, 'utf8'))) return localFile;

  const modulePath = findTypeImportSource(typeName, componentDir);
  if (!modulePath) return null;
  const resolved = resolve(join(root, 'src/components', componentDir), `${modulePath}.ts`);
  return existsSync(resolved) ? resolved : null;
}

/** Parse union string literals from a *.types.ts source file. */
function resolveUnion(typeName, componentDir) {
  const typesFile = typesFileFor(typeName, componentDir);
  if (!typesFile) return null;
  const src = readFileSync(typesFile, 'utf8');
  const match = src.match(new RegExp(`export type ${escapeRegex(typeName)}\\s*=\\s*([^;]+);`));
  if (!match) return null;
  return [...match[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
}

/**
 * Expands a bare type-alias reference (e.g. `CalendarDisabledDates`) to its own right-hand-side type text (e.g.
 * `Date[] | ((date: Date) => boolean)`), searching the same file `resolveUnion` would. Lets the complex-type
 * check below recognize an aliased array/function/object type the same way it already recognizes one written
 * out inline — without this, a type reused from another component's *.types.ts (rather than redeclared locally)
 * would fall all the way through to the free-text fallback, same failure shape as the `Partial<>` gap fixed
 * earlier: the Playground renders a control bound to an attribute that doesn't do anything (worse still when the
 * property is `attribute: false`, where no such attribute exists at all).
 */
function resolveTypeAliasRhs(typeName, componentDir) {
  const typesFile = typesFileFor(typeName, componentDir);
  if (!typesFile) return null;
  const src = readFileSync(typesFile, 'utf8');
  const match = src.match(new RegExp(`export type ${escapeRegex(typeName)}\\s*=\\s*([^;]+);`));
  return match ? match[1].trim() : null;
}

/**
 * Pulls a property's leading `/** ... *\/` JSDoc apart into its plain-prose description and any `@tag value`
 * lines (only `@default` is used today, by `resolveInterfaceShape()` below) — the real TS compiler AST, not
 * regex, since a JSDoc block can span multiple lines and a property's own type can be an arbitrarily complex
 * function signature (`(row: T, index: number) => string`), both of which are exactly the kind of syntax a
 * hand-rolled regex (like `resolveUnion()` above, fine for a single-line string-literal union) gets wrong on.
 */
function extractJsDoc(sourceFile, node) {
  const ranges = ts.getLeadingCommentRanges(sourceFile.text, node.getFullStart()) ?? [];
  const jsDocRange = ranges.find((r) => sourceFile.text.slice(r.pos, r.pos + 3) === '/**');
  if (!jsDocRange) return { description: '', tags: {} };
  const raw = sourceFile.text.slice(jsDocRange.pos, jsDocRange.end);
  const body = raw.replace(/^\/\*\*/, '').replace(/\*\/$/, '');
  const lines = body.split('\n').map((l) => l.replace(/^\s*\*\s?/, ''));
  const descLines = [];
  const tags = {};
  let currentTag = null;
  for (const line of lines) {
    const tagMatch = line.match(/^\s*@(\w+)\s*(.*)$/);
    if (tagMatch) {
      currentTag = tagMatch[1];
      tags[currentTag] = tagMatch[2];
    } else if (currentTag) {
      tags[currentTag] += ' ' + line.trim();
    } else {
      descLines.push(line);
    }
  }
  for (const k in tags) tags[k] = tags[k].trim();
  return { description: descLines.join(' ').replace(/\s+/g, ' ').trim(), tags };
}

/**
 * Resolves a named interface's own member shape (name/type/description/`@default`) from a *.types.ts file, for
 * the API table to show what an i18n `labels` prop (`Partial<XLabels>`) actually accepts — the interface itself
 * already carries this exact information as per-field JSDoc, written once by whoever added the labels prop; this
 * just surfaces it instead of leaving it discoverable only by opening the source. Returns null if the file or
 * the named interface isn't found, so callers can fall back to not showing a shape rather than guessing.
 */
function resolveInterfaceShape(typeName, componentDir) {
  const typesFile = join(root, 'src/components', componentDir, `${componentDir}.types.ts`);
  if (!existsSync(typesFile)) return null;
  const src = readFileSync(typesFile, 'utf8');
  const sourceFile = ts.createSourceFile(typesFile, src, ts.ScriptTarget.Latest, true);
  let found = null;
  sourceFile.forEachChild((node) => {
    if (ts.isInterfaceDeclaration(node) && node.name.text === typeName) found = node;
  });
  if (!found) return null;
  return found.members
    .filter((m) => ts.isPropertySignature(m))
    .map((m) => {
      const { description, tags } = extractJsDoc(sourceFile, m);
      return {
        name: m.name.getText(sourceFile),
        type: m.type ? m.type.getText(sourceFile) : '',
        description,
        default: tags.default ?? ''
      };
    });
}

/** Enumerate all icon names from the @latty-ds/icons source directory. */
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
  const {
    name: propName,
    attribute,
    type,
    default: rawDefault,
    privacy,
    static: isStatic,
    description,
    readonly
  } = field;
  const name = attribute ?? toAttrName(propName);

  if (isStatic) return null;
  if (privacy === 'private' || privacy === 'protected') return null;
  if (propName.startsWith('_')) return null;
  // A getter-only field (no setter) isn't a real attribute/property a consumer can configure — it's derived
  // state meant to be read off the element directly (e.g. `table.totalPages`). Listing it here would make the
  // playground render a control that silently does nothing when changed.
  if (readonly) return null;
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

  // Unknown / complex type (arrays, objects, Element refs, functions) — not representable as an HTML attribute,
  // so the Playground can't render an interactive control for it (ComponentPlayground skips `type: 'complex'`
  // entirely rather than rendering a text input that would silently do nothing when edited). Still surfaced as
  // an informational row in the API table, with the real JS property name (not the kebab-case attribute-name
  // conversion `toAttrName` would otherwise produce, since no attribute exists for it) and its actual TS type
  // text — previously this branch returned null and the property vanished from the generated docs entirely.
  //
  // `Partial<` specifically catches the i18n `labels` prop every multi-label component declares as
  // `Partial<XLabels>` — a generic wrapping a named interface, not an inline `{...}` object-literal type text,
  // so it didn't trip the `{` check above. Without it, `labels` fell all the way through to the plain free-text
  // fallback at the bottom of this function: a real, system-wide bug affecting all 18 components with this
  // prop, not just one — the Playground rendered an editable "Labels" text control right next to the real
  // `label` control on components that have both, and typing into it set a string onto a property Lit expects
  // to JSON-parse as an object, silently doing nothing useful. `Partial<T>` is always object-shaped by
  // construction (TS makes every property of T optional), so this substring can never misfire on a primitive.
  //
  // A bare identifier (no `|`/`[]`/`(`/`{`/etc. of its own) that isn't a primitive keyword is a type-alias
  // reference rather than an inline type — e.g. `date-input.ts` typing `disabledDates` as `CalendarDisabledDates`
  // (imported from calendar.types.ts) instead of repeating calendar's own inline `Date[] | ((date: Date) =>
  // boolean)`. The substring checks below only ever see the CEM type TEXT, which for an alias is just its bare
  // name — so without expanding it first, an aliased array/function/object type silently falls through to the
  // same free-text fallback as `Partial<>` did, and (worse, since a property reused this way is commonly
  // `attribute: false`) binds the Playground's text control to an attribute that doesn't exist at all. Expanding
  // is intentionally NOT applied to typeText itself (only to this local check): a bare alias that resolves to a
  // plain string union (e.g. `CalendarWeekStart`) must keep flowing into resolveUnion()'s own name-based lookup
  // below unchanged, which already resolves it (including cross-file, same as this expansion does).
  const isBareIdentifier = /^[A-Za-z_$][\w$]*$/.test(typeText);
  const isPrimitiveKeyword = ['string', 'number', 'boolean', 'any', 'unknown', 'void', 'undefined', 'null'].includes(
    typeText
  );
  const complexCheckText =
    isBareIdentifier && !isPrimitiveKeyword ? (resolveTypeAliasRhs(typeText, componentDir) ?? typeText) : typeText;

  if (
    complexCheckText.includes('[]') ||
    complexCheckText.includes('{') ||
    complexCheckText.includes('Partial<') ||
    complexCheckText.includes('Element') ||
    complexCheckText.includes('Event') ||
    complexCheckText.includes('Promise') ||
    complexCheckText.includes('Record') ||
    complexCheckText.includes('Map') ||
    complexCheckText.includes('HTMLElement')
  ) {
    // `Partial<XLabels>` (and `Partial<XLabels<T>>` for a generic interface like TableLabels) → resolve XLabels's
    // own shape so the API table can show what keys an i18n `labels` override actually accepts, not just the
    // bare "Partial<XLabels>" type text.
    const interfaceMatch = complexCheckText.match(/^Partial<(\w+)/);
    const shape = interfaceMatch ? resolveInterfaceShape(interfaceMatch[1], componentDir) : null;
    return {
      name: propName,
      description,
      type: 'complex',
      valueType: complexCheckText,
      default: parseDefault(rawDefault),
      ...(shape ? { shape } : {})
    };
  }

  // Strip `| ''` / `'' |` suffixes that just represent an "unset" sentinel, and `| undefined` from an optional
  // (no-default) property's CEM type text — neither is itself a type name resolveUnion() should look up.
  const hasEmptySentinel = /\|\s*''|''\s*\|/.test(typeText);
  const resolvedType = typeText
    .replace(/\s*\|\s*''/g, '')
    .replace(/^''\s*\|\s*/g, '')
    .replace(/\s*\|\s*undefined/g, '')
    .replace(/^undefined\s*\|\s*/g, '')
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
// A directory under dist/components/ doesn't always mean a built entry point (X7): tsc's declaration pass
// emits a .d.ts for every source file it compiles, including internal-only helpers like shared/*.ts (imported
// by dialog/sidepanel/dropdown/etc. but never a component of their own, no src/components/shared/index.ts) —
// so dist/components/shared/ exists with .d.ts files but no index.js, since tsup's own entry list (see
// tsup.config.ts) correctly excludes it. Requiring an actual index.js keeps the exports map matching what's
// really importable, instead of advertising a subpath that 404s for every consumer who tries it.
const componentDirs = readdirSync(join(root, 'dist/components'), { withFileTypes: true })
  .filter((e) => e.isDirectory() && existsSync(join(root, 'dist/components', e.name, 'index.js')))
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
