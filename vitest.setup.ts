/// <reference types="vitest-axe/extend-expect" />
import '@testing-library/jest-dom';
import { expect } from 'vitest';
import * as axeMatchers from 'vitest-axe/matchers';
expect.extend(axeMatchers);

// Register all icons for tests — components no longer auto-register them
import { iconRegistry } from './packages/icons/src/registry/icon-registry';
import { lattyIcons } from './packages/icons/src/icons';
iconRegistry.registerIcons(lattyIcons);

// jsdom's ElementInternals is a partial stub — patch the form-association methods
// so tests don't blow up on components that use static formAssociated = true.
if (typeof ElementInternals !== 'undefined') {
  const p = ElementInternals.prototype as Record<string, unknown>;
  if (typeof p['setFormValue'] !== 'function') p['setFormValue'] = () => {};
  if (typeof p['setValidity'] !== 'function') p['setValidity'] = () => {};
  if (typeof p['checkValidity'] !== 'function') p['checkValidity'] = () => true;
  if (typeof p['reportValidity'] !== 'function') p['reportValidity'] = () => true;
}
