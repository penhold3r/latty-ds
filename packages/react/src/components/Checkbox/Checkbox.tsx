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
  labels?: CheckboxEl['labels'];
  onChange?: (event: CustomEvent<{ checked: boolean }>) => void;
};

export const Checkbox = forwardRef<CheckboxEl, CheckboxProps>(function Checkbox(
  { onChange, labels, children, ...props },
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
    if (labels !== undefined) el.labels = labels;
  }, [labels]);

  return (
    <lt-checkbox ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-checkbox>
  );
});
Checkbox.displayName = 'Checkbox';
