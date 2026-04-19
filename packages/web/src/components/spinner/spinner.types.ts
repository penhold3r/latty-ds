/**
 * Size variant of the spinner component.
 * Determines the diameter of the spinner.
 *
 * - `sm`: 0.75rem (12px)
 * - `md`: 1rem (16px) - default
 * - `lg`: 1.5rem (24px)
 */
export type SpinnerSize = 'sm' | 'md' | 'lg';

/**
 * Color variant of the spinner component.
 *
 * - `primary`: Primary brand color
 * - `secondary`: Secondary brand color
 * - `neutral`: Neutral gray color
 * - `current`: Inherits color from parent (default)
 */
export type SpinnerVariant = 'primary' | 'secondary' | 'neutral' | 'current';
