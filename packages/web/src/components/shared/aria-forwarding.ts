import { NativeAttrsController } from './native-attrs';

/**
 * Host `aria-*` attributes forwarded onto the internal native control.
 * Kept for backwards compatibility — `NativeAttrsController` now forwards all
 * `aria-*` and native attributes not owned by the component.
 */
export const FORWARDED_ARIA_ATTRIBUTES = [
  'aria-pressed',
  'aria-expanded',
  'aria-haspopup',
  'aria-controls',
  'aria-current',
  'aria-description'
] as const;

export { NativeAttrsController, NativeAttrsController as AriaForwardingController };
