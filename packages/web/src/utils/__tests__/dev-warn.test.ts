import { describe, it, expect, vi, afterEach } from 'vitest';
import { devWarn } from '../dev-warn';

describe('devWarn', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    vi.restoreAllMocks();
  });

  it('logs a tagged warning outside production', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    process.env.NODE_ENV = 'development';
    devWarn('lt-test', 'something is off');
    expect(warn).toHaveBeenCalledWith('[lt-test] something is off');
  });

  it('is silent in production', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    process.env.NODE_ENV = 'production';
    devWarn('lt-test', 'something is off');
    expect(warn).not.toHaveBeenCalled();
  });

  it('is silent when there is no process global (an unbundled browser), rather than throwing', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.stubGlobal('process', undefined);
    try {
      expect(() => devWarn('lt-test', 'something is off')).not.toThrow();
      expect(warn).not.toHaveBeenCalled();
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
