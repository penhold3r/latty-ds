/**
 * Creates a click-outside handler that executes a callback when a click (or pointer) event
 * occurs outside the specified host element.
 *
 * @param host - The element to detect clicks outside of.
 * @param onOutside - The callback function to execute when a click outside occurs.
 * @param options - Optional configuration for the handler.
 * @param options.event - The event type to listen for (defaults to 'pointerdown').
 * @param options.capture - Whether to use event capture (defaults to false).
 * @returns A cleanup function to remove the event listener.
 *
 * @example
 * ```ts
 * const cleanup = createClickOutsideHandler(element, () => console.log('clicked outside'));
 * // later...
 * cleanup();
 * ```
 */
export const createClickOutsideHandler = (
  host: Element,
  onOutside: () => void,
  options?: { event?: 'click' | 'pointerdown'; capture?: boolean }
): (() => void) => {
  const eventName = options?.event ?? 'pointerdown';
  const capture = options?.capture ?? false;
  const handler = (e: Event) => {
    if (!e.composedPath().includes(host)) onOutside();
  };
  document.addEventListener(eventName, handler, capture ? { capture: true } : undefined);
  return () => document.removeEventListener(eventName, handler, capture ? { capture: true } : undefined);
};
