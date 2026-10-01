export type ChipVariant = 'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'error' | 'info';

export type ChipSize = 'sm' | 'md' | 'lg';

export type ChipAppearance = 'filled' | 'outlined';

/** Overridable UI text, for i18n — English defaults; override only the keys you need. */
export interface ChipLabels {
  /** Accessible label for the delete/remove button. */
  remove: string;
}
