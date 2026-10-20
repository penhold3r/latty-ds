import { useRef, useLayoutEffect, useEffect, useImperativeHandle, forwardRef, type InputHTMLAttributes } from 'react';
import type { DateInput as DateInputEl } from '@latty-ds/web';
import { normalizeNativeProps } from '../../normalize-props';

export type DateInputProps = Omit<
  InputHTMLAttributes<DateInputEl>,
  'onChange' | 'value' | 'min' | 'max' | 'label' | 'placeholder' | 'size' | 'disabled' | 'required'
> & {
  formAssociated?: boolean;
  value?: string;
  min?: string;
  max?: string;
  locale?: string;
  format?: DateInputEl['format'];
  weekStart?: DateInputEl['weekStart'];
  label?: string;
  placeholder?: string;
  helperText?: string;
  variant?: DateInputEl['variant'];
  size?: DateInputEl['size'];
  disabled?: boolean;
  required?: boolean;
  disabledDates?: DateInputEl['disabledDates'];
  labels?: DateInputEl['labels'];
  onChange?: (event: CustomEvent<{ value: string }>) => void;
};

export const DateInput = forwardRef<DateInputEl, DateInputProps>(function DateInput(
  { onChange, weekStart, helperText, disabledDates, labels, formAssociated, disabled, required, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<DateInputEl>(null);

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
    if (weekStart !== undefined) el.weekStart = weekStart;
    if (helperText !== undefined) el.helperText = helperText;
    if (disabledDates !== undefined) el.disabledDates = disabledDates;
    if (labels !== undefined) el.labels = labels;
  }, [weekStart, helperText, disabledDates, labels]);

  return (
    <lt-date-input
      ref={innerRef}
      suppressHydrationWarning
      {...normalizeNativeProps(props as Record<string, unknown>)}
      form-associated={formAssociated || undefined}
      disabled={disabled || undefined}
      required={required || undefined}
    >
      {children}
    </lt-date-input>
  );
});
DateInput.displayName = 'DateInput';
