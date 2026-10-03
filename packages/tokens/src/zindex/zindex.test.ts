import { describe, it, expect } from 'vitest';

import { buildZIndex } from './';

describe('buildZIndex', () => {
  it('defines the sticky and overlay layers', () => {
    const z = buildZIndex();
    expect(z).toEqual({ sticky: '100', overlay: '1000' });
  });

  it('orders overlay above sticky', () => {
    const z = buildZIndex();
    expect(Number(z.overlay)).toBeGreaterThan(Number(z.sticky));
  });
});
