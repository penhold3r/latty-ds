import { describe, it, expect } from 'vitest';
import {
  buildCalendarDays,
  groupDaysIntoWeeks,
  selectRangeDate,
  normalizeRange,
  type CalendarGridOptions
} from '../calendar-grid';
import { parseIsoDate } from '../calendar-date';

const today = new Date(2026, 2, 5);
const iso = (value: string) => parseIsoDate(value)!;

const options = (overrides: Partial<CalendarGridOptions> = {}): CalendarGridOptions => ({
  year: 2026,
  month: 2, // March 2026 — starts on a Sunday
  weekStart: 0,
  mode: 'single',
  selectedDate: null,
  rangeStart: null,
  rangeEnd: null,
  hoverDate: null,
  today,
  isDisabled: () => false,
  ...overrides
});

describe('buildCalendarDays', () => {
  it('builds whole weeks starting on weekStart', () => {
    const days = buildCalendarDays(options());
    expect(days).toHaveLength(35); // 31 March days + 4 trailing April days
    expect(days[0].date.getDate()).toBe(1);
    expect(days[0].isCurrentMonth).toBe(true);
    expect(days[34].date.getDate()).toBe(4);
    expect(days[34].isCurrentMonth).toBe(false);
  });

  it('prepends the previous month when the month does not start on weekStart', () => {
    const days = buildCalendarDays(options({ weekStart: 1 })); // Monday-start
    expect(days).toHaveLength(42);
    expect(days[0].date.getDate()).toBe(23);
    expect(days[0].date.getMonth()).toBe(1); // February
    expect(days[0].isCurrentMonth).toBe(false);
    expect(days[6].date.getDate()).toBe(1); // March 1 lands in the second row
  });

  it('marks today', () => {
    const days = buildCalendarDays(options());
    expect(days.filter((d) => d.isToday)).toHaveLength(1);
    expect(days.find((d) => d.isToday)!.date.getDate()).toBe(5);
  });

  it('marks the selected date only in single mode', () => {
    const selectedDate = parseIsoDate('2026-03-10');
    const single = buildCalendarDays(options({ selectedDate }));
    expect(single.find((d) => d.date.getDate() === 10)!.isSelected).toBe(true);

    const rangeMode = buildCalendarDays(options({ mode: 'range', selectedDate }));
    expect(rangeMode.some((d) => d.isSelected)).toBe(false);
  });

  it('marks the range start, end, and days in between', () => {
    const days = buildCalendarDays(
      options({
        mode: 'range',
        rangeStart: parseIsoDate('2026-03-05'),
        rangeEnd: parseIsoDate('2026-03-10')
      })
    );
    const day = (n: number) => days.find((d) => d.isCurrentMonth && d.date.getDate() === n)!;

    expect(day(5).isRangeStart).toBe(true);
    expect(day(10).isRangeEnd).toBe(true);
    expect(day(5).isInRange).toBe(false);
    expect(day(10).isInRange).toBe(false);
    expect(day(6).isInRange).toBe(true);
    expect(day(9).isInRange).toBe(true);
    expect(day(4).isInRange).toBe(false);
    expect(day(11).isInRange).toBe(false);
  });

  it('previews a hover range forward from an existing start', () => {
    const days = buildCalendarDays(
      options({
        mode: 'range',
        rangeStart: parseIsoDate('2026-03-05'),
        hoverDate: parseIsoDate('2026-03-08')
      })
    );
    const day = (n: number) => days.find((d) => d.isCurrentMonth && d.date.getDate() === n)!;

    expect(day(5).isRangeHoverStart).toBe(true);
    expect(day(8).isRangeHoverEnd).toBe(true);
    expect(day(6).isInHoverRange).toBe(true);
    expect(day(7).isInHoverRange).toBe(true);
    expect(day(5).isInHoverRange).toBe(false);
    expect(day(8).isInHoverRange).toBe(false);
  });

  it('normalizes a hover range that ends before the start', () => {
    const days = buildCalendarDays(
      options({
        mode: 'range',
        rangeStart: parseIsoDate('2026-03-10'),
        hoverDate: parseIsoDate('2026-03-05')
      })
    );
    const day = (n: number) => days.find((d) => d.isCurrentMonth && d.date.getDate() === n)!;

    expect(day(5).isRangeHoverStart).toBe(true);
    expect(day(10).isRangeHoverEnd).toBe(true);
    expect(day(7).isInHoverRange).toBe(true);
  });

  it('does not preview a hover range once both ends are set', () => {
    const days = buildCalendarDays(
      options({
        mode: 'range',
        rangeStart: parseIsoDate('2026-03-05'),
        rangeEnd: parseIsoDate('2026-03-10'),
        hoverDate: parseIsoDate('2026-03-20')
      })
    );
    expect(days.some((d) => d.isInHoverRange)).toBe(false);
    expect(days.some((d) => d.isRangeHoverStart || d.isRangeHoverEnd)).toBe(false);
  });

  it('delegates disabled state to the supplied predicate', () => {
    const days = buildCalendarDays(options({ isDisabled: (date) => date.getDate() === 7 }));
    const disabled = days.filter((d) => d.isDisabled);
    expect(disabled).toHaveLength(1);
    expect(disabled[0].date.getDate()).toBe(7);
  });
});

