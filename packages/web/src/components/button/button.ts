import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { buttonStyles } from './button.styles';
import { ButtonAppearance, ButtonSize, ButtonVariant } from './button.types';

import '@web/components/spinner';
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
 *
 * @slot - Button label/content
 *
 * @example
 * ```html
 * <lt-button variant="primary" size="md">
 *   Click me
 * </lt-button>
 * ```
 *
 * @example
 * ```html
 * <lt-button variant="success" appearance="outlined" icon="check">
 *   Save
 * </lt-button>
 * ```
 *
 * @example
 * ```html
 * <lt-button variant="error" appearance="outlined" icon="trash" disabled>
 *   Delete
 * </lt-button>
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
   * Renders the button with optional icons and loading spinner.
   */
  render() {
    const isDisabled = this.disabled || this.loading;

    return html`
      <button ?disabled=${isDisabled} aria-busy=${this.loading ? 'true' : 'false'}>
        ${this.loading
          ? html`<lt-spinner></lt-spinner>`
          : html`
              ${this.icon ? html`<lt-icon class="icon-start" name=${this.icon}></lt-icon>` : ''}
              <slot></slot>
              ${this.iconEnd ? html`<lt-icon class="icon-end" name=${this.iconEnd}></lt-icon>` : ''}
            `}
      </button>
    `;
  }
}
