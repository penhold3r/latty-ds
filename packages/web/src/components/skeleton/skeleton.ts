import { html } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

import { skeletonStyles } from './skeleton.styles';
import type { SkeletonShape } from './skeleton.types';

/**
 * A loading placeholder that mimics the shape of content while data is being fetched.
 *
 * @element lt-skeleton
 *
 * @example
 * ```html
 * <lt-skeleton></lt-skeleton>
 * <lt-skeleton shape="text" width="60%"></lt-skeleton>
 * <lt-skeleton shape="circle" width="48px" height="48px"></lt-skeleton>
 * <lt-skeleton shape="rect" height="200px"></lt-skeleton>
 * ```
 */
@customElement('lt-skeleton')
export class Skeleton extends ThemeableElement {
  static styles = skeletonStyles;

  /**
   * Shape of the skeleton placeholder.
   * @default 'rect'
   */
  @property({ reflect: true }) shape: SkeletonShape = 'rect';

  /**
   * Width of the skeleton. Accepts any CSS length value (e.g. '100%', '200px').
   * @default ''
   */
  @property() width = '';

  /**
   * Height of the skeleton. Accepts any CSS length value (e.g. '1rem', '200px').
   * @default ''
   */
  @property() height = '';

  /**
   * Whether to show the shimmer animation.
   * @default true
   */
  @property({ type: Boolean, reflect: true }) animated = true;

  render() {
    const style: Record<string, string> = {};
    if (this.width) style.width = this.width;
    if (this.height) style.height = this.height;
    return html`<div part="base" style=${styleMap(style)} aria-hidden="true"></div>`;
  }
}
