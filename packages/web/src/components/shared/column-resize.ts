import type { TableColumn } from '../table/table.types';

/** Smallest width a column can be dragged/keyed down to, when it has no explicit `minWidth` of its own. */
export const DEFAULT_MIN_COLUMN_WIDTH = 40;

/** Pixels a keyboard arrow-key press grows/shrinks a resizable column by. */
export const RESIZE_KEY_STEP = 10;

/**
 * A column's minimum width in pixels, as a plain number — its own `minWidth` when it parses as one,
 * otherwise the shared floor every resizable column gets regardless.
 */
export function getColumnMinWidthPx<T>(column: TableColumn<T>): number {
  const parsed = column.minWidth ? parseFloat(column.minWidth) : NaN;
  return Number.isFinite(parsed) ? Math.max(parsed, DEFAULT_MIN_COLUMN_WIDTH) : DEFAULT_MIN_COLUMN_WIDTH;
}

/** Formats a pixel width for a column style. */
export function formatColumnWidth(widthPx: number): string {
  return `${Math.round(widthPx)}px`;
}

export interface ColumnResizeHandlers {
  /** Called continuously during a drag, with the live (unrounded) width to apply. */
  update: (key: string, width: string) => void;
  /** Called once a drag ends / once per keyboard step, with the final committed width. */
  commit: (key: string, width: string) => void;
}

/**
 * Starts a pointer-drag resize of a column. The handle captures the pointer for the whole drag (so
 * a fast movement past the handle's own bounds doesn't drop the gesture) and tracks start
 * position/width as plain closure state. Widths are pushed through the supplied handlers: `update`
 * on every move, `commit` once on release.
 */
export function startColumnResize<T>(e: PointerEvent, column: TableColumn<T>, handlers: ColumnResizeHandlers): void {
  if (e.button !== 0 && e.pointerType === 'mouse') return;
  e.preventDefault();

  const handle = e.currentTarget as HTMLElement;
  const th = handle.closest('th') as HTMLElement;
  const startX = e.clientX;
  const startWidth = th.getBoundingClientRect().width;
  const minWidth = getColumnMinWidthPx(column);
  // A physical drag must track the cursor correctly regardless of reading direction: the handle sits
  // at the column's trailing (inset-inline-end) edge, which is the column's *left* edge under RTL — so
  // "dragging further away from the column" is a *negative* clientX delta there, the opposite of LTR.
  // `direction` is inherited, and the resolve-on-read elements are the host + its shadow tree, so read it from the
  // shadow host when there is one (a bare descendant's computed style isn't guaranteed to expose the inherited value).
  const root = handle.getRootNode();
  const directionSource = root instanceof ShadowRoot ? (root.host as Element) : handle;
  const isRtl = getComputedStyle(directionSource).direction === 'rtl';

  let lastWidth = '';

  handle.setPointerCapture(e.pointerId);

  const onMove = (moveEvent: PointerEvent) => {
    const rawDelta = moveEvent.clientX - startX;
    const delta = isRtl ? -rawDelta : rawDelta;
    lastWidth = formatColumnWidth(Math.max(minWidth, startWidth + delta));
    handlers.update(column.key, lastWidth);
  };

  const onUp = (upEvent: PointerEvent) => {
    handle.removeEventListener('pointermove', onMove);
    handle.removeEventListener('pointerup', onUp);
    handle.releasePointerCapture(upEvent.pointerId);
    if (lastWidth) handlers.commit(column.key, lastWidth);
  };

  handle.addEventListener('pointermove', onMove);
  handle.addEventListener('pointerup', onUp);
}

/**
 * Keyboard alternative to dragging (WCAG 2.5.1 — a pointer-only drag gesture needs a non-pointer
 * equivalent). Arrow-right always grows and arrow-left always shrinks, the same as a native
 * `<input type="range">`'s own increment keys — unlike the mouse drag, this doesn't flip for RTL,
 * since "right arrow increases" is the more universally understood convention for a plain
 * magnitude control.
 */
export function handleColumnResizeKeydown<T>(
  e: KeyboardEvent,
  column: TableColumn<T>,
  currentWidthPx: number,
  handlers: ColumnResizeHandlers
): void {
  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
  e.preventDefault();

  const minWidth = getColumnMinWidthPx(column);
  const step = e.key === 'ArrowRight' ? RESIZE_KEY_STEP : -RESIZE_KEY_STEP;
  const width = formatColumnWidth(Math.max(minWidth, currentWidthPx + step));
  handlers.update(column.key, width);
  handlers.commit(column.key, width);
}
