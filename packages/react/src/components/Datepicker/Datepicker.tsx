import { useRef, useLayoutEffect, useEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Datepicker as DatepickerEl } from '@latty-ds/web';

export type DatepickerProps = Omit<HTMLAttributes<DatepickerEl>, 'onChange' | 'onInput'> & {
  formAssociated?: boolean;
  type?: DatepickerEl['type'];
  value?: string;
  min?: string;
  max?: string;
  label?: string;
  helperText?: string;
  variant?: DatepickerEl['variant'];
  size?: DatepickerEl['size'];
  disabled?: boolean;
  required?: boolean;
  readonly?: boolean;
  name?: string;
  onChange?: (event: CustomEvent<{ value: string }>) => void;
  onInput?: (event: CustomEvent<{ value: string }>) => void;
};

export const Datepicker = forwardRef<DatepickerEl, DatepickerProps>(function Datepicker(
  { onChange, onInput, helperText, formAssociated, disabled, required, readonly, children, ...props },
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
      {...(props as Record<string, unknown>)}
      form-associated={formAssociated || undefined}
      disabled={disabled || undefined}
      required={required || undefined}
      readonly={readonly || undefined}
    >
      {children}
    </lt-datepicker>
  );
});
Datepicker.displayName = 'Datepicker';
