import { useRef, useEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Combobox as ComboboxEl } from '@latty-ds/web';

export type ComboboxProps = Omit<HTMLAttributes<ComboboxEl>, 'onChange'> & {
  formAssociated?: boolean;
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
  onChange?: (event: CustomEvent) => void;
};

export const Combobox = forwardRef<ComboboxEl, ComboboxProps>(function Combobox(
  { onChange, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<ComboboxEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onChange) return;
    const h = (ev: Event) => onChange!(ev as CustomEvent);
    el.addEventListener('change', h);
    return () => el.removeEventListener('change', h);
  }, [onChange]);

  return (
    <lt-combobox ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-combobox>
  );
});
Combobox.displayName = 'Combobox';
