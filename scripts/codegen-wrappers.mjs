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
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const CEM_PATH = join(ROOT, 'packages/web/custom-elements.json');
const REACT_COMPONENTS_DIR = join(ROOT, 'packages/react/src/components');
const REACT_INDEX = join(ROOT, 'packages/react/src/index.ts');

const SKIP_FIELDS = new Set(['styles', 'render', 'updated', 'renderChevron', 'shadowRootOptions']);
const SIMPLE_TYPES = new Set(['string', 'boolean', 'number']);
const ICON_FIELDS = new Set(['icon', 'iconEnd', 'iconStart']);

// ── Read CEM ──────────────────────────────────────────────────────────────────
const cem = JSON.parse(readFileSync(CEM_PATH, 'utf8'));

// ── Extract components ────────────────────────────────────────────────────────
const components = [];

for (const mod of cem.modules) {
  for (const decl of mod.declarations ?? []) {
    if (decl.kind !== 'class' || !decl.customElement || !decl.tagName) continue;

    const fields = (decl.members ?? [])
      .filter(m =>
        m.kind === 'field' &&
        m.privacy !== 'private' &&
        !m.name.startsWith('_') &&
        !SKIP_FIELDS.has(m.name)
      )
      .map(f => {
        let displayType;
        if (ICON_FIELDS.has(f.name)) {
          displayType = 'LattyIconName';
        } else {
          const raw = f.type?.text ?? 'string';
          displayType = SIMPLE_TYPES.has(raw) ? raw : `${decl.name}El['${f.name}']`;
        }
        return { name: f.name, displayType };
      });

    const events = (decl.events ?? []).map(e => {
      // Convert event name like "lt-close" to "onLtClose"
      const handlerName = 'on' + e.name
        .replace(/[-:](.)/g, (_, c) => c.toUpperCase())
        .replace(/^(.)/, c => c.toUpperCase());
      return { name: e.name, handlerName };
    });

    components.push({ name: decl.name, tagName: decl.tagName, fields, events });
  }
}

// ── Generate one wrapper per component ────────────────────────────────────────
mkdirSync(REACT_COMPONENTS_DIR, { recursive: true });

for (const { name, tagName, fields, events } of components) {
  // Props block
  const hasIconFields = fields.some(f => f.displayType === 'LattyIconName');
  const fieldProps = fields.map(f => `  ${f.name}?: ${f.displayType};`);

  const eventProps = events.map(e => `  ${e.handlerName}?: (event: CustomEvent) => void;`);

  // Destructured event handler names
  const handlerNames = events.map(e => e.handlerName);
  const destructure = handlerNames.length > 0
    ? `{ ${handlerNames.join(', ')}, children, ...props }`
    : '{ children, ...props }';

  // useEffect blocks for each event
  const effectBlocks = events.map(e => `
    useEffect(() => {
      const el = innerRef.current;
      if (!el || !${e.handlerName}) return;
      const h = (ev: Event) => ${e.handlerName}!(ev as CustomEvent);
      el.addEventListener('${e.name}', h);
      return () => el.removeEventListener('${e.name}', h);
    }, [${e.handlerName}]);`).join('');

  const hooks = events.length > 0
    ? `\n    useImperativeHandle(forwardedRef, () => innerRef.current!);\n${effectBlocks}\n`
    : '\n    useImperativeHandle(forwardedRef, () => innerRef.current!);\n';

  const reactImports = ['useRef', 'useImperativeHandle', 'forwardRef', 'type ReactNode'];
  if (events.length > 0) reactImports.splice(1, 0, 'useEffect');

  const webImports = [`${name} as ${name}El`, ...(hasIconFields ? ['LattyIconName'] : [])].join(', ');
  const componentContent = `import { ${reactImports.join(', ')} } from 'react';
import type { ${webImports} } from '@latty/web';

export type ${name}Props = {
${[...fieldProps, ...eventProps].join('\n')}
  children?: ReactNode;
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
  writeFileSync(join(compDir, `${name}.tsx`), componentContent, 'utf8');
  writeFileSync(
    join(compDir, 'index.ts'),
    `export { ${name}, type ${name}Props } from './${name}';\n`,
    'utf8'
  );
  process.stdout.write(`  ✓ ${name}/\n`);
}

// ── Regenerate root index ─────────────────────────────────────────────────────
const indexLines = components
  .map(c => `export { ${c.name}, type ${c.name}Props } from './components/${c.name}';`)
  .join('\n');

writeFileSync(REACT_INDEX, indexLines + '\n', 'utf8');

console.log(`\n✅  ${components.length} React wrappers written → packages/react/src/components/`);
console.log('   Run: pnpm --filter @latty/react build');
