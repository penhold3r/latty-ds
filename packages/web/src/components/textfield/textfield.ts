import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { textfieldStyles } from './textfield.styles';
import { TextfieldSize, TextfieldType, TextfieldVariant } from './textfield.types';
import '@latty/icons';

/**
 * A customizable text input component with support for multiple variants, sizes, and input types.
 * Supports both single-line inputs and multi-line textareas.
 *
 * @element lt-textfield
 *
 * @fires {CustomEvent<{value: string}>} input - Dispatched when the input value changes
 * @fires {CustomEvent<{value: string}>} change - Dispatched when the input loses focus after a value change
 *
 * @example
 * ```html
 * <lt-textfield
 *   label="Email"
 *   type="email"
 *   placeholder="Enter your email"
 *   required
 * ></lt-textfield>
 * ```
 *
 * @example
 * ```html
 * <lt-textfield
 *   variant="error"
 *   label="Password"
 *   type="password"
 *   helper-text="Password must be at least 8 characters"
 * ></lt-textfield>
 * ```
 *
 * @example
 * ```html
 * <lt-textfield
 *   type="multiline"
 *   label="Description"
 *   placeholder="Enter description..."
 *   rows="5"
 * ></lt-textfield>
 * ```
 */
@customElement('lt-textfield')
export class Textfield extends LitElement {
  static styles = textfieldStyles;

  /**
   * Visual variant that determines styling and automatic end icon.
   * @default 'default'
   */
  @property({ reflect: true }) variant: TextfieldVariant = 'default';

  /**
   * Size of the textfield (affects height, font size, and padding).
   * @default 'md'
   */
  @property({ reflect: true }) size: TextfieldSize = 'md';

  /**
   * HTML input type. Password type includes automatic visibility toggle.
   * @default 'text'
   */
  @property({ reflect: true }) type: TextfieldType = 'text';

  /**
   * Current value of the input.
   * @default ''
   */
  @property() value = '';

  /**
   * Placeholder text shown when input is empty.
   * @default ''
   */
  @property() placeholder = '';

  /**
   * Label text displayed above the input.
   * @default ''
   */
  @property() label = '';

  /**
   * Helper text displayed below the input. Color changes based on variant.
   * @default ''
   */
  @property({ attribute: 'helper-text' }) helperText = '';

  /**
   * Whether the input is disabled.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * Whether the input is required. Shows asterisk in label when true.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) required = false;

  /**
   * Whether the input is readonly.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) readonly = false;

  /**
   * Icon name to display at the start of the input.
   * @default ''
   */
  @property({ attribute: 'icon-start' }) iconStart = '';

  /**
   * Number of visible text lines for multiline type (textarea).
   * Only applies when type="multiline".
   * @default 3
   */
  @property({ type: Number }) rows = 3;

  /**
   * Internal state tracking password visibility for password-type inputs.
   * @private
   */
  @state() private isPasswordVisible = false;

  /**
   * Handles input events from the native input or textarea element.
   * Updates the component's value property and dispatches a custom input event.
   *
   * @param e - The native input event
   * @private
   */
  private handleInput(e: Event) {
    const input = e.target as HTMLInputElement | HTMLTextAreaElement;
    this.value = input.value;
    this.dispatchEvent(
      new CustomEvent('input', {
        detail: { value: this.value },
        bubbles: true,
        composed: true
      })
    );
  }

  /**
   * Handles change events from the native input or textarea element.
   * Updates the component's value property and dispatches a custom change event.
   *
   * @param e - The native change event
   * @private
   */
  private handleChange(e: Event) {
    const input = e.target as HTMLInputElement | HTMLTextAreaElement;
    this.value = input.value;
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true
      })
    );
  }

  /**
   * Toggles password visibility for password-type inputs.
   * Switches between showing plain text and masked password.
   *
   * @private
   */
  private togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  /**
   * Determines the appropriate end icon based on input type and variant.
   *
   * Password inputs show eye/eye-off toggle icon.
   * Non-default variants show their respective state icons.
   * Default variant shows no end icon.
   *
   * @returns The icon name to display, or empty string if no icon should be shown
   * @private
   */
  private getEndIconName(): string {
    const isPasswordField = this.type === 'password';

    // Password fields get eye toggle icon
    if (isPasswordField) {
      return this.isPasswordVisible ? 'eye-off' : 'eye';
    }

    // Variants get their respective icons
    switch (this.variant) {
      case 'success':
        return 'check-circle';
      case 'warning':
        return 'warning-triangle';
      case 'error':
        return 'xmark-circle';
      default:
        return '';
    }
  }

  render() {
    const hasStartIcon = Boolean(this.iconStart);
    const isPasswordField = this.type === 'password';
    const isMultiline = this.type === 'multiline';
    const endIconName = this.getEndIconName();
    const hasEndIcon = Boolean(endIconName);

    // For password fields, determine the actual input type based on visibility
    const actualInputType = isPasswordField && this.isPasswordVisible ? 'text' : this.type;

    return html`
      <div class="wrapper">
        ${this.label
          ? html`
              <label>
                ${this.label}
                ${this.required ? html`<span class="required-indicator">*</span>` : ''}
              </label>
            `
          : ''}
        <div class="input-container">
          ${hasStartIcon ? html`<lt-icon class="icon-start" name=${this.iconStart}></lt-icon>` : ''}
          ${isMultiline
            ? html`
                <textarea
                  .value=${this.value}
                  placeholder=${this.placeholder}
                  rows=${this.rows}
                  ?disabled=${this.disabled}
                  ?required=${this.required}
                  ?readonly=${this.readonly}
                  @input=${this.handleInput}
                  @change=${this.handleChange}
                  aria-label=${this.label || this.placeholder}
                  aria-invalid=${this.variant === 'error' ? 'true' : 'false'}
                  class=${hasStartIcon ? 'has-start-icon' : ''} ${hasEndIcon ? 'has-end-icon' : ''}
                ></textarea>
              `
            : html`
                <input
                  type=${actualInputType}
                  .value=${this.value}
                  placeholder=${this.placeholder}
                  ?disabled=${this.disabled}
                  ?required=${this.required}
                  ?readonly=${this.readonly}
                  @input=${this.handleInput}
                  @change=${this.handleChange}
                  aria-label=${this.label || this.placeholder}
                  aria-invalid=${this.variant === 'error' ? 'true' : 'false'}
                  class=${hasStartIcon ? 'has-start-icon' : ''} ${hasEndIcon ? 'has-end-icon' : ''}
                />
              `}
          ${hasEndIcon
            ? html`
                <lt-icon
                  class="icon-end ${isPasswordField ? 'password-toggle' : 'variant-icon'}"
                  name=${endIconName}
                  @click=${isPasswordField ? this.togglePasswordVisibility : null}
                ></lt-icon>
              `
            : ''}
        </div>
        ${this.helperText ? html`<div class="helper-text">${this.helperText}</div>` : ''}
      </div>
    `;
  }
}
