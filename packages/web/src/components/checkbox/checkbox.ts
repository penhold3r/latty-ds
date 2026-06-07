import { html } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property, query } from 'lit/decorators.js';

import { checkboxStyles } from './checkbox.styles';
import { CheckboxSize, CheckboxVariant, CheckboxLabelPosition } from './checkbox.types';

import '@latty-ds/icons';

/**
 * A customizable checkbox component with support for multiple variants and sizes.
 *
 * @element lt-checkbox
 *
 * @fires {CustomEvent<{checked: boolean}>} change - Dispatched when the checked state changes
 *
 * @example
 * ```html
 * <lt-checkbox label="Accept terms and conditions"></lt-checkbox>
 * ```
 *
 * @example
 * ```html
 * <lt-checkbox
 *   variant="success"
 *   label="Enable notifications"
 *   checked
 * ></lt-checkbox>
 * ```
 *
 * @example
 * ```html
 * <lt-checkbox
 *   variant="error"
 *   label="I agree to the privacy policy"
 *   required
 * ></lt-checkbox>
 * ```
 */
@customElement('lt-checkbox')
export class Checkbox extends ThemeableElement {
  static styles = checkboxStyles;
  static formAssociated = true;

  private _internals!: ElementInternals;

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

  /**
   * Visual variant that determines the color when checked.
   * @default 'primary'
   */
  @property({ reflect: true }) variant: CheckboxVariant = 'primary';

  /**
   * Size of the checkbox.
   * @default 'md'
   */
  @property({ reflect: true }) size: CheckboxSize = 'md';

  /**
   * Whether the checkbox is checked.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) checked = false;

  /**
   * Whether the checkbox is in indeterminate state.
   * Used for "select all" checkboxes when some items are selected.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) indeterminate = false;

  /**
   * Whether the checkbox is disabled.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * Whether the checkbox is required.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) required = false;

  /**
   * Label text displayed next to the checkbox.
   * @default ''
   */
  @property({ reflect: true }) label = '';

  /**
   * Position of the label relative to the checkbox.
   * @default 'right'
   */
  @property({ attribute: 'label-position', reflect: true }) labelPosition: CheckboxLabelPosition = 'right';

  /**
   * Name attribute for form submission.
   * @default ''
   */
  @property({ reflect: true }) name = '';

  /**
   * Value attribute for form submission.
   * @default 'on'
   */
  @property({ reflect: true }) value = 'on';

  /**
   * Reference to the native input element.
   * @private
   */
  @query('input[type="checkbox"]') private input!: HTMLInputElement;

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('indeterminate') && this.input) {
      this.input.indeterminate = this.indeterminate;
    }
    this._internals.setFormValue(this.checked ? this.value : null);
    if (this.required && !this.checked && this.input) {
      this._internals.setValidity({ valueMissing: true }, 'Please check this box', this.input);
    } else {
      this._internals.setValidity({});
    }
  }

  formResetCallback() {
    this.checked = false;
  }

  checkValidity() {
    return this._internals.checkValidity();
  }

  reportValidity() {
    return this._internals.reportValidity();
  }

  /**
   * Handles checkbox change events.
   * Updates the checked state and dispatches a custom change event.
   *
   * @param e - The native change event
   * @private
   */
  private handleChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.checked = target.checked;
    this.indeterminate = false; // Checking clears indeterminate state

    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { checked: this.checked },
        bubbles: true,
        composed: true
      })
    );
  }

  /**
   * Renders the checkbox icon based on state.
   * Shows checkmark when checked, minus when indeterminate.
   *
   * @private
   */
  private renderCheckmark() {
    if (this.indeterminate) {
      return html`<lt-icon class="checkmark" name="minus"></lt-icon>`;
    }
    if (this.checked) {
      return html`<lt-icon class="checkmark" name="check"></lt-icon>`;
    }
    return html``;
  }

  render() {
    return html`
      <label class="checkbox-wrapper">
        <span class="box">
          <input
            type="checkbox"
            .checked=${this.checked}
            ?disabled=${this.disabled}
            ?required=${this.required}
            name=${this.name}
            value=${this.value}
            @change=${this.handleChange}
            aria-label=${this.label || 'checkbox'}
            aria-checked=${this.indeterminate ? 'mixed' : this.checked ? 'true' : 'false'}
          />
          ${this.renderCheckmark()}
        </span>
        ${this.label ? html`<span class="label">${this.label}</span>` : ''}
      </label>
    `;
  }
}
