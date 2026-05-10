import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { emptyStateStyles } from './empty-state.styles';
import type { EmptyStateSize } from './empty-state.types';
import '@latty/icons';
import '../text/text';

/**
 * A placeholder for zero-data states — empty tables, no search results, onboarding prompts.
 *
 * @element lt-empty-state
 *
 * @slot - Action area (buttons, links). Hidden when empty.
 *
 * @example
 * ```html
 * <lt-empty-state
 *   icon="folder-open"
 *   title="No projects yet"
 *   description="Create your first project to get started.">
 *   <lt-button variant="primary">New project</lt-button>
 * </lt-empty-state>
 * ```
 */
@customElement('lt-empty-state')
export class EmptyState extends LitElement {
  static styles = emptyStateStyles;

  /** Icon name to display above the title. */
  @property({ reflect: true }) icon = '';

  /** Primary heading. */
  @property({ reflect: true }) title = '';

  /** Supporting text below the title. */
  @property({ reflect: true }) description = '';

  /** Visual scale of the empty state. */
  @property({ reflect: true }) size: EmptyStateSize = 'md';

  private get _iconSize() {
    return this.size === 'lg' ? 'xl' : this.size === 'sm' ? 'md' : 'lg';
  }

  render() {
    return html`
      <div class="empty-state" part="base">
        ${this.icon
          ? html`<div class="icon-wrap" part="icon"><lt-icon name=${this.icon} size=${this._iconSize}></lt-icon></div>`
          : nothing}
        ${this.title ? html`<p class="title" part="title">${this.title}</p>` : nothing}
        ${this.description ? html`<p class="description" part="description">${this.description}</p>` : nothing}
        <div class="actions" part="actions"><slot></slot></div>
      </div>
    `;
  }
}
