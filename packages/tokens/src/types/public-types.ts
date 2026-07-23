import type { PaletteFlat } from './palette.types';
import type { SpacingTokens } from './spacing.types';
import type { ElevationTokens } from '../elevation/';

/**
 * Complete design system tokens.
 * Includes color palettes, spacing scales, border properties, typography, and elevation.
 *
 * Elevation is automatically generated from the neutral color palette to ensure
 * consistent shadows that match the design system's color scheme.
 *
 * @example
 * ```typescript
 * const tokens: Tokens = {
 *   color: {
 *     primary: { "50": "#eff6ff", ..., "900": "#1e3a8a" },
 *     neutral: { "50": "#fafafa", ..., "900": "#171717" },
 *     // ... other colors
 *   },
 *   spacing: {
 *     rem: { "0": "0rem", "1": "0.25rem", ... },
 *     px: { "0": "0px", "1": "4px", ... }
 *   },
 *   border: {
 *     radius: "0.375rem"
 *   },
 *   typography: {
 *     fontFamilyPrimary: "Hanken Grotesk, sans-serif"
 *   },
 *   elevation: {
 *     "0": "none",
 *     "1": "0 1px 3px 0 rgb(23 23 23 / 0.1), 0 1px 2px 0 rgb(23 23 23 / 0.06)",
 *     // ... other elevations (generated from neutral-900)
 *   }
 * };
 * ```
 */
export type Tokens = {
  color: Record<string, PaletteFlat | string>;
  spacing: SpacingTokens;
  border: {
    radius: string;
    width: string;
  };
  typography: {
    fontFamilyPrimary: string;
  } & Record<string, string>;
  elevation: ElevationTokens;
};

export type { Config, TokenColorName } from './';

/**
 * Border width applied to control chrome (outlined buttons, inputs, chips, surfaces).
 * Named presets: `thin` = 1px (default), `medium` = 2px, `thick` = 4px.
 * Any other CSS length (e.g. `'1.5px'`) passes through unchanged.
 */
export type BorderWidth = 'thin' | 'medium' | 'thick' | (string & {});

/** Generic CSS font-family keyword used as the safety-net fallback if a CDN font fails to load. */
export type FontFallback = 'sans-serif' | 'serif' | 'monospace' | 'cursive' | 'fantasy' | 'system-ui';

/**
 * A single `font.family` entry: a plain CSS value, a Google Fonts CSS2 URL, or
 * a URL paired with a custom generic fallback (default `'sans-serif'`) for
 * when the derived family isn't sans-serif — e.g. a serif display font.
 */
export type FontFamilyEntry = string | { url: string; fallback?: FontFallback };

export interface LattyConfig {
  /** Built-in names: primary, secondary, success, warning, error, info. Any additional name generates a new palette. */
  colors?: Record<string, string>;
  font?: {
    /**
     * A CSS `font-family` value (e.g. `'Inter, sans-serif'`), a Google Fonts
     * CSS2 stylesheet URL (e.g.
     * `'https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,100..900&display=swap'`),
     * a `{ url, fallback }` object, or an array of any of these. URLs get
     * `@import`ed automatically and the family name is derived from the
     * `family=` query param — no separate `<link>` tag needed. Stylesheet
     * URLs from providers other than `fonts.googleapis.com` are still
     * loaded, but since there's no reliable way to guess the family name
     * from an arbitrary CDN, pass the resulting name as a plain value
     * instead (or open an issue if there's a provider worth special-casing).
     *
     * A bare URL string always falls back to the generic `sans-serif` family
     * if the font itself fails to load. Use the `{ url, fallback }` object
     * form to pick a different generic fallback (e.g. `'serif'` for a serif
     * display font):
     * ```ts
     * family: { url: 'https://fonts.googleapis.com/css2?family=Playfair+Display', fallback: 'serif' }
     * ```
     *
     * When an array is passed, each entry maps to its own token in order —
     * `--lt-typography-fontFamilyPrimary`, `...Secondary`, `...Tertiary`,
     * etc. — rather than being combined into a single CSS fallback stack, so
     * multiple fonts (e.g. a heading font and a body font) can each be
     * referenced independently in your own CSS.
     */
    family?: FontFamilyEntry | FontFamilyEntry[];
  };
  border?: {
    radius?: string;
    width?: BorderWidth;
  };
  /**
   * Controls which semantic token layer is emitted.
   * - `'light'` (default) — light tokens only; ignores OS preference
   * - `'dark'`   — dark tokens only; ignores OS preference
   * - `'system'` — light at `:root`, dark inside `@media (prefers-color-scheme: dark)` + `[data-theme]` overrides
   * - `'auto'`   — alias for `'system'`, deprecated
   */
  theme?: 'light' | 'dark' | 'system' | 'auto';
}
