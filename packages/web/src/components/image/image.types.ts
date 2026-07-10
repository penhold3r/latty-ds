/**
 * Native lazy-loading behaviour forwarded to the underlying `<img loading>` attribute.
 *
 * - `eager`: Load immediately, regardless of viewport position (browser default)
 * - `lazy`: Defer loading until the image approaches the viewport
 */
export type ImageLoading = 'eager' | 'lazy';
