export type AlertVariant = 'default' | 'success' | 'warning' | 'error' | 'info';
export type AlertAppearance = 'filled' | 'outlined' | 'solid';

/** Overridable UI text, for i18n — English defaults; override only the keys you need. */
export interface AlertLabels {
  /** Accessible label for the dismiss button. */
  dismiss: string;
}
