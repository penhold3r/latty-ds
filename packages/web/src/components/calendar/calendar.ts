import { html, nothing, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ThemeableElement } from '../../base';
import '@latty-ds/icons';

import { calendarStyles } from './calendar.styles';
import type { CalendarDay, CalendarMode, CalendarWeekStart, CalendarLabels } from './calendar.types';
import { dispatch } from '../../utils';

const DEFAULT_LABELS: CalendarLabels = {
  today: 'Today',
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  previousYear: 'Previous year',
  nextYear: 'Next year',
  chooseMonthYear: (monthYear) => `${monthYear}, choose month and year`,
  weekNumberHeader: 'Wk',
  weekNumber: (week) => `Week ${week}`
};

// `Intl.Locale.prototype.getWeekInfo` isn't in this project's configured `lib` (adding it would pull in the
// unrelated, much larger Temporal proposal's ambient types via lib.esnext.intl.d.ts) — declare just the one
// method shape we actually use instead of widening the global lib for every package.
interface LocaleWithWeekInfo {
  getWeekInfo?(): { firstDay: number };
}

/**
 * The locale's own first day of the week (`getWeekInfo().firstDay` is 1 = Monday … 7 = Sunday per spec; `% 7`
 * converts it to this component's `Date#getDay()`-style convention, 0 = Sunday … 6 = Saturday). Falls back to
 * Sunday for an invalid locale string or a runtime with no `getWeekInfo` support.
 */
function deriveWeekStart(locale: string): CalendarWeekStart {
  try {
    const info = (new Intl.Locale(locale) as unknown as LocaleWithWeekInfo).getWeekInfo?.();
    if (info) return String(info.firstDay % 7) as CalendarWeekStart;
  } catch {
    // Invalid/unsupported locale string — Intl.Locale's constructor throws a RangeError for these.
  }
  return '0';
}

/**
 * The ISO 8601 week number (1-53) for the week containing `date`, computed off that week's Thursday — the day
 * ISO 8601 uses to decide which year (and so which week-1) a week spanning a year boundary belongs to. Shown
 * against each row's own first day regardless of `week-start`: like most calendar UIs that offer week numbers,
 * this component doesn't re-derive a locale-relative week numbering scheme, just the one standard everyone
 * recognizes.
 */
