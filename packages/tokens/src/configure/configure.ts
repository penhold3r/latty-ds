import type { Config } from '../types/';
import type { BorderWidth, LattyConfig } from '../types/public-types';

import { BORDER_WIDTH_PRESETS, DEFAULT_BORDER_RADIUS, DEFAULT_BORDER_WIDTH, DEFAULT_FONT_FAMILY } from '../constants/';
import { buildTokens, tokensToCss, semanticTokensToCss } from '../core/';
import { buildSemanticTokens } from '../semantic/';
import tokensConfig from '../../tokens.config.json';

export type { BorderWidth, LattyConfig };

const DEFAULTS: Required<Omit<LattyConfig, 'theme'>> = {
  colors: tokensConfig.color,
  font: { family: DEFAULT_FONT_FAMILY },
  border: { radius: DEFAULT_BORDER_RADIUS, width: DEFAULT_BORDER_WIDTH }
};

const toInternalConfig = (userConfig: LattyConfig): Config => ({
  color: { ...DEFAULTS.colors, ...userConfig.colors }
});

/** Maps the named presets (thin/medium/thick) to px; any other CSS length passes through. */
const resolveBorderWidth = (width: BorderWidth): string =>
  BORDER_WIDTH_PRESETS[width as keyof typeof BORDER_WIDTH_PRESETS] ?? width;

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
  if (userConfig.border?.width) {
    tokens = { ...tokens, border: { ...tokens.border, width: resolveBorderWidth(userConfig.border.width) } };
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
 * Add `data-lt` to `<html>` to enable automatic FOUC prevention: configure()
 * hides the document during token injection and reveals it on the next frame.
 * For zero FOUC on initial load, also add this one-liner before your module script:
 * `<style>html[data-lt]:not([data-lt-ready]){visibility:hidden}</style>`
 *
 * @example
 * ```html
 * <html lang="en" data-lt>
 *   <head>
 *     <style>html[data-lt]:not([data-lt-ready]){visibility:hidden}</style>
 *     <script type="module">
 *       import { configure } from '@latty-ds/tokens/configure';
 *       configure({
 *         colors: { primary: '#6366f1', secondary: '#f59e0b' },
 *         font:   { family: 'Inter, sans-serif' },
 *         border: { radius: '0.375rem', width: 'medium' },
 *       });
 *     </script>
 *   </head>
 * </html>
 * ```
 */
export const configure = (userConfig: LattyConfig = {}): void => {
  const root = document.documentElement;

  // Drop the ready flag so the FOUC guard activates while tokens are swapped.
  root.removeAttribute('data-lt-ready');

  let style = document.getElementById('lt-tokens') as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement('style');
    style.id = 'lt-tokens';
    document.head.prepend(style);
  }
  // Guard rule keeps html[data-lt] hidden until data-lt-ready is stamped.
  style.textContent = 'html[data-lt]:not([data-lt-ready]){visibility:hidden}\n' + createStyleSheet(userConfig);

  // Reveal after the browser has processed the new token styles.
  requestAnimationFrame(() => root.setAttribute('data-lt-ready', ''));
};
