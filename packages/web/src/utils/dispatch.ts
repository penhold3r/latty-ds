/**
 * Dispatches a custom event from the specified host element.
 * The event bubbles and is composed by default.
 *
 * @param host - The element or target to dispatch the event from.
 * @param name - The name of the custom event.
 * @param detail - Optional data to include in the event's detail property.
 * @param init - Optional event initialization options.
 * @returns A boolean indicating whether the event was canceled.
 *
 * @example
 * ```ts
 * dispatch(button, 'lt-click', { originalEvent: e });
 * ```
 */
export const dispatch = (host: EventTarget, name: string, detail?: unknown, init?: { cancelable?: boolean }): boolean =>
  host.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true, ...init }));
