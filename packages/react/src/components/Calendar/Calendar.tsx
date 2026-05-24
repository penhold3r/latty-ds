import { useRef, useEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Calendar as CalendarEl } from '@latty/web';

export type CalendarProps = HTMLAttributes<CalendarEl> & {
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
  onLtChange?: (event: CustomEvent) => void;
  onLtMonthChange?: (event: CustomEvent) => void;
};

export const Calendar = forwardRef<CalendarEl, CalendarProps>(function Calendar(
  { onLtChange, onLtMonthChange, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<CalendarEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onLtChange) return;
    const h = (ev: Event) => onLtChange!(ev as CustomEvent);
    el.addEventListener('lt-change', h);
    return () => el.removeEventListener('lt-change', h);
  }, [onLtChange]);
  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onLtMonthChange) return;
    const h = (ev: Event) => onLtMonthChange!(ev as CustomEvent);
    el.addEventListener('lt-month-change', h);
    return () => el.removeEventListener('lt-month-change', h);
  }, [onLtMonthChange]);

  return (
    <lt-calendar ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-calendar>
  );
});
Calendar.displayName = 'Calendar';
