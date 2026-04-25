import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['esm'],
  platform: 'neutral',
  bundle: true,
  splitting: false,
  sourcemap: false,
  dts: true,
  clean: true,
});
