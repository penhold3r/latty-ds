import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { Calendar } from '../calendar';
import '../calendar';

describe('<lt-calendar>', () => {
  let el: Calendar;

  beforeEach(async () => {
    el = document.createElement('lt-calendar') as Calendar;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('renders in shadow DOM', () => {
    expect(el.shadowRoot).toBeTruthy();
  });

  it('renders the current month and year by default', () => {
    const today = new Date();
    const label = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(today);
    const monthLabel = el.shadowRoot!.querySelector('.month-label')!;
    expect(monthLabel.textContent?.trim()).toBe(label);
  });

  it('renders 7 weekday header cells', async () => {
    const cells = el.shadowRoot!.querySelectorAll('.weekday');
    expect(cells.length).toBe(7);
  });

  it('renders day cells whose count is a multiple of 7', async () => {
    const cells = el.shadowRoot!.querySelectorAll('[role="gridcell"]');
    expect(cells.length % 7).toBe(0);
  });

  it('marks the selected date with day--selected class', async () => {
    el.value = '2026-05-10';
    await el.updateComplete;
    const selected = el.shadowRoot!.querySelector('.day--selected');
    expect(selected).toBeTruthy();
    expect(selected?.getAttribute('data-date')).toBe('2026-05-10');
  });

  it('navigates the view to the value month when value is set', async () => {
    el.value = '2026-08-15';
    await el.updateComplete;
    const label = el.shadowRoot!.querySelector('.month-label')!;
    expect(label.textContent?.trim()).toContain('August');
    expect(label.textContent?.trim()).toContain('2026');
  });

  it('dispatches lt-change with ISO value when a day is clicked', async () => {
    el.value = '';
    await el.updateComplete;

    let detail: { value: string } | undefined;
    el.addEventListener('lt-change', (e) => {
      detail = (e as CustomEvent<{ value: string }>).detail;
    });

    const firstCurrentDay = el.shadowRoot!.querySelector<HTMLButtonElement>('.day:not(.day--outside):not(:disabled)')!;
    firstCurrentDay.click();

    expect(detail).toBeTruthy();
    expect(detail!.value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('does not dispatch lt-change when a disabled day is clicked', async () => {
    const today = new Date();
    const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
    el.min = iso;
    await el.updateComplete;

    let fired = false;
    el.addEventListener('lt-change', () => {
      fired = true;
    });

    const outsideDay = el.shadowRoot!.querySelector<HTMLButtonElement>('.day--outside');
    outsideDay?.click();

    expect(fired).toBe(false);
  });

  it('previous month button navigates back one month', async () => {
    el.value = '2026-05-01';
    await el.updateComplete;

    let monthChangeDetail: { year: number; month: number } | undefined;
    el.addEventListener('lt-month-change', (e) => {
      monthChangeDetail = (e as CustomEvent<{ year: number; month: number }>).detail;
    });

    const prevBtn = el.shadowRoot!.querySelector<HTMLButtonElement>('[aria-label="Previous month"]')!;
    prevBtn.click();
    await el.updateComplete;

    const label = el.shadowRoot!.querySelector('.month-label')!;
    expect(label.textContent?.trim()).toContain('April');
    expect(monthChangeDetail).toBeTruthy();
    expect(monthChangeDetail!.month).toBe(3);
  });

  it('next month button navigates forward one month', async () => {
    el.value = '2026-05-01';
    await el.updateComplete;

    const nextBtn = el.shadowRoot!.querySelector<HTMLButtonElement>('[aria-label="Next month"]')!;
    nextBtn.click();
    await el.updateComplete;

    const label = el.shadowRoot!.querySelector('.month-label')!;
    expect(label.textContent?.trim()).toContain('June');
  });

  it('today button resets view to current month', async () => {
    el.value = '2025-01-01';
    await el.updateComplete;

    const todayBtn = el.shadowRoot!.querySelector<HTMLButtonElement>('.today-btn')!;
    todayBtn.click();
    await el.updateComplete;

    const today = new Date();
    const expectedLabel = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(today);
    const label = el.shadowRoot!.querySelector('.month-label')!;
    expect(label.textContent?.trim()).toBe(expectedLabel);
  });

  it('disables days before min', async () => {
    el.setAttribute('min', '2026-05-15');
    el.value = '2026-05-01';
    await el.updateComplete;

    const day10 = el.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2026-05-10"]');
    expect(day10?.disabled).toBe(true);

    const day20 = el.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2026-05-20"]');
    expect(day20?.disabled).toBe(false);
  });

  it('disables days after max', async () => {
    el.setAttribute('max', '2026-05-10');
    el.value = '2026-05-01';
    await el.updateComplete;

    const day15 = el.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2026-05-15"]');
    expect(day15?.disabled).toBe(true);

    const day5 = el.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2026-05-05"]');
    expect(day5?.disabled).toBe(false);
  });

  it('disables specific dates via disabledDates property', async () => {
    el.value = '2026-05-01';
    await el.updateComplete;
    el.disabledDates = [new Date(2026, 4, 12)];
    el.requestUpdate();
    await el.updateComplete;

    const day12 = el.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2026-05-12"]');
    expect(day12?.disabled).toBe(true);
  });

  it('renders Mon–Sun headers when week-start="1"', async () => {
    el.setAttribute('week-start', '1');
    await el.updateComplete;

    const cells = el.shadowRoot!.querySelectorAll('.weekday');
    const labels = Array.from(cells).map((c) => c.textContent?.trim());
    const fmt = new Intl.DateTimeFormat('en-US', { weekday: 'narrow' });
    expect(labels[0]).toBe(fmt.format(new Date(2026, 0, 5))); // Monday
    expect(labels[6]).toBe(fmt.format(new Date(2026, 0, 11))); // Sunday
  });

  it('renders French month and day names with locale="fr-FR"', async () => {
    el.setAttribute('locale', 'fr-FR');
    el.value = '2026-05-01';
    await el.updateComplete;

    const label = el.shadowRoot!.querySelector('.month-label')!;
    expect(label.textContent?.toLowerCase()).toContain('mai');
  });

  it('hides outside-month days when show-outside-days is false', async () => {
    el.value = '2026-05-01';
    await el.updateComplete;
    el.showOutsideDays = false;
    await el.updateComplete;

    const emptyDays = el.shadowRoot!.querySelectorAll('.day--empty');
    expect(emptyDays.length).toBeGreaterThan(0);

    const outsideDays = el.shadowRoot!.querySelectorAll('.day--outside');
    expect(outsideDays.length).toBe(0);
  });

  it('the entire calendar is disabled when disabled attribute is set', async () => {
    el.disabled = true;
    await el.updateComplete;

    const prevBtn = el.shadowRoot!.querySelector<HTMLButtonElement>('[aria-label="Previous month"]')!;
    const nextBtn = el.shadowRoot!.querySelector<HTMLButtonElement>('[aria-label="Next month"]')!;
    const todayBtn = el.shadowRoot!.querySelector<HTMLButtonElement>('.today-btn')!;

    expect(prevBtn.disabled).toBe(true);
    expect(nextBtn.disabled).toBe(true);
    expect(todayBtn.disabled).toBe(true);
  });

  it('dispatches lt-change via keyboard Enter on focused day', async () => {
    el.value = '2026-05-10';
    await el.updateComplete;

    let detail: { value: string } | null = null;
    el.addEventListener('lt-change', (e) => {
      detail = (e as CustomEvent<{ value: string }>).detail;
    });

    const selectedBtn = el.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2026-05-10"]')!;
    selectedBtn.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));

    expect(detail).toBeTruthy();
  });

  it('navigates to previous month via PageUp keyboard shortcut', async () => {
    el.value = '2026-05-10';
    await el.updateComplete;

    const selectedBtn = el.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2026-05-10"]')!;
    selectedBtn.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageUp', bubbles: true, composed: true }));
    await el.updateComplete;

    const label = el.shadowRoot!.querySelector('.month-label')!;
    expect(label.textContent?.trim()).toContain('April');
  });

  it('navigates to next month via PageDown keyboard shortcut', async () => {
    el.value = '2026-05-10';
    await el.updateComplete;

    const selectedBtn = el.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2026-05-10"]')!;
    selectedBtn.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageDown', bubbles: true, composed: true }));
    await el.updateComplete;

    const label = el.shadowRoot!.querySelector('.month-label')!;
    expect(label.textContent?.trim()).toContain('June');
  });
});
