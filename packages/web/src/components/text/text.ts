import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { html, unsafeStatic } from 'lit/static-html.js';

import { textStyles } from './text.styles';
import type { TextVariant, TextTag } from './text.types';

const VARIANT_TAG: Record<TextVariant, TextTag> = {
  'display-2xl': 'p',
  'display-xl':  'p',
  'display-lg':  'p',
  h1:            'h1',
  h2:            'h2',
  h3:            'h3',
  h4:            'h4',
  h5:            'h5',
  h6:            'h6',
  lead:          'p',
  body:          'p',
  'body-sm':     'p',
  caption:       'span',
  overline:      'span',
  label:         'span',
};

/**
 * Renders text with a predefined typographic style. The rendered HTML tag
 * matches the variant by default but can be overridden with the `as` attribute
 * for cases where the visual style should not affect the document outline.
 *
 * @element lt-text
 *
 * @example
 * ```html
 * <lt-text variant="h1">Page title</lt-text>
 * <lt-text variant="h2" as="h3">Visually h2, semantically h3</lt-text>
 * <lt-text variant="lead">Introductory paragraph.</lt-text>
 * <lt-text variant="overline">Category</lt-text>
 * ```
 */
@customElement('lt-text')
export class Text extends LitElement {
  static styles = textStyles;

  /** Typographic style to apply. */
  @property({ reflect: true }) variant: TextVariant = 'body';

  /** HTML tag to render. Defaults to the semantic tag for the chosen variant. */
  @property({ reflect: true }) as: TextTag | '' = '';

  render() {
    const tag = unsafeStatic(this.as || VARIANT_TAG[this.variant] || 'p');
    return html`<${tag} part="base"><slot></slot></${tag}>`;
  }
}
