import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ListboxTypeahead, nextListboxIndex, normalizeSearchText } from '../listbox-nav';

describe('nextListboxIndex', () => {
  it('returns -1 for an empty list regardless of key', () => {
    expect(nextListboxIndex('ArrowDown', 2, 0)).toBe(-1);
    expect(nextListboxIndex('Home', -1, 0)).toBe(-1);
  });

  it('ArrowDown advances by one and wraps from the last index to the first', () => {
    expect(nextListboxIndex('ArrowDown', 1, 5)).toBe(2);
    expect(nextListboxIndex('ArrowDown', 4, 5)).toBe(0);
  });

  it('ArrowUp retreats by one and wraps from the first index to the last', () => {
    expect(nextListboxIndex('ArrowUp', 1, 5)).toBe(0);
    expect(nextListboxIndex('ArrowUp', 0, 5)).toBe(4);
  });

  it('Home always goes to index 0', () => {
    expect(nextListboxIndex('Home', 3, 5)).toBe(0);
    expect(nextListboxIndex('Home', -1, 5)).toBe(0);
  });

  it('End always goes to the last index', () => {
    expect(nextListboxIndex('End', 0, 5)).toBe(4);
    expect(nextListboxIndex('End', -1, 5)).toBe(4);
  });

  it('PageDown jumps forward by the page size, clamped to the last index (not wrapping)', () => {
    expect(nextListboxIndex('PageDown', 0, 20)).toBe(10);
    expect(nextListboxIndex('PageDown', 15, 20)).toBe(19);
  });

  it('PageUp jumps backward by the page size, clamped to 0 (not wrapping)', () => {
    expect(nextListboxIndex('PageUp', 15, 20)).toBe(5);
    expect(nextListboxIndex('PageUp', 3, 20)).toBe(0);
  });

  it('PageDown/PageUp from no active selection (-1) start from the natural end', () => {
    expect(nextListboxIndex('PageDown', -1, 20)).toBe(9);
    expect(nextListboxIndex('PageUp', -1, 20)).toBe(0);
  });
});

describe('ListboxTypeahead', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('matches the next option after afterIndex whose label starts with the typed character', () => {
    const t = new ListboxTypeahead();
    const labels = ['Apple', 'Banana', 'Cherry', 'Avocado'];
    expect(t.match('a', labels, 0)).toBe(3); // wraps past Banana/Cherry to Avocado, after index 0 (Apple)
  });

  it('is case-insensitive', () => {
    const t = new ListboxTypeahead();
    expect(t.match('B', ['Apple', 'Banana'], 0)).toBe(1);
  });

  it('accumulates multiple characters typed within the timeout into one buffer', () => {
    const t = new ListboxTypeahead();
    const labels = ['Japan', 'Jordan', 'Java'];
    t.match('j', labels, -1);
    const result = t.match('a', labels, -1);
    // buffer is now "ja" — only "Japan" and "Java" match, "Jordan" doesn't
    expect(['Japan', 'Java']).toContain(labels[result!]);
  });

  it('resets the buffer after the timeout elapses, starting a fresh match', () => {
    const t = new ListboxTypeahead(500);
    const labels = ['Japan', 'Banana'];
    t.match('j', labels, -1);
    vi.advanceTimersByTime(600);
    const result = t.match('b', labels, -1);
    expect(result).toBe(1); // "b" alone, not "jb" (which would match nothing)
  });

  it('returns null when nothing matches', () => {
    const t = new ListboxTypeahead();
    expect(t.match('z', ['Apple', 'Banana'], -1)).toBeNull();
  });

  it('wraps around to before afterIndex when the match is earlier in the list', () => {
    const t = new ListboxTypeahead();
    const labels = ['Apple', 'Banana', 'Cherry'];
    expect(t.match('a', labels, 2)).toBe(0); // wraps past end back to Apple
  });

  it('dispose() clears the pending reset timer without throwing', () => {
    const t = new ListboxTypeahead();
    t.match('a', ['Apple'], -1);
    expect(() => t.dispose()).not.toThrow();
  });
});

describe('normalizeSearchText', () => {
  it('lowercases and strips diacritics', () => {
    expect(normalizeSearchText('Café')).toBe('cafe');
    expect(normalizeSearchText('Élégant')).toBe('elegant');
  });
  it('handles strings without diacritics', () => {
    expect(normalizeSearchText('Apple')).toBe('apple');
  });
});
