import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { spinnerStyles } from './spineer.styles';
import type { SpinnerSize, SpinnerVariant } from './spinner.types';

/**
 * Spinner component for indicating loading states.
 *
 * @element lt-spinner
 *
 * Features:
 * - Smooth rotating animation
 * - Multiple size options (sm, md, lg)
 * - Color variants or inherits parent color
 * - Respects reduced motion preferences
 * - Hidden from screen readers (aria-hidden)
 *
 * @example
 * ```html
 * <lt-spinner size="md" variant="primary"></lt-spinner>
 * ```
 *
 * @example
 * ```html
 * <!-- Inherits text color from parent -->
 * <div style="color: blue;">
 *   <lt-spinner variant="current"></lt-spinner>
 * </div>
 * ```
 *
 * @example
 * ```html
 * <!-- Large spinner with success color -->
 * <lt-spinner size="lg" variant="primary"></lt-spinner>
 * ```
 */
@customElement('lt-spinner')
export class Spinner extends LitElement {
  static styles = spinnerStyles;

  /**
   * Size of the spinner.
   * @default 'md'
   */
  @property({ reflect: true }) size: SpinnerSize = 'md';

  /**
   * Color variant of the spinner.
   * 'current' inherits color from parent element.
   * @default 'current'
   */
  @property({ reflect: true }) variant: SpinnerVariant = 'current';

  /**
   * Renders the spinner element.
   * Hidden from assistive technologies with aria-hidden.
   */
  render() {
    return html`<span class="spinner" aria-hidden="true"></span>`;
  }
}
