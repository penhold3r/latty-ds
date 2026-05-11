/// <reference types="vitest-axe/extend-expect" />
import '@testing-library/jest-dom';
import { expect } from 'vitest';
import * as axeMatchers from 'vitest-axe/matchers';
expect.extend(axeMatchers);
