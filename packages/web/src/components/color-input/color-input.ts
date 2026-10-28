import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FormControlElement } from '../../base';
import { colorInputStyles } from './color-input.styles';
import { ColorInputFormat, ColorInputSize, type ColorInputLabels } from './color-input.types';
import { NativeAttrsController } from '../shared/native-attrs';
import '@latty-ds/icons';
import '../text/text';

/**
 * Color conversion helpers.
 * @param {string} hex - The hex color string.
 * @returns {[number, number, number] | null} The RGB tuple or null.
 */
function hexToRgbTuple(hex: string): [number, number, number] | null {
  const m = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : null;
}

function hexToHslTuple(hex: string): [number, number, number] | null {
  const rgb = hexToRgbTuple(hex);
  if (!rgb) return null;
  const [r, g, b] = rgb.map((v) => v / 255) as [number, number, number];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHexByte = (x: number) =>
    Math.round(x * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${toHexByte(f(0))}${toHexByte(f(8))}${toHexByte(f(4))}`;
}

/**
 * Clamps a number between min and max inclusive.
 * @param {number} n - The value to clamp.
 * @param {number} min - Lower bound.
 * @param {number} max - Upper bound.
 * @returns {number} The clamped value.
 */
function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function rgbStringToHex(rgb: string): string {
  const m = rgb.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+[\d.]+%?)?\s*\)$/i);
  if (!m) return '';
  const toB = (n: string) =>
    clamp(Math.round(Number(n)), 0, 255)
      .toString(16)
      .padStart(2, '0');
  return `#${toB(m[1])}${toB(m[2])}${toB(m[3])}`;
}

function getCanvasCtx(): CanvasRenderingContext2D | null {
  try {
    return document.createElement('canvas').getContext('2d');
  } catch {
    return null;
  }
}

function resolveViaCanvas(value: string): string {
  const ctx = getCanvasCtx();
  if (!ctx) return '';
  ctx.fillStyle = '#000';
  ctx.fillStyle = value;
  const resolved = ctx.fillStyle;
  if (resolved === '#000000') {
    ctx.fillStyle = '#fff';
    ctx.fillStyle = value;
    if (ctx.fillStyle === '#ffffff') return '';
  }
  if (resolved.startsWith('#')) return resolved;
  return rgbStringToHex(resolved);
}

/** Normalise any supported color string to `#rrggbb`. Returns `''` if unrecognised.
 * @param {string} value - The color value.
 * @returns {string} The normalized hex string.
 */
function toHex(value: string): string {
  value = value.trim();
  if (!value) return '';
  if (/^#[0-9a-f]{6}$/i.test(value)) return value.toLowerCase();
  if (/^#[0-9a-f]{3}$/i.test(value)) {
    const [, r, g, b] = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(value)!;
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  if (/^#[0-9a-f]{8}$/i.test(value)) return value.slice(0, 7).toLowerCase();
  if (/^#[0-9a-f]{4}$/i.test(value)) {
    const [, r, g, b] = /^#([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(value)!;
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  const rgba = rgbStringToHex(value);
  if (rgba) return rgba;
  const hsla = value.match(/^hsla?\(\s*([\d.]+)[,\s]+([\d.]+)%[,\s]+([\d.]+)%(?:[,\s/]+[\d.]+%?)?\s*\)$/i);
  if (hsla) {
    return hslToHex(clamp(Number(hsla[1]), 0, 360), clamp(Number(hsla[2]), 0, 100), clamp(Number(hsla[3]), 0, 100));
  }
  return resolveViaCanvas(value);
}

/** Format a `#rrggbb` hex string into the requested display format.
 * @param {string} hex - The hex color string.
 * @param {ColorInputFormat} format - The output format.
 * @returns {string} The formatted color string.
 */
function formatColor(hex: string, format: ColorInputFormat): string {
  if (format === 'rgb') {
    const t = hexToRgbTuple(hex);
    return t ? `rgb(${t[0]}, ${t[1]}, ${t[2]})` : hex;
  }
  if (format === 'hsl') {
    const t = hexToHslTuple(hex);
    return t ? `hsl(${t[0]}, ${t[1]}%, ${t[2]}%)` : hex;
  }
  return hex;
}

const DEFAULT_LABELS: ColorInputLabels = {
  validationMessage: 'Please select a color'
};

/**
 * A read-only textfield that opens the native browser color picker on click.
 * Displays the selected color value and a live color swatch preview.
 * Accepts and emits colors in hex, rgb, or hsl format via the `format` prop.
 * @element lt-color-input
 * @fires {CustomEvent<{value: string}>} change - Dispatched when the user picks a new color
 * @example
 * ```html
 * <lt-color-input label="Brand color" value="#7c3aed"></lt-color-input>
 * <lt-color-input label="Background" value="rgb(124, 58, 237)" format="rgb"></lt-color-input>
 * ```
 */
@customElement('lt-color-input')
export class ColorInput extends FormControlElement {
  static styles = colorInputStyles;

  private _nativeAttrs = new NativeAttrsController(this, () => this.shadowRoot?.querySelector('input[type="color"]'), {
    exclude: ['aria-label']
  });

  /**
   * The current color value. Accepts hex (`#7c3aed`), rgb (`rgb(124, 58, 237)`),
   * or hsl (`hsl(263, 70%, 58%)`). Emitted values match the `format` prop. Not reflected as an attribute —
   * read the property, or the `change` event's `detail.value`, instead of `getAttribute('value')`/`[value]`.
   * @default ''
   */
  @property() value = '';

  /**
   * Output format for the displayed value and emitted `change` events.
   * @default 'hex'
   */
  @property({ reflect: true }) format: ColorInputFormat = 'hex';

  /**
   * Label text displayed above the input.
   * @default ''
   */
  @property({ reflect: true }) label = '';

  /**
   * Placeholder shown when no color is selected.
   * @default 'Pick a color'
   */
  @property({ reflect: true }) placeholder = 'Pick a color';

  /**
   * Whether the input is disabled.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * Whether the field is required.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) required = false;

  /**
   * Size of the input — affects height and padding.
   * @default 'md'
   */
  @property({ reflect: true }) size: ColorInputSize = 'md';

  /** Overridable UI text (the required-field validation message), for i18n. English defaults — override only the keys you need. */
  @property({ type: Object }) labels: Partial<ColorInputLabels> = {};

  private get _labels(): ColorInputLabels {
    return { ...DEFAULT_LABELS, ...this.labels };
  }

  updated() {
    this._internals.setFormValue(this.value);
    const input = this.shadowRoot?.querySelector<HTMLElement>('input[type="color"]');
    if (this.required && !this.value && input) {
      this._internals.setValidity({ valueMissing: true }, this._labels.validationMessage, input);
    } else {
      this._internals.setValidity({});
    }
  }

  /**
   * A text-like control's value is its `value` — what a form reset restores and what a browser
   * state-restore repopulates.
   * @returns {string} The form value.
   */
  protected override get _formValue(): string {
    return this.value;
  }

  protected override set _formValue(value: unknown) {
    this.value = value == null ? '' : String(value);
  }

  private _handleChange(e: Event) {
    /*
     * Stop the native (composed) change event from also bubbling past the
     * shadow boundary — otherwise it double-fires 'change' on the host after
     * our own CustomEvent, with the wrong (non-{value}) detail shape.
     */
    e.stopPropagation();
    const pickerHex = (e.target as HTMLInputElement).value; // always #rrggbb from native picker
    this.value = formatColor(pickerHex, this.format);
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true
      })
    );
  }

  render() {
    const hex = toHex(this.value);
    return html`
      <label class="wrapper">
        ${this.label ? html`<span class="label"><lt-text variant="label" as="span">${this.label}</lt-text></span>` : ''}
        <span class="input-container">
          <span class="color-swatch ${hex ? '' : 'empty'}" style="background: ${hex || 'transparent'}"></span>
          <span class="display-value ${hex ? '' : 'is-placeholder'}"> ${this.value || this.placeholder} </span>
          <lt-icon class="icon-end" name="color-palette"></lt-icon>
          <input
            type="color"
            class="native-picker"
            .value=${hex || '#000000'}
            ?disabled=${this._isDisabled}
            aria-label=${this.label || this.getAttribute('aria-label') || this.placeholder}
            @change=${this._handleChange}
          />
        </span>
      </label>
    `;
  }
}
