/** Default row height fallback when virtualized but rowHeight unset/invalid. */
export const DEFAULT_ROW_HEIGHT = 44;

/** Extra rows rendered beyond the strictly-visible range on each side, so a fast scroll doesn't flash blank. */
export const VIRTUAL_OVERSCAN = 4;

export interface VirtualizationConfig {
  /** Whether virtualization is enabled. */
  virtualized: boolean;
  /** Fixed height of the scroll container (e.g. '400px'). Required for virtualization. */
  height: string;
  /** Fixed pixel height every row renders at. */
  rowHeight: number;
  /** Current scroll offset of the container. */
  scrollTop: number;
  /** Measured rendered height of the container. */
  viewportHeight: number;
}

export interface PageRange {
  start: number;
  end: number;
}

/** A row paired with its global index within the full sorted data. */
export interface RowEntry<T> {
  row: T;
  index: number;
}

/**
 * The page's row range as plain indices into the sorted data — computed without materializing any
 * rows, so callers that only need the count (for example a virtualized render's spacer-row math)
 * stay O(1).
 * @param {number} sortedDataLength - The total length of sorted data.
 * @param {number} pageSize - The page size.
 * @param {number} currentPage - The current page number.
 * @returns {PageRange} The page range.
 */
export function getPageRange(sortedDataLength: number, pageSize: number, currentPage: number): PageRange {
  if (!pageSize || pageSize < 1) return { start: 0, end: sortedDataLength };
  const start = (currentPage - 1) * pageSize;
  return { start, end: Math.min(start + pageSize, sortedDataLength) };
}

/**
 * Every row on the current page, paired with its global index within `sortedData`. The index is
 * preserved (not re-based to the page) so `rowIndex` in `column.render`, `rowclick`'s detail, and
 * row-selection keys all keep meaning "position within the full sorted data". Slices `sortedData`
 * before mapping, so this costs O(page size), not O(total rows).
 * @param {readonly T[]} sortedData - The sorted data.
 * @param {PageRange} pageRange - The page range.
 * @returns {RowEntry<T>[]} The paged entries.
 */
export function getPagedEntries<T>(sortedData: readonly T[], pageRange: PageRange): RowEntry<T>[] {
  const { start, end } = pageRange;
  return sortedData.slice(start, end).map((row, i) => ({ row, index: start + i }));
}

/**
 * The rows actually rendered into the DOM: the paged entries as-is, unless virtualized (with
 * `height` set) further windows them down to the visible range plus a small overscan buffer.
 * Slices `sortedData` directly for the visible window rather than materializing the whole page
 * first, so scrolling a virtualized table costs O(visible rows) — the entire point, since a
 * scroll event recomputes this on every tick.
 * @param {readonly T[]} sortedData - The sorted data.
 * @param {PageRange} pageRange - The page range.
 * @param {VirtualizationConfig} config - The virtualization configuration.
 * @returns {RowEntry<T>[]} The visible entries.
 */
export function getVisibleEntries<T>(
  sortedData: readonly T[],
  pageRange: PageRange,
  config: VirtualizationConfig
): RowEntry<T>[] {
  const { start: pageStart, end: pageEnd } = pageRange;
  if (!config.virtualized || !config.height) return getPagedEntries(sortedData, pageRange);

  const pageRowCount = pageEnd - pageStart;
  const rowHeightPx = config.rowHeight > 0 ? config.rowHeight : DEFAULT_ROW_HEIGHT;
  const windowStart = Math.max(0, Math.floor(config.scrollTop / rowHeightPx) - VIRTUAL_OVERSCAN);
  const windowEnd = Math.min(
    pageRowCount,
    Math.ceil((config.scrollTop + config.viewportHeight) / rowHeightPx) + VIRTUAL_OVERSCAN
  );
  const absoluteStart = pageStart + windowStart;
  const absoluteEnd = pageStart + windowEnd;

  return sortedData.slice(absoluteStart, absoluteEnd).map((row, i) => ({ row, index: absoluteStart + i }));
}

/**
 * Number of spacer rows needed above and below the rendered window in a virtualized table. Rows
 * scrolled out of view still need to occupy their own vertical space, or the scrollbar's range
 * would be wrong.
 * @param {readonly RowEntry<unknown>[]} visibleEntries - The visible entries.
 * @param {PageRange} pageRange - The page range.
 * @returns {{ topSpacerRows: number; bottomSpacerRows: number }} The spacer rows.
 */
export function getVirtualSpacers(
  visibleEntries: readonly RowEntry<unknown>[],
  pageRange: PageRange
): { topSpacerRows: number; bottomSpacerRows: number } {
  if (visibleEntries.length === 0) return { topSpacerRows: 0, bottomSpacerRows: 0 };

  const { start: pageStart, end: pageEnd } = pageRange;
  const pageRowCount = pageEnd - pageStart;
  const firstRenderedOffset = visibleEntries[0].index - pageStart;
  const lastRenderedOffset = visibleEntries[visibleEntries.length - 1].index - pageStart;

  return {
    topSpacerRows: Math.max(0, firstRenderedOffset),
    bottomSpacerRows: Math.max(0, pageRowCount - 1 - lastRenderedOffset)
  };
}

/**
 * Dev-mode warning for a table configured with `virtualized` but no `height`. Returns the message
 * (for the caller to pass to `devWarn`) or `null` when the config is fine.
 * @param {Pick<VirtualizationConfig, 'virtualized' | 'height'>} config - The virtualization config.
 * @returns {string | null} The warning message or null.
 */
export function virtualizationWarning(config: Pick<VirtualizationConfig, 'virtualized' | 'height'>): string | null {
  if (config.virtualized && !config.height) {
    return '`virtualized` has no effect without `height` — give the table a bounded height so there is a viewport to compute visible rows against';
  }
  return null;
}
