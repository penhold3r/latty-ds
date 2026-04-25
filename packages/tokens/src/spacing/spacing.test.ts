import { describe, it, expect } from 'vitest';

import { buildSpacing } from './';

describe('buildSpacing', () => {
  it('exports scales', () => {
    const result = buildSpacing();
    expect(result).toBeTruthy();
  });
});
