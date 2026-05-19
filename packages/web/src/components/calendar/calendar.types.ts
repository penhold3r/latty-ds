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
