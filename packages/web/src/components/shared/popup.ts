import { createClickOutsideHandler } from '../../utils';
import { openFloating, closeFloating, type FloatingOptions } from './floating';

/**
 * How a {@link PopupController} should behave for one component.
 */
export interface PopupOptions {
  /**
   * Resolves the panel the popup shows — the element that gets positioned against the reference.
   *
   * Resolved lazily, because a panel usually only exists once the component has rendered at least once.
   */
  panel: () => HTMLElement | null;

  /**
   * Resolves the element the panel is positioned against.
   */
  reference: () => Element | null;

  /**
   * How the panel is positioned — placement, offset, and whether it matches the reference's width.
   *
   * Resolved on every open, because the placement a component asks for can change while it is on screen
   * (`lt-dropdown`'s `placement` is a public property).
   */
  floating?: () => FloatingOptions;

  /**
   * Which pointer event counts as a click outside the popup.
   *
   * `click` waits for the whole click to finish; `pointerdown` closes the popup as soon as the press starts.
   */
  outsideEvent?: 'click' | 'pointerdown';

  /** Whether the outside click is caught while it is still travelling down the tree. */
  outsideCapture?: boolean;

  /** Called when the user clicks outside the popup. */
  onOutside: () => void;
}

/**
 * The open/close lifecycle every floating popup shares.
 *
 * `lt-select`, `lt-combobox`, `lt-dropdown` and `lt-date-input` each grew their own copy of the same
 * sequence — position the panel with floating-ui, watch for a click outside, and tear the autoUpdate
 * listener down again — and the copies drifted apart: two of them held a document-level listener for
 * the element's whole lifetime, two held one only while the popup was open, and one of those
 * installed it *after* awaiting the positioning.
 *
 * This class owns the sequence. What stays with each component is what genuinely differs between them:
 * which element the panel is positioned against, how it is positioned, which pointer event counts as
 * a click outside, and what closing means (a dropdown hands focus back to its trigger, a combobox
 * keeps it in its input).
 */
export class PopupController {
  readonly #host: HTMLElement;
  readonly #options: PopupOptions;

  #floatingCleanup: (() => void) | null = null;
  #outsideCleanup: (() => void) | null = null;
  #panel: HTMLElement | null = null;
  #open = false;

  /**
   * Invalidated by every close, so a close that lands while `openFloating` is still resolving can be
   * told apart from an open that is still in flight.
   */
  #token: symbol | null = null;

  constructor(host: HTMLElement, options: PopupOptions) {
    this.#host = host;
    this.#options = options;
  }

  /** Whether the popup is currently open. */
  get isOpen(): boolean {
    return this.#open;
  }

  /**
   * Positions the panel against its reference and starts watching for a click outside.
   *
   * Safe to call more than once: a second open would start a second floating autoUpdate and overwrite
   * the first one's cleanup, leaking a scroll/resize listener pair on every open.
   */
  async open(): Promise<void> {
    if (this.#open) return;

    this.#open = true;
    const token = (this.#token = Symbol('popup'));

    this.#outsideCleanup = createClickOutsideHandler(this.#host, () => this.#options.onOutside(), {
      event: this.#options.outsideEvent ?? 'click',
      capture: this.#options.outsideCapture ?? false
    });

    const panel = this.#options.panel();
    const reference = this.#options.reference();
    if (!panel || !reference) {
      this.close();
      return;
    }
    this.#panel = panel;

    const cleanup = await openFloating(reference, panel, this.#options.floating?.());
    /*
     * A close that happened while openFloating was resolving must not leave the autoUpdate cleanup
     * orphaned — it would keep a scroll/resize listener pair alive on a panel that is no longer on
     * screen.
     */
    if (this.#token !== token) cleanup();
    else this.#floatingCleanup = cleanup;
  }

  /**
   * Hides the panel and stops watching for a click outside. Safe to call when the popup was never
   * open.
   */
  close(): void {
    this.#open = false;
    this.#token = null;

    this.#outsideCleanup?.();
    this.#outsideCleanup = null;

    const panel = this.#panel ?? this.#options.panel();
    this.#panel = null;
    if (panel) closeFloating(panel, this.#floatingCleanup);
    this.#floatingCleanup = null;
  }

  /**
   * Tears the popup down for good — the component is going away.
   */
  destroy(): void {
    this.close();
  }
}
