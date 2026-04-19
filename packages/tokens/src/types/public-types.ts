import type { PaletteFlat, TokenColorName } from './palette.types';
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
 *     radius: "0.375rem",
 *     square: false
 *   },
 *   typography: {
 *     fontFamily: "Asap, sans-serif"
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
  color: Record<TokenColorName, PaletteFlat>;
  spacing: SpacingTokens;
  border: {
    radius: string;
    square: false;
  };
  typography: {
    fontFamily: string;
  };
  elevation: ElevationTokens;
};

export type { TokenColorName, Config } from './';
