import { addMonths, isMonthOutOfRange, isYearOutOfRange } from './calendar-date';

/**
 * Whether navigating the month view by `delta` months would land on a view with at least one in-range day. In
 * multi-month layout, navigating shifts every panel by one month — the relevant boundary is whichever edge
 * panel moves further from what's already visible: the new base month going backward, or the last panel
 * (base + months - 1) going forward. For `months === 1` both reduce to the same single month either way.
 */
export function canNavigateMonth(
  viewYear: number,
  viewMonth: number,
  months: number,
  delta: number,
  min: Date | null,
  max: Date | null
): boolean {
  const base = addMonths(viewYear, viewMonth, delta);
  const edge = delta < 0 ? base : addMonths(base.year, base.month, months - 1);
  return !isMonthOutOfRange(edge.year, edge.month, min, max);
}

/** Same idea as `canNavigateMonth`, for the year-picker's own prev/next-year buttons. */
export function canNavigateYear(pickerYear: number, delta: number, min: Date | null, max: Date | null): boolean {
  return !isYearOutOfRange(pickerYear + delta, min, max);
}

/**
 * Whether `date` falls in one of the visible month panels — used to decide if a candidate can be the roving
 * tab stop, since a cell outside every rendered panel would match nothing and leave no Tab stop at all.
 */
export function isDateInView(date: Date, viewYear: number, viewMonth: number, months: number): boolean {
  if (months <= 1) return date.getFullYear() === viewYear && date.getMonth() === viewMonth;
  for (let i = 0; i < months; i++) {
    const { year, month } = addMonths(viewYear, viewMonth, i);
    if (date.getFullYear() === year && date.getMonth() === month) return true;
  }
  return false;
}

/**
 * The date keyboard navigation moves focus to for an arrow/Home/End key, or `null` for any other key (the
 * caller handles page navigation and activation itself). Home/End move to the first/last day of the current
 * `weekStart`-relative week, matching how the grid is laid out.
 */
export function getArrowFocusDate(date: Date, key: string, weekStart: number): Date | null {
  const next = new Date(date);

  switch (key) {
    case 'ArrowRight':
      next.setDate(next.getDate() + 1);
      break;
    case 'ArrowLeft':
      next.setDate(next.getDate() - 1);
      break;
    case 'ArrowDown':
      next.setDate(next.getDate() + 7);
      break;
    case 'ArrowUp':
      next.setDate(next.getDate() - 7);
      break;
    case 'Home': {
      const offset = (next.getDay() - weekStart + 7) % 7;
      next.setDate(next.getDate() - offset);
      break;
    }
    case 'End': {
      const offset = (next.getDay() - weekStart + 7) % 7;
      next.setDate(next.getDate() + (6 - offset));
      break;
    }
    default:
      return null;
  }

  return next;
}
