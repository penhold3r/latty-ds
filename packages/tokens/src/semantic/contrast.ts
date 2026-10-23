import { STEPS } from '../constants/';

/**
 * WCAG contrast maths, plus the picker that turns each variant's generated palette into interactive tokens whose
 * text is always readable.
 *
 * The consumer chooses the base colours (`primary`, `secondary`, `success`…); the palette generator expands each
 * into a 50–900 ramp. Nothing about those ramps can be assumed (a pale yellow primary and a near-black one behave
 * very differently), so instead of hard-coding "white text on the 500 step" the picker looks at the actual colours
 * and chooses the text — and, where needed, the hover/pressed fill steps — that reach the contrast target.
 */

/** WCAG AA for normal text. */
export const WCAG_AA = 4.5;

export type ThemeMode = 'light' | 'dark';

/** A generated ramp: step → hex (`{ '50': '#…', …, '900': '#…' }`). */
export type Palette = Record<string, string>;

/** `tokens.color`: every variant's ramp, plus the plain `white` / `black` values. */
export type ColorPalettes = Record<string, Palette | string>;

/** Token names (`color-success-900`, `color-white`) for one variant, ready to be written into the semantic map. */
export interface VariantColors {
  /** Text/icon colour that sits on the variant's fill. */
  onText: string;
  /** Resting fill and its hover / pressed fills. */
  bg: string;
  hover: string;
  active: string;
}

/**
 * Calculates the relative luminance of a color.
 * @param {string} hex - The hex color string.
 * @returns {number} The relative luminance.
 */
export const relativeLuminance = (hex: string): number => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};

/**
 * Calculates the contrast ratio between two colors.
 * @param {string} a - The first hex color.
 * @param {string} b - The second hex color.
 * @returns {number} The contrast ratio.
 */
export const contrastRatio = (a: string, b: string): number => {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};

/**
 * Where each theme rests on the ramp and which way it moves for hover / pressed. Light fills darken on interaction;
 * dark fills (which start lighter, for visibility on dark surfaces) lighten on hover and deepen when pressed. When
 * the chosen text can't hold its contrast one way, the picker tries the other direction before giving up.
 */
const LADDER: Record<
  ThemeMode,
  {
    rest: number;
    hover: { directions: readonly (1 | -1)[]; steps: number };
    active: { directions: readonly (1 | -1)[]; steps: number };
  }
> = {
  light: { rest: 500, hover: { directions: [1, -1], steps: 1 }, active: { directions: [1, -1], steps: 2 } },
  dark: { rest: 400, hover: { directions: [-1, 1], steps: 1 }, active: { directions: [1, -1], steps: 1 } }
};

/**
 * Converts a palette value to a Palette object, throwing if invalid.
 * @param {Palette | string | undefined} value - The palette value.
 * @param {string} name - The palette name for error messages.
 * @returns {Palette} The palette.
 * @throws {Error} If the palette value is invalid or undefined.
 */
const asPalette = (value: Palette | string | undefined, name: string): Palette => {
  if (value === undefined || typeof value === 'string') throw new Error(`No colour ramp named "${name}"`);
  return value;
};

/**
 * Picks the on-colour and the interactive fills for one variant in one theme.
 *
 * Text is the first candidate that reaches `minContrast` on the resting fill, in order of how on-brand it is:
 * white, the variant's own lightest tint, the variant's own deepest shade, near-black neutral, pure black. It
 * prefers one that also holds on the variant's `bg` step (500, which some components paint directly); if none
 * does, resting-fill contrast wins. If nothing reaches the target, the highest-contrast candidate is used — pure
 * black or white always reaches 4.58:1 for any fill, so AA is always attainable.
 *
 * Hover and pressed fills walk the ramp from the resting step in the theme's usual direction, flip if the text
 * would fail that way, and stay put if neither direction has room, so the text never drops below the target.
 * @param {string} variant - The variant name.
 * @param {ColorPalettes} palettes - The color palettes.
 * @param {ThemeMode} mode - The theme mode.
 * @param {number} [minContrast] - The minimum contrast ratio.
 * @returns {VariantColors} The resolved variant colors.
 */
export const resolveVariantColors = (
  variant: string,
  palettes: ColorPalettes,
  mode: ThemeMode,
  minContrast: number = WCAG_AA
): VariantColors => {
  const palette = asPalette(palettes[variant], variant);
  const neutral = asPalette(palettes.neutral, 'neutral');
  const white = typeof palettes.white === 'string' ? palettes.white : '#ffffff';
  const black = typeof palettes.black === 'string' ? palettes.black : '#000000';

  const ladder = LADDER[mode];
  const restIndex = STEPS.indexOf(ladder.rest as (typeof STEPS)[number]);
  const fill = palette[String(ladder.rest)];
  const solid = palette['500'];

  const candidates: readonly [token: string, hex: string][] = [
    ['color-white', white],
    [`color-${variant}-50`, palette['50']],
    [`color-${variant}-900`, palette['900']],
    ['color-neutral-900', neutral['900']],
    ['color-black', black]
  ];
  const reaches = (hex: string, background: string) => contrastRatio(hex, background) >= minContrast;

  const [onText, onHex] =
    candidates.find(([, hex]) => reaches(hex, fill) && reaches(hex, solid)) ??
    candidates.find(([, hex]) => reaches(hex, fill)) ??
    candidates.reduce((best, next) => (contrastRatio(next[1], fill) > contrastRatio(best[1], fill) ? next : best));

  const walk = ({ directions, steps }: { directions: readonly (1 | -1)[]; steps: number }): number => {
    for (const direction of directions) {
      const step = STEPS[restIndex + direction * steps];
      const hex = step === undefined ? undefined : palette[String(step)];
      if (hex && reaches(onHex, hex)) return step;
    }
    return ladder.rest;
  };

  return {
    onText,
    bg: `color-${variant}-${ladder.rest}`,
    hover: `color-${variant}-${walk(ladder.hover)}`,
    active: `color-${variant}-${walk(ladder.active)}`
  };
};
