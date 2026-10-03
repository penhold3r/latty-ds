import { Z_INDEX_STICKY, Z_INDEX_OVERLAY } from '../constants/';

/**
 * Stacking-layer scale.
 *
 * - `sticky`: in-flow elements that sit above normal content (header, nav)
 * - `overlay`: floating overlay content not on the native top layer (select, combobox, dropdown, tooltip,
 *   date-input's calendar popover) — components using native `<dialog>`/the Popover API (dialog, sidepanel,
 *   snackbar) don't need a z-index token at all, since the top layer always wins regardless of stacking context.
 */
export type ZIndexLayer = 'sticky' | 'overlay';

export const buildZIndex = (): Record<ZIndexLayer, string> => ({
  sticky: Z_INDEX_STICKY,
  overlay: Z_INDEX_OVERLAY
});
