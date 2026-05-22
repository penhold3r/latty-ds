/// <reference types="vitest-axe/extend-expect" />
import '@testing-library/jest-dom';
import { expect } from 'vitest';
import * as axeMatchers from 'vitest-axe/matchers';
expect.extend(axeMatchers);

// Register all icons for tests — components no longer auto-register them
import { iconRegistry } from './packages/icons/src/registry/icon-registry';
import { lattyIcons } from './packages/icons/src/icons';
iconRegistry.registerIcons(lattyIcons);
