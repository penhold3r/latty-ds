/**
 * Build script for generating design tokens.
 *
 * Reads configuration from `tokens.config.json` and generates:
 * - tokens.json: Complete token object
 * - tokens.css: CSS custom properties
 * - tokens.js: JavaScript export for runtime use
 *
 * Output is written to the `dist/` directory.
 *
 * @module scripts/build-tokens
 */

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

import { logger } from '@utils/logger';

import type { Config } from '@tokens/types';
import type { Tokens } from '@tokens/types/public-types';

import { buildSpacing } from '../spacing/';
import { buildElevation } from '../elevation/';
import { addSystemColors, buildColorTokens } from './build-colors';

/**
 * Current script directory path.
 */
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

/**
 * Root directory of the tokens package.
 */
const pkgRoot = path.resolve(__dirname, '..');

/**
 * Output directory for generated token files.
 */
const outDir = path.join(pkgRoot, 'dist');

/**
 * Path to the tokens configuration file.
 */
const configPath = path.join(pkgRoot, 'tokens.config.json');

if (!fs.existsSync(configPath)) {
  logger.error(`Missing tokens config: ${configPath}`);
  process.exit(1);
}

/**
 * Loaded design system configuration.
 * Contains base color values for palette generation.
 */
const config: Config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

/**
 * Converts design tokens to CSS custom properties.
 *
 * Rules:
 * - String values become CSS variables
 * - Objects are recursively traversed
 * - All variables use `--lt-` prefix
 * - Token path becomes variable name with `-` separators
 *
 * Special handling:
 * - `spacing.rem` tokens drop the "rem" segment (canonical form)
 * - `spacing.px` tokens keep the "px" segment for disambiguation
 *
 * @param tokens - Complete design tokens object
 * @returns CSS string with :root selector and custom properties
 *
 * @example
 * Input:
 * ```typescript
 * {
 *   color: { primary: { "500": "#3b82f6" } },
 *   spacing: { rem: { "4": "1rem" }, px: { "4": "16px" } }
 * }
 * ```
 *
 * Output:
 * ```css
 * :root{
 *   --lt-color-primary-500: #3b82f6;
 *   --lt-spacing-4: 1rem;
 *   --lt-spacing-px-4: 16px;
 * }
 * ```
 */
const tokensToCss = (tokens: Tokens) => {
  const lines: string[] = [];

  /**
   * Recursively walks the token object tree and generates CSS variable declarations.
   *
   * @param value - Current node in the token tree
   * @param parts - Accumulated path segments for variable name
   */
  const walker = (value: unknown, parts: string[]) => {
    if (typeof value === 'string') {
      lines.push(`  --lt-${parts.join('-')}: ${value};`);
      return;
    }

    if (!value || typeof value !== 'object') return;

    for (const key of Object.keys(value as Record<string, unknown>).sort()) {
      const next = (value as Record<string, unknown>)[key];

      // spacing special-case:
      // spacing.rem["4"] -> spacing["4"]
      // spacing.px["4"]  -> spacing-px["4"]
      if (parts.length === 1 && parts[0] === 'spacing' && (key === 'rem' || key === 'px')) {
        if (key === 'rem') {
          walker(next, ['spacing']); // drop "rem"
        } else {
          walker(next, ['spacing', 'px']); // keep px
        }
        continue;
      }

      walker(next, [...parts, key]);
    }
  };

  walker(tokens, []);

  return `:root{\n${lines.join('\n')}\n}\n`;
};

/**
 * Builds the complete design tokens object.
 * Combines color, spacing, border, and typography tokens.
 *
 * @param cfg - Design system configuration
 * @returns Complete tokens object
 */
const buildTokens = (cfg: Config): Tokens => {
  logger.info('Building tokens...');

  let color = buildColorTokens(cfg);
  color = addSystemColors(color);

  const spacing = buildSpacing();

  const border = {
    radius: '0.5rem',
    square: false
  };

  const typography = {
    fontFamily: `"Asap", sans-serif`
  };

  // Build elevation using the neutral color palette
  const elevation = buildElevation(color.neutral);

  return { color, spacing, border, typography, elevation } as Tokens;
};

// ============================================================================
// Build execution
// ============================================================================

/**
 * Generate complete token object from configuration.
 */
const tokens = buildTokens(config);

/**
 * Convert tokens to CSS custom properties.
 */
const css = tokensToCss(tokens);

// ============================================================================
// Write output files
// ============================================================================

/**
 * Ensure output directory exists.
 */
fs.mkdirSync(outDir, { recursive: true });

/**
 * Write tokens.json - Complete token object for tooling and documentation.
 */
fs.writeFileSync(path.join(outDir, 'tokens.json'), JSON.stringify(tokens, null, 2) + '\n', 'utf8');

/**
 * Write tokens.css - CSS custom properties for direct import in stylesheets.
 */
fs.writeFileSync(path.join(outDir, 'tokens.css'), css, 'utf8');

/**
 * Write tokens.js - JavaScript/TypeScript module export for runtime use.
 */
fs.writeFileSync(path.join(outDir, 'tokens.js'), `export const tokens = ${JSON.stringify(tokens)};\n`, 'utf8');

/**
 * Write index.js - Package entry point that re-exports tokens.
 */
fs.writeFileSync(path.join(outDir, 'index.js'), `export * from "./tokens.js";\n`, 'utf8');

// Note: Type definitions are generated separately via `tsc -p tsconfig.types.json`
logger.success('[@latty/tokens] wrote dist/tokens.css + dist/tokens.json');
