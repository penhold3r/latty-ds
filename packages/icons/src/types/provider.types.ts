/**
 * An external icon source that the registry resolves icons from.
 */
export interface IconProvider {
  /** Unique name identifying this provider. */
  readonly name: string;

  /** Returns the SVG markup for the given icon name, or `undefined` if not available. */
  getIcon(name: string): string | undefined;

  /**
   * Optional: returns all icon names this provider can supply.
   * Used by `getAvailableIcons()` to include provider icons in the full list.
   * Omit for large libraries where enumeration is expensive.
   */
  listIcons?(): string[];
}

export interface ProviderOptions {
  /**
   * Where this provider sits in the resolution chain.
   * - `'override'` (default) — checked before built-in icons, so the provider's
   *   icons replace Latty's even inside components like checkbox or select.
   * - `'fallback'` — checked after built-in and custom icons, only fills gaps.
   */
  priority?: 'override' | 'fallback';
}
