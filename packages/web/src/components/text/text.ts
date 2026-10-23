import { ThemeableElement } from '../../base';
import { customElement, property } from 'lit/decorators.js';
import { html, unsafeStatic } from 'lit/static-html.js';
import type { PropertyValues } from 'lit';

import { textStyles } from './text.styles';
import type { TextVariant, TextTag } from './text.types';
import { devWarn } from '../../utils';

/**
 * `as` reaches the template through unsafeStatic, so anything not on this list (an attribute can hold any string,
 * including markup) must never get there.
 */
const ALLOWED_TAGS: ReadonlySet<string> = new Set<TextTag>([
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'span',
  'div',
  'label',
  'strong',
  'em'
]);

const VARIANT_TAG: Record<TextVariant, TextTag> = {
  'display-2xl': 'p',
  'display-xl': 'p',
  'display-lg': 'p',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  lead: 'p',
  body: 'p',
  'body-sm': 'p',
  caption: 'span',
  overline: 'span',
  label: 'span'
};

/**
 * Renders text with a predefined typographic style. Display and heading variants
 * (display-2xl → h3) use fluid `clamp()` font sizes that scale between a mobile
 * minimum and a desktop maximum. The rendered HTML tag matches the variant by
 * default but can be overridden with the `as` attribute.
 *
 * Override font-weight on any variant with `--lt-text-weight`:.
 * ```css
 * lt-text { --lt-text-weight: 700; }
 * ```
 * @element lt-text
 * @cssprop [--lt-text-weight] - Overrides the default font-weight for the variant.
 * @cssprop [--lt-text-tracking] - Overrides the default letter-spacing for the variant.
 * @example
 * ```html
 * <lt-text variant="display-lg" as="h1">Hero heading</lt-text>
 * <lt-text variant="h2" as="h3">Visually h2, semantically h3</lt-text>
 * <lt-text variant="lead">Introductory paragraph.</lt-text>
 * <lt-text variant="overline">Category</lt-text>
 * ```
 */
@customElement('lt-text')
export class Text extends ThemeableElement {
  static styles = textStyles;

  /** Typographic style to apply. */
  @property({ reflect: true }) variant: TextVariant = 'body';

  /** HTML tag to render. Defaults to the semantic tag for the chosen variant; anything outside `TextTag` is ignored. */
  @property({ reflect: true }) as: TextTag | '' = '';

  protected updated(changed: PropertyValues<this>) {
    super.updated(changed);
    if (changed.has('as') && this.as && !ALLOWED_TAGS.has(this.as)) {
      devWarn('lt-text', `unknown \`as\` value "${this.as}" — falling back to the variant's default tag`);
    }
    if (changed.has('variant') && !(this.variant in VARIANT_TAG)) {
      devWarn('lt-text', `unknown \`variant\` value "${this.variant}" — no typographic styles will apply`);
    }
  }

  render() {
    const requested = this.as && ALLOWED_TAGS.has(this.as) ? this.as : '';
    const tag = unsafeStatic(requested || VARIANT_TAG[this.variant] || 'p');
    return html`<${tag} part="base"><slot></slot></${tag}>`;
  }
}
