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
   * The value `value` is measured against (0–100 becomes 0–max). Ignored when `indeterminate` is true.
   * @default 100
   */
  @property({ type: Number }) max = 100;

  /**
   * Overrides the spoken value with a custom string (e.g. "3 of 5 steps") for scales a bare percentage
   * doesn't describe well. Leave unset to let `aria-valuenow`/`aria-valuemax` speak for themselves.
   * @default ''
   */
  @property({ attribute: 'value-text' }) valueText = '';

  /**
   * When true the bar animates continuously without a set value.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) indeterminate = false;

  render() {
    // A non-finite or non-positive max falls back to 100 rather than dividing by zero/NaN.
    const max = Number.isFinite(this.max) && this.max > 0 ? this.max : 100;
    const value = Number.isFinite(this.value) ? Math.min(max, Math.max(0, this.value)) : 0;
    const fillPct = (value / max) * 100;
    return html`
      <div
        part="track"
        role="progressbar"
        aria-label=${this.label || nothing}
        aria-valuenow=${this.indeterminate ? nothing : value}
        aria-valuemin="0"
        aria-valuemax=${max}
        aria-valuetext=${this.indeterminate || !this.valueText ? nothing : this.valueText}
      >
        <div part="fill" style=${this.indeterminate ? nothing : `width:${fillPct}%`}></div>
      </div>
    `;
  }
}
