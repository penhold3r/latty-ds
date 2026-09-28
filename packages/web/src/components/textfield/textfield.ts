import { html, PropertyValues } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ThemeableElement } from '../../base';
import { customElement, property, state } from 'lit/decorators.js';

import { textfieldStyles } from './textfield.styles';
import { HelperText, TextfieldSize, TextfieldType, TextfieldVariant } from './textfield.types';
import { FormDefaultController } from '../shared/form-default';
import { FormDisabledController } from '../shared/form-disabled';
import { toValidityFlags } from '../shared/form-validity';
import '@latty-ds/icons';
import '../text/text';

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
export class Textfield extends ThemeableElement {
  static styles = textfieldStyles;
  static formAssociated = true;

  private _internals!: ElementInternals;
  private _default = new FormDefaultController(this, () => this.value);
  private _fieldsetDisabled = new FormDisabledController(this);

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

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
   * Current value of the input. Not reflected as an attribute: for `type="password"` that would put whatever
   * the user types in plain text in the DOM (`outerHTML`, DevTools, session-replay/DOM-mutation recorders) —
   * visible via `getAttribute('value')`/`[value]` regardless of input type. Read the property, or the
   * `input`/`change` event's `detail.value`, instead of an attribute selector.
   * @default ''
   */
  @property() value = '';

  /**
   * Placeholder text shown when input is empty.
   * @default ''
   */
  @property({ reflect: true }) placeholder = '';

  /**
   * Label text displayed above the input.
   * @default ''
   */
  @property({ reflect: true }) label = '';

  /**
   * Name used when submitting a form.
   * @default ''
   */
  @property({ reflect: true }) name = '';

  /**
   * Helper text displayed below the input. Can be a static string or a function
   * that receives the current error state and returns the string to display.
   * Color changes based on variant or auto-error state.
   * @default ''
   */
  @property({ attribute: 'helper-text' }) helperText: HelperText = '';

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
   * For type="number": minimum allowed value.
   * For all other types: minimum character length.
   * @default null
   */
  @property({ type: Number }) min: number | null = null;

  /**
   * For type="number": maximum allowed value.
   * For all other types: maximum character length.
   * @default null
   */
  @property({ type: Number }) max: number | null = null;

