/**
 * Resolves a color value. If the value starts with '--', it is wrapped in 'var()'.
 * Otherwise, the value is returned as-is.
 *
 * @param value - The color value to resolve.
 * @returns The resolved color string.
 *
 * @example
 * ```ts
 * resolveColorValue('--lt-color-primary'); // returns 'var(--lt-color-primary)'
 * resolveColorValue('#ff0000'); // returns '#ff0000'
 * ```
 */
export const resolveColorValue = (value: string): string => (value.startsWith('--') ? `var(${value})` : value);
