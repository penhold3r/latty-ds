/**
 * A ref-counted `document.body` scroll lock, shared by every modal surface (`lt-dialog`, and `lt-sidepanel`)
 * so overlapping modals don't fight over `body.style.overflow`.
 *
 * Each caller must pair one {@link lockBodyScroll} with exactly one {@link unlockBodyScroll} — a component
 * typically does this in its own open/close handling, plus `disconnectedCallback` as a fallback for being
 * removed from the DOM while still open (unpaired locks otherwise leave the page permanently unscrollable).
 * Track whether *this instance* currently holds a lock (e.g. A private boolean field) so that fallback release
 * only ever fires once per lock actually taken.
 *
 * Only the first lock (when the count goes 0 → 1) captures the pre-lock `overflow` value; only the last unlock
 * (when the count returns to 0) restores it — so a consumer's own `overflow` setting on `body` (if any) survives
 * a modal opening and closing, instead of being clobbered back to `''` regardless of what it was before.
 * @example
 * ```ts
 * private _scrollLocked = false;
 *
 * private handleOpen() {
 *   if (!this._scrollLocked) { lockBodyScroll(); this._scrollLocked = true; }
 * }
 * private handleClose() {
 *   if (this._scrollLocked) { unlockBodyScroll(); this._scrollLocked = false; }
 * }
 * disconnectedCallback() {
 *   super.disconnectedCallback();
 *   if (this._scrollLocked) { unlockBodyScroll(); this._scrollLocked = false; }
 * }
 * ```
 */
let lockCount = 0;
let previousOverflow: string | null = null;

export function lockBodyScroll(): void {
  if (lockCount === 0) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  lockCount++;
}

export function unlockBodyScroll(): void {
  if (lockCount === 0) return; // defensive: an unpaired unlock() should never go negative or touch the style
  lockCount--;
  if (lockCount === 0) {
    document.body.style.overflow = previousOverflow ?? '';
    previousOverflow = null;
  }
}
