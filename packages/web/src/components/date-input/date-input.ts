import { html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { customElement, property, state } from 'lit/decorators.js';
import { ThemeableElement } from '../../base';
import '@latty-ds/icons';
import '../calendar/calendar';
import '../text/text';

import { dateInputStyles } from './date-input.styles';
import type { DateInputSize, DateInputVariant, DateInputFormat, DateInputLabels } from './date-input.types';
import type { Calendar } from '../calendar/calendar';
import type { CalendarWeekStart } from '../calendar/calendar.types';
import { dispatch, createClickOutsideHandler } from '../../utils';
import { openFloating, closeFloating } from '../shared/floating';
import { FormDefaultController } from '../shared/form-default';
import { FormDisabledController } from '../shared/form-disabled';

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

const DEFAULT_LABELS: DateInputLabels = {
  validationMessage: 'Please select a date',
  datePicker: 'Date picker'
};

/**
 * Parses a plain `YYYY-MM-DD` string into a local date, or `null` when it isn't one — including real-looking
 * but impossible dates such as `2026-02-31`. A value like `2026-06-15T10:00` (a datetime from an API) is not
 * a plain date either; showing the placeholder is safer than guessing.
 */
const parseIsoDate = (value: string): Date | null => {
  const match = ISO_DATE.exec(value);
  if (!match) return null;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null;
};

/**
 * A text field that opens an `lt-calendar` popover for visual date selection.
 *
 * @element lt-date-input
 *
 * @fires {CustomEvent<{value: string}>} change - Fired when the user selects a date.
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
  static formAssociated = true;

  private _internals!: ElementInternals;
  private _default = new FormDefaultController(this, () => this.value);
  private _fieldsetDisabled = new FormDisabledController(this);

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

  /** Selected date in ISO format (YYYY-MM-DD). Not reflected as an attribute — read the property, or the
   * `change` event's `detail.value`, instead of `getAttribute('value')`/`[value]`. */
  @property() value = '';

  /** Minimum selectable date (ISO format). Dates before this are disabled. */
  @property({ reflect: true }) min = '';

  /** Maximum selectable date (ISO format). Dates after this are disabled. */
  @property({ reflect: true }) max = '';

  /** BCP 47 locale used for formatting the display value and calendar labels. */
  @property({ reflect: true }) locale = 'en-US';

  /** How to format the selected date in the trigger field. Maps to `Intl.DateTimeFormat` `dateStyle`. */
  @property({ reflect: true }) format: DateInputFormat = 'medium';

  /**
   * First day of the week in the calendar (0 = Sunday … 6 = Saturday). Defaults to whatever `locale` implies —
   * set this explicitly only to override that. Forwarded as-is to the internal `lt-calendar`, which does the
   * actual derivation when this is left unset.
   */
  @property({ attribute: 'week-start', reflect: true }) weekStart?: CalendarWeekStart;

  /** Field label displayed above the trigger. */
  @property({ reflect: true }) label = '';

  /** Placeholder text shown when no date is selected. */
  @property({ reflect: true }) placeholder = 'Select a date';

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

  /** Name used in form submission (through `ElementInternals`, so no hidden input is rendered). */
  @property({ reflect: true }) name = '';

  /** Individual dates to disable in the calendar, as Date objects. Set as a JS property (`.disabledDates`). */
  @property({ attribute: false }) disabledDates: Calendar['disabledDates'] = [];

  /** Overridable UI text (validation message, calendar popover's accessible label), for i18n. English defaults — override only the keys you need. */
  @property({ type: Object }) labels: Partial<DateInputLabels> = {};

  private get _labels(): DateInputLabels {
    return { ...DEFAULT_LABELS, ...this.labels };
  }

  @state() private _open = false;

  private _cleanupClickOutside: (() => void) | null = null;
  private _floatingCleanup: (() => void) | null = null;

  private get _displayValue(): string {
    const date = parseIsoDate(this.value);
    if (!date) return '';
    try {
      return new Intl.DateTimeFormat(this.locale, { dateStyle: this.format }).format(date);
    } catch {
      // An unknown BCP 47 locale throws a RangeError; fall back to the runtime default rather than fail to render.
      return new Intl.DateTimeFormat(undefined, { dateStyle: this.format }).format(date);
    }
  }

  private async _openDropdown() {
    if (this._isDisabled || this._open) return;
    this._open = true;
    await this.updateComplete;
    const btn = this.shadowRoot?.querySelector<HTMLElement>('#field-btn');
    const dropdown = this.shadowRoot?.querySelector<HTMLElement>('.dropdown');
    if (btn && dropdown) {
      const cleanup = await openFloating(btn, dropdown);
      // Guard against a close during the await — otherwise the autoUpdate cleanup is orphaned.
      if (this._open) this._floatingCleanup = cleanup;
      else cleanup();
    }
    if (!this._open) return;
    this._cleanupClickOutside = createClickOutsideHandler(this, () => this._closeDropdown());
  }

  private _closeDropdown() {
    const dropdown = this.shadowRoot?.querySelector<HTMLElement>('.dropdown');
    if (dropdown) closeFloating(dropdown, this._floatingCleanup);
    this._floatingCleanup = null;
    this._open = false;
    this._cleanupClickOutside?.();
    this._cleanupClickOutside = null;
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._floatingCleanup?.();
    this._floatingCleanup = null;
    this._cleanupClickOutside?.();
    this._cleanupClickOutside = null;
  }

  private _handleCalendarChange(e: CustomEvent<{ value: string }>) {
    e.stopPropagation();
    this.value = e.detail.value;
    dispatch(this, 'change', { value: this.value });
    this._closeDropdown();
    this.shadowRoot?.querySelector<HTMLElement>('.field-btn')?.focus();
  }

  private _handleDropdownKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      // preventDefault(), not just stopPropagation() — an ancestor <lt-dialog> closes itself on Escape unless
      // something already prevented the keydown's default, independent of DOM event bubbling.
      e.preventDefault();
      e.stopPropagation();
      this._closeDropdown();
      this.shadowRoot?.querySelector<HTMLElement>('.field-btn')?.focus();
    }
  }

  updated() {
    this._internals.setFormValue(this.value || null);
    const btn = this.shadowRoot?.querySelector<HTMLElement>('#field-btn');
    if (this.required && !this.value && btn) {
      this._internals.setValidity({ valueMissing: true }, this._labels.validationMessage, btn);
    } else {
      this._internals.setValidity({});
    }
  }

  formResetCallback() {
    this.value = this._default.value;
  }

  formDisabledCallback(disabled: boolean) {
    this._fieldsetDisabled.setFieldsetDisabled(disabled);
  }

  /** `this.disabled` combined with an ancestor `<fieldset>`'s own disabled state (see `FormDisabledController`). */
  private get _isDisabled(): boolean {
    return this.disabled || this._fieldsetDisabled.fieldsetDisabled;
  }

  checkValidity() {
    return this._internals.checkValidity();
  }

  reportValidity() {
    return this._internals.reportValidity();
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
            ?disabled=${this._isDisabled}
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

          <div
            class="dropdown"
            popover="manual"
            role="dialog"
            aria-label=${this._labels.datePicker}
            @keydown=${this._handleDropdownKeyDown}
          >
            ${this._open
              ? html`<lt-calendar
                  value=${this.value}
                  min=${this.min}
                  max=${this.max}
                  locale=${this.locale}
                  week-start=${ifDefined(this.weekStart)}
                  .disabledDates=${this.disabledDates}
                  @change=${this._handleCalendarChange}
                ></lt-calendar>`
              : nothing}
          </div>
        </div>

        ${this.helperText ? html`<span class="helper-text">${this.helperText}</span>` : nothing}
      </div>
    `;
  }
}
