import type { CalendarWeekStart } from './calendar.types';

/**
 * `Intl.Locale.prototype.getWeekInfo` isn't in this project's configured `lib` (adding it would pull in the
 * unrelated, much larger Temporal proposal's ambient types via lib.esnext.intl.d.ts) — declare just the one
 * method shape we actually use instead of widening the global lib for every package.
 */
interface LocaleWithWeekInfo {
  getWeekInfo?(): { firstDay: number };
}

/**
 * The locale's own first day of the week (`getWeekInfo().firstDay` is 1 = Monday … 7 = Sunday per spec; `% 7`
 * converts it to this component's `Date#getDay()`-style convention, 0 = Sunday … 6 = Saturday). Falls back to
 * Sunday for an invalid locale string or a runtime with no `getWeekInfo` support.
 * @param {string} locale - The locale string.
 * @returns {CalendarWeekStart} The week start day (0-6).
 */
export function deriveWeekStart(locale: string): CalendarWeekStart {
  try {
    const info = (new Intl.Locale(locale) as unknown as LocaleWithWeekInfo).getWeekInfo?.();
    if (info) return String(info.firstDay % 7) as CalendarWeekStart;
  } catch {
    // Invalid/unsupported locale string — Intl.Locale's constructor throws a RangeError for these.
  }
  return '0';
}

/**
 * `Intl.DateTimeFormat`'s constructor throws a RangeError for a malformed or incomplete locale string — not just
 * a programming mistake to guard against defensively, but a state `locale` can genuinely pass through for real:
 * it's a plain reflected attribute, and the docs Playground's text control sets it live on every keystroke, so a
 * user typing "es-US" character by character briefly has it set to "e-US", "es-", etc. Every formatting call site
 * goes through this instead of constructing `Intl.DateTimeFormat` directly, falling back to the 'en-US' default
 * rather than letting a transient bad value crash the whole component's render.
 * @param {string} locale - The locale string.
 * @param {Intl.DateTimeFormatOptions} options - The date time format options.
 * @returns {Intl.DateTimeFormat} The date time format instance.
 */
export function safeDateTimeFormat(locale: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  try {
    return new Intl.DateTimeFormat(locale, options);
  } catch {
    return new Intl.DateTimeFormat('en-US', options);
  }
}

/**
 * The ISO 8601 week number (1-53) for the week containing `date`, computed off that week's Thursday — the day
 * ISO 8601 uses to decide which year (and so which week-1) a week spanning a year boundary belongs to. Shown
 * against each row's own first day regardless of `week-start`: like most calendar UIs that offer week numbers,
 * this component doesn't re-derive a locale-relative week numbering scheme, just the one standard everyone
 * recognizes.
 * @param {Date} date - The date to get the week number for.
 * @returns {number} The ISO week number.
 */
export function getIsoWeekNumber(date: Date): number {
  const thursday = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const isoDayOfWeek = thursday.getUTCDay() || 7; // Sunday (0) becomes 7, so Monday=1..Sunday=7
  thursday.setUTCDate(thursday.getUTCDate() + 4 - isoDayOfWeek);
  const yearStart = new Date(Date.UTC(thursday.getUTCFullYear(), 0, 1));
  return Math.ceil(((thursday.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/**
 * Parses an ISO `YYYY-MM-DD` date string into a local-midnight `Date`, or `null` when it's empty or invalid.
 * `T00:00:00` is appended so the result is parsed as local time, not UTC — without it, every date would shift
 * by a day for any user west of UTC.
 * @param {string} iso - The ISO date string.
 * @returns {Date | null} The parsed date or null.
 */
export function parseIsoDate(iso: string): Date | null {
  if (!iso) return null;
  const date = new Date(`${iso}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Formats a date as ISO `YYYY-MM-DD`, using its local calendar date (not UTC).
 * @param {Date} date - The date to format.
 * @returns {string} The ISO date string.
 */
export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Whether two dates fall on the same local calendar day.
 * @param {Date} a - The first date.
 * @param {Date} b - The second date.
 * @returns {boolean} True if same day.
 */
export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export interface MonthPosition {
  year: number;
  month: number;
}

/**
 * `delta` months from the given year/month, normalizing the month into `0..11` and rolling the year over in
 * either direction.
 * @param {number} year - The year.
 * @param {number} month - The month (0-11).
 * @param {number} delta - The delta months to add.
 * @returns {MonthPosition} The resulting year and month.
 */
export function addMonths(year: number, month: number, delta: number): MonthPosition {
  const total = year * 12 + month + delta;
  return { year: Math.floor(total / 12), month: ((total % 12) + 12) % 12 };
}

/**
 * Whether every day of the given month falls outside `[min, max]` — not just the 1st, so a month that's only
 * partially in range (the common case right at a boundary) still counts as navigable.
 * @param {number} year - The year.
 * @param {number} month - The month (0-11).
 * @param {Date | null} min - The minimum date.
 * @param {Date | null} max - The maximum date.
 * @returns {boolean} True if month is out of range.
 */
export function isMonthOutOfRange(year: number, month: number, min: Date | null, max: Date | null): boolean {
  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);
  if (min && lastOfMonth < min) return true;
  if (max && firstOfMonth > max) return true;
  return false;
}

/** Same idea as `isMonthOutOfRange`, for the year-picker's own prev/next-year navigation.
 * @param {number} year - The year.
 * @param {Date | null} min - The minimum date.
 * @param {Date | null} max - The maximum date.
 * @returns {boolean} True if year is out of range.
 */
export function isYearOutOfRange(year: number, min: Date | null, max: Date | null): boolean {
  if (min && new Date(year, 11, 31) < min) return true;
  if (max && new Date(year, 0, 1) > max) return true;
  return false;
}

/** Narrow weekday labels in `locale`, ordered from `weekStart` (0 = Sunday … 6 = Saturday).
 * @param {string} locale - The locale string.
 * @param {number} weekStart - The week start day (0-6).
 * @returns {string[]} The weekday labels.
 */
export function getWeekdayLabels(locale: string, weekStart: number): string[] {
  const fmt = safeDateTimeFormat(locale, { weekday: 'narrow' });
  // Jan 4 2026 is a Sunday — use as reference
  const refSunday = new Date(2026, 0, 4);
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(refSunday);
    date.setDate(refSunday.getDate() + weekStart + i);
    return fmt.format(date);
  });
}
