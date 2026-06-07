import { html, nothing } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property } from 'lit/decorators.js';

import { progressStyles } from './progress.styles';
import type { ProgressSize, ProgressVariant } from './progress.types';

/**
 * A horizontal bar that shows how far along a process is.
 * Supports determinate (0–100 value) and indeterminate modes.
 *
 * @element lt-progress
 *
 * @example
 * ```html
 * <lt-progress value="40"></lt-progress>
 * <lt-progress value="75" variant="success"></lt-progress>
 * <lt-progress indeterminate></lt-progress>
 * ```
 */
@customElement('lt-progress')
export class Progress extends ThemeableElement {
  static styles = progressStyles;

  /**
   * Current progress value (0–100). Ignored when `indeterminate` is true.
   * @default 0
   */
  @property({ type: Number, reflect: true }) value = 0;

  /**
   * Color variant of the progress bar.
   * @default 'primary'
   */
  @property({ reflect: true }) variant: ProgressVariant = 'primary';

  /**
   * Height of the track.
   * @default 'md'
   */
  @property({ reflect: true }) size: ProgressSize = 'md';

  /**
   * Accessible label for screen readers.
   * @default ''
   */
  @property({ reflect: true }) label = '';

  /**
   * When true the bar animates continuously without a set value.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) indeterminate = false;

  render() {
    const pct = Math.min(100, Math.max(0, this.value));
    return html`
      <div
        part="track"
        role="progressbar"
        aria-label=${this.label || nothing}
        aria-valuenow=${this.indeterminate ? nothing : pct}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div part="fill" style=${this.indeterminate ? nothing : `width:${pct}%`}></div>
      </div>
    `;
  }
}
