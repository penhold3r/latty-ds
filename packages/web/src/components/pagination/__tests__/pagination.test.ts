import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { Pagination } from '../pagination';
import '../pagination';

describe('<lt-pagination>', () => {
  let el: Pagination;

  beforeEach(async () => {
    el = document.createElement('lt-pagination') as Pagination;
    el.totalPages = 10;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('renders in shadow DOM', () => {
    expect(el.shadowRoot).toBeTruthy();
  });

  it('has default page of 1', () => {
    expect(el.page).toBe(1);
  });

  it('reflects page to attribute', async () => {
    el.page = 3;
    await el.updateComplete;
    expect(el.getAttribute('page')).toBe('3');
  });

  it('has default size of md', () => {
    expect(el.size).toBe('md');
    expect(el.getAttribute('size')).toBe('md');
  });

  it.each(['sm', 'md', 'lg'] as const)('reflects %s size to attribute', async (size) => {
    el.size = size;
    await el.updateComplete;
    expect(el.getAttribute('size')).toBe(size);
  });

  it('disables first and prev buttons on first page', async () => {
    const buttons = Array.from(el.shadowRoot!.querySelectorAll('button'));
    expect(buttons[0].hasAttribute('disabled')).toBe(true);
    expect(buttons[1].hasAttribute('disabled')).toBe(true);
  });

  it('enables first and prev buttons when not on first page', async () => {
    el.page = 5;
    await el.updateComplete;
    const buttons = Array.from(el.shadowRoot!.querySelectorAll('button'));
    expect(buttons[0].hasAttribute('disabled')).toBe(false);
    expect(buttons[1].hasAttribute('disabled')).toBe(false);
  });

  it('disables next and last buttons on last page', async () => {
    el.page = 10;
    await el.updateComplete;
    const buttons = Array.from(el.shadowRoot!.querySelectorAll('button'));
    const last = buttons[buttons.length - 1];
    const secondLast = buttons[buttons.length - 2];
    expect(last.hasAttribute('disabled')).toBe(true);
    expect(secondLast.hasAttribute('disabled')).toBe(true);
  });

  it('dispatches lt-change when clicking next', async () => {
    el.page = 3;
    await el.updateComplete;
    const events: number[] = [];
    el.addEventListener('change', (e) => events.push((e as CustomEvent<{ page: number }>).detail.page));
    const buttons = Array.from(el.shadowRoot!.querySelectorAll('button'));
    const nextBtn = buttons[buttons.length - 2] as HTMLButtonElement;
    nextBtn.click();
    expect(events).toEqual([4]);
  });

  it('dispatches lt-change with correct page when clicking a page button', async () => {
    el.totalPages = 5;
    el.page = 1;
    await el.updateComplete;
    const events: number[] = [];
    el.addEventListener('change', (e) => events.push((e as CustomEvent<{ page: number }>).detail.page));
    const pageButtons = Array.from(el.shadowRoot!.querySelectorAll('button[aria-label^="Page"]'));
    (pageButtons[2] as HTMLButtonElement).click();
    expect(events).toEqual([3]);
  });

  it('does not dispatch lt-change when disabled', async () => {
    el.disabled = true;
    el.page = 3;
    await el.updateComplete;
    const events: number[] = [];
    el.addEventListener('change', (e) => events.push((e as CustomEvent<{ page: number }>).detail.page));
    const buttons = Array.from(el.shadowRoot!.querySelectorAll('button'));
    const nextBtn = buttons[buttons.length - 2] as HTMLButtonElement;
    nextBtn.click();
    expect(events).toHaveLength(0);
  });

  it('shows ellipsis for large page counts', async () => {
    el.page = 5;
    await el.updateComplete;
    const ellipsis = el.shadowRoot!.querySelectorAll('.ellipsis');
    expect(ellipsis.length).toBeGreaterThan(0);
  });

  it('shows all pages when totalPages <= 7', async () => {
    el.totalPages = 5;
    el.page = 1;
    await el.updateComplete;
    const pageButtons = el.shadowRoot!.querySelectorAll('button[aria-label^="Page"]');
    expect(pageButtons.length).toBe(5);
  });

  describe('constant control count (PGN-2)', () => {
    const slotCount = () => el.shadowRoot!.querySelectorAll('button[aria-label^="Page"], .ellipsis').length;

    it.each([1, 2, 3, 4, 5, 50, 97, 98, 99, 100])(
      'renders exactly 7 page/ellipsis slots at page %i of 100, never more or fewer',
      async (page) => {
        el.totalPages = 100;
        el.page = page;
        await el.updateComplete;
        expect(slotCount()).toBe(7);
      }
    );

    it.each([1, 2, 3, 4, 5, 50, 97, 98, 99, 100])(
      'always includes the current page itself (page %i of 100)',
      async (page) => {
        el.totalPages = 100;
        el.page = page;
        await el.updateComplete;
        const current = el.shadowRoot!.querySelector('button[aria-current="page"]');
        expect(current?.textContent?.trim()).toBe(String(page));
      }
    );

    it('collapses a single hidden page into its own number instead of a pointless ellipsis', async () => {
      /*
       * total=8: page 2's sibling window is [2,3] by the raw algorithm, leaving boundary page 1 and page 2
       * one apart — no page is actually hidden between them, so there should be no leading ellipsis, just
       * page 2 shown plainly.
       */
      el.totalPages = 8;
      el.page = 2;
      await el.updateComplete;
      const labels = Array.from(el.shadowRoot!.querySelectorAll('button[aria-label^="Page"], .ellipsis')).map((b) =>
        b.textContent?.trim()
      );
      expect(labels[0]).toBe('1');
      expect(labels[1]).toBe('2');
      expect(labels[1]).not.toBe('…');
    });
  });

  describe('out-of-range input', () => {
    const current = () => el.shadowRoot!.querySelector('button[aria-current="page"]')?.textContent?.trim();

    it('treats a page past the end as the last page', async () => {
      el.totalPages = 10;
      el.page = 99;
      await el.updateComplete;
      expect(current()).toBe('10');
    });

    it('treats a page before the start as the first page', async () => {
      el.totalPages = 10;
      el.page = -5;
      await el.updateComplete;
      expect(current()).toBe('1');
    });

    it.each([0, -3, NaN])('collapses total-pages %s to a single page', async (total) => {
      el.totalPages = total;
      el.page = 4;
      await el.updateComplete;
      expect(current()).toBe('1');
      expect(el.shadowRoot!.querySelectorAll('button[aria-label^="Page"]')).toHaveLength(1);
    });

    it('does not emit change for a click that lands on the already-current (clamped) page', async () => {
      el.totalPages = 3;
      el.page = 50;
      await el.updateComplete;
      const events: unknown[] = [];
      el.addEventListener('change', (e) => events.push((e as CustomEvent).detail));
      el.shadowRoot!.querySelector<HTMLElement>('button[aria-label="Page 3"]')!.click();
      expect(events).toEqual([]);
    });
  });

  describe('labels (i18n, X5)', () => {
    it('defaults all labels to English', () => {
      const nav = el.shadowRoot!.querySelector('nav');
      expect(nav?.getAttribute('aria-label')).toBe('Pagination');
      expect(el.shadowRoot!.querySelector('button[aria-label="First page"]')).toBeTruthy();
      expect(el.shadowRoot!.querySelector('button[aria-label="Previous page"]')).toBeTruthy();
      expect(el.shadowRoot!.querySelector('button[aria-label="Page 1"]')).toBeTruthy();
      expect(el.shadowRoot!.querySelector('button[aria-label="Next page"]')).toBeTruthy();
      expect(el.shadowRoot!.querySelector('button[aria-label="Last page"]')).toBeTruthy();
    });

    it('overrides all labels via labels', async () => {
      el.labels = {
        navigation: 'Pagination des résultats',
        firstPage: 'Première page',
        previousPage: 'Page précédente',
        page: (n) => `Page ${n}`,
        nextPage: 'Page suivante',
        lastPage: 'Dernière page'
      };
      await el.updateComplete;
      const nav = el.shadowRoot!.querySelector('nav');
      expect(nav?.getAttribute('aria-label')).toBe('Pagination des résultats');
      expect(el.shadowRoot!.querySelector('button[aria-label="Première page"]')).toBeTruthy();
      expect(el.shadowRoot!.querySelector('button[aria-label="Page précédente"]')).toBeTruthy();
      expect(el.shadowRoot!.querySelector('button[aria-label="Page suivante"]')).toBeTruthy();
      expect(el.shadowRoot!.querySelector('button[aria-label="Dernière page"]')).toBeTruthy();
    });

    it('calls the page() template with the 1-indexed page number for each numbered button', async () => {
      el.totalPages = 3;
      el.labels = { page: (n) => `Página ${n}` };
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('button[aria-label="Página 1"]')).toBeTruthy();
      expect(el.shadowRoot!.querySelector('button[aria-label="Página 2"]')).toBeTruthy();
      expect(el.shadowRoot!.querySelector('button[aria-label="Página 3"]')).toBeTruthy();
    });
  });
});
