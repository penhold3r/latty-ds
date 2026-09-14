import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import css from '@eslint/css';
import vitest from '@vitest/eslint-plugin';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    ignores: [
      '**/dist/**',
      '**/dist-scripts/**',
      '**/*.d.ts',
      'packages/utils/src/*.js',
      'docs/build/**',
      'docs/.docusaurus/**'
    ]
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
    // tsconfig.json conventionally allows comments (JSONC) despite the .json
    // extension — Docusaurus's own generated tsconfig.json has them.
    files: ['**/tsconfig*.json'],
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
    ignores: ['**/CHANGELOG.md'],
    plugins: { markdown },
    language: 'markdown/commonmark',
    extends: ['markdown/recommended']
  },
  {
    files: ['**/CHANGELOG.md'],
    plugins: { markdown },
    language: 'markdown/commonmark',
    extends: ['markdown/recommended'],
    rules: {
      'markdown/no-multiple-h1': 'off',
      'markdown/heading-increment': 'off'
    }
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
