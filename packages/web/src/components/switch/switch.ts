import { html, nothing } from 'lit';
import { FormControlElement } from '../../base';
import { devWarn } from '../../utils';
import { customElement, property } from 'lit/decorators.js';

import { switchStyles } from './switch.styles';
import { SwitchSize, SwitchVariant, SwitchLabelPosition, type SwitchLabels } from './switch.types';
import { SlottedContentController } from '../shared/slotted-content';
import { NativeAttrsController } from '../shared/native-attrs';
import { createFieldIds } from '../shared/form-field';

import '../text/text';

const DEFAULT_LABELS: SwitchLabels = {
  validationMessage: 'Please check this switch'
};

/**
 * A toggle switch component with sliding animation.
 * Internally uses a checkbox input with custom toggle styling.
 *
 * @element lt-switch
 *
 * @slot - Rich label content, in place of the `label` attribute. Falls back to `label` when nothing is slotted.
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
export class Switch extends FormControlElement {
  static styles = switchStyles;

  private _slotted = new SlottedContentController(this);
  private readonly _fieldIds = createFieldIds();
  private _nativeAttrs = new NativeAttrsController(this, () => this.shadowRoot?.querySelector('input'), {
    exclude: ['aria-label', 'aria-checked', 'aria-describedby']
  });

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
   * Whether the switch is checked (on). Not reflected as an attribute — a native checkbox's `checked` _content_
   * attribute stays fixed at the markup default and never tracks interaction; reflecting it live meant
   * `formResetCallback` could no longer tell what the original default was. Read the property, or the `change`
   * event's `detail.checked`, instead of `[checked]`/`hasAttribute('checked')`.
   * @default false
   */
  @property({ type: Boolean }) checked = false;

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
   * Value attribute for form submission.
   * @default 'on'
   */
  @property({ reflect: true }) value = 'on';

  /**
   * Helper or error text displayed below the switch. Colored for the error variant when `variant="error"`.
   * @default ''
   */
  @property({ attribute: 'helper-text' }) helperText = '';

  /** Overridable UI text (the required-field validation message), for i18n. English defaults — override only the keys you need. */
  @property({ type: Object }) labels: Partial<SwitchLabels> = {};

  private get _labels(): SwitchLabels {
    return { ...DEFAULT_LABELS, ...this.labels };
  }

  updated() {
    this._internals.setFormValue(this.checked ? this.value : null);
    const input = this.shadowRoot?.querySelector<HTMLElement>('input');
    if (this.required && !this.checked && input) {
      this._internals.setValidity({ valueMissing: true }, this._labels.validationMessage, input);
    } else {
      this._internals.setValidity({});
    }
  }

  /**
   * A toggleable control's value is its checked state — what a form reset restores and what a browser
   * state-restore repopulates. The value it *submits* is `this.value` while checked and nothing at all
   * while not (see `updated()`), which is exactly how a native checkbox behaves.
   */
  protected override get _formValue(): boolean {
    return this.checked;
  }

  protected override set _formValue(value: unknown) {
    this.checked = Boolean(value);
  }

  /**
   * A toggleable control's saved state is its `value` string — or nothing at all, when it was
   * unchecked — so restored checkedness means "the saved value is this control's own value".
   */
  protected override _restoreFormState(state: File | string | FormData | null): void {
    this.checked = typeof state === 'string' && state === this.value;
  }

  private handleChange(e: Event) {
    // Stop the native (composed) change event from also bubbling past the
    // shadow boundary — otherwise it double-fires 'change' on the host after
    // our own CustomEvent, with the wrong (non-{checked}) detail shape.
    e.stopPropagation();
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

  protected firstUpdated() {
    if (!this.label && !this._slotted.hasContent) {
      devWarn('lt-switch', 'no `label` and no slotted content — the switch has no accessible name');
    }
  }

  render() {
    const hasLabel = Boolean(this.label) || this._slotted.hasContent;
    return html`
      <label class="switch-wrapper">
        <div class="switch-container">
          <input
            type="checkbox"
            .checked=${this.checked}
            ?disabled=${this._isDisabled}
            ?required=${this.required}
            value=${this.value}
            @change=${this.handleChange}
            aria-label=${hasLabel ? nothing : this.getAttribute('aria-label') || 'switch'}
            role="switch"
            aria-checked=${this.checked ? 'true' : 'false'}
            aria-describedby=${this.helperText ? this._fieldIds.helper : nothing}
          />
          <span class="thumb"></span>
        </div>
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
