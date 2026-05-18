import type { Config } from '../types/';
import type { LattyConfig } from '../types/public-types';

import { DEFAULT_BORDER_RADIUS, DEFAULT_FONT_FAMILY } from '../constants/';
import { buildTokens, tokensToCss, semanticTokensToCss } from '../core/';
import { buildSemanticTokens } from '../semantic/';
import tokensConfig from '../../tokens.config.json';

export type { LattyConfig };

const DEFAULTS: Required<Omit<LattyConfig, 'theme'>> = {
  colors: tokensConfig.color,
  font: { family: DEFAULT_FONT_FAMILY },
  border: { radius: DEFAULT_BORDER_RADIUS }
};

const toInternalConfig = (userConfig: LattyConfig): Config => ({
  color: { ...DEFAULTS.colors, ...userConfig.colors }
});

/**
 * Generates a complete CSS stylesheet string (primitive + semantic tokens)
 * from the provided config. Useful for SSR — inject the returned string into
 * a `<style>` tag server-side.
 */
export const createStyleSheet = (userConfig: LattyConfig = {}): string => {
  const cfg = toInternalConfig(userConfig);
  let tokens = buildTokens(cfg);

  if (userConfig.font?.family) {
    tokens = { ...tokens, typography: { fontFamily: userConfig.font.family } };
  }
  if (userConfig.border?.radius) {
    tokens = { ...tokens, border: { ...tokens.border, radius: userConfig.border.radius } };
  }

  const primitives = tokensToCss(tokens);
  const theme = userConfig.theme ?? 'light';
  const primary = tokens.color.primary as Record<string, string>;
  const semanticOpts = { primary500: primary['500'], primary400: primary['400'] };

  if (theme === 'dark') return primitives + '\n' + semanticTokensToCss(buildSemanticTokens('dark', semanticOpts));
  if (theme === 'light') return primitives + '\n' + semanticTokensToCss(buildSemanticTokens('light', semanticOpts));
  // 'system' (and deprecated 'auto'): light at :root + dark via media query + [data-theme] overrides
  return (
    primitives +
    '\n' +
    semanticTokensToCss(buildSemanticTokens('light', semanticOpts)) +
    '\n' +
    semanticTokensToCss(buildSemanticTokens('dark', semanticOpts), '@media (prefers-color-scheme: dark)') +
    '\n' +
    semanticTokensToCss(buildSemanticTokens('dark', semanticOpts), '[data-theme="dark"]') +
    '\n' +
    semanticTokensToCss(buildSemanticTokens('light', semanticOpts), '[data-theme="light"]')
  );
};

/**
 * Injects design tokens into the document as a `<style>` element.
 * Call once at your app's entry point — before any components render.
 *
 * @example
 * ```ts
 * import { configure } from '@latty/tokens/configure';
 *
 * configure({
 *   colors: { primary: '#6366f1', secondary: '#f59e0b' },
 *   font:   { family: 'Inter, sans-serif' },
 *   border: { radius: '0.375rem' },
 * });
 * ```
 */
export const configure = (userConfig: LattyConfig = {}): void => {
  const css = createStyleSheet(userConfig);

  let style = document.getElementById('lt-tokens') as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement('style');
    style.id = 'lt-tokens';
    document.head.prepend(style);
  }
  style.textContent = css;
};
