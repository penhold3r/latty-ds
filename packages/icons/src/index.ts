// Components
export { Icon } from './components/icon';

// Registry
export { iconRegistry } from './registry/icon-registry';

// Types
export type { IconSize, IconDefinition } from './types/icons.types';
export type { LattyIconName } from './icons';

// Full icon map — exported for custom tooling and type inference.
// Per-icon tree-shaking: import '@latty-ds/icons/<name>' instead of the main entry.
export { lattyIcons } from './icons';

// Registering all built-in icons happens in ./components/icon.ts itself,
// before its `@customElement('lt-icon')` declaration — not here. See that
// file's comment: this is one of the few places where statement order
// inside a *single* module actually matters for a real bug, and moving code
// between files (rather than within one) is the only way to control it,
// since import declarations are always evaluated before a module's own
// top-level statements, regardless of where they're written.
