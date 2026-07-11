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
 *     fontFamily: "Hanken Grotesk, sans-serif"
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
    fontFamily: string;
  };
  elevation: ElevationTokens;
};

export type { Config, TokenColorName } from './';

/**
 * Border width applied to control chrome (outlined buttons, inputs, chips, surfaces).
 * Named presets: `thin` = 1px (default), `medium` = 2px, `thick` = 4px.
 * Any other CSS length (e.g. `'1.5px'`) passes through unchanged.
 */
export type BorderWidth = 'thin' | 'medium' | 'thick' | (string & {});

export interface LattyConfig {
  /** Built-in names: primary, secondary, success, warning, error, info. Any additional name generates a new palette. */
  colors?: Record<string, string>;
  font?: {
    /**
     * A CSS `font-family` value (e.g. `'Inter, sans-serif'`), or a Google
     * Fonts CSS2 stylesheet URL (e.g.
     * `'https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,100..900&display=swap'`).
     * URLs get `@import`ed automatically and the family name is derived from
     * the `family=` query param — no separate `<link>` tag needed. Stylesheet
     * URLs from providers other than `fonts.googleapis.com` are still loaded,
     * but since there's no reliable way to guess the family name from an
     * arbitrary CDN, pass the resulting name as a plain value instead (or
     * open an issue if there's a provider worth special-casing).
     */
    family?: string;
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
