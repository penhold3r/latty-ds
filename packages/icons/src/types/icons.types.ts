/**
 * Available icon sizes.
 * - `xs`: 12px
 * - `sm`: 16px
 * - `md`: 20px (default)
 * - `lg`: 24px
 * - `xl`: 32px
 */
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Icon definition structure.
 * Represents a single icon with its name and SVG content.
 */
export interface IconDefinition {
  /** Unique identifier for the icon */
  name: string;
  /** SVG markup string */
  svg: string;
}

/**
 * Icon provider interface.
 * Implementations provide icons from different sources (e.g., iconoir, custom sets).
 */
export interface IconProvider {
  /** Unique name of the provider */
  name: string;

  /**
   * Retrieves an icon by name.
   * @param name - Icon identifier
   * @returns SVG string if found, undefined otherwise
   */
  getIcon(name: string): string | undefined;

  /**
   * Gets all icons from this provider.
   * @returns Map of icon names to SVG strings
   */
  getAllIcons(): Map<string, string>;
}

/**
 * Configuration options for the icon system.
 */
export type IconConfig = {
  /** Name of the default icon provider to use */
  defaultProvider?: string;
  /** Custom icon definitions that override provider icons */
  customIcons?: Record<string, string>;
};
