/**
 * Size variant of the select component.
 * Affects height, font size, and padding.
 *
 * - `sm`: 32px height, 0.875rem font size
 * - `md`: 40px height, 1rem font size (default)
 * - `lg`: 48px height, 1.0625rem font size
 */
export type SelectSize = 'sm' | 'md' | 'lg';

/**
 * Visual variant of the select component.
 * Determines the styling and indicates the select's state.
 *
 * - `default`: Standard appearance
 * - `success`: Green styling for successful state
 * - `warning`: Yellow/orange styling for warning state
 * - `error`: Red styling for error state
 */
export type SelectVariant = 'default' | 'success' | 'warning' | 'error';

/**
 * Represents a single option in the select dropdown.
 */
export interface SelectOption {
  /**
   * The unique value for this option (used in form submission)
   */
  value: string;

  /**
   * The display text shown to the user
   */
  label: string;

  /**
   * Whether this option is disabled and cannot be selected
   * @default false
   */
  disabled?: boolean;
}
