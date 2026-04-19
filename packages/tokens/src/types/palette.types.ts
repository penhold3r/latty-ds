// for published types paths need to be explicit, can't use aliases
import type { COLOR_NAMES, STEPS } from '../constants/';

/**
 * Numeric step values in the color palette (50-900).
 * Represents lightness levels from lightest (50) to darkest (900).
 */
export type Step = (typeof STEPS)[number];

/**
 * String representation of palette steps.
 * Used as keys in color scale objects.
 */
export type StepStr = `${Step}`;

/**
 * Color palette mapping numeric steps to hex color values.
 * Example: { 50: "#fef2f2", 100: "#fee2e2", ..., 900: "#7f1d1d" }
 */
export type Palette = Record<Step, string>;

/**
 * Flattened color palette with string keys.
 * Example: { "50": "#fef2f2", "100": "#fee2e2", ..., "900": "#7f1d1d" }
 */
export type PaletteFlat = Record<StepStr, string>;

/**
 * Semantic color names available in the design system.
 * - `error`: Error/danger states
 * - `info`: Informational states
 * - `primary`: Primary brand color
 * - `secondary`: Secondary brand color
 * - `success`: Success states
 * - `warning`: Warning/caution states
 */
export type ColorName = (typeof COLOR_NAMES)[number];

/**
 * Muted (desaturated) variant of a semantic color.
 * Example: "primary-muted", "error-muted"
 */
export type MutedColorName = `${ColorName}-muted`;

/**
 * System neutral color name.
 * Used for grayscale values.
 */
export type SystemColorName = 'neutral';

/**
 * All available color token names in the design system.
 * Includes semantic colors, their muted variants, and neutral.
 */
export type TokenColorName = ColorName | MutedColorName | SystemColorName;

/**
 * Design system configuration for color generation.
 * Maps semantic color names to base hex values.
 *
 * @example
 * ```typescript
 * const config: Config = {
 *   color: {
 *     primary: "#3b82f6",
 *     error: "#ef4444",
 *     success: "#10b981",
 *     warning: "#f59e0b",
 *     info: "#06b6d4",
 *     secondary: "#8b5cf6"
 *   }
 * };
 * ```
 */
export type Config = {
  color: Record<ColorName, string>;
};

/**
 * OKLCH color space representation.
 * Perceptually uniform color model for generating accessible color palettes.
 *
 * @property mode - Color space identifier (always "oklch")
 * @property l - Lightness (0-1)
 * @property c - Chroma/saturation (0-0.5 typically)
 * @property h - Hue angle in degrees (0-360)
 *
 * @see https://oklch.com/
 */
export type Oklch = {
  mode: 'oklch';
  l: number;
  c: number;
  h: number;
};
