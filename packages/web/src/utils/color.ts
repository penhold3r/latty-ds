/**
 * Resolves a color value. If the value starts with '--', it is wrapped in 'var()'.
 * Otherwise, the value is returned as-is.
 * @param {string} value - The color value to resolve.
 * @returns {string} The resolved color string.
 * @example
 * ```ts
 * resolveColorValue('--lt-color-primary'); // returns 'var(--lt-color-primary)'
 * resolveColorValue('#ff0000'); // returns '#ff0000'
 * ```
 */
export const resolveColorValue = (value: string): string => (value.startsWith('--') ? `var(${value})` : value);

const luminanceChannel = (c: number): number => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

export const relativeLuminance = (r: number, g: number, b: number): number =>
  0.2126 * luminanceChannel(r / 255) + 0.7152 * luminanceChannel(g / 255) + 0.0722 * luminanceChannel(b / 255);

export const pickTextColor = (el: Element, part: string): 'white' | 'black' => {
  const target = el.shadowRoot?.querySelector(`[part="${part}"]`) ?? el;
  const bg = getComputedStyle(target).backgroundColor;
  const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return 'black';
  const L = relativeLuminance(+match[1], +match[2], +match[3]);
  return L > 0.179 ? 'black' : 'white';
};
