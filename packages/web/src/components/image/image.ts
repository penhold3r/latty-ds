import { html } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property } from 'lit/decorators.js';

import { imageStyles } from './image.styles';

/**
 * A thin wrapper around `<img>` with rounded corners and responsive fill support.
 *
 * @element lt-image
 * @part image - The underlying `<img>` element
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

  private get _borderRadius(): string | undefined {
    if (this.rounded === null) return undefined;
    return this.rounded || 'var(--lt-border-radius)';
  }

  render() {
    const radius = this._borderRadius;
    return html`
      <img part="image" src=${this.src} alt=${this.alt} style=${radius ? `border-radius: ${radius}` : ''} />
    `;
  }
}
