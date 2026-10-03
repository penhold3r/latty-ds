/* eslint-disable no-console -- the one deliberate console call in this package, gated to non-production builds */

/**
 * Logs a developer-facing warning, stripped in production. The `typeof process` guard keeps an unbundled browser
 * (no `process` global) silent instead of throwing; bundlers replace `process.env.NODE_ENV` and drop the branch.
 */
export const devWarn = (tag: string, message: string): void => {
  if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
    console.warn(`[${tag}] ${message}`);
  }
};
