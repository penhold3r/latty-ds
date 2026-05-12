import { LitElement, type PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';

export type ComponentTheme = 'dark' | 'light';

export class ThemeableElement extends LitElement {
  /**
   * Forces the component into a specific theme regardless of the page theme.
   * `'dark'` | `'light'` — if unset, the component inherits the global scope theme.
   *
   * @example
   * ```html
   * <!-- Always dark, even on a light page -->
   * <lt-surface theme="dark">…</lt-surface>
   *
   * <!-- Always light, even on a dark page -->
   * <lt-button theme="light">Submit</lt-button>
   * ```
   */
  @property({ reflect: true })
  theme?: ComponentTheme;

  override willUpdate(changed: PropertyValues<this>) {
    super.willUpdate(changed);
    if (changed.has('theme')) {
      this._syncThemeAttribute();
    }
  }

  private _syncThemeAttribute() {
    if (this.theme === 'dark' || this.theme === 'light') {
      this.setAttribute('data-theme', this.theme);
    } else {
      this.removeAttribute('data-theme');
    }
  }
}
