import { REM_BASE_PX, SPACE_BASE_PX, SPACE_STEPS } from '@tokens/constants';
import type { SpaceIndex, SpaceScale, SpacingTokens } from '@tokens/types';

/**
 * Generates the complete spacing scale in both px and rem units.
 * Creates a consistent spacing system based on a 4px grid (0-96px in 4px increments).
 *
 * @returns SpacingTokens object with both px and rem scales
 *
 * @example
 * ```typescript
 * const spacing = buildSpacing();
 * // spacing.px["0"] === "0px"
 * // spacing.px["1"] === "4px"
 * // spacing.px["2"] === "8px"
 * // spacing.rem["4"] === "1rem" (16px)
 * ```
 */
export const buildSpacing = (): SpacingTokens => {
  const px = {} as SpaceScale;
  const rem = {} as SpaceScale;

  for (let i = 0; i <= SPACE_STEPS; i++) {
    const v = i * SPACE_BASE_PX;

    px[i as SpaceIndex] = `${v}px`;
    rem[i as SpaceIndex] = `${v / REM_BASE_PX}rem`;
  }

  return { px, rem };
};
