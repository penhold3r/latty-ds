/** First day of the week, matching `Date#getDay()`'s convention: 0 = Sunday, 1 = Monday, … 6 = Saturday. */
export type CalendarWeekStart = '0' | '1' | '2' | '3' | '4' | '5' | '6';
export type CalendarMode = 'single' | 'range';

/** A quick-select range button (`presets`, mode="range" only). `getRange` is called fresh on each click so the
 * range it returns — typically relative to "today" — can't go stale while the calendar stays open across a day
 * boundary. */
export interface CalendarPreset {
  /** Visible button text. */
  label: string;
  /** Returns the `[start, end]` dates to select; order doesn't matter, the earlier date always becomes the start. */
  getRange: () => [Date, Date];
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isInRange: boolean;
  isRangeHoverStart: boolean;
  isRangeHoverEnd: boolean;
  isInHoverRange: boolean;
}

/** Overridable UI text for `lt-calendar`, for i18n. */
export interface CalendarLabels {
  /** Text of the footer button that jumps the view back to today. */
  today: string;
  /** Accessible label for the "view previous month" button. */
  previousMonth: string;
  /** Accessible label for the "view next month" button. */
  nextMonth: string;
  /** Accessible label for the "view previous year" button, shown while picking a month/year (single-month layout only). */
  previousYear: string;
  /** Accessible label for the "view next year" button, shown while picking a month/year (single-month layout only). */
  nextYear: string;
  /** Accessible label for the month/year picker toggle button (single-month layout only), given its current visible text. */
  chooseMonthYear: (monthYear: string) => string;
  /** Short header label for the week-number column (`show-week-numbers`). */
  weekNumberHeader: string;
  /** Accessible label for a week-number cell, given its ISO 8601 week number. */
  weekNumber: (week: number) => string;
}
