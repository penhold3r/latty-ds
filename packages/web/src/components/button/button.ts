import { html, nothing, LitElement, type PropertyValues } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';
import { dispatch } from '../../utils';

import { buttonStyles } from './button.styles';
import { ButtonAppearance, ButtonSize, ButtonType, ButtonVariant } from './button.types';
import { NativeAttrsController } from '../shared/native-attrs';
import { FormDisabledController } from '../shared/form-disabled';

import '../spinner/';
import '@latty-ds/icons';

const SUBMITTER_ATTRS = [
  'name',
  'value',
  'formaction',
  'formenctype',
  'formmethod',
  'formnovalidate',
  'formtarget'
] as const;

/**
 * Button component with multiple variants, sizes, appearances, and loading state support.
 * Automatically forwards native `<button>` / `<a>` and `aria-*` attributes onto the inner control.
 *
 * @element lt-button
 *
 * Features:
 * - Multiple visual variants (primary, secondary, neutral, success, warning, error, info)
 * - Three appearance styles (filled, outlined, ghost)
 * - Three size options (sm, md, lg)
 * - Loading state with spinner
 * - Icon support at start and end positions
 * - Disabled state
 * - Accessible with aria-busy for loading state
 * - Automatically forwards native `<button>` / `<a>` and `aria-*` attributes onto the internal control
 * - `toggle` mode: clicking flips `pressed`, dispatches `toggle`, and reflects `aria-pressed`
 * - Renders as `<a>` when `href` is provided (link button)
 * - Form-associated: `type="submit"` submits the containing form, `type="reset"` resets it
 *
 * @fires {CustomEvent<{pressed: boolean}>} toggle - Fired when `toggle` is set and the button is clicked.
 *
 * @slot - Button label/content
 *
 * @cssprop [--lt-button-min-width=88px] - Minimum width of the button; set to `0` for compact/inline buttons
 *
 * @example
 * ```html
 * <lt-button variant="primary" size="md">Click me</lt-button>
 * ```
 *
 * @example
 * ```html
 * <lt-button href="/dashboard" variant="primary">Go to dashboard</lt-button>
 * ```
 *
 * @example
 * ```html
 * <lt-button href="https://example.com" target="_blank" variant="secondary">Open link</lt-button>
 * ```
 */
@customElement('lt-button')
export class Button extends ThemeableElement {
  static styles = buttonStyles;
  static formAssociated = true;
  // Makes host.focus() move focus into the shadow root (the inner <button>/<a>) instead of being a no-op —
  // without it, activeElement never leaves <body>, silently breaking autofocus and any focus restore that calls
  // .focus() on this element (a closed dialog/dropdown returning focus to its trigger, for example).
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  private _internals: ElementInternals;

  private _nativeAttrs = new NativeAttrsController(this, () => this.shadowRoot?.querySelector('[part="base"]'), {
    exclude: ['target', 'rel', 'aria-disabled', 'aria-busy', 'aria-label']
  });
  private _fieldsetDisabled = new FormDisabledController(this);
  // Tracks whether willUpdate() below is the one that set the host's aria-pressed, so it only ever cleans up its
  // own writes — a consumer managing aria-pressed directly (without `toggle`) must be left alone.
  private _ownsAriaPressed = false;

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

