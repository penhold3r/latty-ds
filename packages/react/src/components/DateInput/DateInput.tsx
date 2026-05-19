import { useRef, useEffect, useImperativeHandle, forwardRef, type ReactNode } from 'react';
import type { DateInput as DateInputEl } from '@latty/web';

export type DateInputProps = {
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
  onLtChange?: (event: CustomEvent) => void;
  children?: ReactNode;
};

export const DateInput = forwardRef<DateInputEl, DateInputProps>(function DateInput(
  { onLtChange, weekStart, helperText, disabledDates, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<DateInputEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onLtChange) return;
    const h = (ev: Event) => onLtChange!(ev as CustomEvent);
    el.addEventListener('lt-change', h);
    return () => el.removeEventListener('lt-change', h);
  }, [onLtChange]);

  // React 18 lowercases camelCase props on custom elements — set hyphenated attributes directly
  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    if (weekStart !== undefined) el.setAttribute('week-start', weekStart);
    else el.removeAttribute('week-start');
  }, [weekStart]);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    if (helperText !== undefined) el.setAttribute('helper-text', helperText);
    else el.removeAttribute('helper-text');
  }, [helperText]);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    el.disabledDates = disabledDates ?? [];
  }, [disabledDates]);

  return (
    <lt-date-input ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-date-input>
  );
});
DateInput.displayName = 'DateInput';
