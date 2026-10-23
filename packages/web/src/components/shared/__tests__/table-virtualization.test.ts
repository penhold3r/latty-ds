import { describe, it, expect } from 'vitest';
import {
  getPageRange,
  getPagedEntries,
  getVisibleEntries,
  getVirtualSpacers,
  virtualizationWarning,
  DEFAULT_ROW_HEIGHT,
  VIRTUAL_OVERSCAN,
  type VirtualizationConfig
} from '../table-virtualization';

const data = Array.from({ length: 100 }, (_, i) => ({ id: i }));

const config = (overrides: Partial<VirtualizationConfig> = {}): VirtualizationConfig => ({
  virtualized: true,
  height: '400px',
  rowHeight: DEFAULT_ROW_HEIGHT,
  scrollTop: 0,
  viewportHeight: 200,
  ...overrides
});

describe('getPageRange', () => {
  it('covers every row when pagination is disabled', () => {
    expect(getPageRange(100, 0, 1)).toEqual({ start: 0, end: 100 });
  });

  it('returns the current page window', () => {
    expect(getPageRange(100, 10, 3)).toEqual({ start: 20, end: 30 });
  });

  it('clamps the end to the data length on a partial last page', () => {
    expect(getPageRange(25, 10, 3)).toEqual({ start: 20, end: 25 });
  });

  it('can be empty when the page is past the end', () => {
    expect(getPageRange(25, 10, 5)).toEqual({ start: 40, end: 25 });
  });
});

describe('getPagedEntries', () => {
  it('preserves each row global index across pages', () => {
    expect(getPagedEntries(data, { start: 10, end: 12 })).toEqual([
      { row: { id: 10 }, index: 10 },
      { row: { id: 11 }, index: 11 }
    ]);
  });

  it('handles an empty range', () => {
    expect(getPagedEntries(data, { start: 0, end: 0 })).toEqual([]);
  });
});

describe('getVisibleEntries', () => {
  it('renders every paged row when not virtualized', () => {
    const entries = getVisibleEntries(data, { start: 0, end: 50 }, config({ virtualized: false }));
    expect(entries).toHaveLength(50);
  });

  it('renders every paged row when virtualized but height is missing', () => {
    const entries = getVisibleEntries(data, { start: 0, end: 50 }, config({ height: '' }));
    expect(entries).toHaveLength(50);
  });

  it('windows down to the visible range plus overscan', () => {
    // 200px viewport / 44px rows = ~5 visible rows, plus overscan on each side.
    const entries = getVisibleEntries(data, { start: 0, end: 100 }, config());
    expect(entries).toHaveLength(5 + VIRTUAL_OVERSCAN);
    expect(entries[0]).toEqual({ row: { id: 0 }, index: 0 });
  });

  it('moves the window forward as the container scrolls', () => {
    // ScrollTop 440 = 10 rows down; the window starts an overscan buffer above that.
    const entries = getVisibleEntries(data, { start: 0, end: 100 }, config({ scrollTop: 440 }));
    expect(entries[0].index).toBe(10 - VIRTUAL_OVERSCAN);
  });

  it('windows relative to the page start, not the full data set', () => {
    const entries = getVisibleEntries(data, { start: 50, end: 100 }, config());
    expect(entries[0]).toEqual({ row: { id: 50 }, index: 50 });
  });

  it('windows to the last rows when scrolled to the bottom of the page', () => {
    // 10 rows × 44px = 440px of content, minus a 200px viewport → 240px is the bottom.
    const entries = getVisibleEntries(data, { start: 90, end: 100 }, config({ scrollTop: 240 }));
    expect(entries[0].index).toBe(91);
    expect(entries[entries.length - 1].index).toBe(99);
  });
});

describe('getVirtualSpacers', () => {
  it('is all zeros with nothing rendered', () => {
    expect(getVirtualSpacers([], { start: 0, end: 100 })).toEqual({ topSpacerRows: 0, bottomSpacerRows: 0 });
  });

  it('stands in for every row before and after the rendered window', () => {
    // Rendered indices 6..18 within a page of 0..100.
    const entries = Array.from({ length: 13 }, (_, i) => ({ row: {}, index: 6 + i }));
    expect(getVirtualSpacers(entries, { start: 0, end: 100 })).toEqual({
      topSpacerRows: 6,
      bottomSpacerRows: 81
    });
  });

  it('has no top spacer when the window starts at the page start', () => {
    const entries = [{ row: {}, index: 0 }];
    expect(getVirtualSpacers(entries, { start: 0, end: 100 }).topSpacerRows).toBe(0);
  });

  it('has no bottom spacer when the window reaches the page end', () => {
    const entries = [{ row: {}, index: 99 }];
    expect(getVirtualSpacers(entries, { start: 0, end: 100 }).bottomSpacerRows).toBe(0);
  });
});

describe('virtualizationWarning', () => {
  it('is null when not virtualized', () => {
    expect(virtualizationWarning({ virtualized: false, height: '' })).toBeNull();
  });

  it('is null when virtualized with a height', () => {
    expect(virtualizationWarning({ virtualized: true, height: '400px' })).toBeNull();
  });

  it('warns when virtualized without a height', () => {
    expect(virtualizationWarning({ virtualized: true, height: '' })).toContain('height');
  });
});
