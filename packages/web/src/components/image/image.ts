import { html, type PropertyValues } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property, state } from 'lit/decorators.js';

import { imageStyles } from './image.styles';
import { NativeAttrsController } from '../shared/native-attrs';

/**
 * A thin wrapper around `<img>` with rounded corners, responsive fill support,
 * native lazy loading, and an error fallback mechanism. Automatically forwards
 * native `<img>` attributes (`alt`, `srcset`, `sizes`, `loading`, `decoding`,
 * `fetchpriority`, `crossorigin`, `referrerpolicy`, `width`, `height`, etc.)
 * onto the inner `<img>` element.
 *
 * The inner `<img>`'s `load`/`error` events don't leave the shadow root, so they
 * are re-dispatched on the host under the same native names, with the `src` in
 * `detail`. Like the native ones they don't bubble, so listen on `<lt-image>`
 * itself. When a load fails, the `fallback` slot is shown in place of the broken
 * image; setting a new `src` retries.
 *
 * @element lt-image
 * @part image - The underlying `<img>` element
 *
 * @slot fallback - Content shown in place of the image when loading fails
 *
 * @fires {CustomEvent<{ src: string }>} load - Fired when the image loads successfully
 * @fires {CustomEvent<{ src: string }>} error - Fired when the image fails to load
 *
 * @example
 * ```html
 * <lt-image src="/cover.jpg" alt="Album cover" loading="lazy" rounded>
 *   <div slot="fallback">No cover available</div>
 * </lt-image>
 * ```
 *
 * @example
 * ```html
 * <lt-image
 *   src="/cover-800.jpg"
 *   srcset="/cover-400.jpg 400w, /cover-800.jpg 800w, /cover-1200.jpg 1200w"
 *   sizes="(min-width: 768px) 50vw, 100vw"
 *   aspect-ratio="16/9"
 *   alt="Album cover"
 * ></lt-image>
 * ```
 */
@customElement('lt-image')
export class Image extends ThemeableElement {
  static styles = imageStyles;

  private _nativeAttrs = new NativeAttrsController(this, () => this.shadowRoot?.querySelector('img'));

  /** Image source URL. */
  @property() src = '';

  /**
   * Reserves the image's box before it loads, preventing layout shift. Any valid CSS `aspect-ratio` value (e.g.
   * `"16/9"`, `"1"`, `"4/3"`). Implies `object-fit: cover` so the image fills the reserved box without
   * distorting.
   */
  @property({ attribute: 'aspect-ratio', reflect: true }) aspectRatio = '';

  /**
   * Border radius. Present with no value uses the design system default (`--lt-border-radius`).
   * Accepts any valid CSS `border-radius` shorthand (e.g. `"8px"`, `"50%"`, `"4px 8px"`).
   */
  @property({ reflect: true }) rounded: string | null = null;

  /**
   * Makes the image fill its container using `object-fit: cover`.
   * Size the `lt-image` element externally to define the crop box.
   */
  @property({ type: Boolean, reflect: true }) responsive = false;

  /** Whether the current `src` failed to load — shows the `fallback` slot. */
  @state() private _errored = false;

  private get _borderRadius(): string | undefined {
    if (this.rounded === null) return undefined;
    return this.rounded || 'var(--lt-border-radius)';
  }

  private get _imgStyle(): string {
    const radius = this._borderRadius;
    const declarations: string[] = [];
    if (radius) declarations.push(`border-radius: ${radius}`);
    if (this.aspectRatio) declarations.push(`aspect-ratio: ${this.aspectRatio}`, 'width: 100%', 'object-fit: cover');
    return declarations.join('; ');
  }

  willUpdate(changed: PropertyValues<this>) {
    if (changed.has('src')) this._errored = false;
  }

  // Literal event names (not a shared helper taking `name`): the manifest analyzer reads names from
  // `new CustomEvent('…')` call sites, and a variable there produced a bogus event called "name".
  // Non-bubbling and non-composed, exactly like the native <img> events they mirror — a bubbling
  // `error` would also reach window-level error handlers (Sentry and friends) as a spurious error.
  private _handleLoad() {
    this.dispatchEvent(new CustomEvent('load', { detail: { src: this.src } }));
  }

  private _handleError() {
    this._errored = true;
    this.dispatchEvent(new CustomEvent('error', { detail: { src: this.src } }));
  }

  render() {
    if (this._errored) {
      return html`<slot name="fallback"></slot>`;
    }

    return html`
      <img
        part="image"
        src=${this.src}
        alt=${this.getAttribute('alt') ?? ''}
        style=${this._imgStyle}
        @load=${this._handleLoad}
        @error=${this._handleError}
      />
    `;
  }
}
