import { useRef, useLayoutEffect, useEffect, useImperativeHandle, forwardRef, type InputHTMLAttributes } from 'react';
import type { ColorInput as ColorInputEl } from '@latty-ds/web';
import { normalizeNativeProps } from '../../normalize-props';

export type ColorInputProps = Omit<
  InputHTMLAttributes<ColorInputEl>,
  'onChange' | 'value' | 'label' | 'placeholder' | 'disabled' | 'required' | 'size'
> & {
  formAssociated?: boolean;
  value?: string;
  format?: ColorInputEl['format'];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  size?: ColorInputEl['size'];
  labels?: ColorInputEl['labels'];
  onChange?: (event: CustomEvent<{ value: string }>) => void;
};

export const ColorInput = forwardRef<ColorInputEl, ColorInputProps>(function ColorInput(
  { onChange, labels, formAssociated, disabled, required, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<ColorInputEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onChange) return;
    const h = (ev: Event) => onChange!(ev as CustomEvent<{ value: string }>);
    el.addEventListener('change', h);
    return () => el.removeEventListener('change', h);
  }, [onChange]);
  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    if (labels !== undefined) el.labels = labels;
  }, [labels]);

  return (
    <lt-color-input
      ref={innerRef}
      suppressHydrationWarning
      {...normalizeNativeProps(props as Record<string, unknown>)}
      form-associated={formAssociated || undefined}
      disabled={disabled || undefined}
      required={required || undefined}
    >
      {children}
    </lt-color-input>
  );
});
ColorInput.displayName = 'ColorInput';
