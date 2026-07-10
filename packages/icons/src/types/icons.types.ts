/**
 * Available icon sizes.
 * - `xs`: 12px
 * - `sm`: 16px
 * - `md`: 20px (default)
 * - `lg`: 24px
 * - `xl`: 32px
 * - `inherit`: 1em — scales with the surrounding `font-size`
 */
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'inherit';

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
