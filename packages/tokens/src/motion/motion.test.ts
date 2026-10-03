import { describe, it, expect } from 'vitest';

import { buildMotion } from './';

describe('buildMotion', () => {
  it('defines the full duration scale', () => {
    const { duration } = buildMotion();
    expect(duration).toEqual({
      instant: '100ms',
      fast: '150ms',
      moderate: '200ms',
      slow: '300ms'
    });
  });

  it('defines the full easing scale', () => {
    const { ease } = buildMotion();
    expect(ease).toEqual({
      standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
      emphasized: 'cubic-bezier(0.34, 1.2, 0.64, 1)'
    });
  });

  it('orders duration tiers from shortest to longest', () => {
    const { duration } = buildMotion();
    const ms = (v: string) => Number(v.replace('ms', ''));
    expect(ms(duration.instant)).toBeLessThan(ms(duration.fast));
    expect(ms(duration.fast)).toBeLessThan(ms(duration.moderate));
    expect(ms(duration.moderate)).toBeLessThan(ms(duration.slow));
  });
});
