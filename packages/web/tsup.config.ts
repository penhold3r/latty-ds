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
    /*
     * `@floating-ui/dom` is a runtime dependency of this package, so it is left external like `lit` and
     * `@latty-ds/icons`: the consumer's bundler resolves it once and shares that single copy between
     * lt-select, lt-combobox, lt-dropdown and lt-date-input. Inlining it (as `noExternal` used to)
     * shipped four copies of the same 16 kB inside the package — and four copies in the consumer's
     * bundle too, since the inlined copy shadowed the installed one.
     */
    external: ['lit', 'lit/*', '@lit/*', '@latty-ds/icons', '@latty-ds/tokens', '@floating-ui/dom'],
    outExtension: () => ({ js: '.js' })
  },
  {
    /*
     * CJS build: fully self-contained so webpack/CJS consumers don't need lit installed.
     * Lit is ESM-only and cannot be require()'d, so we bundle it in here.
     */
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
