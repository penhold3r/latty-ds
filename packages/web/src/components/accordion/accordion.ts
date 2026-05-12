import { html } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property, query } from 'lit/decorators.js';

import { accordionStyles } from './accordion.styles';
import { AccordionAppearance } from './accordion.types';

import '@latty/icons';
import '../text/text';

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
 * <lt-accordion appearance="filled" label="Features" icon-start="settings" open>
 *   <ul>
 *     <li>Design tokens</li>
 *     <li>Web Components</li>
 *     <li>Accessible</li>
 *   </ul>
 * </lt-accordion>
 * ```
 */
@customElement('lt-accordion')
export class Accordion extends ThemeableElement {
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
  @property({ attribute: 'icon-start' }) iconStart = '';

  /**
   * Visual appearance of the accordion.
   * @default 'default'
   */
  @property({ reflect: true }) appearance: AccordionAppearance = 'default';

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

  /**
   * Renders the header label in small caps with wider letter spacing.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) uppercase = false;

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

  render() {
    return html`
      <details>
        <summary @click=${this.handleSummaryClick}>
          <div class="summary-content">
            ${this.iconStart ? html`<lt-icon class="start-icon" name="${this.iconStart}"></lt-icon>` : ''}
            <lt-text variant="h6" as="span" class="summary-text">
              <slot name="summary">${this.label}</slot>
            </lt-text>
            <lt-icon class="chevron" name="caret-down" size="md"></lt-icon>
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
