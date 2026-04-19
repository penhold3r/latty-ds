/**
 * Size variant of the radio component.
 * Affects the radio button size and label font size.
 *
 * - `sm`: 16px radio, 0.875rem label
 * - `md`: 20px radio, 1rem label (default)
 * - `lg`: 24px radio, 1.0625rem label
 */
export type RadioSize = 'sm' | 'md' | 'lg';

/**
 * Visual variant of the radio component.
 * Determines the color when checked.
 *
 * - `primary`: Primary brand color (default)
 * - `secondary`: Secondary brand color
 * - `success`: Green color
 * - `error`: Red color
 * - `info`: Blue color
 */
export type RadioVariant = 'primary' | 'secondary' | 'success' | 'error' | 'info';
