import { html, nothing } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';

import { avatarGroupStyles } from './avatar-group.styles';
import type { Avatar } from '../avatar/avatar';
import type { AvatarSize } from '../avatar/avatar.types';

import '../avatar/avatar';

/**
 * An overlapping stack of `lt-avatar` elements — e.g. A list of collaborators. Set `max` to cap how many are
 * shown, with a "+N" indicator standing in for the rest. Set `size` to force every avatar (and the indicator) to
 * the same size — overlap only reads correctly when every circle is the same diameter..
 * @element lt-avatar-group
 * @part overflow - The "+N" indicator shown when `max` hides some avatars
 * @slot - `lt-avatar` elements
 * @example
 * ```html
 * <lt-avatar-group max="3" size="sm">
 *   <lt-avatar name="Ada Lovelace"></lt-avatar>
 *   <lt-avatar name="Grace Hopper"></lt-avatar>
 *   <lt-avatar name="Margaret Hamilton"></lt-avatar>
 *   <lt-avatar name="Katherine Johnson"></lt-avatar>
 *   <lt-avatar name="Hedy Lamarr"></lt-avatar>
 * </lt-avatar-group>
 * ```
 */
@customElement('lt-avatar-group')
export class AvatarGroup extends ThemeableElement {
  static styles = avatarGroupStyles;

  /**
   * Uniform size forwarded to every slotted avatar and the overflow indicator — overlapping avatars need a
   * consistent diameter to read as a stack. Leave unset to let each avatar keep its own `size`; the overflow
   * indicator then falls back to `md`.
   */
  @property({ reflect: true }) size?: AvatarSize;

  /** Caps the number of visible avatars; the rest collapse into a "+N" indicator. Unset shows all. */
  @property({ type: Number }) max?: number;

  /**
   * Accessible label template for the overflow indicator. `{n}` is replaced with the hidden count.
   * @default '+{n} more'
   */
  @property({ attribute: 'overflow-label' }) overflowLabel = '+{n} more';

  @queryAssignedElements({ selector: 'lt-avatar' })
  private _avatars!: Avatar[];

  // Purely derived from `max` and the current slotted children — computed fresh in render() rather than cached
  // into a separate reactive property, so a `max`/`size` change settles in the one update cycle Lit already
  // gives it, instead of a second one chained from inside updated() (which a single `await updateComplete`
  // doesn't wait for).
  private get _overflowCount(): number {
    if (this.max === undefined) return 0;
    return Math.max(0, (this._avatars?.length ?? 0) - this.max);
  }

  // Forwards `size` and hides avatars past `max` — side effects on the slotted (light DOM) children, which
  // live outside this component's own render output.
  private _applyToAvatars = () => {
    (this._avatars ?? []).forEach((avatar, i) => {
      if (this.size !== undefined) avatar.size = this.size;
      const isHidden = this.max !== undefined && i >= this.max;
      avatar.hidden = isHidden;
      // lt-avatar's own `:host { display: inline-flex }` is author CSS, which always outranks the UA
      // stylesheet's `[hidden] { display: none }` regardless of specificity — CSS origin beats specificity in
      // the cascade, so the `hidden` property/attribute alone silently does nothing here (confirmed live: all
      // avatars stayed visible). An inline style beats any selector-based rule, :host's included.
      avatar.style.display = isHidden ? 'none' : '';
    });
  };

  // Slotted children changing (add/remove/reorder) doesn't touch any `@property` of this component, so Lit has
  // no reason to re-render on its own — request one explicitly so the overflow count picks up the new count.
  private _handleSlotChange = () => {
    this._applyToAvatars();
    this.requestUpdate();
  };

  connectedCallback() {
    super.connectedCallback();
    this._applyToAvatars();
  }

  protected updated(changed: Map<string, unknown>) {
    super.updated(changed);
    if (changed.has('size') || changed.has('max')) this._applyToAvatars();
  }

  render() {
    const overflowCount = this._overflowCount;
    const overflowLabel = this.overflowLabel.replace('{n}', String(overflowCount));
    return html`
      <slot @slotchange=${this._handleSlotChange}></slot>
      ${overflowCount > 0
        ? html`<span class="overflow" part="overflow" role="img" aria-label=${overflowLabel}>+${overflowCount}</span>`
        : nothing}
    `;
  }
}
