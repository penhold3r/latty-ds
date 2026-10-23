import { createFieldIds, renderFieldLabel, renderHelperText } from '../shared/form-field';
import { html, nothing, type PropertyValues } from 'lit';
import { FormControlElement } from '../../base';
import { customElement, property, query } from 'lit/decorators.js';

import { datepickerStyles } from './datepicker.styles';
import type { DatepickerType, DatepickerSize, DatepickerVariant } from './datepicker.types';
import { dispatch } from '../../utils';
import { NativeAttrsController } from '../shared/native-attrs';
import { toValidityFlags } from '../../base';
import '../text/text';

/**
 * Date and time picker wrapping the native browser date/time input with design-system styling.
 * Automatically forwards native `<input>` attributes (`min`, `max`, `step`, `readonly`, `name`, `autocomplete`, etc.)
 * onto the inner control.
 * @element lt-datepicker
 * @fires {CustomEvent<{value: string}>} change - Fired when the value changes (on blur).
 * @fires {CustomEvent<{value: string}>} input - Fired on every keystroke / picker selection.
 * @example
 * ```html
 * <lt-datepicker label="Start date" type="date"></lt-datepicker>
 * ```
 * @example
 * ```html
 * <lt-datepicker label="Meeting time" type="datetime-local" required></lt-datepicker>
 * ```
 */
@customElement('lt-datepicker')
export class Datepicker extends FormControlElement {
  static styles = datepickerStyles;

  private _nativeAttrs = new NativeAttrsController(this, () => this.input, {
    exclude: ['aria-describedby'],
    onSync: () => this._syncValidity()
  });

  /** Native input type. */
  @property({ reflect: true }) type: DatepickerType = 'date';

  /** Current value in the format required by the native input (`YYYY-MM-DD`, `HH:MM`, or `YYYY-MM-DDTHH:MM`).
   * Not reflected as an attribute — read the property, or the `change` event's `detail.value`, instead of
   * `getAttribute('value')`/`[value]`. */
  @property() value = '';

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

  @query('input') private input!: HTMLInputElement;

  private _syncValidity() {
    if (!this.input) return;
    /*
     * `type`/`min`/`max`/`step`/`required` are forwarded onto the inner input, so its own `validity` already
     * covers valueMissing, rangeUnderflow, rangeOverflow, and stepMismatch (DTP-2) for free — mirror that directly.
     */
    if (!this.input.validity.valid) {
      this._internals.setValidity(toValidityFlags(this.input.validity), this.input.validationMessage, this.input);
    } else {
      this._internals.setValidity({});
    }
  }

  protected updated(changed: PropertyValues) {
    if (changed.has('value') || changed.has('required')) {
      this._internals.setFormValue(this.value);
    }
    this._syncValidity();
  }

  /**
   * A text-like control's value is its `value` — what a form reset restores and what a browser
   * state-restore repopulates.
   */
  protected override get _formValue(): string {
    return this.value;
  }

  protected override set _formValue(value: unknown) {
    this.value = value == null ? '' : String(value);
  }

  private handleChange(e: Event) {
    /*
     * The native input/change event is composed, so it would otherwise keep bubbling past the shadow boundary
     * after we re-dispatch our own — double-firing the same event name on the host, the first one with no
     * `detail` at all (DTP-1: `e.detail.value` throws on it).
     */
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
        ?disabled=${this._isDisabled}
        ?required=${this.required}
        aria-describedby=${this.helperText ? this._fieldIds.helper : nothing}
        @change=${this.handleChange}
        @input=${this.handleInput}
      />
    `;

    return html`
      <div class="wrapper">
        ${this.label ? html`<label> ${renderFieldLabel(this.label, this.required)} ${inputEl} </label>` : inputEl}
        ${renderHelperText(this._fieldIds.helper, this.helperText)}
      </div>
    `;
  }
}
