import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { html } from 'lit';
import type { Table } from '../table';
import type { TableColumn, SortChangeDetail, RowClickDetail, SelectionChangeDetail } from '../table.types';
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
      { key: 'age', label: 'Age', sortable: true, align: 'end' }
    ];

    data = [
      { id: 1, name: 'Alice', age: 30 },
      { id: 2, name: 'Bob', age: 25 },
      { id: 3, name: 'Charlie', age: 35 }
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
    expect(lastHeader.getAttribute('data-align')).toBe('end');
  });

  it('sorts data when header is clicked', async () => {
    const nameHeader = el.shadowRoot!.querySelectorAll('th')[1].querySelector('button') as HTMLElement;
    nameHeader.click();
    await el.updateComplete;

    const firstRowName = el.shadowRoot!.querySelectorAll('tbody tr')[0].querySelectorAll('td')[1];
    expect(firstRowName.textContent?.trim()).toBe('Alice');
  });

  it('renders a button inside a sortable th, per the APG pattern', () => {
    const th = el.shadowRoot!.querySelectorAll('th')[1];
    expect(th.querySelector('button')?.getAttribute('type')).toBe('button');
  });

  it('gives the table an accessible name from the label property', async () => {
    el.label = 'Team roster';
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('table')!.getAttribute('aria-label')).toBe('Team roster');
  });

  it('omits aria-label when no label is set', () => {
    expect(el.shadowRoot!.querySelector('table')!.hasAttribute('aria-label')).toBe(false);
  });

  describe('caption', () => {
    it('omits the caption element when none is set', () => {
      expect(el.shadowRoot!.querySelector('caption')).toBeNull();
    });

    it('renders a caption element with the given text', async () => {
      el.caption = 'Team roster';
      await el.updateComplete;

      const caption = el.shadowRoot!.querySelector('caption');
      expect(caption).toBeTruthy();
      expect(caption!.textContent?.trim()).toBe('Team roster');
    });

    it('renders the caption as the first child of the table', async () => {
      el.caption = 'Team roster';
      await el.updateComplete;

      const table = el.shadowRoot!.querySelector('table')!;
      expect(table.firstElementChild?.tagName).toBe('CAPTION');
    });

    it('defaults caption-side to top', () => {
      expect(el.captionSide).toBe('top');
      expect(el.getAttribute('caption-side')).toBe('top');
    });

    it('reflects caption-side changes', async () => {
      el.captionSide = 'bottom';
      await el.updateComplete;
      expect(el.getAttribute('caption-side')).toBe('bottom');
    });
  });

  describe('rowclick', () => {
    it('dispatches rowclick with the row and index when a body row is clicked', () => {
      const handler = vi.fn();
      el.addEventListener('rowclick', handler);

      const secondRow = el.shadowRoot!.querySelectorAll('tbody tr')[1] as HTMLElement;
      secondRow.click();

      expect(handler).toHaveBeenCalledOnce();
      const event = handler.mock.calls[0][0] as CustomEvent<RowClickDetail<TestData>>;
      expect(event.detail.row).toEqual(data[1]);
      expect(event.detail.index).toBe(1);
    });

    it('fires rowclick when a click originates on a cell inside the row', () => {
      const handler = vi.fn();
      el.addEventListener('rowclick', handler);

      const cell = el.shadowRoot!.querySelectorAll('tbody tr')[0].querySelector('td') as HTMLElement;
      cell.click();

      expect(handler).toHaveBeenCalledOnce();
      expect((handler.mock.calls[0][0] as CustomEvent<RowClickDetail<TestData>>).detail.index).toBe(0);
    });

    it('does not fire rowclick for the empty-state row', async () => {
      el.data = [];
      await el.updateComplete;
      await el.updateComplete;

      const handler = vi.fn();
      el.addEventListener('rowclick', handler);

      const emptyRow = el.shadowRoot!.querySelector('tbody tr') as HTMLElement;
      emptyRow.click();

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('sticky-header', () => {
    it('is not sticky by default', () => {
      expect(el.stickyHeader).toBe(false);
      expect(el.hasAttribute('sticky-header')).toBe(false);
    });

    it('reflects sticky-header when enabled', async () => {
      el.stickyHeader = true;
      await el.updateComplete;
      expect(el.hasAttribute('sticky-header')).toBe(true);
    });
  });

  describe('selection', () => {
    it('renders no selection column by default', () => {
      expect(el.shadowRoot!.querySelector('.selection-cell')).toBeNull();
    });

    it('renders a checkbox per row and a select-all checkbox in multiple mode', async () => {
      el.selectionMode = 'multiple';
      await el.updateComplete;

      const headerCheckbox = el.shadowRoot!.querySelector('thead .selection-cell input') as HTMLInputElement;
      expect(headerCheckbox.type).toBe('checkbox');
      const rowCheckboxes = el.shadowRoot!.querySelectorAll('tbody .selection-cell input');
      expect(rowCheckboxes).toHaveLength(3);
      expect((rowCheckboxes[0] as HTMLInputElement).type).toBe('checkbox');
    });

    it('renders a radio per row and no select-all control in single mode', async () => {
      el.selectionMode = 'single';
      await el.updateComplete;

      expect(el.shadowRoot!.querySelector('thead .selection-cell input')).toBeNull();
      const rowRadios = el.shadowRoot!.querySelectorAll('tbody .selection-cell input');
      expect(rowRadios).toHaveLength(3);
      expect((rowRadios[0] as HTMLInputElement).type).toBe('radio');
    });

    it('checking a row checkbox selects it and dispatches selectionchange', async () => {
      el.selectionMode = 'multiple';
      await el.updateComplete;

      const handler = vi.fn();
      el.addEventListener('selectionchange', handler);

      const firstCheckbox = el.shadowRoot!.querySelector('tbody .selection-cell input') as HTMLInputElement;
      firstCheckbox.click();
      await el.updateComplete;

      expect(handler).toHaveBeenCalledOnce();
      const event = handler.mock.calls[0][0] as CustomEvent<SelectionChangeDetail>;
      expect(event.detail.selected).toEqual([0]);
      expect(event.detail.previousSelected).toEqual([]);
      expect(firstCheckbox.checked).toBe(true);
    });

    it('unchecking a selected row checkbox deselects it', async () => {
      el.selectionMode = 'multiple';
      el.selected = [0];
      await el.updateComplete;

      const firstCheckbox = el.shadowRoot!.querySelector('tbody .selection-cell input') as HTMLInputElement;
      expect(firstCheckbox.checked).toBe(true);
      firstCheckbox.click();
      await el.updateComplete;

      expect(firstCheckbox.checked).toBe(false);
    });

    it('selecting a radio replaces the previous selection, never adds to it', async () => {
      el.selectionMode = 'single';
      await el.updateComplete;

      const radios = el.shadowRoot!.querySelectorAll('tbody .selection-cell input') as NodeListOf<HTMLInputElement>;
      radios[0].click();
      await el.updateComplete;
      expect(el.selected).toBeUndefined(); // uncontrolled — internal state only, selected stays undefined

      radios[1].click();
      await el.updateComplete;

      const radiosAfter = el.shadowRoot!.querySelectorAll(
        'tbody .selection-cell input'
      ) as NodeListOf<HTMLInputElement>;
      expect(radiosAfter[0].checked).toBe(false);
      expect(radiosAfter[1].checked).toBe(true);
    });

    it('clicking a row checkbox does not also fire rowclick', async () => {
      el.selectionMode = 'multiple';
      await el.updateComplete;

      const rowClickHandler = vi.fn();
      el.addEventListener('rowclick', rowClickHandler);

      const firstCheckbox = el.shadowRoot!.querySelector('tbody .selection-cell input') as HTMLInputElement;
      firstCheckbox.click();
      await el.updateComplete;

      expect(rowClickHandler).not.toHaveBeenCalled();
    });

    it('a row click does not also toggle selection (only the control does)', async () => {
      el.selectionMode = 'multiple';
      await el.updateComplete;

      const selectionHandler = vi.fn();
      el.addEventListener('selectionchange', selectionHandler);

      const nameCell = el.shadowRoot!.querySelectorAll('tbody tr')[0].querySelectorAll('td')[2] as HTMLElement;
      nameCell.click();
      await el.updateComplete;

      expect(selectionHandler).not.toHaveBeenCalled();
    });

    it('select-all checks every visible row, re-clicking clears the selection', async () => {
      el.selectionMode = 'multiple';
      await el.updateComplete;

      const headerCheckbox = el.shadowRoot!.querySelector('thead .selection-cell input') as HTMLInputElement;
      headerCheckbox.click();
      await el.updateComplete;

      const rowCheckboxes = el.shadowRoot!.querySelectorAll(
        'tbody .selection-cell input'
      ) as NodeListOf<HTMLInputElement>;
      expect([...rowCheckboxes].every((cb) => cb.checked)).toBe(true);

      headerCheckbox.click();
      await el.updateComplete;
      expect([...rowCheckboxes].every((cb) => !cb.checked)).toBe(true);
    });

    it('select-all checkbox is indeterminate when only some rows are selected', async () => {
      el.selectionMode = 'multiple';
      el.selected = [0];
      await el.updateComplete;

      const headerCheckbox = el.shadowRoot!.querySelector('thead .selection-cell input') as HTMLInputElement;
      expect(headerCheckbox.indeterminate).toBe(true);
      expect(headerCheckbox.checked).toBe(false);
    });

    it('uses row-key for selection identity when row-key is set', async () => {
      el.selectionMode = 'multiple';
      el.rowKey = 'id';
      await el.updateComplete;

      const handler = vi.fn();
      el.addEventListener('selectionchange', handler);

      const firstCheckbox = el.shadowRoot!.querySelector('tbody .selection-cell input') as HTMLInputElement;
      firstCheckbox.click();
      await el.updateComplete;

      const event = handler.mock.calls[0][0] as CustomEvent<SelectionChangeDetail>;
      expect(event.detail.selected).toEqual([1]); // data[0].id === 1, not the row index
    });

    it('respects a controlled selected array — the event fires but `selected` itself is untouched', async () => {
      el.selectionMode = 'multiple';
      el.selected = [1];
      await el.updateComplete;

      const rowCheckboxes = el.shadowRoot!.querySelectorAll(
        'tbody .selection-cell input'
      ) as NodeListOf<HTMLInputElement>;
      expect(rowCheckboxes[0].checked).toBe(false);
      expect(rowCheckboxes[1].checked).toBe(true);

      const handler = vi.fn();
      el.addEventListener('selectionchange', handler);
      rowCheckboxes[0].click();
      await el.updateComplete;

      expect(handler).toHaveBeenCalledOnce();
      // A controlled component doesn't write back on its own — `selected` only changes when the consumer updates
      // it in response to the event, same as a controlled checkbox in any other framework.
      expect(el.selected).toEqual([1]);
    });

    it('adjusts the empty-state colspan to include the selection column', async () => {
      el.selectionMode = 'multiple';
      el.data = [];
      await el.updateComplete;
      await el.updateComplete;

      expect(el.shadowRoot!.querySelector('td.empty-state')!.getAttribute('colspan')).toBe('4');
    });

    it('uses a default accessible label naming the row position', async () => {
      el.selectionMode = 'multiple';
      await el.updateComplete;

      const firstCheckbox = el.shadowRoot!.querySelector('tbody .selection-cell input') as HTMLInputElement;
      expect(firstCheckbox.getAttribute('aria-label')).toBe('Select row 1');
    });

    it('supports overriding selection labels via the labels property', async () => {
      el.selectionMode = 'multiple';
      el.labels = { selectAll: 'Pick everyone', selectRow: (row) => `Pick ${(row as TestData).name}` };
      await el.updateComplete;

      const headerCheckbox = el.shadowRoot!.querySelector('thead .selection-cell input') as HTMLInputElement;
      expect(headerCheckbox.getAttribute('aria-label')).toBe('Pick everyone');
      const firstCheckbox = el.shadowRoot!.querySelector('tbody .selection-cell input') as HTMLInputElement;
      expect(firstCheckbox.getAttribute('aria-label')).toBe('Pick Alice');
    });

    it("select-all with pagination active only selects the current page's rows", async () => {
      el.selectionMode = 'multiple';
      el.pageSize = 2;
      await el.updateComplete;

      const headerCheckbox = el.shadowRoot!.querySelector('thead .selection-cell input') as HTMLInputElement;
      headerCheckbox.click();
      await el.updateComplete;

      expect(el.shadowRoot!.querySelectorAll('tbody tr')).toHaveLength(2); // page 1 of 2 rows
      const rowCheckboxes = el.shadowRoot!.querySelectorAll(
        'tbody .selection-cell input'
      ) as NodeListOf<HTMLInputElement>;
      expect([...rowCheckboxes].every((cb) => cb.checked)).toBe(true);

      el.page = 2;
      await el.updateComplete;
      const page2Checkboxes = el.shadowRoot!.querySelectorAll(
        'tbody .selection-cell input'
      ) as NodeListOf<HTMLInputElement>;
      expect([...page2Checkboxes].every((cb) => !cb.checked)).toBe(true); // page 2 wasn't touched
    });

    it('gives a two-table page independent single-select radio groups', async () => {
      const second = document.createElement('lt-table') as Table<TestData>;
      second.columns = columns;
      second.data = data;
      second.selectionMode = 'single';
      document.body.appendChild(second);
      await second.updateComplete;

      el.selectionMode = 'single';
      await el.updateComplete;

      const firstTableName = (el.shadowRoot!.querySelector('tbody .selection-cell input') as HTMLInputElement).name;
      const secondTableName = (second.shadowRoot!.querySelector('tbody .selection-cell input') as HTMLInputElement)
        .name;
      expect(firstTableName).not.toBe(secondTableName);
      second.remove();
    });
  });

  it('toggles sort direction on subsequent clicks', async () => {
    const nameHeader = el.shadowRoot!.querySelectorAll('th')[1].querySelector('button') as HTMLElement;

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

  it('dispatches sortchange event when sorting', async () => {
    const handler = vi.fn();
    el.addEventListener('sortchange', handler);

    const nameHeader = el.shadowRoot!.querySelectorAll('th')[1].querySelector('button') as HTMLElement;
    nameHeader.click();
    await el.updateComplete;

    expect(handler).toHaveBeenCalledTimes(1);
    const event = handler.mock.calls[0][0] as CustomEvent<SortChangeDetail>;
    expect(event.detail.key).toBe('name');
    expect(event.detail.direction).toBe('asc');
  });

  it('sorts numeric values correctly', async () => {
    const ageHeader = el.shadowRoot!.querySelectorAll('th')[2].querySelector('button') as HTMLElement;
    ageHeader.click();
    await el.updateComplete;
    await el.updateComplete; // Need second update for sorted data

    const ages = Array.from(el.shadowRoot!.querySelectorAll('tbody tr')).map((row) =>
      row.querySelectorAll('td')[2].textContent?.trim()
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
    el.addEventListener('sortchange', handler);

    const nameHeader = el.shadowRoot!.querySelectorAll('th')[1].querySelector('button') as HTMLElement;
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    nameHeader.dispatchEvent(enterEvent);
    await el.updateComplete;

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('supports space key for sorting', async () => {
    const handler = vi.fn();
    el.addEventListener('sortchange', handler);

    const nameHeader = el.shadowRoot!.querySelectorAll('th')[1].querySelector('button') as HTMLElement;
    const spaceEvent = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
    nameHeader.dispatchEvent(spaceEvent);
    await el.updateComplete;

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('applies sticky class to sticky columns', async () => {
    el.columns = [
      { key: 'id', label: 'ID', sticky: true },
      { key: 'name', label: 'Name' }
    ];
    await el.updateComplete;

    const firstHeader = el.shadowRoot!.querySelector('th');
    expect(firstHeader?.classList.contains('sticky')).toBe(true);
  });

  it('applies hide-on-mobile class to mobile-hidden columns', async () => {
    el.columns = [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name', hideOnMobile: true }
    ];
    await el.updateComplete;

    const secondHeader = el.shadowRoot!.querySelectorAll('th')[1];
    expect(secondHeader?.classList.contains('hide-on-mobile')).toBe(true);
  });

  it('applies column width styles', async () => {
    el.columns = [
      { key: 'id', label: 'ID', width: '100px' },
      { key: 'name', label: 'Name' }
    ];
    await el.updateComplete;

    const firstHeader = el.shadowRoot!.querySelector('th') as HTMLElement;
    expect(firstHeader.style.width).toBe('100px');
  });

  it('applies column minWidth styles', async () => {
    el.columns = [
      { key: 'id', label: 'ID', minWidth: '150px' },
      { key: 'name', label: 'Name' }
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
        render: (value) => html`<strong>${value}</strong>`
      }
    ];
    await el.updateComplete;

    const nameCell = el.shadowRoot!.querySelectorAll('tbody tr')[0].querySelectorAll('td')[1];
    expect(nameCell.querySelector('strong')?.textContent).toBe('Alice');
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
        }
      }
    ];
    await el.updateComplete;
    await el.updateComplete; // Need second update for columns change

    const nameHeader = el.shadowRoot!.querySelector('th button') as HTMLElement;
    nameHeader.click();
    await el.updateComplete;
    await el.updateComplete; // Need second update for sorted data

    const firstRowName = el.shadowRoot!.querySelectorAll('tbody tr')[0].querySelectorAll('td')[0];
    expect(firstRowName.textContent?.trim()).toBe('Charlie');
  });

  it('handles null/undefined values in sorting', async () => {
    el.data = [
      { id: 1, name: 'Alice', age: 30 },
      { id: 2, name: null as unknown as string, age: 25 },
      { id: 3, name: 'Charlie', age: 35 }
    ];
    await el.updateComplete;

    const nameHeader = el.shadowRoot!.querySelectorAll('th')[1].querySelector('button') as HTMLElement;
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

  describe('JSON string attribute initialization (SSR use case)', () => {
    it('renders columns from a JSON attribute string', async () => {
      const ssrEl = document.createElement('lt-table') as Table<TestData>;
      ssrEl.setAttribute('columns', JSON.stringify(columns));
      ssrEl.setAttribute('data', JSON.stringify(data));
      document.body.appendChild(ssrEl);
      await ssrEl.updateComplete;

      const headers = ssrEl.shadowRoot!.querySelectorAll('th');
      expect(headers.length).toBe(3);
      expect(headers[0].textContent).toContain('ID');
      expect(headers[1].textContent).toContain('Name');
      expect(headers[2].textContent).toContain('Age');

      const rows = ssrEl.shadowRoot!.querySelectorAll('tbody tr');
      expect(rows.length).toBe(3);
      ssrEl.remove();
    });

    it('renders cell data correctly when set via JSON attributes', async () => {
      const ssrEl = document.createElement('lt-table') as Table<TestData>;
      ssrEl.setAttribute('columns', JSON.stringify(columns));
      ssrEl.setAttribute('data', JSON.stringify(data));
      document.body.appendChild(ssrEl);
      await ssrEl.updateComplete;

      const firstRow = ssrEl.shadowRoot!.querySelectorAll('tbody tr')[0];
      const cells = firstRow.querySelectorAll('td');
      expect(cells[0].textContent?.trim()).toBe('1');
      expect(cells[1].textContent?.trim()).toBe('Alice');
      expect(cells[2].textContent?.trim()).toBe('30');
      ssrEl.remove();
    });

    it('falls back to empty array on malformed columns JSON', async () => {
      const ssrEl = document.createElement('lt-table') as Table<TestData>;
      ssrEl.setAttribute('columns', 'not valid json');
      ssrEl.setAttribute('data', JSON.stringify(data));
      document.body.appendChild(ssrEl);
      await ssrEl.updateComplete;

      const headers = ssrEl.shadowRoot!.querySelectorAll('th');
      expect(headers.length).toBe(0);
      ssrEl.remove();
    });

    it('falls back to empty array on malformed data JSON', async () => {
      const ssrEl = document.createElement('lt-table') as Table<TestData>;
      ssrEl.setAttribute('columns', JSON.stringify(columns));
      ssrEl.setAttribute('data', '{bad json}');
      document.body.appendChild(ssrEl);
      await ssrEl.updateComplete;

      const emptyState = ssrEl.shadowRoot!.querySelector('.empty-state');
      expect(emptyState).toBeTruthy();
      ssrEl.remove();
    });

    it('supports sorting when initialized via JSON attributes', async () => {
      const ssrEl = document.createElement('lt-table') as Table<TestData>;
      ssrEl.setAttribute('columns', JSON.stringify(columns));
      ssrEl.setAttribute('data', JSON.stringify(data));
      document.body.appendChild(ssrEl);
      await ssrEl.updateComplete;

      const nameHeader = ssrEl.shadowRoot!.querySelectorAll('th')[1].querySelector('button') as HTMLElement;
      nameHeader.click();
      await ssrEl.updateComplete;
      await ssrEl.updateComplete;

      const firstRowName = ssrEl.shadowRoot!.querySelectorAll('tbody tr')[0].querySelectorAll('td')[1];
      expect(firstRowName.textContent?.trim()).toBe('Alice');
      ssrEl.remove();
    });
  });

  describe('default sorting', () => {
    const cells = (col: number) =>
      [...el.shadowRoot!.querySelectorAll(`tbody tr td:nth-child(${col})`)].map((td) => td.textContent!.trim());

    const sortBy = async (rows: Record<string, unknown>[], key: string, direction: 'asc' | 'desc' = 'asc') => {
      const t = el as unknown as Table<Record<string, unknown>>;
      t.columns = [{ key, label: key, sortable: true }];
      t.data = rows;
      t.sort = { key, direction };
      await t.updateComplete;
    };

    it('sorts Date values by time, not by their string form', async () => {
      await sortBy([{ d: new Date(2026, 0, 30) }, { d: new Date(2026, 0, 2) }, { d: new Date(2026, 0, 5) }], 'd');
      expect(cells(1).map((text) => text.slice(4, 10))).toEqual(['Jan 02', 'Jan 05', 'Jan 30']);
    });

    it('sorts numeric strings naturally, so "2" comes before "10"', async () => {
      await sortBy([{ n: '10' }, { n: '2' }, { n: '1' }, { n: '20' }], 'n');
      expect(cells(1)).toEqual(['1', '2', '10', '20']);
    });

    it('sorts text with embedded numbers naturally', async () => {
      await sortBy([{ f: 'file10' }, { f: 'file2' }, { f: 'file1' }], 'f');
      expect(cells(1)).toEqual(['file1', 'file2', 'file10']);
    });

    it('reverses for descending', async () => {
      await sortBy([{ n: 2 }, { n: 10 }, { n: 1 }], 'n', 'desc');
      expect(cells(1)).toEqual(['10', '2', '1']);
    });
  });

  describe('rows without a row-key', () => {
    it('renders circular row data without throwing', async () => {
      const circular: Record<string, unknown> = { name: 'loop' };
      circular.self = circular;
      const t = el as unknown as Table<Record<string, unknown>>;
      t.columns = [{ key: 'name', label: 'Name' }];
      t.data = [circular];
      await t.updateComplete;
      expect(el.shadowRoot!.querySelectorAll('tbody tr')).toHaveLength(1);
    });

    it('renders identical rows as separate rows', async () => {
      const t = el as unknown as Table<Record<string, unknown>>;
      t.columns = [{ key: 'a', label: 'A' }];
      t.data = [{ a: 'x' }, { a: 'x' }, { a: 'x' }];
      await t.updateComplete;
      expect(el.shadowRoot!.querySelectorAll('tbody tr')).toHaveLength(3);
    });

    it('still keys rows by row-key when one is given', async () => {
      const t = el as unknown as Table<Record<string, unknown>>;
      t.rowKey = 'id';
      t.columns = [{ key: 'id', label: 'ID' }];
      t.data = [{ id: 1 }, { id: 2 }];
      await t.updateComplete;
      expect(el.shadowRoot!.querySelectorAll('tbody tr')).toHaveLength(2);
    });

    it('gives the empty-state cell a valid colspan even with no columns', async () => {
      const t = el as unknown as Table<Record<string, unknown>>;
      t.columns = [];
      t.data = [];
      await t.updateComplete;
      expect(el.shadowRoot!.querySelector('td.empty-state')!.getAttribute('colspan')).toBe('1');
    });
  });

  describe('pagination', () => {
    it('renders every row when page-size is unset (0), the default', () => {
      expect(el.pageSize).toBe(0);
      expect(el.shadowRoot!.querySelectorAll('tbody tr')).toHaveLength(3);
    });

    it('renders only pageSize rows for the current page', async () => {
      el.pageSize = 2;
      await el.updateComplete;
      expect(el.shadowRoot!.querySelectorAll('tbody tr')).toHaveLength(2);

      const names = [...el.shadowRoot!.querySelectorAll('tbody tr')].map((row) =>
        row.querySelectorAll('td')[1].textContent?.trim()
      );
      expect(names).toEqual(['Alice', 'Bob']);
    });

    it('renders the remainder on the last page', async () => {
      el.pageSize = 2;
      el.page = 2;
      await el.updateComplete;

      const names = [...el.shadowRoot!.querySelectorAll('tbody tr')].map((row) =>
        row.querySelectorAll('td')[1].textContent?.trim()
      );
      expect(names).toEqual(['Charlie']);
    });

    it('computes totalPages from the data length and pageSize', async () => {
      expect(el.totalPages).toBe(1); // pagination disabled
      el.pageSize = 2;
      await el.updateComplete;
      expect(el.totalPages).toBe(2); // 3 rows / 2 per page, rounded up
    });

    it('clamps an out-of-range page into 1..totalPages, like lt-pagination does', async () => {
      el.pageSize = 2;
      el.page = 99;
      await el.updateComplete;

      // Page 99 clamps to the real last page (2), not an empty result.
      const names = [...el.shadowRoot!.querySelectorAll('tbody tr')].map((row) =>
        row.querySelectorAll('td')[1].textContent?.trim()
      );
      expect(names).toEqual(['Charlie']);
    });

    it("preserves each row's global sortedData index across pages, not a page-relative one", async () => {
      const handler = vi.fn();
      el.addEventListener('rowclick', handler);
      el.pageSize = 2;
      el.page = 2;
      await el.updateComplete;

      const onlyRow = el.shadowRoot!.querySelectorAll('tbody tr')[0] as HTMLElement;
      onlyRow.click();

      const event = handler.mock.calls[0][0] as CustomEvent<RowClickDetail<TestData>>;
      expect(event.detail.index).toBe(2); // Charlie is sortedData[2], not page-relative index 0
    });

    it('still shows the real empty state when there is no data at all, not an empty page', async () => {
      el.pageSize = 2;
      el.data = [];
      await el.updateComplete;
      await el.updateComplete;

      expect(el.shadowRoot!.querySelector('.empty-state')).toBeTruthy();
    });
  });
});
