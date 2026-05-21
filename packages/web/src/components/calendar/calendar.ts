import { html, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ThemeableElement } from '../../base';
import '@latty/icons';

import { calendarStyles } from './calendar.styles';
import type { CalendarDay, CalendarMode, CalendarWeekStart } from './calendar.types';
import { dispatch } from '../../utils';

/**
 * A visual calendar grid for single-date or date-range selection.
 *
 * @element lt-calendar
 *
 * @fires {CustomEvent<{value: string}>} lt-change - Fired when a single date is selected (mode="single").
 * @fires {CustomEvent<{valueStart: string, valueEnd: string}>} lt-change - Fired when a full range is selected (mode="range").
 * @fires {CustomEvent<{year: number, month: number}>} lt-month-change - Fired when the viewed month changes.
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

  /** First day of the week. 0 = Sunday, 1 = Monday. */
  @property({ attribute: 'week-start', reflect: true }) weekStart: CalendarWeekStart = '0';

  /** Whether to render filler days from the previous and next month. */
  @property({ type: Boolean, attribute: 'show-outside-days', reflect: true }) showOutsideDays = true;

  /** Disables all interaction. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Number of month panels to display side-by-side. */
  @property({ type: Number, reflect: true }) months = 1;

  /** Specific dates to disable, as an array of Date objects. Not reflected as an attribute. */
  disabledDates: Date[] = [];

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
    return this.disabledDates.some((d) => this._isSameDay(d, date));
  }

  private _buildDays(year = this._viewYear, month = this._viewMonth): CalendarDay[] {
    const today = new Date();
    const selected = this._parseDate(this.value);
    const weekStart = Number(this.weekStart);

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
    const weekStart = Number(this.weekStart);
    const fmt = new Intl.DateTimeFormat(this.locale, { weekday: 'narrow' });
    // Jan 4 2026 is a Sunday — use as reference
    const refSunday = new Date(2026, 0, 4);
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(refSunday);
      date.setDate(refSunday.getDate() + weekStart + i);
      return fmt.format(date);
    });
  }

  private _navigate(delta: number) {
    if (this._pickingMonthYear) {
      this._pickerYear += delta;
      return;
    }
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
    dispatch(this, 'lt-month-change', { year: this._viewYear, month: this._viewMonth });
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
    dispatch(this, 'lt-month-change', { year: this._viewYear, month: this._viewMonth });
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
          dispatch(this, 'lt-change', { valueStart: this.valueStart, valueEnd: this.valueEnd });
        }
      }
      this._focusedDate = day.date;
      return;
    }

    const iso = this._toIso(day.date);
    this.value = iso;
    this._focusedDate = day.date;
    dispatch(this, 'lt-change', { value: iso });
  }

  private _goToToday() {
    const today = new Date();
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
    const today = new Date();
    const focusedDate =
      this._focusedDate ??
      this._parseDate(this.value) ??
      new Date(this._viewYear, this._viewMonth, today.getDate() || 1);
    const next = new Date(focusedDate);
    const weekStart = Number(this.weekStart);

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
        ?disabled=${day.isDisabled}
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
      <div class="weekdays" aria-hidden="true">
        ${weekdayLabels.map((label) => html`<div class="weekday">${label}</div>`)}
      </div>
      <div
        class="grid"
        role="grid"
        aria-label="${gridLabel}"
        @mouseover=${this._handleGridMouseOver}
        @mouseleave=${this._handleGridMouseLeave}
      >
        ${weeks.map((week) => html` <div role="row">${week.map((day) => this._renderDay(day, rovingDate))}</div> `)}
      </div>
    `;
  }

  render() {
    const today = new Date();
    const isMulti = this.months > 1;

    // Roving tabindex anchor — shared across all panels
    const rovingAnchor = this._parseDate(this.mode === 'range' ? this.valueStart : this.value);
    const rovingDate =
      this._focusedDate ??
      rovingAnchor ??
      (today.getFullYear() === this._viewYear && today.getMonth() === this._viewMonth ? today : null) ??
      new Date(this._viewYear, this._viewMonth, 1);

    const footer = html`
      <div class="footer">
        <button class="today-btn" ?disabled=${this.disabled} @click=${this._goToToday}>Today</button>
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
              aria-label="Previous month"
              ?disabled=${this.disabled}
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
              aria-label="Next month"
              ?disabled=${this.disabled}
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
    const prevLabel = this._pickingMonthYear ? 'Previous year' : 'Previous month';
    const nextLabel = this._pickingMonthYear ? 'Next year' : 'Next month';

    const header = html`
      <div class="header">
        <button class="nav-btn" aria-label=${prevLabel} ?disabled=${this.disabled} @click=${() => this._navigate(-1)}>
          <lt-icon name="arrow-left" size="sm"></lt-icon>
        </button>
        <button
          class="month-label-btn ${this._pickingMonthYear ? 'month-label-btn--open' : ''}"
          aria-expanded=${this._pickingMonthYear ? 'true' : 'false'}
          aria-label="Choose month and year"
          ?disabled=${this.disabled}
          @click=${() => (this._pickingMonthYear ? this._closePicker() : this._openPicker())}
        >
          <span aria-live="polite" aria-atomic="true">${this._pickingMonthYear ? this._pickerYear : monthLabel}</span>
          <lt-icon name="arrow-down" size="sm" class="picker-chevron"></lt-icon>
        </button>
        <button class="nav-btn" aria-label=${nextLabel} ?disabled=${this.disabled} @click=${() => this._navigate(1)}>
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
                  ?disabled=${this.disabled}
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
