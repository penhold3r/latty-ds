import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ThemeableElement } from '../../base';

import { iconButtonStyles } from './icon-button.styles';
import type { IconButtonVariant, IconButtonAppearance, IconButtonSize } from './icon-button.types';
import { AriaForwardingController } from '../shared/aria-forwarding';

import '@latty-ds/icons';

/**
 * Icon-only button. Requires `label` for screen readers since there is no visible text.
 *
 * Forwards host `aria-pressed`, `aria-expanded`, `aria-haspopup`, `aria-controls`, and
 * `aria-current` onto the internal native control (e.g. for dropdown triggers).
 *
 * @element lt-icon-button
 *
 * @example
 * ```html
 * <lt-icon-button icon="xmark" label="Close dialog"></lt-icon-button>
 * ```
 *
 * @example
 * ```html
 * <lt-icon-button icon="plus" label="Add item" variant="primary" appearance="filled"></lt-icon-button>
 * ```
 */
@customElement('lt-icon-button')
export class IconButton extends ThemeableElement {
  static styles = iconButtonStyles;

  private _ariaForwarding = new AriaForwardingController(this, () => this.shadowRoot?.querySelector('[part="base"]'));

  /** Icon name from the icon library. */
  @property({ reflect: true }) icon = '';

  /** Accessible label for screen readers. Required when there is no visible text. */
  @property({ reflect: true }) label = '';

  /**
   * Visual variant that determines the icon/background color.
   * @default 'neutral'
   */
  @property({ reflect: true }) variant: IconButtonVariant = 'neutral';

  /**
   * Visual treatment.
   * @default 'ghost'
   */
  @property({ reflect: true }) appearance: IconButtonAppearance = 'ghost';

  /**
   * Adds a variant-colored border on top of the current appearance. A no-op on
   * `outlined` (which already has one); adds a border to `filled`/`ghost`.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) bordered = false;

  /**
   * Size of the button.
   * @default 'md'
   */
  @property({ reflect: true }) size: IconButtonSize = 'md';

  /** Whether the button is disabled. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  connectedCallback() {
    super.connectedCallback();
    // Capture phase, so it runs before the event reaches anything else — including a consumer's own listener on
    // this element. The native disabled attribute on the inner button doesn't reliably stop every click from
    // reaching the host: the icon it renders (its own shadow host) can end up as the browser's actual click
    // target instead of the disabled <button> itself, slipping past the native block (verified in Chromium: a
    // disabled icon button's host listener still fires once per click). This closes that gap unconditionally.
    this.addEventListener('click', this._blockClickWhileDisabled, { capture: true });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this._blockClickWhileDisabled, { capture: true });
  }

  private _blockClickWhileDisabled = (e: Event) => {
    if (this.disabled) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  };

  /** When set, renders an `<a>` tag instead of `<button>`. */
  @property() href = '';

  /** Forwarded to the anchor's `target` attribute when `href` is set. */
  @property() target = '';

  /** Forwarded to the anchor's `rel` attribute when `href` is set. */
  @property() rel = '';

  /** Renders as a circle instead of rounded-rectangle. */
  @property({ type: Boolean, reflect: true }) round = false;

  private _inner() {
    return this.icon ? html`<lt-icon name=${this.icon}></lt-icon>` : html`<slot></slot>`;
  }

  render() {
    const label = this.label || undefined;

    if (this.href) {
      const rel = this.rel || (this.target === '_blank' ? 'noopener noreferrer' : undefined);
      return html`
        <a
          part="base"
          href=${this.href}
          target=${ifDefined(this.target || undefined)}
          rel=${ifDefined(rel)}
          aria-label=${ifDefined(label)}
          aria-disabled=${this.disabled ? 'true' : nothing}
          tabindex=${this.disabled ? '-1' : nothing}
        >
          ${this._inner()}
        </a>
      `;
    }

    return html`
      <button part="base" ?disabled=${this.disabled} aria-label=${ifDefined(label)}>${this._inner()}</button>
    `;
  }
}
