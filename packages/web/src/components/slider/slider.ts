import { html, type PropertyValues } from 'lit';
import { FormControlElement } from '../../base';
import { customElement, property } from 'lit/decorators.js';

import { sliderStyles } from './slider.styles';
import type { SliderSize } from './slider.types';
import { NativeAttrsController } from '../shared/native-attrs';
import '../tooltip/tooltip';
import '../text/text';

/**
 * A range slider component for selecting a numeric value within a range.
 *
 * @element lt-slider
 * @fires {CustomEvent<{value: number}>} input - Dispatched on every value change while dragging
 * @fires {CustomEvent<{value: number}>} change - Dispatched when the user commits a value (mouseup/keyup)
 */
@customElement('lt-slider')
export class Slider extends FormControlElement {
  static styles = sliderStyles;

  private _nativeAttrs = new NativeAttrsController(this, () => this.shadowRoot?.querySelector('input'), {
    exclude: ['aria-label', 'aria-valuemin', 'aria-valuemax', 'aria-valuenow']
  });

  @property({ reflect: true }) size: SliderSize = 'md';
  @property({ type: Boolean, reflect: true }) disabled = false;
  /** Show the current value in a tooltip above the thumb. */
  @property({ type: Boolean, reflect: true }) tooltip = false;

  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) step = 1;
  /** Not reflected as an attribute — read the property, or the `change` event's `detail.value`, instead of
   * `getAttribute('value')`/`[value]`. */
  @property({ type: Number }) value = 0;

  /** Label displayed above the track */
  @property({ reflect: true }) label = '';

  // A unitless 0–1 ratio, not a percentage — CSS derives both the track's fill percentage and the tooltip's
  // thumb-following offset from it via calc() (SLD-1), so there's only one number to keep in sync.
  private get _fillRatio(): number {
    if (this.max === this.min) return 0; // avoid dividing by zero (SLD-1: min === max used to give NaN%)
    return (this.value - this.min) / (this.max - this.min);
  }

  /** Clamps to [min, max] and snaps to the nearest step from min, matching how a native <input type="range">
   * sanitizes its own value — including when `value`/`min`/`max`/`step` are set programmatically, which a native
   * range input clamps on its own internal value but this component didn't mirror onto its own `value` property
   * (SLD-1: `value` wasn't clamped/stepped, so e.g. `value=150` with `max=100` produced a 150% fill and
   * submitted "150" to the form even though the visible thumb was pinned at the end). */
  private _sanitize(value: number): number {
    if (this.min === this.max) return this.min;
    const clamped = Math.min(this.max, Math.max(this.min, value));
    if (this.step <= 0) return clamped;
    const steps = Math.round((clamped - this.min) / this.step);
    return Math.min(this.max, Math.max(this.min, this.min + steps * this.step));
  }

  override willUpdate(changed: PropertyValues) {
    if (changed.has('value') || changed.has('min') || changed.has('max') || changed.has('step')) {
      const sanitized = this._sanitize(this.value);
      if (sanitized !== this.value) this.value = sanitized;
    }
  }

  updated() {
    this.style.setProperty('--_fill', String(this._fillRatio));
    this._internals.setFormValue(String(this.value));
    this._internals.setValidity({});
  }

  /**
   * A slider's value is its number — what a form reset restores and what a browser state-restore
   * repopulates.
   */
  protected override get _formValue(): number {
    return this.value;
  }

  protected override set _formValue(value: unknown) {
    this.value = Number(value ?? 0);
  }

  private _onInput(e: Event) {
    e.stopPropagation();
    const target = e.target as HTMLInputElement;
    this.value = Number(target.value);
    this.dispatchEvent(
      new CustomEvent<{ value: number }>('input', {
        detail: { value: this.value },
        bubbles: true,
        composed: true
      })
    );
  }

  private _onChange(e: Event) {
    e.stopPropagation();
    const target = e.target as HTMLInputElement;
    this.value = Number(target.value);
    this.dispatchEvent(
      new CustomEvent<{ value: number }>('change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true
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
        ?disabled=${this._isDisabled}
        aria-label=${this.label || this.getAttribute('aria-label') || 'slider'}
        aria-valuemin=${this.min}
        aria-valuemax=${this.max}
        aria-valuenow=${this.value}
        @input=${this._onInput}
        @change=${this._onChange}
      />
    `;

    return html`
      ${this.label ? html`<label for="input"><lt-text variant="label" as="span">${this.label}</lt-text></label>` : ''}
      <div class="track-wrap">
        <lt-tooltip content=${String(this.value)} ?disabled=${!this.tooltip} placement="top"> ${input} </lt-tooltip>
      </div>
    `;
  }
}
