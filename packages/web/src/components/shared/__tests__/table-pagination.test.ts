import { describe, it, expect } from 'vitest';
import { getTotalPages, getCurrentPage } from '../table-pagination';

describe('getTotalPages', () => {
  it('is 1 when pagination is disabled', () => {
    expect(getTotalPages({ pageSize: 0, page: 1, sortedDataLength: 100 })).toBe(1);
  });

  it('rounds a partial last page up', () => {
    expect(getTotalPages({ pageSize: 10, page: 1, sortedDataLength: 25 })).toBe(3);
  });

  it('is exactly the quotient when the data divides evenly', () => {
    expect(getTotalPages({ pageSize: 10, page: 1, sortedDataLength: 30 })).toBe(3);
  });

  it('is 1 for empty data rather than 0', () => {
    expect(getTotalPages({ pageSize: 10, page: 1, sortedDataLength: 0 })).toBe(1);
  });
});

describe('getCurrentPage', () => {
  it('returns the page when it is in range', () => {
    expect(getCurrentPage({ pageSize: 10, page: 2, sortedDataLength: 25 })).toBe(2);
  });

  it('clamps a too-large page down to the last page', () => {
    expect(getCurrentPage({ pageSize: 10, page: 99, sortedDataLength: 25 })).toBe(3);
  });

  it('clamps a zero or negative page up to 1', () => {
    expect(getCurrentPage({ pageSize: 10, page: 0, sortedDataLength: 25 })).toBe(1);
    expect(getCurrentPage({ pageSize: 10, page: -4, sortedDataLength: 25 })).toBe(1);
  });

  it('falls back to 1 for a non-numeric page', () => {
    expect(getCurrentPage({ pageSize: 10, page: Number.NaN, sortedDataLength: 25 })).toBe(1);
  });

  it('floors a fractional page', () => {
    expect(getCurrentPage({ pageSize: 10, page: 2.8, sortedDataLength: 25 })).toBe(2);
  });
});
