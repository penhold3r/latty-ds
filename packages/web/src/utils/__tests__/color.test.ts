import { describe, it, expect } from 'vitest';
import { resolveColorValue } from '../color';

describe('resolveColorValue', () => {
  it('should wrap CSS variables in var()', () => {
    expect(resolveColorValue('--lt-color-primary')).toBe('var(--lt-color-primary)');
  });

  it('should return plain colors as-is', () => {
    expect(resolveColorValue('#ffffff')).toBe('#ffffff');
    expect(resolveColorValue('red')).toBe('red');
    expect(resolveColorValue('rgb(0, 0, 0)')).toBe('rgb(0, 0, 0)');
  });
});