  connectedCallback() {
    super.connectedCallback();
    // Capture phase, so it runs before the event reaches anything — including a consumer's own listener on this
    // element. Needed because the native disabled attribute on the inner button doesn't reliably stop every click
    // from reaching the host: content it renders while busy (the spinner, or an icon) can end up as the browser's
    // actual click target instead of the disabled <button> itself, slipping past the native block (verified in
    // Chromium: a loading button's host listener still fires once per click). This closes that gap unconditionally.
    this.addEventListener('click', this._blockClickWhileBusy, { capture: true });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this._blockClickWhileBusy, { capture: true });
  }

  private _blockClickWhileBusy = (e: Event) => {
    if (this.disabled || this.loading || this._fieldsetDisabled.fieldsetDisabled) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  };

  formDisabledCallback(disabled: boolean) {
    this._fieldsetDisabled.setFieldsetDisabled(disabled);
  }

  override willUpdate(changed: PropertyValues<this>) {
    super.willUpdate(changed);
    // aria-pressed needs the literal ARIA strings 'true'/'false', not Lit's presence-based boolean reflection, so
    // it's written here as a host attribute instead of a `reflect: true` property — the existing
    // NativeAttrsController (already wired up above) then mirrors it onto the inner control for free, the same
    // path a consumer's own `aria-pressed` would take. Set in willUpdate(), not updated(): a ReactiveController's
    // hostUpdated() runs *before* the element's own updated() (confirmed in Lit's source), so by the time
    // updated() could set this, the controller would already have copied this cycle's (stale) host value onto the
    // inner control — willUpdate() runs before render, so the controller's hostUpdated() picks up the new value
    // in the same pass instead of needing an extra MutationObserver-triggered re-render. Only meaningful in
    // `toggle` mode; href makes this a link, and links don't have toggle-button semantics.
    if (changed.has('toggle') || changed.has('pressed') || changed.has('href')) {
      if (this.toggle && !this.href) {
        this.setAttribute('aria-pressed', this.pressed ? 'true' : 'false');
        this._ownsAriaPressed = true;
      } else if (this._ownsAriaPressed) {
        // Only remove what this logic itself set — a consumer managing aria-pressed directly (not via `toggle`)
        // must keep working, same as before `toggle` existed.
        this.removeAttribute('aria-pressed');
        this._ownsAriaPressed = false;
      }
    }
  }

  /**
   * Visual variant that determines the button's color scheme.
   * @default 'primary'
   */
  @property({ reflect: true }) variant: ButtonVariant = 'primary';

  /**
   * Appearance style (filled, outlined, or ghost).
   * @default 'filled'
   */
  @property({ reflect: true }) appearance: ButtonAppearance = 'filled';

  /**
   * Adds a variant-colored border on top of the current appearance. A no-op on
   * `outlined` (which already has one); adds a border to `filled`/`ghost`.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) bordered = false;

  /**
   * Size of the button (affects height, font size, and padding).
   * @default 'md'
   */
  @property({ reflect: true }) size: ButtonSize = 'md';

  /**
   * Whether the button is disabled.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * Whether the button is in loading state.
   * Shows a spinner and disables interaction.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) loading = false;

  /**
   * Accessible name while loading, overriding the visible label (which stays in the accessibility tree, just
   * visually faded) with a status-appropriate announcement — e.g. `"Saving…"` instead of `"Save"`.
   * @default ''
   */
  @property({ attribute: 'loading-label' }) loadingLabel = '';

  /**
   * Enables toggle-button behavior (the WAI-ARIA toggle button pattern): clicking flips `pressed`, dispatches
   * `toggle`, and reflects `aria-pressed` on the inner control. Has no effect when `href` is set — links don't
   * have toggle semantics.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) toggle = false;

  /**
   * Current pressed state. Only meaningful with `toggle`; settable directly for a controlled toggle button.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) pressed = false;

  /**
   * Icon name to display at the start of the button.
   * @default ''
   */
  @property({ attribute: 'icon-start' }) iconStart = '';

  /**
   * Icon name to display at the end of the button.
   * @default ''
   */
  @property({ attribute: 'icon-end' }) iconEnd = '';

  /**
   * Whether the button stretches to fill its container's width.
   * @default false
   */
  @property({ type: Boolean, attribute: 'full-width', reflect: true }) fullWidth = false;

  /**
   * Renders the button label in small caps with wider letter spacing.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) uppercase = false;

  /**
   * When set, renders an `<a>` tag instead of `<button>`.
   * All visual styles and states are preserved.
   */
  @property() href = '';

  /**
   * Form behaviour when the button is inside a `<form>`.
   * `submit` triggers form validation and submission; `reset` restores initial values.
   * @default 'button'
   */
  @property({ reflect: true }) type: ButtonType = 'button';

  // Delegates the actual submission to a hidden native <button>, kept in sync and attached to the resolved form
  // only for the duration of the submission (BTN-3). Two platform constraints make this necessary rather than
  // calling form.requestSubmit() directly on the host or passing it as the submitter: a form-associated custom
  // element can't itself be `requestSubmit()`'s submitter (Chromium: "the specified element is not a submit
  // button"), and name/value/formaction submitter semantics only apply to the specific button that triggered the
  // submission — setting this element's own form value unconditionally would submit name/value even when a
  // *different* button (or an Enter keypress) triggered the submit. This is the same workaround other
  // form-associated custom element implementations use for the same gap.
  private _proxySubmitBtn: HTMLButtonElement | null = null;

  private _getProxySubmitBtn(): HTMLButtonElement {
    if (!this._proxySubmitBtn) {
      this._proxySubmitBtn = document.createElement('button');
      this._proxySubmitBtn.type = 'submit';
      this._proxySubmitBtn.hidden = true;
    }
    return this._proxySubmitBtn;
  }

  private _handleClick() {
    if (this.disabled || this.loading || this._fieldsetDisabled.fieldsetDisabled) return;

    if (this.toggle) {
      this.pressed = !this.pressed;
      dispatch(this, 'toggle', { pressed: this.pressed });
    }

    // this._internals.form (not this.closest('form')) so a button placed outside its form via form="id", or one
    // whose form is across a shadow root, still works — closest('form') can never resolve either (BTN-3).
    const form = this._internals.form;
    if (!form) return;

    if (this.type === 'reset') {
      form.reset();
      return;
    }
    if (this.type !== 'submit') return;

    const proxy = this._getProxySubmitBtn();
    for (const attr of SUBMITTER_ATTRS) {
      const val = this.getAttribute(attr);
      if (val !== null) proxy.setAttribute(attr, val);
      else proxy.removeAttribute(attr);
    }
    form.appendChild(proxy);
    form.requestSubmit(proxy);
    proxy.remove();
  }

  render() {
    const isDisabled = this.disabled || this.loading || this._fieldsetDisabled.fieldsetDisabled;
    const ariaLabel =
      this.loading && this.loadingLabel ? this.loadingLabel : this.getAttribute('aria-label') || nothing;
    // The label stays in the DOM (and in the accessibility tree) while loading, just visually hidden with
    // opacity — not removed — so the button keeps its accessible name instead of reading as an unnamed busy
    // control, and keeps its width instead of shrinking to fit only the spinner.
    const inner = html`
      <span class=${classMap({ label: true, 'is-loading': this.loading })} part="label">
        ${this.iconStart ? html`<lt-icon class="icon-start" name=${this.iconStart}></lt-icon>` : ''}
        <slot></slot>
        ${this.iconEnd ? html`<lt-icon class="icon-end" name=${this.iconEnd}></lt-icon>` : ''}
      </span>
      ${this.loading ? html`<lt-spinner class="spinner" part="spinner"></lt-spinner>` : ''}
    `;

    if (this.href) {
      const target = this.getAttribute('target') || undefined;
      const rel = this.getAttribute('rel') || (target === '_blank' ? 'noopener noreferrer' : undefined);
      return html`
        <a
          part="base"
          href=${this.href}
          target=${ifDefined(target)}
          rel=${ifDefined(rel)}
          aria-disabled=${isDisabled ? 'true' : nothing}
          aria-label=${ariaLabel}
          tabindex=${isDisabled ? '-1' : nothing}
          >${inner}</a
        >
      `;
    }

    return html`
      <button
        part="base"
        type="button"
        @click=${this._handleClick}
        ?disabled=${isDisabled}
        aria-busy=${this.loading ? 'true' : 'false'}
        aria-label=${ariaLabel}
      >
        ${inner}
      </button>
    `;
  }
}
