import { useRef, useLayoutEffect, useEffect, useImperativeHandle, forwardRef, type SelectHTMLAttributes } from 'react';
import type { Select as SelectEl } from '@latty-ds/web';
import { normalizeNativeProps } from '../../normalize-props';

export type SelectProps = Omit<
  SelectHTMLAttributes<SelectEl>,
  'onChange' | 'size' | 'value' | 'multiple' | 'placeholder' | 'label' | 'disabled' | 'required' | 'loading'
> & {
  variant?: SelectEl['variant'];
  size?: SelectEl['size'];
  value?: SelectEl['value'];
  multiple?: boolean;
  placeholder?: string;
  label?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  options?: SelectEl['options'];
  clearable?: boolean;
  loading?: boolean;
  labels?: SelectEl['labels'];
  onChange?: (event: CustomEvent<{ value: string | string[] }>) => void;
};

export const Select = forwardRef<SelectEl, SelectProps>(function Select(
  {
    onChange,
    value,
    helperText,
    options,
    labels,
    multiple,
    disabled,
    required,
    clearable,
    loading,
    children,
    ...props
  },
  forwardedRef
) {
  const innerRef = useRef<SelectEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onChange) return;
    const h = (ev: Event) => onChange!(ev as CustomEvent<{ value: string | string[] }>);
    el.addEventListener('change', h);
    return () => el.removeEventListener('change', h);
  }, [onChange]);
  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    if (value !== undefined) el.value = value;
    if (helperText !== undefined) el.helperText = helperText;
    if (options !== undefined) el.options = options;
    if (labels !== undefined) el.labels = labels;
  }, [value, helperText, options, labels]);

  return (
    <lt-select
      ref={innerRef}
      suppressHydrationWarning
      {...normalizeNativeProps(props as Record<string, unknown>)}
      multiple={multiple || undefined}
      disabled={disabled || undefined}
      required={required || undefined}
      clearable={clearable || undefined}
      loading={loading || undefined}
    >
      {children}
    </lt-select>
  );
});
Select.displayName = 'Select';
