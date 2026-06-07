import { useRef, useEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { ColorInput as ColorInputEl } from '@latty-ds/web';

export type ColorInputProps = Omit<HTMLAttributes<ColorInputEl>, 'onChange'> & {
  formAssociated?: boolean;
  value?: string;
  format?: ColorInputEl['format'];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  size?: ColorInputEl['size'];
  onChange?: (detail: { value: string }) => void;
};

export const ColorInput = forwardRef<ColorInputEl, ColorInputProps>(function ColorInput(
  { onChange, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<ColorInputEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onChange) return;
    const h = (ev: Event) => onChange!((ev as CustomEvent).detail);
    el.addEventListener('change', h);
    return () => el.removeEventListener('change', h);
  }, [onChange]);

  return (
    <lt-color-input ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-color-input>
  );
});
ColorInput.displayName = 'ColorInput';
