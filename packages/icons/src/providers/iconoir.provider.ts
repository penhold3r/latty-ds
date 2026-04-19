import type { IconProvider } from '../types/icons.types';
import { commonIcons } from './iconoir-icons';

/**
 * Iconoir icon provider implementation.
 * Provides access to iconoir icon set with pre-registered common icons.
 *
 * Common icons are automatically loaded on initialization.
 * Additional icons can be registered dynamically at runtime.
 *
 * @see https://iconoir.com/
 */
class IconoirProvider implements IconProvider {
  name = 'iconoir';
  private icons = new Map<string, string>();

  constructor() {
    // Pre-register common icons
    Object.entries(commonIcons).forEach(([name, svg]) => {
      this.icons.set(name, svg);
    });
  }

  /**
   * Registers an additional icon at runtime.
   * Useful for lazy-loading or adding icons not in the common set.
   *
   * @param name - Icon identifier
   * @param svg - SVG markup string
   *
   * @example
   * ```typescript
   * iconoirProvider.registerIcon('custom-icon', '<svg>...</svg>');
   * ```
   */
  registerIcon(name: string, svg: string): void {
    this.icons.set(name, svg);
  }

  /**
   * Registers multiple icons at once.
   *
   * @param icons - Object mapping icon names to SVG strings
   *
   * @example
   * ```typescript
   * iconoirProvider.registerIcons({
   *   'icon-1': '<svg>...</svg>',
   *   'icon-2': '<svg>...</svg>'
   * });
   * ```
   */
  registerIcons(icons: Record<string, string>): void {
    Object.entries(icons).forEach(([name, svg]) => {
      this.icons.set(name, svg);
    });
  }

  /**
   * Retrieves an icon by name.
   *
   * @param name - Icon identifier
   * @returns SVG string if found, undefined otherwise
   */
  getIcon(name: string): string | undefined {
    return this.icons.get(name);
  }

  /**
   * Gets all registered icons.
   *
   * @returns Map of icon names to SVG strings
   */
  getAllIcons(): Map<string, string> {
    return new Map(this.icons);
  }
}

/**
 * Singleton instance of the Iconoir provider.
 * Pre-initialized with common iconoir icons.
 */
export const iconoirProvider = new IconoirProvider();
