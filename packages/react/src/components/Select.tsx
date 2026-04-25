import { useRef, useEffect, useImperativeHandle, forwardRef, type ReactNode } from 'react';
import type { Select as SelectEl } from '@latty/web';

export type SelectProps = {
  variant?: SelectEl['variant'];
  size?: SelectEl['size'];
  value?: string;
  placeholder?: string;
  label?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  options?: SelectEl['options'];
  isOpen?: boolean;
  handleDocumentClick?: string;
  onChange?: (event: CustomEvent) => void;
  children?: ReactNode;
};

export const Select = forwardRef<SelectEl, SelectProps>(
  function Select({ onChange, children, ...props }, forwardedRef) {
    const innerRef = useRef<SelectEl>(null);

    useImperativeHandle(forwardedRef, () => innerRef.current!);

    useEffect(() => {
      const el = innerRef.current;
      if (!el || !onChange) return;
      const h = (ev: Event) => onChange!(ev as CustomEvent);
      el.addEventListener('change', h);
      return () => el.removeEventListener('change', h);
    }, [onChange]);

    return (
      <lt-select ref={innerRef} {...(props as Record<string, unknown>)}>
        {children}
      </lt-select>
    );
  }
);
Select.displayName = 'Select';
