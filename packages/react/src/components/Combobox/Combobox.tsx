import { useRef, useLayoutEffect, useEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Combobox as ComboboxEl } from '@latty-ds/web';

export type ComboboxProps = Omit<HTMLAttributes<ComboboxEl>, 'onChange'> & {
  formAssociated?: boolean;
  options?: ComboboxEl['options'];
  clearable?: boolean;
  loading?: boolean;
  value?: ComboboxEl['value'];
  multiple?: boolean;
  label?: string;
  placeholder?: string;
  helperText?: string;
  variant?: ComboboxEl['variant'];
  size?: ComboboxEl['size'];
  disabled?: boolean;
  required?: boolean;
  name?: string;
  labels?: ComboboxEl['labels'];
  onChange?: (event: CustomEvent<{ value: string | string[] }>) => void;
};

export const Combobox = forwardRef<ComboboxEl, ComboboxProps>(function Combobox(
  { onChange, options, value, labels, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<ComboboxEl>(null);

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
    if (options !== undefined) el.options = options;
    if (value !== undefined) el.value = value;
    if (labels !== undefined) el.labels = labels;
  }, [options, value, labels]);

  return (
    <lt-combobox ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-combobox>
  );
});
Combobox.displayName = 'Combobox';
