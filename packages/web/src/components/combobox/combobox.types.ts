export type ComboboxSize = 'sm' | 'md' | 'lg';
export type ComboboxVariant = 'default' | 'success' | 'warning' | 'error';

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;

  /**
   * Optional secondary text shown beneath the label inside the dropdown (not in the closed field, which
   * always shows just the label).
   */
  description?: string;

  /**
   * Optional icon name (from `@latty-ds/icons`) shown before the label inside the dropdown.
   */
  icon?: string;

  /**
   * Optional group heading. Options sharing the same `group` are rendered together under one heading, as a
   * contiguous run — mirrors native `<optgroup>`: two options with the same `group` name but separated by a
   * different (or no) group in between render as two separate headings, not one merged group.
   */
  group?: string;
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
