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
    el.addEventListener('lt-change', (e) => events.push((e as CustomEvent<{ page: number }>).detail.page));
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
    el.addEventListener('lt-change', (e) => events.push((e as CustomEvent<{ page: number }>).detail.page));
    const pageButtons = Array.from(el.shadowRoot!.querySelectorAll('button[aria-label^="Page"]'));
    (pageButtons[2] as HTMLButtonElement).click();
    expect(events).toEqual([3]);
  });

  it('does not dispatch lt-change when disabled', async () => {
    el.disabled = true;
    el.page = 3;
    await el.updateComplete;
    const events: number[] = [];
    el.addEventListener('lt-change', (e) => events.push((e as CustomEvent<{ page: number }>).detail.page));
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
});
