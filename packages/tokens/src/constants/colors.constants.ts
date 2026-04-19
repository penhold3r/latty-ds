/**
 * Standard color palette steps from lightest (50) to darkest (900).
 * These steps are used across all color palettes for consistency.
 */
export const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

/**
 * OKLCH lightness values for each palette step (semantic colors).
 * Defines the perceptual lightness progression from 50 (lightest) to 900 (darkest).
 * Values range from 0 (black) to 1 (white).
 */
export const L_BY_STEP = {
  50: 0.93,
  100: 0.89,
  200: 0.81,
  300: 0.76,
  400: 0.7,
  500: 0.62,
  600: 0.54,
  700: 0.45,
  800: 0.36,
  900: 0.27
} satisfies Record<(typeof STEPS)[number], number>;

/**
 * OKLCH lightness values for neutral (grayscale) palette.
 * Slightly higher lightness values to ensure better readability and contrast.
 */
export const L_BY_STEP_NEUTRAL = {
  50: 0.985,
  100: 0.965,
  200: 0.92,
  300: 0.84,
  400: 0.74,
  500: 0.62,
  600: 0.52,
  700: 0.42,
  800: 0.32,
  900: 0.22
} satisfies Record<(typeof STEPS)[number], number>;

/**
 * Semantic color names available in the design system.
 * These colors are generated from base hex values and support muted variants.
 */
export const COLOR_NAMES = ['error', 'info', 'primary', 'secondary', 'success', 'warning'] as const;
