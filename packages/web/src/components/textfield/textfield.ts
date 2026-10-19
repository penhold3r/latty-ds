import { html, nothing, PropertyValues } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ThemeableElement } from '../../base';
import { customElement, property, state } from 'lit/decorators.js';

import { textfieldStyles } from './textfield.styles';
import {
  HelperText,
  TextfieldInputMode,
  TextfieldSize,
  TextfieldType,
  TextfieldVariant,
  type TextfieldLabels
} from './textfield.types';
import { FormDefaultController } from '../shared/form-default';
import { FormDisabledController } from '../shared/form-disabled';
import { toValidityFlags } from '../shared/form-validity';
import '@latty-ds/icons';
import '../text/text';

let textfieldCount = 0;

const DEFAULT_LABELS: TextfieldLabels = {
  validationMessage: 'Please match the requested format',
  showPassword: 'Show password',
  hidePassword: 'Hide password',
  clear: 'Clear'
};

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
  // Stable per-instance ids for `label for` and `aria-describedby` (TFD-4) — not the host's own `id` attribute,
  // which a consumer may set for their own purposes (or leave unset).
  private readonly _uid = `lt-textfield-${textfieldCount++}`;
  private readonly _inputId = `${this._uid}-input`;
  private readonly _helperId = `${this._uid}-helper`;

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
   * Focuses the inner input/textarea once, on first render. Shadows the native `HTMLElement.autofocus` — setting
   * the content attribute alone wouldn't help, since the host itself has no `delegatesFocus` and autofocusing it
   * would be a no-op; this forwards the focus call into the real control instead.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) autofocus = false;

  /**
   * Icon name to display at the start of the input.
   * @default ''
   */
  @property({ attribute: 'icon-start' }) iconStart = '';

  /**
   * Number of visible text lines for multiline type (textarea). Also the minimum height while `autosize` is
   * set — autosize only ever grows the textarea beyond this, never shrinks it below.
   * Only applies when type="multiline".
   * @default 3
   */
  @property({ type: Number }) rows = 3;

  /**
   * Grows the textarea's height to fit its content as the user types, instead of a fixed `rows`-tall box with a
   * manual resize handle (which this disables, since a manual drag would just get overwritten by the next
   * keystroke's auto-grow). Unbounded — there's currently no built-in way to cap the grown height. Only applies
   * when `type="multiline"`.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) autosize = false;

  /**
   * Native `min` — minimum allowed value. Only applies when `type="number"`, matching native `<input>`: `min`
   * has no effect on any other input type this component supports (no `type="date"`/`"range"`/etc.). For a
   * minimum character length on a text-like type, use `minLength` instead — that's a distinct native attribute,
   * not a repurposing of this one.
   * @default null
   */
  @property({ type: Number }) min: number | null = null;

  /**
   * Native `max` — maximum allowed value. Only applies when `type="number"`. See `min`; for a maximum character
   * length on a text-like type, use `maxLength`.
   * @default null
   */
  @property({ type: Number }) max: number | null = null;

  /**
   * Native `minlength` — minimum character length required for the value to be valid. No effect when
   * `type="number"` (same as native `<input type="number" minlength>`, which HTML itself ignores) — use `min`
   * there instead.
   * @default null
   */
  @property({ type: Number, attribute: 'minlength' }) minLength: number | null = null;

  /**
   * Native `maxlength` — maximum character length allowed for the value. No effect when `type="number"` — use
   * `max` there instead. See `minLength`.
   * @default null
   */
  @property({ type: Number, attribute: 'maxlength' }) maxLength: number | null = null;

  /**
   * Renders the label in small caps with wider letter spacing.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) uppercase = false;

  /** Shows a clear button while the field has a value. Not shown for password fields, which have their own toggle. */
  @property({ type: Boolean, reflect: true }) clearable = false;

  /** Shows the character count as `length / maxLength` below the field. Uses `maxLength` as the limit, which is also enforced natively. */
  @property({ type: Boolean, reflect: true }) counter = false;

  /**
   * Native `autocomplete` hint (e.g. `'email'`, `'current-password'`, `'off'`), forwarded as-is to the inner
   * `<input>`/`<textarea>`. Not validated or enumerated here — see the HTML spec for the full token list.
   * @default ''
   */
  @property({ reflect: true }) autocomplete = '';

  /**
   * Hints the on-screen keyboard a touch device should show, forwarded as the native `inputmode` attribute on
   * the inner `<input>`/`<textarea>`. The host's own attribute stays kebab-case (`input-mode`), not `inputmode`
   * despite that being this property's native HTML spelling — changing it now would be a breaking rename for any
   * existing consumer setting the attribute directly in markup, with no real upside (the generated React wrapper
   * and the docs manifest generator both already know about the actual `input-mode` spelling via their respective
   * `ATTRIBUTE_NAME_OVERRIDES` tables — see `scripts/codegen-wrappers.mjs` / `packages/web/scripts/build-
   * manifest.mjs` — so nothing is silently desynced). A newly introduced property with no existing consumers
   * (`minLength`/`maxLength`, above) uses the true native spelling instead, for exactly that reason: no rename to
   * avoid. Typed `| ''`, not optional — `HTMLElement` already declares its own `inputMode: string` (a real DOM
   * property every element has), so this has to stay assignable to that rather than `string | undefined`.
   * @default ''
   */
  @property({ reflect: true, attribute: 'input-mode' }) inputMode: TextfieldInputMode | '' = '';

  /**
   * Native regex the value must match, forwarded as-is to the inner `<input>`. No effect on `type="multiline"`
   * (textarea) or `type="number"` — `pattern` isn't a valid attribute on either in HTML.
   * @default ''
   */
  @property({ reflect: true }) pattern = '';

  /**
   * Plain text shown before the input, inside the field's own border (e.g. a currency symbol). Deliberately a
   * string, not a slot — arbitrary slotted markup could vary in height/width enough to break the field's fixed
   * row layout, which a plain text label can't. Rendered via an explicit `String()` coercion rather than
   * interpolated directly, so a consumer bypassing the type system (plain JS, an `as any` cast) and assigning a
   * real DOM node can't get it inserted live either — Lit's child-position bindings accept any `Node` value and
   * insert it as-is, not just strings. No effect on `type="multiline"`, the same way `pattern` has none there —
   * prepending a short label in front of a multi-line paragraph doesn't read as a unit/symbol the way it does
   * for a single value.
   * @default ''
   */
  @property({ reflect: true }) prefix = '';

  /** Plain text shown after the input, inside the field's own border (e.g. a unit like "kg"). Same reasoning
   * and `type="multiline"` exception as `prefix`.
   * @default ''
   */
  @property({ reflect: true }) suffix = '';

  /** Overridable UI text (format validation message, password-toggle button labels), for i18n. English defaults — override only the keys you need. */
  @property({ type: Object }) labels: Partial<TextfieldLabels> = {};

  private get _labels(): TextfieldLabels {
    return { ...DEFAULT_LABELS, ...this.labels };
  }

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
      if (this.minLength !== null && v.length < this.minLength) return false;
      if (this.maxLength !== null && v.length > this.maxLength) return false;
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
    // Called directly here, not left to the updated() hook alone (which also calls it, for the "value changed
    // from outside typing" case below) — Lit's own update cycle is asynchronous, so waiting for it would show a
    // one-frame-or-more lag between a keystroke and the textarea actually growing. Calling it synchronously,
    // right where the native element's own content (and so its real scrollHeight) just changed, keeps it
    // feeling instant. The resulting double call from updated() afterwards is a cheap, idempotent no-op, not a
    // correctness issue — not worth a skip-next-call flag to avoid.
    if (this.autosize && this.type === 'multiline') this._resizeTextarea(input as HTMLTextAreaElement);
    this.dispatchEvent(
      new CustomEvent('input', {
        detail: { value: this.value },
        bubbles: true,
        composed: true
      })
    );
  }

  /**
   * Grows `textarea` to fit its current content, for `autosize`. Collapsing to `height: auto` first (rather than
   * reading `scrollHeight` against whatever height is already set) is required for the textarea to ever shrink
   * back down, not just grow — `scrollHeight` on an element with an explicit fixed height reports at least that
   * height regardless of how little content is actually in it.
   */
  private _resizeTextarea(textarea: HTMLTextAreaElement) {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  /**
   * Handles change events from the native input or textarea element.
   * Updates the component's value property and dispatches a custom change event.
   *
   * @param e - The native change event
   * @private
   */
  private get _showClear(): boolean {
    return this.clearable && !!this.value && !this._isDisabled && !this.readonly && this.type !== 'password';
  }

  private _clear() {
    this.value = '';
    if (this._touched) this._autoError = !this._validate();
    const detail = { value: '' };
    this.dispatchEvent(new CustomEvent('input', { detail, bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent('change', { detail, bubbles: true, composed: true }));
    this.updateComplete.then(() => {
      this.shadowRoot?.querySelector<HTMLInputElement | HTMLTextAreaElement>('input, textarea')?.focus();
    });
  }

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

  override firstUpdated(changed: PropertyValues) {
    super.firstUpdated(changed);
    if (this.autofocus) {
      this.shadowRoot!.querySelector<HTMLInputElement | HTMLTextAreaElement>('input, textarea')?.focus();
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
    // Covers every autosize-relevant change NOT already handled by handleInput()'s own direct call: the initial
    // render with a pre-filled value, and value/rows/autosize changed from outside the user's own typing (e.g. a
    // consumer sets `el.value` programmatically). No ResizeObserver, no guessed-at `changed.has(...)` gating on
    // specific props — just unconditionally re-measure on every update while autosize+multiline are both active,
    // since the call itself is cheap and idempotent; when either is off, clear any leftover inline height
    // instead, so toggling autosize off restores plain CSS-driven sizing rather than leaving it stuck at
    // whatever height it last grew to.
    if (this.type === 'multiline') {
      if (this.autosize) this._resizeTextarea(inner as HTMLTextAreaElement);
      else inner.style.height = '';
    }
    // The native `type`/`min`/`max`/`minlength`/`maxlength`/`required` attributes are already forwarded onto
    // the inner control (TFD-3), so its own `validity` already covers valueMissing, typeMismatch (email/url),
    // rangeUnderflow/Overflow (number), and tooShort/tooLong for free — mirror that first. `_validate()`'s extra
    // rules (currently just the `tel` format, which HTML has no native constraint for) become `customError`.
    if (!inner.validity.valid) {
      this._internals.setValidity(toValidityFlags(inner.validity), inner.validationMessage, inner);
    } else if (!this._validate()) {
      this._internals.setValidity({ customError: true }, this._labels.validationMessage, inner);
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
    const showClear = this._showClear;
    const hasEndIcon = Boolean(endIconName) || showClear;
    const hasPrefix = !isMultiline && Boolean(this.prefix);
    const hasSuffix = !isMultiline && Boolean(this.suffix);
    const actualInputType = isPasswordField && this.isPasswordVisible ? 'text' : this.type;
    const isInvalid = this._autoError || this.variant === 'error';
    const resolvedHelperText = typeof this.helperText === 'function' ? this.helperText(isInvalid) : this.helperText;
    // A real `<label for>` already gives the input its accessible name — an `aria-label` alongside it would
    // override that (aria-label always wins accessible-name computation) and hide the visible label text from
    // screen readers instead (TFD-4). Only fall back to `aria-label` when there's no visible label to associate.
    const ariaLabel = this.label ? undefined : this.placeholder || undefined;

    return html`
      <div class="wrapper">
        ${this.label
          ? html`
              <label for=${this._inputId}>
                <lt-text variant="label" as="span">${this.label}</lt-text>
                ${this.required ? html`<span class="required-indicator">*</span>` : ''}
              </label>
            `
          : ''}
        <div class=${classMap({ 'input-container': true, 'has-start-icon': hasStartIcon, 'has-end-icon': hasEndIcon })}>
          ${hasStartIcon ? html`<lt-icon class="icon-start" name=${this.iconStart}></lt-icon>` : ''}
          ${hasPrefix ? html`<span class="prefix">${String(this.prefix)}</span>` : ''}
          ${isMultiline
            ? html`
                <textarea
                  id=${this._inputId}
                  .value=${this.value}
                  name=${ifDefined(this.name || undefined)}
                  placeholder=${this.placeholder}
                  rows=${this.rows}
                  minlength=${ifDefined(this.minLength !== null ? this.minLength : undefined)}
                  maxlength=${ifDefined(this.maxLength !== null ? this.maxLength : undefined)}
                  autocomplete=${ifDefined(this.autocomplete || undefined)}
                  inputmode=${ifDefined(this.inputMode || undefined)}
                  ?disabled=${this._isDisabled}
                  ?required=${this.required}
                  ?readonly=${this.readonly}
                  @input=${this.handleInput}
                  @change=${this.handleChange}
                  @blur=${this._onBlur}
                  aria-label=${ifDefined(ariaLabel)}
                  aria-invalid=${isInvalid ? 'true' : 'false'}
                  aria-describedby=${resolvedHelperText ? this._helperId : nothing}
                  class=${classMap({
                    'has-start-icon': hasStartIcon,
                    'has-end-icon': hasEndIcon,
                    autosize: this.autosize
                  })}
                ></textarea>
              `
            : html`
                <input
                  id=${this._inputId}
                  type=${actualInputType}
                  .value=${this.value}
                  name=${ifDefined(this.name || undefined)}
                  placeholder=${this.placeholder}
                  min=${ifDefined(isNumber && this.min !== null ? this.min : undefined)}
                  max=${ifDefined(isNumber && this.max !== null ? this.max : undefined)}
                  minlength=${ifDefined(!isNumber && this.minLength !== null ? this.minLength : undefined)}
                  maxlength=${ifDefined(!isNumber && this.maxLength !== null ? this.maxLength : undefined)}
                  autocomplete=${ifDefined(this.autocomplete || undefined)}
                  inputmode=${ifDefined(this.inputMode || undefined)}
                  pattern=${ifDefined(!isNumber && this.pattern ? this.pattern : undefined)}
                  ?disabled=${this._isDisabled}
                  ?required=${this.required}
                  ?readonly=${this.readonly}
                  @input=${this.handleInput}
                  @change=${this.handleChange}
                  @blur=${this._onBlur}
                  @keydown=${this._onKeydown}
                  aria-label=${ifDefined(ariaLabel)}
                  aria-invalid=${isInvalid ? 'true' : 'false'}
                  aria-describedby=${resolvedHelperText ? this._helperId : nothing}
                  class="field"
                />
              `}
          ${hasSuffix ? html`<span class="suffix">${String(this.suffix)}</span>` : ''}
          ${showClear
            ? html`<button
                type="button"
                class="icon-end clear-button"
                aria-label=${this._labels.clear}
                @mousedown=${this._preventFocusSteal}
                @click=${this._clear}
              >
                <lt-icon name="xmark"></lt-icon>
              </button>`
            : ''}
          ${endIconName
            ? isPasswordField
              ? html`
                  <button
                    type="button"
                    class="icon-end password-toggle"
                    ?disabled=${this._isDisabled}
                    aria-label=${this.isPasswordVisible ? this._labels.hidePassword : this._labels.showPassword}
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
          ? html`<lt-text id=${this._helperId} variant="caption" as="span" class="helper-text"
              >${resolvedHelperText}</lt-text
            >`
          : ''}
        ${this.counter && !isNumber && this.maxLength !== null
          ? html`<lt-text variant="caption" as="span" class="counter"
              >${this.value.length} / ${this.maxLength}</lt-text
            >`
          : ''}
      </div>
    `;
  }
}
