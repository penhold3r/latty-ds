import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { Table } from '../table';
import type { TableColumn, SortChangeDetail } from '../table.types';
import '../table';

interface TestData {
  id: number;
  name: string;
  age: number;
}

describe('<lt-table>', () => {
  let el: Table<TestData>;
  let columns: TableColumn<TestData>[];
  let data: TestData[];

  beforeEach(async () => {
    columns = [
      { key: 'id', label: 'ID', sortable: true },
      { key: 'name', label: 'Name', sortable: true },
      { key: 'age', label: 'Age', sortable: true, align: 'right' },
    ];

    data = [
      { id: 1, name: 'Alice', age: 30 },
      { id: 2, name: 'Bob', age: 25 },
      { id: 3, name: 'Charlie', age: 35 },
    ];

    el = document.createElement('lt-table') as Table<TestData>;
    el.columns = columns;
    el.data = data;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('renders a table', () => {
    const table = el.shadowRoot!.querySelector('table');
    expect(table).toBeTruthy();
  });

  it('renders header with correct columns', () => {
    const headers = el.shadowRoot!.querySelectorAll('th');
    expect(headers.length).toBe(3);
    expect(headers[0].textContent).toContain('ID');
    expect(headers[1].textContent).toContain('Name');
    expect(headers[2].textContent).toContain('Age');
  });

  it('renders all data rows', () => {
    const rows = el.shadowRoot!.querySelectorAll('tbody tr');
    expect(rows.length).toBe(3);
  });

  it('renders cell data correctly', () => {
    const firstRow = el.shadowRoot!.querySelectorAll('tbody tr')[0];
    const cells = firstRow.querySelectorAll('td');
    expect(cells[0].textContent?.trim()).toBe('1');
    expect(cells[1].textContent?.trim()).toBe('Alice');
    expect(cells[2].textContent?.trim()).toBe('30');
  });

  it('has default density of normal', () => {
    expect(el.density).toBe('normal');
    expect(el.getAttribute('density')).toBe('normal');
  });

  it('has default responsive mode of scroll', () => {
    expect(el.responsiveMode).toBe('scroll');
    expect(el.getAttribute('responsive-mode')).toBe('scroll');
  });

  it('is not hoverable by default', () => {
    expect(el.hoverable).toBe(false);
  });

  it('is not striped by default', () => {
    expect(el.striped).toBe(false);
  });

  it('is not bordered by default', () => {
    expect(el.bordered).toBe(false);
  });

  it('is not loading by default', () => {
    expect(el.loading).toBe(false);
  });

  it('can change density', async () => {
    el.density = 'compact';
    await el.updateComplete;
    expect(el.getAttribute('density')).toBe('compact');
  });

  it('can change responsive mode', async () => {
    el.responsiveMode = 'stack';
    await el.updateComplete;
    expect(el.getAttribute('responsive-mode')).toBe('stack');
  });

  it('marks sortable columns', () => {
    const headers = el.shadowRoot!.querySelectorAll('th.sortable');
    expect(headers.length).toBe(3);
  });

  it('applies column alignment', () => {
    const lastHeader = el.shadowRoot!.querySelectorAll('th')[2];
    expect(lastHeader.getAttribute('data-align')).toBe('right');
  });

  it('sorts data when header is clicked', async () => {
    const nameHeader = el.shadowRoot!.querySelectorAll('th')[1] as HTMLElement;
    nameHeader.click();
    await el.updateComplete;

    const firstRowName = el.shadowRoot!.querySelectorAll('tbody tr')[0].querySelectorAll('td')[1];
    expect(firstRowName.textContent?.trim()).toBe('Alice');
  });

  it('toggles sort direction on subsequent clicks', async () => {
    const nameHeader = el.shadowRoot!.querySelectorAll('th')[1] as HTMLElement;

    // First click: asc
    nameHeader.click();
    await el.updateComplete;
    await el.updateComplete; // Need second update for sorted data
    let firstRowName = el.shadowRoot!.querySelectorAll('tbody tr')[0].querySelectorAll('td')[1];
    expect(firstRowName.textContent?.trim()).toBe('Alice');

    // Second click: desc
    nameHeader.click();
    await el.updateComplete;
    await el.updateComplete; // Need second update for sorted data
    firstRowName = el.shadowRoot!.querySelectorAll('tbody tr')[0].querySelectorAll('td')[1];
    expect(firstRowName.textContent?.trim()).toBe('Charlie');
  });

  it('dispatches lt-sort-change event when sorting', async () => {
    const handler = vi.fn();
    el.addEventListener('lt-sort-change', handler);

    const nameHeader = el.shadowRoot!.querySelectorAll('th')[1] as HTMLElement;
    nameHeader.click();
    await el.updateComplete;

    expect(handler).toHaveBeenCalledTimes(1);
    const event = handler.mock.calls[0][0] as CustomEvent<SortChangeDetail>;
    expect(event.detail.key).toBe('name');
    expect(event.detail.direction).toBe('asc');
  });

  it('sorts numeric values correctly', async () => {
    const ageHeader = el.shadowRoot!.querySelectorAll('th')[2] as HTMLElement;
    ageHeader.click();
    await el.updateComplete;
    await el.updateComplete; // Need second update for sorted data

    const ages = Array.from(el.shadowRoot!.querySelectorAll('tbody tr')).map(
      (row) => row.querySelectorAll('td')[2].textContent?.trim()
    );
    expect(ages).toEqual(['25', '30', '35']);
  });

  it('shows empty state when no data', async () => {
    el.data = [];
    await el.updateComplete;
    await el.updateComplete; // Need second update for sorted data to update

    const emptyState = el.shadowRoot!.querySelector('.empty-state');
    expect(emptyState).toBeTruthy();
    expect(emptyState!.textContent).toContain('No data available');
  });

  it('uses custom empty message', async () => {
    el.data = [];
    el.emptyMessage = 'Custom empty message';
    await el.updateComplete;
    await el.updateComplete; // Need second update for sorted data to update

    const emptyState = el.shadowRoot!.querySelector('.empty-state');
    expect(emptyState!.textContent).toContain('Custom empty message');
  });

  it('shows loading overlay when loading', async () => {
    el.loading = true;
    await el.updateComplete;

    const loadingOverlay = el.shadowRoot!.querySelector('.loading-overlay');
    expect(loadingOverlay).toBeTruthy();
  });

  it('applies hoverable attribute', async () => {
    el.hoverable = true;
    await el.updateComplete;
    expect(el.hasAttribute('hoverable')).toBe(true);
  });

  it('applies striped attribute', async () => {
    el.striped = true;
    await el.updateComplete;
    expect(el.hasAttribute('striped')).toBe(true);
  });

  it('applies bordered attribute', async () => {
    el.bordered = true;
    await el.updateComplete;
    expect(el.hasAttribute('bordered')).toBe(true);
  });

  it('supports keyboard navigation on sortable headers', async () => {
    const handler = vi.fn();
    el.addEventListener('lt-sort-change', handler);

    const nameHeader = el.shadowRoot!.querySelectorAll('th')[1] as HTMLElement;
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    nameHeader.dispatchEvent(enterEvent);
    await el.updateComplete;

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('supports space key for sorting', async () => {
    const handler = vi.fn();
    el.addEventListener('lt-sort-change', handler);

    const nameHeader = el.shadowRoot!.querySelectorAll('th')[1] as HTMLElement;
    const spaceEvent = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
    nameHeader.dispatchEvent(spaceEvent);
    await el.updateComplete;

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('applies sticky class to sticky columns', async () => {
    el.columns = [
      { key: 'id', label: 'ID', sticky: true },
      { key: 'name', label: 'Name' },
    ];
    await el.updateComplete;

    const firstHeader = el.shadowRoot!.querySelector('th');
    expect(firstHeader?.classList.contains('sticky')).toBe(true);
  });

  it('applies hide-on-mobile class to mobile-hidden columns', async () => {
    el.columns = [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name', hideOnMobile: true },
    ];
    await el.updateComplete;

    const secondHeader = el.shadowRoot!.querySelectorAll('th')[1];
    expect(secondHeader?.classList.contains('hide-on-mobile')).toBe(true);
  });

  it('applies column width styles', async () => {
    el.columns = [
      { key: 'id', label: 'ID', width: '100px' },
      { key: 'name', label: 'Name' },
    ];
    await el.updateComplete;

    const firstHeader = el.shadowRoot!.querySelector('th') as HTMLElement;
    expect(firstHeader.style.width).toBe('100px');
  });

  it('applies column minWidth styles', async () => {
    el.columns = [
      { key: 'id', label: 'ID', minWidth: '150px' },
      { key: 'name', label: 'Name' },
    ];
    await el.updateComplete;

    const firstHeader = el.shadowRoot!.querySelector('th') as HTMLElement;
    expect(firstHeader.style.minWidth).toBe('150px');
  });

  it('uses custom render function', async () => {
    el.columns = [
      { key: 'id', label: 'ID' },
      {
        key: 'name',
        label: 'Name',
        render: (value: string) => `<strong>${value}</strong>`,
      },
    ];
    await el.updateComplete;

    const nameCell = el.shadowRoot!.querySelectorAll('tbody tr')[0].querySelectorAll('td')[1];
    expect(nameCell.innerHTML).toContain('<strong>Alice</strong>');
  });

  it('supports custom sort function', async () => {
    el.columns = [
      {
        key: 'name',
        label: 'Name',
        sortable: true,
        sortFn: (a: TestData, b: TestData, direction: 'asc' | 'desc') => {
          // Custom sort: reverse alphabetical
          const comparison = b.name.localeCompare(a.name);
          return direction === 'asc' ? comparison : -comparison;
        },
      },
    ];
    await el.updateComplete;
    await el.updateComplete; // Need second update for columns change

    const nameHeader = el.shadowRoot!.querySelector('th') as HTMLElement;
    nameHeader.click();
    await el.updateComplete;
    await el.updateComplete; // Need second update for sorted data

    const firstRowName = el.shadowRoot!.querySelectorAll('tbody tr')[0].querySelectorAll('td')[0];
    expect(firstRowName.textContent?.trim()).toBe('Charlie');
  });

  it('handles null/undefined values in sorting', async () => {
    el.data = [
      { id: 1, name: 'Alice', age: 30 },
      { id: 2, name: null as any, age: 25 },
      { id: 3, name: 'Charlie', age: 35 },
    ];
    await el.updateComplete;

    const nameHeader = el.shadowRoot!.querySelectorAll('th')[1] as HTMLElement;
    nameHeader.click();
    await el.updateComplete;

    // Should not throw and should place null values at the end
    const rows = el.shadowRoot!.querySelectorAll('tbody tr');
    expect(rows.length).toBe(3);
  });

  it('supports all density variants', async () => {
    const densities: Array<'compact' | 'normal' | 'comfortable'> = ['compact', 'normal', 'comfortable'];

    for (const density of densities) {
      el.density = density;
      await el.updateComplete;
      expect(el.getAttribute('density')).toBe(density);
    }
  });

  it('supports all responsive modes', async () => {
    const modes: Array<'scroll' | 'stack'> = ['scroll', 'stack'];

    for (const mode of modes) {
      el.responsiveMode = mode;
      await el.updateComplete;
      expect(el.getAttribute('responsive-mode')).toBe(mode);
    }
  });

  it('adds data-label attribute in stack mode for mobile', async () => {
    el.responsiveMode = 'stack';
    await el.updateComplete;

    const firstCell = el.shadowRoot!.querySelectorAll('tbody tr')[0].querySelectorAll('td')[0];
    expect(firstCell.getAttribute('data-label')).toBe('ID');
  });
});
