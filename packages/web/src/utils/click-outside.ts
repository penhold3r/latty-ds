// eslint-disable-next-line jsdoc/require-param -- options.event and options.capture are properties of the options object, not separate parameters
/**
 * Creates a click-outside handler that executes a callback when a click (or pointer) event
 * occurs outside the specified host element.
 * @param {Element} host - The element to detect clicks outside of.
 * @param {() => void} onOutside - The callback function to execute when a click outside occurs.
 * @param {{ event?: 'click' | 'pointerdown'; capture?: boolean }} [options] - Optional configuration for the handler.
 * @returns {() => void} A cleanup function to remove the event listener.
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
