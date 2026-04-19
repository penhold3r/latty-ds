/**
 * Visual variant of the button component.
 * Determines the color scheme.
 *
 * - `primary`: Primary brand color (default for main actions)
 * - `secondary`: Secondary brand color
 * - `neutral`: Neutral gray color
 * - `success`: Green color for positive actions
 * - `warning`: Yellow/orange color for caution
 * - `error`: Red color for destructive actions
 * - `info`: Blue color for informational actions
 */
export type ButtonVariant = 'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'error' | 'info';

/**
 * Appearance style of the button component.
 * Determines whether the button is filled or outlined.
 *
 * - `filled`: Solid background with the variant color (default)
 * - `outlined`: Transparent background with colored border and text
 */
export type ButtonAppearance = 'filled' | 'outlined';

/**
 * Size variant of the button component.
 * Affects height, font size, and padding.
 *
 * - `sm`: 32px height, 0.875rem font size
 * - `md`: 40px height, 1rem font size (default)
 * - `lg`: 48px height, 1.0625rem font size
 */
export type ButtonSize = 'sm' | 'md' | 'lg';
