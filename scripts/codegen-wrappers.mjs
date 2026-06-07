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
const NATIVE_TO_REACT_HANDLER = { change: 'onChange', input: 'onInput', toggle: 'onToggle' };

// ── Read CEM ──────────────────────────────────────────────────────────────────
const cem = JSON.parse(readFileSync(CEM_PATH, 'utf8'));

// ── Extract components ────────────────────────────────────────────────────────
const components = [];

for (const mod of cem.modules) {
  for (const decl of mod.declarations ?? []) {
    if (decl.kind !== 'class' || !decl.customElement || !decl.tagName) continue;

    const fields = (decl.members ?? [])
      .filter(
        (m) => m.kind === 'field' && m.privacy !== 'private' && !m.name.startsWith('_') && !SKIP_FIELDS.has(m.name)
      )
      .map((f) => {
        let displayType;
        if (ICON_FIELDS.has(f.name)) {
          displayType = 'LattyIconName';
        } else {
          const raw = f.type?.text ?? 'string';
          displayType = SIMPLE_TYPES.has(raw) ? raw : `${decl.name}El['${f.name}']`;
        }
        return { name: f.name, displayType };
      });

    const events = (decl.events ?? []).map((e) => {
      // Strip the "lt-" vendor prefix, then convert "lt-close" → "onClose"
      const stripped = e.name.replace(/^lt-/, '');
      const handlerName =
        'on' + stripped.replace(/[-:](.)/g, (_, c) => c.toUpperCase()).replace(/^(.)/, (c) => c.toUpperCase());
      // Extract inner type from CustomEvent<DetailType> if present
      const typeText = e.type?.text ?? '';
      const detailMatch = typeText.match(/^CustomEvent<(.+)>$/s);
      const detailType = detailMatch ? detailMatch[1].trim() : null;
      return { name: e.name, handlerName, strippedName: stripped, detailType };
    });

    components.push({ name: decl.name, tagName: decl.tagName, fields, events });
  }
}

// ── Generate one wrapper per component ────────────────────────────────────────
mkdirSync(REACT_COMPONENTS_DIR, { recursive: true });

for (const { name, tagName, fields, events } of components) {
  // Props block
  const hasIconFields = fields.some((f) => f.displayType === 'LattyIconName');
  const fieldProps = fields.map((f) => `  ${f.name}?: ${f.displayType};`);

  const eventProps = events.map((e) =>
    e.detailType ? `  ${e.handlerName}?: (detail: ${e.detailType}) => void;` : `  ${e.handlerName}?: () => void;`
  );

  // Destructured event handler names
  const handlerNames = events.map((e) => e.handlerName);
  const destructure =
    handlerNames.length > 0 ? `{ ${handlerNames.join(', ')}, children, ...props }` : '{ children, ...props }';

  // useEffect blocks for each event
  const effectBlocks = events
    .map(
      (e) => `
    useEffect(() => {
      const el = innerRef.current;
      if (!el || !${e.handlerName}) return;
      const h = ${e.detailType ? `(ev: Event) => ${e.handlerName}!((ev as CustomEvent).detail)` : `() => ${e.handlerName}!()`};
      el.addEventListener('${e.name}', h);
      return () => el.removeEventListener('${e.name}', h);
    }, [${e.handlerName}]);`
    )
    .join('');

  const hooks =
    events.length > 0
      ? `\n    useImperativeHandle(forwardedRef, () => innerRef.current!);\n${effectBlocks}\n`
      : '\n    useImperativeHandle(forwardedRef, () => innerRef.current!);\n';

  const reactImports = ['useRef', 'useImperativeHandle', 'forwardRef', 'type HTMLAttributes'];
  if (events.length > 0) reactImports.splice(1, 0, 'useEffect');

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

logger.success(`${components.length} React wrappers written → packages/react/src/components/`);
logger.info('Run: pnpm --filter @latty-ds/react build');
