import type { CalendarDay, CalendarMode } from './calendar.types';
import { isSameDay, toIsoDate, parseIsoDate } from './calendar-date';

/** The two ISO values that make up a range selection. */
export interface CalendarRangeSelection {
  valueStart: string;
  valueEnd: string;
}

export interface CalendarGridOptions {
  /** Year of the month panel being built. */
  year: number;
  /** Month index (0-11) of the panel being built. */
  month: number;
  /** First day of the week, 0 = Sunday … 6 = Saturday. */
  weekStart: number;
  mode: CalendarMode;
  /** The selected date, used only in `single` mode. */
  selectedDate: Date | null;
  /** Range start/end, used only in `range` mode. */
  rangeStart: Date | null;
  rangeEnd: Date | null;
  /** The date currently hovered while picking a range's end, if any. */
  hoverDate: Date | null;
  /** Reference "today" used to mark the current day. */
  today: Date;
  /** Predicate deciding whether a date can't be selected (min/max, explicit dates, custom rules). */
  isDisabled: (date: Date) => boolean;
}

/**
 * Builds every day cell for one month panel, including the filler days from the adjacent months that complete
 * the first and last weeks. In `range` mode with only a start date selected, `hoverDate` also produces the
 * hover-preview flags (normalized so the preview start always precedes the preview end).
 */
export function buildCalendarDays(options: CalendarGridOptions): CalendarDay[] {
  const { year, month, weekStart, mode, selectedDate, rangeStart, rangeEnd, hoverDate, today, isDisabled } = options;

  // Hover preview: normalize so visHoverStart <= visHoverEnd
  let visHoverStart: Date | null = null;
  let visHoverEnd: Date | null = null;
  if (rangeStart && !rangeEnd && hoverDate) {
    if (hoverDate >= rangeStart) {
      visHoverStart = rangeStart;
      visHoverEnd = hoverDate;
    } else {
      visHoverStart = hoverDate;
      visHoverEnd = rangeStart;
    }
  }

  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);

  const startOffset = (firstOfMonth.getDay() - weekStart + 7) % 7;
  const totalCurrent = startOffset + lastOfMonth.getDate();
  const endOffset = totalCurrent % 7 === 0 ? 0 : 7 - (totalCurrent % 7);

  const buildDay = (date: Date, isCurrentMonth: boolean): CalendarDay => {
    const isRangeStart = !!rangeStart && isSameDay(date, rangeStart);
    const isRangeEnd = !!rangeEnd && isSameDay(date, rangeEnd);
    const isInRange =
      !!rangeStart &&
      !!rangeEnd &&
      date > rangeStart &&
      date < rangeEnd &&
      !isSameDay(date, rangeStart) &&
      !isSameDay(date, rangeEnd);

    const isRangeHoverStart = !!visHoverStart && isSameDay(date, visHoverStart);
    const isRangeHoverEnd = !!visHoverEnd && !isSameDay(visHoverStart!, visHoverEnd) && isSameDay(date, visHoverEnd);
    const isInHoverRange = !!visHoverStart && !!visHoverEnd && date > visHoverStart && date < visHoverEnd;

    return {
      date,
      isCurrentMonth,
      isToday: isSameDay(date, today),
      isSelected: mode === 'single' && selectedDate ? isSameDay(date, selectedDate) : false,
      isDisabled: isDisabled(date),
      isRangeStart,
      isRangeEnd,
      isInRange,
      isRangeHoverStart,
      isRangeHoverEnd,
      isInHoverRange
    };
  };

  const days: CalendarDay[] = [];

  for (let i = startOffset; i > 0; i--) {
    days.push(buildDay(new Date(year, month, 1 - i), false));
  }

  for (let d = 1; d <= lastOfMonth.getDate(); d++) {
    days.push(buildDay(new Date(year, month, d), true));
  }

  for (let d = 1; d <= endOffset; d++) {
    days.push(buildDay(new Date(year, month + 1, d), false));
  }

  return days;
}

/** Groups a flat month's day cells into rows of exactly seven, one row per calendar week. */
export function groupDaysIntoWeeks(days: readonly CalendarDay[]): CalendarDay[][] {
  const weeks: CalendarDay[][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  return weeks;
}

/**
 * Computes the next range value when `date` is activated in `range` mode:
 * - with no start yet, or a completed range, this starts a fresh range;
 * - re-activating the start day clears the range;
 * - activating a day before the start swaps the two (keeping `valueStart <= valueEnd`);
 * - otherwise it completes the range.
 */
export function selectRangeDate(current: CalendarRangeSelection, date: Date): CalendarRangeSelection {
  const iso = toIsoDate(date);
  const startDate = parseIsoDate(current.valueStart);

  if (!startDate || current.valueEnd) return { valueStart: iso, valueEnd: '' };
  if (isSameDay(date, startDate)) return { valueStart: '', valueEnd: '' };
  if (date < startDate) return { valueStart: iso, valueEnd: current.valueStart };
  return { valueStart: current.valueStart, valueEnd: iso };
}

/** Normalizes a preset's two dates into ascending `[start, end]` order regardless of how the preset returned them. */
export function normalizeRange(a: Date, b: Date): { start: Date; end: Date } {
  return a <= b ? { start: a, end: b } : { start: b, end: a };
}
