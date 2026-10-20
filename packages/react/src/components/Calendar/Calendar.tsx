import { useRef, useLayoutEffect, useEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Calendar as CalendarEl } from '@latty-ds/web';
import { normalizeNativeProps } from '../../normalize-props';

export type CalendarProps = Omit<HTMLAttributes<CalendarEl>, 'onChange' | 'value' | 'min' | 'max' | 'disabled'> & {
  mode?: CalendarEl['mode'];
  value?: string;
  valueStart?: string;
  valueEnd?: string;
  min?: string;
  max?: string;
  locale?: string;
  weekStart?: CalendarEl['weekStart'];
  showOutsideDays?: boolean;
  showWeekNumbers?: boolean;
  disabled?: boolean;
  months?: number;
  disabledDates?: CalendarEl['disabledDates'];
  labels?: CalendarEl['labels'];
  presets?: CalendarEl['presets'];
  onChange?: (event: CustomEvent<{ value: string } | { valueStart: string; valueEnd: string }>) => void;
  onMonthChange?: (event: CustomEvent<{ year: number; month: number }>) => void;
};

export const Calendar = forwardRef<CalendarEl, CalendarProps>(function Calendar(
  {
    onChange,
    onMonthChange,
    weekStart,
    disabledDates,
    labels,
    presets,
    valueStart,
    valueEnd,
    showOutsideDays,
    showWeekNumbers,
    disabled,
    children,
    ...props
  },
  forwardedRef
) {
  const innerRef = useRef<CalendarEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onChange) return;
    const h = (ev: Event) => onChange!(ev as CustomEvent<{ value: string } | { valueStart: string; valueEnd: string }>);
    el.addEventListener('change', h);
    return () => el.removeEventListener('change', h);
  }, [onChange]);
  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onMonthChange) return;
    const h = (ev: Event) => onMonthChange!(ev as CustomEvent<{ year: number; month: number }>);
    el.addEventListener('monthchange', h);
    return () => el.removeEventListener('monthchange', h);
  }, [onMonthChange]);
  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    if (weekStart !== undefined) el.weekStart = weekStart;
    if (disabledDates !== undefined) el.disabledDates = disabledDates;
    if (labels !== undefined) el.labels = labels;
    if (presets !== undefined) el.presets = presets;
  }, [weekStart, disabledDates, labels, presets]);

  return (
    <lt-calendar
      ref={innerRef}
      suppressHydrationWarning
      {...normalizeNativeProps(props as Record<string, unknown>)}
      value-start={valueStart}
      value-end={valueEnd}
      show-outside-days={showOutsideDays || undefined}
      show-week-numbers={showWeekNumbers || undefined}
      disabled={disabled || undefined}
    >
      {children}
    </lt-calendar>
  );
});
Calendar.displayName = 'Calendar';
