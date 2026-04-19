import type { PaletteFlat } from '@tokens/types';

/**
 * Elevation level type (0-5)
 */
export type ElevationLevel = '0' | '1' | '2' | '3' | '4' | '5';

/**
 * Elevation tokens mapping levels to box-shadow values
 */
export type ElevationTokens = Record<ElevationLevel, string>;

/**
 * Generates elevation (box-shadow) tokens using the neutral color palette.
 * Creates 6 levels of elevation from flat (0) to maximum shadow (5).
 *
 * The shadows use the neutral palette to ensure they match the design system's
 * color scheme and maintain consistency across light/dark modes.
 *
 * @param neutral - The neutral color palette from the token system
 * @returns ElevationTokens object with shadow values for each level
 *
 * @example
 * ```typescript
 * const neutral = { "900": "#171717", "800": "#262626", ... };
 * const elevation = buildElevation(neutral);
 * // elevation["0"] === "none"
 * // elevation["1"] === "0 1px 3px 0 rgb(23 23 23 / 0.1), ..."
 * // elevation["2"] === "0 4px 6px -1px rgb(23 23 23 / 0.1), ..."
 * ```
 */
export const buildElevation = (neutral: PaletteFlat): ElevationTokens => {
  // Use neutral-900 as the base shadow color for depth
  const shadowColor = neutral['900'] || '#171717';

  // Extract RGB values from hex color
  const hex = shadowColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const rgb = `${r} ${g} ${b}`;

  return {
    '0': 'none',
    '1': `0 1px 3px 0 rgb(${rgb} / 0.1), 0 1px 2px 0 rgb(${rgb} / 0.06)`,
    '2': `0 4px 6px -1px rgb(${rgb} / 0.1), 0 2px 4px -1px rgb(${rgb} / 0.06)`,
    '3': `0 10px 15px -3px rgb(${rgb} / 0.1), 0 4px 6px -2px rgb(${rgb} / 0.05)`,
    '4': `0 20px 25px -5px rgb(${rgb} / 0.1), 0 10px 10px -5px rgb(${rgb} / 0.04)`,
    '5': `0 25px 50px -12px rgb(${rgb} / 0.25)`
  };
};
