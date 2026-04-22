import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { avatarStyles } from './avatar.styles';
import type { AvatarSize, AvatarShape, AvatarColor } from './avatar.types';
import '@latty/icons';

/**
 * Displays a user avatar — image, initials fallback, or icon fallback.
 *
 * @element lt-avatar
 */
@customElement('lt-avatar')
export class Avatar extends LitElement {
  static styles = avatarStyles;

  /** URL of the avatar image. */
  @property() src = '';

  /** Full name used to derive initials when no image is available. */
  @property() name = '';

  /** Accessible label for the image (defaults to `name`). */
  @property() alt = '';

  /** Size of the avatar. */
  @property({ reflect: true }) size: AvatarSize = 'md';

  /** Shape of the avatar. */
  @property({ reflect: true }) shape: AvatarShape = 'circle';

  /** Background color used for the initials and icon fallback states. */
  @property({ reflect: true }) color: AvatarColor = 'neutral';

  @state() private _imgError = false;

  private get _initials(): string {
    return this.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(w => w[0].toUpperCase())
      .join('');
  }

  private _handleImgError() {
    this._imgError = true;
  }

  render() {
    const showImage = this.src && !this._imgError;
    const showInitials = !showImage && this.name;

    return html`
      <span part="base" aria-label=${this.alt || this.name || 'avatar'} role="img">
        ${showImage
          ? html`<img part="image" src=${this.src} alt=${this.alt || this.name} @error=${this._handleImgError} />`
          : showInitials
            ? html`<span part="initials" class="initials">${this._initials}</span>`
            : html`<lt-icon part="icon" name="user" size="sm"></lt-icon>`}
      </span>
    `;
  }
}
