import { html, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ThemeableElement } from '../../base';
import '@latty/icons';

import { calendarStyles } from './calendar.styles';
import type { CalendarDay, CalendarWeekStart } from './calendar.types';

/**
 * A visual calendar grid for single-date selection.
 *
 * @element lt-calendar
 *
 * @fires {CustomEvent<{value: string}>} lt-change - Fired when the user selects a date.
 * @fires {CustomEvent<{year: number, month: number}>} lt-month-change - Fired when the viewed month changes.
 *
 * @example
 * ```html
 * <lt-calendar value="2026-05-19"></lt-calendar>
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

  /** Selected date in ISO format (YYYY-MM-DD). Empty string means no selection. */
  @property({ reflect: true }) value = '';

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

  /** Specific dates to disable, as an array of Date objects. Not reflected as an attribute. */
  disabledDates: Date[] = [];

  @state() private _viewYear = new Date().getFullYear();
  @state() private _viewMonth = new Date().getMonth();
  @state() private _focusedDate: Date | null = null;

  override willUpdate(changed: PropertyValues<this>) {
    super.willUpdate(changed);
    if (changed.has('value') && this.value) {
      const d = this._parseDate(this.value);
      if (d) {
        this._viewYear = d.getFullYear();
        this._viewMonth = d.getMonth();
      }
    }
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

  private _buildDays(): CalendarDay[] {
    const today = new Date();
    const selected = this._parseDate(this.value);
    const weekStart = Number(this.weekStart);

    const firstOfMonth = new Date(this._viewYear, this._viewMonth, 1);
    const lastOfMonth = new Date(this._viewYear, this._viewMonth + 1, 0);

    const startOffset = (firstOfMonth.getDay() - weekStart + 7) % 7;
    const totalCurrent = startOffset + lastOfMonth.getDate();
    const endOffset = totalCurrent % 7 === 0 ? 0 : 7 - (totalCurrent % 7);

    const days: CalendarDay[] = [];

    for (let i = startOffset; i > 0; i--) {
      const date = new Date(this._viewYear, this._viewMonth, 1 - i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: this._isSameDay(date, today),
        isSelected: selected ? this._isSameDay(date, selected) : false,
        isDisabled: this._isDisabled(date)
      });
    }

    for (let d = 1; d <= lastOfMonth.getDate(); d++) {
      const date = new Date(this._viewYear, this._viewMonth, d);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: this._isSameDay(date, today),
        isSelected: selected ? this._isSameDay(date, selected) : false,
        isDisabled: this._isDisabled(date)
      });
    }

    for (let d = 1; d <= endOffset; d++) {
      const date = new Date(this._viewYear, this._viewMonth + 1, d);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: this._isSameDay(date, today),
        isSelected: selected ? this._isSameDay(date, selected) : false,
        isDisabled: this._isDisabled(date)
      });
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
    this.dispatchEvent(
      new CustomEvent('lt-month-change', {
        detail: { year: this._viewYear, month: this._viewMonth },
        bubbles: true,
        composed: true
      })
    );
  }

  private _selectDay(day: CalendarDay) {
    if (day.isDisabled || this.disabled) return;
    if (!day.isCurrentMonth) {
      this._viewMonth = day.date.getMonth();
      this._viewYear = day.date.getFullYear();
    }
    const iso = this._toIso(day.date);
    this.value = iso;
    this._focusedDate = day.date;
    this.dispatchEvent(new CustomEvent('lt-change', { detail: { value: iso }, bubbles: true, composed: true }));
  }

  private _goToToday() {
    const today = new Date();
    this._viewYear = today.getFullYear();
    this._viewMonth = today.getMonth();
    this._focusedDate = null;
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

  render() {
    const days = this._buildDays();
    const today = new Date();
    const monthLabel = new Intl.DateTimeFormat(this.locale, { month: 'long', year: 'numeric' }).format(
      new Date(this._viewYear, this._viewMonth)
    );
    const weekdayLabels = this._getWeekdayLabels();

    // Roving tabindex: focused date → selected date → today → first of month
    const rovingDate =
      this._focusedDate ??
      this._parseDate(this.value) ??
      (today.getFullYear() === this._viewYear && today.getMonth() === this._viewMonth ? today : null) ??
      new Date(this._viewYear, this._viewMonth, 1);

    // Group flat day array into week rows
    const weeks: CalendarDay[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return html`
      <div class="calendar" part="base">
        <div class="header">
          <button
            class="nav-btn"
            aria-label="Previous month"
            ?disabled=${this.disabled}
            @click=${() => this._navigate(-1)}
          >
            <lt-icon name="arrow-left" size="sm"></lt-icon>
          </button>
          <span class="month-label" aria-live="polite" aria-atomic="true">${monthLabel}</span>
          <button class="nav-btn" aria-label="Next month" ?disabled=${this.disabled} @click=${() => this._navigate(1)}>
            <lt-icon name="arrow-right" size="sm"></lt-icon>
          </button>
        </div>

        <div class="weekdays" aria-hidden="true">
          ${weekdayLabels.map((label) => html`<div class="weekday">${label}</div>`)}
        </div>

        <div class="grid" role="grid" aria-label="${monthLabel}">
          ${weeks.map(
            (week) => html`
              <div role="row">
                ${week.map((day) => {
                  if (!day.isCurrentMonth && !this.showOutsideDays) {
                    return html`<div role="gridcell" aria-hidden="true" class="day day--empty"></div>`;
                  }

                  const classes = [
                    'day',
                    !day.isCurrentMonth ? 'day--outside' : '',
                    day.isToday ? 'day--today' : '',
                    day.isSelected ? 'day--selected' : ''
                  ]
                    .filter(Boolean)
                    .join(' ');

                  const iso = this._toIso(day.date);

                  return html`
                    <button
                      role="gridcell"
                      class=${classes}
                      data-date=${iso}
                      ?disabled=${day.isDisabled}
                      aria-selected=${day.isSelected ? 'true' : 'false'}
                      aria-label=${this._dayAriaLabel(day.date)}
                      tabindex=${this._isSameDay(day.date, rovingDate) ? 0 : -1}
                      @click=${() => this._selectDay(day)}
                      @keydown=${this._handleKeyDown}
                    >
                      ${day.date.getDate()}
                    </button>
                  `;
                })}
              </div>
            `
          )}
        </div>

        <div class="footer">
          <button class="today-btn" ?disabled=${this.disabled} @click=${this._goToToday}>Today</button>
        </div>
      </div>
    `;
  }
}
