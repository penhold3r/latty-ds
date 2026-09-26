// Ported near-verbatim from docs/src/pages/tokens/_playground.script.ts (the
// Astro site) — same treatment as ComponentPlayground.script.ts: only change
// is exporting `init` instead of auto-running it, so index.tsx can call it
// once from a useEffect instead of at module load.
import { createStyleSheet } from '@latty-ds/tokens/configure';
import type { BorderWidth, LattyConfig } from '@latty-ds/tokens/configure';
import { highlight } from '../ComponentPlayground/ComponentPlayground.prism';

type ThemeValue = 'system' | 'light' | 'dark';

type SelectOption = { value: string; label: string };
type SelectEl = HTMLElement & { options: SelectOption[]; value: string };
// lt-color-input and lt-textfield both just expose a plain string .value.
type ValueEl = HTMLElement & { value: string };
type SliderEl = HTMLElement & { value: number };

interface PlaygroundState {
  primary: string;
  secondary: string;
  radius: number;
  width: BorderWidth;
  font: string;
  fontSecondary: string;
  fontHeading: string;
  theme: ThemeValue;
}

// createStyleSheet() always emits `:root { ... }` (and, for theme:'system',
// `[data-theme="dark|light"] { ... }`) blocks. Scoping those selectors down to
// this class keeps the live demo contained to the stage card instead of
// re-theming the whole docs site, whose own tokens are statically imported in
// global.css and would otherwise win the cascade against anything injected at
// runtime (configure() itself only ever targets :root).
const SCOPE = '.playground-stage';

const WIDTH_OPTIONS: SelectOption[] = [
  { value: 'thin', label: 'Thin (1px)' },
  { value: 'medium', label: 'Medium (2px)' },
  { value: 'thick', label: 'Thick (4px)' }
];

const THEME_OPTIONS: SelectOption[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' }
];

// Same hexes as tokens.config.json's real defaults (not the indigo/amber demo
// pair from the Theming guide's code snippet) — those are already proven to
// pass contrast everywhere else on the site, so the playground opens showing
// the system's actual out-of-the-box look instead of an arbitrary example.
//
// The secondary and heading fonts have no default: the system only defines a primary font, and
// `lt-text` headings fall back to it, so leaving them empty shows the true out-of-the-box result.
export const DEFAULTS: PlaygroundState = {
  primary: '#ff8200',
  secondary: '#5252c5',
  radius: 8,
  width: 'thin',
  font: '"Hanken Grotesk", sans-serif',
  fontSecondary: '',
  fontHeading: '',
  theme: 'system'
};

const SHADE_LUMINANCE_SPLIT = 0.179; // above this, black text has more contrast than white (WCAG)

// typography token behind each font specimen card
const FONT_TOKENS = {
  primary: '--lt-typography-fontFamilyPrimary',
  secondary: '--lt-typography-fontFamilySecondary',
  heading: '--lt-typography-fontFamilyHeading'
} as const;

const state: PlaygroundState = { ...DEFAULTS };

let styleEl: HTMLStyleElement | null = null;

const scopeCss = (css: string): string =>
  css
    .replaceAll(':root', SCOPE)
    .replaceAll('[data-theme="dark"]', `${SCOPE}[data-theme="dark"]`)
    .replaceAll('[data-theme="light"]', `${SCOPE}[data-theme="light"]`);

// An emptied primary field falls back to the default rather than shifting the secondary font into its slot.
const fontConfig = (): { family: string | string[]; heading?: string } => {
  const primary = state.font.trim() || DEFAULTS.font;
  const secondary = state.fontSecondary.trim();
  const heading = state.fontHeading.trim();
  return {
    family: secondary ? [primary, secondary] : primary,
    ...(heading ? { heading } : {})
  };
};

