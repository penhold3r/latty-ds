import { createStyleSheet } from '@latty-ds/tokens/configure';
import type { BorderWidth, LattyConfig } from '@latty-ds/tokens/configure';

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
const DEFAULTS: PlaygroundState = {
  primary: '#ff8200',
  secondary: '#5252c5',
  radius: 8,
  width: 'thin',
  font: '"Hanken Grotesk", sans-serif',
  theme: 'system'
};

const state: PlaygroundState = { ...DEFAULTS };

let styleEl: HTMLStyleElement | null = null;

const scopeCss = (css: string): string =>
  css
    .replaceAll(':root', SCOPE)
    .replaceAll('[data-theme="dark"]', `${SCOPE}[data-theme="dark"]`)
    .replaceAll('[data-theme="light"]', `${SCOPE}[data-theme="light"]`);

const updateTheme = (): void => {
  if (!styleEl) {
    styleEl = document.createElement('style');
    document.head.appendChild(styleEl);
  }

  const config: LattyConfig = {
    colors: { primary: state.primary, secondary: state.secondary },
    font: { family: state.font },
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
};

const init = async (): Promise<void> => {
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
  const themeEl = document.getElementById('ctrl-theme') as SelectEl;
  const resetBtn = document.getElementById('ctrl-reset')!;

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
  state.theme = themeEl.value as ThemeValue;

  primaryEl.addEventListener('change', (e) => {
    state.primary = (e as CustomEvent<{ value: string }>).detail.value;
    updateTheme();
  });
  secondaryEl.addEventListener('change', (e) => {
    state.secondary = (e as CustomEvent<{ value: string }>).detail.value;
    updateTheme();
  });
  radiusEl.addEventListener('input', (e) => {
    state.radius = (e as CustomEvent<{ value: number }>).detail.value;
    updateTheme();
  });
  widthEl.addEventListener('change', (e) => {
    state.width = (e as CustomEvent<{ value: string }>).detail.value as BorderWidth;
    updateTheme();
  });
  fontEl.addEventListener('input', (e) => {
    state.font = (e as CustomEvent<{ value: string }>).detail.value;
    updateTheme();
  });
  themeEl.addEventListener('change', (e) => {
    state.theme = (e as CustomEvent<{ value: string }>).detail.value as ThemeValue;
    updateTheme();
  });

  resetBtn.addEventListener('click', () => {
    Object.assign(state, DEFAULTS);
    primaryEl.value = DEFAULTS.primary;
    secondaryEl.value = DEFAULTS.secondary;
    radiusEl.value = DEFAULTS.radius;
    widthEl.value = DEFAULTS.width;
    fontEl.value = DEFAULTS.font;
    themeEl.value = DEFAULTS.theme;
    updateTheme();
  });

  updateTheme();
};

init();
