import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { html } from 'lit';
import type { Table } from '../table';
import type {
  TableColumn,
  SortChangeDetail,
  RowClickDetail,
  SelectionChangeDetail,
  ColumnResizeDetail
} from '../table.types';
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

  /*
   * WCAG 2.1.1 — .table-container is horizontally scrollable (overflow-x: auto) whenever the table is wider
   * than its available space, which can happen even with no other focusable element inside the table at all
   * (e.g. no sortable columns, no row-selection controls) — without this, a keyboard user would have no way to
   * reach the overflowed content at all. Found live via axe's scrollable-region-focusable rule failing on a
   * docs page whose API table happened to be wide enough to overflow, not from reasoning about the component
   * in isolation.
   */
  it('makes .table-container keyboard-focusable, so a horizontally overflowing table stays reachable', () => {
    const container = el.shadowRoot!.querySelector('.table-container');
    expect(container?.getAttribute('tabindex')).toBe('0');
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
      /*
       * A controlled component doesn't write back on its own — `selected` only changes when the consumer updates
       * it in response to the event, same as a controlled checkbox in any other framework.
       */
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

  describe('explicit ARIA table roles (TBL-4)', () => {
    /*
     * Safari computes a cell's accessibility role from its rendered display value, not its tag name — stack
     * mode's display:block (table.styles.ts) silently drops the whole table's native semantics there, unlike
     * Chrome/Firefox. An explicit role isn't display-dependent, so this must hold in BOTH responsive modes.
     */
    it.each(['scroll', 'stack'] as const)(
      'carries explicit table/rowgroup/row/columnheader/cell roles in %s mode',
      async (mode) => {
        el.responsiveMode = mode;
        await el.updateComplete;

        expect(el.shadowRoot!.querySelector('table')?.getAttribute('role')).toBe('table');
        expect(el.shadowRoot!.querySelector('thead')?.getAttribute('role')).toBe('rowgroup');
        expect(el.shadowRoot!.querySelector('tbody')?.getAttribute('role')).toBe('rowgroup');
        el.shadowRoot!.querySelectorAll('tr').forEach((tr) => expect(tr.getAttribute('role')).toBe('row'));
        el.shadowRoot!.querySelectorAll('th').forEach((th) => expect(th.getAttribute('role')).toBe('columnheader'));
        el.shadowRoot!.querySelectorAll('tbody td').forEach((td) => expect(td.getAttribute('role')).toBe('cell'));
      }
    );

    it('does not set an aria-label on cells in scroll mode (the visible column header already provides it)', async () => {
      el.responsiveMode = 'scroll';
      await el.updateComplete;

      const firstCell = el.shadowRoot!.querySelectorAll('tbody tr')[0].querySelectorAll('td')[0];
      expect(firstCell.hasAttribute('aria-label')).toBe(false);
    });

    it("sets a cell's aria-label to its column's label in stack mode, since thead is display:none there and no longer exposed to assistive tech", async () => {
      el.responsiveMode = 'stack';
      await el.updateComplete;

      const firstCell = el.shadowRoot!.querySelectorAll('tbody tr')[0].querySelectorAll('td')[0];
      expect(firstCell.getAttribute('aria-label')).toBe('ID');
    });
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

    it('falls back to empty array on malformed columns JSON, warning rather than failing silently (TBL-4)', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const ssrEl = document.createElement('lt-table') as Table<TestData>;
      ssrEl.setAttribute('columns', 'not valid json');
      ssrEl.setAttribute('data', JSON.stringify(data));
      document.body.appendChild(ssrEl);
      await ssrEl.updateComplete;

      const headers = ssrEl.shadowRoot!.querySelectorAll('th');
      expect(headers.length).toBe(0);
      expect(warn).toHaveBeenCalledWith(expect.stringContaining("[lt-table] `columns` attribute isn't valid JSON"));
      ssrEl.remove();
      warn.mockRestore();
    });

    it('falls back to empty array on malformed data JSON, warning rather than failing silently (TBL-4)', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const ssrEl = document.createElement('lt-table') as Table<TestData>;
      ssrEl.setAttribute('columns', JSON.stringify(columns));
      ssrEl.setAttribute('data', '{bad json}');
      document.body.appendChild(ssrEl);
      await ssrEl.updateComplete;

      const emptyState = ssrEl.shadowRoot!.querySelector('.empty-state');
      expect(emptyState).toBeTruthy();
      expect(warn).toHaveBeenCalledWith(expect.stringContaining("[lt-table] `data` attribute isn't valid JSON"));
      ssrEl.remove();
      warn.mockRestore();
    });

    it('falls back to empty array and warns when the JSON is valid but not an array (TBL-4)', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const ssrEl = document.createElement('lt-table') as Table<TestData>;
      ssrEl.setAttribute('columns', JSON.stringify({ not: 'an array' }));
      ssrEl.setAttribute('data', JSON.stringify(data));
      document.body.appendChild(ssrEl);
      await ssrEl.updateComplete;

      const headers = ssrEl.shadowRoot!.querySelectorAll('th');
      expect(headers.length).toBe(0);
      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining('[lt-table] `columns` attribute is valid JSON but not an array')
      );
      ssrEl.remove();
      warn.mockRestore();
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

  describe('column resize', () => {
    /*
     * Reflects whatever width was last applied inline (matching a real browser's live geometry) so repeated
     * keyboard steps compound correctly, falling back to `initialWidth` before any resize has happened yet.
     */
    const mockThWidth = (initialWidth: number) => {
      vi.spyOn(HTMLTableCellElement.prototype, 'getBoundingClientRect').mockImplementation(function (
        this: HTMLElement
      ) {
        const styleWidth = parseFloat(this.style.width);
        const width = this.style.width && Number.isFinite(styleWidth) ? styleWidth : initialWidth;
        return { width, height: 0, top: 0, left: 0, right: 0, bottom: 0, x: 0, y: 0, toJSON: () => '' } as DOMRect;
      });
    };

    const pointerEvent = (type: string, clientX: number) =>
      new PointerEvent(type, { clientX, pointerId: 1, bubbles: true });

    /*
     * th/td must render as border-box, not the CSS content-box default: getBoundingClientRect() reports
     * width + padding under content-box, so reading the rendered width back and writing it as the new width —
     * which every keyboard resize step and the start of every drag does — grows the column by its own padding
     * each time. jsdom has no real CSS cascade or layout (confirmed: getComputedStyle(th).boxSizing reads '' in
     * jsdom regardless of the actual stylesheet), so this can only be verified live — confirmed in real Chromium:
     * before the fix, 3 ArrowRight presses (10px step) grew a column by 126px instead of 30px; after, exactly 30.
     */

    it('renders no resize handle for a column that does not opt in', () => {
      expect(el.shadowRoot!.querySelector('.resize-handle')).toBeNull();
    });

    it('renders a resize handle only for resizable columns', async () => {
      el.columns = [
        { key: 'id', label: 'ID', resizable: true },
        { key: 'name', label: 'Name' }
      ];
      await el.updateComplete;

      const headers = el.shadowRoot!.querySelectorAll('th');
      expect(headers[0].querySelector('.resize-handle')).toBeTruthy();
      expect(headers[1].querySelector('.resize-handle')).toBeNull();
    });

    it('dragging the handle right grows the column and fires columnresize on release', async () => {
      el.columns = [{ key: 'name', label: 'Name', resizable: true }];
      await el.updateComplete;
      mockThWidth(200);

      const handler = vi.fn();
      el.addEventListener('columnresize', handler);

      const handle = el.shadowRoot!.querySelector('.resize-handle') as HTMLElement;
      handle.dispatchEvent(pointerEvent('pointerdown', 100));
      handle.dispatchEvent(pointerEvent('pointermove', 150));
      await el.updateComplete;

      const th = el.shadowRoot!.querySelector('th') as HTMLElement;
      expect(th.style.width).toBe('250px');
      expect(handler).not.toHaveBeenCalled(); // not committed until release

      handle.dispatchEvent(pointerEvent('pointerup', 150));
      expect(handler).toHaveBeenCalledOnce();
      const event = handler.mock.calls[0][0] as CustomEvent<ColumnResizeDetail>;
      expect(event.detail).toEqual({ key: 'name', width: '250px' });
    });

    it('dragging left shrinks the column, clamped to its minWidth', async () => {
      el.columns = [{ key: 'name', label: 'Name', resizable: true, minWidth: '80px' }];
      await el.updateComplete;
      mockThWidth(200);

      const handle = el.shadowRoot!.querySelector('.resize-handle') as HTMLElement;
      handle.dispatchEvent(pointerEvent('pointerdown', 100));
      handle.dispatchEvent(pointerEvent('pointermove', -500)); // way past the minimum
      await el.updateComplete;

      const th = el.shadowRoot!.querySelector('th') as HTMLElement;
      expect(th.style.width).toBe('80px'); // clamped, not negative or zero
    });

    it('clamps to a sane default floor when the column has no minWidth of its own', async () => {
      el.columns = [{ key: 'name', label: 'Name', resizable: true }];
      await el.updateComplete;
      mockThWidth(200);

      const handle = el.shadowRoot!.querySelector('.resize-handle') as HTMLElement;
      handle.dispatchEvent(pointerEvent('pointerdown', 100));
      handle.dispatchEvent(pointerEvent('pointermove', -500));
      await el.updateComplete;

      const th = el.shadowRoot!.querySelector('th') as HTMLElement;
      expect(th.style.width).toBe('40px');
    });

    it('flips the drag direction under RTL, so the visually-dragged edge still tracks the cursor', async () => {
      el.columns = [{ key: 'name', label: 'Name', resizable: true }];
      el.style.direction = 'rtl';
      await el.updateComplete;
      mockThWidth(200);

      const handle = el.shadowRoot!.querySelector('.resize-handle') as HTMLElement;
      handle.dispatchEvent(pointerEvent('pointerdown', 100));
      handle.dispatchEvent(pointerEvent('pointermove', 150)); // +50 raw, grows in LTR, shrinks in RTL
      await el.updateComplete;

      const th = el.shadowRoot!.querySelector('th') as HTMLElement;
      expect(th.style.width).toBe('150px');
    });

    it('ArrowRight grows and ArrowLeft shrinks the column by a fixed step', async () => {
      el.columns = [{ key: 'name', label: 'Name', resizable: true }];
      await el.updateComplete;
      mockThWidth(200);

      const handler = vi.fn();
      el.addEventListener('columnresize', handler);
      const handle = el.shadowRoot!.querySelector('.resize-handle') as HTMLElement;

      handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      await el.updateComplete;
      let th = el.shadowRoot!.querySelector('th') as HTMLElement;
      expect(th.style.width).toBe('210px');

      handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
      await el.updateComplete;
      th = el.shadowRoot!.querySelector('th') as HTMLElement;
      expect(th.style.width).toBe('200px');

      expect(handler).toHaveBeenCalledTimes(2); // each key press commits immediately, unlike a drag
    });

    it('ignores keys other than the arrow keys', async () => {
      el.columns = [{ key: 'name', label: 'Name', resizable: true }];
      await el.updateComplete;
      mockThWidth(200);

      const handler = vi.fn();
      el.addEventListener('columnresize', handler);
      const handle = el.shadowRoot!.querySelector('.resize-handle') as HTMLElement;
      handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      expect(handler).not.toHaveBeenCalled();
    });

    it('applies the resized width to the matching body cells too, not just the header', async () => {
      el.columns = [{ key: 'name', label: 'Name', resizable: true }];
      await el.updateComplete;
      mockThWidth(200);

      const handle = el.shadowRoot!.querySelector('.resize-handle') as HTMLElement;
      handle.dispatchEvent(pointerEvent('pointerdown', 100));
      handle.dispatchEvent(pointerEvent('pointermove', 150));
      handle.dispatchEvent(pointerEvent('pointerup', 150));
      await el.updateComplete;

      const td = el.shadowRoot!.querySelector('tbody td') as HTMLElement;
      expect(td.style.width).toBe('250px');
    });

    it('a resize survives an unrelated columns update, keyed by column.key', async () => {
      el.columns = [{ key: 'name', label: 'Name', resizable: true }];
      await el.updateComplete;
      mockThWidth(200);

      const handle = el.shadowRoot!.querySelector('.resize-handle') as HTMLElement;
      handle.dispatchEvent(pointerEvent('pointerdown', 100));
      handle.dispatchEvent(pointerEvent('pointermove', 150));
      handle.dispatchEvent(pointerEvent('pointerup', 150));
      await el.updateComplete;

      el.columns = [{ key: 'name', label: 'Name', resizable: true, sortable: true }];
      await el.updateComplete;

      const th = el.shadowRoot!.querySelector('th') as HTMLElement;
      expect(th.style.width).toBe('250px');
    });

    it("a resize override wins over the column's own configured width going forward", async () => {
      el.columns = [{ key: 'name', label: 'Name', resizable: true, width: '300px' }];
      await el.updateComplete;
      mockThWidth(200); // irrelevant here — the th already renders at the configured 300px before any drag

      const handle = el.shadowRoot!.querySelector('.resize-handle') as HTMLElement;
      handle.dispatchEvent(pointerEvent('pointerdown', 100));
      handle.dispatchEvent(pointerEvent('pointermove', 150)); // +50 from the actual starting width, 300px
      await el.updateComplete;

      const th = el.shadowRoot!.querySelector('th') as HTMLElement;
      expect(th.style.width).toBe('350px'); // driven by the override now, not frozen at the configured 300px
    });
  });

  describe('virtualization', () => {
    interface Row {
      id: number;
      name: string;
    }

    // 100 simple rows, row-keyed by id so repeat() keying is exercised the same way a real large dataset would be.
    const bigData: Row[] = Array.from({ length: 100 }, (_, i) => ({ id: i, name: `Row ${i}` }));

    const setViewport = (table: Table<Row>, scrollTop: number, viewportHeight: number) => {
      const t = table as unknown as { _scrollTop: number; _viewportHeight: number };
      t._scrollTop = scrollTop;
      t._viewportHeight = viewportHeight;
    };

    let bigTable: Table<Row>;

    beforeEach(async () => {
      bigTable = document.createElement('lt-table') as Table<Row>;
      bigTable.columns = [{ key: 'name', label: 'Name' }];
      bigTable.data = bigData;
      bigTable.rowKey = 'id';
      document.body.appendChild(bigTable);
      await bigTable.updateComplete;
    });

    afterEach(() => {
      bigTable.remove();
    });

    it('renders every row when virtualized is unset, the default', () => {
      expect(bigTable.shadowRoot!.querySelectorAll('tbody tr')).toHaveLength(100);
    });

    it('renders every row when virtualized but no height is given, rather than erroring', async () => {
      bigTable.virtualized = true;
      await bigTable.updateComplete;
      expect(bigTable.shadowRoot!.querySelectorAll('tbody tr')).toHaveLength(100);
    });

    it('warns in dev mode when virtualized has no height to work with', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      bigTable.virtualized = true;
      await bigTable.updateComplete;
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('[lt-table]'));
      warn.mockRestore();
    });

    it('does not warn once height is also given', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      bigTable.virtualized = true;
      bigTable.height = '300px';
      await bigTable.updateComplete;
      expect(warn).not.toHaveBeenCalled();
      warn.mockRestore();
    });

    it('renders only the visible window (plus overscan) of rows, not all 100, once height is set', async () => {
      bigTable.virtualized = true;
      bigTable.height = '300px';
      await bigTable.updateComplete;
      setViewport(bigTable, 0, 300);
      await bigTable.updateComplete;

      const rows = bigTable.shadowRoot!.querySelectorAll('tbody tr:not(.virtual-spacer)');
      // rowHeight defaults to 44px: ceil(300/44) + VIRTUAL_OVERSCAN(4) rows fit in the 300px viewport from the top.
      expect(rows.length).toBeLessThan(100);
      expect(rows.length).toBeGreaterThan(0);
      expect((rows[0] as HTMLElement).textContent).toContain('Row 0');
    });

    it('renders the correct rows after scrolling partway down, not the top window', async () => {
      bigTable.virtualized = true;
      bigTable.height = '300px';
      bigTable.rowHeight = 50;
      await bigTable.updateComplete;
      setViewport(bigTable, 1000, 300); // scrolled 1000px down = past row 20
      await bigTable.updateComplete;

      const rows = bigTable.shadowRoot!.querySelectorAll('tbody tr:not(.virtual-spacer)');
      const names = [...rows].map((r) => r.textContent?.trim());
      expect(names).toContain('Row 20'); // floor(1000/50) = 20, the first strictly-visible row
      expect(names).not.toContain('Row 0'); // well outside the window + overscan
    });

    it('renders a top spacer row sized to stand in for the rows scrolled past', async () => {
      bigTable.virtualized = true;
      bigTable.height = '300px';
      bigTable.rowHeight = 50;
      await bigTable.updateComplete;
      setViewport(bigTable, 1000, 300);
      await bigTable.updateComplete;

      const spacers = bigTable.shadowRoot!.querySelectorAll('tbody tr.virtual-spacer') as NodeListOf<HTMLElement>;
      expect(spacers.length).toBe(2); // one above, one below the rendered window
      // floor(1000/50) - overscan(4) = 16 rows above the window, each 50px.
      expect(spacers[0].style.height).toBe('800px');
    });

    it('renders no top spacer when scrolled to the very top', async () => {
      bigTable.virtualized = true;
      bigTable.height = '300px';
      await bigTable.updateComplete;
      setViewport(bigTable, 0, 300);
      await bigTable.updateComplete;

      expect(bigTable.shadowRoot!.querySelectorAll('tbody tr.virtual-spacer')).toHaveLength(1); // bottom only
    });

    it('preserves the true sortedData index in rowclick even for a virtualized, scrolled-past row', async () => {
      bigTable.virtualized = true;
      bigTable.height = '300px';
      bigTable.rowHeight = 50;
      await bigTable.updateComplete;
      setViewport(bigTable, 1000, 300);
      await bigTable.updateComplete;

      const handler = vi.fn();
      bigTable.addEventListener('rowclick', handler);
      const firstVisibleRow = bigTable.shadowRoot!.querySelector('tbody tr:not(.virtual-spacer)') as HTMLElement;
      firstVisibleRow.click();

      const event = handler.mock.calls[0][0] as CustomEvent<RowClickDetail<Row>>;
      expect(event.detail.row.id).toBe(event.detail.index); // id and sortedData index match 1:1 in this fixture
      expect(event.detail.index).toBeGreaterThan(0);
    });

    it("select-all still covers the whole page's rows, not just what's currently rendered in the DOM", async () => {
      bigTable.selectionMode = 'multiple';
      bigTable.virtualized = true;
      bigTable.height = '300px';
      await bigTable.updateComplete;
      setViewport(bigTable, 0, 300);
      await bigTable.updateComplete;

      const handler = vi.fn();
      bigTable.addEventListener('selectionchange', handler);
      const headerCheckbox = bigTable.shadowRoot!.querySelector('thead .selection-cell input') as HTMLInputElement;
      headerCheckbox.click();

      const event = handler.mock.calls[0][0] as CustomEvent<SelectionChangeDetail>;
      expect(event.detail.selected).toHaveLength(100); // all 100 rows, not just the dozen or so rendered
    });

    it('sets aria-rowcount/aria-rowindex only once virtualized is actually in effect', async () => {
      const table = bigTable.shadowRoot!.querySelector('table')!;
      const headerRow = bigTable.shadowRoot!.querySelector('thead tr')!;
      expect(table.hasAttribute('aria-rowcount')).toBe(false);
      expect(headerRow.hasAttribute('aria-rowindex')).toBe(false);

      bigTable.virtualized = true;
      bigTable.height = '300px';
      await bigTable.updateComplete;

      expect(table.getAttribute('aria-rowcount')).toBe('101'); // 100 data rows + the header row
      expect(headerRow.getAttribute('aria-rowindex')).toBe('1');
      const firstBodyRow = bigTable.shadowRoot!.querySelector('tbody tr:not(.virtual-spacer)')!;
      expect(firstBodyRow.getAttribute('aria-rowindex')).toBe('2'); // row 0 of the page, +2 for the header offset
    });

    it('windows correctly within a page, not from the start of the full dataset', async () => {
      /*
       * Page 2 of 20-per-page covers sortedData rows 20..39. Scrolled 300px into THAT page (not the dataset as a
       * whole) at 50px rows should land on page-relative row 6 (floor(300/50)) — sortedData index 26.
       */
      bigTable.pageSize = 20;
      bigTable.page = 2;
      bigTable.virtualized = true;
      bigTable.height = '300px';
      bigTable.rowHeight = 50;
      await bigTable.updateComplete;
      setViewport(bigTable, 300, 300);
      await bigTable.updateComplete;

      const rows = bigTable.shadowRoot!.querySelectorAll('tbody tr:not(.virtual-spacer)');
      const names = [...rows].map((r) => r.textContent?.trim());
      expect(names).toContain('Row 26'); // sortedData[26], the real, global index
      expect(names).not.toContain('Row 6'); // NOT the page-relative row, and not from page 1 at all
      expect(names.every((n) => Number(n?.replace('Row ', '')) >= 20 && Number(n?.replace('Row ', '')) < 40)).toBe(
        true
      ); // every rendered row is actually within page 2's own range
    });
  });
});
