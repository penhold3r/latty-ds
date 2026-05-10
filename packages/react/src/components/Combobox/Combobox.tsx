import { useRef, useEffect, useImperativeHandle, forwardRef, type ReactNode } from 'react';
import type { Combobox as ComboboxEl } from '@latty/web';

export type ComboboxProps = {
  options?: ComboboxEl['options'];
  value?: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  variant?: ComboboxEl['variant'];
  size?: ComboboxEl['size'];
  disabled?: boolean;
  required?: boolean;
  name?: string;
  onLtChange?: (event: CustomEvent) => void;
  children?: ReactNode;
};

export const Combobox = forwardRef<ComboboxEl, ComboboxProps>(function Combobox(
  { onLtChange, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<ComboboxEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onLtChange) return;
    const h = (ev: Event) => onLtChange!(ev as CustomEvent);
    el.addEventListener('lt-change', h);
    return () => el.removeEventListener('lt-change', h);
  }, [onLtChange]);

  return (
    <lt-combobox ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-combobox>
  );
});
Combobox.displayName = 'Combobox';
