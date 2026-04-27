// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],
  site: 'https://latty-ds.dev',
  vite: {
    server: {
      // Allow Vite to serve files from outside the docs directory
      fs: { allow: [root] },
    },
    resolve: {
      alias: [
        // Subpath exports must come before the package root alias
        {
          find: '@latty/web/manifest.json',
          replacement: resolve(root, 'packages/web/dist/manifest.json'),
        },
        // Point these packages to src so Astro/Vite picks up changes live.
        // Vite reads each package's tsconfig.json (experimentalDecorators,
        // useDefineForClassFields) so Lit decorators are handled correctly.
        {
          find: '@latty/web',
          replacement: resolve(root, 'packages/web/src/index.ts'),
        },
        {
          find: '@latty/icons',
          replacement: resolve(root, 'packages/icons/src/index.ts'),
        },
        // @latty/tokens stays dist-based: tokens.css / semantic.css / tokens.json
        // are generated outputs with no raw-source equivalent.
      ],
    },
  },
});
