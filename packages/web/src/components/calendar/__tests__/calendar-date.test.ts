import { describe, it, expect } from 'vitest';
import {
  deriveWeekStart,
  safeDateTimeFormat,
  getIsoWeekNumber,
  parseIsoDate,
  toIsoDate,
  isSameDay,
  addMonths,
  isMonthOutOfRange,
  isYearOutOfRange,
  getWeekdayLabels
} from '../calendar-date';

describe('parseIsoDate', () => {
  it('parses to local midnight, not UTC', () => {
    const date = parseIsoDate('2026-03-05')!;
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(2);
    expect(date.getDate()).toBe(5);
    expect(date.getHours()).toBe(0);
  });

  it('returns null for empty or invalid input', () => {
    expect(parseIsoDate('')).toBeNull();
    expect(parseIsoDate('not-a-date')).toBeNull();
  });
});

describe('toIsoDate', () => {
  it('formats using the local calendar date with zero padding', () => {
    expect(toIsoDate(new Date(2026, 2, 5))).toBe('2026-03-05');
  });

  it('round-trips through parseIsoDate', () => {
    expect(toIsoDate(parseIsoDate('2026-12-31')!)).toBe('2026-12-31');
  });
});

describe('isSameDay', () => {
  it('ignores the time of day', () => {
    expect(isSameDay(new Date(2026, 2, 5, 8), new Date(2026, 2, 5, 22))).toBe(true);
  });

  it('is false across different days', () => {
    expect(isSameDay(new Date(2026, 2, 5), new Date(2026, 2, 6))).toBe(false);
  });
});

describe('addMonths', () => {
  it('rolls forward across a year boundary', () => {
    expect(addMonths(2026, 11, 1)).toEqual({ year: 2027, month: 0 });
  });

  it('rolls backward across a year boundary', () => {
    expect(addMonths(2026, 0, -1)).toEqual({ year: 2025, month: 11 });
  });

  it('handles multi-year offsets in both directions', () => {
    expect(addMonths(2026, 5, 25)).toEqual({ year: 2028, month: 6 });
    expect(addMonths(2026, 5, -25)).toEqual({ year: 2024, month: 4 });
  });
});

describe('isMonthOutOfRange', () => {
  it('is true when the whole month is before min', () => {
    expect(isMonthOutOfRange(2026, 0, new Date(2026, 2, 1), null)).toBe(true);
  });

  it('is true when the whole month is after max', () => {
    expect(isMonthOutOfRange(2026, 5, null, new Date(2026, 2, 31))).toBe(true);
  });

  it('is false for a month only partially in range', () => {
    expect(isMonthOutOfRange(2026, 2, new Date(2026, 2, 15), null)).toBe(false);
  });

  it('is false with no bounds', () => {
    expect(isMonthOutOfRange(2026, 2, null, null)).toBe(false);
  });
});

describe('isYearOutOfRange', () => {
  it('is true for a year entirely before min', () => {
    expect(isYearOutOfRange(2025, new Date(2026, 0, 1), null)).toBe(true);
  });

  it('is true for a year entirely after max', () => {
    expect(isYearOutOfRange(2027, null, new Date(2026, 11, 31))).toBe(true);
  });

  it('is false for the boundary year itself', () => {
    expect(isYearOutOfRange(2026, new Date(2026, 0, 1), new Date(2026, 11, 31))).toBe(false);
  });
});

describe('getIsoWeekNumber', () => {
  it.each([
    ['2021-01-01', 53], // Friday belonging to 2020's final ISO week
    ['2024-12-30', 1], // Monday belonging to 2025's first ISO week
    ['2026-01-01', 1],
    ['2026-10-23', 43]
  ])('returns the ISO week for %s', (iso, expected) => {
    expect(getIsoWeekNumber(parseIsoDate(iso)!)).toBe(expected);
  });
});

describe('getWeekdayLabels', () => {
  it('starts on Sunday for weekStart 0', () => {
    expect(getWeekdayLabels('en-US', 0)).toEqual(['S', 'M', 'T', 'W', 'T', 'F', 'S']);
  });

  it('starts on Monday for weekStart 1', () => {
    expect(getWeekdayLabels('en-US', 1)).toEqual(['M', 'T', 'W', 'T', 'F', 'S', 'S']);
  });
});

describe('deriveWeekStart', () => {
  it('maps en-US to Sunday', () => {
    expect(deriveWeekStart('en-US')).toBe('0');
  });

  it('maps de-DE to Monday', () => {
    expect(deriveWeekStart('de-DE')).toBe('1');
  });

  it('falls back to Sunday for an invalid locale', () => {
    expect(deriveWeekStart('not a locale!!')).toBe('0');
  });
});

describe('safeDateTimeFormat', () => {
  it('formats with a valid locale', () => {
    expect(safeDateTimeFormat('en-US', { month: 'long' }).format(new Date(2026, 0, 1))).toBe('January');
  });

  it('falls back to en-US instead of throwing on an invalid locale', () => {
    expect(safeDateTimeFormat('es-', { month: 'long' }).format(new Date(2026, 0, 1))).toBe('January');
  });
});
