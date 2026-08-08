import { html, nothing } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { buttonStyles } from './button.styles';
import { ButtonAppearance, ButtonSize, ButtonType, ButtonVariant } from './button.types';
import { AriaForwardingController } from '../shared/aria-forwarding';

import '../spinner/';
import '@latty-ds/icons';

/**
 * Button component with multiple variants, sizes, appearances, and loading state support.
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
 * - Forwards host `aria-pressed`, `aria-expanded`, `aria-haspopup`, `aria-controls`, and
 *   `aria-current` onto the internal native control (e.g. for toggle buttons)
 * - Renders as `<a>` when `href` is provided (link button)
 * - Form-associated: `type="submit"` submits the containing form, `type="reset"` resets it
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

  private _internals: ElementInternals;

  private _ariaForwarding = new AriaForwardingController(this, () => this.shadowRoot?.querySelector('[part="base"]'));

  constructor() {
    super();
    this._internals = this.attachInternals();
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
   * Forwarded to the anchor's `target` attribute when `href` is set.
   */
  @property() target = '';

  /**
   * Forwarded to the anchor's `rel` attribute when `href` is set.
   * Defaults to `noopener noreferrer` when `target="_blank"` and `rel` is not specified.
   */
  @property() rel = '';

  /**
   * Form behaviour when the button is inside a `<form>`.
   * `submit` triggers form validation and submission; `reset` restores initial values.
   * @default 'button'
   */
  @property({ reflect: true }) type: ButtonType = 'button';

  private _handleClick() {
    if (this.disabled || this.loading) return;
    const form = this.closest('form') as HTMLFormElement | null;
    if (!form) return;
    if (this.type === 'submit') form.requestSubmit();
    else if (this.type === 'reset') form.reset();
  }

  render() {
    const isDisabled = this.disabled || this.loading;
    const inner = this.loading
      ? html`<lt-spinner></lt-spinner>`
      : html`
          ${this.iconStart ? html`<lt-icon class="icon-start" name=${this.iconStart}></lt-icon>` : ''}
          <slot></slot>
          ${this.iconEnd ? html`<lt-icon class="icon-end" name=${this.iconEnd}></lt-icon>` : ''}
        `;

    if (this.href) {
      const rel = this.rel || (this.target === '_blank' ? 'noopener noreferrer' : undefined);
      return html`
        <a
          part="base"
          href=${this.href}
          target=${ifDefined(this.target || undefined)}
          rel=${ifDefined(rel)}
          aria-disabled=${isDisabled ? 'true' : nothing}
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
      >
        ${inner}
      </button>
    `;
  }
}
