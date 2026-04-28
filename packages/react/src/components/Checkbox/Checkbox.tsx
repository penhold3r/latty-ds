import { useRef, useEffect, useImperativeHandle, forwardRef, type ReactNode } from 'react';
import type { Checkbox as CheckboxEl } from '@latty/web';

export type CheckboxProps = {
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
  onChange?: (event: CustomEvent) => void;
  children?: ReactNode;
};

export const Checkbox = forwardRef<CheckboxEl, CheckboxProps>(
  function Checkbox({ onChange, children, ...props }, forwardedRef) {
    const innerRef = useRef<CheckboxEl>(null);

    useImperativeHandle(forwardedRef, () => innerRef.current!);

    useEffect(() => {
      const el = innerRef.current;
      if (!el || !onChange) return;
      const h = (ev: Event) => onChange!(ev as CustomEvent);
      el.addEventListener('change', h);
      return () => el.removeEventListener('change', h);
    }, [onChange]);

    return (
      <lt-checkbox ref={innerRef} {...(props as Record<string, unknown>)}>
        {children}
      </lt-checkbox>
    );
  }
);
Checkbox.displayName = 'Checkbox';
