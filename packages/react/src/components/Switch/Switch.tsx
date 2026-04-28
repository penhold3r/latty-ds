import { useRef, useEffect, useImperativeHandle, forwardRef, type ReactNode } from 'react';
import type { Switch as SwitchEl } from '@latty/web';

export type SwitchProps = {
  variant?: SwitchEl['variant'];
  size?: SwitchEl['size'];
  checked?: boolean;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  labelPosition?: SwitchEl['labelPosition'];
  name?: string;
  value?: string;
  onChange?: (event: CustomEvent) => void;
  children?: ReactNode;
};

export const Switch = forwardRef<SwitchEl, SwitchProps>(
  function Switch({ onChange, children, ...props }, forwardedRef) {
    const innerRef = useRef<SwitchEl>(null);

    useImperativeHandle(forwardedRef, () => innerRef.current!);

    useEffect(() => {
      const el = innerRef.current;
      if (!el || !onChange) return;
      const h = (ev: Event) => onChange!(ev as CustomEvent);
      el.addEventListener('change', h);
      return () => el.removeEventListener('change', h);
    }, [onChange]);

    return (
      <lt-switch ref={innerRef} {...(props as Record<string, unknown>)}>
        {children}
      </lt-switch>
    );
  }
);
Switch.displayName = 'Switch';
