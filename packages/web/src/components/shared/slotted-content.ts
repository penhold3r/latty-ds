import type { ReactiveController, ReactiveControllerHost } from 'lit';

/**
 * Tracks whether a host element has meaningful default-slot content (slotted elements, or non-whitespace text),
 * so a component can conditionally render a wrapper around its label slot without leaving stray flex/grid gap
 * spacing when nothing is actually there.
 *
 * Checked synchronously on connect — not only via `slotchange` — so markup present at parse/upgrade time is
 * correct on the very first render; `slotchange` fires after the browser resolves initial slot assignment, which
 * would otherwise cause a one-frame layout flash for slotted-only content with no fallback. Re-checked on
 * `slotchange` for content added or removed later (e.g. a framework setting `textContent` after construction).
 */
export class SlottedContentController implements ReactiveController {
  private _host: ReactiveControllerHost & Element;
  hasContent = false;

  constructor(host: ReactiveControllerHost & Element) {
    this._host = host;
    host.addController(this);
  }

  hostConnected() {
    this._sync();
  }

  onSlotChange = () => this._sync();

  private _sync() {
    const hasContent = Array.from(this._host.childNodes).some(
      (n) => n.nodeType === Node.ELEMENT_NODE || (n.nodeType === Node.TEXT_NODE && !!n.textContent?.trim())
    );
    if (hasContent !== this.hasContent) {
      this.hasContent = hasContent;
      this._host.requestUpdate();
    }
  }
}
