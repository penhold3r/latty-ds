/**
 * Size variant of the checkbox component.
 * Affects the checkbox size and label font size.
 *
 * - `sm`: 16px checkbox, 0.875rem label
 * - `md`: 20px checkbox, 1rem label (default)
 * - `lg`: 24px checkbox, 1.0625rem label
 */
export type CheckboxSize = 'sm' | 'md' | 'lg';

/**
 * Visual variant of the checkbox component.
 * Determines the color when checked.
 *
 * - `primary`: Primary brand color (default)
 * - `secondary`: Secondary brand color
 * - `success`: Green color
 * - `error`: Red color
 * - `info`: Blue color
 */
export type CheckboxVariant = 'primary' | 'secondary' | 'success' | 'error' | 'info';

export type CheckboxLabelPosition = 'left' | 'right';
