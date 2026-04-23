import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { radioStyles } from './radio.styles';
import { RadioSize, RadioVariant, RadioLabelPosition } from './radio.types';

/**
 * A customizable radio button component with support for multiple variants and sizes.
 *
 * @element lt-radio
 *
 * @fires {CustomEvent<{value: string, checked: boolean}>} change - Dispatched when the radio is selected
 *
 * @example
 * ```html
 * <lt-radio name="size" value="small" label="Small"></lt-radio>
 * <lt-radio name="size" value="medium" label="Medium" checked></lt-radio>
 * <lt-radio name="size" value="large" label="Large"></lt-radio>
 * ```
 *
 * @example
 * ```html
 * <lt-radio
 *   variant="success"
 *   name="option"
 *   value="yes"
 *   label="Yes, I agree"
 *   checked
 * ></lt-radio>
 * ```
 *
 * @example
 * ```html
 * <lt-radio
 *   variant="error"
 *   name="delete"
 *   value="confirm"
 *   label="Confirm deletion"
 *   required
 * ></lt-radio>
 * ```
 */
@customElement('lt-radio')
export class Radio extends LitElement {
  static styles = radioStyles;

  /**
   * Visual variant that determines the color when checked.
   * @default 'primary'
   */
  @property({ reflect: true }) variant: RadioVariant = 'primary';

  /**
   * Size of the radio button.
   * @default 'md'
   */
  @property({ reflect: true }) size: RadioSize = 'md';

  /**
   * Whether the radio is checked.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) checked = false;

  /**
   * Whether the radio is disabled.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * Whether the radio is required.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) required = false;

  /**
   * Label text displayed next to the radio button.
   * @default ''
   */
  @property() label = '';

  /**
   * Position of the label relative to the radio button.
   * @default 'right'
   */
  @property({ attribute: 'label-position', reflect: true }) labelPosition: RadioLabelPosition = 'right';

  /**
   * Name attribute for radio group.
   * All radios with the same name belong to the same group.
   * @default ''
   */
  @property() name = '';

  /**
   * Value attribute for form submission.
   * @default ''
   */
  @property() value = '';

  /**
   * Handles radio change events.
   * Updates the checked state and dispatches a custom change event.
   *
   * @param e - The native change event
   * @private
   */
  private handleChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.checked = target.checked;

    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: this.value, checked: this.checked },
        bubbles: true,
        composed: true
      })
    );
  }

  render() {
    return html`
      <label class="radio-wrapper">
        <div class="radio-container">
          <input
            type="radio"
            .checked=${this.checked}
            ?disabled=${this.disabled}
            ?required=${this.required}
            name=${this.name}
            value=${this.value}
            @change=${this.handleChange}
            aria-label=${this.label || 'radio'}
          />
          <span class="dot"></span>
        </div>
        ${this.label ? html`<span class="label">${this.label}</span>` : ''}
      </label>
    `;
  }
}
