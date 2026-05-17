export type SemanticTokenMap = Record<string, string>;

const VARIANTS = ['primary', 'secondary', 'success', 'warning', 'error', 'info'] as const;

const relativeLuminance = (hex: string): number => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};

// Returns the token name that achieves higher WCAG contrast against the given background hex.
const accessibleTextOn = (bgHex: string): 'color-white' | 'color-neutral-900' => {
  const L = relativeLuminance(bgHex);
  const whiteContrast = 1.05 / (L + 0.05);
  const darkContrast = (L + 0.05) / 0.059; // neutral-900 ≈ L 0.009
  return whiteContrast >= darkContrast ? 'color-white' : 'color-neutral-900';
};

export interface SemanticTokenOptions {
  // Resolved primary-500 hex for light mode (button bg). Used to pick accessible text-on-primary.
  primary500?: string;
  // Resolved primary-400 hex for dark mode (button bg in dark theme).
  primary400?: string;
}

const buildLightSemanticTokens = (opts: SemanticTokenOptions = {}): SemanticTokenMap => {
  const map: SemanticTokenMap = {};

  // Text
  map['text-default'] = 'color-neutral-900';
  map['text-subtle'] = 'color-neutral-600';
  map['text-muted'] = 'color-neutral-400';
  map['text-disabled'] = 'color-neutral-400';
  map['text-inverse'] = 'color-white';
  map['text-neutral'] = 'color-neutral-700';

  for (const v of VARIANTS) {
    map[`text-${v}`] = `color-${v}-800`;
    map[`text-on-${v}`] = 'color-white';
  }
  if (opts.primary500) map['text-on-primary'] = accessibleTextOn(opts.primary500);

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
  map['border-default'] = 'color-neutral-200';
  map['border-strong'] = 'color-neutral-400';
  map['border-subtle'] = 'color-neutral-100';
  map['border-focus'] = 'color-primary-200';

  for (const v of VARIANTS) {
    map[`border-${v}`] = `color-${v}-200`;
    map[`border-${v}-strong`] = `color-${v}-500`;
  }

  // Interactive
  for (const v of VARIANTS) {
    map[`interactive-${v}-bg`] = `color-${v}-500`;
    map[`interactive-${v}-bg-hover`] = `color-${v}-600`;
    map[`interactive-${v}-bg-active`] = `color-${v}-700`;
  }

  return map;
};

const buildDarkSemanticTokens = (opts: SemanticTokenOptions = {}): SemanticTokenMap => {
  const map: SemanticTokenMap = {};

  // Text
  map['text-default'] = 'color-neutral-100';
  map['text-subtle'] = 'color-neutral-300';
  map['text-muted'] = 'color-neutral-500';
  map['text-disabled'] = 'color-neutral-600';
  map['text-inverse'] = 'color-neutral-900';
  map['text-neutral'] = 'color-neutral-200';

  for (const v of VARIANTS) {
    map[`text-${v}`] = `color-${v}-300`;
    map[`text-on-${v}`] = 'color-white';
  }
  if (opts.primary400) map['text-on-primary'] = accessibleTextOn(opts.primary400);

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
  map['border-default'] = 'color-neutral-700';
  map['border-strong'] = 'color-neutral-500';
  map['border-subtle'] = 'color-neutral-800';
  map['border-focus'] = 'color-primary-400';

  for (const v of VARIANTS) {
    map[`border-${v}`] = `color-${v}-700`;
    map[`border-${v}-strong`] = `color-${v}-500`;
  }

  // Interactive (lighter steps for visibility on dark surfaces)
  for (const v of VARIANTS) {
    map[`interactive-${v}-bg`] = `color-${v}-400`;
    map[`interactive-${v}-bg-hover`] = `color-${v}-300`;
    map[`interactive-${v}-bg-active`] = `color-${v}-500`;
  }

  return map;
};

export const buildSemanticTokens = (
  mode: 'light' | 'dark' = 'light',
  opts: SemanticTokenOptions = {}
): SemanticTokenMap => (mode === 'dark' ? buildDarkSemanticTokens(opts) : buildLightSemanticTokens(opts));
