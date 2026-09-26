import type { BorderWidth } from '@latty-ds/tokens/configure';
import { DEFAULTS, fontEntries } from './ThemePlayground.state';
import type { PlaygroundState, ThemeValue } from './ThemePlayground.state';

// Query-string keys for each piece of state. `preview` (not `theme`) for the light/dark/split mode so it
// can't be mistaken for the site's own color mode.
const KEYS = {
  primary: 'primary',
  secondary: 'secondary',
  radius: 'radius',
  width: 'width',
  font: 'font',
  fontHeading: 'heading',
  theme: 'preview'
} as const satisfies Record<keyof PlaygroundState, string>;

const WIDTHS: BorderWidth[] = ['thin', 'medium', 'thick'];
const THEMES: ThemeValue[] = ['system', 'light', 'dark', 'split'];
const MAX_LENGTH = { font: 1000, fontHeading: 300 } as const;

/**
 * Reads whatever valid state the URL carries. Anything malformed is dropped rather than trusted, since
 * these values flow into generated CSS and the export snippet.
 */
export const readStateFromUrl = (): Partial<PlaygroundState> => {
  const params = new URLSearchParams(window.location.search);
  const out: Partial<PlaygroundState> = {};

  const hex = (key: 'primary' | 'secondary') => {
    const value = params.get(KEYS[key]);
    if (value && /^#[0-9a-f]{6}$/i.test(value)) out[key] = value.toLowerCase();
  };
  hex('primary');
  hex('secondary');

  const radius = params.get(KEYS.radius);
  if (radius && /^\d{1,2}$/.test(radius) && Number(radius) <= 24) out.radius = Number(radius);

  const width = params.get(KEYS.width) as BorderWidth | null;
  if (width && WIDTHS.includes(width)) out.width = width;

  const theme = params.get(KEYS.theme) as ThemeValue | null;
  if (theme && THEMES.includes(theme)) out.theme = theme;

  (['font', 'fontHeading'] as const).forEach((key) => {
    const value = params.get(KEYS[key]);
    if (value !== null && value.length <= MAX_LENGTH[key]) out[key] = value;
  });
  // The heading font is picked from the fonts list, so one that isn't in it is stale or made up.
  if (out.fontHeading && !fontEntries(out.font ?? DEFAULTS.font).includes(out.fontHeading.trim())) {
    delete out.fontHeading;
  }

  return out;
};

/** The current page URL carrying only the values that differ from the defaults. */
export const stateToUrl = (state: PlaygroundState): URL => {
  const url = new URL(window.location.href);
  (Object.keys(KEYS) as (keyof PlaygroundState)[]).forEach((key) => {
    url.searchParams.delete(KEYS[key]);
    if (state[key] !== DEFAULTS[key]) url.searchParams.set(KEYS[key], String(state[key]));
  });
  return url;
};

/** Mirrors the state into the address bar without adding history entries. */
export const writeStateToUrl = (state: PlaygroundState): void => {
  // Keep history.state as-is: the docs router stores its location key there.
  history.replaceState(history.state, '', stateToUrl(state));
};
