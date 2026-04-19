/**
 * Elevation level for the surface component.
 * Determines the shadow depth applied to the surface.
 *
 * - `0`: No shadow (flat surface)
 * - `1`: Minimal shadow (slightly raised)
 * - `2`: Medium shadow (card-like elevation)
 * - `3`: High shadow (prominent elevation)
 * - `4`: Very high shadow (floating elements)
 * - `5`: Maximum shadow (modals, overlays)
 */
export type SurfaceElevation = '0' | '1' | '2' | '3' | '4' | '5';

/**
 * Visual variant of the surface component.
 * Determines the border and background styling.
 *
 * - `filled`: Solid background with no border
 * - `outlined`: Transparent background with border
 */
export type SurfaceVariant = 'filled' | 'outlined';
