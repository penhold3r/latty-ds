/**
 * Visual variant of the textfield component.
 * Determines the border color, focus state, and automatic end icon.
 *
 * - `default`: Standard neutral state with no end icon
 * - `success`: Green styling with check-circle icon
 * - `warning`: Yellow/orange styling with warning-triangle icon
 * - `error`: Red styling with xmark-circle icon
 */
export type TextfieldVariant = 'default' | 'success' | 'warning' | 'error';

/**
 * Size variant of the textfield component.
 * Affects height, font size, and padding.
 *
 * - `sm`: 32px height, 0.875rem font size
 * - `md`: 40px height, 1rem font size
 * - `lg`: 48px height, 1.0625rem font size
 */
export type TextfieldSize = 'sm' | 'md' | 'lg';

/**
 * HTML input type for the textfield.
 * Password type includes automatic visibility toggle with eye icon.
 * Multiline type renders a textarea element instead of input.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types
 */
export type TextfieldType = 'text' | 'email' | 'password' | 'tel' | 'url' | 'number' | 'multiline';
