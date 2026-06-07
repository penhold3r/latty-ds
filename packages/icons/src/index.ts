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

// Auto-register all built-in icons when this package is imported.
import { iconRegistry } from './registry/icon-registry';
import { lattyIcons } from './icons';
iconRegistry.registerIcons(lattyIcons);
