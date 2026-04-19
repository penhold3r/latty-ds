/**
 * Size variant of the switch component.
 * Affects the switch size and label font size.
 *
 * - `sm`: 32px width x 18px height, 0.875rem label
 * - `md`: 40px width x 22px height, 1rem label (default)
 * - `lg`: 48px width x 26px height, 1.0625rem label
 */
export type SwitchSize = 'sm' | 'md' | 'lg';

/**
 * Visual variant of the switch component.
 * Determines the color when checked.
 *
 * - `primary`: Primary brand color (default)
 * - `secondary`: Secondary brand color
 * - `success`: Green color
 * - `error`: Red color
 * - `info`: Blue color
 */
export type SwitchVariant = 'primary' | 'secondary' | 'success' | 'error' | 'info';
