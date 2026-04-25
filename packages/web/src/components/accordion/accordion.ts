import { LitElement, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

import { accordionStyles } from './accordion.styles';
import { AccordionVariant } from './accordion.types';

import '@latty/icons';

/**
 * An accordion component using native details/summary elements.
 * Provides collapsible content sections with smooth animations.
 *
 * @element lt-accordion
 *
 * @fires {CustomEvent<{open: boolean}>} toggle - Dispatched when the accordion is opened or closed
 *
 * @slot - Content to display when accordion is expanded
 * @slot summary - Custom content for the summary/header (defaults to label property)
 *
 * @example
 * ```html
 * <lt-accordion label="What is Latty?">
 *   Latty is a design system built with Web Components.
 * </lt-accordion>
 * ```
 *
 * @example
 * ```html
 * <lt-accordion variant="filled" label="Features" icon="settings" open>
 *   <ul>
 *     <li>Design tokens</li>
 *     <li>Web Components</li>
 *     <li>Accessible</li>
 *   </ul>
 * </lt-accordion>
 * ```
 */
@customElement('lt-accordion')
export class Accordion extends LitElement {
  static styles = accordionStyles;

  /**
   * Label/title text for the accordion header.
   * @default ''
   */
  @property() label = '';

  /**
   * Icon name to display at the start of the header.
   * @default ''
   */
  @property() icon = '';

  /**
   * Visual variant of the accordion.
   * @default 'default'
   */
  @property({ reflect: true }) variant: AccordionVariant = 'default';

  /**
   * Whether the accordion is initially open.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) open = false;

  /**
   * Whether the accordion is disabled.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  @query('details') private _details!: HTMLDetailsElement;
  @query('.content') private _content!: HTMLElement;
  @query('.content-inner') private _contentInner!: HTMLElement;

  private _animating = false;

  protected updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('open') && !this._animating) {
      this._details.open = this.open;
      this._content.style.height = this.open ? 'auto' : '0px';
    }
  }

  /**
   * Handles click on summary to animate the accordion.
   * @private
   */
  private handleSummaryClick(e: Event) {
    e.preventDefault();

    if (this.disabled) return;

    this._animating = true;

    if (this.open) {
      // Closing - keep details open during animation
      const startHeight = this._contentInner.offsetHeight;
      this.open = false;

      this._content.style.height = `${startHeight}px`;
      requestAnimationFrame(() => {
        this._content.style.height = '0px';
      });
    } else {
      // Opening — read offsetHeight synchronously after setting details.open so the
      // browser has committed the open state and the layout reflects the full content height.
      this._details.open = true;
      this.open = true;
      const endHeight = this._contentInner.offsetHeight;

      this._content.style.height = '0px';
      requestAnimationFrame(() => {
        this._content.style.height = `${endHeight}px`;
      });
    }

    this.dispatchEvent(
      new CustomEvent('toggle', {
        detail: { open: this.open },
        bubbles: true,
        composed: true
      })
    );
  }

  /**
   * Handles the end of the transition to clear inline styles.
   * @private
   */
  private handleTransitionEnd() {
    this._animating = false;

    if (this.open) {
      this._content.style.height = 'auto';
    } else {
      this._details.open = false;
    }
  }

  /**
   * Renders the chevron icon SVG.
   * @private
   */
  private renderChevron() {
    return html`
      <svg class="chevron" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M5 7.5L10 12.5L15 7.5"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    `;
  }

  render() {
    return html`
      <details>
        <summary @click=${this.handleSummaryClick}>
          <div class="summary-content">
            ${this.icon ? html`<lt-icon class="start-icon" name="${this.icon}"></lt-icon>` : ''}
            <span class="summary-text">
              <slot name="summary">${this.label}</slot>
            </span>
            ${this.renderChevron()}
          </div>
        </summary>
        <div class="content" @transitionend=${this.handleTransitionEnd}>
          <div class="content-inner">
            <slot></slot>
          </div>
        </div>
      </details>
    `;
  }
}
