import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import css from '@eslint/css';
import vitest from '@vitest/eslint-plugin';
import jsdoc from 'eslint-plugin-jsdoc';
import { defineConfig } from 'eslint/config';
import lattyComponentColors from './eslint-rules/no-raw-component-colors.mjs';

export default defineConfig([
  {
    ignores: [
      '**/dist/**',
      '**/dist-scripts/**',
      '**/*.d.ts',
      'packages/utils/src/*.js',
      'docs/build/**',
      'docs/.docusaurus/**',
      'docs/test-results/**',
      'docs/playwright-a11y-report/**'
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
    // Component stylesheets must use tokens, not hard-coded colour; existing violations are grandfathered per file
    // (see the rule's BASELINE) so this only fails on new ones.
    files: ['packages/web/src/components/**/*.styles.ts'],
    plugins: { 'latty-colors': lattyComponentColors },
    rules: { 'latty-colors/no-raw-component-colors': 'error' }
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
    // Strict JSDoc validation for all source files (excluding tests and generated files)
    files: ['packages/**/*.ts', 'packages/**/*.tsx'],
    ignores: ['**/*.test.ts', '**/*.test.tsx', '**/*.d.ts', 'packages/utils/src/*.js', '**/dist/**'],
    plugins: { jsdoc },
    rules: {
      // Structure & syntax
      'jsdoc/check-syntax': 'error',
      'jsdoc/check-tag-names': [
        'error',
        { definedTags: ['element', 'cssprop', 'fires', 'slot', 'example', 'part', 'csspart', 'deprecated'] }
      ],
      'jsdoc/empty-tags': 'error',
      'jsdoc/no-bad-blocks': 'error',
      'jsdoc/no-multi-asterisks': 'error',
      'jsdoc/tag-lines': 'error',
      'jsdoc/valid-types': 'off',

      // Type checking (informative, not strict)
      'jsdoc/check-types': 'warn',
      'jsdoc/no-undefined-types': 'warn',

      // Require JSDoc for public API (classes, public methods, public properties)
      'jsdoc/require-description': 'error',
      'jsdoc/require-description-complete-sentence': 'error',
      'jsdoc/require-hyphen-before-param-description': 'error',

      // Allow missing JSDoc on private members and void functions
      'jsdoc/require-param': 'off',
      'jsdoc/require-param-description': 'off',
      'jsdoc/require-param-name': 'off',
      'jsdoc/require-param-type': 'off',
      'jsdoc/require-property': 'off',
      'jsdoc/require-property-description': 'off',
      'jsdoc/require-property-name': 'off',
      'jsdoc/require-property-type': 'off',
      'jsdoc/require-returns': 'off',
      'jsdoc/require-returns-check': 'off',
      'jsdoc/require-returns-description': 'off',
      'jsdoc/require-returns-type': 'off',
      'jsdoc/require-throws': 'off',

      // Disabled (too strict for this codebase)
      'jsdoc/check-alignment': 'off',
      'jsdoc/check-indentation': 'off',
      'jsdoc/check-line-alignment': 'off',
      'jsdoc/check-param-names': 'off',
      'jsdoc/check-property-names': 'off',
      'jsdoc/check-values': 'off',
      'jsdoc/implements-on-classes': 'off',
      'jsdoc/multiline-blocks': 'off',
      'jsdoc/no-defaults': 'off',
      'jsdoc/no-restricted-syntax': 'off',
      'jsdoc/no-types': 'off',
      'jsdoc/require-example': 'off',
      'jsdoc/sort-tags': 'off'
    }
  },
  {
    rules: {
      'no-console': 'error'
    }
  }
]);
