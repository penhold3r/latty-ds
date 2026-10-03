import { useRef, useLayoutEffect, useEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { DateInput as DateInputEl } from '@latty-ds/web';

export type DateInputProps = Omit<HTMLAttributes<DateInputEl>, 'onChange'> & {
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
  name?: string;
  disabledDates?: DateInputEl['disabledDates'];
  labels?: DateInputEl['labels'];
  onChange?: (event: CustomEvent<{ value: string }>) => void;
};

export const DateInput = forwardRef<DateInputEl, DateInputProps>(function DateInput(
  { onChange, weekStart, disabledDates, labels, children, ...props },
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
    if (disabledDates !== undefined) el.disabledDates = disabledDates;
    if (labels !== undefined) el.labels = labels;
  }, [weekStart, disabledDates, labels]);

  return (
    <lt-date-input ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-date-input>
  );
});
DateInput.displayName = 'DateInput';
