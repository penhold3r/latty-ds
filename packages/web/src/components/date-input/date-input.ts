import { html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ThemeableElement } from '../../base';
import '@latty/icons';
import '../calendar/calendar';
import '../text/text';

import { dateInputStyles } from './date-input.styles';
import type { DateInputSize, DateInputVariant, DateInputFormat } from './date-input.types';
import type { Calendar } from '../calendar/calendar';
import { dispatch, createClickOutsideHandler } from '../../utils';

/**
 * A text field that opens an `lt-calendar` popover for visual date selection.
 *
 * @element lt-date-input
 *
 * @fires {CustomEvent<{value: string}>} lt-change - Fired when the user selects a date.
 *
 * @example
 * ```html
 * <lt-date-input label="Start date"></lt-date-input>
 * ```
 *
 * @example
 * ```html
 * <lt-date-input value="2026-06-15" min="2026-01-01" max="2026-12-31"></lt-date-input>
 * ```
 */
@customElement('lt-date-input')
export class DateInput extends ThemeableElement {
  static styles = dateInputStyles;

  /** Selected date in ISO format (YYYY-MM-DD). */
  @property({ reflect: true }) value = '';

  /** Minimum selectable date (ISO format). Dates before this are disabled. */
  @property({ reflect: true }) min = '';

  /** Maximum selectable date (ISO format). Dates after this are disabled. */
  @property({ reflect: true }) max = '';

  /** BCP 47 locale used for formatting the display value and calendar labels. */
  @property({ reflect: true }) locale = 'en-US';

  /** How to format the selected date in the trigger field. Maps to `Intl.DateTimeFormat` `dateStyle`. */
  @property({ reflect: true }) format: DateInputFormat = 'medium';

  /** First day of the week in the calendar. 0 = Sunday, 1 = Monday. */
  @property({ attribute: 'week-start', reflect: true }) weekStart: '0' | '1' = '0';

  /** Field label displayed above the trigger. */
  @property() label = '';

  /** Placeholder text shown when no date is selected. */
  @property() placeholder = 'Select a date';

  /** Helper or error text displayed below the field. */
  @property({ attribute: 'helper-text' }) helperText = '';

  /** Visual state variant. */
  @property({ reflect: true }) variant: DateInputVariant = 'default';

  /** Visual size. */
  @property({ reflect: true }) size: DateInputSize = 'md';

  /** Whether the field is disabled. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Whether the field is required. */
  @property({ type: Boolean, reflect: true }) required = false;

  /** Name used in form submission via a hidden input. */
  @property() name = '';

  /** Individual dates to disable in the calendar, as Date objects. */
  disabledDates: Calendar['disabledDates'] = [];

  @state() private _open = false;

  private _cleanupClickOutside: (() => void) | null = null;

  private get _displayValue(): string {
    if (!this.value) return '';
    const [y, m, d] = this.value.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return new Intl.DateTimeFormat(this.locale, { dateStyle: this.format }).format(date);
  }

  private _openDropdown() {
    if (this.disabled || this._open) return;
    const btn = this.shadowRoot?.querySelector<HTMLElement>('.field-btn');
    const dropdown = this.shadowRoot?.querySelector<HTMLElement>('.dropdown');
    if (btn && dropdown) {
      const rect = btn.getBoundingClientRect();
      dropdown.style.top = `${rect.bottom + 4}px`;
      dropdown.style.left = `${rect.left}px`;
      (dropdown as HTMLElement & { showPopover?(): void }).showPopover?.();
    }
    this._open = true;
    this._cleanupClickOutside = createClickOutsideHandler(this, () => this._closeDropdown());
  }

  private _closeDropdown() {
    const dropdown = this.shadowRoot?.querySelector<HTMLElement>('.dropdown');
    (dropdown as HTMLElement & { hidePopover?(): void })?.hidePopover?.();
    this._open = false;
    this._cleanupClickOutside?.();
    this._cleanupClickOutside = null;
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._cleanupClickOutside?.();
    this._cleanupClickOutside = null;
  }

  private _handleCalendarChange(e: CustomEvent<{ value: string }>) {
    e.stopPropagation();
    this.value = e.detail.value;
    dispatch(this, 'lt-change', { value: this.value });
    this._closeDropdown();
    this.shadowRoot?.querySelector<HTMLElement>('.field-btn')?.focus();
  }

  private _handleDropdownKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      e.stopPropagation();
      this._closeDropdown();
      this.shadowRoot?.querySelector<HTMLElement>('.field-btn')?.focus();
    }
  }

  render() {
    const displayText = this._displayValue || this.placeholder;
    const isPlaceholder = !this._displayValue;

    return html`
      <div class="wrapper">
        ${this.label
          ? html`<label for="field-btn">
              <lt-text variant="label" as="span">${this.label}</lt-text>
              ${this.required ? html`<span class="required-indicator" aria-hidden="true">*</span>` : nothing}
            </label>`
          : nothing}

        <div class="field">
          <button
            id="field-btn"
            type="button"
            class="field-btn"
            aria-haspopup="dialog"
            aria-expanded=${this._open ? 'true' : 'false'}
            ?disabled=${this.disabled}
            ?required=${this.required}
            @click=${this._openDropdown}
          >
            <span class=${isPlaceholder ? 'display-value display-value--placeholder' : 'display-value'}>
              ${displayText}
            </span>
            <span class="calendar-icon" aria-hidden="true">
              <lt-icon name="calendar" size="sm"></lt-icon>
            </span>
          </button>

          ${this._open
            ? html`<div class="dropdown" role="dialog" aria-label="Date picker" @keydown=${this._handleDropdownKeyDown}>
                <lt-calendar
                  value=${this.value}
                  min=${this.min}
                  max=${this.max}
                  locale=${this.locale}
                  week-start=${this.weekStart}
                  .disabledDates=${this.disabledDates}
                  @lt-change=${this._handleCalendarChange}
                ></lt-calendar>
              </div>`
            : nothing}
        </div>

        ${this.name ? html`<input type="hidden" name=${this.name} .value=${this.value} />` : nothing}
        ${this.helperText ? html`<span class="helper-text">${this.helperText}</span>` : nothing}
      </div>
    `;
  }
}
