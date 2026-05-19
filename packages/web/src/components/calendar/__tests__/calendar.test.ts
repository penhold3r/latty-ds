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
    const monthLabel = el.shadowRoot!.querySelector('.month-label-btn')!;
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
    const label = el.shadowRoot!.querySelector('.month-label-btn')!;
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

    const label = el.shadowRoot!.querySelector('.month-label-btn')!;
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

    const label = el.shadowRoot!.querySelector('.month-label-btn')!;
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
    const label = el.shadowRoot!.querySelector('.month-label-btn')!;
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

    const label = el.shadowRoot!.querySelector('.month-label-btn')!;
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

    const label = el.shadowRoot!.querySelector('.month-label-btn')!;
    expect(label.textContent?.trim()).toContain('April');
  });

  it('navigates to next month via PageDown keyboard shortcut', async () => {
    el.value = '2026-05-10';
    await el.updateComplete;

    const selectedBtn = el.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2026-05-10"]')!;
    selectedBtn.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageDown', bubbles: true, composed: true }));
    await el.updateComplete;

    const label = el.shadowRoot!.querySelector('.month-label-btn')!;
    expect(label.textContent?.trim()).toContain('June');
  });
});

describe('<lt-calendar> month/year picker', () => {
  let el: Calendar;

  beforeEach(async () => {
    el = document.createElement('lt-calendar') as Calendar;
    el.value = '2026-05-01';
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('month label renders as a button', () => {
    const btn = el.shadowRoot!.querySelector<HTMLButtonElement>('.month-label-btn')!;
    expect(btn.tagName.toLowerCase()).toBe('button');
    expect(btn.getAttribute('aria-expanded')).toBe('false');
  });

  it('clicking month label opens picker and hides day grid', async () => {
    const btn = el.shadowRoot!.querySelector<HTMLButtonElement>('.month-label-btn')!;
    btn.click();
    await el.updateComplete;

    expect(btn.getAttribute('aria-expanded')).toBe('true');
    expect(el.shadowRoot!.querySelector('.picker-months')).toBeTruthy();
    expect(el.shadowRoot!.querySelector('.grid')).toBeFalsy();
  });

  it('picker renders 12 month buttons', async () => {
    const btn = el.shadowRoot!.querySelector<HTMLButtonElement>('.month-label-btn')!;
    btn.click();
    await el.updateComplete;

    const monthBtns = el.shadowRoot!.querySelectorAll('.picker-month-btn');
    expect(monthBtns.length).toBe(12);
  });

  it('current view month has picker-month-btn--current class', async () => {
    const btn = el.shadowRoot!.querySelector<HTMLButtonElement>('.month-label-btn')!;
    btn.click();
    await el.updateComplete;

    const current = el.shadowRoot!.querySelector('.picker-month-btn--current');
    expect(current).toBeTruthy();
  });

  it('clicking a month button navigates to that month and closes picker', async () => {
    const openBtn = el.shadowRoot!.querySelector<HTMLButtonElement>('.month-label-btn')!;
    openBtn.click();
    await el.updateComplete;

    const monthBtns = el.shadowRoot!.querySelectorAll<HTMLButtonElement>('.picker-month-btn');
    monthBtns[7].click(); // August (index 7)
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector('.grid')).toBeTruthy();
    expect(el.shadowRoot!.querySelector('.picker-months')).toBeFalsy();
    const label = el.shadowRoot!.querySelector('.month-label-btn')!;
    expect(label.textContent?.trim()).toContain('August');
  });

  it('clicking month label again closes picker', async () => {
    const btn = el.shadowRoot!.querySelector<HTMLButtonElement>('.month-label-btn')!;
    btn.click();
    await el.updateComplete;
    btn.click();
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector('.grid')).toBeTruthy();
    expect(el.shadowRoot!.querySelector('.picker-months')).toBeFalsy();
  });

  it('prev/next buttons navigate years when picker is open', async () => {
    const openBtn = el.shadowRoot!.querySelector<HTMLButtonElement>('.month-label-btn')!;
    openBtn.click();
    await el.updateComplete;

    const prevBtn = el.shadowRoot!.querySelector<HTMLButtonElement>('[aria-label="Previous year"]')!;
    prevBtn.click();
    await el.updateComplete;

    const label = el.shadowRoot!.querySelector('.month-label-btn span')!;
    expect(label.textContent?.trim()).toBe('2025');
  });

  it('pressing Escape closes picker without navigating', async () => {
    const openBtn = el.shadowRoot!.querySelector<HTMLButtonElement>('.month-label-btn')!;
    openBtn.click();
    await el.updateComplete;

    const prevBtn = el.shadowRoot!.querySelector<HTMLButtonElement>('[aria-label="Previous year"]')!;
    prevBtn.click();
    await el.updateComplete;

    const calendar = el.shadowRoot!.querySelector('.calendar')!;
    calendar.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector('.grid')).toBeTruthy();
    // View month unchanged (2026-05)
    const label = el.shadowRoot!.querySelector('.month-label-btn')!;
    expect(label.textContent?.trim()).toContain('May');
    expect(label.textContent?.trim()).toContain('2026');
  });

  it('picking a month fires lt-month-change', async () => {
    const openBtn = el.shadowRoot!.querySelector<HTMLButtonElement>('.month-label-btn')!;
    openBtn.click();
    await el.updateComplete;

    let detail: { year: number; month: number } | undefined;
    el.addEventListener('lt-month-change', (e) => {
      detail = (e as CustomEvent<{ year: number; month: number }>).detail;
    });

    const monthBtns = el.shadowRoot!.querySelectorAll<HTMLButtonElement>('.picker-month-btn');
    monthBtns[0].click(); // January
    await el.updateComplete;

    expect(detail).toBeTruthy();
    expect(detail!.month).toBe(0);
  });

  it('today button closes picker and returns to current month', async () => {
    const openBtn = el.shadowRoot!.querySelector<HTMLButtonElement>('.month-label-btn')!;
    openBtn.click();
    await el.updateComplete;

    const todayBtn = el.shadowRoot!.querySelector<HTMLButtonElement>('.today-btn')!;
    todayBtn.click();
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector('.grid')).toBeTruthy();
    expect(el.shadowRoot!.querySelector('.picker-months')).toBeFalsy();
  });
});

