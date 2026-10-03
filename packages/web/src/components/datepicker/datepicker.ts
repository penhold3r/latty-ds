import { createFieldIds } from '../shared/form-field';
import { html, nothing, type PropertyValues } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property, query } from 'lit/decorators.js';

import { datepickerStyles } from './datepicker.styles';
import type { DatepickerType, DatepickerSize, DatepickerVariant } from './datepicker.types';
import { dispatch } from '../../utils';
import { FormDefaultController } from '../shared/form-default';
import { FormDisabledController } from '../shared/form-disabled';
import { toValidityFlags } from '../shared/form-validity';
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
  private _default = new FormDefaultController(this, () => this.value);
  private _fieldsetDisabled = new FormDisabledController(this);

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

  /** Native input type. */
  @property({ reflect: true }) type: DatepickerType = 'date';

  /** Current value in the format required by the native input (`YYYY-MM-DD`, `HH:MM`, or `YYYY-MM-DDTHH:MM`).
   * Not reflected as an attribute — read the property, or the `change` event's `detail.value`, instead of
   * `getAttribute('value')`/`[value]`. */
  @property() value = '';

  /** Minimum allowed value. */
  @property({ reflect: true }) min = '';

  /** Maximum allowed value. */
  @property({ reflect: true }) max = '';

  /** Field label displayed above the input. */
  @property({ reflect: true }) label = '';

  /** Helper or error text displayed below the input. */
  @property({ attribute: 'helper-text' }) helperText = '';

  private readonly _fieldIds = createFieldIds();

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
    if (changed.has('value') || changed.has('required') || changed.has('min') || changed.has('max')) {
      this._internals.setFormValue(this.value || null);
      // `type`/`min`/`max`/`required` are already forwarded onto the inner input, so its own `validity` already
      // covers valueMissing, rangeUnderflow and rangeOverflow (DTP-2) for free — mirror that directly.
      if (!this.input.validity.valid) {
        this._internals.setValidity(toValidityFlags(this.input.validity), this.input.validationMessage, this.input);
      } else {
        this._internals.setValidity({});
      }
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

  private handleChange(e: Event) {
    // The native input/change event is composed, so it would otherwise keep bubbling past the shadow boundary
    // after we re-dispatch our own — double-firing the same event name on the host, the first one with no
    // `detail` at all (DTP-1: `e.detail.value` throws on it).
    e.stopPropagation();
    this.value = this.input.value;
    dispatch(this, 'change', { value: this.value });
  }

  private handleInput(e: Event) {
    e.stopPropagation();
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
        ?disabled=${this._isDisabled}
        ?required=${this.required}
        aria-describedby=${this.helperText ? this._fieldIds.helper : nothing}
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
        ${this.helperText
          ? html`<span id=${this._fieldIds.helper} class="helper-text">${this.helperText}</span>`
          : nothing}
      </div>
    `;
  }
}
