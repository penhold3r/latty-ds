export type CalendarWeekStart = '0' | '1';
export type CalendarMode = 'single' | 'range';

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
}
