// Ported near-verbatim from docs/src/pages/tokens/_playground.script.ts (the
// Astro site) — same treatment as ComponentPlayground.script.ts: only change
// is exporting `init` instead of auto-running it, so index.tsx can call it
// once from a useEffect instead of at module load.
import { createStyleSheet } from '@latty-ds/tokens/configure';
import type { BorderWidth, LattyConfig } from '@latty-ds/tokens/configure';
import { highlight } from '../ComponentPlayground/ComponentPlayground.prism';
import { contrastRatio, luminance, parseComputedColor, parseHex, rateContrast } from './ThemePlayground.contrast';
import { DEFAULTS, PRESETS, fontEntries } from './ThemePlayground.state';
import type { PlaygroundState, ThemeValue } from './ThemePlayground.state';
import { readStateFromUrl, stateToUrl, writeStateToUrl } from './ThemePlayground.url';

type SelectOption = { value: string; label: string };
type SelectEl = HTMLElement & { options: SelectOption[]; value: string };
// lt-color-input and lt-textfield both just expose a plain string .value.
type ValueEl = HTMLElement & { value: string };
type SliderEl = HTMLElement & { value: number };

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
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System (follows your OS)' },
  { value: 'split', label: 'Light & dark, side by side' }
];

// Options for the sample <lt-select>s in the component sheet (JS-only property, like every lt-select).
const SAMPLE_SELECT_OPTIONS: SelectOption[] = [
  { value: 'free', label: 'Free' },
  { value: 'pro', label: 'Pro' },
  { value: 'team', label: 'Team' }
];

const SHADE_LUMINANCE_SPLIT = 0.179; // above this, black text has more contrast than white (WCAG)

// The slot names configure() gives the entries of `font.family`, in order (its own mapping isn't exported), and
// the typography token each one becomes.
const FONT_SLOT_NAMES = ['Primary', 'Secondary', 'Tertiary', 'Quaternary'];
const fontSlotToken = (index: number): string =>
  `--lt-typography-fontFamily${FONT_SLOT_NAMES[index] ?? String(index + 1)}`;
const slotLabel = (index: number): string => FONT_SLOT_NAMES[index] ?? `Font ${index + 1}`;

const HEADING_DEFAULT = 'default';

const state: PlaygroundState = { ...DEFAULTS };

let styleEl: HTMLStyleElement | null = null;

const scopeCss = (css: string): string =>
  css
    .replaceAll(':root', SCOPE)
    .replaceAll('[data-theme="dark"]', `${SCOPE}[data-theme="dark"]`)
    .replaceAll('[data-theme="light"]', `${SCOPE}[data-theme="light"]`);

// An emptied fonts field falls back to the default rather than leaving the theme without a primary font.
const configuredFonts = (): string[] => {
  const entries = fontEntries(state.font);
  return entries.length > 0 ? entries : [DEFAULTS.font];
};

const fontConfig = (): { family: string | string[]; heading?: string } => {
  const entries = configuredFonts();
  const heading = state.fontHeading.trim();
  return {
    family: entries.length > 1 ? entries : entries[0],
    // The heading font is picked from the list; one that has since been edited out counts as unset.
    ...(heading && entries.includes(heading) ? { heading } : {})
  };
};

