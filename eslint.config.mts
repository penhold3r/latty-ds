import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import css from '@eslint/css';
import astro from 'eslint-plugin-astro';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    ignores: [
      '**/dist/**',
      '**/dist-scripts/**',
      '**/*.d.ts',
      'packages/utils/src/*.js',
    ],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } }
  },
  {
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx']
        },
        typescript: {
          project: './tsconfig.base.json'
        },
        alias: {
          map: [
            ['@components', './packages/web/src/'],
            ['@utils', './packages/utils/src/']
          ],
          extensions: ['.ts', '.js', '.jsx', '.tsx', '.json']
        }
      },
      jsdoc: {
        mode: 'typescript'
      }
    }
  },
  tseslint.configs.recommended,
  {
    files: ['**/*.json'],
    plugins: { json },
    language: 'json/json',
    extends: ['json/recommended']
  },
  {
    files: ['**/*.jsonc'],
    plugins: { json },
    language: 'json/jsonc',
    extends: ['json/recommended']
  },
  {
    files: ['**/*.json5'],
    plugins: { json },
    language: 'json/json5',
    extends: ['json/recommended']
  },
  {
    files: ['**/*.md'],
    plugins: { markdown },
    language: 'markdown/commonmark',
    extends: ['markdown/recommended']
  },
  {
    files: ['**/*.css'],
    plugins: { css },
    language: 'css/css',
    extends: ['css/recommended']
  },
  ...astro.configs['flat/recommended'],
  {
    // Astro frontmatter and <script> blocks (virtual *.astro/*.ts) frequently cast
    // to custom element types or untyped JSON — keep any as a warning, not an error.
    files: ['**/*.astro', '**/*.astro/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    rules: {
      'no-console': 'error'
    }
  },
  {
    // CLI scripts are allowed to use console for output
    files: ['scripts/**'],
    rules: {
      'no-console': 'off'
    }
  }
]);
