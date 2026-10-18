import type { PaletteFlat } from '../types/';
import { hexToRgbChannels } from '../elevation/';

/**
 * Shadow tokens: a single RGB-channel string, derived from the same neutral-900 base `buildElevation` uses, for
 * building a custom `box-shadow`/`filter: drop-shadow(...)`/translucent-scrim color that the canned
 * `--lt-elevation-N` levels don't cover (a component-specific blur/spread/direction, a modal backdrop, a
 * tinted hairline border). Consumed as `rgb(var(--lt-shadow-rgb) / <alpha>)`, never as a bare `rgb()`/`rgba()`
 * literal — see the `no-raw-component-colors` eslint rule in `eslint-rules/`.
 */
export type ShadowTokens = { rgb: string };

/**
 * Generates the shadow RGB-channel token from the neutral color palette, so a custom shadow/scrim/tinted-border
 * color stays in step with the rest of the design system's neutral palette instead of hard-coding pure black.
 *
 * @param neutral - The neutral color palette from the token system
 * @returns `{ rgb: "27 27 27" }` (neutral-900's channels, space-separated)
 *
 * @example
 * ```typescript
 * const neutral = { "900": "#171717", ... };
 * const shadow = buildShadow(neutral);
 * // shadow.rgb === "23 23 23"
 * ```
 */
export const buildShadow = (neutral: PaletteFlat): ShadowTokens => ({
  rgb: hexToRgbChannels(neutral['900'] || '#171717')
});
