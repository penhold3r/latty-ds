import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import css from '@eslint/css';
import astro from 'eslint-plugin-astro';
import vitest from '@vitest/eslint-plugin';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    ignores: ['**/dist/**', '**/dist-scripts/**', '**/*.d.ts', 'packages/utils/src/*.js']
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
    extends: ['css/recommended'],
    rules: {
      // --lt-* custom properties are resolved at runtime by @latty-ds/tokens
      'css/no-invalid-properties': ['error', { allowUnknownVariables: true }]
    }
  },
  {
    // Docs CSS uses Lightning CSS (via Astro/Vite) which supports CSS nesting,
    // color-mix(), and other modern features that the baseline linter flags.
    // !important is needed to override Shiki's inline styles on <pre> elements.
    files: ['docs/**/*.css'],
    rules: {
      'css/use-baseline': 'off',
      'css/no-important': 'off'
    }
  },
  ...astro.configs['flat/recommended'],
  {
    // Astro frontmatter, <script> blocks, and extracted docs client scripts all
    // cast to custom element types or untyped web component APIs — keep any as
    // a warning rather than an error in the docs layer.
    files: ['**/*.astro', '**/*.astro/*.ts', 'docs/src/**/*.script.ts', 'docs/src/pages/**/_*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  },
  {
    // Test files routinely need any for ref generics and mock shapes that don't
    // match the full element interface — warn rather than error.
    files: ['**/*.test.ts', '**/*.test.tsx'],
    plugins: { vitest },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      'vitest/prefer-each': 'error'
    }
  },
  {
    rules: {
      'no-console': 'error'
    }
  }
]);
