export type SemanticTokenMap = Record<string, string>;

const VARIANTS = ['primary', 'secondary', 'success', 'warning', 'error', 'info'] as const;

export const buildSemanticTokens = (): SemanticTokenMap => {
  const map: SemanticTokenMap = {};

  // Text
  map['text-default']  = 'color-neutral-900';
  map['text-subtle']   = 'color-neutral-600';
  map['text-muted']    = 'color-neutral-400';
  map['text-disabled'] = 'color-neutral-400';
  map['text-inverse']  = 'color-white';

  for (const v of VARIANTS) {
    map[`text-${v}`]    = `color-${v}-700`;
    map[`text-on-${v}`] = 'color-white';
  }

  // Background
  map['bg-default']        = 'color-white';
  map['bg-subtle']         = 'color-neutral-50';
  map['bg-surface']        = 'color-neutral-100';
  map['bg-overlay']        = 'color-neutral-200';
  map['bg-inverse']        = 'color-neutral-900';
  map['bg-neutral-subtle'] = 'color-neutral-100';

  for (const v of VARIANTS) {
    map[`bg-${v}`]        = `color-${v}-500`;
    map[`bg-${v}-subtle`] = `color-${v}-100`;
  }

  // Border
  map['border-default'] = 'color-neutral-200';
  map['border-strong']  = 'color-neutral-400';
  map['border-subtle']  = 'color-neutral-100';
  map['border-focus']   = 'color-primary-200';

  for (const v of VARIANTS) {
    map[`border-${v}`]        = `color-${v}-200`;
    map[`border-${v}-strong`] = `color-${v}-500`;
  }

  // Interactive
  for (const v of VARIANTS) {
    map[`interactive-${v}-bg`]        = `color-${v}-500`;
    map[`interactive-${v}-bg-hover`]  = `color-${v}-600`;
    map[`interactive-${v}-bg-active`] = `color-${v}-700`;
  }

  return map;
};
