import type { SPACE_STEPS } from '../constants/';
import type { EnumerateInclusive } from './utils';

/**
 * Numeric index for spacing values (0-24).
 * Represents multipliers of the base spacing unit (4px).
 */
export type SpaceIndex = EnumerateInclusive<typeof SPACE_STEPS>;

/**
 * String representation of spacing indices.
 * Used as keys in spacing scale objects.
 */
export type SpaceKey = `${SpaceIndex}`;

/**
 * Complete spacing scale mapping indices to CSS values.
 * Example: { "0": "0px", "1": "4px", "2": "8px", ... }
 */
export type SpaceScale = Record<SpaceKey, string>;

/**
 * Design system spacing tokens in both rem and px units.
 * Provides a consistent spacing scale based on a 4px grid system.
 *
 * @example
 * ```typescript
 * const spacing: SpacingTokens = {
 *   rem: { "0": "0rem", "1": "0.25rem", "2": "0.5rem", ... },
 *   px: { "0": "0px", "1": "4px", "2": "8px", ... }
 * };
 * ```
 */
export type SpacingTokens = {
  rem: SpaceScale;
  px: SpaceScale;
};
