import { LitElement, html, svg } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

import { checkboxStyles } from './checkbox.styles';
import { CheckboxSize, CheckboxVariant, CheckboxLabelPosition } from './checkbox.types';

/**
 * A customizable checkbox component with support for multiple variants and sizes.
 *
 * @element lt-checkbox
 *
 * @fires {CustomEvent<{checked: boolean, indeterminate: boolean}>} change - Dispatched when the checked state changes
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
export class Checkbox extends LitElement {
  static styles = checkboxStyles;

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
  @property() label = '';

  /**
   * Position of the label relative to the checkbox.
   * @default 'right'
   */
  @property({ attribute: 'label-position', reflect: true }) labelPosition: CheckboxLabelPosition = 'right';

  /**
   * Name attribute for form submission.
   * @default ''
   */
  @property() name = '';

  /**
   * Value attribute for form submission.
   * @default 'on'
   */
  @property() value = 'on';

  /**
   * Reference to the native input element.
   * @private
   */
  @query('input[type="checkbox"]') private input!: HTMLInputElement;

  /**
   * Handles changes to the indeterminate property.
   * Updates the native input's indeterminate state.
   */
  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('indeterminate') && this.input) {
      this.input.indeterminate = this.indeterminate;
    }
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
        detail: { checked: this.checked, indeterminate: this.indeterminate },
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
      return html`
        <svg class="checkmark" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 8h10" stroke="white" stroke-width="2" stroke-linecap="round" />
        </svg>
      `;
    }
    if (this.checked) {
      return html`
        <svg class="checkmark" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 8l3 3 7-7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      `;
    }
    return html``;
  }

  render() {
    return html`
      <label class="checkbox-wrapper">
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
        ${this.label ? html`<span class="label">${this.label}</span>` : ''}
      </label>
    `;
  }
}
