import { html, nothing } from 'lit';
import { ThemeableElement } from '../../base';
import { devWarn } from '../../utils';
import { customElement, property, query } from 'lit/decorators.js';

import { checkboxStyles } from './checkbox.styles';
import { CheckboxSize, CheckboxVariant, CheckboxLabelPosition, type CheckboxLabels } from './checkbox.types';
import { FormDefaultController } from '../shared/form-default';
import { FormDisabledController } from '../shared/form-disabled';
import { SlottedContentController } from '../shared/slotted-content';
import { createFieldIds } from '../shared/form-field';

import '@latty-ds/icons';
import '../text/text';

const DEFAULT_LABELS: CheckboxLabels = {
  validationMessage: 'Please check this box'
};

/**
 * A customizable checkbox component with support for multiple variants and sizes.
 *
 * @element lt-checkbox
 *
 * @slot - Rich label content, in place of the `label` attribute (e.g. a link inside the label text). Falls back
 *   to `label` when nothing is slotted.
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
 * <lt-checkbox name="terms" required>
 *   I agree to the <a href="/terms">terms of service</a>
 * </lt-checkbox>
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
  private _default = new FormDefaultController(this, () => this.checked);
  private _fieldsetDisabled = new FormDisabledController(this);
  private _slotted = new SlottedContentController(this);
  private readonly _fieldIds = createFieldIds();

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
   * Whether the checkbox is checked. Not reflected as an attribute — a native checkbox's `checked` _content_
   * attribute stays fixed at the markup default and never tracks interaction (that's what `defaultChecked` is
   * for); reflecting it live meant `formResetCallback` could no longer tell what the original default was. Read
   * the property, or the `change` event's `detail.checked`, instead of `[checked]`/`hasAttribute('checked')`.
   * @default false
   */
  @property({ type: Boolean }) checked = false;

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
   * Helper or error text displayed below the checkbox. Colored for the error variant when `variant="error"`.
   * @default ''
   */
  @property({ attribute: 'helper-text' }) helperText = '';

  /** Overridable UI text (the required-field validation message), for i18n. English defaults — override only the keys you need. */
  @property({ type: Object }) labels: Partial<CheckboxLabels> = {};

  private get _labels(): CheckboxLabels {
    return { ...DEFAULT_LABELS, ...this.labels };
  }

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
      this._internals.setValidity({ valueMissing: true }, this._labels.validationMessage, this.input);
    } else {
      this._internals.setValidity({});
    }
  }

  formResetCallback() {
    this.checked = this._default.value;
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

  /**
   * Handles checkbox change events.
   * Updates the checked state and dispatches a custom change event.
   *
   * @param e - The native change event
   * @private
   */
  private handleChange(e: Event) {
    // Stop the native (composed) change event from also bubbling past the
    // shadow boundary — otherwise it double-fires 'change' on the host after
    // our own CustomEvent, with the wrong (non-{checked}) detail shape.
    e.stopPropagation();
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

  protected firstUpdated() {
    if (!this.label && !this._slotted.hasContent) {
      devWarn('lt-checkbox', 'no `label` and no slotted content — the checkbox has no accessible name');
    }
  }

  render() {
    const hasLabel = Boolean(this.label) || this._slotted.hasContent;
    return html`
      <label class="checkbox-wrapper">
        <span class="box">
          <input
            type="checkbox"
            .checked=${this.checked}
            ?disabled=${this._isDisabled}
            ?required=${this.required}
            name=${this.name}
            value=${this.value}
            @change=${this.handleChange}
            aria-label=${hasLabel ? nothing : 'checkbox'}
            aria-checked=${this.indeterminate ? 'mixed' : this.checked ? 'true' : 'false'}
            aria-describedby=${this.helperText ? this._fieldIds.helper : nothing}
          />
          ${this.renderCheckmark()}
        </span>
        ${hasLabel
          ? html`<span class="label"><slot @slotchange=${this._slotted.onSlotChange}>${this.label}</slot></span>`
          : html`<slot hidden @slotchange=${this._slotted.onSlotChange}>${this.label}</slot>`}
      </label>
      ${this.helperText
        ? html`<lt-text id=${this._fieldIds.helper} variant="caption" as="span" class="helper-text"
            >${this.helperText}</lt-text
          >`
        : ''}
    `;
  }
}
