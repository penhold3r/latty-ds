import { describe, it, expect } from 'vitest';
import { canNavigateMonth, canNavigateYear, isDateInView, getArrowFocusDate } from '../calendar-navigation';
import { parseIsoDate } from '../calendar-date';

const date = (iso: string) => parseIsoDate(iso)!;

describe('canNavigateMonth', () => {
  it('allows navigation with no bounds', () => {
    expect(canNavigateMonth(2026, 5, 1, -1, null, null)).toBe(true);
    expect(canNavigateMonth(2026, 5, 1, 1, null, null)).toBe(true);
  });

  it('blocks going before min', () => {
    expect(canNavigateMonth(2026, 5, 1, -1, new Date(2026, 5, 1), null)).toBe(false);
  });

  it('allows going to a month that only partially overlaps min', () => {
    expect(canNavigateMonth(2026, 5, 1, -1, new Date(2026, 4, 15), null)).toBe(true);
  });

  it('blocks going after max', () => {
    expect(canNavigateMonth(2026, 5, 1, 1, null, new Date(2026, 5, 30))).toBe(false);
  });

  it('checks the trailing edge panel in multi-month layout when moving forward', () => {
    // Three panels starting June: June/July/August. September is out when max is August 31.
    expect(canNavigateMonth(2026, 5, 3, 1, null, date('2026-08-31'))).toBe(false);
    // Still fine when the new trailing panel (August) is in range.
    expect(canNavigateMonth(2026, 4, 3, 1, null, date('2026-08-31'))).toBe(true);
  });

  it('checks only the new base month when moving backward, not the trailing edge', () => {
    // Moving back one month lands the base on May; the trailing panel (July) is irrelevant to that edge.
    expect(canNavigateMonth(2026, 5, 3, -1, date('2026-05-01'), null)).toBe(true);
  });

  it('rolls the year over correctly at December/January', () => {
    expect(canNavigateMonth(2026, 11, 1, 1, null, null)).toBe(true); // → Jan 2027
    expect(canNavigateMonth(2026, 0, 1, -1, null, null)).toBe(true); // → Dec 2025
  });
});

describe('canNavigateYear', () => {
  it('allows navigation with no bounds', () => {
    expect(canNavigateYear(2026, -1, null, null)).toBe(true);
  });

  it('blocks a year entirely before min', () => {
    expect(canNavigateYear(2026, -1, new Date(2026, 0, 1), null)).toBe(false);
  });

  it('allows the boundary year itself', () => {
    expect(canNavigateYear(2027, -1, new Date(2026, 0, 1), null)).toBe(true);
  });

  it('blocks a year entirely after max', () => {
    expect(canNavigateYear(2026, 1, null, new Date(2026, 11, 31))).toBe(false);
  });
});

describe('isDateInView', () => {
  it('checks the single visible month', () => {
    expect(isDateInView(date('2026-03-15'), 2026, 2, 1)).toBe(true);
    expect(isDateInView(date('2026-04-01'), 2026, 2, 1)).toBe(false);
  });

  it('checks every panel in multi-month layout', () => {
    expect(isDateInView(date('2026-04-15'), 2026, 2, 3)).toBe(true); // second panel
    expect(isDateInView(date('2026-05-15'), 2026, 2, 3)).toBe(true); // third panel
    expect(isDateInView(date('2026-06-01'), 2026, 2, 3)).toBe(false); // past the panels
  });

  it('rolls panels over a year boundary', () => {
    expect(isDateInView(date('2027-01-10'), 2026, 11, 2)).toBe(true);
  });
});

describe('getArrowFocusDate', () => {
  const weekStart = 0; // Sunday

  it.each([
    ['ArrowRight', '2026-03-06'],
    ['ArrowLeft', '2026-03-04'],
    ['ArrowDown', '2026-03-12'],
    ['ArrowUp', '2026-02-26']
  ])('%s moves to %s', (key, expected) => {
    expect(getArrowFocusDate(date('2026-03-05'), key, weekStart)).toEqual(date(expected));
  });

  it('Home moves to the start of the week', () => {
    // 2026-03-05 is a Thursday; Sunday-start week begins 2026-03-01.
    expect(getArrowFocusDate(date('2026-03-05'), 'Home', 0)).toEqual(date('2026-03-01'));
  });

  it('End moves to the end of the week', () => {
    expect(getArrowFocusDate(date('2026-03-05'), 'End', 0)).toEqual(date('2026-03-07'));
  });

  it('respects a Monday week start for Home/End', () => {
    // Monday-start week containing Thu 2026-03-05 runs Mar 2 – Mar 8.
    expect(getArrowFocusDate(date('2026-03-05'), 'Home', 1)).toEqual(date('2026-03-02'));
    expect(getArrowFocusDate(date('2026-03-05'), 'End', 1)).toEqual(date('2026-03-08'));
  });

  it('returns null for keys it does not handle', () => {
    expect(getArrowFocusDate(date('2026-03-05'), 'Enter', weekStart)).toBeNull();
    expect(getArrowFocusDate(date('2026-03-05'), 'PageDown', weekStart)).toBeNull();
    expect(getArrowFocusDate(date('2026-03-05'), 'a', weekStart)).toBeNull();
  });

  it('never mutates the given date', () => {
    const original = date('2026-03-05');
    getArrowFocusDate(original, 'ArrowRight', weekStart);
    expect(original).toEqual(date('2026-03-05'));
  });
});
