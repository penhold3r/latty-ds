export type ComboboxSize = 'sm' | 'md' | 'lg';
export type ComboboxVariant = 'default' | 'success' | 'warning' | 'error';

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/** Overridable UI text for `lt-combobox`, for i18n. */
export interface ComboboxLabels {
  /** Validation message shown when a required combobox has no option selected. */
  validationMessage: string;
  /** Shown in the dropdown when no options match the current search text. */
  noResults: string;
  /** Accessible label for the clear-all button shown by `clearable`. */
  clear: string;
  /** Shown in the dropdown while `loading` is true. */
  loading: string;
}
