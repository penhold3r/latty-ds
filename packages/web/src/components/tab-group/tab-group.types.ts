/**
 * Tab group component type definitions.
 */

/**
 * Valid variants for a tab group.
 */
export type TabGroupAppearance = 'default' | 'pills';

/**
 * Valid sizes for a tab group.
 */
export type TabGroupSize = 'sm' | 'md' | 'lg';

/**
 * Valid orientations for a tab group.
 */
export type TabGroupOrientation = 'horizontal' | 'vertical';

/**
 * Tab activation mode. `automatic` selects a tab as soon as it receives focus via arrow keys (default).
 * `manual` moves focus without selecting — the user confirms with Enter or Space.
 */
export type TabGroupActivation = 'automatic' | 'manual';

/** Overridable UI text for `lt-tab-group`, for i18n. */
export interface TabGroupLabels {
  /** Accessible label for the button that scrolls the tab list backward (left, or up when vertical). */
  scrollPrevious: string;
  /** Accessible label for the button that scrolls the tab list forward (right, or down when vertical). */
  scrollNext: string;
}
