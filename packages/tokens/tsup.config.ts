import { defineConfig } from 'tsup';

export default defineConfig([
  {
    // Node build script — compiled to dist-scripts/, executed by `build:tokens`
    entry: ['src/build/tokens.ts'],
    outDir: 'dist-scripts',
    format: ['esm'],
    platform: 'node',
    target: 'node20',
    bundle: true,
    noExternal: ['@latty/utils'],
    splitting: false,
    sourcemap: false,
    clean: true,
  },
  {
    // Browser runtime — configure() and createStyleSheet() for consumer apps
    entry: { configure: 'src/configure/index.ts' },
    outDir: 'dist',
    format: ['esm'],
    platform: 'browser',
    bundle: true,
    splitting: false,
    sourcemap: false,
    dts: true,
  },
]);
