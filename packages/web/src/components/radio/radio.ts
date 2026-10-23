import { html, nothing, LitElement, type PropertyValues } from 'lit';
import { FormControlElement } from '../../base';
import { devWarn } from '../../utils';
import { customElement, property } from 'lit/decorators.js';

import { radioStyles } from './radio.styles';
import { RadioSize, RadioVariant, RadioLabelPosition, type RadioLabels } from './radio.types';
import { SlottedContentController } from '../shared/slotted-content';
import { NativeAttrsController } from '../shared/native-attrs';
import { createFieldIds } from '../shared/form-field';

import '../text/text';

const DEFAULT_LABELS: RadioLabels = {
  validationMessage: 'Please select this option'
};

/**
 * Groups radios that share a `name`, scoped to the nearest form (or else the containing root — a document or
 * shadow root), matching how native `<input type="radio">` groups are scoped. This is what lets a bare
 * `<lt-radio name="…">` — one with no `lt-radio-group` wrapping it — exclude its siblings correctly: each
 * instance renders its own `<input>` in its own separate shadow root, so the browser's native grouping (which
 * only ever sees one radio input per shadow tree) can never do this on its own.
 */
const radioRegistries = new WeakMap<Node, Map<string, Set<Radio>>>();

const radioGroupFor = (radio: Radio): Set<Radio> | null => {
  if (!radio.name) return null;
  const scope: Node = radio.closest('form') ?? radio.getRootNode();
  let byName = radioRegistries.get(scope);
  if (!byName) {
    byName = new Map();
    radioRegistries.set(scope, byName);
  }
  let group = byName.get(radio.name);
  if (!group) {
    group = new Set();
    byName.set(radio.name, group);
  }
  return group;
};

/**
 * A customizable radio button component with support for multiple variants and sizes.
 * @element lt-radio
 * @slot - Rich label content, in place of the `label` attribute. Falls back to `label` when nothing is slotted.
 * @fires {CustomEvent<{value: string, checked: boolean}>} change - Dispatched when the radio is selected
 * @example
 * ```html
 * <lt-radio name="size" value="small" label="Small"></lt-radio>
 * <lt-radio name="size" value="medium" label="Medium" checked></lt-radio>
 * <lt-radio name="size" value="large" label="Large"></lt-radio>
 * ```
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
export class Radio extends FormControlElement {
  static styles = radioStyles;
  // Makes host.focus() move focus into the shadow root (the inner <input>) — lt-radio-group needs this to move
  // focus programmatically for arrow-key navigation, the same way lt-button's delegatesFocus
  // lets lt-dropdown do the same for its trigger.
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  private _group: Set<Radio> | null = null;
  private _slotted = new SlottedContentController(this);
  private readonly _fieldIds = createFieldIds();
  private _nativeAttrs = new NativeAttrsController(this, () => this.shadowRoot?.querySelector('input'), {
    exclude: ['aria-label', 'aria-describedby']
  });

  connectedCallback() {
    super.connectedCallback();
    this._joinGroup();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._group?.delete(this);
    this._group = null;
  }

  override willUpdate(changed: PropertyValues<this>) {
    super.willUpdate(changed);
    // A renamed radio (e.g. lt-radio-group re-assigning `name`) needs to leave its old group and join the new
    // one — otherwise it would keep excluding radios it no longer shares a name with.
    if (changed.has('name')) this._joinGroup();
  }

  private _joinGroup() {
    this._group?.delete(this);
    this._group = radioGroupFor(this);
    this._group?.add(this);
  }

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
   * Whether the radio is checked. Not reflected as an attribute — a native radio's `checked` _content_
   * attribute stays fixed at the markup default and never tracks interaction; reflecting it live meant
   * `formResetCallback` could no longer tell what the original default was. Read the property, or the `change`
   * event's `detail.checked`, instead of `[checked]`/`hasAttribute('checked')`.
   * @default false
   */
  @property({ type: Boolean }) checked = false;

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
  @property({ reflect: true }) label = '';

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
  @property({ reflect: true }) name = '';

  /**
   * Value attribute for form submission.
   * @default ''
   */
  @property({ reflect: true }) value = '';

  /**
   * Helper or error text displayed below the radio. Colored for the error variant when `variant="error"`.
   * @default ''
   */
  @property({ attribute: 'helper-text' }) helperText = '';

  /**
   * Whether this radio is reachable with Tab. Defaults to true for a standalone radio; `lt-radio-group` drives
   * this itself for its managed radios — a roving tabindex (only the checked radio, or the first enabled one,
   * is a Tab stop), matching the native radiogroup pattern.
   * @default true
   */
  @property({ type: Boolean }) tabbable = true;

  /** Overridable UI text (the required-field validation message), for i18n. English defaults — override only the keys you need. */
  @property({ type: Object }) labels: Partial<RadioLabels> = {};

  private get _labels(): RadioLabels {
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

  /**
   * Handles radio change events.
   * Updates the checked state and dispatches a custom change event.
   * @param e - The native change event.
   * @private
   */
  private handleChange(e: Event) {
    // Stop the native (composed) change event from also bubbling past the
    // shadow boundary — otherwise it double-fires 'change' on the host after
    // our own CustomEvent, with the wrong (non-{value, checked}) detail shape.
    e.stopPropagation();
    const target = e.target as HTMLInputElement;
    this.checked = target.checked;

    // Exclude the rest of the group directly — native <input> grouping can't do this itself, since each
    // instance's input lives in its own separate shadow root (see radioGroupFor's doc comment).
    if (this.checked) {
      this._group?.forEach((other) => {
        if (other !== this) other.checked = false;
      });
    }

    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: this.value, checked: this.checked },
        bubbles: true,
        composed: true
      })
    );
  }

  protected firstUpdated() {
    if (!this.label && !this._slotted.hasContent) {
      devWarn('lt-radio', 'no `label` and no slotted content — the radio has no accessible name');
    }
  }

  render() {
    const hasLabel = Boolean(this.label) || this._slotted.hasContent;
    return html`
      <label class="radio-wrapper">
        <div class="radio-container">
          <input
            type="radio"
            .checked=${this.checked}
            ?disabled=${this._isDisabled}
            ?required=${this.required}
            name=${this.name}
            value=${this.value}
            tabindex=${this.tabbable ? '0' : '-1'}
            @change=${this.handleChange}
            aria-label=${hasLabel ? nothing : this.getAttribute('aria-label') || 'radio'}
            aria-describedby=${this.helperText ? this._fieldIds.helper : nothing}
          />
          <span class="dot"></span>
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
