import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
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
    el.addEventListener('change', (e) => {
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
    el.addEventListener('change', () => {
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
    el.addEventListener('monthchange', (e) => {
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
    expect(day10?.getAttribute('aria-disabled')).toBe('true');

    const day20 = el.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2026-05-20"]');
    expect(day20?.hasAttribute('aria-disabled')).toBe(false);
  });

  it('disables days after max', async () => {
    el.setAttribute('max', '2026-05-10');
    el.value = '2026-05-01';
    await el.updateComplete;

    const day15 = el.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2026-05-15"]');
    expect(day15?.getAttribute('aria-disabled')).toBe('true');

    const day5 = el.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2026-05-05"]');
    expect(day5?.hasAttribute('aria-disabled')).toBe(false);
  });

  it('disables specific dates via disabledDates property', async () => {
    el.value = '2026-05-01';
    await el.updateComplete;
    el.disabledDates = [new Date(2026, 4, 12)];
    el.requestUpdate();
    await el.updateComplete;

    const day12 = el.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2026-05-12"]');
    expect(day12?.getAttribute('aria-disabled')).toBe('true');
  });

  it('disables dates via a disabledDates predicate, for rules impractical to enumerate as a list', async () => {
    el.value = '2026-05-01';
    await el.updateComplete;
    // Disable every weekend — 2026-05-16/17 is a Saturday/Sunday.
    el.disabledDates = (date) => date.getDay() === 0 || date.getDay() === 6;
    el.requestUpdate();
    await el.updateComplete;

    const saturday = el.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2026-05-16"]');
    const sunday = el.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2026-05-17"]');
    const monday = el.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2026-05-18"]');
    expect(saturday?.getAttribute('aria-disabled')).toBe('true');
    expect(sunday?.getAttribute('aria-disabled')).toBe('true');
    expect(monday?.hasAttribute('aria-disabled')).toBe(false);
  });

  it('a disabledDates predicate still composes with min/max, not replacing them', async () => {
    el.value = '2026-05-15';
    el.min = '2026-05-10';
    el.disabledDates = () => false; // never disables anything on its own
    await el.updateComplete;

    const day5 = el.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2026-05-05"]');
    expect(day5?.getAttribute('aria-disabled')).toBe('true'); // still disabled by min, predicate notwithstanding
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
    el.addEventListener('change', (e) => {
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

  it('includes the visible month/year text in its own accessible name (CAL-3, WCAG 2.5.3)', () => {
    const btn = el.shadowRoot!.querySelector<HTMLButtonElement>('.month-label-btn')!;
    const visibleText = btn.textContent!.trim();
    expect(visibleText).toBeTruthy();
    expect(btn.getAttribute('aria-label')).toContain(visibleText);
  });

  it('keeps the visible year in its accessible name once the picker is open', async () => {
    const btn = el.shadowRoot!.querySelector<HTMLButtonElement>('.month-label-btn')!;
    btn.click();
    await el.updateComplete;
    expect(btn.getAttribute('aria-label')).toContain(String(new Date('2026-05-01T00:00:00').getFullYear()));
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

  it('picking a month fires monthchange', async () => {
    const openBtn = el.shadowRoot!.querySelector<HTMLButtonElement>('.month-label-btn')!;
    openBtn.click();
    await el.updateComplete;

    let detail: { year: number; month: number } | undefined;
    el.addEventListener('monthchange', (e) => {
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
    el.addEventListener('change', (e) => {
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

  it('change is not fired when only start is selected', async () => {
    let fired = false;
    el.addEventListener('change', () => {
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

describe('<lt-calendar> roving tabindex and keyboard nav after paging (CAL-1, CAL-2)', () => {
  let el: Calendar;

  beforeEach(async () => {
    el = document.createElement('lt-calendar') as Calendar;
    el.value = '2026-05-19';
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  const rovingCell = () => el.shadowRoot!.querySelector<HTMLButtonElement>('[role="gridcell"][tabindex="0"]');

  it('always has exactly one cell with tabindex=0, even after paging away from the selected month', async () => {
    const navNext = el.shadowRoot!.querySelector<HTMLButtonElement>('.nav-btn[aria-label="Next month"]')!;
    navNext.click();
    navNext.click();
    await el.updateComplete;

    expect(el.shadowRoot!.querySelectorAll('[role="gridcell"][tabindex="0"]')).toHaveLength(1);
    // May 19 isn't rendered in July, so the roving stop must have fallen back to something that is.
    expect(rovingCell()!.dataset.date?.startsWith('2026-07')).toBe(true);
  });

  it('ArrowRight from the fallback cell moves by one day, not by re-deriving a different date', async () => {
    const navNext = el.shadowRoot!.querySelector<HTMLButtonElement>('.nav-btn[aria-label="Next month"]')!;
    navNext.click();
    navNext.click();
    await el.updateComplete;

    const cell = rovingCell()!;
    const startIso = cell.dataset.date!;
    cell.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true, bubbles: true }));
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0)); // _focusCell resolves via updateComplete internally

    const expectedNextDay = new Date(startIso + 'T00:00:00');
    expectedNextDay.setDate(expectedNextDay.getDate() + 1);
    const expectedIso = expectedNextDay.toISOString().slice(0, 10);
    expect(document.activeElement).toBe(el);
    expect(el.shadowRoot!.activeElement?.getAttribute('data-date')).toBe(expectedIso);
  });
});

describe('<lt-calendar> disabled days stay focusable (CAL-5)', () => {
  let el: Calendar;

  beforeEach(async () => {
    el = document.createElement('lt-calendar') as Calendar;
    el.min = '2026-05-20';
    el.value = '2026-05-20';
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('marks a disabled day with aria-disabled, not the disabled attribute', () => {
    const day10 = el.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2026-05-10"]')!;
    expect(day10.getAttribute('aria-disabled')).toBe('true');
    expect(day10.disabled).toBe(false);
  });

  it('can still receive focus and move the roving stop onto it', async () => {
    const day20 = el.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2026-05-20"]')!;
    day20.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', cancelable: true, bubbles: true }));
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));

    const day19 = el.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2026-05-19"]')!;
    expect(day19.getAttribute('aria-disabled')).toBe('true'); // before min (2026-05-20)
    expect(document.activeElement).toBe(el);
    expect(el.shadowRoot!.activeElement).toBe(day19);
  });

  it('does not select a disabled day activated via keyboard', async () => {
    const day10 = el.shadowRoot!.querySelector<HTMLButtonElement>('[data-date="2026-05-10"]')!;
    day10.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', cancelable: true, bubbles: true }));
    await el.updateComplete;
    expect(el.value).toBe('2026-05-20');
  });
});

describe('<lt-calendar> labels (i18n, X5)', () => {
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

  it('defaults the footer, nav, and picker-toggle labels to English (single-month layout)', () => {
    const navBtns = el.shadowRoot!.querySelectorAll('.nav-btn');
    expect(el.shadowRoot!.querySelector('.today-btn')?.textContent?.trim()).toBe('Today');
    expect(navBtns[0].getAttribute('aria-label')).toBe('Previous month');
    expect(navBtns[1].getAttribute('aria-label')).toBe('Next month');
    const pickerBtn = el.shadowRoot!.querySelector('.month-label-btn')!;
    expect(pickerBtn.getAttribute('aria-label')).toBe('May 2026, choose month and year');
  });

  it('overrides the footer, nav, and picker-toggle labels via labels (single-month layout)', async () => {
    el.labels = {
      today: "Aujourd'hui",
      previousMonth: 'Mois précédent',
      nextMonth: 'Mois suivant',
      chooseMonthYear: (monthYear) => `${monthYear}, choisir le mois et l'année`
    };
    await el.updateComplete;
    const navBtns = el.shadowRoot!.querySelectorAll('.nav-btn');
    expect(el.shadowRoot!.querySelector('.today-btn')?.textContent?.trim()).toBe("Aujourd'hui");
    expect(navBtns[0].getAttribute('aria-label')).toBe('Mois précédent');
    expect(navBtns[1].getAttribute('aria-label')).toBe('Mois suivant');
    const pickerBtn = el.shadowRoot!.querySelector('.month-label-btn')!;
    expect(pickerBtn.getAttribute('aria-label')).toBe("May 2026, choisir le mois et l'année");
  });

  it('defaults to English previous/next year labels once the month/year picker is open', async () => {
    el.shadowRoot!.querySelector<HTMLButtonElement>('.month-label-btn')!.click();
    await el.updateComplete;
    const navBtns = el.shadowRoot!.querySelectorAll('.nav-btn');
    expect(navBtns[0].getAttribute('aria-label')).toBe('Previous year');
    expect(navBtns[1].getAttribute('aria-label')).toBe('Next year');
  });

  it('overrides previous/next year labels via labels once the picker is open', async () => {
    el.labels = { previousYear: 'Année précédente', nextYear: 'Année suivante' };
    el.shadowRoot!.querySelector<HTMLButtonElement>('.month-label-btn')!.click();
    await el.updateComplete;
    const navBtns = el.shadowRoot!.querySelectorAll('.nav-btn');
    expect(navBtns[0].getAttribute('aria-label')).toBe('Année précédente');
    expect(navBtns[1].getAttribute('aria-label')).toBe('Année suivante');
  });
});

describe('<lt-calendar months="2"> labels (i18n, X5)', () => {
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

  it('defaults the multi-month nav labels to English', () => {
    const navBtns = el.shadowRoot!.querySelectorAll('.nav-btn');
    expect(navBtns[0].getAttribute('aria-label')).toBe('Previous month');
    expect(navBtns[1].getAttribute('aria-label')).toBe('Next month');
  });

  it('overrides the multi-month nav labels via labels', async () => {
    el.labels = { previousMonth: 'Mois précédent', nextMonth: 'Mois suivant' };
    await el.updateComplete;
    const navBtns = el.shadowRoot!.querySelectorAll('.nav-btn');
    expect(navBtns[0].getAttribute('aria-label')).toBe('Mois précédent');
    expect(navBtns[1].getAttribute('aria-label')).toBe('Mois suivant');
  });
});

describe('<lt-calendar> week-start derived from locale (X5)', () => {
  let el: Calendar;

  beforeEach(async () => {
    el = document.createElement('lt-calendar') as Calendar;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  const firstWeekdayLabel = () => el.shadowRoot!.querySelectorAll('.weekday')[0]?.textContent?.trim();

  it('defaults to Sunday-start for the default locale (en-US)', () => {
    const fmt = new Intl.DateTimeFormat('en-US', { weekday: 'narrow' });
    expect(firstWeekdayLabel()).toBe(fmt.format(new Date(2026, 0, 4))); // Sunday
  });

  it('derives Monday-start from a locale whose week starts on Monday (de-DE), with no week-start set', async () => {
    el.locale = 'de-DE';
    await el.updateComplete;
    const fmt = new Intl.DateTimeFormat('en-US', { weekday: 'narrow' });
    expect(firstWeekdayLabel()).toBe(fmt.format(new Date(2026, 0, 5))); // Monday
  });

  it('derives Saturday-start from a locale whose week starts on Saturday (ar-EG)', async () => {
    el.locale = 'ar-EG';
    await el.updateComplete;
    // The weekday header itself renders in the element's own locale, not en-US — compare against that.
    const fmt = new Intl.DateTimeFormat('ar-EG', { weekday: 'narrow' });
    expect(firstWeekdayLabel()).toBe(fmt.format(new Date(2026, 0, 3))); // Saturday
  });

  it('an explicit week-start overrides the locale-derived value', async () => {
    el.locale = 'de-DE';
    el.weekStart = '0';
    await el.updateComplete;
    const fmt = new Intl.DateTimeFormat('en-US', { weekday: 'narrow' });
    expect(firstWeekdayLabel()).toBe(fmt.format(new Date(2026, 0, 4))); // Sunday, not the locale's Monday
  });

  it('falls back to en-US instead of crashing the render for a malformed locale string', async () => {
    el.value = '2026-05-19';
    el.locale = 'e-US'; // throws RangeError from Intl.DateTimeFormat's constructor — invalid primary subtag
    await expect(el.updateComplete).resolves.toBe(true);

    const weekdayFmt = new Intl.DateTimeFormat('en-US', { weekday: 'narrow' });
    expect(firstWeekdayLabel()).toBe(weekdayFmt.format(new Date(2026, 0, 4))); // Sunday, en-US's own week start

    // Covers the separate new Intl.DateTimeFormat(this.locale, ...) call sites in render() itself (month label,
    // day aria-label), not just _getWeekdayLabels() above — all five used to be unguarded.
    const monthLabel = el.shadowRoot!.querySelector('.month-label-btn')!;
    expect(monthLabel.textContent).toContain(
      new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(2026, 4))
    );
  });
});

describe('<lt-calendar> min/max-aware navigation', () => {
  let el: Calendar;

  beforeEach(async () => {
    el = document.createElement('lt-calendar') as Calendar;
    el.value = '2026-05-15';
    el.min = '2026-04-01';
    el.max = '2026-06-30';
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  const navButtons = () => el.shadowRoot!.querySelectorAll('.nav-btn') as NodeListOf<HTMLButtonElement>;

  it('enables both nav buttons when neighboring months are still in range', () => {
    const [prev, next] = navButtons();
    expect(prev.disabled).toBe(false);
    expect(next.disabled).toBe(false);
  });

  it('disables the previous-month button once the previous month is entirely before min', async () => {
    el.min = '2026-05-01'; // April is now entirely out of range
    await el.updateComplete;
    const [prev, next] = navButtons();
    expect(prev.disabled).toBe(true);
    expect(next.disabled).toBe(false);
  });

  it('disables the next-month button once the next month is entirely after max', async () => {
    el.max = '2026-05-31'; // June is now entirely out of range
    await el.updateComplete;
    const [prev, next] = navButtons();
    expect(prev.disabled).toBe(false);
    expect(next.disabled).toBe(true);
  });

  it('does not disable navigation into a month only partially out of range', async () => {
    // max falls mid-June — June still has in-range days (1st-14th), so next should stay enabled.
    el.max = '2026-06-14';
    await el.updateComplete;
    const [, next] = navButtons();
    expect(next.disabled).toBe(false);
  });

  it('re-enables navigation once the boundary no longer excludes the neighboring month', async () => {
    el.max = '2026-05-31';
    await el.updateComplete;
    expect(navButtons()[1].disabled).toBe(true);

    el.max = '2026-07-31';
    await el.updateComplete;
    expect(navButtons()[1].disabled).toBe(false);
  });

  it('guards PageDown/PageUp at the source too, not just the disabled button', async () => {
    el.max = '2026-05-31'; // June out of range
    await el.updateComplete;

    const handler = vi.fn();
    el.addEventListener('monthchange', handler);
    const cell = el.shadowRoot!.querySelector('[role="gridcell"][tabindex="0"]') as HTMLElement;
    cell.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageDown', bubbles: true }));
    await el.updateComplete;

    expect(handler).not.toHaveBeenCalled();
    const monthLabel = el.shadowRoot!.querySelector('.month-label-btn')!;
    expect(monthLabel.textContent).toContain('May');
  });

  it('allows PageDown when the next month is still navigable', async () => {
    const handler = vi.fn();
    el.addEventListener('monthchange', handler);
    const cell = el.shadowRoot!.querySelector('[role="gridcell"][tabindex="0"]') as HTMLElement;
    cell.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageDown', bubbles: true }));
    await el.updateComplete;

    expect(handler).toHaveBeenCalledOnce();
    const monthLabel = el.shadowRoot!.querySelector('.month-label-btn')!;
    expect(monthLabel.textContent).toContain('June');
  });

  it('disables the "Today" footer button when today\'s month is entirely out of range', async () => {
    const today = new Date();
    const beforeToday = new Date(today.getFullYear(), today.getMonth(), 0); // last day of the prior month
    el.min = '';
    el.max = `${beforeToday.getFullYear()}-${String(beforeToday.getMonth() + 1).padStart(2, '0')}-${String(beforeToday.getDate()).padStart(2, '0')}`;
    await el.updateComplete;

    const todayBtn = el.shadowRoot!.querySelector('.today-btn') as HTMLButtonElement;
    expect(todayBtn.disabled).toBe(true);
  });

  it('disables out-of-range months in the month/year picker grid, not just the main nav buttons', async () => {
    el.max = '2026-05-31'; // June through December out of range for 2026
    await el.updateComplete;

    const monthLabelBtn = el.shadowRoot!.querySelector('.month-label-btn') as HTMLButtonElement;
    monthLabelBtn.click();
    await el.updateComplete;

    const monthButtons = el.shadowRoot!.querySelectorAll('.picker-month-btn') as NodeListOf<HTMLButtonElement>;
    expect(monthButtons[4].disabled).toBe(false); // May (index 4)
    expect(monthButtons[5].disabled).toBe(true); // June (index 5)
  });

  it("disables the picker's own prev/next-year buttons once the whole neighboring year is out of range", async () => {
    // min is 2026-04-01 and max is now 2026-12-31 (set in beforeEach/this test) — 2025 is entirely before min,
    // 2027 is entirely after max, so from the 2026 picker both neighboring years should be unreachable.
    el.max = '2026-12-31';
    await el.updateComplete;

    const monthLabelBtn = el.shadowRoot!.querySelector('.month-label-btn') as HTMLButtonElement;
    monthLabelBtn.click();
    await el.updateComplete;

    const [prevYear, nextYear] = navButtons();
    expect(prevYear.disabled).toBe(true); // 2025, entirely before min
    expect(nextYear.disabled).toBe(true); // 2027, entirely after max
  });
});

describe('<lt-calendar months="2"> min/max-aware navigation', () => {
  let el: Calendar;

  beforeEach(async () => {
    el = document.createElement('lt-calendar') as Calendar;
    el.setAttribute('months', '2');
    el.value = '2026-05-01'; // panels show May + June
    el.min = '2026-04-01';
    el.max = '2026-07-31';
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  const navButtons = () => el.shadowRoot!.querySelectorAll('.nav-btn') as NodeListOf<HTMLButtonElement>;

  it('checks the LAST visible panel (not the first) for next-button availability', async () => {
    // Panels are May + June. max excludes July — the panel that would newly come into view going forward —
    // but May and June themselves are still fully in range, so next should stay enabled.
    const [, next] = navButtons();
    expect(next.disabled).toBe(false);
  });

  it('disables next once the panel that would scroll into view is entirely out of range', async () => {
    el.max = '2026-06-30'; // July (the incoming panel on next) is now entirely excluded
    await el.updateComplete;
    expect(navButtons()[1].disabled).toBe(true);
  });

  it('checks the FIRST visible panel (not the last) for prev-button availability', async () => {
    // Panels are May + June; min excludes everything before April. Going back one panel shows April + May —
    // April is the new first panel, and April is still in range, so prev should stay enabled.
    const [prev] = navButtons();
    expect(prev.disabled).toBe(false);
  });

  it('disables prev once the panel that would scroll into view is entirely out of range', async () => {
    el.min = '2026-05-01'; // April (the incoming panel on prev) is now entirely excluded
    await el.updateComplete;
    expect(navButtons()[0].disabled).toBe(true);
  });
});

describe('<lt-calendar> week numbers', () => {
  let el: Calendar;

  beforeEach(async () => {
    el = document.createElement('lt-calendar') as Calendar;
    el.value = '2026-05-11'; // May 2026, rendered as 6 rows of Sun-start weeks with the default locale
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('renders no week-number column by default', () => {
    expect(el.shadowRoot!.querySelectorAll('.week-number')).toHaveLength(0);
  });

  it('renders one week-number cell per row, plus one header cell, once enabled', async () => {
    el.showWeekNumbers = true;
    await el.updateComplete;

    // May 2026 renders as 6 week rows with the default (Sunday) week-start.
    const rowCells = el.shadowRoot!.querySelectorAll('[role="row"] > .week-number');
    expect(rowCells).toHaveLength(6);
    expect(el.shadowRoot!.querySelectorAll('.weekdays .week-number')).toHaveLength(1);
  });

  it('shows the correct ISO 8601 week number for each row', async () => {
    el.showWeekNumbers = true;
    await el.updateComplete;

    const numbers = [...el.shadowRoot!.querySelectorAll('[role="row"] > .week-number')].map((c) =>
      c.textContent?.trim()
    );
    // Row 0 is Sun Apr 26 - Sat May 2 2026 — 6 of those 7 days fall in ISO week 18 (only the leading Sunday is
    // still week 17), so the row reports 18, the week most of its own dates actually belong to. Rows increment
    // weekly through row 5 (Sun May 31 - Sat Jun 6, week 23).
    expect(numbers).toEqual(['18', '19', '20', '21', '22', '23']);
  });

  it("reports the week that covers most of a row's days, not just its first day — a real bug a non-Monday week-start exposes", async () => {
    // Regression test: a first version computed the row's number from its first day alone. For a Sunday-start
    // row spanning two ISO weeks (the common case, since ISO weeks are Monday-Sunday), that mislabeled the
    // *whole* row with the single leading Sunday's own (different, "stale") week number — caught via a live
    // screenshot showing Oct 15 2026 (a Thursday, unambiguously ISO week 42) rendered in a row labeled "41".
    el.value = '2026-10-15';
    el.showWeekNumbers = true;
    await el.updateComplete;

    const rows = [...el.shadowRoot!.querySelectorAll('[role="row"]')];
    const row = rows.find((r) => r.querySelector('[data-date="2026-10-15"]'))!;
    expect(row.querySelector('.week-number')!.textContent?.trim()).toBe('42');
  });

  it('still reports the same real-world week consistently when week-start changes which dates group into a row', async () => {
    el.showWeekNumbers = true;
    el.weekStart = '1'; // Monday-start — row 0 becomes Mon Apr 27 - Sun May 3, entirely within ISO week 18
    await el.updateComplete;

    const firstRowNumber = el.shadowRoot!.querySelector('[role="row"] > .week-number')!.textContent?.trim();
    expect(firstRowNumber).toBe('18'); // same week the default (Sunday-start) row 0 above also reports
  });

  it('gives each week-number cell an accessible label naming the week', async () => {
    el.showWeekNumbers = true;
    await el.updateComplete;

    const first = el.shadowRoot!.querySelector('[role="row"] > .week-number')!;
    expect(first.getAttribute('aria-label')).toBe('Week 18');
  });

  it('supports overriding the week-number labels via the labels property', async () => {
    el.showWeekNumbers = true;
    el.labels = { weekNumberHeader: 'Semaine', weekNumber: (n) => `Semaine ${n}` };
    await el.updateComplete;

    const header = el.shadowRoot!.querySelector('.weekdays .week-number')!;
    expect(header.textContent?.trim()).toBe('Semaine');
    const first = el.shadowRoot!.querySelector('[role="row"] > .week-number')!;
    expect(first.getAttribute('aria-label')).toBe('Semaine 18');
  });

  it('correctly numbers a year-boundary week as belonging to the new year (ISO 8601)', async () => {
    el.value = '2026-01-01'; // Thursday, ISO week 1 — its row starts Mon Dec 29 2025 with week-start="1"
    el.weekStart = '1';
    el.showWeekNumbers = true;
    await el.updateComplete;

    const first = el.shadowRoot!.querySelector('[role="row"] > .week-number')!;
    expect(first.textContent?.trim()).toBe('1'); // not 53 of the prior year
  });
});

describe('<lt-calendar> presets', () => {
  let el: Calendar;

  beforeEach(async () => {
    el = document.createElement('lt-calendar') as Calendar;
    el.mode = 'range';
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('renders no presets panel when the presets property is left empty', async () => {
    expect(el.shadowRoot!.querySelector('.presets')).toBeNull();
  });

  it('renders no presets panel in single mode, even if presets are set', async () => {
    el.mode = 'single';
    el.presets = [{ label: 'Last 7 days', getRange: () => [new Date(2026, 4, 1), new Date(2026, 4, 7)] }];
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector('.presets')).toBeNull();
  });

  it('renders one button per preset, labeled with its own text', async () => {
    el.presets = [
      { label: 'Last 7 days', getRange: () => [new Date(2026, 4, 1), new Date(2026, 4, 7)] },
      { label: 'This month', getRange: () => [new Date(2026, 4, 1), new Date(2026, 4, 31)] }
    ];
    await el.updateComplete;

    const buttons = el.shadowRoot!.querySelectorAll('.preset-btn');
    expect(buttons).toHaveLength(2);
    expect(buttons[0].textContent?.trim()).toBe('Last 7 days');
    expect(buttons[1].textContent?.trim()).toBe('This month');
  });

  it('clicking a preset sets valueStart/valueEnd and fires change', async () => {
    el.presets = [{ label: 'This month', getRange: () => [new Date(2026, 4, 1), new Date(2026, 4, 31)] }];
    await el.updateComplete;

    let detail: { valueStart: string; valueEnd: string } | undefined;
    el.addEventListener('change', (e) => {
      detail = (e as CustomEvent<{ valueStart: string; valueEnd: string }>).detail;
    });

    el.shadowRoot!.querySelector<HTMLButtonElement>('.preset-btn')!.click();
    await el.updateComplete;

    expect(el.valueStart).toBe('2026-05-01');
    expect(el.valueEnd).toBe('2026-05-31');
    expect(detail).toEqual({ valueStart: '2026-05-01', valueEnd: '2026-05-31' });
  });

  it('normalizes a preset range given in end-before-start order', async () => {
    el.presets = [{ label: 'Backwards', getRange: () => [new Date(2026, 4, 20), new Date(2026, 4, 10)] }];
    await el.updateComplete;

    el.shadowRoot!.querySelector<HTMLButtonElement>('.preset-btn')!.click();
    await el.updateComplete;

    expect(el.valueStart).toBe('2026-05-10');
    expect(el.valueEnd).toBe('2026-05-20');
  });

  it('navigates the view to the preset range start', async () => {
    el.value = '2026-01-01';
    el.presets = [{ label: 'This month', getRange: () => [new Date(2026, 7, 1), new Date(2026, 7, 31)] }];
    await el.updateComplete;

    el.shadowRoot!.querySelector<HTMLButtonElement>('.preset-btn')!.click();
    await el.updateComplete;

    const label = el.shadowRoot!.querySelector('.month-label-btn')!;
    expect(label.textContent?.trim()).toContain('August');
  });

  it('does nothing when a preset is clicked on a disabled calendar', async () => {
    el.disabled = true;
    el.presets = [{ label: 'This month', getRange: () => [new Date(2026, 4, 1), new Date(2026, 4, 31)] }];
    await el.updateComplete;

    const btn = el.shadowRoot!.querySelector<HTMLButtonElement>('.preset-btn')!;
    expect(btn.disabled).toBe(true);
    btn.click();
    await el.updateComplete;

    expect(el.valueStart).toBe('');
    expect(el.valueEnd).toBe('');
  });
});
