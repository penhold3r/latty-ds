import { useRef, useLayoutEffect, useEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Checkbox as CheckboxEl } from '@latty-ds/web';

export type CheckboxProps = Omit<HTMLAttributes<CheckboxEl>, 'onChange'> & {
  formAssociated?: boolean;
  variant?: CheckboxEl['variant'];
  size?: CheckboxEl['size'];
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  labelPosition?: CheckboxEl['labelPosition'];
  name?: string;
  value?: string;
  helperText?: string;
  labels?: CheckboxEl['labels'];
  onChange?: (event: CustomEvent<{ checked: boolean }>) => void;
};

export const Checkbox = forwardRef<CheckboxEl, CheckboxProps>(function Checkbox(
  {
    onChange,
    helperText,
    labels,
    formAssociated,
    checked,
    indeterminate,
    disabled,
    required,
    labelPosition,
    children,
    ...props
  },
  forwardedRef
) {
  const innerRef = useRef<CheckboxEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onChange) return;
    const h = (ev: Event) => onChange!(ev as CustomEvent<{ checked: boolean }>);
    el.addEventListener('change', h);
    return () => el.removeEventListener('change', h);
  }, [onChange]);
  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    if (helperText !== undefined) el.helperText = helperText;
    if (labels !== undefined) el.labels = labels;
  }, [helperText, labels]);

  return (
    <lt-checkbox
      ref={innerRef}
      suppressHydrationWarning
      {...(props as Record<string, unknown>)}
      form-associated={formAssociated || undefined}
      checked={checked || undefined}
      indeterminate={indeterminate || undefined}
      disabled={disabled || undefined}
      required={required || undefined}
      label-position={labelPosition}
    >
      {children}
    </lt-checkbox>
  );
});
Checkbox.displayName = 'Checkbox';
