import { describe, it, expect } from 'vitest';

import { buildShadow } from './';
import type { PaletteFlat } from '../types/';

describe('buildShadow', () => {
  it('derives the rgb channel from the neutral-900 step', () => {
    const neutral = { '900': '#1b1b1b' } as PaletteFlat;
    expect(buildShadow(neutral)).toEqual({ rgb: '27 27 27' });
  });

  it('falls back to a default dark neutral when neutral-900 is missing', () => {
    const neutral = {} as PaletteFlat;
    expect(buildShadow(neutral)).toEqual({ rgb: '23 23 23' });
  });
});
