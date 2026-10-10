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
  { onChange, labels, children, ...props },
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
    if (labels !== undefined) el.labels = labels;
  }, [labels]);

  return (
    <lt-switch ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-switch>
  );
});
Switch.displayName = 'Switch';