const relativeLuminance = (hex: string): number | null => {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return null;
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(m[1].slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

// The palette swatches and font cards reference the scoped tokens through CSS, so they restyle on their own.
// Only their text readouts (hex codes, resolved family names) need to be read back from the stage.
const updateReadouts = (stage: HTMLElement): void => {
  const tokens = getComputedStyle(stage);

  stage.querySelectorAll<HTMLElement>('.pg-swatch').forEach((swatch) => {
    const hex = tokens.getPropertyValue(`--lt-color-${swatch.dataset.palette}-${swatch.dataset.shade}`).trim();
    const hexEl = swatch.querySelector('.pg-swatch-hex');
    if (hexEl) hexEl.textContent = hex.toUpperCase();
    const luminance = relativeLuminance(hex);
    swatch.dataset.tone = luminance !== null && luminance <= SHADE_LUMINANCE_SPLIT ? 'dark' : 'light';
  });

  stage.querySelectorAll<HTMLElement>('.pg-font').forEach((card) => {
    const stack = tokens.getPropertyValue(FONT_TOKENS[card.dataset.role as keyof typeof FONT_TOKENS]).trim();
    const nameEl = card.querySelector('.pg-font-name');
    if (nameEl) nameEl.textContent = stack ? (stack.split(',')[0] ?? '').replace(/["']/g, '').trim() : 'Not set';
    // An unset secondary/heading font falls back to primary (see the specimen CSS).
    card.toggleAttribute('data-unset', !stack);
  });
};

// Mirrors what configure() will resolve. Wrapping quotes (from a copied JS/CSS string) are stripped by
// configure() itself, so the snippet drops them rather than showing a doubly-quoted value.
const quote = (value: string): string => {
  const trimmed = value.trim();
  const first = trimmed[0];
  const unwrapped =
    trimmed.length > 1 && (first === '"' || first === "'") && trimmed.endsWith(first) ? trimmed.slice(1, -1) : trimmed;
  return `'${unwrapped.replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`;
};

const buildSnippet = (): string => {
  const { family, heading } = fontConfig();
  const familyValue = Array.isArray(family) ? `[${family.map(quote).join(', ')}]` : quote(family);
  const fontProps = [`family: ${familyValue}`, ...(heading ? [`heading: ${quote(heading)}`] : [])];

  return [
    "import { configure } from '@latty-ds/tokens/configure';",
    '',
    'configure({',
    `  colors: { primary: ${quote(state.primary)}, secondary: ${quote(state.secondary)} },`,
    `  font: { ${fontProps.join(', ')} },`,
    `  border: { radius: '${state.radius}px', width: '${state.width}' },`,
    `  theme: '${state.theme}'`,
    '});'
  ].join('\n');
};

let snippet = '';

const updateSnippet = (): void => {
  snippet = buildSnippet();
  const el = document.getElementById('export-code');
  if (el) el.innerHTML = highlight(snippet, 'tsx');
};

const updateTheme = (): void => {
  if (!styleEl) {
    styleEl = document.createElement('style');
    document.head.appendChild(styleEl);
  }

  const config: LattyConfig = {
    colors: { primary: state.primary, secondary: state.secondary },
    font: fontConfig(),
    border: { radius: `${state.radius}px`, width: state.width },
    // Always generate the full light+dark+system layer here — the local
    // `state.theme` toggle below picks which one applies via data-theme,
    // mirroring the "Theme switching" pattern from the Theming guide.
    theme: 'system'
  };

  styleEl.textContent = scopeCss(createStyleSheet(config));

  const stage = document.getElementById('playground-stage');
  if (!stage) return;
  if (state.theme === 'system') stage.removeAttribute('data-theme');
  else stage.setAttribute('data-theme', state.theme);

  updateReadouts(stage);
  updateSnippet();
};

const debounce = <A extends unknown[]>(fn: (...args: A) => void, ms: number) => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: A): void => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
};

/** Wires up the controls. Returns a cleanup function that removes every listener it added. */
export const init = async (): Promise<() => void> => {
  await Promise.all([
    customElements.whenDefined('lt-select'),
    customElements.whenDefined('lt-color-input'),
    customElements.whenDefined('lt-slider'),
    customElements.whenDefined('lt-textfield')
  ]);

  const primaryEl = document.getElementById('ctrl-primary') as ValueEl;
  const secondaryEl = document.getElementById('ctrl-secondary') as ValueEl;
  const radiusEl = document.getElementById('ctrl-radius') as SliderEl;
  const widthEl = document.getElementById('ctrl-width') as SelectEl;
  const fontEl = document.getElementById('ctrl-font') as ValueEl;
  const fontSecondaryEl = document.getElementById('ctrl-font-secondary') as ValueEl;
  const fontHeadingEl = document.getElementById('ctrl-font-heading') as ValueEl;
  const themeEl = document.getElementById('ctrl-theme') as SelectEl;
  const resetBtn = document.getElementById('ctrl-reset')!;
  const copyBtn = document.getElementById('ctrl-copy')!;

  widthEl.options = WIDTH_OPTIONS;
  themeEl.options = THEME_OPTIONS;

  // Browsers restore previously-typed values into named native inputs (color
  // pickers, text fields, sliders) on reload, independently of our own state —
  // so the DOM can already disagree with `state`'s DEFAULTS-seeded values
  // before a single event has fired. Read the live DOM back into `state` here
  // so the first updateTheme() call reflects what the controls actually show.
  state.primary = primaryEl.value;
  state.secondary = secondaryEl.value;
  state.radius = radiusEl.value;
  state.width = widthEl.value as BorderWidth;
  state.font = fontEl.value;
  state.fontSecondary = fontSecondaryEl.value;
  state.fontHeading = fontHeadingEl.value;
  state.theme = themeEl.value as ThemeValue;

  const abort = new AbortController();
  const { signal } = abort;

  // Typing a Google Fonts URL fires an input event per character, and every intermediate value
  // would be @import'd — wait for a pause so only the finished URL is requested.
  const onFontInput = (key: 'font' | 'fontSecondary' | 'fontHeading') =>
    debounce((value: string) => {
      state[key] = value;
      updateTheme();
    }, 400);

  primaryEl.addEventListener(
    'change',
    (e) => {
      state.primary = (e as CustomEvent<{ value: string }>).detail.value;
      updateTheme();
    },
    { signal }
  );
  secondaryEl.addEventListener(
    'change',
    (e) => {
      state.secondary = (e as CustomEvent<{ value: string }>).detail.value;
      updateTheme();
    },
    { signal }
  );
  radiusEl.addEventListener(
    'input',
    (e: Event) => {
      state.radius = (e as CustomEvent<{ value: number }>).detail.value;
      updateTheme();
    },
    { signal }
  );
  widthEl.addEventListener(
    'change',
    (e) => {
      state.width = (e as CustomEvent<{ value: string }>).detail.value as BorderWidth;
      updateTheme();
    },
    { signal }
  );
  (
    [
      [fontEl, 'font'],
      [fontSecondaryEl, 'fontSecondary'],
      [fontHeadingEl, 'fontHeading']
    ] as const
  ).forEach(([el, key]) => {
    const handler = onFontInput(key);
    el.addEventListener('input', (e: Event) => handler((e as CustomEvent<{ value: string }>).detail.value), { signal });
  });
  themeEl.addEventListener(
    'change',
    (e) => {
      state.theme = (e as CustomEvent<{ value: string }>).detail.value as ThemeValue;
      updateTheme();
    },
    { signal }
  );

  resetBtn.addEventListener(
    'click',
    () => {
      Object.assign(state, DEFAULTS);
      primaryEl.value = DEFAULTS.primary;
      secondaryEl.value = DEFAULTS.secondary;
      radiusEl.value = DEFAULTS.radius;
      widthEl.value = DEFAULTS.width;
      fontEl.value = DEFAULTS.font;
      fontSecondaryEl.value = DEFAULTS.fontSecondary;
      fontHeadingEl.value = DEFAULTS.fontHeading;
      themeEl.value = DEFAULTS.theme;
      updateTheme();
    },
    { signal }
  );

  let copiedTimer: ReturnType<typeof setTimeout> | undefined;
  copyBtn.addEventListener(
    'click',
    async () => {
      await navigator.clipboard.writeText(snippet);
      copyBtn.textContent = 'Copied!';
      clearTimeout(copiedTimer);
      copiedTimer = setTimeout(() => {
        copyBtn.textContent = 'Copy';
      }, 1500);
    },
    { signal }
  );

  updateTheme();

  return () => {
    abort.abort();
    clearTimeout(copiedTimer);
  };
};
