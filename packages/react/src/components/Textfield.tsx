import { useRef, useEffect, useImperativeHandle, forwardRef, type ReactNode } from 'react';
import type { Textfield as TextfieldEl } from '@latty/web';

export type TextfieldProps = {
  variant?: TextfieldEl['variant'];
  size?: TextfieldEl['size'];
  type?: TextfieldEl['type'];
  value?: string;
  placeholder?: string;
  label?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  readonly?: boolean;
  iconStart?: string;
  rows?: number;
  isPasswordVisible?: boolean;
  onInput?: (event: CustomEvent) => void;
  onChange?: (event: CustomEvent) => void;
  children?: ReactNode;
};

export const Textfield = forwardRef<TextfieldEl, TextfieldProps>(
  function Textfield({ onInput, onChange, children, ...props }, forwardedRef) {
    const innerRef = useRef<TextfieldEl>(null);

    useImperativeHandle(forwardedRef, () => innerRef.current!);

    useEffect(() => {
      const el = innerRef.current;
      if (!el || !onInput) return;
      const h = (ev: Event) => onInput!(ev as CustomEvent);
      el.addEventListener('input', h);
      return () => el.removeEventListener('input', h);
    }, [onInput]);
    useEffect(() => {
      const el = innerRef.current;
      if (!el || !onChange) return;
      const h = (ev: Event) => onChange!(ev as CustomEvent);
      el.addEventListener('change', h);
      return () => el.removeEventListener('change', h);
    }, [onChange]);

    return (
      <lt-textfield ref={innerRef} {...(props as Record<string, unknown>)}>
        {children}
      </lt-textfield>
    );
  }
);
Textfield.displayName = 'Textfield';
