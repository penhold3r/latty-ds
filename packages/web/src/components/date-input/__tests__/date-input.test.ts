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

  it('Escape prevents default (so an ancestor lt-dialog does not also close)', async () => {
    el.shadowRoot!.querySelector<HTMLButtonElement>('.field-btn')!.click();
    await el.updateComplete;
    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    el.shadowRoot!.querySelector('.dropdown')!.dispatchEvent(event);
    await el.updateComplete;
    expect(event.defaultPrevented).toBe(true);
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

  it('does not forward a week-start attribute when left unset, so the nested lt-calendar derives its own from locale (X5)', async () => {
    el.setAttribute('locale', 'de-DE');
    el.shadowRoot!.querySelector<HTMLButtonElement>('.field-btn')!.click();
    await el.updateComplete;
    const cal = el.shadowRoot!.querySelector('lt-calendar')!;
    expect(cal.hasAttribute('week-start')).toBe(false);
  });

  // ── Values that aren't a plain ISO date ────────────────────────────────────

  it.each(['abc', '2026-06-15T10:00', '2026-02-31', '2026-13-01', '15/06/2026', ' 2026-06-15'])(
    'renders the placeholder instead of throwing for the value %j',
    async (value) => {
      el.value = value;
      await el.updateComplete;
      const display = el.shadowRoot!.querySelector('.display-value')!;
      expect(display.textContent?.trim()).toBe('Select a date');
      expect(display.classList.contains('display-value--placeholder')).toBe(true);
    }
  );

  it('still formats a valid date', async () => {
    el.value = '2026-06-15';
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.display-value')!.textContent).toContain('2026');
  });

  it('falls back to the default locale when the locale is not valid BCP 47', async () => {
    el.value = '2026-06-15';
    el.locale = 'not a locale!';
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.display-value')!.textContent).toContain('2026');
  });

  it('re-renders when disabledDates changes, because it is a reactive property', async () => {
    const before = el.disabledDates;
    el.disabledDates = [new Date(2026, 5, 15)];
    await el.updateComplete;
    expect(el.disabledDates).not.toBe(before);
    expect(el.hasAttribute('disableddates')).toBe(false);
  });

  describe('value is not reflected, and formResetCallback restores the markup default (TFD-1)', () => {
    it('does not reflect value as an attribute', async () => {
      el.value = '2026-05-19';
      await el.updateComplete;
      expect(el.hasAttribute('value')).toBe(false);
    });

    // jsdom doesn't implement the form-associated custom element reset lifecycle (form.reset() never calls
    // formResetCallback), so this calls it directly — the same thing a real form reset does per the HTML spec.
    it('restores the value set in markup, not empty', async () => {
      const fresh = document.createElement('lt-date-input') as DateInput;
      fresh.setAttribute('value', '2026-05-19');
      document.body.appendChild(fresh);
      await fresh.updateComplete;

      fresh.value = '2026-06-01';
      await fresh.updateComplete;
      fresh.formResetCallback();
      expect(fresh.value).toBe('2026-05-19');
      fresh.remove();
    });
  });

  describe('formDisabledCallback (a disabled ancestor <fieldset>, X1)', () => {
    it('disables the trigger button without touching the disabled property/attribute', async () => {
      el.formDisabledCallback(true);
      // FormDisabledController defers its requestUpdate() to a microtask (so it's never reentrant with an
      // update already in flight — see the controller's own doc comment), so this needs an extra tick before
      // updateComplete reflects it.
      await Promise.resolve();
      await el.updateComplete;
      const btn = el.shadowRoot!.querySelector('#field-btn') as HTMLButtonElement;
      expect(btn.disabled).toBe(true);
      expect(el.disabled).toBe(false);
      expect(el.hasAttribute('disabled')).toBe(false);
    });

    it('re-enables once the fieldset is enabled again', async () => {
      el.formDisabledCallback(true);
      await el.updateComplete;
      el.formDisabledCallback(false);
      await el.updateComplete;
      const btn = el.shadowRoot!.querySelector('#field-btn') as HTMLButtonElement;
      expect(btn.disabled).toBe(false);
    });

    it('does not re-enable if it was also explicitly disabled', async () => {
      el.disabled = true;
      el.formDisabledCallback(true);
      await el.updateComplete;
      el.formDisabledCallback(false);
      await el.updateComplete;
      const btn = el.shadowRoot!.querySelector('#field-btn') as HTMLButtonElement;
      expect(btn.disabled).toBe(true);
    });

    it('stops the dropdown from opening while fieldset-disabled', async () => {
      el.formDisabledCallback(true);
      await el.updateComplete;
      el.shadowRoot!.querySelector<HTMLElement>('#field-btn')!.click();
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('lt-calendar')).toBeNull();
    });
  });

  describe('labels (i18n, X5)', () => {
    it('defaults the calendar popover aria-label to English', () => {
      expect(el.shadowRoot!.querySelector('.dropdown')?.getAttribute('aria-label')).toBe('Date picker');
    });

    it('overrides the calendar popover aria-label via labels', async () => {
      el.labels = { datePicker: 'Sélecteur de date' };
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.dropdown')?.getAttribute('aria-label')).toBe('Sélecteur de date');
    });

    // jsdom's ElementInternals.setValidity is a stubbed no-op (see vitest.setup.ts), so these spy on the call our
    // component makes rather than reading back a real validationMessage.
    it('defaults the required-field validation message to English', async () => {
      const spy = vi.spyOn(ElementInternals.prototype, 'setValidity');
      el.required = true;
      await el.updateComplete;
      expect(spy.mock.lastCall?.[1]).toBe('Please select a date');
    });

    it('overrides the required-field validation message via labels', async () => {
      const spy = vi.spyOn(ElementInternals.prototype, 'setValidity');
      el.labels = { validationMessage: 'Veuillez sélectionner une date' };
      el.required = true;
      await el.updateComplete;
      expect(spy.mock.lastCall?.[1]).toBe('Veuillez sélectionner une date');
    });
  });

  describe('dev-mode warnings', () => {
    it('warns when value is not a plain YYYY-MM-DD date', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const el = document.createElement('lt-date-input') as DateInput;
      el.value = '2026-06-15T10:00';
      document.body.appendChild(el);
      await el.updateComplete;
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('[lt-date-input]'));
      warn.mockRestore();
      el.remove();
    });

    it('does not warn for a valid ISO date', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const el = document.createElement('lt-date-input') as DateInput;
      el.value = '2026-06-15';
      document.body.appendChild(el);
      await el.updateComplete;
      expect(warn).not.toHaveBeenCalled();
      warn.mockRestore();
      el.remove();
    });
  });
});

describe('helper text is described by its control (aria-describedby)', () => {
  let el: DateInput;

  beforeEach(async () => {
    el = document.createElement('lt-date-input') as DateInput;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('points the control at the rendered helper text', async () => {
    el.helperText = 'Pick one';
    await el.updateComplete;
    const control = el.shadowRoot!.querySelector('#field-btn')!;
    const helper = el.shadowRoot!.querySelector('.helper-text')!;
    expect(control.getAttribute('aria-describedby')).toBe(helper.id);
    expect(helper.textContent!.trim()).toBe('Pick one');
  });

  it('omits aria-describedby when there is no helper text', () => {
    const control = el.shadowRoot!.querySelector('#field-btn')!;
    expect(control.hasAttribute('aria-describedby')).toBe(false);
  });
});
