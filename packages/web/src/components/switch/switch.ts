import { html } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property } from 'lit/decorators.js';

import { switchStyles } from './switch.styles';
import { SwitchSize, SwitchVariant, SwitchLabelPosition } from './switch.types';

/**
 * A toggle switch component with sliding animation.
 * Internally uses a checkbox input with custom toggle styling.
 *
 * @element lt-switch
 *
 * @fires {CustomEvent<{checked: boolean}>} change - Dispatched when the switch state changes
 *
 * @example
 * ```html
 * <lt-switch label="Enable notifications"></lt-switch>
 * ```
 *
 * @example
 * ```html
 * <lt-switch
 *   variant="success"
 *   label="Dark mode"
 *   checked
 * ></lt-switch>
 * ```
 *
 * @example
 * ```html
 * <lt-switch
 *   variant="error"
 *   label="Delete on exit"
 *   disabled
 * ></lt-switch>
 * ```
 */
@customElement('lt-switch')
export class Switch extends ThemeableElement {
  static styles = switchStyles;
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
  @property({ reflect: true }) variant: SwitchVariant = 'primary';

  /**
   * Size of the switch.
   * @default 'md'
   */
  @property({ reflect: true }) size: SwitchSize = 'md';

  /**
   * Whether the switch is checked (on).
   * @default false
   */
  @property({ type: Boolean, reflect: true }) checked = false;

  /**
   * Whether the switch is disabled.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * Whether the switch is required.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) required = false;

  /**
   * Label text displayed next to the switch.
   * @default ''
   */
  @property({ reflect: true }) label = '';

  /**
   * Position of the label relative to the switch.
   * @default 'right'
   */
  @property({ attribute: 'label-position', reflect: true }) labelPosition: SwitchLabelPosition = 'right';

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
   * Handles switch change events.
   * Updates the checked state and dispatches a custom change event.
   *
   * @param e - The native change event
   * @private
   */
  updated() {
    this._internals.setFormValue(this.checked ? this.value : null);
    const input = this.shadowRoot?.querySelector<HTMLElement>('input');
    if (this.required && !this.checked && input) {
      this._internals.setValidity({ valueMissing: true }, 'Please check this switch', input);
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

  private handleChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.checked = target.checked;

    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { checked: this.checked },
        bubbles: true,
        composed: true
      })
    );
  }

  render() {
    return html`
      <label class="switch-wrapper">
        <div class="switch-container">
          <input
            type="checkbox"
            .checked=${this.checked}
            ?disabled=${this.disabled}
            ?required=${this.required}
            name=${this.name}
            value=${this.value}
            @change=${this.handleChange}
            aria-label=${this.label || 'switch'}
            role="switch"
            aria-checked=${this.checked ? 'true' : 'false'}
          />
          <span class="thumb"></span>
        </div>
        ${this.label ? html`<span class="label">${this.label}</span>` : ''}
      </label>
    `;
  }
}
