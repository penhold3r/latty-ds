import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/scripts/build-tokens.ts'],
  format: ['esm'],
  outDir: 'dist-scripts',
  bundle: true,
  splitting: false,
  sourcemap: false,
  clean: true,
  platform: 'node',
  target: 'node20'
});
