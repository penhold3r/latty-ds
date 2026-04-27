import { formatHex, converter } from 'culori';

import type { Oklch, Palette } from '../types/';
import { L_BY_STEP, L_BY_STEP_NEUTRAL, STEPS } from '../constants/';

/**
 * Converter from any color format to OKLCH color space.
 */
const toOklch = converter('oklch');

/**
 * Converter from any color format to RGB color space.
 */
const toRgb = converter('rgb');

/**
 * Clamps a number between minimum and maximum values.
 *
 * @param n - Number to clamp
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns Clamped value
 */
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

/**
 * Create a perceptual ramp around a base OKLCH color.
 *
 * Lightness is rescaled piecewise around `lPivot` so step 50 always lands
 * near L=0.93 (the canonical light anchor) and step 900 near L=0.27 (the
 * canonical dark anchor), with the pivot step landing exactly on `lPivot`.
 * This guarantees a full light-to-dark range regardless of where the brand
 * color sits in lightness space.
 */
const rampFromBase = (
  base: Oklch,
  opts?: {
    chromaScale?: number;   // overall saturation multiplier
    lPivot?: number;        // lightness to anchor at step 500 (defaults to L_BY_STEP[500])
    midBoost?: number;      // extra saturation around 400–700 (0.0 = none)
    darkClamp?: number;     // max chroma for 800–900
    minChromaFactor?: number; // cMin = cMax * this
  }
): Palette => {
  const chromaScale = opts?.chromaScale ?? 1;
  const lPivot = opts?.lPivot ?? L_BY_STEP[500];
  const midBoost = opts?.midBoost ?? 0;
  const darkClamp = opts?.darkClamp ?? 0.06;
  const minChromaFactor = opts?.minChromaFactor ?? 0.08;

  const out = {} as Palette;
  const h = ((base.h % 360) + 360) % 360;

  const cMax = clamp(base.c * chromaScale, 0, 0.5);

  const c500 = L_BY_STEP[500];
  const c50  = L_BY_STEP[50];
  const c900 = L_BY_STEP[900];

  for (const step of STEPS) {
    const canonical = L_BY_STEP[step];

    // Proportionally stretch each half so the full range [c50, c900] is
    // preserved while the pivot step maps to lPivot.
    let lTarget: number;
    if (canonical >= c500) {
      // Light side: map [c500, c50] → [lPivot, c50]
      const t = (canonical - c500) / (c50 - c500);
      lTarget = lPivot + t * (c50 - lPivot);
    } else {
      // Dark side: map [c500, c900] → [lPivot, c900]
      const t = (canonical - c500) / (c900 - c500);
      lTarget = lPivot + t * (c900 - lPivot);
    }
    lTarget = clamp(lTarget, 0, 1);

    const t = STEPS.indexOf(step) / (STEPS.length - 1); // 0..1 (50 -> 900)
    const peak = clamp(1 - Math.pow(Math.abs(t - 0.55) / 0.55, 1.7), 0, 1);

    const cMin = cMax * minChromaFactor;

    let c = clamp(cMin + (cMax - cMin) * peak, 0, 0.5);

    // Boost or reduce mid tones (where it matters visually)
    c = clamp(c * (1 + midBoost * peak), 0, 0.5);

    // Prevent swampy/neon near-black
    if (step >= 800) c = Math.min(c, darkClamp);

    const color: Oklch = { mode: 'oklch', l: lTarget, c, h };
    const rgb = toRgb(color);
    out[step] = formatHex(rgb);
  }

  return out;
};

/**
 * Generates main and muted color palettes from a base hex color.
 * Uses OKLCH color space for perceptually uniform color generation.
 *
 * @param hex - Base color in hex format (e.g., "#3b82f6")
 * @param useMuted - Whether to generate a muted variant (default: false)
 * @returns Object containing main palette and optional muted palette
 *
 * @throws {Error} If the provided hex color is invalid
 *
 * @example
 * ```typescript
 * const { main, muted } = generatePalettes("#3b82f6", true);
 * // main: { 50: "#eff6ff", ..., 900: "#1e3a8a" }
 * // muted: { 50: "#f0f5ff", ..., 900: "#2e4a6a" }
 * ```
 */
export const generatePalettes = (hex: string, useMuted?: boolean) => {
  const base = toOklch(hex) as Oklch;
  if (!base) throw new Error(`Invalid color: ${hex}`);

  const main = rampFromBase(base, {
    chromaScale: 1.0,
    lPivot: base.l,
    midBoost: 0.0,
    darkClamp: 0.06
  });
  // Pin 500 to the exact input hex to avoid OKLCH → hex round-trip drift.
  main[500] = formatHex(hex) ?? hex;

  // Muted = clearly desaturated (pastel), pivot slightly lifted from the base.
  const muted = useMuted
    ? rampFromBase(base, {
        chromaScale: 0.2,
        lPivot: clamp(base.l + 0.04, 0, 1),
        midBoost: -0.2,
        darkClamp: 0.045,
        minChromaFactor: 0.06
      })
    : null;

  return { main, muted };
};

/**
 * Generates the neutral (grayscale) color palette.
 * Creates a perceptually uniform gray scale from near-white to near-black.
 *
 * @returns Palette with neutral colors across all steps
 *
 * @example
 * ```typescript
 * const neutral = generateNeutralScale();
 * // { 50: "#fafafa", 100: "#f5f5f5", ..., 900: "#171717" }
 * ```
 */
export const generateNeutralScale = (): Palette => {
  const out = {} as Palette;

  for (const step of STEPS) {
    const l = L_BY_STEP_NEUTRAL[step];
    const color: Oklch = { mode: 'oklch', l, c: 0, h: 0 };
    out[step] = formatHex(toRgb(color));
  }

  return out;
};

/**
 * Generates pure black and white color values.
 * Used for absolute contrast and special cases.
 *
 * @returns Object with white and black hex values
 */
export const generateBWColors = () => {
  return {
    white: '#FFFFFF',
    black: '#000000'
  };
};
