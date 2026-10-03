import { enabledItems, rovingTargetOf, stepIndex } from '../shared/roving';
import { createFieldIds } from '../shared/form-field';
import { html, nothing } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';

import { radioGroupStyles } from './radio-group.styles';
import { RadioGroupOrientation } from './radio-group.types';
import type { Radio } from '../radio/radio';
import '../text/text';

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
export class RadioGroup extends ThemeableElement {
  static styles = radioGroupStyles;

  /**
   * Label for the radio group.
   * @default ''
   */
  @property({ reflect: true }) label = '';

  /**
   * Name attribute applied to all radio buttons in the group.
   * Ensures only one radio can be selected at a time.
   * @default ''
   */
  @property({ reflect: true }) name = '';

  /**
   * Currently selected value in the group.
   * @default ''
   */
  @property({ reflect: true }) value = '';

  /**
   * Layout orientation of the radio buttons.
   * @default 'vertical'
   */
  @property({ reflect: true }) orientation: RadioGroupOrientation = 'vertical';

  /**
   * Helper text displayed below the radio group.
   * @default ''
   */
  private readonly _fieldIds = createFieldIds();

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

  // Reacts to a slotted radio's `disabled` attribute changing after the fact (e.g. a consumer disabling one
  // dynamically, with no accompanying change to this group's own value/name), so the roving tabindex and
  // keyboard navigation immediately stop landing on it.
  private readonly _radioObserver = new MutationObserver(() => this._syncRadios());

  connectedCallback() {
    super.connectedCallback();
    this._radioObserver.observe(this, { attributes: true, attributeFilter: ['disabled'], subtree: true });
    // Re-attaches listeners after a reconnect (moving the group in the DOM disconnects and reconnects it
    // without re-running firstUpdated, which only ever fires once). Harmless to call before the first render
    // too — _syncRadios no-ops when `this.radios` isn't populated yet.
    this._syncRadios();
  }

  firstUpdated() {
    // Seed `value` from markup (a radio with `checked` and no explicit group `value`) before the first sync,
    // so that sync doesn't see an empty `value`, match it against no radio, and uncheck the one that should stay.
    if (!this.value) {
      const checkedRadio = this.radios?.find((r) => r.checked);
      if (checkedRadio) this.value = checkedRadio.value;
    }
    this._syncRadios();
  }

  /**
   * Wires each radio's `name`, roving tabindex, and listeners, and drives `checked` from this group's `value` —
   * the direction a consumer setting `group.value = '…'` needs, since that's a plain property assignment on the
   * group, not a native input event any individual radio would otherwise react to.
   * @private
   */
  private _syncRadios() {
    if (!this.radios) return;

    // Roving tabindex (native radiogroup behavior): only one radio is ever a Tab stop. It's the checked one,
    // or — if none is checked, or the checked one is disabled — the first enabled radio, so the group is still
    // reachable in one Tab press.
    const enabled = enabledItems(this.radios);
    const rovingTarget = rovingTargetOf(enabled, this.value);

    this.radios.forEach((radio) => {
      if (this.name) radio.name = this.name;
      radio.checked = radio.value === this.value;
      radio.tabbable = radio === rovingTarget;
      // Re-adding the same bound function reference is a no-op per addEventListener's own de-duplication, so
      // calling this on every sync (slotchange, value/name changes, a reconnect) never stacks up listeners —
      // and, unlike a "have I seen this one before" set, it also re-attaches one a disconnect actually removed.
      radio.addEventListener('change', this.handleRadioChange as EventListener);
      radio.addEventListener('keydown', this.handleRadioKeydown as EventListener);
    });
  }

  /**
   * Selects a radio (used by both the native-change and keyboard-navigation handlers below).
   * @private
   */
  private _select(radio: Radio) {
    if (radio.disabled || radio.value === this.value) return;

    this.value = radio.value;

    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true
      })
    );
  }

  /**
   * Handles change events from individual radio buttons.
   *
   * @param e - The change event from a radio button
   * @private
   */
  private handleRadioChange = (e: CustomEvent) => {
    const radio = e.target as Radio;
    if (!radio.checked) return;

    // The radio already excluded the rest of the group itself (see lt-radio's own registry-based mutual
    // exclusion) — stop its event here rather than let it also reach whatever's outside this group, which
    // would otherwise double-fire 'change' with two different detail shapes for one selection.
    e.stopPropagation();
    this._select(radio);
  };

  /**
   * Arrow keys move the roving tab stop and, per the native radiogroup's automatic-activation model, select the
   * radio moved to — matching a real `<input type="radio">` group, where arrowing both moves focus and checks
   * the newly-focused button. All four directions move (Right/Down forward, Left/Up back), disabled radios are
   * skipped entirely, and it wraps at both ends.
   * @private
   */
  private handleRadioKeydown = (e: KeyboardEvent) => {
    const enabled = enabledItems(this.radios ?? []);
    if (enabled.length === 0) return;

    const index = enabled.indexOf(e.currentTarget as Radio);
    let next: Radio | undefined;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        next = enabled[stepIndex(index, enabled.length, 1)];
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        next = enabled[stepIndex(index, enabled.length, -1)];
        break;
    }
    if (!next) return;

    e.preventDefault();
    this._select(next);
    next.focus();
  };

  /**
   * Handles slot changes to update radios when content changes.
   * @private
   */
  private handleSlotChange() {
    this._syncRadios();
  }

  /**
   * A group `value` set by the consumer (`group.value = '…'`) is a plain property assignment — it doesn't pass
   * through any radio's own change handling, so this is what drives `checked` on the radios to match it.
   */
  protected updated(changed: Map<string, unknown>) {
    super.updated(changed);
    if (changed.has('value') || changed.has('name')) this._syncRadios();
  }

  /**
   * Cleanup event listeners when component is removed.
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this._radioObserver.disconnect();
    if (this.radios) {
      this.radios.forEach((radio) => {
        radio.removeEventListener('change', this.handleRadioChange as EventListener);
        radio.removeEventListener('keydown', this.handleRadioKeydown as EventListener);
      });
    }
  }

  render() {
    return html`
      <div
        class="radio-group"
        role="radiogroup"
        aria-label=${this.label || nothing}
        aria-describedby=${this.helperText ? this._fieldIds.helper : nothing}
      >
        ${this.label
          ? html`
              <div class="label">
                <lt-text variant="label" as="span">${this.label}</lt-text>
                ${this.required ? html`<span class="required-indicator">*</span>` : ''}
              </div>
            `
          : ''}
        <div class="radios-container">
          <slot @slotchange=${this.handleSlotChange}></slot>
        </div>
        ${this.helperText
          ? html`<lt-text id=${this._fieldIds.helper} variant="caption" as="span" class="helper-text"
              >${this.helperText}</lt-text
            >`
          : ''}
      </div>
    `;
  }
}
