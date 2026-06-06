import { defineConfig } from 'tsup';
import { readdirSync, existsSync } from 'fs';
import { join } from 'path';

const componentDirs = readdirSync(join(__dirname, 'src/components'), { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(join(__dirname, 'src/components', d.name, 'index.ts')))
  .map((d) => d.name);

const componentEntries = Object.fromEntries(
  componentDirs.map((name) => [`components/${name}/index`, `src/components/${name}/index.ts`])
);

const entry = {
  index: 'src/index.ts',
  'base/index': 'src/base/index.ts',
  ...componentEntries
};

export default defineConfig([
  {
    entry,
    format: ['esm'],
    dts: false,
    clean: true,
    splitting: false,
    external: ['lit', 'lit/*', '@lit/*', '@latty-ds/icons', '@latty-ds/tokens'],
    noExternal: ['@floating-ui/dom'],
    outExtension: () => ({ js: '.js' })
  },
  {
    // CJS build: fully self-contained so webpack/CJS consumers don't need lit installed.
    // Lit is ESM-only and cannot be require()'d, so we bundle it in here.
    entry: { index: 'src/index.ts' },
    format: ['cjs'],
    dts: false,
    clean: false,
    splitting: false,
    external: ['@latty-ds/icons', '@latty-ds/tokens'],
    noExternal: ['@floating-ui/dom', 'lit', 'lit/*', '@lit/*'],
    outExtension: () => ({ js: '.cjs' })
  }
]);