  /**
   * Renders the label in small caps with wider letter spacing.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) uppercase = false;

  @state() private isPasswordVisible = false;
  @state() private _touched = false;
  @state() private _autoError = false;

  private _onBlur = (e: Event) => {
    const native = e.target as HTMLInputElement | HTMLTextAreaElement;
    this.value = native.value;
    this._touched = true;
    this._autoError = !this._validate();
  };

  /**
   * Handles input events from the native input or textarea element.
   * Updates the component's value property and dispatches a custom input event.
   *
   * @param e - The native input event
   * @private
   */
  private _validate(): boolean {
    const v = this.value;
    if (!v) return true;
    if (this.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return false;
    if (this.type === 'url') {
      try {
        new URL(v);
      } catch {
        return false;
      }
    }
    if (this.type === 'tel' && !/^[+\d][\d\s()\-.]{2,}$/.test(v)) return false;
    if (this.type === 'number') {
      const n = Number(v);
      if (isNaN(n)) return false;
      if (this.min !== null && n < this.min) return false;
      if (this.max !== null && n > this.max) return false;
    } else {
      if (this.min !== null && v.length < this.min) return false;
      if (this.max !== null && v.length > this.max) return false;
    }
    return true;
  }

  private handleInput(e: Event) {
    // The native input/change event is composed, so it would otherwise keep
    // bubbling past the shadow boundary after we re-dispatch our own —
    // double-firing the same event name on the host with the wrong detail shape.
    e.stopPropagation();
    const input = e.target as HTMLInputElement | HTMLTextAreaElement;
    this.value = input.value;
    if (this._touched) this._autoError = !this._validate();
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
    e.stopPropagation();
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

  // A native single-line <input> inside a <form> implicitly submits the form on Enter; the inner input here is
  // in the shadow DOM, so the browser never wires that up on its own (TFD-2). Not on the multiline textarea —
  // a native <textarea> never implicit-submits on Enter either, since Enter there means "new line".
  private _onKeydown = (e: KeyboardEvent) => {
    if (e.key !== 'Enter' || e.isComposing || this._isDisabled) return;
    const form = this.closest('form') as HTMLFormElement | null;
    form?.requestSubmit();
  };

  /**
   * Toggles password visibility for password-type inputs.
   * Switches between showing plain text and masked password.
   *
   * @private
   */
  private togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  // Clicking the toggle would otherwise focus the button first (the default mousedown action), moving the
  // caret out of the field. Suppressing just that default action leaves the click itself untouched, and the
  // input stays focused throughout.
  private _preventFocusSteal(e: MouseEvent) {
    e.preventDefault();
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
    if (this.type === 'password') return this.isPasswordVisible ? 'eye-off' : 'eye';
    const effectiveVariant = this._autoError ? 'error' : this.variant;
    switch (effectiveVariant) {
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

  override updated(changed: PropertyValues) {
    super.updated(changed);
    this.toggleAttribute('data-invalid', this._autoError);
    this._internals.setFormValue(this.value || null);
    const inner = (this.shadowRoot!.querySelector('input') ?? this.shadowRoot!.querySelector('textarea')) as
      | HTMLInputElement
      | HTMLTextAreaElement
      | null;
    if (!inner) return;
    // The native `type`/`min`/`max`/`minlength`/`maxlength`/`required` attributes are already forwarded onto
    // the inner control (TFD-3), so its own `validity` already covers valueMissing, typeMismatch (email/url),
    // rangeUnderflow/Overflow (number), and tooShort/tooLong for free — mirror that first. `_validate()`'s extra
    // rules (currently just the `tel` format, which HTML has no native constraint for) become `customError`.
    if (!inner.validity.valid) {
      this._internals.setValidity(toValidityFlags(inner.validity), inner.validationMessage, inner);
    } else if (!this._validate()) {
      this._internals.setValidity({ customError: true }, 'Please match the requested format', inner);
    } else {
      this._internals.setValidity({});
    }
  }

  formResetCallback() {
    this.value = this._default.value;
    this._touched = false;
    this._autoError = false;
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

  render() {
    const hasStartIcon = Boolean(this.iconStart);
    const isPasswordField = this.type === 'password';
    const isMultiline = this.type === 'multiline';
    const isNumber = this.type === 'number';
    const endIconName = this.getEndIconName();
    const hasEndIcon = Boolean(endIconName);
    const actualInputType = isPasswordField && this.isPasswordVisible ? 'text' : this.type;
    const isInvalid = this._autoError || this.variant === 'error';
    const resolvedHelperText = typeof this.helperText === 'function' ? this.helperText(isInvalid) : this.helperText;

    return html`
      <div class="wrapper">
        ${this.label
          ? html`
              <label>
                <lt-text variant="label" as="span">${this.label}</lt-text>
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
                  name=${ifDefined(this.name || undefined)}
                  placeholder=${this.placeholder}
                  rows=${this.rows}
                  minlength=${ifDefined(this.min !== null ? this.min : undefined)}
                  maxlength=${ifDefined(this.max !== null ? this.max : undefined)}
                  ?disabled=${this._isDisabled}
                  ?required=${this.required}
                  ?readonly=${this.readonly}
                  @input=${this.handleInput}
                  @change=${this.handleChange}
                  @blur=${this._onBlur}
                  aria-label=${this.label || this.placeholder}
                  aria-invalid=${isInvalid ? 'true' : 'false'}
                  class=${classMap({ 'has-start-icon': hasStartIcon, 'has-end-icon': hasEndIcon })}
                ></textarea>
              `
            : html`
                <input
                  type=${actualInputType}
                  .value=${this.value}
                  name=${ifDefined(this.name || undefined)}
                  placeholder=${this.placeholder}
                  min=${ifDefined(isNumber && this.min !== null ? this.min : undefined)}
                  max=${ifDefined(isNumber && this.max !== null ? this.max : undefined)}
                  minlength=${ifDefined(!isNumber && this.min !== null ? this.min : undefined)}
                  maxlength=${ifDefined(!isNumber && this.max !== null ? this.max : undefined)}
                  ?disabled=${this._isDisabled}
                  ?required=${this.required}
                  ?readonly=${this.readonly}
                  @input=${this.handleInput}
                  @change=${this.handleChange}
                  @blur=${this._onBlur}
                  @keydown=${this._onKeydown}
                  aria-label=${this.label || this.placeholder}
                  aria-invalid=${isInvalid ? 'true' : 'false'}
                  class=${classMap({ 'has-start-icon': hasStartIcon, 'has-end-icon': hasEndIcon })}
                />
              `}
          ${hasEndIcon
            ? isPasswordField
              ? html`
                  <button
                    type="button"
                    class="icon-end password-toggle"
                    ?disabled=${this._isDisabled}
                    aria-label=${this.isPasswordVisible ? 'Hide password' : 'Show password'}
                    aria-pressed=${this.isPasswordVisible ? 'true' : 'false'}
                    @mousedown=${this._preventFocusSteal}
                    @click=${this.togglePasswordVisibility}
                  >
                    <lt-icon name=${endIconName}></lt-icon>
                  </button>
                `
              : html`<lt-icon class="icon-end variant-icon" name=${endIconName}></lt-icon>`
            : ''}
        </div>
        ${resolvedHelperText
          ? html`<lt-text variant="caption" as="span" class="helper-text">${resolvedHelperText}</lt-text>`
          : ''}
      </div>
    `;
  }
}
