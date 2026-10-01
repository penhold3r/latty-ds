export type SnackbarVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

/** Overridable UI text, for i18n — English defaults; override only the keys you need. */
export interface SnackbarLabels {
  /** Accessible label for the dismiss button. */
  dismiss: string;
}
