import { html, nothing, type PropertyValues } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property, query } from 'lit/decorators.js';

import { datepickerStyles } from './datepicker.styles';
import type { DatepickerType, DatepickerSize, DatepickerVariant } from './datepicker.types';
import { dispatch } from '../../utils';
import '../text/text';

/**
 * Date and time picker wrapping the native browser date/time input with design-system styling.
 *
 * @element lt-datepicker
 *
 * @fires {CustomEvent<{value: string}>} change - Fired when the value changes (on blur).
 * @fires {CustomEvent<{value: string}>} input - Fired on every keystroke / picker selection.
 *
 * @example
 * ```html
 * <lt-datepicker label="Start date" type="date"></lt-datepicker>
 * ```
 *
 * @example
 * ```html
 * <lt-datepicker label="Meeting time" type="datetime-local" required></lt-datepicker>
 * ```
 */
@customElement('lt-datepicker')
export class Datepicker extends ThemeableElement {
  static styles = datepickerStyles;
  static formAssociated = true;

  private _internals: ElementInternals;

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

  /** Native input type. */
  @property({ reflect: true }) type: DatepickerType = 'date';

  /** Current value in the format required by the native input (`YYYY-MM-DD`, `HH:MM`, or `YYYY-MM-DDTHH:MM`). */
  @property({ reflect: true }) value = '';

  /** Minimum allowed value. */
  @property({ reflect: true }) min = '';

  /** Maximum allowed value. */
  @property({ reflect: true }) max = '';

  /** Field label displayed above the input. */
  @property({ reflect: true }) label = '';

  /** Helper or error text displayed below the input. */
  @property({ attribute: 'helper-text' }) helperText = '';

  /** Visual state variant. */
  @property({ reflect: true }) variant: DatepickerVariant = 'default';

  /** Visual size. */
  @property({ reflect: true }) size: DatepickerSize = 'md';

  /** Whether the field is disabled. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Whether the field is required. */
  @property({ type: Boolean, reflect: true }) required = false;

  /** Whether the field is read-only. */
  @property({ type: Boolean, reflect: true }) readonly = false;

  /** Name used in form submission. */
  @property({ reflect: true }) name = '';

  @query('input') private input!: HTMLInputElement;

  protected updated(changed: PropertyValues) {
    if (changed.has('value') || changed.has('required')) {
      this._internals.setFormValue(this.value || null);
      if (this.required && !this.value) {
        this._internals.setValidity({ valueMissing: true }, 'Please select a date', this.input);
      } else {
        this._internals.setValidity({});
      }
    }
  }

  formResetCallback() {
    this.value = '';
  }

  checkValidity() {
    return this._internals.checkValidity();
  }

  reportValidity() {
    return this._internals.reportValidity();
  }

  private handleChange() {
    this.value = this.input.value;
    dispatch(this, 'change', { value: this.value });
  }

  private handleInput() {
    this.value = this.input.value;
    dispatch(this, 'input', { value: this.value });
  }

  render() {
    const inputEl = html`
      <input
        type=${this.type}
        .value=${this.value}
        min=${this.min || nothing}
        max=${this.max || nothing}
        ?disabled=${this.disabled}
        ?required=${this.required}
        ?readonly=${this.readonly}
        @change=${this.handleChange}
        @input=${this.handleInput}
      />
    `;

    return html`
      <div class="wrapper">
        ${this.label
          ? html`<label>
              <lt-text variant="label" as="span">${this.label}</lt-text>
              ${this.required ? html`<span class="required-indicator">*</span>` : nothing} ${inputEl}
            </label>`
          : inputEl}
        ${this.helperText ? html`<span class="helper-text">${this.helperText}</span>` : nothing}
      </div>
    `;
  }
}
