import { resolveVariantColors, type ColorPalettes, type ThemeMode } from './contrast';

export type SemanticTokenMap = Record<string, string>;

const VARIANTS = ['primary', 'secondary', 'success', 'warning', 'error', 'info'] as const;

// Neutral isn't one of VARIANTS (its ramp has no on-color/text steps of its own), so its interactive
// tokens are explicit. The generic rule would give neutral-500, which is only 3.5:1 against the
// near-white text that sits on it (button, solid badge) — neutral-600 is 5.3:1, and the hover/active
// steps only get darker. Same steps in both themes: the on-text is fixed near-white either way, so
// the "lighter steps for dark surfaces" rule doesn't apply.
const addNeutralInteractive = (map: SemanticTokenMap): void => {
  map['interactive-neutral-bg'] = 'color-neutral-600';
  map['interactive-neutral-bg-hover'] = 'color-neutral-700';
  map['interactive-neutral-bg-active'] = 'color-neutral-800';
};

export interface SemanticTokenOptions {
  // The generated colour ramps (`tokens.color`). The interactive fills and the text on them are picked from these by
  // contrast (see contrast.ts), so they adapt to whatever base colours the consumer configured.
  palettes: ColorPalettes;
  // Shifts which neutral palette step border-default/-strong/-subtle resolve to. Default: 'default'.
  borderContrast?: 'default' | 'high';
}

// Neutral palette step per mode + contrast level for the three structural border tokens.
// Dark mode shifts toward *lighter* steps for 'high' (more contrast against a dark background);
// light mode shifts toward *darker* steps — opposite directions, both increasing contrast.
// `input` is its own step, not derived from `default` — see border-input's own comment below for why.
const BORDER_STEPS = {
  light: {
    default: { default: '200', strong: '400', subtle: '100', input: '300' },
    high: { default: '400', strong: '600', subtle: '300', input: '500' }
  },
  dark: {
    default: { default: '700', strong: '500', subtle: '800' },
    high: { default: '500', strong: '300', subtle: '600' }
  }
} as const;

// Interactive fills and the text on them, for every variant. Picked from the real generated ramps rather than
// hard-coded (white on the 500 step failed AA for success/error/info in light and for most variants in dark, and
// primary's pressed state too), so text reaches WCAG AA on the resting, hover and pressed fills in both themes.
const addInteractive = (map: SemanticTokenMap, mode: ThemeMode, palettes: ColorPalettes): void => {
  for (const v of VARIANTS) {
    const colors = resolveVariantColors(v, palettes, mode);
    map[`text-on-${v}`] = colors.onText;
    map[`interactive-${v}-bg`] = colors.bg;
    map[`interactive-${v}-bg-hover`] = colors.hover;
    map[`interactive-${v}-bg-active`] = colors.active;
  }
  addNeutralInteractive(map);
};