describe('<lt-calendar months="2"> multi-month', () => {
  let el: Calendar;

  beforeEach(async () => {
    el = document.createElement('lt-calendar') as Calendar;
    el.setAttribute('months', '2');
    el.value = '2026-05-01';
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('renders two sets of weekday headers', () => {
    const weekdayRows = el.shadowRoot!.querySelectorAll('.weekdays');
    expect(weekdayRows.length).toBe(2);
  });

  it('renders two grids', () => {
    const grids = el.shadowRoot!.querySelectorAll('.grid');
    expect(grids.length).toBe(2);
  });

  it('shows consecutive months — first shows May, second shows June', () => {
    const labels = el.shadowRoot!.querySelectorAll('.month-label');
    expect(labels[0].textContent?.trim()).toContain('May');
    expect(labels[1].textContent?.trim()).toContain('June');
  });

  it('next button advances both panels by one month', async () => {
    const nextBtn = el.shadowRoot!.querySelector<HTMLButtonElement>('[aria-label="Next month"]')!;
    nextBtn.click();
    await el.updateComplete;

    const labels = el.shadowRoot!.querySelectorAll('.month-label');
    expect(labels[0].textContent?.trim()).toContain('June');
    expect(labels[1].textContent?.trim()).toContain('July');
  });

  it('prev button moves both panels back one month', async () => {
    const prevBtn = el.shadowRoot!.querySelector<HTMLButtonElement>('[aria-label="Previous month"]')!;
    prevBtn.click();
    await el.updateComplete;

    const labels = el.shadowRoot!.querySelectorAll('.month-label');
    expect(labels[0].textContent?.trim()).toContain('April');
    expect(labels[1].textContent?.trim()).toContain('May');
  });

  it('does not show the month-label-btn (no picker in multi-month mode)', () => {
    expect(el.shadowRoot!.querySelector('.month-label-btn')).toBeFalsy();
  });

  it('range selection spans both panels', async () => {
    el.mode = 'range';
    el.valueStart = '2026-05-25';
    el.valueEnd = '2026-06-05';
    await el.updateComplete;

    // Start in first panel
    const startDay = el.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2026-05-25"]')!;
    expect(startDay.classList.contains('day--range-confirmed')).toBe(true);

    // End in second panel
    const endDay = el.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2026-06-05"]')!;
    expect(endDay.classList.contains('day--range-confirmed')).toBe(true);

    // May 31 should be in-range
    const midDay = el.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2026-05-31"]')!;
    expect(midDay.classList.contains('day--in-range')).toBe(true);
  });

  it('today button closes any picker and resets view', async () => {
    const todayBtn = el.shadowRoot!.querySelector<HTMLButtonElement>('.today-btn')!;
    todayBtn.click();
    await el.updateComplete;

    const today = new Date();
    const expectedLabel = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(today);
    const labels = el.shadowRoot!.querySelectorAll('.month-label');
    expect(labels[0].textContent?.trim()).toBe(expectedLabel);
  });

  it('year wraps correctly — December + 1 month shows January of next year', async () => {
    el.value = '2026-12-01';
    await el.updateComplete;

    const labels = el.shadowRoot!.querySelectorAll('.month-label');
    expect(labels[0].textContent?.trim()).toContain('December');
    expect(labels[1].textContent?.trim()).toContain('January');
    expect(labels[1].textContent?.trim()).toContain('2027');
  });
});

describe('<lt-calendar mode="range">', () => {
  let el: Calendar;

  beforeEach(async () => {
    el = document.createElement('lt-calendar') as Calendar;
    el.mode = 'range';
    el.value = '2026-05-01';
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('first click sets valueStart and clears valueEnd', async () => {
    const day10 = el.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2026-05-10"]')!;
    day10.click();
    await el.updateComplete;

    expect(el.valueStart).toBe('2026-05-10');
    expect(el.valueEnd).toBe('');
  });

  it('second click after start completes range and fires lt-change', async () => {
    el.valueStart = '2026-05-10';
    await el.updateComplete;

    let detail: { valueStart: string; valueEnd: string } | undefined;
    el.addEventListener('lt-change', (e) => {
      detail = (e as CustomEvent<{ valueStart: string; valueEnd: string }>).detail;
    });

    const day20 = el.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2026-05-20"]')!;
    day20.click();
    await el.updateComplete;

    expect(el.valueStart).toBe('2026-05-10');
    expect(el.valueEnd).toBe('2026-05-20');
    expect(detail).toBeTruthy();
    expect(detail!.valueStart).toBe('2026-05-10');
    expect(detail!.valueEnd).toBe('2026-05-20');
  });

  it('clicking before start swaps start and end', async () => {
    el.valueStart = '2026-05-20';
    await el.updateComplete;

    const day05 = el.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2026-05-05"]')!;
    day05.click();
    await el.updateComplete;

    expect(el.valueStart).toBe('2026-05-05');
    expect(el.valueEnd).toBe('2026-05-20');
  });

  it('clicking the same day as start clears the selection', async () => {
    el.valueStart = '2026-05-10';
    await el.updateComplete;

    const day10 = el.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2026-05-10"]')!;
    day10.click();
    await el.updateComplete;

    expect(el.valueStart).toBe('');
  });

  it('clicking when both start and end are set begins a new range', async () => {
    el.valueStart = '2026-05-10';
    el.valueEnd = '2026-05-20';
    await el.updateComplete;

    const day15 = el.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2026-05-15"]')!;
    day15.click();
    await el.updateComplete;

    expect(el.valueStart).toBe('2026-05-15');
    expect(el.valueEnd).toBe('');
  });

  it('range start day has day--range-left and day--range-confirmed classes', async () => {
    el.valueStart = '2026-05-10';
    el.valueEnd = '2026-05-20';
    await el.updateComplete;

    const day10 = el.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2026-05-10"]')!;
    expect(day10.classList.contains('day--range-left')).toBe(true);
    expect(day10.classList.contains('day--range-confirmed')).toBe(true);
  });

  it('range end day has day--range-right and day--range-confirmed classes', async () => {
    el.valueStart = '2026-05-10';
    el.valueEnd = '2026-05-20';
    await el.updateComplete;

    const day20 = el.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2026-05-20"]')!;
    expect(day20.classList.contains('day--range-right')).toBe(true);
    expect(day20.classList.contains('day--range-confirmed')).toBe(true);
  });

  it('days between start and end have day--in-range class', async () => {
    el.valueStart = '2026-05-10';
    el.valueEnd = '2026-05-20';
    await el.updateComplete;

    const day15 = el.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2026-05-15"]')!;
    expect(day15.classList.contains('day--in-range')).toBe(true);
    expect(day15.classList.contains('day--range-confirmed')).toBe(false);
  });

  it('days outside confirmed range do not have range classes', async () => {
    el.valueStart = '2026-05-10';
    el.valueEnd = '2026-05-20';
    await el.updateComplete;

    const day05 = el.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2026-05-05"]')!;
    expect(day05.classList.contains('day--in-range')).toBe(false);
    expect(day05.classList.contains('day--range-confirmed')).toBe(false);
  });

  it('lt-change is not fired when only start is selected', async () => {
    let fired = false;
    el.addEventListener('lt-change', () => {
      fired = true;
    });

    const day10 = el.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2026-05-10"]')!;
    day10.click();
    await el.updateComplete;

    expect(fired).toBe(false);
  });

  it('views syncs to valueStart month when valueStart is set', async () => {
    el.valueStart = '2026-08-15';
    await el.updateComplete;

    const label = el.shadowRoot!.querySelector('.month-label-btn')!;
    expect(label.textContent?.trim()).toContain('August');
  });
});
