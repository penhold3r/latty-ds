// Components
export { Icon } from './components/icon';

// Registry
export { iconRegistry } from './registry/icon-registry';

// Types
export type { IconSize, IconDefinition } from './types/icons.types';
export type { LattyIconName } from './icons';

// Auto-register all Latty icons
import { iconRegistry } from './registry/icon-registry';
import { lattyIcons } from './icons';

iconRegistry.registerIcons(lattyIcons);
