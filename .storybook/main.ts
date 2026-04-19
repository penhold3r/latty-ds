import type { StorybookConfig } from '@storybook/web-components-vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const config: StorybookConfig = {
  framework: '@storybook/web-components-vite',
  stories: [
    '../packages/web/src/**/*.stories.@(ts|tsx|js|jsx|mdx)',
    '../packages/web/src/**/stories/*.mdx',
    '../packages/tokens/src/stories/*.stories.@(ts|tsx|js|jsx|mdx)',
    '../packages/tokens/src/stories/*.mdx'
  ],
  addons: ['@storybook/addon-essentials'],
  viteFinal: async (viteConfig) => {
    viteConfig.plugins = viteConfig.plugins ?? [];
    viteConfig.plugins.push(tsconfigPaths({ projects: ['./tsconfig.base.json'] }));

    // pnpm + symlinks can be spicy; this helps sometimes:
    viteConfig.resolve = viteConfig.resolve ?? {};

    // Ensure font files are served correctly
    viteConfig.assetsInclude = viteConfig.assetsInclude ?? [];
    if (Array.isArray(viteConfig.assetsInclude)) {
      viteConfig.assetsInclude.push('**/*.woff2');
    }

    return viteConfig;
  },
  staticDirs: ['../packages/web/dist/fonts']
};

export default config;
