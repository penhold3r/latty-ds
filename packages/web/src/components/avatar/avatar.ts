import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ThemeableElement } from '../../base';
import type { PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { avatarStyles } from './avatar.styles';
import type { AvatarSize, AvatarShape, AvatarColor } from './avatar.types';
import '@latty-ds/icons';

/**
 * Displays a user avatar — image, initials fallback, or icon fallback.
 *
 * @element lt-avatar
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

  @state() private _imgError = false;

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

    // With neither alt nor a name there is nothing meaningful to announce, so it is decorative rather than "avatar".
    return html`
      <span part="base" role=${label ? 'img' : 'presentation'} aria-label=${ifDefined(label || undefined)}>
        ${showImage
          ? html`<img part="image" src=${this.src} alt=${this.alt || this.name} @error=${this._handleImgError} />`
          : showInitials
            ? html`<span part="initials" class="initials">${this._initials}</span>`
            : html`<lt-icon part="icon" name="user" size="sm"></lt-icon>`}
      </span>
    `;
  }
}
