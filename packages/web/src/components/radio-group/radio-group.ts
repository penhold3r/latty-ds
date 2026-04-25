import { LitElement, html } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';

import { radioGroupStyles } from './radio-group.styles';
import { RadioGroupOrientation } from './radio-group.types';
import type { Radio } from '../radio/radio';

/**
 * A container component that manages a group of radio buttons.
 *
 * @element lt-radio-group
 *
 * @fires {CustomEvent<{value: string}>} change - Dispatched when a radio in the group is selected
 *
 * @slot - Radio buttons to be managed by this group
 *
 * @example
 * ```html
 * <lt-radio-group label="Choose a plan" name="plan">
 *   <lt-radio value="free" label="Free"></lt-radio>
 *   <lt-radio value="pro" label="Pro" checked></lt-radio>
 *   <lt-radio value="enterprise" label="Enterprise"></lt-radio>
 * </lt-radio-group>
 * ```
 *
 * @example
 * ```html
 * <lt-radio-group
 *   label="Shipping method"
 *   name="shipping"
 *   orientation="horizontal"
 *   helper-text="Choose your preferred shipping method"
 * >
 *   <lt-radio value="standard" label="Standard"></lt-radio>
 *   <lt-radio value="express" label="Express"></lt-radio>
 *   <lt-radio value="overnight" label="Overnight"></lt-radio>
 * </lt-radio-group>
 * ```
 */
@customElement('lt-radio-group')
export class RadioGroup extends LitElement {
  static styles = radioGroupStyles;

  /**
   * Label for the radio group.
   * @default ''
   */
  @property() label = '';

  /**
   * Name attribute applied to all radio buttons in the group.
   * Ensures only one radio can be selected at a time.
   * @default ''
   */
  @property() name = '';

  /**
   * Currently selected value in the group.
   * @default ''
   */
  @property() value = '';

  /**
   * Layout orientation of the radio buttons.
   * @default 'vertical'
   */
  @property({ reflect: true }) orientation: RadioGroupOrientation = 'vertical';

  /**
   * Helper text displayed below the radio group.
   * @default ''
   */
  @property({ attribute: 'helper-text' }) helperText = '';

  /**
   * Whether the radio group is in an error state.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) error = false;

  /**
   * Whether selection is required.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) required = false;

  /**
   * Reference to all slotted radio elements.
   * @private
   */
  @queryAssignedElements({ selector: 'lt-radio' })
  private radios!: Radio[];

  private _attached = new WeakSet<Radio>();

  firstUpdated() {
    this._syncRadios();
    const checkedRadio = this.radios?.find((r) => r.checked);
    if (checkedRadio && !this.value) {
      this.value = checkedRadio.value;
    }
  }

  private _syncRadios() {
    if (!this.radios) return;
    this.radios.forEach((radio) => {
      if (this.name) radio.name = this.name;
      if (!this._attached.has(radio)) {
        radio.addEventListener('change', this.handleRadioChange as EventListener);
        this._attached.add(radio);
      }
    });
  }

  /**
   * Handles change events from individual radio buttons.
   * Updates the group value and ensures only one radio is checked.
   *
   * @param e - The change event from a radio button
   * @private
   */
  private handleRadioChange = (e: CustomEvent) => {
    const radio = e.target as Radio;

    if (radio.checked) {
      this.value = radio.value;

      // Uncheck all other radios
      this.radios.forEach((r) => {
        if (r !== radio) {
          r.checked = false;
        }
      });

      // Dispatch group-level change event
      this.dispatchEvent(
        new CustomEvent('change', {
          detail: { value: this.value },
          bubbles: true,
          composed: true
        })
      );
    }
  };

  /**
   * Handles slot changes to update radios when content changes.
   * @private
   */
  private handleSlotChange() {
    this._syncRadios();
  }

  /**
   * Cleanup event listeners when component is removed.
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.radios) {
      this.radios.forEach((radio) => {
        radio.removeEventListener('change', this.handleRadioChange as EventListener);
      });
    }
  }

  render() {
    return html`
      <div class="radio-group" role="radiogroup" aria-label=${this.label}>
        ${this.label
          ? html`
              <div class="label">
                ${this.label}
                ${this.required ? html`<span class="required-indicator">*</span>` : ''}
              </div>
            `
          : ''}
        <div class="radios-container">
          <slot @slotchange=${this.handleSlotChange}></slot>
        </div>
        ${this.helperText ? html`<div class="helper-text">${this.helperText}</div>` : ''}
      </div>
    `;
  }
}
