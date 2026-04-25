/**
 * Build script utilities for generating color tokens.
 * Converts color palettes from the configuration into the final token structure.
 *
 * @module scripts/build-colors
 */

import { generateBWColors, generateNeutralScale, generatePalettes } from '../colors/';
import { STEPS } from '../constants/';
import { ColorName, Config, MutedColorName, Palette, PaletteFlat } from '../types/';
import { Tokens } from '../types/public-types';

/**
 * Flattens a step-based palette with numeric keys into string-keyed format.
 * Converts { 50: "#fff", 100: "#eee", ... } to { "50": "#fff", "100": "#eee", ... }
 *
 * @param pal - Palette with numeric step keys
 * @returns Flattened palette with string keys
 *
 * @example
 * ```typescript
 * const palette = { 50: "#ffffff", 100: "#f0f0f0" };
 * const flat = toStepObj(palette);
 * // { "50": "#ffffff", "100": "#f0f0f0" }
 * ```
 */
export const toStepObj = (pal: Palette): PaletteFlat =>
  STEPS.reduce((acc, s) => {
    acc[`${s}`] = pal[s];
    return acc;
  }, {} as PaletteFlat);

/**
 * Builds color tokens from the configuration.
 * Generates main and muted color palettes for each configured color.
 *
 * @param cfg - Design system configuration with color definitions
 * @returns Color tokens object with all semantic colors and their muted variants
 *
 * @example
 * ```typescript
 * const config = {
 *   color: {
 *     primary: "#3b82f6",
 *     error: "#ef4444"
 *   }
 * };
 * const colors = buildColorTokens(config);
 * // {
 * //   primary: { "50": "...", "100": "...", ... },
 * //   "primary-muted": { "50": "...", "100": "...", ... },
 * //   error: { ... },
 * //   "error-muted": { ... }
 * // }
 * ```
 */
export const buildColorTokens = (cfg: Config): Tokens['color'] => {
  const color = {} as Tokens['color'];

  for (const [name, value] of Object.entries(cfg.color) as [ColorName, string][]) {
    const palettes = generatePalettes(value, true);

    color[name] = toStepObj(palettes.main);

    if (palettes.muted) {
      color[`${name}-muted` as MutedColorName] = toStepObj(palettes.muted);
    }
  }

  return color;
};

/**
 * Adds system colors to the color tokens.
 * Includes neutral grayscale palette and pure black/white values.
 *
 * @param color - Existing color tokens object
 * @returns Extended color tokens with neutral, white, and black
 *
 * @example
 * ```typescript
 * const colors = buildColorTokens(config);
 * const allColors = addSystemColors(colors);
 * // Adds: neutral, white, black
 * ```
 */
export const addSystemColors = (color: Tokens['color']) => {
  color.neutral = toStepObj(generateNeutralScale());

  return { ...color, ...generateBWColors() };
};
