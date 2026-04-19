import { describe, it, expect } from 'vitest';

import { buildSpacing } from './';

describe('buildSpacing', () => {
  it('exports scales', () => {
    const result = buildSpacing();

    console.log(result.rem);

    expect(result).toBeTruthy();
  });
});
