export interface ResolvedFont {
  /** CSS `font-family` value to write to `--lt-typography-fontFamily`. Empty when it couldn't be derived. */
  family: string;
  /** Stylesheet URL to `@import`, or `null` when `family` was a plain CSS value. */
  importUrl: string | null;
}

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
 * Resolves `font.family` into an actual CSS value plus an optional stylesheet
 * URL to load. Plain CSS values (the common case) pass straight through.
 *
 * Google Fonts CSS2 URLs (`fonts.googleapis.com`) get their family name(s)
 * parsed out of the `family=` query param(s) so the token stays valid CSS —
 * e.g. `family=Hanken+Grotesk:ital,wght@0,100..900` becomes `"Hanken Grotesk"`.
 * URLs from any other host still get loaded, but since there's no reliable
 * way to guess the family name from an arbitrary CDN, `family` comes back
 * empty and the caller should leave the existing/default token untouched.
 *
 * A single layer of wrapping quotes is stripped before any of the above —
 * easy to end up with when copying a URL out of a quoted JS/CSS example.
 */
export const resolveFontFamily = (value: string): ResolvedFont => {
  const unwrapped = unwrapQuotes(value);
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
      return { family: `${names.map(quoteIfNeeded).join(', ')}, sans-serif`, importUrl: unwrapped };
    }
  }

  return { family: '', importUrl: unwrapped };
};
