export type ColorInputSize = 'sm' | 'md' | 'lg';
export type ColorInputFormat = 'hex' | 'rgb' | 'hsl';

/** Overridable UI text for `lt-color-input`, for i18n. */
export interface ColorInputLabels {
  /** Validation message shown when a required field has no color selected. */
  validationMessage: string;
}