const familyName = (stack: string): string => (stack.split(',')[0] ?? '').replace(/["']/g, '').trim();

const stages = (): HTMLElement[] => [...document.querySelectorAll<HTMLElement>(SCOPE)];

// The palette swatches and font cards reference the scoped tokens through CSS, so they restyle on their own.
// Only their text readouts (hex codes, resolved family names) need to be read back from the stage.
const updateReadouts = (stage: HTMLElement): void => {
  const tokens = getComputedStyle(stage);

  stage.querySelectorAll<HTMLElement>('.pg-swatch').forEach((swatch) => {
    const hex = tokens.getPropertyValue(`--lt-color-${swatch.dataset.palette}-${swatch.dataset.shade}`).trim();
    const hexEl = swatch.querySelector('.pg-swatch-hex');
    if (hexEl) hexEl.textContent = hex.toUpperCase();
    const rgb = parseHex(hex);
    swatch.dataset.tone = rgb && luminance(rgb) <= SHADE_LUMINANCE_SPLIT ? 'dark' : 'light';
  });
};

const SPECIMEN = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789';

// Built with createElement/textContent: family names come from what the user typed.
const node = <K extends keyof HTMLElementTagNameMap>(
  tag: K | string,
  className = '',
  text?: string,
  attrs: Record<string, string> = {}
): HTMLElement => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  Object.entries(attrs).forEach(([name, value]) => el.setAttribute(name, value));
  return el;
};

interface FontCard {
  label: string;
  token: string;
  name: string;
  /** Headings render in this font: the primary by default, or the one picked in the heading dropdown. */
  forHeadings: boolean;
  note: string;
}

const fontCards = (tokens: CSSStyleDeclaration): FontCard[] => {
  const entries = configuredFonts();
  const headingIndex = entries.indexOf(state.fontHeading.trim()); // -1: headings fall back to the primary font
  return entries.map((entry, i) => ({
    label: slotLabel(i),
    token: fontSlotToken(i),
    name: familyName(tokens.getPropertyValue(fontSlotToken(i))) || entry,
    forHeadings: headingIndex === -1 ? i === 0 : i === headingIndex,
    note:
      i === 0
        ? 'Body copy, labels and UI — used by every component.'
        : i === headingIndex
          ? 'Used for h1–h6 and display text (also --lt-typography-fontFamilyHeading).'
          : 'Not used by components. Reference it in your own CSS for accents or editorial text.'
  }));
};

const buildFontCard = ({ label, token, name, forHeadings, note }: FontCard): HTMLElement => {
  const card = node('div', 'pg-font');
  card.style.setProperty('--pg-font-family', `var(${token})`);

  const head = node('div', 'pg-font-head');
  head.append(node('lt-text', '', label, { variant: 'overline' }));
  if (forHeadings) {
    head.append(
      node('lt-badge', '', undefined, { variant: 'primary', appearance: 'outlined', size: 'sm', content: 'Headings' })
    );
  }

  const weights = node('span', 'pg-font-weights');
  weights.append(
    node('span', 'pg-weight-regular', 'Regular'),
    node('span', 'pg-weight-medium', 'Medium'),
    node('span', 'pg-weight-bold', 'Bold')
  );

  card.append(
    head,
    node('span', 'pg-font-aa', 'Aa', { 'aria-hidden': 'true' }),
    node('span', 'pg-font-name', name),
    node('span', 'pg-font-token', token),
    node('span', 'pg-font-sample', SPECIMEN),
    weights,
    node('lt-text', 'pg-font-note', note, { variant: 'caption' })
  );
  return card;
};

// One specimen card per font in the list. Cards are only rebuilt when what they show changes, so dragging a
// slider doesn't recreate (and briefly blank) their custom elements.
const updateFontCards = (stage: HTMLElement): void => {
  const container = stage.querySelector<HTMLElement>('.pg-fonts');
  if (!container) return;
  const cards = fontCards(getComputedStyle(stage));
  const key = JSON.stringify(cards);
  if (container.dataset.cards === key) return;
  container.dataset.cards = key;
  container.replaceChildren(...cards.map(buildFontCard));
};

// The heading dropdown offers exactly the fonts in the list, labelled by slot and resolved family name (a
// Google Fonts URL isn't readable as-is). Options are only rewritten when they change, so dragging a slider
// doesn't reset an open dropdown.
let headingEl: SelectEl | null = null;
let headingOptionsKey = '';

const updateHeadingSelect = (tokens: CSSStyleDeclaration): void => {
  if (!headingEl) return;
  const entries = configuredFonts();

  const options: SelectOption[] = [
    { value: HEADING_DEFAULT, label: 'Same as primary font' },
    ...entries.map((entry, i) => ({
      value: String(i),
      label: `${slotLabel(i)} · ${familyName(tokens.getPropertyValue(fontSlotToken(i))) || entry}`
    }))
  ];
  const key = JSON.stringify(options);
  if (key !== headingOptionsKey) {
    headingEl.options = options;
    headingOptionsKey = key;
  }

  const index = entries.indexOf(state.fontHeading.trim());
  const wanted = index >= 0 ? String(index) : HEADING_DEFAULT;
  if (headingEl.value !== wanted) headingEl.value = wanted;
};

// Rates each role chip's text against what it actually sits on. A theme is user-customizable, so this is
// the check that catches e.g. a pale primary: the on-color text is picked automatically, but the subtle
// and outlined roles use the raw palette and can still fall short.
const updateContrast = (stage: HTMLElement): void => {
  const stageBg = parseComputedColor(getComputedStyle(stage).backgroundColor);

  stage.querySelectorAll<HTMLElement>('.pg-role-item').forEach((item) => {
    const chip = item.querySelector<HTMLElement>('.pg-role');
    const badge = item.querySelector<HTMLElement>('.pg-contrast');
    if (!chip || !badge) return;

    const chipStyle = getComputedStyle(chip);
    const fg = parseComputedColor(chipStyle.color);
    let bg = parseComputedColor(chipStyle.backgroundColor);
    if (!bg || bg.alpha === 0) bg = stageBg; // the outlined role is transparent: it sits on the stage

    if (!fg || !bg) {
      badge.removeAttribute('content');
      return;
    }
    const ratio = contrastRatio(fg.rgb, bg.rgb);
    const rating = rateContrast(ratio);
    badge.setAttribute('variant', rating.variant);
    badge.setAttribute('content', `${rating.label} ${ratio.toFixed(1)}:1`);
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

// One line when it fits, otherwise one font per line (as prettier would print it).
const fontSnippetLines = (): string[] => {
  const { family, heading } = fontConfig();
  const familyValue = Array.isArray(family) ? `[${family.map(quote).join(', ')}]` : quote(family);
  const inline = `  font: { family: ${familyValue}${heading ? `, heading: ${quote(heading)}` : ''} },`;
  if (inline.length <= 100) return [inline];

  const familyLines = Array.isArray(family)
    ? [
        '    family: [',
        ...family.map((f, i) => `      ${quote(f)}${i < family.length - 1 ? ',' : ''}`),
        `    ]${heading ? ',' : ''}`
      ]
    : [`    family: ${quote(family)}${heading ? ',' : ''}`];
  return ['  font: {', ...familyLines, ...(heading ? [`    heading: ${quote(heading)}`] : []), '  },'];
};

const buildSnippet = (): string => {
  // Split is only a way of viewing the theme; the config that produces both is `system`.
  const theme: Exclude<ThemeValue, 'split'> = state.theme === 'split' ? 'system' : state.theme;

  return [
    "import { configure } from '@latty-ds/tokens/configure';",
    '',
    'configure({',
    `  colors: { primary: ${quote(state.primary)}, secondary: ${quote(state.secondary)} },`,
    ...fontSnippetLines(),
    `  border: { radius: '${state.radius}px', width: '${state.width}' },`,
    `  theme: '${theme}'`,
    '});'
  ].join('\n');
};

let snippet = '';

const updateSnippet = (): void => {
  snippet = buildSnippet();
  const el = document.getElementById('export-code');
  if (el) el.innerHTML = highlight(snippet, 'tsx');
};

const debounce = <A extends unknown[]>(fn: (...args: A) => void, ms: number) => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: A): void => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
};

const syncUrl = debounce(() => writeStateToUrl(state), 300);

const setStageTheme = (stage: HTMLElement, theme: Exclude<ThemeValue, 'split'>): void => {
  if (theme === 'system') stage.removeAttribute('data-theme');
  else stage.setAttribute('data-theme', theme);
};

const updateTheme = (): void => {
  if (!styleEl) {
    styleEl = document.createElement('style');
    document.head.appendChild(styleEl);
  }

  // A heading font that has been edited out of the list falls back to "same as primary".
  if (state.fontHeading && !configuredFonts().includes(state.fontHeading.trim())) state.fontHeading = '';

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

  // The stage is rendered twice; only "split" shows the second one, pinned to dark next to a light first.
  const [first, second] = stages();
  document.getElementById('playground-stages')?.toggleAttribute('data-split', state.theme === 'split');
  if (first) setStageTheme(first, state.theme === 'split' ? 'light' : state.theme);
  if (second) setStageTheme(second, 'dark');

  stages().forEach((stage) => {
    updateReadouts(stage);
    updateFontCards(stage);
    updateContrast(stage);
  });
  const [firstStage] = stages();
  if (firstStage) updateHeadingSelect(getComputedStyle(firstStage));
  updateSnippet();
  syncUrl();
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
  headingEl = document.getElementById('ctrl-font-heading') as SelectEl;
  const themeEl = document.getElementById('ctrl-theme') as SelectEl;
  const resetBtn = document.getElementById('ctrl-reset')!;
  const copyBtn = document.getElementById('ctrl-copy')!;
  const shareBtn = document.getElementById('ctrl-share')!;

  widthEl.options = WIDTH_OPTIONS;
  themeEl.options = THEME_OPTIONS;
  document.querySelectorAll<SelectEl>('.pg-sample-select').forEach((el) => {
    el.options = SAMPLE_SELECT_OPTIONS;
  });

  const writeControls = (): void => {
    primaryEl.value = state.primary;
    secondaryEl.value = state.secondary;
    radiusEl.value = state.radius;
    widthEl.value = state.width;
    fontEl.value = state.font;
    themeEl.value = state.theme;
  };

  const readControls = (): void => {
    state.primary = primaryEl.value;
    state.secondary = secondaryEl.value;
    state.radius = radiusEl.value;
    state.width = widthEl.value as BorderWidth;
    state.font = fontEl.value;
    state.theme = themeEl.value as ThemeValue;
  };

  // A shared link wins. Otherwise: browsers restore previously-typed values into named native inputs
  // (color pickers, text fields, sliders) on reload, independently of our own state — so the DOM can
  // already disagree with `state`'s DEFAULTS-seeded values before a single event has fired. Read the
  // live DOM back into `state` so the first updateTheme() call reflects what the controls actually show.
  const fromUrl = readStateFromUrl();
  if (Object.keys(fromUrl).length > 0) {
    Object.assign(state, DEFAULTS, fromUrl);
    writeControls();
  } else {
    readControls();
  }

  const abort = new AbortController();
  const { signal } = abort;

  // Typing a Google Fonts URL fires an input event per character, and every intermediate value
  // would be @import'd — wait for a pause so only the finished URL is requested.
  const onFontsInput = debounce((value: string) => {
    state.font = value;
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
  fontEl.addEventListener('input', (e: Event) => onFontsInput((e as CustomEvent<{ value: string }>).detail.value), {
    signal
  });
  headingEl.addEventListener(
    'change',
    (e) => {
      const index = Number((e as CustomEvent<{ value: string }>).detail.value);
      state.fontHeading = configuredFonts()[index] ?? '';
      updateTheme();
    },
    { signal }
  );
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
      writeControls();
      updateTheme();
    },
    { signal }
  );

  document.querySelectorAll<HTMLElement>('[data-preset]').forEach((btn) => {
    btn.addEventListener(
      'click',
      () => {
        const preset = PRESETS.find((p) => p.id === btn.dataset.preset);
        if (!preset) return;
        Object.assign(state, preset.values); // the preview theme is left as the user set it
        writeControls();
        updateTheme();
      },
      { signal }
    );
  });

  // Both buttons confirm by swapping their own label for a moment.
  const flash = (btn: HTMLElement, done: string, idle: string): void => {
    btn.textContent = done;
    setTimeout(() => {
      btn.textContent = idle;
    }, 1500);
  };
  copyBtn.addEventListener(
    'click',
    async () => {
      await navigator.clipboard.writeText(snippet);
      flash(copyBtn, 'Copied!', 'Copy');
    },
    { signal }
  );
  shareBtn.addEventListener(
    'click',
    async () => {
      await navigator.clipboard.writeText(stateToUrl(state).toString());
      flash(shareBtn, 'Link copied!', 'Share');
    },
    { signal }
  );

  updateTheme();

  return () => {
    abort.abort();
    headingEl = null;
    headingOptionsKey = '';
  };
};
