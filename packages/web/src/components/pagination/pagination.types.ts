export type PaginationSize = 'sm' | 'md' | 'lg';

/** Overridable UI text for `lt-pagination`, for i18n. */
export interface PaginationLabels {
  /** Accessible landmark label for the pagination `<nav>`. */
  navigation: string;
  /** Accessible label for the "jump to first page" button. */
  firstPage: string;
  /** Accessible label for the "go to previous page" button. */
  previousPage: string;
  /** Accessible label for a numbered page button, given its 1-indexed page number. */
  page: (n: number) => string;
  /** Accessible label for the "go to next page" button. */
  nextPage: string;
  /** Accessible label for the "jump to last page" button. */
  lastPage: string;
}
