import { describe, it, expect } from 'vitest';

import { contrastRatio, relativeLuminance, resolveVariantColors, WCAG_AA, type ColorPalettes } from './contrast';

const STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'] as const;

/** A ramp spelled out step by step, so each test controls exactly what the picker sees. */
const ramp = (hexes: readonly string[]): Record<string, string> =>
  Object.fromEntries(STEPS.map((step, i) => [step, hexes[i]]));

const NEUTRAL = ramp([
  '#fafafa',
  '#f0f0f0',
  '#e0e0e0',
  '#c8c8c8',
  '#ababab',
  '#868686',
  '#696969',
  '#4d4d4d',
  '#333333',
  '#1b1b1b'
]);

const palettesWith = (variant: Record<string, string>): ColorPalettes => ({
  brand: variant,
  neutral: NEUTRAL,
  white: '#ffffff',
  black: '#000000'
});

// A deep blue: white text holds on 300–900, so the ramp has room to deepen and to lighten.
const DEEP = palettesWith(
  ramp(['#eff4ff', '#dbe6fe', '#a9c2fb', '#3d6ce0', '#2a55c9', '#1e3f9e', '#173080', '#102463', '#0b1a48', '#071030'])
);
// A bright yellow: white fails everywhere near the resting step, so a dark text is needed, and the darker steps
// (from 700) are too dark for that text to hold.
const YELLOW = palettesWith(
  ramp(['#fffbe0', '#fff4b8', '#ffec85', '#ffe24d', '#ffdc2e', '#ffd60a', '#d4b100', '#8f7700', '#5c4c00', '#3d3200'])
);
// Every step the same mid grey at the luminance crossover, where white (4.2) and near-black neutral (4.0) both fall
// short and only pure black (4.9) holds.
const CROSSOVER_GREY = palettesWith(ramp(Array(10).fill('#7a7a7a')));
// Room for the resting step only: its neighbours are too dark for black text.
const NO_ROOM = palettesWith(
  ramp(['#5a5a5a', '#5a5a5a', '#5a5a5a', '#5a5a5a', '#5a5a5a', '#7a7a7a', ...Array(4).fill('#5a5a5a')])
);

describe('contrast maths', () => {
  it('gives 21:1 for black on white and 1:1 for a colour against itself', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5);
    expect(contrastRatio('#7a7a7a', '#7a7a7a')).toBeCloseTo(1, 5);
  });

  it('is symmetric', () => {
    expect(contrastRatio('#336699', '#f0e68c')).toBeCloseTo(contrastRatio('#f0e68c', '#336699'), 10);
  });

  it('orders luminance from black to white', () => {
    expect(relativeLuminance('#000000')).toBe(0);
    expect(relativeLuminance('#ffffff')).toBeCloseTo(1, 10);
  });
});

describe('resolveVariantColors', () => {
  it('prefers white text when it reaches the target', () => {
    expect(resolveVariantColors('brand', DEEP, 'light').onText).toBe('color-white');
  });

  it("falls back to the variant's own deep shade before a plain neutral when white fails", () => {
    expect(resolveVariantColors('brand', YELLOW, 'light').onText).toBe('color-brand-900');
  });

  it('skips a candidate that misses a stricter target', () => {
    // brand-900 is 8.95:1 on the yellow (fine for AA), so a 10:1 target rules it out and near-black neutral wins.
    expect(resolveVariantColors('brand', YELLOW, 'light', 10).onText).toBe('color-neutral-900');
  });

  it('reaches for pure black only when nothing more on-brand holds', () => {
    expect(resolveVariantColors('brand', CROSSOVER_GREY, 'light').onText).toBe('color-black');
  });

  it('takes the highest-contrast candidate when nothing reaches the target', () => {
    expect(resolveVariantColors('brand', CROSSOVER_GREY, 'light', 30).onText).toBe('color-black');
  });

  it('deepens hover and pressed fills for light text, in each theme’s direction', () => {
    const light = resolveVariantColors('brand', DEEP, 'light');
    expect([light.bg, light.hover, light.active]).toEqual(['color-brand-500', 'color-brand-600', 'color-brand-700']);
    // Dark starts lighter (400), lightens on hover and deepens when pressed.
    const dark = resolveVariantColors('brand', DEEP, 'dark');
    expect([dark.bg, dark.hover, dark.active]).toEqual(['color-brand-400', 'color-brand-300', 'color-brand-500']);
  });

  it('flips to a lighter fill when the darker one would drop dark text below the target', () => {
    const { bg, hover, active } = resolveVariantColors('brand', YELLOW, 'light');
    // Hover: one darker step (600) still holds. Pressed: two darker (700) is too dark for the text, so it lightens.
    expect([bg, hover, active]).toEqual(['color-brand-500', 'color-brand-600', 'color-brand-300']);
  });

  it('keeps hover and pressed on the resting fill when neither direction has room', () => {
    const colors = resolveVariantColors('brand', NO_ROOM, 'light');
    expect(colors.hover).toBe(colors.bg);
    expect(colors.active).toBe(colors.bg);
  });

  it('never lets the text drop below the target on any fill it picked', () => {
    const hexOf = (palettes: ColorPalettes, token: string): string => {
      if (token === 'color-white') return '#ffffff';
      if (token === 'color-black') return '#000000';
      const [, name, step] = token.split('-');
      return (palettes[name] as Record<string, string>)[step];
    };
    const results = [DEEP, YELLOW, CROSSOVER_GREY, NO_ROOM].flatMap((palettes) =>
      (['light', 'dark'] as const).map((mode) => {
        const c = resolveVariantColors('brand', palettes, mode);
        return Math.min(
          ...[c.bg, c.hover, c.active].map((fill) => contrastRatio(hexOf(palettes, c.onText), hexOf(palettes, fill)))
        );
      })
    );

    expect(Math.min(...results)).toBeGreaterThanOrEqual(WCAG_AA);
  });

  it('throws a clear error for a variant with no ramp', () => {
    expect(() => resolveVariantColors('missing', DEEP, 'light')).toThrow('No colour ramp named "missing"');
  });
});
