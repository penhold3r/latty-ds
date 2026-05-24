import { useRef, useEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Textfield as TextfieldEl, LattyIconName } from '@latty/web';

export type TextfieldProps = Omit<HTMLAttributes<TextfieldEl>, 'onInput' | 'onChange'> & {
  variant?: TextfieldEl['variant'];
  size?: TextfieldEl['size'];
  type?: TextfieldEl['type'];
  value?: string;
  placeholder?: string;
  label?: string;
  helperText?: TextfieldEl['helperText'];
  disabled?: boolean;
  required?: boolean;
  readonly?: boolean;
  iconStart?: LattyIconName;
  rows?: number;
  min?: TextfieldEl['min'];
  max?: TextfieldEl['max'];
  uppercase?: boolean;
  onInput?: (event: CustomEvent) => void;
  onChange?: (event: CustomEvent) => void;
};

export const Textfield = forwardRef<TextfieldEl, TextfieldProps>(function Textfield(
  { onInput, onChange, children, ...props },
  forwardedRef
) {
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
});
Textfield.displayName = 'Textfield';
