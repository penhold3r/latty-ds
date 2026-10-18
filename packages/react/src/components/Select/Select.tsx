import { useRef, useLayoutEffect, useEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Select as SelectEl } from '@latty-ds/web';

export type SelectProps = Omit<HTMLAttributes<SelectEl>, 'onChange'> & {
  formAssociated?: boolean;
  variant?: SelectEl['variant'];
  size?: SelectEl['size'];
  value?: SelectEl['value'];
  multiple?: boolean;
  placeholder?: string;
  label?: string;
  name?: string;
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
  { onChange, value, options, labels, children, ...props },
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
    if (options !== undefined) el.options = options;
    if (labels !== undefined) el.labels = labels;
  }, [value, options, labels]);

  return (
    <lt-select ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-select>
  );
});
Select.displayName = 'Select';
