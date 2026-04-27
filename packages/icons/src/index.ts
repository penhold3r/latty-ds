/**
 * @latty/icons - Icon system for the Latty Design System
 *
 * Provides a flexible icon system with:
 * - Web component for rendering SVG icons (<lt-icon>)
 * - Global icon registry for managing providers and custom icons
 * - Iconoir provider with pre-registered common icons
 * - Extensible provider system for custom icon sets
 *
 * @packageDocumentation
 *
 * @example
 * Basic usage:
 * ```html
 * <lt-icon name="search" size="md"></lt-icon>
 * <lt-icon name="user" size="lg" style="color: blue;"></lt-icon>
 * ```
 *
 * @example
 * Registering custom icons:
 * ```typescript
 * import { iconRegistry } from '@latty/icons';
 *
 * iconRegistry.registerIcon('custom-icon', '<svg>...</svg>');
 * ```
 *
 * @example
 * Creating a custom provider:
 * ```typescript
 * import { iconRegistry, type IconProvider } from '@latty/icons';
 *
 * const myProvider: IconProvider = {
 *   name: 'my-icons',
 *   getIcon: (name) => myIconsMap.get(name),
 *   getAllIcons: () => myIconsMap
 * };
 *
 * iconRegistry.registerProvider(myProvider);
 * ```
 */

// Components
export { Icon } from './components/icon';

// Registry
export { iconRegistry } from './registry/icon-registry';

// Providers
export { iconoirProvider } from './providers/iconoir.provider';

// Types
export type { IconSize, IconDefinition, IconProvider, IconConfig } from './types/icons.types';

// Auto-register iconoir as default provider
import { iconRegistry } from './registry/icon-registry';
import { iconoirProvider } from './providers/iconoir.provider';
import { lattyIcons } from './icons';

iconRegistry.registerProvider(iconoirProvider, true);
// Latty-owned SVGs override iconoir equivalents as they are added
iconRegistry.registerIcons(lattyIcons);
