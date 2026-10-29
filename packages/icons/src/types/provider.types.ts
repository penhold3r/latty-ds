/**
 * An external icon source that the registry can fall back to
 * when an icon isn't found in the built-in or custom set.
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
