import { html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ThemeableElement } from '../../base';
import type { PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { avatarStyles } from './avatar.styles';
import type { AvatarSize, AvatarShape, AvatarColor, AvatarStatus } from './avatar.types';
import '@latty-ds/icons';

/**
 * Displays a user avatar — image, initials fallback, or icon fallback.
 *
 * @element lt-avatar
 * @part status - The presence-indicator dot, when `status` is set.
 *
 * @example
 * ```html
 * <lt-avatar name="Jane Doe" status="online"></lt-avatar>
 * ```
 */
@customElement('lt-avatar')
export class Avatar extends ThemeableElement {
  static styles = avatarStyles;

  /** URL of the avatar image. */
  @property() src = '';

  /** Full name used to derive initials when no image is available. */
  @property({ reflect: true }) name = '';

  /** Accessible label for the image (defaults to `name`). */
  @property() alt = '';

  /** Size of the avatar. */
  @property({ reflect: true }) size: AvatarSize = 'md';

  /** Shape of the avatar. */
  @property({ reflect: true }) shape: AvatarShape = 'circle';

  /** Background color used for the initials and icon fallback states. */
  @property({ reflect: true }) color: AvatarColor = 'neutral';

  /** Presence indicator dot in the corner. Omitted when unset. */
  @property({ reflect: true }) status?: AvatarStatus;

  /**
   * Accessible label for the status, appended to the avatar's own label (e.g. "Jane Doe, Online"). Defaults to
   * the capitalized status name — override for i18n.
   */
  @property({ attribute: 'status-label' }) statusLabel = '';

  @state() private _imgError = false;

  private get _statusLabel(): string {
    if (!this.status) return '';
    return this.statusLabel || this.status[0].toUpperCase() + this.status.slice(1);
  }

  // Array.from walks code points, so an emoji or other astral character isn't cut in half; empty words are dropped,
  // so a whitespace-only name yields no initials instead of throwing.
  private get _initials(): string {
    return this.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => Array.from(word)[0].toUpperCase())
      .join('');
  }

  willUpdate(changed: PropertyValues<this>) {
    // A new src deserves a fresh attempt: without this, one failed load pinned the fallback forever.
    if (changed.has('src')) this._imgError = false;
  }

  private _handleImgError() {
    this._imgError = true;
  }

  render() {
    const showImage = this.src && !this._imgError;
    const showInitials = !showImage && this._initials;
    const label = this.alt || this.name.trim();
    const fullLabel = [label, this._statusLabel].filter(Boolean).join(', ');

    // With neither alt/name nor a status there is nothing meaningful to announce, so it is decorative rather
    // than "avatar".
    // The status dot is a sibling of the base span, not a child of it — the base span has overflow:hidden to
    // crop the image/initials to the circle/square shape, which would also clip a dot sitting right at its
    // corner. Positioned relative to the host instead, it sits outside that clip.
    return html`
      <span part="base" role=${fullLabel ? 'img' : 'presentation'} aria-label=${ifDefined(fullLabel || undefined)}>
        ${showImage
          ? html`<img part="image" src=${this.src} alt=${this.alt || this.name} @error=${this._handleImgError} />`
          : showInitials
            ? html`<span part="initials" class="initials">${this._initials}</span>`
            : html`<lt-icon part="icon" name="user" size="sm"></lt-icon>`}
      </span>
      ${this.status ? html`<span part="status" class="status"></span>` : nothing}
    `;
  }
}
