export type DateInputSize = 'sm' | 'md' | 'lg';
export type DateInputVariant = 'default' | 'success' | 'warning' | 'error';
export type DateInputFormat = 'short' | 'medium' | 'long' | 'full';

/** Overridable UI text for `lt-date-input`, for i18n. */
export interface DateInputLabels {
  /** Validation message shown when a required field has no date selected. */
  validationMessage: string;
  /** Accessible label for the calendar popover dialog. */
  datePicker: string;
}