describe('groupDaysIntoWeeks', () => {
  it('groups day cells into rows of exactly seven', () => {
    const days = buildCalendarDays(options());
    const weeks = groupDaysIntoWeeks(days);
    expect(weeks).toHaveLength(5);
    expect(weeks.every((week) => week.length === 7)).toBe(true);
  });

  it('returns no rows for no days', () => {
    expect(groupDaysIntoWeeks([])).toEqual([]);
  });
});

describe('selectRangeDate', () => {
  it('starts a new range when none exists', () => {
    expect(selectRangeDate({ valueStart: '', valueEnd: '' }, iso('2026-03-05'))).toEqual({
      valueStart: '2026-03-05',
      valueEnd: ''
    });
  });

  it('starts over once a range is complete', () => {
    expect(selectRangeDate({ valueStart: '2026-03-01', valueEnd: '2026-03-05' }, iso('2026-03-20'))).toEqual({
      valueStart: '2026-03-20',
      valueEnd: ''
    });
  });

  it('clears when re-activating the start day', () => {
    expect(selectRangeDate({ valueStart: '2026-03-05', valueEnd: '' }, iso('2026-03-05'))).toEqual({
      valueStart: '',
      valueEnd: ''
    });
  });

  it('swaps when the second click is before the start', () => {
    expect(selectRangeDate({ valueStart: '2026-03-10', valueEnd: '' }, iso('2026-03-05'))).toEqual({
      valueStart: '2026-03-05',
      valueEnd: '2026-03-10'
    });
  });

  it('completes the range when the second click is after the start', () => {
    expect(selectRangeDate({ valueStart: '2026-03-05', valueEnd: '' }, iso('2026-03-10'))).toEqual({
      valueStart: '2026-03-05',
      valueEnd: '2026-03-10'
    });
  });

  it('starts a new range when the existing start is unparseable, rather than crashing', () => {
    expect(selectRangeDate({ valueStart: 'garbage', valueEnd: '' }, iso('2026-03-05'))).toEqual({
      valueStart: '2026-03-05',
      valueEnd: ''
    });
  });
});

describe('normalizeRange', () => {
  it('keeps an already-ordered pair', () => {
    const a = iso('2026-03-01');
    const b = iso('2026-03-10');
    expect(normalizeRange(a, b)).toEqual({ start: a, end: b });
  });

  it('swaps a reversed pair', () => {
    const a = iso('2026-03-10');
    const b = iso('2026-03-01');
    expect(normalizeRange(a, b)).toEqual({ start: b, end: a });
  });
});
