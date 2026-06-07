import { useRef, useEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
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
  onChange?: (event: CustomEvent) => void;
};

export const DateInput = forwardRef<DateInputEl, DateInputProps>(function DateInput(
  { onChange, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<DateInputEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onChange) return;
    const h = (ev: Event) => onChange!(ev as CustomEvent);
    el.addEventListener('change', h);
    return () => el.removeEventListener('change', h);
  }, [onChange]);

  return (
    <lt-date-input ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-date-input>
  );
});
DateInput.displayName = 'DateInput';
