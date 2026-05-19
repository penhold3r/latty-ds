import { useRef, useEffect, useImperativeHandle, forwardRef, type ReactNode } from 'react';
import type { Calendar as CalendarEl } from '@latty/web';

export type CalendarProps = {
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
  children?: ReactNode;
};

export const Calendar = forwardRef<CalendarEl, CalendarProps>(function Calendar(
  { onLtChange, onLtMonthChange, weekStart, showOutsideDays, valueStart, valueEnd, children, ...props },
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

  // React 18 lowercases camelCase props on custom elements — set as attributes directly
  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    if (weekStart !== undefined) el.setAttribute('week-start', weekStart);
    else el.removeAttribute('week-start');
  }, [weekStart]);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    if (showOutsideDays === false) el.setAttribute('show-outside-days', 'false');
    else el.removeAttribute('show-outside-days');
  }, [showOutsideDays]);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    if (valueStart !== undefined) el.setAttribute('value-start', valueStart);
    else el.removeAttribute('value-start');
  }, [valueStart]);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    if (valueEnd !== undefined) el.setAttribute('value-end', valueEnd);
    else el.removeAttribute('value-end');
  }, [valueEnd]);

  return (
    <lt-calendar ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-calendar>
  );
});
Calendar.displayName = 'Calendar';
