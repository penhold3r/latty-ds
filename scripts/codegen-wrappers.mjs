#!/usr/bin/env node
/**
 * Generates React wrappers for all Latty web components from custom-elements.json.
 *
 * For each component it produces:
 *   packages/react/src/components/{Name}/{Name}.tsx  — forwardRef wrapper with typed props + event hooks
 *   packages/react/src/components/{Name}/index.ts    — barrel re-export
 *
 * And regenerates:
 *   packages/react/src/index.ts                      — root barrel re-exports
 *
 * Run: node scripts/codegen-wrappers.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { logger } from '@latty-ds/utils';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const CEM_PATH = join(ROOT, 'packages/web/custom-elements.json');
const REACT_COMPONENTS_DIR = join(ROOT, 'packages/react/src/components');
const REACT_INDEX = join(ROOT, 'packages/react/src/index.ts');

const SKIP_FIELDS = new Set(['styles', 'render', 'updated', 'renderChevron', 'shadowRootOptions']);
const SIMPLE_TYPES = new Set(['string', 'boolean', 'number']);
const ICON_FIELDS = new Set(['icon', 'iconEnd', 'iconStart']);

// Native DOM event names that React already exposes as typed handlers in HTMLAttributes.
// When a Latty component fires one of these, its custom handler type conflicts with the
// React type, so we Omit the React version and re-declare with (event: CustomEvent).
const NATIVE_TO_REACT_HANDLER = {
  change: 'onChange',
  input: 'onInput',
  toggle: 'onToggle',
  load: 'onLoad',
  error: 'onError',
  select: 'onSelect'
};

// ── Read CEM ──────────────────────────────────────────────────────────────────
const cem = JSON.parse(readFileSync(CEM_PATH, 'utf8'));

// ── Extract components ────────────────────────────────────────────────────────
const components = [];

for (const mod of cem.modules) {
  for (const decl of mod.declarations ?? []) {
    if (decl.kind !== 'class' || !decl.customElement || !decl.tagName) continue;

    const fields = (decl.members ?? [])
      .filter(
        (m) =>
          m.kind === 'field' &&
          m.privacy !== 'private' &&
          !m.name.startsWith('_') &&
          !SKIP_FIELDS.has(m.name) &&
          // A getter-only public field (cem marks it `readonly`) is derived state meant to be read via a ref
          // (`tableRef.current.totalPages`), never set — including it as a settable prop would either throw
          // (assigning to an accessor with no setter, under ES modules' always-strict mode) or silently no-op
          // (spread as a plain JSX attribute the component never declared), depending on isSimple's heuristic.
          !m.readonly
      )
      .map((f) => {
        let displayType;
        let isSimple;
        if (ICON_FIELDS.has(f.name)) {
          // Icon fields are always plain strings at runtime (an icon name) despite the richer `LattyIconName`
          // display type, so they're as safe as a real `string` field for JSX attribute passing (X7).
          displayType = 'LattyIconName';
          isSimple = true;
        } else {
          const raw = f.type?.text ?? 'string';
          displayType = SIMPLE_TYPES.has(raw) ? raw : `${decl.name}El['${f.name}']`;
          // Most non-string/boolean/number fields are still string-literal-union "enum" types at runtime
          // (ButtonVariant, TextfieldSize, …) and are perfectly safe as JSX attributes — only flag a field as
          // needing property assignment (X7) when the manifest itself signals a real array or object: the type
          // text ends in `[]` (`SelectOption[]`, `Date[]`), the default is an array or object literal (catches
          // `Calendar['disabledDates']`, a type lookup that doesn't textually end in `[]`, and object-typed
          // props like a component's `labels` override, default `{}`), or there's no default at all where
          // every genuine enum prop always has a quoted-string one (catches `Table.sort: SortState | undefined`,
          // a real interface — verified against every current non-primitive field, no false positives: nullable
          // primitives like `Image.rounded: string | null = null` keep a `null` default, distinct from a field
          // with no default whatsoever).
          const isArrayType = raw.replace(/\s*\|\s*(undefined|null)$/, '').endsWith('[]');
          const isArrayOrObjectDefault = typeof f.default === 'string' && /^[[{]/.test(f.default.trim());
          const isMissingDefault = f.default === undefined;
          const isComplex = isArrayType || isArrayOrObjectDefault || (isMissingDefault && !SIMPLE_TYPES.has(raw));
          isSimple = !isComplex;
        }
        return { name: f.name, displayType, isSimple };
      });

    const events = (decl.events ?? []).map((e) => {
      // Latty events use native names with no vendor prefix and no hyphens ("change", "close", "monthchange"),
      // exactly like the platform's own ("volumechange", "slotchange"). React spells those compound names
      // with a capital: "monthchange" → "onMonthChange", like its own "onVolumeChange".
      const stripped = e.name;
      const words =
        /^[a-z]+change$/.test(stripped) && stripped !== 'change' ? stripped.replace(/change$/, '-change') : stripped;
      const handlerName =
        'on' + words.replace(/[-:](.)/g, (_, c) => c.toUpperCase()).replace(/^(.)/, (c) => c.toUpperCase());
      // Extract inner type from CustomEvent<DetailType> if present
      const typeText = e.type?.text ?? '';
      const detailMatch = typeText.match(/^CustomEvent<(.+)>$/s);
      const detailType = detailMatch ? detailMatch[1].trim() : null;
      return { name: e.name, handlerName, strippedName: stripped, detailType };
    });

    components.push({ name: decl.name, tagName: decl.tagName, fields, events });
  }
}

// Sort by component name so the generated output (and the root index barrel) is
// deterministic regardless of the order modules appear in custom-elements.json.
components.sort((a, b) => a.name.localeCompare(b.name));

// ── Generate one wrapper per component ────────────────────────────────────────
mkdirSync(REACT_COMPONENTS_DIR, { recursive: true });

for (const { name, tagName, fields, events } of components) {
  // Props block
  const hasIconFields = fields.some((f) => f.displayType === 'LattyIconName');
  const fieldProps = fields.map((f) => `  ${f.name}?: ${f.displayType};`);

  // React 18 (the repo's declared peer floor) stringifies non-primitive JSX props into DOM *attributes* for
  // unknown elements instead of setting the property — `options={[...]}` becomes `attribute options="[object
  // Object]"`, property still undefined (X7). Fields whose manifest type isn't string/boolean/number (an array,
  // an object, or a union that can be a function, like Textfield's `helperText`) are assigned onto the element
  // imperatively via the ref instead of spread as JSX props, so they always reach the component as a real
  // property regardless of React version. Icon fields are exempt — their value is always a plain string.
  const complexFields = fields.filter((f) => !f.isSimple);

  // Every handler receives the event itself — like a native event handler — typed with its payload when the
  // manifest declares one: `onChange={(e) => e.detail.value}`. That keeps stopPropagation(), preventDefault(),
  // target and currentTarget available to the consumer, who composes the events (they bubble like native ones).
  const eventType = (e) => (e.detailType ? `CustomEvent<${e.detailType}>` : 'CustomEvent');
  const eventProps = events.map((e) => `  ${e.handlerName}?: (event: ${eventType(e)}) => void;`);

  // Destructured event handler names and complex field names — both pulled out of `props` explicitly so
  // `...props` (spread as JSX attributes) never contains anything but attribute-safe primitives.
  const handlerNames = events.map((e) => e.handlerName);
  const complexFieldNames = complexFields.map((f) => f.name);
  const destructureNames = [...handlerNames, ...complexFieldNames];
  const destructure =
    destructureNames.length > 0 ? `{ ${destructureNames.join(', ')}, children, ...props }` : '{ children, ...props }';

  // useEffect blocks for each event
  const effectBlocks = events
    .map(
      (e) => `
    useEffect(() => {
      const el = innerRef.current;
      if (!el || !${e.handlerName}) return;
      const h = (ev: Event) => ${e.handlerName}!(ev as ${eventType(e)});
      el.addEventListener('${e.name}', h);
      return () => el.removeEventListener('${e.name}', h);
    }, [${e.handlerName}]);`
    )
    .join('');

  // One useLayoutEffect assigns every complex field as a real property, each guarded so an omitted prop
  // (undefined) leaves the component's own default alone instead of overwriting it.
  const complexFieldEffect =
    complexFields.length > 0
      ? `
    useLayoutEffect(() => {
      const el = innerRef.current;
      if (!el) return;
${complexFields.map((f) => `      if (${f.name} !== undefined) el.${f.name} = ${f.name};`).join('\n')}
    }, [${complexFieldNames.join(', ')}]);`
      : '';

  const hooks = `\n    useImperativeHandle(forwardedRef, () => innerRef.current!);\n${effectBlocks}${complexFieldEffect}\n`;

  const reactImports = ['useRef', 'useImperativeHandle', 'forwardRef', 'type HTMLAttributes'];
  if (events.length > 0) reactImports.splice(1, 0, 'useEffect');
  if (complexFields.length > 0) reactImports.splice(1, 0, 'useLayoutEffect');

  // Determine which React HTMLAttributes keys to Omit due to type conflicts with custom events.
  const omitKeys = events
    .filter((e) => NATIVE_TO_REACT_HANDLER[e.strippedName])
    .map((e) => `'${NATIVE_TO_REACT_HANDLER[e.strippedName]}'`);
  const baseType =
    omitKeys.length > 0 ? `Omit<HTMLAttributes<${name}El>, ${omitKeys.join(' | ')}>` : `HTMLAttributes<${name}El>`;

  const webImports = [`${name} as ${name}El`, ...(hasIconFields ? ['LattyIconName'] : [])].join(', ');
  const componentContent = `import { ${reactImports.join(', ')} } from 'react';
import type { ${webImports} } from '@latty-ds/web';

export type ${name}Props = ${baseType} & {
${[...fieldProps, ...eventProps].join('\n')}
};

export const ${name} = forwardRef<${name}El, ${name}Props>(
  function ${name}(${destructure}, forwardedRef) {
    const innerRef = useRef<${name}El>(null);
${hooks}
    return (
      <${tagName} ref={innerRef} {...(props as Record<string, unknown>)}>
        {children}
      </${tagName}>
    );
  }
);
${name}.displayName = '${name}';
`;

  const compDir = join(REACT_COMPONENTS_DIR, name);
  mkdirSync(compDir, { recursive: true });

  const compPath = join(compDir, `${name}.tsx`);
  if (existsSync(compPath) && readFileSync(compPath, 'utf8').startsWith('// codegen:manual')) {
    process.stdout.write(`  ✓ ${name}/ (manual)\n`);
  } else {
    writeFileSync(compPath, componentContent, 'utf8');
    process.stdout.write(`  ✓ ${name}/\n`);
  }

  writeFileSync(join(compDir, 'index.ts'), `export { ${name}, type ${name}Props } from './${name}';\n`, 'utf8');
}

// ── Regenerate root index ─────────────────────────────────────────────────────
const indexLines = components
  .map((c) => `export { ${c.name}, type ${c.name}Props } from './components/${c.name}';`)
  .join('\n');

writeFileSync(REACT_INDEX, `import '@latty-ds/web';\n` + indexLines + '\n', 'utf8');

// Normalize formatting to the repo's prettier config. Without this, the raw
// template output differs from the lint-staged-formatted committed files, so
// every run shows phantom whitespace-only diffs across all wrappers.
execSync('pnpm exec prettier --write "packages/react/src/**/*.{ts,tsx}"', { cwd: ROOT, stdio: 'ignore' });

logger.success(`${components.length} React wrappers written → packages/react/src/components/`);
logger.info('Run: pnpm --filter @latty-ds/react build');
