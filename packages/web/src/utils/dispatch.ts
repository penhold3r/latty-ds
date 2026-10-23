// eslint-disable-next-line jsdoc/require-param -- init.cancelable is a property of the init object, not a separate parameter
/**
 * Dispatches a custom event from the specified host element.
 * The event bubbles and is composed by default.
 * @param {EventTarget} host - The element or target to dispatch the event from.
 * @param {string} name - The name of the custom event.
 * @param {unknown} [detail] - Optional data to include in the event's detail property.
 * @param {{ cancelable?: boolean }} [init] - Optional event initialization options.
 * @returns {boolean} A boolean indicating whether the event was canceled.
 * @example
 * ```ts
 * dispatch(button, 'lt-click', { originalEvent: e });
 * ```
 */
export const dispatch = (host: EventTarget, name: string, detail?: unknown, init?: { cancelable?: boolean }): boolean =>
  host.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true, ...init }));
