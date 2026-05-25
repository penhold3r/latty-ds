import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { DateInput } from '../date-input';
import '../date-input';
import '../../calendar/calendar';

vi.mock('@floating-ui/dom', () => ({
  computePosition: vi.fn().mockResolvedValue({ x: 100, y: 200 }),
  autoUpdate: vi.fn().mockReturnValue(vi.fn()),
  offset: vi.fn(),
  flip: vi.fn(),
  shift: vi.fn()
}));

describe('<lt-date-input>', () => {
  let el: DateInput;

  beforeEach(async () => {
    el = document.createElement('lt-date-input') as DateInput;
    document.body.appendChild(el);
    await el.updateComplete;
    // Stub Popover API — not supported in jsdom
    const dropdown = el.shadowRoot!.querySelector<HTMLElement>('.dropdown')!;
    (dropdown as any).showPopover = vi.fn();
    (dropdown as any).hidePopover = vi.fn();
  });

  afterEach(() => {
    el.remove();
    vi.clearAllMocks();
  });

  // ── Rendering ──────────────────────────────────────────────────────────────

  it('renders in shadow DOM', () => {
    expect(el.shadowRoot).toBeTruthy();
  });

  it('shows default placeholder when no value is set', () => {
    const display = el.shadowRoot!.querySelector('.display-value')!;
    expect(display.textContent?.trim()).toBe('Select a date');
  });

  it('custom placeholder renders correctly', async () => {
    el.setAttribute('placeholder', 'Pick a date');
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.display-value')!.textContent?.trim()).toBe('Pick a date');
  });

  it('shows a formatted display value when value is set', async () => {
    el.setAttribute('value', '2026-05-19');
    await el.updateComplete;
    const text = el.shadowRoot!.querySelector('.display-value')!.textContent?.trim();
    expect(text).not.toBe('');
    expect(text).not.toBe('2026-05-19');
  });

  it('format prop changes how the date is displayed', async () => {
    el.setAttribute('value', '2026-05-19');
    el.setAttribute('format', 'short');
    await el.updateComplete;
    const shortText = el.shadowRoot!.querySelector('.display-value')!.textContent?.trim();

    el.setAttribute('format', 'long');
    await el.updateComplete;
    const longText = el.shadowRoot!.querySelector('.display-value')!.textContent?.trim();

    expect(shortText).not.toBe(longText);
  });

  it('display value changes with locale', async () => {
    el.setAttribute('value', '2026-05-19');
    el.setAttribute('locale', 'en-US');
    await el.updateComplete;
    const enText = el.shadowRoot!.querySelector('.display-value')!.textContent?.trim();

    el.setAttribute('locale', 'fr-FR');
    await el.updateComplete;
    const frText = el.shadowRoot!.querySelector('.display-value')!.textContent?.trim();

    expect(enText).not.toBe(frText);
  });

  it('placeholder class applied when no value', () => {
    const display = el.shadowRoot!.querySelector('.display-value')!;
    expect(display.classList.contains('display-value--placeholder')).toBe(true);
  });

  it('placeholder class removed when value is set', async () => {
    el.setAttribute('value', '2026-05-19');
    await el.updateComplete;
    const display = el.shadowRoot!.querySelector('.display-value')!;
    expect(display.classList.contains('display-value--placeholder')).toBe(false);
  });

  // ── Label & helper text ────────────────────────────────────────────────────

  it('renders label when label attribute is set', async () => {
    el.setAttribute('label', 'Start date');
    await el.updateComplete;
    const label = el.shadowRoot!.querySelector('label')!;
    expect(label).toBeTruthy();
    expect(label.textContent?.trim()).toContain('Start date');
  });

  it('no label element when label is not set', () => {
    expect(el.shadowRoot!.querySelector('label')).toBeNull();
  });

  it('required shows asterisk indicator in label', async () => {
    el.setAttribute('label', 'Date');
    el.setAttribute('required', '');
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.required-indicator')).toBeTruthy();
  });

  it('required not present without required attribute', async () => {
    el.setAttribute('label', 'Date');
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.required-indicator')).toBeNull();
  });

  it('renders helper text when set', async () => {
    el.setAttribute('helper-text', 'Select a start date');
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.helper-text')!.textContent?.trim()).toBe('Select a start date');
  });

  it('no helper text element when not set', () => {
    expect(el.shadowRoot!.querySelector('.helper-text')).toBeNull();
  });

  // ── Dropdown ───────────────────────────────────────────────────────────────

  it('dropdown is closed by default', () => {
    expect(el.shadowRoot!.querySelector('.dropdown')).toBeTruthy();
    expect(el.shadowRoot!.querySelector('lt-calendar')).toBeNull();
  });

  it('clicking the trigger opens the dropdown with lt-calendar', async () => {
    el.shadowRoot!.querySelector<HTMLButtonElement>('.field-btn')!.click();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('lt-calendar')).toBeTruthy();
  });

  it('dropdown gets display:block inline style when opened', async () => {
    const dropdown = el.shadowRoot!.querySelector<HTMLElement>('.dropdown')!;
    expect(dropdown.style.display).toBe('');
    el.shadowRoot!.querySelector<HTMLButtonElement>('.field-btn')!.click();
    await el.updateComplete;
    await Promise.resolve();
    expect(dropdown.style.display).toBe('block');
  });

  it('closing the dropdown resets display so CSS display:none takes over', async () => {
    const dropdown = el.shadowRoot!.querySelector<HTMLElement>('.dropdown')!;
    el.shadowRoot!.querySelector<HTMLButtonElement>('.field-btn')!.click();
    await el.updateComplete;
    await Promise.resolve();
    el.shadowRoot!.querySelector('lt-calendar')!.dispatchEvent(
      new CustomEvent('change', { detail: { value: '2026-06-15' }, bubbles: true, composed: true })
    );
    await el.updateComplete;
    expect(dropdown.style.display).toBe('');
  });

  it('positions dropdown via openFloating using field-btn as reference', async () => {
    const btn = el.shadowRoot!.querySelector<HTMLButtonElement>('.field-btn')!;
    btn.click();
    await el.updateComplete;
    await Promise.resolve(); // flush openFloating's async computePosition
    const dropdown = el.shadowRoot!.querySelector<HTMLElement>('.dropdown')!;
    expect(dropdown.style.left).toBe('100px');
    expect(dropdown.style.top).toBe('200px');
  });

  it('recomputes position each time the dropdown opens', async () => {
    const { computePosition } = await import('@floating-ui/dom');
    const btn = el.shadowRoot!.querySelector<HTMLButtonElement>('.field-btn')!;

    btn.click();
    await el.updateComplete;
    await Promise.resolve();

    // Close via calendar selection
    el.shadowRoot!.querySelector('lt-calendar')!.dispatchEvent(
      new CustomEvent('change', { detail: { value: '2026-06-15' }, bubbles: true, composed: true })
    );
    await el.updateComplete;

    // Re-stub showPopover/hidePopover since a new dropdown element was re-queried
    const dropdown = el.shadowRoot!.querySelector<HTMLElement>('.dropdown')!;
    (dropdown as any).showPopover = vi.fn();
    (dropdown as any).hidePopover = vi.fn();

    btn.click();
    await el.updateComplete;
    await Promise.resolve();

    expect((computePosition as ReturnType<typeof vi.fn>).mock.calls.length).toBeGreaterThanOrEqual(2);
  });

  it('aria-expanded reflects open state', async () => {
    const btn = el.shadowRoot!.querySelector<HTMLButtonElement>('.field-btn')!;
    expect(btn.getAttribute('aria-expanded')).toBe('false');
    btn.click();
    await el.updateComplete;
    expect(btn.getAttribute('aria-expanded')).toBe('true');
  });

  it('selecting a date fires change with the ISO value', async () => {
    const spy = vi.fn();
    el.addEventListener('change', spy);
    el.shadowRoot!.querySelector<HTMLButtonElement>('.field-btn')!.click();
    await el.updateComplete;
    const cal = el.shadowRoot!.querySelector('lt-calendar')!;
    cal.dispatchEvent(new CustomEvent('change', { detail: { value: '2026-06-15' }, bubbles: true, composed: true }));
    await el.updateComplete;
    expect(spy).toHaveBeenCalledOnce();
    expect((spy.mock.calls[0][0] as CustomEvent).detail.value).toBe('2026-06-15');
  });

  it('selecting a date updates the value property', async () => {
    el.shadowRoot!.querySelector<HTMLButtonElement>('.field-btn')!.click();
    await el.updateComplete;
    el.shadowRoot!.querySelector('lt-calendar')!.dispatchEvent(
      new CustomEvent('change', { detail: { value: '2026-06-15' }, bubbles: true, composed: true })
    );
    await el.updateComplete;
    expect(el.value).toBe('2026-06-15');
  });

  it('dropdown closes after date selection', async () => {
    el.shadowRoot!.querySelector<HTMLButtonElement>('.field-btn')!.click();
    await el.updateComplete;
    el.shadowRoot!.querySelector('lt-calendar')!.dispatchEvent(
      new CustomEvent('change', { detail: { value: '2026-06-15' }, bubbles: true, composed: true })
    );
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('lt-calendar')).toBeNull();
  });

  it('Escape key on dropdown closes it', async () => {
    el.shadowRoot!.querySelector<HTMLButtonElement>('.field-btn')!.click();
    await el.updateComplete;
    el.shadowRoot!.querySelector('.dropdown')!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    );
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('lt-calendar')).toBeNull();
  });

  // ── Disabled ───────────────────────────────────────────────────────────────

  it('disabled attribute disables the trigger button', async () => {
    el.setAttribute('disabled', '');
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector<HTMLButtonElement>('.field-btn')!.disabled).toBe(true);
  });

  it('clicking disabled trigger does not open dropdown', async () => {
    el.setAttribute('disabled', '');
    await el.updateComplete;
    el.shadowRoot!.querySelector<HTMLButtonElement>('.field-btn')!.click();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('lt-calendar')).toBeNull();
  });

  // ── Reflected attributes ───────────────────────────────────────────────────

  it('variant reflects to host attribute', async () => {
    el.setAttribute('variant', 'error');
    await el.updateComplete;
    expect(el.getAttribute('variant')).toBe('error');
  });

  it('size reflects to host attribute', async () => {
    el.setAttribute('size', 'lg');
    await el.updateComplete;
    expect(el.getAttribute('size')).toBe('lg');
  });

  // ── Calendar passthrough ───────────────────────────────────────────────────

  it('passes value, min, max, locale, week-start to lt-calendar', async () => {
    el.setAttribute('value', '2026-05-19');
    el.setAttribute('min', '2026-01-01');
    el.setAttribute('max', '2026-12-31');
    el.setAttribute('locale', 'fr-FR');
    el.setAttribute('week-start', '1');
    el.shadowRoot!.querySelector<HTMLButtonElement>('.field-btn')!.click();
    await el.updateComplete;
    const cal = el.shadowRoot!.querySelector('lt-calendar')!;
    expect(cal.getAttribute('value')).toBe('2026-05-19');
    expect(cal.getAttribute('min')).toBe('2026-01-01');
    expect(cal.getAttribute('max')).toBe('2026-12-31');
    expect(cal.getAttribute('locale')).toBe('fr-FR');
    expect(cal.getAttribute('week-start')).toBe('1');
  });
});
