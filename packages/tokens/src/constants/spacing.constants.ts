/**
 * Base spacing unit in pixels.
 * All spacing values are multiples of this base (4px grid system).
 */
export const SPACE_BASE_PX = 4 as const;

/**
 * Maximum spacing step index (0-24).
 * Provides 25 spacing values from 0px to 96px.
 */
export const SPACE_STEPS = 24 as const;

/**
 * Base font size for rem calculations.
 * Standard browser default (16px = 1rem).
 */
export const REM_BASE_PX = 16 as const;
