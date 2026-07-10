import { html, type PropertyValues } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { imageStyles } from './image.styles';
import type { ImageLoading } from './image.types';

/**
 * A thin wrapper around `<img>` with rounded corners, responsive fill support,
 * native lazy loading, and an error fallback mechanism.
 *
 * Native `load`/`error` events don't cross the shadow boundary, so they are
 * re-dispatched as composed `lt-load`/`lt-error` custom events. When a load
 * fails, the `fallback` slot is shown in place of the broken image; setting a
 * new `src` retries.
 *
 * @element lt-image
 * @part image - The underlying `<img>` element
 *
 * @slot fallback - Content shown in place of the image when loading fails
 *
 * @fires {CustomEvent<{ src: string }>} lt-load - Fired when the image loads successfully
 * @fires {CustomEvent<{ src: string }>} lt-error - Fired when the image fails to load
 *
 * @example
 * ```html
 * <lt-image src="/cover.jpg" alt="Album cover" loading="lazy" rounded>
 *   <div slot="fallback">No cover available</div>
 * </lt-image>
 * ```
 */
@customElement('lt-image')
export class Image extends ThemeableElement {
  static styles = imageStyles;

  /** Image source URL. */
  @property() src = '';

  /** Alt text for the image. */
  @property() alt = '';

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

  /**
   * Forwarded to the underlying `<img loading>` attribute.
   * `lazy` defers loading until the image approaches the viewport.
   */
  @property({ reflect: true }) loading: ImageLoading | '' = '';

  /** Whether the current `src` failed to load — shows the `fallback` slot. */
  @state() private _errored = false;

  private get _borderRadius(): string | undefined {
    if (this.rounded === null) return undefined;
    return this.rounded || 'var(--lt-border-radius)';
  }

  willUpdate(changed: PropertyValues<this>) {
    if (changed.has('src')) this._errored = false;
  }

  private _dispatch(name: 'lt-load' | 'lt-error') {
    this.dispatchEvent(
      new CustomEvent(name, {
        detail: { src: this.src },
        bubbles: true,
        composed: true
      })
    );
  }

  private _handleLoad() {
    this._dispatch('lt-load');
  }

  private _handleError() {
    this._errored = true;
    this._dispatch('lt-error');
  }

  render() {
    if (this._errored) {
      return html`<slot name="fallback"></slot>`;
    }

    const radius = this._borderRadius;
    return html`
      <img
        part="image"
        src=${this.src}
        alt=${this.alt}
        loading=${ifDefined(this.loading || undefined)}
        style=${radius ? `border-radius: ${radius}` : ''}
        @load=${this._handleLoad}
        @error=${this._handleError}
      />
    `;
  }
}
