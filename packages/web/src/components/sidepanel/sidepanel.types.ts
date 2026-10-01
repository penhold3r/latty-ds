/**
 * Edge the panel slides in from. `'start'`/`'end'` are logical — they resolve to the left/right edge based on
 * the page's reading direction (left/right in LTR, right/left in RTL), not a fixed physical side.
 */
export type SidePanelAnchor = 'start' | 'end' | 'top' | 'bottom';

/** Overridable UI text, for i18n — English defaults; override only the keys you need. */
export interface SidePanelLabels {
  /** Accessible label for the close button. */
  close: string;
}
