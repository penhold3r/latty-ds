// Components
export { Icon } from './components/icon';

// Registry
export { iconRegistry } from './registry/icon-registry';

// Types
export type { IconSize, IconDefinition } from './types/icons.types';
export type { LattyIconName } from './icons';

// Full icon map — no auto-registration.
// Call iconRegistry.registerIcons(lattyIcons) yourself, or import individual icons
// via @latty-ds/icons/<name> for per-icon tree-shaking.
export { lattyIcons } from './icons';
