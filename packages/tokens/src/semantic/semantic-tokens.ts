export type SemanticTokenMap = Record<string, string>;

const VARIANTS = ['primary', 'secondary', 'success', 'warning', 'error', 'info'] as const;

const buildLightSemanticTokens = (): SemanticTokenMap => {
  const map: SemanticTokenMap = {};

  // Text
  map['text-default'] = 'color-neutral-900';
  map['text-subtle'] = 'color-neutral-600';
  map['text-muted'] = 'color-neutral-400';
  map['text-disabled'] = 'color-neutral-400';
  map['text-inverse'] = 'color-white';

  for (const v of VARIANTS) {
    map[`text-${v}`] = `color-${v}-700`;
    map[`text-on-${v}`] = 'color-white';
  }

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

const buildDarkSemanticTokens = (): SemanticTokenMap => {
  const map: SemanticTokenMap = {};

  // Text
  map['text-default'] = 'color-neutral-100';
  map['text-subtle'] = 'color-neutral-300';
  map['text-muted'] = 'color-neutral-500';
  map['text-disabled'] = 'color-neutral-600';
  map['text-inverse'] = 'color-neutral-900';

  for (const v of VARIANTS) {
    map[`text-${v}`] = `color-${v}-300`;
    map[`text-on-${v}`] = 'color-white';
  }

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

export const buildSemanticTokens = (mode: 'light' | 'dark' = 'light'): SemanticTokenMap =>
  mode === 'dark' ? buildDarkSemanticTokens() : buildLightSemanticTokens();
