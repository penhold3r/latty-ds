import type { BorderWidth } from '@latty-ds/tokens/configure';

/** `split` renders the stage twice, light and dark side by side; the generated config uses `system`. */
export type ThemeValue = 'system' | 'light' | 'dark' | 'split';

export interface PlaygroundState {
  primary: string;
  secondary: string;
  radius: number;
  width: BorderWidth;
  /** Newline-separated `font.family` entries: the first is the primary font, the second the secondary, and so on. */
  font: string;
  /** One of the entries in `font`, used for headings; empty means "same as primary". */
  fontHeading: string;
  theme: ThemeValue;
}

/** Everything a preset sets — the preview theme is a viewing choice, so presets leave it alone. */
export type PresetValues = Omit<PlaygroundState, 'theme'>;

export interface Preset {
  id: string;
  label: string;
  values: PresetValues;
}

// Same hexes as tokens.config.json's real defaults (not the indigo/amber demo
// pair from the Theming guide's code snippet) — those are already proven to
// pass contrast everywhere else on the site, so the playground opens showing
// the system's actual out-of-the-box look instead of an arbitrary example.
//
// The preview opens on light, like the rest of the site and configure()'s own default. "System" is opt-in: it follows
// the OS setting through a media query inside the stage, which can disagree with the site's own light/dark toggle.
//
// Only the primary font has a default: the system defines no others, and `lt-text` headings fall back to the primary,
// so a single font and no heading font shows the true out-of-the-box result.
export const DEFAULTS: PlaygroundState = {
  primary: '#ff8200',
  secondary: '#5252c5',
  radius: 8,
  width: 'thin',
  font: '"Hanken Grotesk", sans-serif',
  fontHeading: '',
  theme: 'light'
};

// System font stacks only, so presets work offline and never request a font. Brutalist's light yellow
// primary is deliberate: it's the case the auto-picked on-color text exists for.
export const PRESETS: Preset[] = [
  {
    id: 'default',
    label: 'Default',
    values: {
      primary: DEFAULTS.primary,
      secondary: DEFAULTS.secondary,
      radius: DEFAULTS.radius,
      width: DEFAULTS.width,
      font: DEFAULTS.font,
      fontHeading: DEFAULTS.fontHeading
    }
  },
  {
    id: 'ocean',
    label: 'Ocean',
    values: {
      primary: '#0284c7',
      secondary: '#0d9488',
      radius: 12,
      width: 'thin',
      font: DEFAULTS.font,
      fontHeading: ''
    }
  },
  {
    id: 'forest',
    label: 'Forest',
    values: {
      primary: '#15803d',
      secondary: '#a16207',
      radius: 6,
      width: 'medium',
      font: `${DEFAULTS.font}\nGeorgia, serif`,
      fontHeading: 'Georgia, serif'
    }
  },
  {
    id: 'berry',
    label: 'Berry',
    values: {
      primary: '#be185d',
      secondary: '#6d28d9',
      radius: 20,
      width: 'thin',
      font: DEFAULTS.font,
      fontHeading: ''
    }
  },
  {
    id: 'editorial',
    label: 'Editorial',
    values: {
      primary: '#1f2937',
      secondary: '#b45309',
      radius: 2,
      width: 'medium',
      font: 'system-ui, sans-serif\nGeorgia, "Times New Roman", serif',
      fontHeading: 'Georgia, "Times New Roman", serif'
    }
  },
  {
    id: 'brutalist',
    label: 'Brutalist',
    values: {
      primary: '#ffd60a',
      secondary: '#111827',
      radius: 0,
      width: 'thick',
      font: '"Courier New", monospace',
      fontHeading: ''
    }
  }
];

/**
 * The `font.family` entries in a fonts field: one per non-empty line, in order. One entry per line (not per comma)
 * because commas already mean something inside an entry — `Georgia, serif` is one font with a fallback, and Google
 * Fonts URLs contain them (`ital,wght@0,100..900`).
 */
export const fontEntries = (fonts: string): string[] =>
  fonts
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
