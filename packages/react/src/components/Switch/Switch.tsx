import { useRef, useLayoutEffect, useEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Switch as SwitchEl } from '@latty-ds/web';

export type SwitchProps = Omit<HTMLAttributes<SwitchEl>, 'onChange'> & {
  formAssociated?: boolean;
  variant?: SwitchEl['variant'];
  size?: SwitchEl['size'];
  checked?: boolean;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  labelPosition?: SwitchEl['labelPosition'];
  name?: string;
  value?: string;
  helperText?: string;
  labels?: SwitchEl['labels'];
  onChange?: (event: CustomEvent<{ checked: boolean }>) => void;
};

export const Switch = forwardRef<SwitchEl, SwitchProps>(function Switch(
  { onChange, helperText, labels, formAssociated, checked, disabled, required, labelPosition, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<SwitchEl>(null);

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
    <lt-switch
      ref={innerRef}
      {...(props as Record<string, unknown>)}
      form-associated={formAssociated || undefined}
      checked={checked || undefined}
      disabled={disabled || undefined}
      required={required || undefined}
      label-position={labelPosition}
    >
      {children}
    </lt-switch>
  );
});
Switch.displayName = 'Switch';
