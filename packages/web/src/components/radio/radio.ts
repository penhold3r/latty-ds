import { html, type PropertyValues } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property } from 'lit/decorators.js';

import { radioStyles } from './radio.styles';
import { RadioSize, RadioVariant, RadioLabelPosition } from './radio.types';

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
export class Radio extends ThemeableElement {
  static styles = radioStyles;
  static formAssociated = true;

  private _internals!: ElementInternals;
  private _group: Set<Radio> | null = null;

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

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

  updated() {
    this._internals.setFormValue(this.checked ? this.value : null);
    const input = this.shadowRoot?.querySelector<HTMLElement>('input');
    if (this.required && !this.checked && input) {
      this._internals.setValidity({ valueMissing: true }, 'Please select this option', input);
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
   * Handles radio change events.
   * Updates the checked state and dispatches a custom change event.
   *
   * @param e - The native change event
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
