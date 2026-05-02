import { LitElement, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

import { sliderStyles } from './slider.styles';
import type { SliderSize } from './slider.types';
import '../tooltip/tooltip';

/**
 * A range slider component for selecting a numeric value within a range.
 *
 * @element lt-slider
 * @fires {CustomEvent<{value: number}>} lt-input - Dispatched on every value change while dragging
 * @fires {CustomEvent<{value: number}>} lt-change - Dispatched when the user commits a value (mouseup/keyup)
 */
@customElement('lt-slider')
export class Slider extends LitElement {
  static styles = sliderStyles;

  @property({ reflect: true }) size: SliderSize = 'md';
  @property({ type: Boolean, reflect: true }) disabled = false;
  /** Show the current value in a tooltip above the thumb. */
  @property({ attribute: 'show-tooltip', type: Boolean, reflect: true }) showTooltip = false;

  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) step = 1;
  @property({ type: Number }) value = 0;

  /** Label displayed above the track */
  @property() label = '';
  /** Name attribute for form submission */
  @property() name = '';

  @query('input') private input!: HTMLInputElement;

  private get _fillPercent(): number {
    return ((this.value - this.min) / (this.max - this.min)) * 100;
  }

  private _thumbSizePx(): number {
    return ({ sm: 14, md: 18, lg: 22 } as Record<string, number>)[this.size] ?? 18;
  }

  updated() {
    const fill = this._fillPercent;
    this.style.setProperty('--_fill', `${fill}%`);

    // compute the thumb center as a % of track width so the tooltip follows it
    const trackW = this.input?.offsetWidth ?? 0;
    if (trackW) {
      const thumbPx = this._thumbSizePx();
      const centerPx = (fill / 100) * (trackW - thumbPx) + thumbPx / 2;
      this.style.setProperty('--_thumb-left', `${(centerPx / trackW) * 100}%`);
    }
  }

  private _onInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.value = Number(target.value);
    this.dispatchEvent(
      new CustomEvent<{ value: number }>('lt-input', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _onChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.value = Number(target.value);
    this.dispatchEvent(
      new CustomEvent<{ value: number }>('lt-change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    const input = html`
      <input
        id="input"
        type="range"
        min=${this.min}
        max=${this.max}
        step=${this.step}
        .value=${String(this.value)}
        ?disabled=${this.disabled}
        name=${this.name}
        aria-label=${this.label || 'slider'}
        aria-valuemin=${this.min}
        aria-valuemax=${this.max}
        aria-valuenow=${this.value}
        @input=${this._onInput}
        @change=${this._onChange}
      />
    `;

    return html`
      ${this.label ? html`<label class="label" for="input">${this.label}</label>` : ''}
      <div class="track-wrap">
        <lt-tooltip content=${String(this.value)} ?disabled=${!this.showTooltip} position="top">
          ${input}
        </lt-tooltip>
      </div>
    `;
  }
}
