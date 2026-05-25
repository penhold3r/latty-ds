import { defineConfig } from 'tsup';
import { readdirSync, existsSync } from 'fs';
import { join } from 'path';

const componentDirs = readdirSync(join(__dirname, 'src/components'), { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(join(__dirname, 'src/components', d.name, 'index.ts')))
  .map((d) => d.name);

const componentEntries = Object.fromEntries(
  componentDirs.map((name) => [`components/${name}/index`, `src/components/${name}/index.ts`])
);

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    base: 'src/base/index.ts',
    ...componentEntries
  },
  format: ['esm'],
  dts: true,
  clean: true,
  splitting: false,
  external: ['lit', 'lit/*', '@lit/*', '@latty/icons', '@latty/tokens'],
  noExternal: ['@floating-ui/dom'],
  outExtension: () => ({ js: '.js' })
});
