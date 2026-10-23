import { describe, it, expect, afterEach } from 'vitest';
import { lockBodyScroll, unlockBodyScroll } from '../scroll-lock';

describe('scroll-lock (DLG-3)', () => {
  afterEach(() => {
    /*
     * The lock count is module-level state, shared across every test in this file — leave it exactly as found
     * (locked, since body.style.overflow is a real, observable side effect on the shared jsdom document).
     */
    document.body.style.overflow = '';
  });

  it('locks body scroll', () => {
    lockBodyScroll();
    expect(document.body.style.overflow).toBe('hidden');
    unlockBodyScroll();
  });

  it('unlocks when the single lock is released', () => {
    lockBodyScroll();
    unlockBodyScroll();
    expect(document.body.style.overflow).toBe('');
  });

  it('is ref-counted: stays locked while a second lock is still held', () => {
    lockBodyScroll();
    lockBodyScroll();
    unlockBodyScroll();
    expect(document.body.style.overflow).toBe('hidden');
    unlockBodyScroll();
    expect(document.body.style.overflow).toBe('');
  });

  it('restores the overflow value that was set before locking, not an empty string', () => {
    document.body.style.overflow = 'scroll';
    lockBodyScroll();
    expect(document.body.style.overflow).toBe('hidden');
    unlockBodyScroll();
    expect(document.body.style.overflow).toBe('scroll');
    document.body.style.overflow = '';
  });

  it('only the first lock in a generation captures the value to restore', () => {
    document.body.style.overflow = 'scroll';
    lockBodyScroll();
    // A second, later lock must not overwrite the captured "scroll" with "hidden" (what it would read right now).
    lockBodyScroll();
    unlockBodyScroll();
    unlockBodyScroll();
    expect(document.body.style.overflow).toBe('scroll');
    document.body.style.overflow = '';
  });

  it('an unpaired unlock() is a no-op, never goes negative', () => {
    unlockBodyScroll();
    unlockBodyScroll();
    /*
     * If the count had gone negative, a single lock()/unlock() pair afterward would incorrectly still show
     * "locked" (count > 0) after the unlock, since it would only bring a very-negative count up to -1 or so.
     */
    lockBodyScroll();
    unlockBodyScroll();
    expect(document.body.style.overflow).toBe('');
  });
});
