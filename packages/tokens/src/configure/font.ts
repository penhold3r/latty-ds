import type { FontFallback, FontFamilyEntry } from '../types/public-types';

export interface ResolvedFont {
  /** CSS `font-family` value to write to the resolved slot's token. Empty when it couldn't be derived. */
  family: string;
  /** Stylesheet URL to `@import`, or `null` when `family` was a plain CSS value. */
  importUrl: string | null;
}

const FONT_FAMILY_SLOT_NAMES = ['Primary', 'Secondary', 'Tertiary', 'Quaternary'] as const;

/** Maps a `font.family` array index to its typography token key, e.g. `0` → `fontFamilyPrimary`, `4` → `fontFamily5`. */
export const fontFamilySlot = (index: number): string =>
  `fontFamily${FONT_FAMILY_SLOT_NAMES[index] ?? String(index + 1)}`;

/**
 * Strips one layer of matching wrapping quotes, e.g. from a value copied out
 * of a JS/CSS string literal example (`'https://...'` → `https://...`).
 * Leaves legitimate CSS values like `"Times New Roman", serif` alone, since
 * those don't start *and* end with the same quote character.
 */
const unwrapQuotes = (value: string): string => {
  const trimmed = value.trim();
  const first = trimmed[0];
  if (trimmed.length > 1 && (first === '"' || first === "'") && trimmed[trimmed.length - 1] === first) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
};

const isUrl = (value: string): boolean => /^https?:\/\//i.test(value);

/** Splits a single `family` query value on the legacy `|` separator, then strips the `:ital,wght@...` axis spec. */
const namesFromFamilyParam = (raw: string): string[] =>
  raw
    .split('|')
    .map((part) => part.split(':')[0].trim())
    .filter(Boolean);

const quoteIfNeeded = (name: string): string => (/\s/.test(name) ? `"${name}"` : name);

/**
 * Resolves a single `font.family` entry into an actual CSS value plus an
 * optional stylesheet URL to load. Plain CSS values (the common case) pass
 * straight through.
 *
 * Google Fonts CSS2 URLs (`fonts.googleapis.com`) get their family name(s)
 * parsed out of the `family=` query param(s) so the token stays valid CSS —
 * e.g. `family=Hanken+Grotesk:ital,wght@0,100..900` becomes `"Hanken Grotesk"`.
 * The generic fallback appended after the family name(s) defaults to
 * `sans-serif`, or can be overridden via the `{ url, fallback }` object form.
 * URLs from any other host still get loaded, but since there's no reliable
 * way to guess the family name from an arbitrary CDN, `family` comes back
 * empty and the caller should leave the existing/default token untouched.
 *
 * A single layer of wrapping quotes is stripped before any of the above —
 * easy to end up with when copying a URL out of a quoted JS/CSS example.
 */
const resolveSingleFont = (entry: FontFamilyEntry): ResolvedFont => {
  const rawValue = typeof entry === 'string' ? entry : entry.url;
  const fallback: FontFallback = typeof entry === 'string' ? 'sans-serif' : (entry.fallback ?? 'sans-serif');

  const unwrapped = unwrapQuotes(rawValue);
  if (!isUrl(unwrapped)) return { family: unwrapped, importUrl: null };

  let parsed: URL;
  try {
    parsed = new URL(unwrapped);
  } catch {
    return { family: unwrapped, importUrl: null };
  }

  if (parsed.hostname.toLowerCase() === 'fonts.googleapis.com') {
    const names = [...new Set(parsed.searchParams.getAll('family').flatMap(namesFromFamilyParam))];
    if (names.length > 0) {
      return { family: `${names.map(quoteIfNeeded).join(', ')}, ${fallback}`, importUrl: unwrapped };
    }
  }

  return { family: '', importUrl: unwrapped };
};

/**
 * Resolves `font.family` (a single entry or an array of entries) into one
 * {@link ResolvedFont} per entry, in order. Each entry maps to its own
 * typography token via {@link fontFamilySlot} — the array isn't collapsed
 * into a single CSS fallback stack, so a consumer can reference each font
 * independently (e.g. a heading font vs. a body font).
 */
export const resolveFontFamilies = (value: FontFamilyEntry | FontFamilyEntry[]): ResolvedFont[] =>
  (Array.isArray(value) ? value : [value]).map(resolveSingleFont);
