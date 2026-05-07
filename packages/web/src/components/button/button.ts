import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { buttonStyles } from './button.styles';
import { ButtonAppearance, ButtonSize, ButtonVariant } from './button.types';

import '../spinner/';
import '@latty/icons';

/**
 * Button component with multiple variants, sizes, appearances, and loading state support.
 *
 * @element lt-button
 *
 * Features:
 * - Multiple visual variants (primary, secondary, neutral, success, warning, error, info)
 * - Two appearance styles (filled, outlined)
 * - Three size options (sm, md, lg)
 * - Loading state with spinner
 * - Icon support at start and end positions
 * - Disabled state
 * - Accessible with aria-busy for loading state
 * - Renders as `<a>` when `href` is provided (link button)
 *
 * @slot - Button label/content
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
export class Button extends LitElement {
  static styles = buttonStyles;

  /**
   * Visual variant that determines the button's color scheme.
   * @default 'primary'
   */
  @property({ reflect: true }) variant: ButtonVariant = 'primary';

  /**
   * Appearance style (filled or outlined).
   * @default 'filled'
   */
  @property({ reflect: true }) appearance: ButtonAppearance = 'filled';

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
  @property() icon = '';

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

  render() {
    const isDisabled = this.disabled || this.loading;
    const inner = this.loading
      ? html`<lt-spinner></lt-spinner>`
      : html`
          ${this.icon ? html`<lt-icon class="icon-start" name=${this.icon}></lt-icon>` : ''}
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
        >${inner}</a>
      `;
    }

    return html`
      <button part="base" ?disabled=${isDisabled} aria-busy=${this.loading ? 'true' : 'false'}>
        ${inner}
      </button>
    `;
  }
}
