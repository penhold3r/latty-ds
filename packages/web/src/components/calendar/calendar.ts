import { html, nothing, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ThemeableElement } from '../../base';
import '@latty-ds/icons/arrow-down';
import '@latty-ds/icons/arrow-left';
import '@latty-ds/icons/arrow-right';
import '../icon-button/icon-button';
import '../button/button';

import { calendarStyles } from './calendar.styles';
import type {
  CalendarDay,
  CalendarMode,
  CalendarWeekStart,
  CalendarLabels,
  CalendarPreset,
  CalendarDisabledDates
} from './calendar.types';
import { dispatch } from '../../utils';
import {
  deriveWeekStart,
  safeDateTimeFormat,
  getIsoWeekNumber,
  parseIsoDate,
  toIsoDate,
  isSameDay,
  addMonths,
  isMonthOutOfRange,
  getWeekdayLabels
} from './calendar-date';
import { buildCalendarDays, groupDaysIntoWeeks, selectRangeDate, normalizeRange } from './calendar-grid';
import { canNavigateMonth, canNavigateYear, isDateInView, getArrowFocusDate } from './calendar-navigation';

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

/**
 * A visual calendar grid for single-date or date-range selection.
 * @element lt-calendar
 * @fires {CustomEvent<{value: string} | {valueStart: string, valueEnd: string}>} change - Fired when a date is selected
 *   (mode="single", detail `{ value }`) or when a full range is selected (mode="range", detail `{ valueStart, valueEnd }`).
 * @fires {CustomEvent<{year: number, month: number}>} monthchange - Fired when the viewed month changes.
 * @example
 * ```html
 * <lt-calendar value="2026-05-19"></lt-calendar>
 * ```
 * @example
 * ```html
 * <lt-calendar mode="range" value-start="2026-05-10" value-end="2026-05-20"></lt-calendar>
 * ```
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

  /** `weekStart` if explicitly set, otherwise derived from `locale`. Internal code should always read this, never `weekStart` directly.
   * @returns {CalendarWeekStart} The week start day.
   */
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
  @property({ attribute: false }) disabledDates: CalendarDisabledDates = [];

  /** Overridable UI text (nav button labels, the "Today" footer button, the month/year picker toggle), for i18n. English defaults — override only the keys you need. */
  @property({ type: Object }) labels: Partial<CalendarLabels> = {};

  /**
   * Quick-select range buttons shown as a sidebar column (mode="range" only) — e.g. "Last 7 days", "This month".
   * Each preset's own label text is supplied by the consumer, not through `labels`: unlike the rest of this
   * component's UI text, presets have no fixed, enumerable set of i18n keys to override. Set as a JS property.
   * @default []
   */
  @property({ attribute: false }) presets: CalendarPreset[] = [];

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
      const d = parseIsoDate(this.value);
      if (d) {
        this._viewYear = d.getFullYear();
        this._viewMonth = d.getMonth();
      }
    }
    if (changed.has('valueStart') && this.valueStart) {
      const d = parseIsoDate(this.valueStart);
      if (d) {
        this._viewYear = d.getFullYear();
        this._viewMonth = d.getMonth();
      }
    }
    if (changed.has('months') && this.months > 1 && this._pickingMonthYear) {
      this._pickingMonthYear = false;
    }
  }

  /** Parsed `min`, or `null` when unset/invalid.
   * @returns {Date | null} The parsed min date.
   */
  private get _minDate(): Date | null {
    return parseIsoDate(this.min);
  }

  /** Parsed `max`, or `null` when unset/invalid.
   * @returns {Date | null} The parsed max date.
   */
  private get _maxDate(): Date | null {
    return parseIsoDate(this.max);
  }

  private _isDisabled(date: Date): boolean {
    if (this.disabled) return true;
    const min = this._minDate;
    if (min && date < min) return true;
    const max = this._maxDate;
    if (max && date > max) return true;
    return typeof this.disabledDates === 'function'
      ? this.disabledDates(date)
      : this.disabledDates.some((d) => isSameDay(d, date));
  }

  private _buildDays(year = this._viewYear, month = this._viewMonth): CalendarDay[] {
    return buildCalendarDays({
      year,
      month,
      weekStart: Number(this._weekStart),
      mode: this.mode,
      selectedDate: parseIsoDate(this.value),
      rangeStart: this.mode === 'range' ? parseIsoDate(this.valueStart) : null,
      rangeEnd: this.mode === 'range' ? parseIsoDate(this.valueEnd) : null,
      hoverDate: this._hoverDate,
      today: new Date(),
      isDisabled: (date) => this._isDisabled(date)
    });
  }

  private _navigate(delta: number) {
    if (this._pickingMonthYear) {
      if (!canNavigateYear(this._pickerYear, delta, this._minDate, this._maxDate)) return;
      this._pickerYear += delta;
      return;
    }

    /*
     * Guarded here too, not just on the rendered buttons' `disabled` attribute, since PageUp/PageDown calls this
     * directly from the keyboard.
     */
    if (!canNavigateMonth(this._viewYear, this._viewMonth, this.months, delta, this._minDate, this._maxDate)) return;

    const next = addMonths(this._viewYear, this._viewMonth, delta);
    this._viewYear = next.year;
    this._viewMonth = next.month;
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
      const current = { valueStart: this.valueStart, valueEnd: this.valueEnd };
      const next = selectRangeDate(current, day.date);
      const startingNew = !current.valueStart || !!current.valueEnd;

      this.valueStart = next.valueStart;
      this.valueEnd = next.valueEnd;
      if (startingNew) this._hoverDate = null;

      if (this.valueStart && this.valueEnd) {
        dispatch(this, 'change', { valueStart: this.valueStart, valueEnd: this.valueEnd });
      }
      this._focusedDate = day.date;
      return;
    }

    const iso = toIsoDate(day.date);
    this.value = iso;
    this._focusedDate = day.date;
    dispatch(this, 'change', { value: iso });
  }

  private _selectPreset(preset: CalendarPreset) {
    const [a, b] = preset.getRange();
    const { start, end } = normalizeRange(a, b);
    this.valueStart = toIsoDate(start);
    this.valueEnd = toIsoDate(end);
    this._hoverDate = null;
    this._focusedDate = start;
    dispatch(this, 'change', { valueStart: this.valueStart, valueEnd: this.valueEnd });
  }

  private _goToToday() {
    const today = new Date();
    if (isMonthOutOfRange(today.getFullYear(), today.getMonth(), this._minDate, this._maxDate)) return;
    this._viewYear = today.getFullYear();
    this._viewMonth = today.getMonth();
    this._focusedDate = null;
    this._pickingMonthYear = false;
  }

  private _dayAriaLabel(date: Date): string {
    return safeDateTimeFormat(this.locale, {
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
      const d = parseIsoDate(btn.dataset.date);
      if (d && (!this._hoverDate || !isSameDay(d, this._hoverDate))) {
        this._hoverDate = d;
      }
    }
  };

  private _handleGridMouseLeave = () => {
    if (this.mode === 'range') this._hoverDate = null;
  };

  private _handleKeyDown = (e: KeyboardEvent) => {
    /*
     * The event's own target — the cell that's actually focused — not re-derived state, which can point
     * somewhere else entirely (e.g. today's date, while the cell that's really focused, and rendered as the
     * roving tab stop, is the 1st of whatever month is in view).
     */
    const currentIso = (e.currentTarget as HTMLElement).dataset.date ?? '';
    const focusedDate = parseIsoDate(currentIso) ?? new Date(this._viewYear, this._viewMonth, 1);

    if (e.key === 'PageUp' || e.key === 'PageDown') {
      e.preventDefault();
      this._navigate(e.key === 'PageUp' ? -1 : 1);
      return;
    }

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const day = this._buildDays().find((d) => isSameDay(d.date, focusedDate));
      if (day && !day.isDisabled) this._selectDay(day);
      return;
    }

    const next = getArrowFocusDate(focusedDate, e.key, Number(this._weekStart));
    if (!next) return;

    e.preventDefault();

    if (next.getFullYear() !== this._viewYear || next.getMonth() !== this._viewMonth) {
      this._viewYear = next.getFullYear();
      this._viewMonth = next.getMonth();
    }

    this._focusedDate = next;
    this._focusCell(toIsoDate(next));
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

    const iso = toIsoDate(day.date);
    const isSelected = day.isSelected || day.isRangeStart || day.isRangeEnd;

    return html`
      <button
        role="gridcell"
        class=${classes}
        data-date=${iso}
        aria-disabled=${day.isDisabled ? 'true' : nothing}
        aria-selected=${isSelected ? 'true' : 'false'}
        aria-label=${this._dayAriaLabel(day.date)}
        tabindex=${isSameDay(day.date, rovingDate) ? 0 : -1}
        @click=${() => this._selectDay(day)}
        @keydown=${this._handleKeyDown}
      >
        <span class="day__inner">${day.date.getDate()}</span>
      </button>
    `;
  }

  private _renderMonthGrid(year: number, month: number, gridLabel: string, rovingDate: Date) {
    const days = this._buildDays(year, month);
    const weekdayLabels = getWeekdayLabels(this.locale, Number(this._weekStart));
    const weeks = groupDaysIntoWeeks(days);

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
            /*
             * week[3] — the row's middle day — not week[0], its first: ISO weeks run Monday-Sunday, so for any
             * week-start other than Monday, a row's first day can belong to a different ISO week than most of
             * its other six days (e.g. a Sunday-start row spanning Sun Oct 11 - Sat Oct 17 2026 is 6/7 ISO week
             * 42, with only that leading Sunday itself still counted in week 41 — using day 0 would mislabel the
             * whole row "41"). The middle day of any 7 consecutive days is mathematically guaranteed to fall in
             * whichever ISO week has the most days in that row, matching what a reader scanning the row expects.
             */
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

    /*
     * A candidate for the roving tab stop only counts if it actually falls in one of the visible months —
     * otherwise no rendered cell matches it and nothing ends up as a Tab stop at all (e.g. the selected date's
     * month has been paged away from).
     */
    const isInView = (date: Date): boolean => isDateInView(date, this._viewYear, this._viewMonth, this.months);

    // Roving tabindex anchor — shared across all panels
    const rovingAnchor = parseIsoDate(this.mode === 'range' ? this.valueStart : this.value);
    const rovingDate =
      (this._focusedDate && isInView(this._focusedDate) ? this._focusedDate : null) ??
      (rovingAnchor && isInView(rovingAnchor) ? rovingAnchor : null) ??
      (today.getFullYear() === this._viewYear && today.getMonth() === this._viewMonth ? today : null) ??
      new Date(this._viewYear, this._viewMonth, 1);

    const footer = html`
      <div class="footer">
        <lt-button
          class="today-btn"
          appearance="outlined"
          variant="neutral"
          size="sm"
          ?disabled=${this.disabled ||
          isMonthOutOfRange(today.getFullYear(), today.getMonth(), this._minDate, this._maxDate)}
          @click=${this._goToToday}
        >
          ${this._labels.today}
        </lt-button>
      </div>
    `;

    const hasPresets = this.mode === 'range' && this.presets.length > 0;
    const presetsPanel = hasPresets
      ? html`
          <div class="presets">
            ${this.presets.map(
              (preset) => html`
                <button class="preset-btn" ?disabled=${this.disabled} @click=${() => this._selectPreset(preset)}>
                  ${preset.label}
                </button>
              `
            )}
          </div>
        `
      : nothing;

    // ── Multi-month layout ──────────────────────────────────────────────
    if (isMulti) {
      const panelLabels = Array.from({ length: this.months }, (_, i) => {
        const { year, month } = addMonths(this._viewYear, this._viewMonth, i);
        return safeDateTimeFormat(this.locale, { month: 'long', year: 'numeric' }).format(new Date(year, month));
      });

      return html`
        <div
          class="calendar calendar--multi ${hasPresets ? 'calendar--with-presets' : ''}"
          part="base"
          @keydown=${this._handleCalendarKeyDown}
        >
          ${presetsPanel}
          <div class="calendar-body">
            <div class="header">
              <lt-icon-button
                class="nav-btn"
                icon="arrow-left"
                label=${this._labels.previousMonth}
                size="sm"
                ?disabled=${this.disabled ||
                !canNavigateMonth(this._viewYear, this._viewMonth, this.months, -1, this._minDate, this._maxDate)}
                @click=${() => this._navigate(-1)}
              ></lt-icon-button>
              <div class="month-label-row">
                ${panelLabels.map(
                  (label, i) =>
                    html`<span class="month-label" aria-live=${i === 0 ? 'polite' : 'off'} aria-atomic="true"
                      >${label}</span
                    >`
                )}
              </div>
              <lt-icon-button
                class="nav-btn"
                icon="arrow-right"
                label=${this._labels.nextMonth}
                size="sm"
                ?disabled=${this.disabled ||
                !canNavigateMonth(this._viewYear, this._viewMonth, this.months, 1, this._minDate, this._maxDate)}
                @click=${() => this._navigate(1)}
              ></lt-icon-button>
            </div>
            <div class="month-panels">
              ${Array.from(
                { length: this.months },
                (_, i) => html`
                  <div class="month-col">
                    ${this._renderMonthGrid(
                      addMonths(this._viewYear, this._viewMonth, i).year,
                      addMonths(this._viewYear, this._viewMonth, i).month,
                      panelLabels[i],
                      rovingDate
                    )}
                  </div>
                `
              )}
            </div>
            ${footer}
          </div>
        </div>
      `;
    }

    // ── Single-month layout ─────────────────────────────────────────────
    const monthLabel = safeDateTimeFormat(this.locale, { month: 'long', year: 'numeric' }).format(
      new Date(this._viewYear, this._viewMonth)
    );
    const prevLabel = this._pickingMonthYear ? this._labels.previousYear : this._labels.previousMonth;
    const nextLabel = this._pickingMonthYear ? this._labels.nextYear : this._labels.nextMonth;
    const canNavigatePrev = this._pickingMonthYear
      ? canNavigateYear(this._pickerYear, -1, this._minDate, this._maxDate)
      : canNavigateMonth(this._viewYear, this._viewMonth, this.months, -1, this._minDate, this._maxDate);
    const canNavigateNext = this._pickingMonthYear
      ? canNavigateYear(this._pickerYear, 1, this._minDate, this._maxDate)
      : canNavigateMonth(this._viewYear, this._viewMonth, this.months, 1, this._minDate, this._maxDate);
    /*
     * WCAG 2.5.3 Label in Name: the visible text (a live-updating month/year) has to be part of the accessible
     * name, not replaced by it — otherwise a speech-input user saying what they see on the button can't match it.
     */
    const monthYearVisibleText = this._pickingMonthYear ? String(this._pickerYear) : monthLabel;

    const header = html`
      <div class="header">
        <lt-icon-button
          class="nav-btn"
          icon="arrow-left"
          label=${prevLabel}
          size="sm"
          ?disabled=${this.disabled || !canNavigatePrev}
          @click=${() => this._navigate(-1)}
        ></lt-icon-button>
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
        <lt-icon-button
          class="nav-btn"
          icon="arrow-right"
          label=${nextLabel}
          size="sm"
          ?disabled=${this.disabled || !canNavigateNext}
          @click=${() => this._navigate(1)}
        ></lt-icon-button>
      </div>
    `;

    const pickerBody = this._pickingMonthYear
      ? html`
          <div class="picker-months">
            ${Array.from({ length: 12 }, (_, i) => {
              const label = safeDateTimeFormat(this.locale, { month: 'short' }).format(new Date(this._pickerYear, i));
              const isCurrent = i === this._viewMonth && this._pickerYear === this._viewYear;
              return html`
                <button
                  class="picker-month-btn ${isCurrent ? 'picker-month-btn--current' : ''}"
                  ?disabled=${this.disabled || isMonthOutOfRange(this._pickerYear, i, this._minDate, this._maxDate)}
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
      <div
        class="calendar ${hasPresets ? 'calendar--with-presets' : ''}"
        part="base"
        @keydown=${this._handleCalendarKeyDown}
      >
        ${presetsPanel}
        <div class="calendar-body">${header} ${pickerBody} ${footer}</div>
      </div>
    `;
  }
}
