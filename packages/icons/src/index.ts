/*
 * Register all built-in icons before the element definition runs.
 * This import must come before './components/icon.js' — ES modules evaluate
 * import declarations in source order, so register-all fills the registry
 * before @customElement('lt-icon') synchronously upgrades any pre-rendered
 * <lt-icon> elements in the DOM.
 */
import './register-all.js';

/* Components */
export { Icon } from './components/icon.js';

/* Registry */
export { iconRegistry } from './registry/icon-registry.js';

/* Types */
export type { IconSize, IconDefinition } from './types/icons.types.js';
export type { IconProvider } from './types/provider.types.js';
export type { LattyIconName } from './icons/index.js';

/*
 * Full icon map — exported for custom tooling and type inference.
 * Per-icon tree-shaking: import '@latty-ds/icons/<name>' instead of the main entry.
 */
export { lattyIcons } from './icons/index.js';
