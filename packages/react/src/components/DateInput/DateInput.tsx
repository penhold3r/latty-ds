import { useRef, useEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { DateInput as DateInputEl } from '@latty/web';

export type DateInputProps = HTMLAttributes<DateInputEl> & {
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
};

export const DateInput = forwardRef<DateInputEl, DateInputProps>(function DateInput(
  { onLtChange, children, ...props },
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

  return (
    <lt-date-input ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-date-input>
  );
});
DateInput.displayName = 'DateInput';
