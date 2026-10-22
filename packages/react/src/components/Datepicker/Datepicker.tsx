import { useRef, useLayoutEffect, useEffect, useImperativeHandle, forwardRef, type InputHTMLAttributes } from 'react';
import type { Datepicker as DatepickerEl } from '@latty-ds/web';
import { normalizeNativeProps } from '../../normalize-props';

export type DatepickerProps = Omit<
  InputHTMLAttributes<DatepickerEl>,
  'onChange' | 'onInput' | 'type' | 'value' | 'label' | 'size' | 'disabled' | 'required'
> & {
  type?: DatepickerEl['type'];
  value?: string;
  label?: string;
  helperText?: string;
  variant?: DatepickerEl['variant'];
  size?: DatepickerEl['size'];
  disabled?: boolean;
  required?: boolean;
  onChange?: (event: CustomEvent<{ value: string }>) => void;
  onInput?: (event: CustomEvent<{ value: string }>) => void;
};

export const Datepicker = forwardRef<DatepickerEl, DatepickerProps>(function Datepicker(
  { onChange, onInput, helperText, disabled, required, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<DatepickerEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onChange) return;
    const h = (ev: Event) => onChange!(ev as CustomEvent<{ value: string }>);
    el.addEventListener('change', h);
    return () => el.removeEventListener('change', h);
  }, [onChange]);
  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onInput) return;
    const h = (ev: Event) => onInput!(ev as CustomEvent<{ value: string }>);
    el.addEventListener('input', h);
    return () => el.removeEventListener('input', h);
  }, [onInput]);
  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    if (helperText !== undefined) el.helperText = helperText;
  }, [helperText]);

  return (
    <lt-datepicker
      ref={innerRef}
      suppressHydrationWarning
      {...normalizeNativeProps(props as Record<string, unknown>)}
      disabled={disabled || undefined}
      required={required || undefined}
    >
      {children}
    </lt-datepicker>
  );
});
Datepicker.displayName = 'Datepicker';