const buildLightSemanticTokens = (opts: SemanticTokenOptions): SemanticTokenMap => {
  const map: SemanticTokenMap = {};

  // Text
  map['text-default'] = 'color-neutral-900';
  map['text-subtle'] = 'color-neutral-600';
  // neutral-400 (the previous value) is only 2.2:1 against --lt-bg-subtle —
  // fails WCAG AA (4.5:1) for normal text. neutral-600 is the next step that
  // clears it (5.26:1); at this palette's granularity that puts text-muted
  // at the same step as text-subtle in light mode (dark mode keeps them
  // distinct — see below). Found via the Docusaurus migration's a11y suite
  // (documentation/a11y/a11y.spec.ts) flagging lt-select's placeholder text.
  map['text-muted'] = 'color-neutral-600';
  map['text-disabled'] = 'color-neutral-400';
  map['text-inverse'] = 'color-white';
  map['text-neutral'] = 'color-neutral-700';

  for (const v of VARIANTS) map[`text-${v}`] = `color-${v}-700`;

  // Background
  map['bg-default'] = 'color-white';
  map['bg-subtle'] = 'color-neutral-50';
  map['bg-surface'] = 'color-neutral-100';
  map['bg-overlay'] = 'color-neutral-200';
  map['bg-inverse'] = 'color-neutral-900';
  map['bg-neutral-subtle'] = 'color-neutral-100';

  for (const v of VARIANTS) {
    map[`bg-${v}`] = `color-${v}-500`;
    map[`bg-${v}-subtle`] = `color-${v}-100`;
  }

  // Border
  const lightBorderSteps = BORDER_STEPS.light[opts.borderContrast ?? 'default'];
  map['border-default'] = `color-neutral-${lightBorderSteps.default}`;
  map['border-strong'] = `color-neutral-${lightBorderSteps.strong}`;
  map['border-subtle'] = `color-neutral-${lightBorderSteps.subtle}`;
  map['border-focus'] = 'color-primary-200';
  // Its own step, not an alias of border-default (X4(d)): input chrome needs to read as an input, not blend
  // into every other hairline border in the UI — neutral-300 is a first bump toward WCAG 1.4.11's 3:1 non-text
  // minimum (still short of it, ~1.6:1 against a white/neutral-50 field background; neutral-500 is roughly where
  // it would actually clear 3:1), kept as a deliberate incremental step rather than jumping straight there.
  map['border-input'] = `color-neutral-${lightBorderSteps.input}`;
  map['focus-ring-color'] = 'border-focus';
  map['focus-halo-color'] = 'bg-primary-subtle';

  for (const v of VARIANTS) {
    map[`border-${v}`] = `color-${v}-200`;
    map[`border-${v}-strong`] = `color-${v}-500`;
  }

  // Interactive (fills + the text on them)
  addInteractive(map, 'light', opts.palettes);

  return map;
};

const buildDarkSemanticTokens = (opts: SemanticTokenOptions): SemanticTokenMap => {
  const map: SemanticTokenMap = {};

  // Text
  map['text-default'] = 'color-neutral-100';
  map['text-subtle'] = 'color-neutral-300';
  // neutral-500 (the previous value) is only 3.47:1 against --lt-bg-subtle —
  // fails WCAG AA (4.5:1). neutral-400 clears it (5.5:1) and stays distinct
  // from text-subtle above. Found via the Docusaurus migration's a11y suite
  // flagging lt-select's placeholder text in dark theme.
  map['text-muted'] = 'color-neutral-400';
  map['text-disabled'] = 'color-neutral-600';
  map['text-inverse'] = 'color-neutral-900';
  map['text-neutral'] = 'color-neutral-200';

  for (const v of VARIANTS) map[`text-${v}`] = `color-${v}-300`;

  // Background
  map['bg-default'] = 'color-neutral-900';
  map['bg-subtle'] = 'color-neutral-800';
  map['bg-surface'] = 'color-neutral-800';
  map['bg-overlay'] = 'color-neutral-700';
  map['bg-inverse'] = 'color-neutral-50';
  map['bg-neutral-subtle'] = 'color-neutral-800';

  for (const v of VARIANTS) {
    map[`bg-${v}`] = `color-${v}-500`;
    map[`bg-${v}-subtle`] = `color-${v}-900`;
  }

  // Border
  const darkBorderSteps = BORDER_STEPS.dark[opts.borderContrast ?? 'default'];
  map['border-default'] = `color-neutral-${darkBorderSteps.default}`;
  map['border-strong'] = `color-neutral-${darkBorderSteps.strong}`;
  map['border-subtle'] = `color-neutral-${darkBorderSteps.subtle}`;
  map['border-focus'] = 'color-primary-400';
  map['border-input'] = 'border-default';
  map['focus-ring-color'] = 'border-focus';
  map['focus-halo-color'] = 'bg-primary-subtle';

  for (const v of VARIANTS) {
    map[`border-${v}`] = `color-${v}-700`;
    map[`border-${v}-strong`] = `color-${v}-500`;
  }

  // Interactive (fills start lighter for visibility on dark surfaces, and the text on them is picked to match)
  addInteractive(map, 'dark', opts.palettes);

  return map;
};

export const buildSemanticTokens = (mode: ThemeMode, opts: SemanticTokenOptions): SemanticTokenMap =>
  mode === 'dark' ? buildDarkSemanticTokens(opts) : buildLightSemanticTokens(opts);
