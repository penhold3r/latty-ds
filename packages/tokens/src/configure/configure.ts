import type { Config } from '../types/';
import type { BorderWidth, LattyConfig } from '../types/public-types';

import { BORDER_WIDTH_PRESETS, DEFAULT_BORDER_RADIUS, DEFAULT_BORDER_WIDTH, DEFAULT_FONT_FAMILY } from '../constants/';
import { buildTokens, tokensToCss, semanticTokensToCss } from '../core/';
import { buildSemanticTokens } from '../semantic/';
import { resolveFontFamilies, fontFamilySlot } from './font';
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

  const importUrls: string[] = [];
  if (userConfig.font?.family) {
    const resolvedFonts = resolveFontFamilies(userConfig.font.family);
    const typographyOverrides: Record<string, string> = {};
    resolvedFonts.forEach((font, i) => {
      if (font.importUrl) importUrls.push(font.importUrl);
      // Only override the slot when a family name could actually be derived —
      // a CDN URL we can't parse (non-Google-Fonts host) still gets @import'd
      // below, but the token itself falls back to the default rather than
      // being set to an unusable empty string.
      if (font.family) typographyOverrides[fontFamilySlot(i)] = font.family;
    });
    if (Object.keys(typographyOverrides).length > 0) {
      tokens = { ...tokens, typography: { ...tokens.typography, ...typographyOverrides } };
    }
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

  let body: string;
  if (theme === 'dark') {
    body = primitives + '\n' + semanticTokensToCss(buildSemanticTokens('dark', semanticOpts));
  } else if (theme === 'light') {
    body = primitives + '\n' + semanticTokensToCss(buildSemanticTokens('light', semanticOpts));
  } else {
    // 'system' (and deprecated 'auto'): light at :root + dark via media query + [data-theme] overrides
    body =
      primitives +
      '\n' +
      semanticTokensToCss(buildSemanticTokens('light', semanticOpts)) +
      '\n' +
      semanticTokensToCss(buildSemanticTokens('dark', semanticOpts), '@media (prefers-color-scheme: dark)') +
      '\n' +
      semanticTokensToCss(buildSemanticTokens('dark', semanticOpts), '[data-theme="dark"]') +
      '\n' +
      semanticTokensToCss(buildSemanticTokens('light', semanticOpts), '[data-theme="light"]');
  }

  // @import must be the first rule(s) of a stylesheet — safe here since
  // they're the first thing written into the returned string.
  const importLines = importUrls.map((url) => `@import url("${url}");`).join('\n');
  return importLines ? `${importLines}\n${body}` : body;
};

/**
 * Injects design tokens into the document as a `<style>` element.
 * Call once at your app's entry point — before any components render.
 *
 * `font.family` accepts a single value or an array. Each entry is either a
 * plain CSS `font-family` value or a Google Fonts CSS2 stylesheet URL (which
 * configure() `@import`s and derives the family name from automatically — no
 * separate `<link>` tag needed). Array entries map to their own token in
 * order — `--lt-typography-fontFamilyPrimary`, `...Secondary`, `...Tertiary`,
 * etc. — so each font can be referenced independently in your own CSS.
 *
 * @example
 * ```html
 * <script type="module">
 *   import { configure } from '@latty-ds/tokens/configure';
 *   configure({
 *     colors: { primary: '#6366f1', secondary: '#f59e0b' },
 *     font:   { family: [
 *       'https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,100..900;1,100..900&display=swap',
 *       'Georgia, serif',
 *     ] },
 *     border: { radius: '0.375rem', width: 'medium' },
 *   });
 * </script>
 * ```
 */
export const configure = (userConfig: LattyConfig = {}): void => {
  let style = document.getElementById('lt-tokens') as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement('style');
    style.id = 'lt-tokens';
    document.head.prepend(style);
  }
  style.textContent = createStyleSheet(userConfig);
};