function getIsoWeekNumber(date: Date): number {
  const thursday = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const isoDayOfWeek = thursday.getUTCDay() || 7; // Sunday (0) becomes 7, so Monday=1..Sunday=7
  thursday.setUTCDate(thursday.getUTCDate() + 4 - isoDayOfWeek);
  const yearStart = new Date(Date.UTC(thursday.getUTCFullYear(), 0, 1));
  return Math.ceil(((thursday.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/**
 * A visual calendar grid for single-date or date-range selection.
 *
 * @element lt-calendar
 *
 * @fires {CustomEvent<{value: string} | {valueStart: string, valueEnd: string}>} change - Fired when a date is selected
 *   (mode="single", detail `{ value }`) or when a full range is selected (mode="range", detail `{ valueStart, valueEnd }`).
 * @fires {CustomEvent<{year: number, month: number}>} monthchange - Fired when the viewed month changes.
 *
 * @example
 * ```html
 * <lt-calendar value="2026-05-19"></lt-calendar>
 * ```
 *
 * @example
 * ```html
 * <lt-calendar mode="range" value-start="2026-05-10" value-end="2026-05-20"></lt-calendar>
 * ```
 *
 * @example
 * ```html
 * <lt-calendar locale="fr-FR" week-start="1" min="2026-01-01" max="2026-12-31"></lt-calendar>
 * ```
 */
@customElement('lt-calendar')
export class Calendar extends ThemeableElement {
  static styles = calendarStyles;

  /** Selection mode. "single" selects one date; "range" selects a start and end date. */
  @property({ reflect: true }) mode: CalendarMode = 'single';

  /** Selected date in ISO format (YYYY-MM-DD). Used in mode="single". */
  @property({ reflect: true }) value = '';

  /** Range start date in ISO format. Used in mode="range". */
  @property({ reflect: true, attribute: 'value-start' }) valueStart = '';

  /** Range end date in ISO format. Used in mode="range". */
  @property({ reflect: true, attribute: 'value-end' }) valueEnd = '';

  /** Minimum selectable date (ISO format). Dates before this are disabled. */
  @property({ reflect: true }) min = '';

  /** Maximum selectable date (ISO format). Dates after this are disabled. */
  @property({ reflect: true }) max = '';

  /** BCP 47 locale used for day and month names. */
  @property({ reflect: true }) locale = 'en-US';

  /**
   * First day of the week (0 = Sunday … 6 = Saturday). Defaults to whatever `locale` implies (via
   * `Intl.Locale#getWeekInfo`, falling back to Sunday) — set this explicitly only to override that.
   */
  @property({ attribute: 'week-start', reflect: true }) weekStart?: CalendarWeekStart;

  /** `weekStart` if explicitly set, otherwise derived from `locale`. Internal code should always read this, never `weekStart` directly. */
  private get _weekStart(): CalendarWeekStart {
    return this.weekStart ?? deriveWeekStart(this.locale);
  }

  /** Whether to render filler days from the previous and next month. */
  @property({ type: Boolean, attribute: 'show-outside-days', reflect: true }) showOutsideDays = true;

  /**
   * Whether to show each row's ISO 8601 week number in a leading column. The number itself isn't
   * locale/`week-start`-relative — it's the one standard numbering everyone recognizes, computed off each row's
   * own first visible day regardless of what day that is.
   * @default false
   */
  @property({ type: Boolean, attribute: 'show-week-numbers', reflect: true }) showWeekNumbers = false;

  /** Disables all interaction. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Number of month panels to display side-by-side. */
  @property({ type: Number, reflect: true }) months = 1;

  /**
   * Dates to disable beyond `min`/`max`: either an explicit array of Date objects, or a predicate called with
   * each candidate date (e.g. `(date) => date.getDay() === 0 || date.getDay() === 6` to disable every weekend) —
   * for a rule that would be impractical to enumerate as a fixed list. Set as a JS property (`.disabledDates`).
   * @default []
   */
  @property({ attribute: false }) disabledDates: Date[] | ((date: Date) => boolean) = [];

  /** Overridable UI text (nav button labels, the "Today" footer button, the month/year picker toggle), for i18n. English defaults — override only the keys you need. */
  @property({ type: Object }) labels: Partial<CalendarLabels> = {};

  private get _labels(): CalendarLabels {
    return { ...DEFAULT_LABELS, ...this.labels };
  }

  @state() private _viewYear = new Date().getFullYear();
  @state() private _viewMonth = new Date().getMonth();
  @state() private _focusedDate: Date | null = null;
  @state() private _hoverDate: Date | null = null;
  @state() private _pickingMonthYear = false;
  @state() private _pickerYear = new Date().getFullYear();

  override willUpdate(changed: PropertyValues<this>) {
    super.willUpdate(changed);
    if (changed.has('value') && this.value) {
      const d = this._parseDate(this.value);
      if (d) {
        this._viewYear = d.getFullYear();
        this._viewMonth = d.getMonth();
      }
    }
    if (changed.has('valueStart') && this.valueStart) {
      const d = this._parseDate(this.valueStart);
      if (d) {
        this._viewYear = d.getFullYear();
        this._viewMonth = d.getMonth();
      }
    }
    if (changed.has('months') && this.months > 1 && this._pickingMonthYear) {
      this._pickingMonthYear = false;
    }
  }

  /**
   * Whether every day of the given month falls outside `[min, max]` — not just the 1st, so a month that's only
   * partially in range (the common case right at a boundary) still counts as navigable.
   */
  private _isMonthOutOfRange(year: number, month: number): boolean {
    const firstOfMonth = new Date(year, month, 1);
    const lastOfMonth = new Date(year, month + 1, 0);
    if (this.min) {
      const min = this._parseDate(this.min);
      if (min && lastOfMonth < min) return true;
    }
    if (this.max) {
      const max = this._parseDate(this.max);
      if (max && firstOfMonth > max) return true;
    }
    return false;
  }

  /** Same idea as `_isMonthOutOfRange`, for the year-picker's own prev/next-year navigation. */
  private _isYearOutOfRange(year: number): boolean {
    if (this.min) {
      const min = this._parseDate(this.min);
      if (min && new Date(year, 11, 31) < min) return true;
    }
    if (this.max) {
      const max = this._parseDate(this.max);
      if (max && new Date(year, 0, 1) > max) return true;
    }
    return false;
  }

  private _monthAtOffset(offset: number): { year: number; month: number } {
    let m = this._viewMonth + offset;
    let y = this._viewYear;
    while (m > 11) {
      m -= 12;
      y++;
    }
    return { year: y, month: m };
  }

  private _parseDate(iso: string): Date | null {
    if (!iso) return null;
    // Append T00:00:00 to prevent UTC offset shifting the date
    const d = new Date(`${iso}T00:00:00`);
    return isNaN(d.getTime()) ? null : d;
  }

  private _toIso(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private _isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  private _isDisabled(date: Date): boolean {
    if (this.disabled) return true;
    if (this.min) {
      const min = this._parseDate(this.min);
      if (min && date < min) return true;
    }
    if (this.max) {
      const max = this._parseDate(this.max);
      if (max && date > max) return true;
    }
    return typeof this.disabledDates === 'function'
      ? this.disabledDates(date)
      : this.disabledDates.some((d) => this._isSameDay(d, date));
  }

  private _buildDays(year = this._viewYear, month = this._viewMonth): CalendarDay[] {
    const today = new Date();
    const selected = this._parseDate(this.value);
    const weekStart = Number(this._weekStart);

    const rangeStart = this.mode === 'range' ? this._parseDate(this.valueStart) : null;
    const rangeEnd = this.mode === 'range' ? this._parseDate(this.valueEnd) : null;

    // Hover preview: normalize so visHoverStart <= visHoverEnd
    let visHoverStart: Date | null = null;
    let visHoverEnd: Date | null = null;
    if (rangeStart && !rangeEnd && this._hoverDate) {
      if (this._hoverDate >= rangeStart) {
        visHoverStart = rangeStart;
        visHoverEnd = this._hoverDate;
      } else {
        visHoverStart = this._hoverDate;
        visHoverEnd = rangeStart;
      }
    }

    const firstOfMonth = new Date(year, month, 1);
    const lastOfMonth = new Date(year, month + 1, 0);

    const startOffset = (firstOfMonth.getDay() - weekStart + 7) % 7;
    const totalCurrent = startOffset + lastOfMonth.getDate();
    const endOffset = totalCurrent % 7 === 0 ? 0 : 7 - (totalCurrent % 7);

    const days: CalendarDay[] = [];

    const buildDay = (date: Date, isCurrentMonth: boolean): CalendarDay => {
      const isRangeStart = !!rangeStart && this._isSameDay(date, rangeStart);
      const isRangeEnd = !!rangeEnd && this._isSameDay(date, rangeEnd);
      const isInRange =
        !!rangeStart &&
        !!rangeEnd &&
        date > rangeStart &&
        date < rangeEnd &&
        !this._isSameDay(date, rangeStart) &&
        !this._isSameDay(date, rangeEnd);

      const isRangeHoverStart = !!visHoverStart && this._isSameDay(date, visHoverStart);
      const isRangeHoverEnd =
        !!visHoverEnd && !this._isSameDay(visHoverStart!, visHoverEnd) && this._isSameDay(date, visHoverEnd);
      const isInHoverRange = !!visHoverStart && !!visHoverEnd && date > visHoverStart && date < visHoverEnd;

      return {
        date,
        isCurrentMonth,
        isToday: this._isSameDay(date, today),
        isSelected: this.mode === 'single' && selected ? this._isSameDay(date, selected) : false,
        isDisabled: this._isDisabled(date),
        isRangeStart,
        isRangeEnd,
        isInRange,
        isRangeHoverStart,
        isRangeHoverEnd,
        isInHoverRange
      };
    };

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

  private _getWeekdayLabels(): string[] {
    const weekStart = Number(this._weekStart);
    const fmt = new Intl.DateTimeFormat(this.locale, { weekday: 'narrow' });
    // Jan 4 2026 is a Sunday — use as reference
    const refSunday = new Date(2026, 0, 4);
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(refSunday);
      date.setDate(refSunday.getDate() + weekStart + i);
      return fmt.format(date);
    });
  }

  /**
   * Whether navigating the month view by `delta` months would land on a view with at least one in-range day. In
   * multi-month layout, navigating shifts every panel by one month — the relevant boundary is whichever edge
   * panel moves further from what's already visible: the new base month going backward, or the last panel
   * (base + months - 1) going forward. For `months === 1` both reduce to the same single month either way.
   */
  private _canNavigateMonth(delta: number): boolean {
    let month = this._viewMonth + delta;
    let year = this._viewYear;
    while (month < 0) {
      month += 12;
      year--;
    }
    while (month > 11) {
      month -= 12;
      year++;
    }

    let edgeMonth = delta < 0 ? month : month + (this.months - 1);
    let edgeYear = year;
    while (edgeMonth > 11) {
      edgeMonth -= 12;
      edgeYear++;
    }
    return !this._isMonthOutOfRange(edgeYear, edgeMonth);
  }

  /** Same idea as `_canNavigateMonth`, for the year-picker's own prev/next-year buttons. */
  private _canNavigateYear(delta: number): boolean {
    return !this._isYearOutOfRange(this._pickerYear + delta);
  }

  private _navigate(delta: number) {
    if (this._pickingMonthYear) {
      if (!this._canNavigateYear(delta)) return;
      this._pickerYear += delta;
      return;
    }

    // Guarded here too, not just on the rendered buttons' `disabled` attribute, since PageUp/PageDown calls this
    // directly from the keyboard.
    if (!this._canNavigateMonth(delta)) return;

    let month = this._viewMonth + delta;
    let year = this._viewYear;
    while (month < 0) {
      month += 12;
      year--;
    }
    while (month > 11) {
      month -= 12;
      year++;
    }

    this._viewMonth = month;
    this._viewYear = year;
    this._focusedDate = null;
    dispatch(this, 'monthchange', { year: this._viewYear, month: this._viewMonth });
  }

  private _openPicker() {
    this._pickerYear = this._viewYear;
    this._pickingMonthYear = true;
  }

  private _closePicker() {
    this._pickingMonthYear = false;
  }

  private _selectPickerMonth(month: number) {
    this._viewYear = this._pickerYear;
    this._viewMonth = month;
    this._pickingMonthYear = false;
    this._focusedDate = null;
    dispatch(this, 'monthchange', { year: this._viewYear, month: this._viewMonth });
  }

  private _selectDay(day: CalendarDay) {
    if (day.isDisabled || this.disabled) return;

    if (!day.isCurrentMonth) {
      this._viewMonth = day.date.getMonth();
      this._viewYear = day.date.getFullYear();
    }

    if (this.mode === 'range') {
      const iso = this._toIso(day.date);
      const hasStart = !!this.valueStart;
      const hasEnd = !!this.valueEnd;

      if (!hasStart || hasEnd) {
        // Begin a new range selection
        this.valueStart = iso;
        this.valueEnd = '';
        this._hoverDate = null;
      } else {
        const startDate = this._parseDate(this.valueStart)!;
        if (this._isSameDay(day.date, startDate)) {
          // Clicked same day as start — clear
          this.valueStart = '';
        } else if (day.date < startDate) {
          // Clicked before start — swap
          this.valueEnd = this.valueStart;
          this.valueStart = iso;
        } else {
          this.valueEnd = iso;
        }

        if (this.valueStart && this.valueEnd) {
          dispatch(this, 'change', { valueStart: this.valueStart, valueEnd: this.valueEnd });
        }
      }
      this._focusedDate = day.date;
      return;
    }

    const iso = this._toIso(day.date);
    this.value = iso;
    this._focusedDate = day.date;
    dispatch(this, 'change', { value: iso });
  }

  private _goToToday() {
    const today = new Date();
    if (this._isMonthOutOfRange(today.getFullYear(), today.getMonth())) return;
    this._viewYear = today.getFullYear();
    this._viewMonth = today.getMonth();
    this._focusedDate = null;
    this._pickingMonthYear = false;
  }

  private _dayAriaLabel(date: Date): string {
    return new Intl.DateTimeFormat(this.locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }

  private _focusCell(iso: string) {
    this.updateComplete.then(() => {
      const target = this.shadowRoot?.querySelector<HTMLButtonElement>(`[data-date="${iso}"]`);
      target?.focus();
    });
  }

  private _handleCalendarKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this._pickingMonthYear) {
      e.stopPropagation();
      this._closePicker();
    }
  };

  private _handleGridMouseOver = (e: MouseEvent) => {
    if (this.mode !== 'range' || this.valueEnd) return;
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-date]');
    if (btn?.dataset.date) {
      const d = this._parseDate(btn.dataset.date);
      if (d && (!this._hoverDate || !this._isSameDay(d, this._hoverDate))) {
        this._hoverDate = d;
      }
    }
  };

  private _handleGridMouseLeave = () => {
    if (this.mode === 'range') this._hoverDate = null;
  };

  private _handleKeyDown = (e: KeyboardEvent) => {
    // The event's own target — the cell that's actually focused — not re-derived state, which can point
    // somewhere else entirely (e.g. today's date, while the cell that's really focused, and rendered as the
    // roving tab stop, is the 1st of whatever month is in view).
    const currentIso = (e.currentTarget as HTMLElement).dataset.date ?? '';
    const focusedDate = this._parseDate(currentIso) ?? new Date(this._viewYear, this._viewMonth, 1);
    const next = new Date(focusedDate);
    const weekStart = Number(this._weekStart);

    switch (e.key) {
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
      case 'PageUp':
        e.preventDefault();
        this._navigate(-1);
        return;
      case 'PageDown':
        e.preventDefault();
        this._navigate(1);
        return;
      case 'Enter':
      case ' ': {
        e.preventDefault();
        const days = this._buildDays();
        const day = days.find((d) => this._isSameDay(d.date, focusedDate));
        if (day && !day.isDisabled) this._selectDay(day);
        return;
      }
      default:
        return;
    }

    e.preventDefault();

    if (next.getFullYear() !== this._viewYear || next.getMonth() !== this._viewMonth) {
      this._viewYear = next.getFullYear();
      this._viewMonth = next.getMonth();
    }

    this._focusedDate = next;
    this._focusCell(this._toIso(next));
  };

  private _renderDay(day: CalendarDay, rovingDate: Date) {
    if (!day.isCurrentMonth && !this.showOutsideDays) {
      return html`<div role="gridcell" aria-hidden="true" class="day day--empty"></div>`;
    }

    const isRangeLeft = day.isRangeStart || day.isRangeHoverStart;
    const isRangeRight = day.isRangeEnd || day.isRangeHoverEnd;
    const isRangeConfirmed = day.isRangeStart || day.isRangeEnd;
    const isRangeHoverPoint = !isRangeConfirmed && (day.isRangeHoverStart || day.isRangeHoverEnd);

    const classes = [
      'day',
      !day.isCurrentMonth ? 'day--outside' : '',
      day.isToday ? 'day--today' : '',
      day.isSelected ? 'day--selected' : '',
      isRangeLeft ? 'day--range-left' : '',
      isRangeRight ? 'day--range-right' : '',
      isRangeConfirmed ? 'day--range-confirmed' : '',
      isRangeHoverPoint ? 'day--range-hover' : '',
      day.isInRange ? 'day--in-range' : '',
      day.isInHoverRange ? 'day--in-hover-range' : ''
    ]
      .filter(Boolean)
      .join(' ');

    const iso = this._toIso(day.date);
    const isSelected = day.isSelected || day.isRangeStart || day.isRangeEnd;

    return html`
      <button
        role="gridcell"
        class=${classes}
        data-date=${iso}
        aria-disabled=${day.isDisabled ? 'true' : nothing}
        aria-selected=${isSelected ? 'true' : 'false'}
        aria-label=${this._dayAriaLabel(day.date)}
        tabindex=${this._isSameDay(day.date, rovingDate) ? 0 : -1}
        @click=${() => this._selectDay(day)}
        @keydown=${this._handleKeyDown}
      >
        <span class="day__inner">${day.date.getDate()}</span>
      </button>
    `;
  }

  private _renderMonthGrid(year: number, month: number, gridLabel: string, rovingDate: Date) {
    const days = this._buildDays(year, month);
    const weekdayLabels = this._getWeekdayLabels();
    const weeks: CalendarDay[][] = [];
    for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

    return html`
      <div class="month-grid">
        <div class="weekdays" aria-hidden="true">
          ${this.showWeekNumbers
            ? html`<div class="weekday week-number">${this._labels.weekNumberHeader}</div>`
            : nothing}
          ${weekdayLabels.map((label) => html`<div class="weekday">${label}</div>`)}
        </div>
        <div
          class="grid"
          role="grid"
          aria-label="${gridLabel}"
          @mouseover=${this._handleGridMouseOver}
          @mouseleave=${this._handleGridMouseLeave}
        >
          ${weeks.map((week) => {
            // week[3] — the row's middle day — not week[0], its first: ISO weeks run Monday-Sunday, so for any
            // week-start other than Monday, a row's first day can belong to a different ISO week than most of
            // its other six days (e.g. a Sunday-start row spanning Sun Oct 11 - Sat Oct 17 2026 is 6/7 ISO week
            // 42, with only that leading Sunday itself still counted in week 41 — using day 0 would mislabel the
            // whole row "41"). The middle day of any 7 consecutive days is mathematically guaranteed to fall in
            // whichever ISO week has the most days in that row, matching what a reader scanning the row expects.
            const weekNumber = getIsoWeekNumber(week[3].date);
            return html`
              <div role="row">
                ${this.showWeekNumbers
                  ? html`<div class="week-number" role="rowheader" aria-label=${this._labels.weekNumber(weekNumber)}>
                      ${weekNumber}
                    </div>`
                  : nothing}
                ${week.map((day) => this._renderDay(day, rovingDate))}
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }

  render() {
    const today = new Date();
    const isMulti = this.months > 1;

    // A candidate for the roving tab stop only counts if it actually falls in one of the visible months —
    // otherwise no rendered cell matches it and nothing ends up as a Tab stop at all (e.g. the selected date's
    // month has been paged away from).
    const isInView = (date: Date): boolean => {
      if (!isMulti) return date.getFullYear() === this._viewYear && date.getMonth() === this._viewMonth;
      for (let i = 0; i < this.months; i++) {
        const { year, month } = this._monthAtOffset(i);
        if (date.getFullYear() === year && date.getMonth() === month) return true;
      }
      return false;
    };

    // Roving tabindex anchor — shared across all panels
    const rovingAnchor = this._parseDate(this.mode === 'range' ? this.valueStart : this.value);
    const rovingDate =
      (this._focusedDate && isInView(this._focusedDate) ? this._focusedDate : null) ??
      (rovingAnchor && isInView(rovingAnchor) ? rovingAnchor : null) ??
      (today.getFullYear() === this._viewYear && today.getMonth() === this._viewMonth ? today : null) ??
      new Date(this._viewYear, this._viewMonth, 1);

    const footer = html`
      <div class="footer">
        <button
          class="today-btn"
          ?disabled=${this.disabled || this._isMonthOutOfRange(today.getFullYear(), today.getMonth())}
          @click=${this._goToToday}
        >
          ${this._labels.today}
        </button>
      </div>
    `;

    // ── Multi-month layout ──────────────────────────────────────────────
    if (isMulti) {
      const panelLabels = Array.from({ length: this.months }, (_, i) => {
        const { year, month } = this._monthAtOffset(i);
        return new Intl.DateTimeFormat(this.locale, { month: 'long', year: 'numeric' }).format(new Date(year, month));
      });

      return html`
        <div class="calendar calendar--multi" part="base" @keydown=${this._handleCalendarKeyDown}>
          <div class="header">
            <button
              class="nav-btn"
              aria-label=${this._labels.previousMonth}
              ?disabled=${this.disabled || !this._canNavigateMonth(-1)}
              @click=${() => this._navigate(-1)}
            >
              <lt-icon name="arrow-left" size="sm"></lt-icon>
            </button>
            <div class="month-label-row">
              ${panelLabels.map(
                (label, i) =>
                  html`<span class="month-label" aria-live=${i === 0 ? 'polite' : 'off'} aria-atomic="true"
                    >${label}</span
                  >`
              )}
            </div>
            <button
              class="nav-btn"
              aria-label=${this._labels.nextMonth}
              ?disabled=${this.disabled || !this._canNavigateMonth(1)}
              @click=${() => this._navigate(1)}
            >
              <lt-icon name="arrow-right" size="sm"></lt-icon>
            </button>
          </div>
          <div class="month-panels">
            ${Array.from(
              { length: this.months },
              (_, i) => html`
                <div class="month-col">
                  ${this._renderMonthGrid(
                    this._monthAtOffset(i).year,
                    this._monthAtOffset(i).month,
                    panelLabels[i],
                    rovingDate
                  )}
                </div>
              `
            )}
          </div>
          ${footer}
        </div>
      `;
    }

    // ── Single-month layout ─────────────────────────────────────────────
    const monthLabel = new Intl.DateTimeFormat(this.locale, { month: 'long', year: 'numeric' }).format(
      new Date(this._viewYear, this._viewMonth)
    );
    const prevLabel = this._pickingMonthYear ? this._labels.previousYear : this._labels.previousMonth;
    const nextLabel = this._pickingMonthYear ? this._labels.nextYear : this._labels.nextMonth;
    const canNavigatePrev = this._pickingMonthYear ? this._canNavigateYear(-1) : this._canNavigateMonth(-1);
    const canNavigateNext = this._pickingMonthYear ? this._canNavigateYear(1) : this._canNavigateMonth(1);
    // WCAG 2.5.3 Label in Name: the visible text (a live-updating month/year) has to be part of the accessible
    // name, not replaced by it — otherwise a speech-input user saying what they see on the button can't match it.
    const monthYearVisibleText = this._pickingMonthYear ? String(this._pickerYear) : monthLabel;

    const header = html`
      <div class="header">
        <button
          class="nav-btn"
          aria-label=${prevLabel}
          ?disabled=${this.disabled || !canNavigatePrev}
          @click=${() => this._navigate(-1)}
        >
          <lt-icon name="arrow-left" size="sm"></lt-icon>
        </button>
        <button
          class="month-label-btn ${this._pickingMonthYear ? 'month-label-btn--open' : ''}"
          aria-expanded=${this._pickingMonthYear ? 'true' : 'false'}
          aria-label=${this._labels.chooseMonthYear(monthYearVisibleText)}
          ?disabled=${this.disabled}
          @click=${() => (this._pickingMonthYear ? this._closePicker() : this._openPicker())}
        >
          <span aria-live="polite" aria-atomic="true">${monthYearVisibleText}</span>
          <lt-icon name="arrow-down" size="sm" class="picker-chevron"></lt-icon>
        </button>
        <button
          class="nav-btn"
          aria-label=${nextLabel}
          ?disabled=${this.disabled || !canNavigateNext}
          @click=${() => this._navigate(1)}
        >
          <lt-icon name="arrow-right" size="sm"></lt-icon>
        </button>
      </div>
    `;

    const pickerBody = this._pickingMonthYear
      ? html`
          <div class="picker-months">
            ${Array.from({ length: 12 }, (_, i) => {
              const label = new Intl.DateTimeFormat(this.locale, { month: 'short' }).format(
                new Date(this._pickerYear, i)
              );
              const isCurrent = i === this._viewMonth && this._pickerYear === this._viewYear;
              return html`
                <button
                  class="picker-month-btn ${isCurrent ? 'picker-month-btn--current' : ''}"
                  ?disabled=${this.disabled || this._isMonthOutOfRange(this._pickerYear, i)}
                  @click=${() => this._selectPickerMonth(i)}
                >
                  ${label}
                </button>
              `;
            })}
          </div>
        `
      : this._renderMonthGrid(this._viewYear, this._viewMonth, monthLabel, rovingDate);

    return html`
      <div class="calendar" part="base" @keydown=${this._handleCalendarKeyDown}>${header} ${pickerBody} ${footer}</div>
    `;
  }
}
