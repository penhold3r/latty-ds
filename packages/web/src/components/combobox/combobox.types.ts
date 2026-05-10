export type ComboboxSize = 'sm' | 'md' | 'lg';
export type ComboboxVariant = 'default' | 'success' | 'warning' | 'error';

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}
