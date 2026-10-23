export interface PaginationContext {
  pageSize: number;
  page: number;
  sortedDataLength: number;
}

/**
 * Total number of pages given the sorted data length and `pageSize`. `1` whenever pagination is
 * disabled (`pageSize` unset or less than 1). Public so a consumer can feed it straight into
 * `lt-pagination`'s own `total-pages`.
 * @param {PaginationContext} context - The pagination context.
 * @returns {number} The total number of pages.
 */
export function getTotalPages(context: PaginationContext): number {
  const { pageSize, sortedDataLength } = context;
  if (!pageSize || pageSize < 1) return 1;
  return Math.max(1, Math.ceil(sortedDataLength / pageSize));
}

/**
 * The `page` value, clamped into `1..totalPages` — matches `lt-pagination`'s own clamping, so an out-of-range
 * `page` (for example the data shrank after a fetch) never renders an empty page.
 * @param {PaginationContext} context - The pagination context.
 * @returns {number} The current page number.
 */
export function getCurrentPage(context: PaginationContext): number {
  const totalPages = getTotalPages(context);
  const raw = Math.floor(Number(context.page));
  return Number.isFinite(raw) ? Math.min(Math.max(raw, 1), totalPages) : 1;
}
