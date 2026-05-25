import { useRef, useEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Calendar as CalendarEl } from '@latty/web';

export type CalendarProps = Omit<HTMLAttributes<CalendarEl>, 'onChange'> & {
  mode?: CalendarEl['mode'];
  value?: string;
  valueStart?: string;
  valueEnd?: string;
  min?: string;
  max?: string;
  locale?: string;
  weekStart?: CalendarEl['weekStart'];
  showOutsideDays?: boolean;
  disabled?: boolean;
  months?: number;
  disabledDates?: CalendarEl['disabledDates'];
  onChange?: (event: CustomEvent) => void;
  onMonthChange?: (event: CustomEvent) => void;
};

export const Calendar = forwardRef<CalendarEl, CalendarProps>(function Calendar(
  { onChange, onMonthChange, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<CalendarEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onChange) return;
    const h = (ev: Event) => onChange!(ev as CustomEvent);
    el.addEventListener('change', h);
    return () => el.removeEventListener('change', h);
  }, [onChange]);
  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onMonthChange) return;
    const h = (ev: Event) => onMonthChange!(ev as CustomEvent);
    el.addEventListener('month-change', h);
    return () => el.removeEventListener('month-change', h);
  }, [onMonthChange]);

  return (
    <lt-calendar ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-calendar>
  );
});
Calendar.displayName = 'Calendar';
