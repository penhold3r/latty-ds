export type Rgb = [number, number, number];

const channel = (value: number): number => {
  const c = value / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

/** WCAG relative luminance of an sRGB color. */
export const luminance = ([r, g, b]: Rgb): number => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);

export const parseHex = (hex: string): Rgb | null => {
  const m = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16)) as Rgb;
};

/** Parses a computed `rgb()` / `rgba()` color (comma or space separated). Other color spaces return null. */
export const parseComputedColor = (value: string): { rgb: Rgb; alpha: number } | null => {
  const m = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+)(%?))?\s*\)$/.exec(value.trim());
  if (!m) return null;
  const alpha = m[4] === undefined ? 1 : m[5] ? Number(m[4]) / 100 : Number(m[4]);
  return { rgb: [Number(m[1]), Number(m[2]), Number(m[3])], alpha };
};

export const contrastRatio = (a: Rgb, b: Rgb): number => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

export interface ContrastRating {
  label: string;
  /** `lt-badge` variant to render it with. */
  variant: 'success' | 'warning' | 'error';
}

/** Ratings for normal-size text (the role chips are 14px), so the large-text 3:1 tier isn't a pass. */
export const rateContrast = (ratio: number): ContrastRating => {
  if (ratio >= 7) return { label: 'AAA', variant: 'success' };
  if (ratio >= 4.5) return { label: 'AA', variant: 'success' };
  if (ratio >= 3) return { label: 'Low', variant: 'warning' };
  return { label: 'Fail', variant: 'error' };
};
