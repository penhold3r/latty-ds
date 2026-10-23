/**
 * Suppresses the default `mousedown` action that would otherwise move focus onto the pressed element.
 *
 * Form controls layer real buttons inside their own field — a clear button, a password toggle, a dropdown
 * option — and a plain press on one of those would pull focus out of the control (in the dropdown case, off
 * it entirely, since the option disappears as the dropdown closes). Preventing just the default action leaves
 * the click itself, and the handler it fires, untouched.
 */
export function preventFocusSteal(e: MouseEvent): void {
  e.preventDefault();
}
