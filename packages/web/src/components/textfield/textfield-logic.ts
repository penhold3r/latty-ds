import type { TextfieldType, TextfieldVariant } from './textfield.types';

export interface TextfieldValidationInput {
  value: string;
  type: TextfieldType;
  /** The native attributes forwarded onto the inner control, read straight off the host. */
  min?: string | null;
  max?: string | null;
  minlength?: string | null;
  maxlength?: string | null;
}

/**
 * The textfield's own format and constraint rules beyond what the native control checks.
 *
 * An empty value is always valid: `required` is left to the native control's own `valueMissing` validity, so
 * treating "empty" as invalid here would double-report the same failure.
 * @param {TextfieldValidationInput} input - The validation input containing value, type, and constraint attributes.
 * @returns {boolean} True if the value passes all format and constraint checks.
 */
export function isValidTextfieldValue(input: TextfieldValidationInput): boolean {
  const { value, type } = input;
  if (!value) return true;

  if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return false;

  if (type === 'number') {
    const number = Number(value);
    if (Number.isNaN(number)) return false;
    if (hasValue(input.min) && number < Number(input.min)) return false;
    if (hasValue(input.max) && number > Number(input.max)) return false;
  } else {
    if (hasValue(input.minlength) && value.length < Number(input.minlength)) return false;
    if (hasValue(input.maxlength) && value.length > Number(input.maxlength)) return false;
  }

  return true;
}

const hasValue = (attribute: string | null | undefined): attribute is string =>
  attribute !== null && attribute !== undefined && attribute !== '';

/**
 * The icon at the field's end, or `''` when it shows none. Password fields trade the variant icon for their
 * visibility toggle; the other variants show the icon that matches their state.
 * @param {TextfieldType} type - The field's input type.
 * @param {TextfieldVariant} variant - The field's visual variant.
 * @param {boolean} autoError - Whether auto-error mode is enabled (shows error icon on invalid).
 * @param {boolean} passwordVisible - Whether the password is currently visible.
 * @returns {string} The icon name to display, or empty string for none.
 */
export function getTextfieldEndIcon(
  type: TextfieldType,
  variant: TextfieldVariant,
  autoError: boolean,
  passwordVisible: boolean
): string {
  if (type === 'password') return passwordVisible ? 'eye-off' : 'eye';

  const effectiveVariant = autoError ? 'error' : variant;
  switch (effectiveVariant) {
    case 'success':
      return 'check-circle';
    case 'warning':
      return 'warning-triangle';
    case 'error':
      return 'xmark-circle';
    default:
      return '';
  }
}

/**
 * Whether the field shows its clear button. Password fields are excluded on purpose — their own visibility
 * toggle already occupies the end of the field, and a masking field clearing itself on a stray click is a
 * worse trade than the convenience is worth.
 * @param {boolean} clearable - Whether the field is clearable.
 * @param {string} value - The current field value.
 * @param {boolean} disabled - Whether the field is disabled.
 * @param {boolean} readonly - Whether the field is readonly.
 * @param {TextfieldType} type - The field's input type.
 * @returns {boolean} True if the clear button should be shown.
 */
export function shouldShowTextfieldClear(
  clearable: boolean,
  value: string,
  disabled: boolean,
  readonly: boolean,
  type: TextfieldType
): boolean {
  return clearable && !!value && !disabled && !readonly && type !== 'password';
}

/**
 * The native input type actually rendered — a visible password is a plain text input.
 * @param {TextfieldType} type - The field's declared input type.
 * @param {boolean} passwordVisible - Whether the password is currently visible.
 * @returns {TextfieldType} The resolved native input type.
 */
export function resolveTextfieldInputType(type: TextfieldType, passwordVisible: boolean): TextfieldType {
  return type === 'password' && passwordVisible ? 'text' : type;
}
