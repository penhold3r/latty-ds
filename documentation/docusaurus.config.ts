import { themes as prismThemes } from 'prism-react-renderer';
import type { Config, Plugin } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// @latty-ds/icons builds via plain `tsc` (packages/icons/package.json#scripts.build),
// which does not rewrite relative import specifiers to include a `.js` extension.
// Combined with `"type": "module"`, that dist output is technically non-compliant
// strict ESM — Vite/esbuild-based bundlers (Astro, current docs site) resolve it
// leniently, but webpack enforces Node's "fully specified" ESM rule and fails with
// "Can't resolve './components/icon'". Relaxing that rule for this one package's
// dist is the standard workaround; the real fix belongs in packages/icons' build
// (either bundle to a single file like @latty-ds/web does, or emit extensioned
// specifiers) — flagged separately, out of scope for this docs migration.
function relaxLattyIconsEsmResolution(): Plugin {
  return {
    name: 'latty-icons-esm-resolution-workaround',
    configureWebpack() {
      return {
        module: {
          rules: [
            {
              test: /\.m?js$/,
              include: /packages[\\/]icons[\\/]dist/,
              resolve: { fullySpecified: false }
            }
          ]
        }
      };
    }
  };
}

const siteUrl = process.env.SITE_URL ?? 'https://latty-ds.com';
const basePath = process.env.BASE_PATH ?? '/';

const config: Config = {
  title: 'Latty',
  tagline: 'A framework-agnostic design system built on design tokens and Web Components',
  favicon: 'img/favicon.ico',

  // Deliberately not opting into `future.v4: true` (Docusaurus 3.10+): the "v4"
  // shortcut sets `fasterByDefault: true`, which silently switches the bundler
  // to Rspack + SWC + lightningcss. We're staying on stock webpack for now —
  // see _agent-plans/DOCUSAURUS-MIGRATION-PLAN.md, Decision 4a.

  clientModules: [require.resolve('./src/clientModules/registerLatty.ts')],

  plugins: [relaxLattyIconsEsmResolution],

  url: siteUrl,
  baseUrl: basePath,

  // GitHub pages deployment config.
  organizationName: 'penhold3r',
  projectName: 'latty-ds',

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en']
  },

  presets: [
    [
      'classic',
      {
        docs: {
          path: 'docs',
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/penhold3r/latty-ds/tree/main/documentation/'
        },
        // The Astro site never had a blog — dropped rather than ported.
        blog: false,
        theme: {
          customCss: './src/css/custom.css'
        }
      } satisfies Preset.Options
    ]
  ],

  themeConfig: {
    image: 'img/latty-og.png',
    colorMode: {
      respectPrefersColorScheme: true
    },
    navbar: {
      title: 'Latty',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs'
        },
        {
          href: 'https://github.com/penhold3r/latty-ds',
          label: 'GitHub',
          position: 'right'
        }
      ]
    },
    footer: {
      style: 'dark',
      links: [],
      copyright: `© ${new Date().getFullYear()} Latty Design System. All rights reserved.`
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula
    }
  } satisfies Preset.ThemeConfig
};

export default config;
